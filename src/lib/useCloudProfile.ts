import { useCallback, useEffect, useRef, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

export interface CloudProfile {
  displayName: string;
  coins: number;
  equippedCharacterId: string;
  ownedCharacters: string[];
  completedLessons: Record<string, boolean>;
}

const DEFAULT_PROFILE: CloudProfile = {
  displayName: "Aventureiro(a)",
  coins: 600,
  equippedCharacterId: "char-01",
  ownedCharacters: ["char-01"],
  completedLessons: {},
};

/**
 * Carrega o perfil de jogo do usuário do Supabase (tabela "profiles") e mantém
 * tudo sincronizado: qualquer mudança local (moedas, personagem, aulas
 * concluídas) é salva na nuvem automaticamente (com pequeno debounce).
 *
 * Se o Supabase não estiver configurado (.env vazio), cai para um perfil
 * local em memória — o app continua funcionando, só não persiste entre
 * sessões (mesmo comportamento de antes).
 */
export function useCloudProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<CloudProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(Boolean(userId) && isSupabaseConfigured);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
        .select("display_name, coins, equipped_character, owned_characters, completed_lessons")
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

      loadedForUser.current = userId;
      setProfile({
        displayName: data.display_name ?? DEFAULT_PROFILE.displayName,
        coins: data.coins ?? DEFAULT_PROFILE.coins,
        equippedCharacterId: data.equipped_character ?? DEFAULT_PROFILE.equippedCharacterId,
        ownedCharacters: data.owned_characters ?? DEFAULT_PROFILE.ownedCharacters,
        completedLessons: (data.completed_lessons as Record<string, boolean>) ?? {},
      });
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const persist = useCallback(
    (next: CloudProfile) => {
      if (!userId || !isSupabaseConfigured) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        const { error } = await supabase
          .from("profiles")
          .update({
            coins: next.coins,
            equipped_character: next.equippedCharacterId,
            owned_characters: next.ownedCharacters,
            completed_lessons: next.completedLessons,
          })
          .eq("id", userId);
        if (error) console.error("[Code Mage] Erro ao salvar perfil:", error.message);
      }, 600);
    },
    [userId]
  );

  const update = useCallback(
    (updater: (prev: CloudProfile) => CloudProfile) => {
      setProfile((prev) => {
        const next = updater(prev);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const setCoins = useCallback((updater: (prev: number) => number) => update((prev) => ({ ...prev, coins: updater(prev.coins) })), [update]);
  const setEquippedCharacterId = useCallback((id: string) => update((prev) => ({ ...prev, equippedCharacterId: id })), [update]);
  const setOwnedCharacters = useCallback((updater: (prev: string[]) => string[]) => update((prev) => ({ ...prev, ownedCharacters: updater(prev.ownedCharacters) })), [update]);
  const markLessonComplete = useCallback(
    (key: string) => update((prev) => ({ ...prev, completedLessons: { ...prev.completedLessons, [key]: true } })),
    [update]
  );

  return {
    profile,
    loading,
    setCoins,
    setEquippedCharacterId,
    setOwnedCharacters,
    markLessonComplete,
    cloudEnabled: isSupabaseConfigured,
  };
}
