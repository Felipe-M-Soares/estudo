import { useCallback, useEffect, useState } from 'react';

const SETTINGS_KEY = 'devjourney:settings:v1';

export interface AppSettings {
  deepseekApiKey: string;
  reducedMotion: boolean;
}

function defaultSettings(): AppSettings {
  return { deepseekApiKey: '', reducedMotion: false };
}

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings();
    return { ...defaultSettings(), ...JSON.parse(raw) };
  } catch {
    return defaultSettings();
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // ignora falha de armazenamento
    }
  }, [settings]);

  const setApiKey = useCallback((key: string) => {
    setSettings((prev) => ({ ...prev, deepseekApiKey: key }));
  }, []);

  const clearApiKey = useCallback(() => {
    setSettings((prev) => ({ ...prev, deepseekApiKey: '' }));
  }, []);

  return { settings, setApiKey, clearApiKey };
}
