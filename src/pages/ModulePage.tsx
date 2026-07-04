import { useEffect, useState, type ReactNode } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink, CheckCircle2, Circle, Sparkles, Map, Swords, BookOpen, Bug, Building2, Gamepad2, ClipboardCheck, Hammer } from 'lucide-react';
import { modulesById, getNextModule, getPrevModule } from '../data';
import { MarkdownLite } from '../components/ui/MarkdownLite';
import { ExerciseRouter } from '../components/ui/ExerciseRouter';
import { gameRegistry } from '../components/games/registry';
import { diagramRegistry } from '../components/diagrams/registry';
import { ScenarioCard } from '../components/ui/ScenarioCard';
import { StoryLessonCard } from '../components/ui/StoryLessonCard';
import { DebugCaseCard } from '../components/ui/DebugCaseCard';
import { ProjectNotesPanel } from '../components/ui/ProjectNotesPanel';
import type { UserProgress } from '../data/types';
import { GameIcon } from '../components/ui/GameIcon';

interface ModulePageProps {
  progress: UserProgress;
  onToggleChecklist: (moduleId: string, itemId: string) => void;
  onExerciseResult: (moduleId: string, exerciseId: string, correct: boolean) => void;
  onGameComplete: (gameId: string, score: number) => void;
  onSetCurrentModule: (moduleId: string) => void;
  onSaveProjectNote: (moduleId: string, text: string, links: { label: string; url: string }[]) => void;
}

type Tab = 'conteudo' | 'historia' | 'debug' | 'sprints' | 'diaadia' | 'exercicios' | 'jogos' | 'checklist' | 'projeto';

const phaseAccent: Record<number, { bar: string; chip: string }> = {
  1: { bar: 'bg-mint-400', chip: 'bg-mint-400 text-base-950' },
  2: { bar: 'bg-amber-400', chip: 'bg-amber-400 text-base-950' },
  3: { bar: 'bg-violet-400', chip: 'bg-violet-400 text-base-950' },
  4: { bar: 'bg-cyan-400', chip: 'bg-cyan-400 text-base-950' },
};

