import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenCheck, Brain, ClipboardCheck, Code2, GraduationCap, Layers3, Rocket, TimerReset } from 'lucide-react';
import { modules } from '../data';
import { idealTracks } from '../data/idealAcademy';
import type { UserProgress } from '../data/types';

interface AcademyPageProps {
  progress: UserProgress;
  overallPercent: number;
}

const pillars = [
  { icon: TimerReset, title: 'Aula rápida', text: 'Conteúdo direto, mas sempre com missão e consequência real.' },
  { icon: BookOpenCheck, title: 'Aula escrita completa', text: 'Explicação em linguagem simples, exemplo mínimo e revisão ativa.' },
  { icon: Code2, title: 'Prática guiada', text: 'Exercício, checklist, projeto e caso de debug no mesmo módulo.' },
  { icon: Brain, title: 'Retenção', text: 'O aluno precisa lembrar, decidir e corrigir antes de avançar.' },
];

export function AcademyPage({ progress, overallPercent }: AcademyPageProps) {
  const completedExercises = Object.values(progress.completedExercises).filter(Boolean).length;
  const completedChecklist = Object.values(progress.completedChecklist).filter(Boolean).length;
  const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const totalExercises = modules.reduce((acc, module) => acc + module.exercises.length, 0);
  const totalProjects = modules.filter((module) => module.projectBrief).length;
  const nextModule = modules.find((module) => (progress.moduleProgress[module.id] ?? 0) < 100) ?? modules[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8 lg:px-8">
      <section className="hero-panel relative mb-6 overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="absolute -right-12 -top-12 text-[10rem] opacity-[0.06]">🎓</div>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-mint-300">Academia ideal</p>
        <h1 className="mt-2 max-w-3xl font-display text-3xl font-bold leading-tight text-base-50 sm:text-5xl">
          Um app de ensino rápido, completo e com contexto de verdade.
        </h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-base-300">
          A reformulação transforma cada módulo em uma experiência completa: aula escrita, missão, exemplo, erro comum, investigação, projeto, revisão ativa e carreira simulada. A ideia é estudar pouco por sessão, mas sair com domínio aplicável.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to={`/modulo/${nextModule.id}`} className="inline-flex items-center gap-2 rounded-full bg-mint-400 px-4 py-2 text-sm font-bold text-base-950 transition-transform hover:scale-[1.02]">
            Começar próxima missão <ArrowRight size={15} />
          </Link>
          <Link to="/laboratorio" className="inline-flex items-center gap-2 rounded-full border border-base-600 bg-base-900/60 px-4 py-2 text-sm font-semibold text-base-100 hover:bg-base-800">
            Abrir laboratório <Rocket size={15} />
          </Link>
        </div>
      </section>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Progresso" value={`${overallPercent}%`} />
        <Metric label="Aulas no app" value={totalLessons} />
        <Metric label="Exercícios" value={`${completedExercises}/${totalExercises}`} />
        <Metric label="Projetos" value={`${totalProjects}`} />
      </div>

      <section className="mb-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="card-surface rounded-2xl p-5">
          <div className="mb-4 flex items-center gap-2">
            <Layers3 size={18} className="text-mint-300" />
            <h2 className="font-display text-xl font-bold text-base-50">Como o app ficou estruturado</h2>
          </div>
          <div className="space-y-3">
            {idealTracks.map((track) => (
              <div key={track.title} className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{track.emoji}</span>
                  <div>
                    <h3 className="font-display text-base font-bold text-base-50">{track.title}</h3>
                    <p className="text-sm text-base-300">{track.description}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {track.steps.map((step) => (
                    <span key={step} className="rounded-full bg-base-800 px-2.5 py-1 text-xs text-base-300 ring-1 ring-base-700">{step}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card-surface rounded-2xl p-5">
            <div className="mb-4 flex items-center gap-2">
              <GraduationCap size={18} className="text-violet-300" />
              <h2 className="font-display text-xl font-bold text-base-50">Pilares da experiência</h2>
            </div>
            <div className="grid gap-3">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div key={pillar.title} className="flex gap-3 rounded-xl border border-base-700 bg-base-900/50 p-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-200"><Icon size={17} /></span>
                    <div>
                      <h3 className="text-sm font-bold text-base-50">{pillar.title}</h3>
                      <p className="text-xs leading-relaxed text-base-400">{pillar.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-2xl border border-amber-400/25 bg-amber-500/10 p-5">
            <div className="flex items-center gap-2 text-amber-200"><ClipboardCheck size={17} /><span className="font-display font-bold">Sua regra de estudo</span></div>
            <p className="mt-2 text-sm leading-relaxed text-amber-100/90">
              Em cada módulo: leia a aula com contexto, resolva pelo menos 3 exercícios, faça um caso de debug, registre uma nota de projeto e finalize a revisão ativa.
            </p>
            <p className="mt-3 text-xs text-amber-100/70">Checklists concluídos: {completedChecklist}</p>
          </div>
        </div>
      </section>

      <section className="card-surface rounded-2xl p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-base-50">Mapa de conteúdo reformulado</h2>
          <span className="rounded-full bg-mint-400/10 px-3 py-1 text-xs font-semibold text-mint-300 ring-1 ring-mint-400/20">22 módulos completos</span>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => {
            const pct = progress.moduleProgress[module.id] ?? 0;
            return (
              <Link key={module.id} to={`/modulo/${module.id}`} className="group rounded-2xl border border-base-700 bg-base-900/60 p-4 transition-all hover:border-mint-400/40 hover:bg-base-900">
                <div className="flex items-start gap-3">
                  <span className="text-2xl transition-transform group-hover:scale-110">{module.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[10px] uppercase tracking-wide text-base-500">Mês {module.month}</p>
                    <h3 className="truncate font-display text-sm font-bold text-base-50">{module.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-base-400">{module.lessons.length} aulas · {module.exercises.length} exercícios · debug · projeto</p>
                  </div>
                  <span className="mono-num text-[11px] text-base-400">{pct}%</span>
                </div>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-base-700"><div className="h-full rounded-full bg-mint-400" style={{ width: `${pct}%` }} /></div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card-surface rounded-2xl p-4">
      <p className="text-xs text-base-400">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-base-50">{value}</p>
    </div>
  );
}
