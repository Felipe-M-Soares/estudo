import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import type { TheoryQuestion } from '../../data/interviewTypes';

interface InterviewTheoryStageProps {
  questions: TheoryQuestion[];
  currentIdx: number;
  onAnswer: (questionId: string, correct: boolean) => void;
  onNext: () => void;
}

const SECONDS_PER_QUESTION = 40;

export function InterviewTheoryStage({ questions, currentIdx, onAnswer, onNext }: InterviewTheoryStageProps) {
  const question = questions[currentIdx];
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);

  useEffect(() => {
    setSelected(null);
    setTimeLeft(SECONDS_PER_QUESTION);
  }, [currentIdx]);

  function handleSelect(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    onAnswer(question.id, idx === question.correctIndex);
  }

  useEffect(() => {
    if (selected !== null) return;
    if (timeLeft <= 0) {
      handleSelect(-1);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, selected]);

  if (!question) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-xs text-base-400">Teoria · Pergunta {currentIdx + 1}/{questions.length}</span>
        <span className={`flex items-center gap-1 font-mono text-xs font-semibold ${timeLeft <= 10 ? 'text-ember-400' : 'text-base-300'}`}>
          <Clock size={12} /> {timeLeft}s
        </span>
      </div>
      <div className="mb-5 h-1 overflow-hidden rounded-full bg-base-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-mint-400 transition-all duration-1000 ease-linear"
          style={{ width: `${(timeLeft / SECONDS_PER_QUESTION) * 100}%` }}
        />
      </div>

      <div className="card-surface animate-rise-in rounded-2xl p-5">
        <p className="text-base font-semibold text-base-50">{question.prompt}</p>
        {question.code && (
          <pre className="mt-3 overflow-x-auto rounded-xl border border-base-700 bg-base-950/60 p-4">
            <code className="font-mono text-[13px] text-mint-200">{question.code}</code>
          </pre>
        )}

        <div className="mt-4 space-y-2">
          {question.options.map((opt, idx) => {
            const isCorrect = idx === question.correctIndex;
            const isSelected = idx === selected;
            let styles = 'border-base-600 hover:border-base-500 hover:bg-base-800';
            if (selected !== null) {
              if (isCorrect) styles = 'border-mint-400/60 bg-mint-900/30';
              else if (isSelected) styles = 'border-ember-400/60 bg-ember-500/10';
              else styles = 'border-base-700 opacity-50';
            }
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={selected !== null}
                className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm text-base-100 transition-colors ${styles}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div
            className={`mt-4 rounded-xl border p-3 text-sm ${
              selected === question.correctIndex
                ? 'border-mint-400/30 bg-mint-900/20 text-mint-200'
                : 'border-ember-400/30 bg-ember-500/10 text-ember-300'
            }`}
          >
            <p className="mb-1 font-semibold">
              {selected === question.correctIndex ? '✅ Correto!' : selected === -1 ? '⏱️ Tempo esgotado.' : '❌ Não foi essa.'}
            </p>
            <p className="text-base-200">{question.explanation}</p>
          </div>
        )}

        {selected !== null && (
          <button
            onClick={onNext}
            className="mt-4 w-full rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-base-950 hover:opacity-90"
          >
            {currentIdx + 1 < questions.length ? 'Próxima pergunta →' : 'Ir para os desafios práticos →'}
          </button>
        )}
      </div>
    </div>
  );
}