export function ModulePage({ progress, onToggleChecklist, onExerciseResult, onGameComplete, onSetCurrentModule, onSaveProjectNote }: ModulePageProps) {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const mod = moduleId ? modulesById[moduleId] : undefined;
  const [tab, setTab] = useState<Tab>('conteudo');
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  useEffect(() => {
    if (mod) {
      onSetCurrentModule(mod.id);
      setTab('conteudo');
      setActiveGameId(null);
      window.scrollTo({ top: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mod?.id]);

  if (!mod) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-base-300">Módulo não encontrado.</p>
        <Link to="/" className="mt-3 inline-block text-mint-400 hover:underline">Voltar ao painel</Link>
      </div>
    );
  }

  const next = getNextModule(mod.id);
  const prev = getPrevModule(mod.id);
  const pct = progress.moduleProgress[mod.id] ?? 0;
  const accent = phaseAccent[mod.phase];

  const exercisesDone = mod.exercises.filter((e) => progress.completedExercises[e.id]).length;
  const checklistDone = mod.checklist.filter((c) => progress.completedChecklist[c.id]).length;
  const gamesPlayed = mod.games.filter((g) => progress.gamesScores[g.gameId] !== undefined).length;

  const tabs: { id: Tab; label: string; show: boolean; badge?: string }[] = [
    { id: 'conteudo', label: 'Conteúdo', show: true },
    { id: 'historia', label: 'Aulas com contexto', show: !!mod.storyLessons?.length, badge: `${mod.storyLessons?.length ?? 0}` },
    { id: 'debug', label: 'Debug', show: !!mod.debugCases?.length, badge: `${mod.debugCases?.length ?? 0}` },
    { id: 'sprints', label: 'Sprints', show: !!mod.sprintLab },
    { id: 'diaadia', label: 'Dia a Dia', show: !!mod.scenarios && mod.scenarios.length > 0 },
    { id: 'exercicios', label: 'Exercícios', show: true, badge: mod.exercises.length > 0 ? `${exercisesDone}/${mod.exercises.length}` : undefined },
    { id: 'jogos', label: 'Jogos', show: mod.games.length > 0, badge: mod.games.length > 0 ? `${gamesPlayed}/${mod.games.length}` : undefined },
    { id: 'checklist', label: 'Checklist', show: true, badge: mod.checklist.length > 0 ? `${checklistDone}/${mod.checklist.length}` : undefined },
    { id: 'projeto', label: 'Projeto', show: !!mod.projectBrief },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:py-8 lg:px-6">
      <Link to="/" className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-base-700 bg-base-900/60 px-3 py-2 text-sm font-bold text-base-300 transition-colors hover:text-base-100">
        <ArrowLeft size={14} /> Command Center
      </Link>

      <div className="game-frame quest-map relative mb-5 overflow-hidden rounded-[2rem] p-5 sm:p-7 animate-rise-in">
        <div className="absolute -right-10 -top-12 text-[9rem] opacity-[0.07]">{mod.emoji}</div>
        <div className="relative grid gap-5 lg:grid-cols-[1fr_280px] lg:items-end">
          <div>
            <p className="font-mono text-[11px] font-black uppercase tracking-[0.18em] text-base-400">Mundo {mod.phase} · Mês {mod.month}</p>
            <h1 className="mt-2 font-display text-3xl font-black leading-tight text-base-50 sm:text-5xl">{mod.title}</h1>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-base-300">{mod.tagline}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1.5 text-xs font-black ${accent.chip}`}>Missão principal</span>
              <span className="rounded-full border border-base-700 bg-base-950/50 px-3 py-1.5 text-xs font-bold text-base-300">{mod.exercises.length} exercícios</span>
              <span className="rounded-full border border-base-700 bg-base-950/50 px-3 py-1.5 text-xs font-bold text-base-300">{mod.games.length} jogos</span>
              <span className="rounded-full border border-base-700 bg-base-950/50 px-3 py-1.5 text-xs font-bold text-base-300">{mod.checklist.length} tickets</span>
            </div>
          </div>
          <div className="hud-card p-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-bold text-base-400">Progresso da missão</span>
              <span className="mono-num font-black text-base-100">{pct}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-base-700/80 ring-1 ring-black/20">
              <div className={`h-full rounded-full ${accent.bar} transition-all duration-500`} style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
              <MiniCounter label="XP" value={progress.xp} />
              <MiniCounter label="Jogos" value={gamesPlayed} />
              <MiniCounter label="Tasks" value={checklistDone} />
            </div>
          </div>
        </div>
      </div>

      <div className="module-workbench">
        <aside className="hud-card sticky top-[calc(var(--topbar-h,80px)+1rem)] z-10 p-3 lg:z-auto">
          <div className="mb-3 flex items-center gap-2 px-2 font-mono text-[11px] font-black uppercase tracking-[0.16em] text-base-400"><Map size={13} /> Menu da fase</div>
          <div className="tab-dock scrollbar-none">
            {tabs.filter((t) => t.show).map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex shrink-0 items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold transition-all lg:w-full ${tab === t.id ? `${accent.chip} shadow-[0_10px_26px_-18px_rgba(0,0,0,0.7)]` : 'bg-base-950/40 text-base-300 ring-1 ring-base-700 hover:bg-base-800 hover:text-base-100'}`}>
                <span className="text-base">{tabIcon(t.id)}</span>
                <span className="min-w-0 flex-1 truncate">{t.label}</span>
                {t.badge && <span className={`mono-num rounded-full px-2 py-0.5 text-[10px] font-black ${tab === t.id ? 'bg-base-950/18' : 'bg-base-800 text-base-400'}`}>{t.badge}</span>}
              </button>
            ))}
          </div>
        </aside>

        <section className="min-w-0">
          {tab === 'conteudo' && (
            <div className="space-y-5 animate-rise-in">
              <p className="hud-card rounded-2xl p-4 text-[15px] leading-relaxed text-base-200">{mod.intro}</p>
              {mod.lessons.map((lesson) => (
                <div key={lesson.id} className="hud-card hud-card-hover rounded-2xl p-5">
                  <h3 className="mb-3 font-display text-base font-bold text-mint-300">{lesson.heading}</h3>
                  <MarkdownLite text={lesson.body} />
                  {lesson.codeExample && <pre className="mt-3 overflow-x-auto rounded-xl border border-base-700 bg-base-950/60 p-4 shadow-inner"><div className="mb-2 font-mono text-[11px] uppercase tracking-wide text-base-400">{lesson.codeExample.lang}</div><code className="font-mono text-[13px] leading-relaxed text-mint-200">{lesson.codeExample.code}</code></pre>}
                  {lesson.diagramId && diagramRegistry[lesson.diagramId] && <div className="mt-3">{diagramRegistry[lesson.diagramId]()}</div>}
                </div>
              ))}
              <div className="hud-card rounded-2xl p-5">
                <h3 className="mb-3 font-display text-base font-bold text-base-50">🔗 Links de Estudo</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {mod.resources.map((r) => <a key={r.url} href={r.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-2 rounded-xl border border-base-600 bg-base-900/40 px-3.5 py-2.5 text-sm text-base-200 transition-all hover:border-mint-400/40 hover:bg-base-800">{r.label}<ExternalLink size={13} className="shrink-0 text-base-500" /></a>)}
                </div>
              </div>
            </div>
          )}

          {tab === 'historia' && mod.storyLessons && <div className="space-y-5 animate-rise-in"><div className="rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm leading-relaxed text-amber-100">Cada aula começa com problema, escolha, consequência e descoberta. Isso transforma teoria em decisão prática.</div>{mod.storyLessons.map((story) => <StoryLessonCard key={story.id} story={story} />)}</div>}
          {tab === 'debug' && mod.debugCases && <div className="space-y-5 animate-rise-in"><div className="rounded-xl border border-cyan-400/25 bg-cyan-500/10 px-4 py-3 text-sm leading-relaxed text-cyan-100">Aqui o estudo vira investigação: leia o sintoma, escolha a causa provável e compare com a correção.</div>{mod.debugCases.map((item) => <DebugCaseCard key={item.id} item={item} />)}</div>}
          {tab === 'sprints' && mod.sprintLab && <div className="space-y-4 animate-rise-in"><div className="hud-card rounded-2xl p-5"><p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-300">Simulador de empresa</p><h3 className="mt-1 font-display text-xl font-bold text-base-50">{mod.sprintLab.title}</h3><p className="mt-2 text-sm leading-relaxed text-base-300">Você atua como {mod.sprintLab.role} em {mod.sprintLab.company}. Complete as entregas como se fossem tickets reais.</p></div>{mod.sprintLab.sprints.map((sprint, index) => <div key={sprint.title} className="hud-card rounded-2xl p-5"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/15 font-mono text-xs font-bold text-violet-200 ring-1 ring-violet-400/20">{index + 1}</span><h3 className="font-display text-base font-bold text-base-50">{sprint.title}</h3></div><p className="mt-3 text-sm leading-relaxed text-base-200">Objetivo: {sprint.objective}</p><p className="mt-2 rounded-xl border border-base-700 bg-base-950/40 p-3 text-sm text-base-300">Entrega: {sprint.deliverable}</p></div>)}</div>}
          {tab === 'diaadia' && mod.scenarios && <div className="space-y-4 animate-rise-in"><p className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 px-4 py-2.5 text-sm text-base-200">🌍 Onde isso aparece de verdade — no trabalho de um dev e no dia a dia comum. Toque em cada card para expandir.</p>{mod.scenarios.map((scenario) => <ScenarioCard key={scenario.id} scenario={scenario} />)}</div>}
          {tab === 'exercicios' && <div className="space-y-5 animate-rise-in"><div className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-200"><Sparkles size={14} />{Object.values(progress.completedExercises).filter((v) => v).length > 0 ? 'Continue praticando — cada acerto te dá XP.' : 'Resolva os exercícios abaixo para fixar o conteúdo e ganhar XP.'}</div>{mod.exercises.map((ex) => <ExerciseRouter key={ex.id} exercise={ex} onResult={(correct) => onExerciseResult(mod.id, ex.id, correct)} />)}</div>}
          {tab === 'jogos' && <div className="space-y-5 animate-rise-in">{!activeGameId ? <div className="grid gap-3 sm:grid-cols-2">{mod.games.map((g) => { const best = progress.gamesScores[g.gameId]; return <button key={g.gameId} onClick={() => setActiveGameId(g.gameId)} className="arcade-card group flex gap-4 p-4 text-left"><GameIcon gameId={g.gameId} className="transition-transform group-hover:scale-105" /><span className="flex min-w-0 flex-1 flex-col gap-1.5"><span className="font-display text-sm font-bold text-base-50">{g.label}</span><span className="text-xs leading-relaxed text-base-400">{g.description}</span></span>{best !== undefined && <span className="mt-1 inline-flex items-center gap-1 self-start rounded-full bg-mint-900/40 px-2 py-0.5 text-[11px] font-semibold text-mint-300">Melhor: {best}%</span>}</button>; })}</div> : <div><button onClick={() => setActiveGameId(null)} className="mb-3 inline-flex items-center gap-1.5 text-sm text-base-400 hover:text-base-100"><ArrowLeft size={14} /> Todos os jogos</button>{gameRegistry[activeGameId]?.render((score) => onGameComplete(activeGameId, score))}</div>}</div>}
          {tab === 'checklist' && <div className="space-y-5 animate-rise-in"><div className="space-y-2">{mod.checklist.map((item) => { const done = !!progress.completedChecklist[item.id]; return <button key={item.id} onClick={() => onToggleChecklist(mod.id, item.id)} className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${done ? 'border-mint-400/40 bg-mint-900/20 text-mint-100' : 'hud-card text-base-200 hover:border-base-500'}`}>{done ? <CheckCircle2 size={18} className="shrink-0 text-mint-400" /> : <Circle size={18} className="shrink-0 text-base-500" />}<span className={done ? 'line-through opacity-80' : ''}>{item.label}</span></button>; })}</div><div className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-200">🎯 {mod.goalLabel}</div><ProjectNotesPanel moduleId={mod.id} existingNote={progress.projectNotes[mod.id]} onSave={onSaveProjectNote} /></div>}
          {tab === 'projeto' && mod.projectBrief && <div className="space-y-4 animate-rise-in"><div className="rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-500/10 via-base-850 to-base-850 p-5"><h3 className="font-display text-lg font-bold text-base-50">🎯 {mod.projectBrief.title}</h3><p className="text-base-200">{mod.projectBrief.description}</p><div className="mt-3"><p className="mb-2 text-sm font-semibold text-violet-300">Requisitos:</p><ul className="space-y-1.5">{mod.projectBrief.requirements.map((req, idx) => <li key={idx} className="flex gap-2 text-sm text-base-200"><span className="text-violet-400">›</span> {req}</li>)}</ul></div></div><ProjectNotesPanel moduleId={mod.id} existingNote={progress.projectNotes[mod.id]} onSave={onSaveProjectNote} /></div>}
        </section>
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-base-700 pt-6 sm:flex-row sm:items-center sm:justify-between">
        {prev ? <button onClick={() => navigate(`/modulo/${prev.id}`)} className="flex min-w-0 items-center gap-1.5 rounded-lg py-2 text-sm text-base-300 transition-colors hover:text-base-100 sm:py-0"><ArrowLeft size={14} className="shrink-0" /> <span className="truncate">{prev.title}</span></button> : <span />}
        {next && <button onClick={() => navigate(`/modulo/${next.id}`)} className="flex min-w-0 items-center justify-end gap-1.5 rounded-lg py-2 text-sm font-semibold text-mint-400 transition-colors hover:text-mint-300 sm:py-0 sm:self-auto"><span className="truncate">{next.title}</span> <ArrowRight size={14} className="shrink-0" /></button>}
      </div>
    </div>
  );
}

function tabIcon(tab: Tab) {
  const icons: Record<Tab, ReactNode> = {
    conteudo: <BookOpen size={16} />,
    historia: <Swords size={16} />,
    debug: <Bug size={16} />,
    sprints: <Building2 size={16} />,
    diaadia: <Map size={16} />,
    exercicios: <Sparkles size={16} />,
    jogos: <Gamepad2 size={16} />,
    checklist: <ClipboardCheck size={16} />,
    projeto: <Hammer size={16} />,
  };
  return icons[tab];
}

function MiniCounter({ label, value }: { label: string; value: number }) {
  return <div className="rounded-xl border border-base-700 bg-base-950/45 px-2 py-2"><div className="mono-num text-sm font-black text-base-50">{value}</div><div className="text-[10px] uppercase tracking-wide text-base-500">{label}</div></div>;
}
