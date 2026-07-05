import type { SpacedReviewItem } from './types';

// Intervalos em dias, inspirados num SM-2 simplificado: cada acerto avança um
// índice; cada erro volta ao início. Cresce rápido o suficiente para não
// sobrecarregar o dia a dia, mas revisita o suficiente para fixar de verdade.
export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 16, 35, 90];

function addDays(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function scheduleNextReview(
  exerciseId: string,
  moduleId: string,
  correct: boolean,
  existing?: SpacedReviewItem
): SpacedReviewItem {
  const today = todayIsoDate();

  if (!correct) {
    return {
      exerciseId,
      moduleId,
      intervalIdx: 0,
      dueDate: addDays(today, REVIEW_INTERVALS_DAYS[0]),
      lastResult: 'wrong',
    };
  }

  const nextIdx = existing ? Math.min(existing.intervalIdx + 1, REVIEW_INTERVALS_DAYS.length - 1) : 0;
  return {
    exerciseId,
    moduleId,
    intervalIdx: nextIdx,
    dueDate: addDays(today, REVIEW_INTERVALS_DAYS[nextIdx]),
    lastResult: 'correct',
  };
}

export function getDueReviews(spacedReview: Record<string, SpacedReviewItem>): SpacedReviewItem[] {
  const today = todayIsoDate();
  return Object.values(spacedReview).filter((item) => item.dueDate <= today);
}

export function isItemMastered(item: SpacedReviewItem): boolean {
  return item.intervalIdx >= REVIEW_INTERVALS_DAYS.length - 1 && item.lastResult === 'correct';
}
