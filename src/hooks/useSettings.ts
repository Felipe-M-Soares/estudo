import { useCallback, useEffect, useState } from 'react';

const SETTINGS_KEY = 'devjourney:settings:v1';

export interface AppSettings {
  geminiApiKey: string;
  reducedMotion: boolean;
}

function defaultSettings(): AppSettings {
  return { geminiApiKey: '', reducedMotion: false };
}

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings();
    const parsed = JSON.parse(raw);
    // Migração: versões anteriores guardavam a chave da DeepSeek em
    // "deepseekApiKey". Como o provedor mudou para Gemini, essa chave antiga
    // não é mais válida para a nova API — não a reaproveitamos, só limpamos
    // o campo legado para não deixar lixo no localStorage.
    if ('deepseekApiKey' in parsed) {
      delete parsed.deepseekApiKey;
    }
    return { ...defaultSettings(), ...parsed };
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
    setSettings((prev) => ({ ...prev, geminiApiKey: key }));
  }, []);

  const clearApiKey = useCallback(() => {
    setSettings((prev) => ({ ...prev, geminiApiKey: '' }));
  }, []);

  return { settings, setApiKey, clearApiKey };
}
