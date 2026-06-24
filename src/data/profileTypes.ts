export interface Profile {
  id: string;
  name: string;
  pinHash: string | null; // null = sem PIN
  avatarEmoji: string;
  createdAt: string;
}

export interface ProfilesState {
  profiles: Profile[];
  activeProfileId: string | null;
}
