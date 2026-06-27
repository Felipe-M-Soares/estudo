import { useState } from 'react';
import { MessageCircle, Compass } from 'lucide-react';
import type { BehavioralQuestion } from '../../data/interviewTypes';

interface InterviewBehavioralStageProps {
  questions: BehavioralQuestion[];
  currentIdx: number;
  answers: Record<string, string>;
  onAnswer: (questionId: string, text: string) => void;
  onNext: () => void;
}

export function InterviewBehavioralStage({ questions, currentIdx, answers, onAnswer, onNext }: InterviewBehavioralStageProps) {
  const question = questions[currentIdx];
  const [showTip, setShowTip] = useState(false);
  const text = question ? answers[question.id] ?? '' : '';

  if (!question) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-8 lg:px-8">
      <div className="mb-4">
        <span className="font-mono text-xs text-base-400">Comportamental · {currentIdx + 1}/{questions.length}</span>
      </div>

      <div className="card-surface animate-rise-in rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
            <MessageCircle size={18} />
          </span>
          <p className="text-base font-semibold text-base-50">{question.question}</p>
        </div>

        <textarea
          value={text}
          onChange={(e) => onAnswer(question.id, e.target.value)}
          placeholder="Escreva sua resposta como você diria numa entrevista de verdade — sem pressa, pense na estrutura."
          rows={7}
          className="mt-4 w-full resize-none rounded-xl border border-base-700 bg-base-950/80 p-4 text-sm text-base-100 outline-none placeholder:text-base-600 focus:border-violet-400/60"
        />

        <button
          onClick={() => setShowTip((s) => !s)}
          className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-violet-300 hover:underline"
        >
          <Compass size={12} /> {showTip ? 'Esconder' : 'Ver'} o que avaliadores procuram nessa resposta
        </button>

        {showTip && (
          <div className="mt-2 space-y-2 rounded-xl border border-violet-400/20 bg-violet-500/5 p-3 text-sm">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-300">O que querem ouvir</p>
              <p className="text-base-200">{question.whatTheyWantToHear}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-300">Como estruturar</p>
              <p className="text-base-200">{question.structureTip}</p>
            </div>
          </div>
        )}

        <button
          onClick={onNext}
          className="mt-4 w-full rounded-xl bg-violet-400 px-4 py-2.5 text-sm font-bold text-base-950 hover:opacity-90"
        >
          {currentIdx + 1 < questions.length ? 'Próxima pergunta →' : 'Ver resultado final →'}
        </button>
        {!text.trim() && (
          <p className="mt-2 text-center text-[11px] text-base-500">Você pode pular sem responder, mas tentar ajuda a fixar o hábito.</p>
        )}
      </div>
    </div>
  );
}
