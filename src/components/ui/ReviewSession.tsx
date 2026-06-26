import { useState } from 'react';
import { Link } from 'react-router-dom';
import { exercisesById, modulesById } from '../../data';
import { ExerciseRouter } from './ExerciseRouter';
import type { SpacedReviewItem } from '../../data/types';

interface ReviewSessionProps {
  dueItems: SpacedReviewItem[];
  onReviewResult: (moduleId: string, exerciseId: string, correct: boolean) => void;
  onBack: () => void;
}

export function ReviewSession({ dueItems, onReviewResult, onBack }: ReviewSessionProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  const current = dueItems[activeIdx];
  const exercise = current ? exercisesById[current.exerciseId] : undefined;
  const mod = current ? modulesById[current.moduleId] : undefined;

  if (!current || !exercise || !mod) {
    return (
      <div className="card-surface rounded-2xl p-5 text-center">
        <p className="text-sm font-semibold text-mint-300">🎉 Revisão concluída por hoje!</p>
        <button onClick={onBack} className="mt-2 text-xs text-base-400 hover:underline">
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-base-400">
          Revisão {activeIdx + 1}/{dueItems.length} · {mod.emoji} {mod.title}
        </span>
        <Link to={`/modulo/${mod.id}`} className="text-xs text-violet-300 hover:underline">
          Ver módulo completo
        </Link>
      </div>
      <ExerciseRouter
        exercise={exercise}
        onResult={(correct) => {
          onReviewResult(current.moduleId, current.exerciseId, correct);
          setTimeout(() => setActiveIdx((i) => i + 1), 1400);
        }}
      />
    </div>
  );
}
