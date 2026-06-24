import { useCallback, useEffect, useMemo, useState } from 'react';
import type { UserProgress } from '../data/types';
import { achievements, XP_PER_CHECKLIST, XP_PER_EXERCISE, XP_PER_GAME_PLAY } from '../data/achievements';
import { modules } from '../data';

const STORAGE_KEY = 'devjourney:progress:v1';

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

function defaultProgress(): UserProgress {
  return {
    xp: 0,
    level: 1,
    streakDays: 0,
    lastActiveDate: null,
    activeDates: [],
    completedChecklist: {},
    completedExercises: {},
    exerciseAttempts: {},
    gamesScores: {},
    unlockedAchievements: [],
    moduleProgress: {},
    currentModuleId: 'mes-01',
    notes: {},
  };
}

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    return { ...defaultProgress(), ...parsed };
  } catch {
    return defaultProgress();
  }
}

function saveProgress(p: UserProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // armazenamento indisponível (modo privado etc.) — falha silenciosamente
  }
}

export interface XpGainEvent {
  amount: number;
  reason: string;
  key: number;
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());
  const [lastXpGain, setLastXpGain] = useState<XpGainEvent | null>(null);
  const [newAchievement, setNewAchievement] = useState<string | null>(null);

  // Atualiza streak na primeira carga do dia
  useEffect(() => {
    setProgress((prev) => {
      const today = todayIso();
      if (prev.lastActiveDate === today) return prev;

      let streakDays = prev.streakDays;
      if (prev.lastActiveDate) {
        const diff = daysBetween(prev.lastActiveDate, today);
        if (diff === 1) {
          streakDays += 1;
        } else if (diff > 1) {
          streakDays = 1;
        }
        // diff === 0 não deveria ocorrer aqui pois já checamos igualdade acima
      } else {
        streakDays = 1;
      }

      const activeDates = prev.activeDates.includes(today)
        ? prev.activeDates
        : [...prev.activeDates, today].slice(-365);

      return { ...prev, streakDays, lastActiveDate: today, activeDates };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const checkAchievements = useCallback((p: UserProgress): UserProgress => {
    const newly: string[] = [];
    for (const a of achievements) {
      if (!p.unlockedAchievements.includes(a.id) && a.check(p)) {
        newly.push(a.id);
      }
    }
    if (newly.length === 0) return p;
    setNewAchievement(newly[0]);
    return { ...p, unlockedAchievements: [...p.unlockedAchievements, ...newly] };
  }, []);

  const addXp = useCallback((amount: number, reason: string) => {
    setLastXpGain({ amount, reason, key: Date.now() });
    setProgress((prev) => {
      const xp = prev.xp + amount;
      const level = Math.floor(xp / 250) + 1;
      const next = { ...prev, xp, level };
      return checkAchievements(next);
    });
  }, [checkAchievements]);

  const recomputeModuleProgress = useCallback((p: UserProgress, moduleId: string): UserProgress => {
    const mod = modules.find((m) => m.id === moduleId);
    if (!mod) return p;
    const totalItems = mod.checklist.length + mod.exercises.length;
    if (totalItems === 0) return p;
    const doneChecklist = mod.checklist.filter((c) => p.completedChecklist[c.id]).length;
    const doneExercises = mod.exercises.filter((e) => p.completedExercises[e.id]).length;
    const pct = Math.round(((doneChecklist + doneExercises) / totalItems) * 100);
    return { ...p, moduleProgress: { ...p.moduleProgress, [moduleId]: pct } };
  }, []);

  const toggleChecklistItem = useCallback((moduleId: string, itemId: string) => {
    setProgress((prev) => {
      const wasDone = !!prev.completedChecklist[itemId];
      const completedChecklist = { ...prev.completedChecklist, [itemId]: !wasDone };
      let next = { ...prev, completedChecklist };
      next = recomputeModuleProgress(next, moduleId);
      if (!wasDone) {
        next.xp += XP_PER_CHECKLIST;
        next.level = Math.floor(next.xp / 250) + 1;
        setLastXpGain({ amount: XP_PER_CHECKLIST, reason: 'Item concluído', key: Date.now() });
      }
      return checkAchievements(next);
    });
  }, [recomputeModuleProgress, checkAchievements]);

  const markExerciseResult = useCallback((moduleId: string, exerciseId: string, correct: boolean) => {
    setProgress((prev) => {
      const attempts = (prev.exerciseAttempts[exerciseId] ?? 0) + 1;
      const exerciseAttempts = { ...prev.exerciseAttempts, [exerciseId]: attempts };
      const alreadyCompleted = !!prev.completedExercises[exerciseId];
      const completedExercises = correct
        ? { ...prev.completedExercises, [exerciseId]: true }
        : prev.completedExercises;

      let next = { ...prev, exerciseAttempts, completedExercises };
      next = recomputeModuleProgress(next, moduleId);

      if (correct && !alreadyCompleted) {
        next.xp += XP_PER_EXERCISE;
        next.level = Math.floor(next.xp / 250) + 1;
        setLastXpGain({ amount: XP_PER_EXERCISE, reason: 'Exercício correto', key: Date.now() });
      }
      return checkAchievements(next);
    });
  }, [recomputeModuleProgress, checkAchievements]);

  const recordGameScore = useCallback((gameId: string, score: number) => {
    setProgress((prev) => {
      const best = prev.gamesScores[gameId] ?? 0;
      const gamesScores = { ...prev.gamesScores, [gameId]: Math.max(best, score) };
      let next = { ...prev, gamesScores };
      next.xp += XP_PER_GAME_PLAY;
      next.level = Math.floor(next.xp / 250) + 1;
      setLastXpGain({ amount: XP_PER_GAME_PLAY, reason: 'Mini-jogo concluído', key: Date.now() });
      return checkAchievements(next);
    });
  }, [checkAchievements]);

  const setCurrentModule = useCallback((moduleId: string) => {
    setProgress((prev) => ({ ...prev, currentModuleId: moduleId }));
  }, []);

  const setNote = useCallback((moduleId: string, text: string) => {
    setProgress((prev) => ({ ...prev, notes: { ...prev.notes, [moduleId]: text } }));
  }, []);

  const resetProgress = useCallback(() => {
    const fresh = defaultProgress();
    setProgress(fresh);
    saveProgress(fresh);
  }, []);

  const overallPercent = useMemo(() => {
    const total = modules.length * 100;
    const sum = modules.reduce((acc, m) => acc + (progress.moduleProgress[m.id] ?? 0), 0);
    return total === 0 ? 0 : Math.round((sum / total) * 100);
  }, [progress.moduleProgress]);

  return {
    progress,
    addXp,
    toggleChecklistItem,
    markExerciseResult,
    recordGameScore,
    setCurrentModule,
    setNote,
    resetProgress,
    overallPercent,
    lastXpGain,
    newAchievement,
    clearNewAchievement: () => setNewAchievement(null),
  };
}
