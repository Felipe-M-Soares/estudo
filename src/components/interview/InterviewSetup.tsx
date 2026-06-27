import { useState } from 'react';
import { Code2, Server, Layers, Sparkles, TrendingUp, TrendingDown, Minus, ShieldAlert } from 'lucide-react';
import type { InterviewLevel, InterviewTrack } from '../../data/interviewTypes';
import type { InterviewHistoryEntry } from '../../data/types';

interface InterviewSetupProps {
  onStart: (track: InterviewTrack, level: InterviewLevel) => void;
  interviewHistory: InterviewHistoryEntry[];
}

const tracks: { id: InterviewTrack; label: string; icon: typeof Code2; desc: string }[] = [
  { id: 'frontend', label: 'Frontend', icon: Code2, desc: 'HTML, CSS, JS, React' },
  { id: 'backend', label: 'Backend', icon: Server, desc: 'APIs, banco, arquitetura' },
  { id: 'fullstack', label: 'Full Stack', icon: Layers, desc: 'Os dois mundos' },
  { id: 'security', label: 'Segurança', icon: ShieldAlert, desc: 'Vulnerabilidades e defesa' },
];

const levels: { id: InterviewLevel; label: string; desc: string }[] = [
  { id: 'junior', label: 'Júnior', desc: 'Fundamentos sólidos' },
  { id: 'pleno', label: 'Pleno', desc: 'Autonomia e trade-offs' },
  { id: 'senior', label: 'Sênior', desc: 'Arquitetura e liderança' },
];

export function InterviewSetup({ onStart, interviewHistory }: InterviewSetupProps) {
  const [track, setTrack] = useState<InterviewTrack>('fullstack');
  const [level, setLevel] = useState<InterviewLevel>('pleno');

  const recentHistory = interviewHistory.slice(0, 5);
  const trend =
    recentHistory.length >= 2 ? recentHistory[0].overallScore - recentHistory[1].overallScore : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-10 lg:px-8">
      <div className="mb-8 text-center animate-rise-in">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 ring-1 ring-cyan-400/30 shadow-[0_0_30px_-6px_theme(colors.cyan.400)]">
          <Sparkles size={26} className="text-cyan-300" />
        </div>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400">⟢ Modo Entrevista</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-base-50">Simule uma entrevista real</h1>
        <p className="mt-2 text-base-300">
          Teoria atualizada, desafios de código, e perguntas comportamentais — exatamente como em um processo seletivo de verdade.
        </p>
      </div>

      <div className="card-surface rounded-2xl p-5">
        <p className="mb-3 text-sm font-semibold text-base-200">Qual trilha você quer simular?</p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {tracks.map((t) => {
            const Icon = t.icon;
            const active = track === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTrack(t.id)}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                  active ? 'border-cyan-400/60 bg-cyan-500/10 shadow-[0_0_20px_-6px_theme(colors.cyan.400)]' : 'border-base-600 hover:border-base-500'
                }`}
              >
                <Icon size={22} className={active ? 'text-cyan-300' : 'text-base-400'} />
                <span className={`text-sm font-bold ${active ? 'text-cyan-200' : 'text-base-100'}`}>{t.label}</span>
                <span className="text-[11px] text-base-400">{t.desc}</span>
              </button>
            );
          })}
        </div>

        <p className="mb-3 mt-6 text-sm font-semibold text-base-200">Qual nível?</p>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {levels.map((l) => {
            const active = level === l.id;
            return (
              <button
                key={l.id}
                onClick={() => setLevel(l.id)}
                className={`flex flex-col items-center gap-1 rounded-xl border p-4 transition-all ${
                  active ? 'border-amber-400/60 bg-amber-500/10 shadow-[0_0_20px_-6px_theme(colors.amber.400)]' : 'border-base-600 hover:border-base-500'
                }`}
              >
                <span className={`text-sm font-bold ${active ? 'text-amber-200' : 'text-base-100'}`}>{l.label}</span>
                <span className="text-[11px] text-base-400">{l.desc}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl border border-base-700 bg-base-900/60 p-3.5 text-xs text-base-400">
          A simulação tem 3 etapas: <strong className="text-base-200">10 perguntas teóricas</strong> cronometradas,{' '}
          <strong className="text-base-200">3 desafios de código</strong> para completar, e{' '}
          <strong className="text-base-200">4 perguntas comportamentais</strong> com dicas de como estruturar sua resposta.
        </div>

        <button
          onClick={() => onStart(track, level)}
          className="mt-5 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-mint-400 px-5 py-3 text-sm font-bold text-base-950 shadow-[0_0_24px_-6px_theme(colors.cyan.400)] transition-opacity hover:opacity-90"
        >
          Começar simulação →
        </button>
      </div>

      {recentHistory.length > 0 && (
        <div className="mt-5 card-surface rounded-2xl p-4">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="font-display text-sm font-bold text-base-50">Suas últimas tentativas</span>
            {trend !== null && (
              <span className={`flex items-center gap-1 text-xs font-semibold ${trend > 0 ? 'text-mint-300' : trend < 0 ? 'text-ember-400' : 'text-base-400'}`}>
                {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
                {trend > 0 ? `+${trend}` : trend} desde a última
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            {recentHistory.map((h) => (
              <div key={h.id} className="flex items-center justify-between rounded-lg bg-base-900/60 px-3 py-2 text-xs">
                <span className="text-base-300">
                  {h.trackLabel} · {h.levelLabel} · {new Date(h.completedAt).toLocaleDateString('pt-BR')}
                </span>
                <span
                  className={`mono-num font-bold ${
                    h.overallScore >= 70 ? 'text-mint-300' : h.overallScore >= 40 ? 'text-amber-300' : 'text-ember-400'
                  }`}
                >
                  {h.overallScore}/100
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
