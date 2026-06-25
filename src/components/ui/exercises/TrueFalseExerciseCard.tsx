import { useState } from 'react';
import { Check, X } from 'lucide-react';
import type { TrueFalseExercise } from '../../../data/types';

interface TrueFalseProps {
  exercise: TrueFalseExercise;
  onResult: (correct: boolean) => void;
}

export function TrueFalseExerciseCard({ exercise, onResult }: TrueFalseProps) {
  const [selected, setSelected] = useState<boolean | null>(null);
  const [revealed, setRevealed] = useState(false);

  function handleSelect(value: boolean) {
    if (revealed) return;
    setSelected(value);
    setRevealed(true);
    onResult(value === exercise.answer);
  }

  return (
    <div className="rounded-2xl card-surface p-5">
      <p className="text-sm font-medium text-base-50">{exercise.prompt}</p>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {[true, false].map((value) => {
          const label = value ? 'Verdadeiro' : 'Falso';
          const isCorrect = value === exercise.answer;
          const isSelected = selected === value;
          let styles = 'border-base-600 hover:border-base-500 hover:bg-base-800';
          if (revealed) {
            if (isCorrect) styles = 'border-mint-400/60 bg-mint-900/30';
            else if (isSelected) styles = 'border-ember-400/60 bg-ember-500/10';
            else styles = 'border-base-700 opacity-50';
          }
          return (
            <button
              key={label}
              onClick={() => handleSelect(value)}
              disabled={revealed}
              className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold text-base-100 transition-colors ${styles}`}
            >
              {label}
              {revealed && isCorrect && <Check size={16} className="text-mint-400" />}
              {revealed && isSelected && !isCorrect && <X size={16} className="text-ember-400" />}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div
          className={`mt-3 rounded-xl border p-3 text-sm ${
            selected === exercise.answer
              ? 'border-mint-400/30 bg-mint-900/20 text-mint-200'
              : 'border-ember-400/30 bg-ember-500/10 text-ember-300'
          }`}
        >
          <p className="mb-1 font-semibold">{selected === exercise.answer ? '✅ Correto!' : '❌ Quase lá.'}</p>
          <p className="text-base-200">{exercise.explanation}</p>
        </div>
      )}
    </div>
  );
}
