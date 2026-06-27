import { useState } from 'react';
import { ArrowUp, ArrowDown, Check } from 'lucide-react';
import type { OrderExercise } from '../../../data/types';

interface OrderProps {
  exercise: OrderExercise;
  onResult: (correct: boolean) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  // garante que não saia já na ordem certa por acaso
  if (copy.every((v, i) => v === arr[i]) && arr.length > 1) {
    [copy[0], copy[1]] = [copy[1], copy[0]];
  }
  return copy;
}

export function OrderExerciseCard({ exercise, onResult }: OrderProps) {
  const [items, setItems] = useState<string[]>(() => shuffle(exercise.steps));
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(false);

  function move(idx: number, dir: -1 | 1) {
    if (revealed) return;
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[idx], next[target]] = [next[target], next[idx]];
    setItems(next);
  }

  function handleCheck() {
    const isCorrect = items.every((item, idx) => item === exercise.steps[idx]);
    setCorrect(isCorrect);
    setRevealed(true);
    onResult(isCorrect);
  }

  return (
    <div className="rounded-2xl card-surface p-5">
      <p className="text-sm font-medium text-base-50">{exercise.prompt}</p>
      <ol className="mt-3 space-y-2">
        {items.map((item, idx) => {
          const isRight = revealed && item === exercise.steps[idx];
          return (
            <li
              key={item}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                revealed
                  ? isRight
                    ? 'border-mint-400/50 bg-mint-900/20 text-mint-100'
                    : 'border-ember-400/50 bg-ember-500/10 text-ember-200'
                  : 'border-base-600 bg-base-800 text-base-100'
              }`}
            >
              <span className="mono-num shrink-0 text-xs text-base-400">{idx + 1}</span>
              <span className="flex-1">{item}</span>
              {!revealed && (
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => move(idx, -1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-base-400 hover:bg-base-700 hover:text-base-100"
                    aria-label="Mover para cima"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => move(idx, 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-base-400 hover:bg-base-700 hover:text-base-100"
                    aria-label="Mover para baixo"
                  >
                    <ArrowDown size={16} />
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {!revealed && (
        <button
          onClick={handleCheck}
          className="mt-3 flex items-center gap-1.5 rounded-lg bg-mint-400 px-4 py-2 text-sm font-semibold text-base-950 hover:opacity-90"
        >
          <Check size={14} /> Verificar ordem
        </button>
      )}

      {revealed && (
        <div
          className={`mt-3 rounded-xl border p-3 text-sm ${
            correct ? 'border-mint-400/30 bg-mint-900/20 text-mint-200' : 'border-ember-400/30 bg-ember-500/10 text-ember-300'
          }`}
        >
          <p className="mb-1 font-semibold">{correct ? '✅ Ordem correta!' : '❌ Ainda não, veja a ordem certa abaixo.'}</p>
          <p className="text-base-200">{exercise.explanation}</p>
        </div>
      )}
    </div>
  );
}
