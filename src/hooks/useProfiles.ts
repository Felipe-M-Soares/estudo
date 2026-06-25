import { useCallback, useEffect, useState } from 'react';
import type { Profile, ProfilesState } from '../data/profileTypes';
import { hashPin, verifyPin, legacyHashPin } from '../utils/pin';

const PROFILES_KEY = 'devjourney:profiles:v1';

const AVATAR_EMOJIS = ['🧑‍💻', '👩‍💻', '🦊', '🐱', '🐼', '🦉', '🐢', '🦁', '🐧', '🤖'];

function loadState(): ProfilesState {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (!raw) return { profiles: [], activeProfileId: null };
    const parsed = JSON.parse(raw);
    // Migração: perfis criados antes do salt por perfil existir têm pinSalt undefined/null
    // mas pinHash preenchido — eles continuam funcionando via legacyHashPin até o usuário
    // trocar o PIN (o que já gera um salt novo).
    return parsed;
  } catch {
    return { profiles: [], activeProfileId: null };
  }
}

function saveState(state: ProfilesState) {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(state));
  } catch {
    // armazenamento indisponível — falha silenciosamente
  }
}

export function progressStorageKey(profileId: string): string {
  return `devjourney:progress:v1:${profileId}`;
}

export interface CreateProfileResult {
  success: boolean;
  error?: string;
}

export function useProfiles() {
  const [state, setState] = useState<ProfilesState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeProfile = state.profiles.find((p) => p.id === state.activeProfileId) ?? null;

  const createProfile = useCallback(
    async (name: string, pin: string, avatarEmoji?: string): Promise<CreateProfileResult> => {
      const trimmed = name.trim();
      if (trimmed.length < 2) {
        return { success: false, error: 'O nome precisa ter pelo menos 2 letras.' };
      }
      const exists = state.profiles.some((p) => p.name.toLowerCase() === trimmed.toLowerCase());
      if (exists) {
        return { success: false, error: 'Já existe um perfil com esse nome.' };
      }
      let pinHash: string | null = null;
      let pinSalt: string | null = null;
      if (pin.trim()) {
        const result = await hashPin(pin.trim());
        pinHash = result.hash;
        pinSalt = result.salt;
      }
      const newProfile: Profile = {
        id: `profile-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: trimmed,
        pinHash,
        pinSalt,
        avatarEmoji: avatarEmoji ?? AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)],
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({
        profiles: [...prev.profiles, newProfile],
        activeProfileId: newProfile.id,
      }));
      return { success: true };
    },
    [state.profiles]
  );

  const switchToProfile = useCallback(
    async (profileId: string, pin: string): Promise<CreateProfileResult> => {
      const profile = state.profiles.find((p) => p.id === profileId);
      if (!profile) return { success: false, error: 'Perfil não encontrado.' };

      if (profile.pinHash) {
        if (!pin.trim()) return { success: false, error: 'Esse perfil tem PIN. Digite o PIN para entrar.' };

        let ok = false;
        if (profile.pinSalt) {
          ok = await verifyPin(pin.trim(), { hash: profile.pinHash, salt: profile.pinSalt });
        } else {
          // Perfil criado antes da migração de salt — verifica com o esquema legado
          // e, se corresponder, migra silenciosamente para o novo esquema com salt.
          const legacy = await legacyHashPin(pin.trim());
          ok = legacy === profile.pinHash;
          if (ok) {
            const migrated = await hashPin(pin.trim());
            setState((prev) => ({
              ...prev,
              profiles: prev.profiles.map((p) =>
                p.id === profileId ? { ...p, pinHash: migrated.hash, pinSalt: migrated.salt } : p
              ),
            }));
          }
        }
        if (!ok) return { success: false, error: 'PIN incorreto.' };
      }

      setState((prev) => ({ ...prev, activeProfileId: profileId }));
      return { success: true };
    },
    [state.profiles]
  );

  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, activeProfileId: null }));
  }, []);

  const deleteProfile = useCallback((profileId: string) => {
    try {
      localStorage.removeItem(progressStorageKey(profileId));
    } catch {
      // ignora falha de remoção
    }
    setState((prev) => ({
      profiles: prev.profiles.filter((p) => p.id !== profileId),
      activeProfileId: prev.activeProfileId === profileId ? null : prev.activeProfileId,
    }));
  }, []);

  const renameProfile = useCallback((profileId: string, newName: string) => {
    const trimmed = newName.trim();
    if (trimmed.length < 2) return;
    setState((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) => (p.id === profileId ? { ...p, name: trimmed } : p)),
    }));
  }, []);

  return {
    profiles: state.profiles,
    activeProfile,
    createProfile,
    switchToProfile,
    logout,
    deleteProfile,
    renameProfile,
    avatarOptions: AVATAR_EMOJIS,
  };
}
