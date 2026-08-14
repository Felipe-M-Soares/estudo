import { useCallback, useEffect, useRef, useState } from "react";

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

const STORAGE_KEY = "codemage:profile";

function loadFromStorage(): CloudProfile {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch {
    return DEFAULT_PROFILE;
  }
}

function saveToStorage(profile: CloudProfile) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Armazenamento indisponível (modo privado, quota etc.) — sem erro fatal,
    // o app só deixa de persistir entre sessões.
  }
}

/**
 * Perfil de estudo (progresso, moedas, personagem) guardado localmente no
 * navegador (localStorage). App de uso pessoal, sem login/conta — tudo fica
 * neste dispositivo.
 */
export function useProfile() {
  const [profile, setProfile] = useState<CloudProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const hydrated = useRef(false);

  useEffect(() => {
    setProfile(loadFromStorage());
    setLoading(false);
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    saveToStorage(profile);
  }, [profile]);

  /** Marca uma aula como concluída (idempotente). */
  const markLessonComplete = useCallback((key: string) => {
    setProfile((prev) => ({ ...prev, completedLessons: { ...prev.completedLessons, [key]: true } }));
  }, []);

  /** Credita moedas ganhas em jogos (arcade/laboratório). */
  const claimReward = useCallback(async (amount: number, _source: string): Promise<{ coins?: number; error?: CloudActionError }> => {
    let nextCoins = 0;
    setProfile((prev) => {
      nextCoins = prev.coins + amount;
      return { ...prev, coins: nextCoins };
    });
    return { coins: nextCoins };
  }, []);

  /** Compra um personagem. */
  const buyCharacter = useCallback(async (characterId: string, localPrice: number): Promise<{ error?: CloudActionError }> => {
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
  }, []);

  /** Equipa um personagem já possuído. */
  const equipCharacter = useCallback(async (characterId: string): Promise<{ error?: CloudActionError }> => {
    setProfile((prev) => ({ ...prev, equippedCharacterId: characterId }));
    return {};
  }, []);

  /** Salva o progresso fino de um módulo (respostas de exercício, checklist, rascunho do projeto). */
  const saveModuleProgress = useCallback((moduleId: string, progress: unknown) => {
    setProfile((prev) => ({ ...prev, lessonProgress: { ...prev.lessonProgress, [moduleId]: progress } }));
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(DEFAULT_PROFILE);
  }, []);

  return {
    profile,
    loading,
    markLessonComplete,
    claimReward,
    buyCharacter,
    equipCharacter,
    saveModuleProgress,
    resetProfile,
  };
}
