import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ArrowRight, Flame, Trophy, Target, BookOpenCheck, Gamepad2, Swords, Briefcase, CheckCircle2, Cpu, Layers3 } from 'lucide-react';
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

const phaseStyles: Record<number, { ring: string; text: string; bar: string; glow: string }> = {
  1: { ring: 'ring-mint-400/20', text: 'text-mint-300', bar: 'bg-mint-400', glow: 'from-mint-400/12' },
  2: { ring: 'ring-amber-400/20', text: 'text-amber-300', bar: 'bg-amber-400', glow: 'from-amber-400/12' },
  3: { ring: 'ring-violet-400/20', text: 'text-violet-300', bar: 'bg-violet-400', glow: 'from-violet-400/12' },
  4: { ring: 'ring-cyan-400/20', text: 'text-cyan-300', bar: 'bg-cyan-400', glow: 'from-cyan-400/12' },
};

export function DashboardPage({ progress, overallPercent, onReviewResult }: DashboardPageProps) {
  const currentModule = moduleMetas.find((m) => m.id === progress.currentModuleId) ?? moduleMetas[0];
  const unlockedCount = progress.unlockedAchievements.length;
  const completedExerciseCount = Object.values(progress.completedExercises).filter(Boolean).length;
  const currentFullModule = modules.find((m) => m.id === currentModule.id);
  const stage = careerStage(overallPercent);
  const checklistCount = Object.values(progress.completedChecklist).filter(Boolean).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:py-8 lg:px-6">
      <section className="mb-5 grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_390px]">
        <div className="game-frame quest-map pixel-corner relative overflow-hidden rounded-[2rem] p-5 sm:p-7 lg:p-8">
          <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full bg-cyan-400/12 blur-3xl" />
          <div className="absolute bottom-8 right-8 hidden text-[11rem] opacity-[0.06] lg:block">{currentModule.emoji}</div>
          <div className="relative max-w-3xl">
            <p className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-mint-300">Command Center · aprendizado rápido</p>
            <h1 className="mt-3 font-display text-4xl font-black leading-[0.98] text-base-50 sm:text-6xl">
              Estude como se estivesse <span className="text-gradient-mint">subindo de nível</span>
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-base-300 sm:text-base">
              A tela agora funciona como um hub: missão atual em destaque, trilha organizada por fases, arcade de prática, carreira simulada e revisão concentrada sem espalhar conteúdo pela página.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={`/modulo/${currentModule.id}`} className="mission-button px-5 py-3 text-sm">
                Iniciar missão atual <ArrowRight size={16} />
              </Link>
              <Link to="/jogos" className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-5 py-3 text-sm font-bold text-violet-200 hover:bg-violet-400/15">
                Abrir arcade <Gamepad2 size={16} />
              </Link>
            </div>
          </div>
        </div>

        <aside className="grid gap-4">
          <div className="hud-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-300">Missão ativa</p>
                <h2 className="mt-1 font-display text-xl font-black leading-tight text-base-50">{currentModule.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-base-400">{currentModule.tagline}</p>
              </div>
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-base-900 text-3xl ring-1 ring-base-700">{currentModule.emoji}</span>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-base-700"><div className="h-full rounded-full bg-gradient-to-r from-mint-400 to-cyan-400" style={{ width: `${progress.moduleProgress[currentModule.id] ?? 0}%` }} /></div>
            <Link to={`/modulo/${currentModule.id}`} className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-base-800 px-4 py-3 text-sm font-bold text-base-100 hover:bg-base-700">
              Continuar aula <ArrowRight size={15} />
            </Link>
          </div>
          <XpBar xp={progress.xp} />
        </aside>
      </section>

      <section className="mb-5 inventory-grid">
        <StatCard icon={<Target size={18} />} label="Progresso geral" value={`${overallPercent}%`} accent="mint" />
        <StatCard icon={<Flame size={18} />} label="Sequência" value={`${progress.streakDays} dias`} accent="amber" />
        <StatCard icon={<Trophy size={18} />} label="Troféus" value={`${unlockedCount}/${achievements.length}`} accent="violet" />
        <StatCard icon={<BookOpenCheck size={18} />} label="Exercícios" value={`${completedExerciseCount}`} accent="cyan" />
      </section>

      <section className="mb-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="hud-card p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="zone-title text-xl">Mapa de fases</h2>
              <p className="mt-2 text-sm text-base-400">Organizado como mundos de jogo: cada fase mostra objetivo, progresso e módulos sem bagunça visual.</p>
            </div>
            <Link to="/academia" className="text-sm font-bold text-mint-300 hover:text-mint-200">Ver academia completa</Link>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {phases.map((phase) => {
              const style = phaseStyles[phase.phase];
              const phaseModules = moduleMetas.filter((m) => m.phase === phase.phase);
              const donePct = Math.round(phaseModules.reduce((acc, m) => acc + (progress.moduleProgress[m.id] ?? 0), 0) / phaseModules.length);
              return (
                <div key={phase.phase} className={`rounded-3xl border border-base-700 bg-gradient-to-br ${style.glow} to-base-900/60 p-4 ring-1 ${style.ring}`}>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className={`font-mono text-[11px] font-bold uppercase tracking-[0.14em] ${style.text}`}>Mundo {phase.phase}</p>
                      <h3 className="font-display text-lg font-black text-base-50">{phase.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-base-400">{phase.objective}</p>
                    </div>
                    <span className="mono-num rounded-2xl bg-base-950/60 px-3 py-2 text-sm font-black text-base-100">{donePct}%</span>
                  </div>
                  <div className="grid gap-2">
                    {phaseModules.map((m) => {
                      const pct = progress.moduleProgress[m.id] ?? 0;
                      return (
                        <Link key={m.id} to={`/modulo/${m.id}`} className="group grid grid-cols-[38px_1fr_auto] items-center gap-3 rounded-2xl border border-base-700/70 bg-base-950/45 p-2.5 transition-all hover:border-base-500 hover:bg-base-900">
                          <span className="grid h-10 w-10 place-items-center rounded-xl bg-base-800 text-xl">{m.emoji}</span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-bold text-base-100">{m.title}</span>
                            <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-base-700"><span className={`block h-full rounded-full ${style.bar}`} style={{ width: `${pct}%` }} /></span>
                          </span>
                          <ArrowRight size={15} className="text-base-500 transition-transform group-hover:translate-x-1 group-hover:text-base-200" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="grid gap-4 content-start">
          <div className="hud-card p-5">
            <h2 className="zone-title text-lg">Carreira simulada</h2>
            <h3 className="mt-3 font-display text-2xl font-black text-base-50">{stage.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-base-300">Próxima evolução: <span className="font-bold text-mint-300">{stage.next}</span>. O progresso agora parece campanha: missão, treino, prova e promoção.</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <MiniBadge icon={<Briefcase size={14} />} label="Tickets" value={checklistCount} />
              <MiniBadge icon={<Swords size={14} />} label="Arena" value={Object.keys(progress.gamesScores).length} />
            </div>
          </div>
          <div className="hud-card p-5">
            <h2 className="zone-title text-lg">Habilidades atuais</h2>
            <div className="mt-4 space-y-2">
              {currentFullModule?.skillNodes?.slice(0, 5).map((skill) => (
                <div key={skill.id} className="rounded-2xl border border-base-700 bg-base-950/45 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-bold text-base-100">{skill.label}</span>
                    <span className="font-mono text-xs text-violet-200">{'★'.repeat(skill.level)}{'☆'.repeat(5 - skill.level)}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-base-500">{skill.evidence}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="hud-card p-5"><StreakMap activeDates={progress.activeDates} streakDays={progress.streakDays} /></div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="hud-card p-5"><SpacedReviewPanel spacedReview={progress.spacedReview} onReviewResult={onReviewResult} /></div>
          <div className="hud-card p-5">
            <h2 className="zone-title text-lg">Resumo do inventário</h2>
            <div className="mt-4 space-y-3 text-sm">
              <PerformanceRow icon={<BookOpenCheck size={15} />} label="Exercícios resolvidos" value={completedExerciseCount} />
              <PerformanceRow icon={<CheckCircle2 size={15} />} label="Checklist concluído" value={checklistCount} />
              <PerformanceRow icon={<Gamepad2 size={15} />} label="Mini-jogos jogados" value={Object.keys(progress.gamesScores).length} />
              <PerformanceRow icon={<Layers3 size={15} />} label="Fases disponíveis" value={phases.length} />
              <PerformanceRow icon={<Cpu size={15} />} label="Módulos totais" value={moduleMetas.length} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MiniBadge({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return <div className="rounded-2xl border border-base-700 bg-base-950/45 p-3"><div className="flex items-center gap-2 text-base-400">{icon}<span>{label}</span></div><div className="mt-1 font-display text-xl font-black text-base-50">{value}</div></div>;
}

function PerformanceRow({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return <div className="flex items-center justify-between rounded-2xl border border-base-700 bg-base-950/40 px-3 py-2.5"><span className="flex items-center gap-2 text-base-300"><span className="text-base-500">{icon}</span>{label}</span><span className="mono-num font-black text-base-50">{value}</span></div>;
}

function StatCard({ icon, label, value, accent }: { icon: ReactNode; label: string; value: string; accent: 'mint' | 'amber' | 'violet' | 'cyan' }) {
  const colors = {
    mint: 'text-mint-300 bg-mint-400/12 ring-mint-400/20',
    amber: 'text-amber-300 bg-amber-400/12 ring-amber-400/20',
    violet: 'text-violet-300 bg-violet-400/12 ring-violet-400/20',
    cyan: 'text-cyan-300 bg-cyan-400/12 ring-cyan-400/20',
  }[accent];
  return (
    <div className="hud-card hud-card-hover flex items-center gap-3 p-4">
      <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ring-1 ${colors}`}>{icon}</div>
      <div className="min-w-0">
        <div className="font-display text-2xl font-black leading-none text-base-50">{value}</div>
        <div className="mt-1 truncate text-xs font-medium text-base-400">{label}</div>
      </div>
    </div>
  );
}
