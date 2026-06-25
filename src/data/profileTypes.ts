export interface Profile {
  id: string;
  name: string;
  pinHash: string | null; // null = sem PIN
  pinSalt: string | null; // null = sem PIN, ou perfil antigo (legado) ainda sem salt
  avatarEmoji: string;
  createdAt: string;
}

export interface ProfilesState {
  profiles: Profile[];
  activeProfileId: string | null;
}
