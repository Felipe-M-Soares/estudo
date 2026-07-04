import { useEffect, useMemo, useState } from 'react';

export type DesignThemeId = 'arcade' | 'royal' | 'forest';

export const designThemes: Record<DesignThemeId, { name: string; tagline: string; preview: string; accent: string }> = {
  arcade: {
    name: 'Arcade Neon',
    tagline: 'Visual gamer, energia alta e contraste forte.',
    preview: 'from-mint-400 via-cyan-400 to-amber-400',
    accent: 'text-mint-300',
  },
  royal: {
    name: 'Royal Cyber',
    tagline: 'Mais premium, roxo profundo e detalhes dourados.',
    preview: 'from-violet-400 via-fuchsia-400 to-amber-300',
    accent: 'text-violet-300',
  },
  forest: {
    name: 'Focus Quest',
    tagline: 'Mais confortável para leitura longa, verde e azul.',
    preview: 'from-emerald-300 via-teal-300 to-sky-300',
    accent: 'text-cyan-300',
  },
};

const STORAGE_KEY = 'devjourney.designTheme';

function readInitialTheme(): DesignThemeId {
  if (typeof window === 'undefined') return 'arcade';
  const saved = window.localStorage.getItem(STORAGE_KEY) as DesignThemeId | null;
  return saved && saved in designThemes ? saved : 'arcade';
}

export function useDesignTheme() {
  const [theme, setThemeState] = useState<DesignThemeId>(readInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const current = useMemo(() => designThemes[theme], [theme]);

  return { theme, current, setTheme: setThemeState, themes: designThemes };
}
