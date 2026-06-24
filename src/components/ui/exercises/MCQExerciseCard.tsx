import { useState } from 'react';
import { Check, X } from 'lucide-react';
import type { MCQExercise } from '../../../data/types';

interface MCQProps {
  exercise: MCQExercise;
  onResult: (correct: boolean) => void;
}

export function MCQExerciseCard({ exercise, onResult }: MCQProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  function handleSelect(idx: number) {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    onResult(idx === exercise.correctIndex);
  }

  return (
    <div className="rounded-2xl border border-base-700 bg-base-850 p-5">
      <p className="text-sm font-medium text-base-50">{exercise.prompt}</p>
      {exercise.code && (
        <pre className="my-3 overflow-x-auto rounded-xl border border-base-700 bg-base-900 p-3">
          <code className="font-mono text-[13px] text-mint-200">{exercise.code}</code>
        </pre>
      )}
      <div className="mt-3 space-y-2">
        {exercise.options.map((opt: string, idx: number) => {
          const isCorrect = idx === exercise.correctIndex;
          const isSelected = idx === selected;
          let styles = 'border-base-600 hover:border-base-500 hover:bg-base-800';
          if (revealed) {
            if (isCorrect) styles = 'border-mint-400/60 bg-mint-900/30';
            else if (isSelected) styles = 'border-ember-400/60 bg-ember-500/10';
            else styles = 'border-base-700 opacity-50';
          }
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={revealed}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left text-sm text-base-100 transition-colors ${styles}`}
            >
              <span>{opt}</span>
              {revealed && isCorrect && <Check size={16} className="text-mint-400" />}
              {revealed && isSelected && !isCorrect && <X size={16} className="text-ember-400" />}
            </button>
          );
        })}
      </div>
      {revealed && (
        <div
          className={`mt-3 rounded-xl border p-3 text-sm ${
            selected === exercise.correctIndex
              ? 'border-mint-400/30 bg-mint-900/20 text-mint-200'
              : 'border-ember-400/30 bg-ember-500/10 text-ember-300'
          }`}
        >
          <p className="mb-1 font-semibold">
            {selected === exercise.correctIndex ? '✅ Correto!' : '❌ Quase lá.'}
          </p>
          <p className="text-base-200">{exercise.explanation}</p>
        </div>
      )}
    </div>
  );
}
