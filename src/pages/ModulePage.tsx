import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink, CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { modulesById, getNextModule, getPrevModule } from '../data';
import { MarkdownLite } from '../components/ui/MarkdownLite';
import { ExerciseRouter } from '../components/ui/ExerciseRouter';
import { gameRegistry } from '../components/games/registry';
import { diagramRegistry } from '../components/diagrams/registry';
import { ScenarioCard } from '../components/ui/ScenarioCard';
import { ProjectNotesPanel } from '../components/ui/ProjectNotesPanel';
import type { UserProgress } from '../data/types';

interface ModulePageProps {
  progress: UserProgress;
  onToggleChecklist: (moduleId: string, itemId: string) => void;
  onExerciseResult: (moduleId: string, exerciseId: string, correct: boolean) => void;
  onGameComplete: (gameId: string, score: number) => void;
  onSetCurrentModule: (moduleId: string) => void;
  onSaveProjectNote: (moduleId: string, text: string, links: { label: string; url: string }[]) => void;
}

type Tab = 'conteudo' | 'diaadia' | 'exercicios' | 'jogos' | 'checklist' | 'projeto';

const phaseAccent: Record<number, { bar: string; glow: string; chip: string }> = {
  1: { bar: 'bg-mint-400', glow: 'from-mint-500/15', chip: 'bg-mint-400 text-base-950' },
  2: { bar: 'bg-amber-400', glow: 'from-amber-500/15', chip: 'bg-amber-400 text-base-950' },
  3: { bar: 'bg-violet-400', glow: 'from-violet-500/15', chip: 'bg-violet-400 text-base-950' },
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
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
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
    { id: 'conteudo', label: '📖 Conteúdo', show: true },
    { id: 'diaadia', label: '🌍 Dia a Dia', show: !!mod.scenarios && mod.scenarios.length > 0 },
    {
      id: 'exercicios',
      label: '✍️ Exercícios',
      show: true,
      badge: mod.exercises.length > 0 ? `${exercisesDone}/${mod.exercises.length}` : undefined,
    },
    {
      id: 'jogos',
      label: '🎮 Jogos',
      show: mod.games.length > 0,
      badge: mod.games.length > 0 ? `${gamesPlayed}/${mod.games.length}` : undefined,
    },
    {
      id: 'checklist',
      label: '✅ Checklist',
      show: true,
      badge: mod.checklist.length > 0 ? `${checklistDone}/${mod.checklist.length}` : undefined,
    },
    { id: 'projeto', label: '🏗️ Projeto', show: !!mod.projectBrief },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <Link to="/" className="mb-4 inline-flex items-center gap-1.5 text-sm text-base-400 transition-colors hover:text-base-100">
        <ArrowLeft size={14} /> Painel
      </Link>

      <div className={`relative mb-6 overflow-hidden rounded-2xl border border-base-700 bg-gradient-to-br ${accent.glow} via-base-850 to-base-850 p-6 animate-rise-in`}>
        <div className="absolute -right-10 -top-10 text-[7rem] opacity-[0.08]">{mod.emoji}</div>
        <div className="flex items-center gap-3.5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-base-900/60 text-3xl ring-1 ring-base-600">{mod.emoji}</span>
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-base-400">Mês {mod.month} · Fase {mod.phase}</p>
            <h1 className="font-display text-2xl font-bold leading-tight text-base-50 sm:text-3xl">{mod.title}</h1>
          </div>
        </div>
        <p className="mt-3 text-[15px] text-base-300">{mod.tagline}</p>
        <div className="mt-4 flex items-center gap-2.5">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-base-700/80 ring-1 ring-black/20">
            <div className={`h-full rounded-full ${accent.bar} transition-all duration-500`} style={{ width: `${pct}%` }} />
          </div>
          <span className="mono-num text-xs font-semibold text-base-300">{pct}%</span>
        </div>
      </div>

      <div className="mb-6 flex gap-1.5 overflow-x-auto scrollbar-none">
        {tabs.filter((t) => t.show).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
              tab === t.id ? `${accent.chip} shadow-[0_2px_10px_-3px_rgba(0,0,0,0.4)]` : 'bg-base-800 text-base-300 hover:bg-base-700'
            }`}
          >
            {t.label}
            {t.badge && (
              <span
                className={`mono-num rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  tab === t.id ? 'bg-base-950/20' : 'bg-base-700 text-base-400'
                }`}
              >
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'conteudo' && (
        <div className="space-y-5 animate-rise-in">
          <p className="card-surface rounded-2xl p-4 text-[15px] leading-relaxed text-base-200">{mod.intro}</p>
          {mod.lessons.map((lesson) => (
            <div key={lesson.id} className="card-surface card-surface-hover rounded-2xl p-5">
              <h3 className="mb-3 font-display text-base font-bold text-mint-300">{lesson.heading}</h3>
              <MarkdownLite text={lesson.body} />
              {lesson.codeExample && (
                <pre className="mt-3 overflow-x-auto rounded-xl border border-base-700 bg-base-950/60 p-4 shadow-inner">
                  <div className="mb-2 font-mono text-[11px] uppercase tracking-wide text-base-400">{lesson.codeExample.lang}</div>
                  <code className="font-mono text-[13px] leading-relaxed text-mint-200">{lesson.codeExample.code}</code>
                </pre>
              )}
              {lesson.diagramId && diagramRegistry[lesson.diagramId] && (
                <div className="mt-3">{diagramRegistry[lesson.diagramId]()}</div>
              )}
            </div>
          ))}

          <div className="card-surface rounded-2xl p-5">
            <h3 className="mb-3 font-display text-base font-bold text-base-50">🔗 Links de Estudo</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {mod.resources.map((r) => (
                <a
                  key={r.url}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-2 rounded-xl border border-base-600 bg-base-900/40 px-3.5 py-2.5 text-sm text-base-200 transition-all hover:border-mint-400/40 hover:bg-base-800"
                >
                  {r.label}
                  <ExternalLink size={13} className="shrink-0 text-base-500" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'diaadia' && mod.scenarios && (
        <div className="space-y-4 animate-rise-in">
          <p className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 px-4 py-2.5 text-sm text-base-200">
            🌍 Onde isso aparece de verdade — no trabalho de um dev e no dia a dia comum. Toque em cada card para expandir.
          </p>
          {mod.scenarios.map((scenario) => (
            <ScenarioCard key={scenario.id} scenario={scenario} />
          ))}
        </div>
      )}

      {tab === 'exercicios' && (
        <div className="space-y-5 animate-rise-in">
          <div className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-200">
            <Sparkles size={14} />
            {Object.values(progress.completedExercises).filter((v) => v).length > 0
              ? 'Continue praticando — cada acerto te dá XP.'
              : 'Resolva os exercícios abaixo para fixar o conteúdo e ganhar XP.'}
          </div>
          {mod.exercises.map((ex) => (
            <ExerciseRouter
              key={ex.id}
              exercise={ex}
              onResult={(correct) => onExerciseResult(mod.id, ex.id, correct)}
            />
          ))}
        </div>
      )}

      {tab === 'jogos' && (
        <div className="space-y-5 animate-rise-in">
          {!activeGameId ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {mod.games.map((g) => {
                const best = progress.gamesScores[g.gameId];
                return (
                  <button
                    key={g.gameId}
                    onClick={() => setActiveGameId(g.gameId)}
                    className="card-surface card-surface-hover flex flex-col gap-1.5 rounded-2xl p-4 text-left"
                  >
                    <span className="font-display text-sm font-bold text-base-50">{g.label}</span>
                    <span className="text-xs text-base-400">{g.description}</span>
                    {best !== undefined && (
                      <span className="mt-1 inline-flex items-center gap-1 self-start rounded-full bg-mint-900/40 px-2 py-0.5 text-[11px] font-semibold text-mint-300">
                        Melhor: {best}%
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div>
              <button onClick={() => setActiveGameId(null)} className="mb-3 inline-flex items-center gap-1.5 text-sm text-base-400 hover:text-base-100">
                <ArrowLeft size={14} /> Todos os jogos
              </button>
              {gameRegistry[activeGameId]?.render((score) => onGameComplete(activeGameId, score))}
            </div>
          )}
        </div>
      )}

      {tab === 'checklist' && (
        <div className="space-y-5 animate-rise-in">
          <div className="space-y-2">
            {mod.checklist.map((item) => {
              const done = !!progress.completedChecklist[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => onToggleChecklist(mod.id, item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                    done ? 'border-mint-400/40 bg-mint-900/20 text-mint-100' : 'card-surface text-base-200 hover:border-base-500'
                  }`}
                >
                  {done ? <CheckCircle2 size={18} className="shrink-0 text-mint-400" /> : <Circle size={18} className="shrink-0 text-base-500" />}
                  <span className={done ? 'line-through opacity-80' : ''}>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-200">
            🎯 {mod.goalLabel}
          </div>
          <ProjectNotesPanel moduleId={mod.id} existingNote={progress.projectNotes[mod.id]} onSave={onSaveProjectNote} />
        </div>
      )}

      {tab === 'projeto' && mod.projectBrief && (
        <div className="space-y-4 animate-rise-in">
          <div className="rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-500/10 via-base-850 to-base-850 p-5">
            <h3 className="font-display text-lg font-bold text-base-50">🎯 {mod.projectBrief.title}</h3>
            <p className="text-base-200">{mod.projectBrief.description}</p>
            <div className="mt-3">
              <p className="mb-2 text-sm font-semibold text-violet-300">Requisitos:</p>
              <ul className="space-y-1.5">
                {mod.projectBrief.requirements.map((req, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-base-200">
                    <span className="text-violet-400">›</span> {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ProjectNotesPanel moduleId={mod.id} existingNote={progress.projectNotes[mod.id]} onSave={onSaveProjectNote} />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between border-t border-base-700 pt-6">
        {prev ? (
          <button onClick={() => navigate(`/modulo/${prev.id}`)} className="flex items-center gap-1.5 text-sm text-base-300 transition-colors hover:text-base-100">
            <ArrowLeft size={14} /> {prev.title}
          </button>
        ) : <span />}
        {next && (
          <button onClick={() => navigate(`/modulo/${next.id}`)} className="flex items-center gap-1.5 text-sm font-semibold text-mint-400 transition-colors hover:text-mint-300">
            {next.title} <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
