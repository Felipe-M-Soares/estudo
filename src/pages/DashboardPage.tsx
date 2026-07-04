import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ArrowRight, Flame, Trophy, Target, BookOpenCheck, Gamepad2 } from 'lucide-react';
import { modules } from '../data';
import { moduleMetas, phases } from '../data/moduleMeta';
import { XpBar } from '../components/ui/XpBar';
import { StreakMap } from '../components/ui/StreakMap';
import { SpacedReviewPanel } from '../components/ui/SpacedReviewPanel';
import type { UserProgress } from '../data/types';
import { achievements } from '../data/achievements';
import { careerStage } from '../data/interactiveLearning';

interface DashboardPageProps {
  progress: UserProgress;
  overallPercent: number;
  onReviewResult: (moduleId: string, exerciseId: string, correct: boolean) => void;
}

const phaseStyles: Record<number, { ring: string; text: string; bar: string }> = {
  1: { ring: 'ring-mint-400/20', text: 'text-mint-400', bar: 'bg-mint-400' },
  2: { ring: 'ring-amber-400/20', text: 'text-amber-400', bar: 'bg-amber-400' },
  3: { ring: 'ring-violet-400/20', text: 'text-violet-400', bar: 'bg-violet-400' },
  4: { ring: 'ring-cyan-400/20', text: 'text-cyan-400', bar: 'bg-cyan-400' },
};

