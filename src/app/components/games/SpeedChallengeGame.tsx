import { useEffect, useState } from 'react';

export interface SpeedChallengeQuestion {
  prompt: string;
  code?: string;
  options: string[];
  correctIndex: number;
}

interface SpeedChallengeGameProps {
  title: string;
  emoji: string;
  description: string;
  questions: SpeedChallengeQuestion[];
  secondsPerQuestion?: number;
  onComplete: (score: number) => void;
}

function shuffleQuestions(qs: SpeedChallengeQuestion[]): SpeedChallengeQuestion[] {
  const copy = [...qs];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function SpeedChallengeGame({
  title,
  emoji,
  description,
  questions,
  secondsPerQuestion = 15,
  onComplete,
}: SpeedChallengeGameProps) {
  const [order] = useState(() => shuffleQuestions(questions));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(secondsPerQuestion);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);

  const current = order[idx];

  useEffect(() => {
    if (!started || finished || selected !== null) return;
    if (timeLeft <= 0) {
      handleAnswer(null);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, started, finished, selected]);

  function handleAnswer(choiceIdx: number | null) {
    if (selected !== null) return;
    setSelected(choiceIdx ?? -1);
    const correct = choiceIdx === current.correctIndex;
    if (correct) setScore((s) => s + 1);

    setTimeout(() => {
      if (idx + 1 >= order.length) {
        setFinished(true);
        const pct = Math.round(((correct ? score + 1 : score) / order.length) * 100);
        onComplete(pct);
      } else {
        setIdx((i) => i + 1);
        setSelected(null);
        setTimeLeft(secondsPerQuestion);
      }
    }, 900);
  }

  function restart() {
    setIdx(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
    setTimeLeft(secondsPerQuestion);
    setStarted(true);
  }

  if (!started) {
    return (
      <div className="rounded-2xl card-surface p-6 text-center">
        <div className="text-3xl">{emoji}</div>
        <h3 className="mt-2 font-display text-base font-bold text-base-50">{title}</h3>
        <p className="mt-1 text-sm text-base-400">{description}</p>
        <p className="mt-2 text-xs text-base-500">{order.length} perguntas · {secondsPerQuestion}s cada</p>
        <button
          onClick={() => setStarted(true)}
          className="mt-4 rounded-lg bg-mint-400 px-5 py-2 text-sm font-semibold text-base-950 hover:opacity-90"
        >
          Começar
        </button>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / order.length) * 100);
    return (
      <div className="rounded-2xl card-surface p-6 text-center">
        <div className="text-3xl">{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'}</div>
        <h3 className="mt-2 font-display text-lg font-bold text-base-50">{score}/{order.length} corretas</h3>
        <p className="mt-1 text-sm text-base-400">{pct}% de acerto</p>
        <button
          onClick={restart}
          className="mt-4 rounded-lg border border-base-600 px-4 py-2 text-sm text-base-200 hover:bg-base-800"
        >
          Jogar de novo
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl card-surface p-5">
      <div className="mb-3 flex items-center justify-between text-xs text-base-400">
        <span>Pergunta {idx + 1}/{order.length}</span>
        <span className={`mono-num font-semibold ${timeLeft <= 5 ? 'text-ember-400' : 'text-base-300'}`}>⏱ {timeLeft}s</span>
      </div>
      <div className="mb-3 h-1 overflow-hidden rounded-full bg-base-700">
        <div
          className="h-full bg-amber-400 transition-all duration-1000 ease-linear"
          style={{ width: `${(timeLeft / secondsPerQuestion) * 100}%` }}
        />
      </div>

      <p className="text-sm font-medium text-base-50">{current.prompt}</p>
      {current.code && (
        <pre className="my-3 overflow-x-auto rounded-xl border border-base-700 bg-base-900 p-3">
          <code className="font-mono text-[13px] text-mint-200">{current.code}</code>
        </pre>
      )}

      <div className="mt-3 space-y-2">
        {current.options.map((opt, i) => {
          const isCorrect = i === current.correctIndex;
          const isSelected = i === selected;
          let styles = 'border-base-600 hover:border-base-500 hover:bg-base-800';
          if (selected !== null) {
            if (isCorrect) styles = 'border-mint-400/60 bg-mint-900/30';
            else if (isSelected) styles = 'border-ember-400/60 bg-ember-500/10';
            else styles = 'border-base-700 opacity-50';
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selected !== null}
              className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm text-base-100 transition-colors ${styles}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
