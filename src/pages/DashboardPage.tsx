import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ArrowRight, Flame, Trophy, Target } from 'lucide-react';
import { modules, phases } from '../data';
import { XpBar } from '../components/ui/XpBar';
import { StreakMap } from '../components/ui/StreakMap';
import type { UserProgress } from '../data/types';
import { achievements } from '../data/achievements';

interface DashboardPageProps {
  progress: UserProgress;
  overallPercent: number;
}

const phaseColor: Record<number, string> = {
  1: 'border-mint-400/30 bg-mint-900/10',
  2: 'border-amber-400/30 bg-amber-500/10',
  3: 'border-violet-400/30 bg-violet-500/10',
};

export function DashboardPage({ progress, overallPercent }: DashboardPageProps) {
  const currentModule = modules.find((m) => m.id === progress.currentModuleId) ?? modules[0];
  const unlockedCount = progress.unlockedAchievements.length;
  const completedExerciseCount = Object.values(progress.completedExercises).filter(Boolean).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      <div className="mb-8 animate-rise-in">
        <p className="font-mono text-xs uppercase tracking-widest text-mint-400">Bem-vindo de volta</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-base-50 sm:text-4xl">
          Sua jornada Full Stack
        </h1>
        <p className="mt-2 max-w-2xl text-base-300">
          18 meses, 3 fases, do zero ao sênior. Continue de onde parou — cada exercício e checklist te aproxima da meta.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={<Target size={16} />} label="Progresso geral" value={`${overallPercent}%`} accent="mint" />
        <StatCard icon={<Flame size={16} />} label="Sequência atual" value={`${progress.streakDays} dias`} accent="amber" />
        <StatCard icon={<Trophy size={16} />} label="Conquistas" value={`${unlockedCount}/${achievements.length}`} accent="violet" />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Link
          to={`/modulo/${currentModule.id}`}
          className="group relative overflow-hidden rounded-2xl border border-base-700 bg-base-850 p-6 transition-colors hover:border-mint-400/40"
        >
          <div className="absolute -right-8 -top-8 text-8xl opacity-10">{currentModule.emoji}</div>
          <p className="font-mono text-xs uppercase tracking-wide text-base-400">
            Continue estudando · Mês {currentModule.month}
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-base-50">{currentModule.title}</h2>
          <p className="mt-1 text-sm text-base-300">{currentModule.tagline}</p>
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-mint-400">
            Continuar de onde parou <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
        <XpBar xp={progress.xp} />
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <StreakMap activeDates={progress.activeDates} streakDays={progress.streakDays} />
        <div className="rounded-2xl border border-base-700 bg-base-850 p-4">
          <span className="font-display text-sm font-semibold text-base-50">Seu desempenho</span>
          <div className="mt-3 space-y-2.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-base-300">Exercícios resolvidos</span>
              <span className="mono-num font-semibold text-base-50">{completedExerciseCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base-300">Itens de checklist concluídos</span>
              <span className="mono-num font-semibold text-base-50">
                {Object.values(progress.completedChecklist).filter(Boolean).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base-300">Mini-jogos jogados</span>
              <span className="mono-num font-semibold text-base-50">{Object.keys(progress.gamesScores).length}</span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="mb-4 font-display text-lg font-bold text-base-50">Trilha completa</h2>
      <div className="space-y-6">
        {phases.map((phase) => (
          <div key={phase.phase} className={`rounded-2xl border p-4 ${phaseColor[phase.phase]}`}>
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="font-display text-sm font-bold text-base-50">
                Fase {phase.phase} — {phase.title}
              </h3>
              <span className="text-xs text-base-400">{phase.objective}</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {modules
                .filter((m) => m.phase === phase.phase)
                .map((m) => {
                  const pct = progress.moduleProgress[m.id] ?? 0;
                  return (
                    <Link
                      key={m.id}
                      to={`/modulo/${m.id}`}
                      className="flex items-center gap-3 rounded-xl border border-base-700 bg-base-900/60 p-3 transition-colors hover:border-base-500"
                    >
                      <span className="text-xl">{m.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-base-100">{m.title}</div>
                        <div className="mt-1 h-1 overflow-hidden rounded-full bg-base-700">
                          <div className="h-full rounded-full bg-mint-400" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <span className="mono-num text-[11px] text-base-400">{pct}%</span>
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
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
    <div className="flex items-center gap-3 rounded-2xl border border-base-700 bg-base-850 p-4">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors}`}>{icon}</div>
      <div>
        <div className="font-display text-lg font-bold text-base-50">{value}</div>
        <div className="text-xs text-base-400">{label}</div>
      </div>
    </div>
  );
}
