import { useMemo, useState } from 'react';
import type { MatchExercise } from '../../../data/types';

interface MatchProps {
  exercise: MatchExercise;
  onResult: (correct: boolean) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function MatchExerciseCard({ exercise, onResult }: MatchProps) {
  const rightShuffled = useMemo<string[]>(
    () => shuffle<string>(exercise.pairs.map((p) => p.right)),
    [exercise.pairs]
  );
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);

  const allMatched = Object.keys(matches).length === exercise.pairs.length;

  function handleLeftClick(left: string) {
    if (revealed || matches[left]) return;
    setSelectedLeft(left);
  }

  function handleRightClick(right: string) {
    if (revealed || !selectedLeft) return;
    if (Object.values(matches).includes(right)) return;
    setMatches((prev) => ({ ...prev, [selectedLeft]: right }));
    setSelectedLeft(null);
  }

  function handleCheck() {
    setRevealed(true);
    const correctCount = exercise.pairs.filter((p) => matches[p.left] === p.right).length;
    onResult(correctCount === exercise.pairs.length);
  }

  return (
    <div className="rounded-2xl border border-base-700 bg-base-850 p-5">
      <p className="text-sm font-medium text-base-50">{exercise.prompt}</p>
      <p className="mt-1 text-xs text-base-400">Toque em um item da esquerda, depois no par certo da direita.</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {exercise.pairs.map((p) => {
            const matched = matches[p.left];
            const isRight = revealed && matched === p.right;
            const isWrong = revealed && matched && matched !== p.right;
            return (
              <button
                key={p.left}
                onClick={() => handleLeftClick(p.left)}
                disabled={revealed}
                className={`w-full rounded-lg border px-3 py-2 text-left text-xs font-mono transition-colors ${
                  isRight
                    ? 'border-mint-400/60 bg-mint-900/30 text-mint-200'
                    : isWrong
                    ? 'border-ember-400/60 bg-ember-500/10 text-ember-200'
                    : selectedLeft === p.left
                    ? 'border-amber-400 bg-amber-400/10 text-amber-200'
                    : matched
                    ? 'border-base-500 bg-base-700 text-base-200'
                    : 'border-base-600 text-base-100 hover:border-base-500'
                }`}
              >
                {p.left}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          {rightShuffled.map((right) => {
            const usedBy = Object.entries(matches).find(([, r]) => r === right)?.[0];
            return (
              <button
                key={right}
                onClick={() => handleRightClick(right)}
                disabled={revealed || !!usedBy}
                className={`w-full rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                  usedBy
                    ? 'border-base-500 bg-base-700 text-base-300'
                    : 'border-base-600 text-base-100 hover:border-amber-400/60 hover:bg-base-800'
                }`}
              >
                {right}
              </button>
            );
          })}
        </div>
      </div>

      {!revealed && (
        <button
          onClick={handleCheck}
          disabled={!allMatched}
          className="mt-4 rounded-lg bg-mint-400 px-4 py-2 text-sm font-semibold text-base-950 disabled:opacity-40"
        >
          Verificar associações
        </button>
      )}

      {revealed && (
        <div className="mt-3 rounded-xl border border-base-600 bg-base-800 p-3 text-sm text-base-200">
          <p className="mb-1 font-semibold text-base-50">📘 Explicação</p>
          {exercise.explanation}
        </div>
      )}
    </div>
  );
}