export function DashboardPage({ progress, overallPercent, onReviewResult }: DashboardPageProps) {
  const currentModule = moduleMetas.find((m) => m.id === progress.currentModuleId) ?? moduleMetas[0];
  const unlockedCount = progress.unlockedAchievements.length;
  const completedExerciseCount = Object.values(progress.completedExercises).filter(Boolean).length;
  const currentFullModule = modules.find((m) => m.id === currentModule.id);
  const stage = careerStage(overallPercent);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8 lg:px-8">
      <div className="mb-8 animate-rise-in">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-mint-400">
          ⟢ Bem-vindo de volta
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold leading-[1.05] text-base-50 sm:text-5xl">
          Sua jornada <span className="text-gradient-mint">Full Stack</span>
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-base-300">
          22 meses, 4 fases, do zero ao sênior — incluindo extras de mercado (Python, Go, MongoDB, Redis, segurança). Continue de onde parou — cada exercício e checklist te aproxima da meta.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-2.5 sm:gap-3.5">
        <StatCard icon={<Target size={17} />} label="Progresso geral" value={`${overallPercent}%`} accent="mint" />
        <StatCard icon={<Flame size={17} />} label="Sequência atual" value={`${progress.streakDays} ${progress.streakDays === 1 ? 'dia' : 'dias'}`} accent="amber" />
        <StatCard icon={<Trophy size={17} />} label="Conquistas" value={`${unlockedCount}/${achievements.length}`} accent="violet" />
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Link
          to={`/modulo/${currentModule.id}`}
          className="card-surface card-surface-hover group relative overflow-hidden rounded-2xl p-5 sm:p-7"
        >
          <div className="absolute -right-6 -top-6 text-7xl opacity-[0.07] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 sm:text-9xl">
            {currentModule.emoji}
          </div>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mint-400/40 to-transparent" />
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-base-400">
            Continue estudando · Mês {currentModule.month}
          </p>
          <h2 className="mt-2.5 font-display text-2xl font-bold leading-tight text-base-50 sm:text-[1.7rem]">{currentModule.title}</h2>
          <p className="mt-1.5 text-sm text-base-300">{currentModule.tagline}</p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-mint-400/10 px-3.5 py-1.5 text-sm font-semibold text-mint-300 ring-1 ring-mint-400/20 transition-colors group-hover:bg-mint-400/15">
            Continuar de onde parou <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
        <XpBar xp={progress.xp} />
      </div>

      <div className="mb-7">
        <SpacedReviewPanel spacedReview={progress.spacedReview} onReviewResult={onReviewResult} />
      </div>


      <div className="mb-7 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="card-surface rounded-2xl p-5">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-mint-400">Carreira simulada</p>
          <h2 className="mt-1 font-display text-xl font-bold text-base-50">{stage.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-base-300">Próxima evolução: {stage.next}. As novas abas de contexto, debug e sprints transformam cada módulo em treino de trabalho real.</p>
          <Link to={`/modulo/${currentModule.id}`} className="mt-4 inline-flex items-center gap-2 rounded-full bg-mint-400/10 px-3.5 py-1.5 text-sm font-semibold text-mint-300 ring-1 ring-mint-400/20">Abrir missão atual <ArrowRight size={14} /></Link>
        </div>
        <div className="card-surface rounded-2xl p-5">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-300">Árvore de habilidades</p>
          <div className="mt-3 space-y-2">
            {currentFullModule?.skillNodes?.slice(0, 4).map((skill) => (
              <div key={skill.id} className="rounded-xl border border-base-700 bg-base-900/50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-medium text-base-100">{skill.label}</span>
                  <span className="font-mono text-xs text-violet-200">{'★'.repeat(skill.level)}{'☆'.repeat(5 - skill.level)}</span>
                </div>
                <p className="mt-1 text-xs text-base-400">{skill.evidence}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-7 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <StreakMap activeDates={progress.activeDates} streakDays={progress.streakDays} />
        <div className="card-surface rounded-2xl p-5">
          <span className="font-display text-sm font-semibold text-base-50">Seu desempenho</span>
          <div className="mt-3.5 space-y-3 text-sm">
            <PerformanceRow icon={<BookOpenCheck size={14} />} label="Exercícios resolvidos" value={completedExerciseCount} />
            <PerformanceRow
              icon={<Target size={14} />}
              label="Itens de checklist concluídos"
              value={Object.values(progress.completedChecklist).filter(Boolean).length}
            />
            <PerformanceRow icon={<Gamepad2 size={14} />} label="Mini-jogos jogados" value={Object.keys(progress.gamesScores).length} />
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <h2 className="font-display text-lg font-bold text-base-50">Trilha completa</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-base-700 to-transparent" />
      </div>
      <div className="space-y-5">
        {phases.map((phase) => {
          const style = phaseStyles[phase.phase];
          const phaseModules = moduleMetas.filter((m) => m.phase === phase.phase);
          const donePct = Math.round(
            (phaseModules.reduce((acc, m) => acc + (progress.moduleProgress[m.id] ?? 0), 0) / (phaseModules.length * 100)) * 100
          );
          return (
            <div key={phase.phase} className={`card-surface rounded-2xl p-5 ring-1 ${style.ring}`}>
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className={`h-2 w-2 rounded-full ${style.bar}`} />
                  <h3 className="font-display text-[15px] font-bold text-base-50">
                    Fase {phase.phase} — {phase.title}
                  </h3>
                  <span className={`mono-num rounded-full bg-base-900 px-2 py-0.5 text-[11px] font-semibold ${style.text}`}>{donePct}%</span>
                </div>
                <span className="text-xs text-base-400">{phase.objective}</span>
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {phaseModules.map((m) => {
                  const pct = progress.moduleProgress[m.id] ?? 0;
                  return (
                    <Link
                      key={m.id}
                      to={`/modulo/${m.id}`}
                      className="group flex items-center gap-3 rounded-xl border border-base-700 bg-base-900/70 p-3 transition-all hover:border-base-500 hover:bg-base-900"
                    >
                      <span className="text-xl transition-transform group-hover:scale-110">{m.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-base-100">{m.title}</div>
                        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-base-700">
                          <div className={`h-full rounded-full ${style.bar} transition-all duration-500`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <span className="mono-num text-[11px] text-base-400">{pct}%</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PerformanceRow({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-base-300">
        <span className="text-base-500">{icon}</span>
        {label}
      </span>
      <span className="mono-num font-semibold text-base-50">{value}</span>
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: ReactNode; label: string; value: string; accent: 'mint' | 'amber' | 'violet' }) {
  const colors = {
    mint: 'text-mint-400 bg-mint-900/30',
    amber: 'text-amber-400 bg-amber-500/15',
    violet: 'text-violet-400 bg-violet-500/15',
  }[accent];
  return (
    <div className="card-surface card-surface-hover flex flex-col items-center gap-2 rounded-2xl p-3 text-center sm:flex-row sm:items-center sm:gap-3.5 sm:p-4 sm:text-left">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10 ${colors}`}>{icon}</div>
      <div className="min-w-0">
        <div className="font-display text-base font-bold leading-tight text-base-50 sm:text-xl">{value}</div>
        <div className="text-[10.5px] leading-snug text-base-400 sm:text-[12px]">{label}</div>
      </div>
    </div>
  );
}
