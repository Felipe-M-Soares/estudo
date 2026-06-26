import type { Module, PhaseInfo } from './types';
import { mes01, mes02, mes03 } from './modules/phase1-part1';
import { mes04, mes05, mes06 } from './modules/phase1-part2';
import { mes07, mes08, mes09 } from './modules/phase2-part1';
import { mes10, mes11, mes12 } from './modules/phase2-part2';
import { mes13, mes14, mes15 } from './modules/phase3-part1';
import { mes16, mes17, mes18 } from './modules/phase3-part2';
import { mes19 } from './modules/phase4';
import { mes20 } from './modules/phase4python';
import { mes21 } from './modules/phase4go';
import { mes22 } from './modules/phase4mongoredis';

export const modules: Module[] = [
  mes01, mes02, mes03, mes04, mes05, mes06,
  mes07, mes08, mes09, mes10, mes11, mes12,
  mes13, mes14, mes15, mes16, mes17, mes18,
  mes19, mes20, mes21, mes22,
];

export const modulesById: Record<string, Module> = Object.fromEntries(
  modules.map((m) => [m.id, m])
);

export const exercisesById: Record<string, Module['exercises'][number]> = Object.fromEntries(
  modules.flatMap((m) => m.exercises.map((e) => [e.id, e]))
);

export interface SearchResult {
  type: 'module' | 'lesson' | 'exercise' | 'game';
  moduleId: string;
  moduleTitle: string;
  moduleEmoji: string;
  title: string;
  snippet: string;
}

export function searchContent(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const results: SearchResult[] = [];

  for (const m of modules) {
    if (m.title.toLowerCase().includes(q) || m.tagline.toLowerCase().includes(q)) {
      results.push({ type: 'module', moduleId: m.id, moduleTitle: m.title, moduleEmoji: m.emoji, title: m.title, snippet: m.tagline });
    }
    for (const lesson of m.lessons) {
      if (lesson.heading.toLowerCase().includes(q) || lesson.body.toLowerCase().includes(q)) {
        results.push({
          type: 'lesson',
          moduleId: m.id,
          moduleTitle: m.title,
          moduleEmoji: m.emoji,
          title: lesson.heading,
          snippet: lesson.body.slice(0, 120).replace(/\*\*/g, ''),
        });
      }
    }
    for (const ex of m.exercises) {
      if (ex.prompt.toLowerCase().includes(q)) {
        results.push({ type: 'exercise', moduleId: m.id, moduleTitle: m.title, moduleEmoji: m.emoji, title: ex.prompt.slice(0, 80), snippet: 'Exercício' });
      }
    }
    for (const g of m.games) {
      if (g.label.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)) {
        results.push({ type: 'game', moduleId: m.id, moduleTitle: m.title, moduleEmoji: m.emoji, title: g.label, snippet: g.description });
      }
    }
  }

  return results.slice(0, 30);
}

export const phases: PhaseInfo[] = [
  {
    phase: 1,
    title: 'Fundamentos',
    objective: 'Construir a base sólida',
    months: [1, 2, 3, 4, 5, 6],
    color: 'mint',
  },
  {
    phase: 2,
    title: 'Especialização',
    objective: 'Aprofundar em tecnologias modernas',
    months: [7, 8, 9, 10, 11, 12],
    color: 'amber',
  },
  {
    phase: 3,
    title: 'Integração Full Stack',
    objective: 'Arquitetura e escalabilidade',
    months: [13, 14, 15, 16, 17, 18],
    color: 'violet',
  },
  {
    phase: 4,
    title: 'Extras de Mercado',
    objective: 'Outras linguagens, bancos e segurança',
    months: [19, 20, 21, 22],
    color: 'cyan',
  },
];

export function getModuleByMonth(month: number): Module | undefined {
  return modules.find((m) => m.month === month);
}

export function getNextModule(currentId: string): Module | undefined {
  const idx = modules.findIndex((m) => m.id === currentId);
  if (idx === -1 || idx === modules.length - 1) return undefined;
  return modules[idx + 1];
}

export function getPrevModule(currentId: string): Module | undefined {
  const idx = modules.findIndex((m) => m.id === currentId);
  if (idx <= 0) return undefined;
  return modules[idx - 1];
}

export function totalExerciseCount(): number {
  return modules.reduce((sum, m) => sum + m.exercises.length, 0);
}

export function totalChecklistCount(): number {
  return modules.reduce((sum, m) => sum + m.checklist.length, 0);
}

export const library = [
  { title: 'Código Limpo', author: 'Robert C. Martin', theme: 'Qualidade de código' },
  { title: 'Arquitetura Limpa', author: 'Robert C. Martin', theme: 'Arquitetura de software' },
  { title: 'Domain-Driven Design', author: 'Eric Evans', theme: 'Modelagem de domínio' },
  { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', theme: 'Sistemas distribuídos' },
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', theme: 'Boas práticas' },
  { title: 'Staff Engineer', author: 'Will Larson', theme: 'Liderança técnica' },
  { title: 'Refactoring', author: 'Martin Fowler', theme: 'Refatoração de código' },
];

export const usefulLinks = [
  { label: 'DIO', emoji: '🎓', url: 'https://www.dio.me' },
  { label: 'Rocketseat', emoji: '🚀', url: 'https://www.rocketseat.com.br' },
  { label: 'Alura', emoji: '📚', url: 'https://www.alura.com.br' },
  { label: 'Udemy', emoji: '🎯', url: 'https://www.udemy.com' },
  { label: 'AWS Skill Builder', emoji: '☁️', url: 'https://aws.amazon.com/training/digital/' },
  { label: 'Coursera', emoji: '🎓', url: 'https://www.coursera.org' },
  { label: 'Stack Overflow', emoji: '🧠', url: 'https://stackoverflow.com' },
  { label: 'Dev.to', emoji: '✍️', url: 'https://dev.to' },
  { label: 'Excalidraw', emoji: '✏️', url: 'https://excalidraw.com' },
  { label: 'Roadmap.sh', emoji: '🗺️', url: 'https://roadmap.sh' },
  { label: 'FreeCodeCamp', emoji: '📖', url: 'https://www.freecodecamp.org' },
];
