import { useState } from 'react';
import type { CodeFillExercise } from '../../../data/types';

interface CodeFillProps {
  exercise: CodeFillExercise;
  onResult: (correct: boolean) => void;
}

export function CodeFillExerciseCard({ exercise, onResult }: CodeFillProps) {
  const [value, setValue] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  function handleCheck() {
    const normalize = (s: string) => s.trim().toLowerCase();
    const isCorrect = normalize(value) === normalize(exercise.answer);
    setCorrect(isCorrect);
    setRevealed(true);
    onResult(isCorrect);
  }

  const [before, after] = exercise.codeTemplate.split('___');

  return (
    <div className="rounded-2xl card-surface p-5">
      <p className="text-sm font-medium text-base-50">{exercise.prompt}</p>

      <pre className="my-3 overflow-x-auto rounded-xl border border-base-700 bg-base-900 p-4">
        <code className="font-mono text-[13px] leading-relaxed text-mint-200 whitespace-pre-wrap">
          {before}
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={revealed}
            placeholder="___"
            className={`mx-1 w-24 rounded border bg-base-800 px-2 py-0.5 text-center font-mono text-[13px] text-amber-300 outline-none ${
              revealed
                ? correct
                  ? 'border-mint-400'
                  : 'border-ember-400'
                : 'border-base-500 focus:border-mint-400'
            }`}
          />
          {after}
        </code>
      </pre>

      <div className="flex items-center gap-2">
        {!revealed && (
          <>
            <button
              onClick={handleCheck}
              disabled={!value.trim()}
              className="rounded-lg bg-mint-400 px-4 py-2 text-sm font-semibold text-base-950 transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Verificar
            </button>
            <button
              onClick={() => setShowHint((s) => !s)}
              className="rounded-lg border border-base-600 px-3 py-2 text-sm text-base-300 hover:bg-base-800"
            >
              💡 Dica
            </button>
          </>
        )}
      </div>

      {showHint && !revealed && (
        <p className="mt-2 text-xs text-amber-300">{exercise.hint}</p>
      )}

      {revealed && (
        <div
          className={`mt-3 rounded-xl border p-3 text-sm ${
            correct ? 'border-mint-400/30 bg-mint-900/20 text-mint-200' : 'border-ember-400/30 bg-ember-500/10 text-ember-300'
          }`}
        >
          <p className="mb-1 font-semibold">
            {correct ? '✅ Correto!' : `❌ A resposta certa era "${exercise.answer}".`}
          </p>
          <p className="text-base-200">{exercise.explanation}</p>
        </div>
      )}
    </div>
  );
}
