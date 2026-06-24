import type { Achievement } from './types';

export const achievements: Achievement[] = [
  {
    id: 'primeiro-passo',
    title: 'Primeiro Passo',
    description: 'Complete seu primeiro item de checklist.',
    emoji: '👟',
    check: (p) => Object.values(p.completedChecklist).some(Boolean),
  },
  {
    id: 'primeiro-exercicio',
    title: 'Mão na Massa',
    description: 'Acerte seu primeiro exercício.',
    emoji: '✍️',
    check: (p) => Object.values(p.completedExercises).some(Boolean),
  },
  {
    id: 'streak-3',
    title: 'Pegando Ritmo',
    description: 'Mantenha uma sequência de 3 dias estudando.',
    emoji: '🔥',
    check: (p) => p.streakDays >= 3,
  },
  {
    id: 'streak-7',
    title: 'Uma Semana de Fogo',
    description: 'Mantenha uma sequência de 7 dias estudando.',
    emoji: '🔥',
    check: (p) => p.streakDays >= 7,
  },
  {
    id: 'streak-30',
    title: 'Inabalável',
    description: 'Mantenha uma sequência de 30 dias estudando.',
    emoji: '🏔️',
    check: (p) => p.streakDays >= 30,
  },
  {
    id: 'fase-1-completa',
    title: 'Fundamentos Sólidos',
    description: 'Complete 100% da Fase 1.',
    emoji: '🟢',
    check: (p) =>
      ['mes-01', 'mes-02', 'mes-03', 'mes-04', 'mes-05', 'mes-06'].every(
        (id) => (p.moduleProgress[id] ?? 0) >= 100
      ),
  },
  {
    id: 'fase-2-completa',
    title: 'Especialista',
    description: 'Complete 100% da Fase 2.',
    emoji: '🔵',
    check: (p) =>
      ['mes-07', 'mes-08', 'mes-09', 'mes-10', 'mes-11', 'mes-12'].every(
        (id) => (p.moduleProgress[id] ?? 0) >= 100
      ),
  },
  {
    id: 'fase-3-completa',
    title: 'Full Stack Sênior',
    description: 'Complete 100% da Fase 3. Você terminou a jornada completa!',
    emoji: '🏆',
    check: (p) =>
      ['mes-13', 'mes-14', 'mes-15', 'mes-16', 'mes-17', 'mes-18'].every(
        (id) => (p.moduleProgress[id] ?? 0) >= 100
      ),
  },
  {
    id: 'xp-1000',
    title: 'Mil Pontos',
    description: 'Acumule 1.000 XP.',
    emoji: '💎',
    check: (p) => p.xp >= 1000,
  },
  {
    id: 'xp-5000',
    title: 'Cinco Mil Pontos',
    description: 'Acumule 5.000 XP.',
    emoji: '💠',
    check: (p) => p.xp >= 5000,
  },
  {
    id: 'gamer',
    title: 'Gamer de Verdade',
    description: 'Jogue pelo menos 3 mini-jogos diferentes.',
    emoji: '🎮',
    check: (p) => Object.keys(p.gamesScores).length >= 3,
  },
  {
    id: 'perfeccionista',
    title: 'Perfeccionista',
    description: 'Acerte 20 exercícios corretamente.',
    emoji: '🎯',
    check: (p) => Object.values(p.completedExercises).filter(Boolean).length >= 20,
  },
];

export const XP_PER_EXERCISE = 15;
export const XP_PER_CHECKLIST = 25;
export const XP_PER_GAME_PLAY = 20;
export const XP_PER_LEVEL = 250;

export function levelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpIntoCurrentLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}

export function levelTitle(level: number): string {
  if (level >= 18) return 'Full Stack Sênior';
  if (level >= 13) return 'Arquiteto de Sistemas';
  if (level >= 9) return 'Especialista Full Stack';
  if (level >= 5) return 'Desenvolvedor em Ascensão';
  if (level >= 2) return 'Aprendiz Dedicado';
  return 'Iniciante Curioso';
}
