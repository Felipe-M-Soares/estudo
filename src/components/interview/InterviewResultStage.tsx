import { useEffect } from 'react';
import type { ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Brain, Code2, MessageCircle } from 'lucide-react';
import type { InterviewResult } from '../../data/interviewTypes';

interface InterviewResultStageProps {
  result: InterviewResult;
  onRestart: () => void;
}

function scoreLabel(score: number): { text: string; color: string } {
  if (score >= 80) return { text: 'Excelente desempenho!', color: 'text-mint-300' };
  if (score >= 60) return { text: 'Bom desempenho, com espaço pra crescer', color: 'text-amber-300' };
  if (score >= 40) return { text: 'Base ok, vale reforçar os pontos fracos', color: 'text-amber-300' };
  return { text: 'Hora de revisar os fundamentos com calma', color: 'text-ember-300' };
}

export function InterviewResultStage({ result, onRestart }: InterviewResultStageProps) {
  const overall = scoreLabel(result.overallScore);

  useEffect(() => {
    if (result.overallScore >= 70) {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#00ffc2', '#1ee6ff', '#ff2e9e', '#b066ff'],
      });
    }
  }, [result.overallScore]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 lg:px-8">
      <div className="text-center animate-rise-in">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
          Simulação · {result.trackLabel} · {result.levelLabel}
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold text-base-50">{result.overallScore}<span className="text-xl text-base-400">/100</span></h1>
        <p className={`mt-1 text-sm font-semibold ${overall.color}`}>{overall.text}</p>
      </div>

      <div className="mt-7 grid gap-3">
        <ScoreRow
          icon={<Brain size={16} />}
          label="Teoria"
          detail={`${result.theoryCorrect}/${result.theoryTotal} corretas`}
          score={result.theoryScore}
          color="cyan"
        />
        <ScoreRow
          icon={<Code2 size={16} />}
          label="Prática"
          detail={`${result.practicalPassed}/${result.practicalAttempted} desafios com solução completa`}
          score={result.practicalScore}
          color="mint"
        />
        <ScoreRow
          icon={<MessageCircle size={16} />}
          label="Comportamental"
          detail={`${result.behavioralAnswered}/${result.behavioralTotal} perguntas respondidas`}
          score={Math.round((result.behavioralAnswered / Math.max(result.behavioralTotal, 1)) * 100)}
          color="violet"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-base-700 bg-base-900/60 p-4 text-sm text-base-300">
        💡 Essa simulação é uma ferramenta de prática, não uma nota oficial. O valor real está em repetir — refaça a simulação em
        outro nível ou trilha, e volte aqui depois de estudar os pontos que pesaram menos.
      </div>

      <button
        onClick={onRestart}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-mint-400 px-5 py-3 text-sm font-bold text-base-950 shadow-[0_0_24px_-6px_theme(colors.cyan.400)] hover:opacity-90"
      >
        <RotateCcw size={15} /> Fazer nova simulação
      </button>
    </div>
  );
}

function ScoreRow({ icon, label, detail, score, color }: { icon: ReactNode; label: string; detail: string; score: number; color: 'cyan' | 'mint' | 'violet' }) {
  const colors = {
    cyan: { bg: 'bg-cyan-500/15', text: 'text-cyan-300', bar: 'bg-cyan-400' },
    mint: { bg: 'bg-mint-500/15', text: 'text-mint-300', bar: 'bg-mint-400' },
    violet: { bg: 'bg-violet-500/15', text: 'text-violet-300', bar: 'bg-violet-400' },
  }[color];
  return (
    <div className="card-surface rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors.bg} ${colors.text}`}>{icon}</span>
          <div>
            <div className="font-display text-sm font-bold text-base-50">{label}</div>
            <div className="text-[11px] text-base-400">{detail}</div>
          </div>
        </div>
        <span className="mono-num text-lg font-bold text-base-50">{score}%</span>
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-base-700">
        <div className={`h-full rounded-full ${colors.bar} transition-all duration-700`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
