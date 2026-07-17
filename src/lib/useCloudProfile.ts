import { useCallback, useEffect, useRef, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

export interface CloudProfile {
  displayName: string;
  coins: number;
  equippedCharacterId: string;
  ownedCharacters: string[];
  completedLessons: Record<string, boolean>;
  lessonProgress: Record<string, unknown>;
}

export interface CloudActionError {
  code: string;
  message: string;
}

const DEFAULT_PROFILE: CloudProfile = {
  displayName: "Aventureiro(a)",
  coins: 600,
  equippedCharacterId: "char-01",
  ownedCharacters: ["char-01"],
  completedLessons: {},
  lessonProgress: {},
};

function parseRpcError(error: { message?: string } | null): CloudActionError | null {
  if (!error) return null;
  const code = (error.message ?? "unknown_error").trim();
  const friendly: Record<string, string> = {
    insufficient_coins: "Moedas insuficientes para essa compra.",
    already_owned: "Você já possui esse personagem.",
    not_owned: "Você ainda não possui esse personagem.",
    unknown_character: "Personagem inválido.",
    invalid_amount: "Recompensa inválida.",
    not_authenticated: "Sessão expirada. Faça login novamente.",
    invalid_lesson_key: "Aula inválida.",
  };
  return { code, message: friendly[code] ?? "Não foi possível completar a ação. Tente novamente." };
}

/**
 * Carrega o perfil de jogo do usuário do Supabase (tabela "profiles") e mantém
 * tudo sincronizado. Diferente de antes, moedas/personagens/aulas concluídas
 * NUNCA são escritas direto na tabela pelo navegador — toda mudança passa por
 * uma função (RPC) no banco que valida preço, saldo e posse no servidor (veja
 * supabase/schema.sql). Isso impede que alguém edite esses valores direto
 * pelo console do navegador.
 *
 * Se o Supabase não estiver configurado (.env vazio), cai para um perfil
 * local em memória — o app continua funcionando, só não persiste entre
 * sessões nem valida nada (não tem "servidor" pra validar em modo demo).
 */
export function useCloudProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<CloudProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(Boolean(userId) && isSupabaseConfigured);
  const loadedForUser = useRef<string | null>(null);

  useEffect(() => {
    if (!userId || !isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    async function load(retry = 0): Promise<void> {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, coins, equipped_character, owned_characters, completed_lessons, lesson_progress")
        .eq("id", userId)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("[Code Mage] Erro ao carregar perfil:", error.message);
        setLoading(false);
        return;
      }

      if (!data) {
        // O trigger on_auth_user_created ainda não rodou (raríssimo, mas pode
        // acontecer por replicação). Tenta de novo em meio segundo, até 4x.
        if (retry < 4) {
          setTimeout(() => load(retry + 1), 500);
          return;
        }
        setLoading(false);
        return;
      }

      loadedForUser.current = userId ?? null;
      setProfile({
        displayName: data.display_name ?? DEFAULT_PROFILE.displayName,
        coins: data.coins ?? DEFAULT_PROFILE.coins,
        equippedCharacterId: data.equipped_character ?? DEFAULT_PROFILE.equippedCharacterId,
        ownedCharacters: data.owned_characters ?? DEFAULT_PROFILE.ownedCharacters,
        completedLessons: (data.completed_lessons as Record<string, boolean>) ?? {},
        lessonProgress: (data.lesson_progress as Record<string, unknown>) ?? {},
      });
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  /** Marca uma aula como concluída (idempotente). */
  const markLessonComplete = useCallback(
    (key: string) => {
      setProfile((prev) => ({ ...prev, completedLessons: { ...prev.completedLessons, [key]: true } }));
      if (!userId || !isSupabaseConfigured) return;
      supabase.rpc("mark_lesson_complete", { p_lesson_key: key }).then(({ error }) => {
        if (error) console.error("[Code Mage] Erro ao marcar aula concluída:", error.message);
      });
    },
    [userId]
  );

  /**
   * Credita moedas ganhas em jogos (arcade/laboratório). Em modo nuvem, o
   * valor final é o que o servidor devolve (ele pode limitar/zerar se o
   * teto diário anti-farm já tiver sido atingido).
   */
  const claimReward = useCallback(
    async (amount: number, source: string): Promise<{ coins?: number; error?: CloudActionError }> => {
      if (!userId || !isSupabaseConfigured) {
        let nextCoins = 0;
        setProfile((prev) => {
          nextCoins = prev.coins + amount;
          return { ...prev, coins: nextCoins };
        });
        return { coins: nextCoins };
      }
      const { data, error } = await supabase.rpc("claim_reward", { p_amount: amount, p_source: source });
      const parsed = parseRpcError(error);
      if (parsed) return { error: parsed };
      const newCoins = data as number;
      setProfile((prev) => ({ ...prev, coins: newCoins }));
      return { coins: newCoins };
    },
    [userId]
  );

  /** Compra um personagem: preço e saldo são validados no servidor. */
  const buyCharacter = useCallback(
    async (characterId: string, localPrice: number): Promise<{ error?: CloudActionError }> => {
      if (!userId || !isSupabaseConfigured) {
        let error: CloudActionError | undefined;
        setProfile((prev) => {
          if (prev.ownedCharacters.includes(characterId)) {
            error = { code: "already_owned", message: "Você já possui esse personagem." };
            return prev;
          }
          if (prev.coins < localPrice) {
            error = { code: "insufficient_coins", message: "Moedas insuficientes para essa compra." };
            return prev;
          }
          return {
            ...prev,
            coins: prev.coins - localPrice,
            ownedCharacters: [...prev.ownedCharacters, characterId],
            equippedCharacterId: characterId,
          };
        });
        return error ? { error } : {};
      }
      const { data, error } = await supabase.rpc("buy_character", { p_character_id: characterId });
      const parsed = parseRpcError(error);
      if (parsed) return { error: parsed };
      setProfile((prev) => ({
        ...prev,
        coins: data.coins,
        ownedCharacters: data.owned_characters,
        equippedCharacterId: data.equipped_character,
      }));
      return {};
    },
    [userId]
  );

  /** Equipa um personagem já possuído (verificado no servidor). */
  const equipCharacter = useCallback(
    async (characterId: string): Promise<{ error?: CloudActionError }> => {
      if (!userId || !isSupabaseConfigured) {
        setProfile((prev) => ({ ...prev, equippedCharacterId: characterId }));
        return {};
      }
      const { error } = await supabase.rpc("equip_character", { p_character_id: characterId });
      const parsed = parseRpcError(error);
      if (parsed) return { error: parsed };
      setProfile((prev) => ({ ...prev, equippedCharacterId: characterId }));
      return {};
    },
    [userId]
  );

  /**
   * Salva o progresso fino de um módulo (respostas de exercício, checklist,
   * rascunho do projeto) com um pequeno debounce, pra não disparar uma
   * chamada de rede a cada tecla digitada.
   */
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveModuleProgress = useCallback(
    (moduleId: string, progress: unknown) => {
      setProfile((prev) => ({ ...prev, lessonProgress: { ...prev.lessonProgress, [moduleId]: progress } }));
      if (!userId || !isSupabaseConfigured) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        supabase.rpc("save_module_progress", { p_module_id: moduleId, p_progress: progress }).then(({ error }) => {
          if (error) console.error("[Code Mage] Erro ao salvar progresso do módulo:", error.message);
        });
      }, 800);
    },
    [userId]
  );

  return {
    profile,
    loading,
    markLessonComplete,
    claimReward,
    buyCharacter,
    equipCharacter,
    saveModuleProgress,
    cloudEnabled: isSupabaseConfigured,
  };
}
