import { useMemo, useState } from 'react';
import {
  Activity,
  Award,
  BarChart3,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Code2,
  Coins,
  Crown,
  Flame,
  Gamepad2,
  Gem,
  GraduationCap,
  Home,
  Lock,
  Map as MapIcon,
  Menu,
  Moon,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  X,
  Zap,
} from 'lucide-react';
import { modules, totalChecklistCount, totalExerciseCount } from './data';
import type { LessonBlock, Module } from './data/types';
import { diagramRegistry } from './components/diagrams/registry';
import { gameRegistry } from './components/games/registry';
import { GameIcon } from './components/ui/GameIcon';
import { ExerciseRouter } from './components/ui/ExerciseRouter';
import {
  achievementCatalog,
  careerLadder,
  dailyPlan,
  intelligenceCards,
  learningWorlds,
  marketplace,
  mentorActions,
  productStats,
  projectCampaigns,
  reviewQueue,
  seasons,
  skillTree,
  studioFiles,
  type PlatformTheme,
} from './data/platform';

type Screen =
  | 'command'
  | 'worlds'
  | 'learn'
  | 'story'
  | 'lab'
  | 'arcade'
  | 'career'
  | 'review'
  | 'mentor'
  | 'analytics'
  | 'market';

const navItems = [
  { id: 'command', label: 'Command Center', icon: Home },
  { id: 'worlds', label: 'Mundos', icon: MapIcon },
  { id: 'learn', label: 'Sala de Aula', icon: BookOpen },
  { id: 'story', label: 'Modo Historia', icon: Sparkles },
  { id: 'lab', label: 'Laboratorio', icon: Code2 },
  { id: 'arcade', label: 'Arcade', icon: Gamepad2 },
  { id: 'career', label: 'Carreira', icon: BriefcaseBusiness },
  { id: 'review', label: 'Revisao', icon: ShieldCheck },
  { id: 'mentor', label: 'Mentor IA', icon: Bot },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'market', label: 'Loja', icon: Coins },
] as const;

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

function cleanMarkdown(text: string) {
  return text.replace(/\*\*/g, '').replace(/`/g, '').trim();
}

function firstParagraph(text: string) {
  return cleanMarkdown(text).split(/\n\s*\n/)[0] ?? cleanMarkdown(text).slice(0, 220);
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('command');
  const [theme, setTheme] = useState<PlatformTheme>('obsidian');
  const [navOpen, setNavOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeModuleId, setActiveModuleId] = useState(modules[3]?.id ?? modules[0]?.id);
  const [activeLessonId, setActiveLessonId] = useState(modules[3]?.lessons[0]?.id ?? modules[0]?.lessons[0]?.id);
  const [gameScores, setGameScores] = useState<Record<string, number>>({});

  const activeModule = useMemo(
    () => modules.find((module) => module.id === activeModuleId) ?? modules[0],
    [activeModuleId],
  );

  const activeLesson = useMemo(() => {
    return activeModule.lessons.find((lesson) => lesson.id === activeLessonId) ?? activeModule.lessons[0];
  }, [activeLessonId, activeModule]);

  const filteredModules = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return modules;
    return modules.filter((module) => {
      const source = [
        module.title,
        module.tagline,
        module.intro,
        module.track,
        ...module.lessons.map((lesson) => lesson.heading),
      ].join(' ');
      return source.toLowerCase().includes(q);
    });
  }, [query]);

  const metrics = useMemo(() => {
    const lessons = modules.reduce((sum, module) => sum + module.lessons.length, 0);
    const games = modules.reduce((sum, module) => sum + module.games.length, 0);
    const projects = modules.filter((module) => module.projectBrief || module.sprintLab).length;
    const progress = clampPercent(Math.round((6 / modules.length) * 100));
    return {
      modules: modules.length,
      lessons,
      exercises: totalExerciseCount(),
      checklist: totalChecklistCount(),
      games,
      projects,
      progress,
      xp: 12450,
      level: 18,
      coins: 3280,
      streak: 15,
    };
  }, []);

  function selectModule(module: Module, nextScreen: Screen = 'learn') {
    setActiveModuleId(module.id);
    setActiveLessonId(module.lessons[0]?.id);
    setScreen(nextScreen);
    setNavOpen(false);
  }

  return (
    <div className={`platform theme-${theme}`}>
      <aside className={`sidebar ${navOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">
            <Zap size={26} />
          </div>
          <div>
            <strong>DevQuest</strong>
            <span>Academia RPG Tech</span>
          </div>
          <button className="icon-btn close-btn" onClick={() => setNavOpen(false)} aria-label="Fechar menu">
            <X size={20} />
          </button>
        </div>

        <div className="player-card">
          <div className="player-avatar">
            <Crown size={22} />
          </div>
          <div>
            <strong>Felipe</strong>
            <span>Lv {metrics.level} - Junior Avancado</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="Navegacao principal">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = screen === item.id;
            return (
              <button
                key={item.id}
                className={active ? 'active' : ''}
                onClick={() => {
                  setScreen(item.id);
                  setNavOpen(false);
                }}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-card">
          <div className="split">
            <span>Progresso global</span>
            <strong>{metrics.progress}%</strong>
          </div>
          <div className="meter">
            <i style={{ width: `${metrics.progress}%` }} />
          </div>
          <small>Proximo rank: Pleno em evolucao</small>
        </div>
      </aside>

      <div className="app-view">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setNavOpen(true)} aria-label="Abrir menu">
            <Menu size={22} />
          </button>
          <div className="search">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Pesquisar aulas, mundos, bugs, projetos..."
            />
          </div>
          <div className="hud">
            <span><Flame size={16} />{metrics.streak} dias</span>
            <span><Star size={16} />{metrics.xp.toLocaleString('pt-BR')} XP</span>
            <span><Coins size={16} />{metrics.coins.toLocaleString('pt-BR')}</span>
          </div>
          <button
            className="theme-switch"
            onClick={() => setTheme(theme === 'obsidian' ? 'nexus' : theme === 'nexus' ? 'daybreak' : 'obsidian')}
          >
            <Moon size={17} />
            Tema
          </button>
        </header>

        <main className="main-shell">
          {screen === 'command' && <CommandCenter metrics={metrics} activeModule={activeModule} selectModule={selectModule} setScreen={setScreen} />}
          {screen === 'worlds' && <WorldMap modules={filteredModules} activeModule={activeModule} selectModule={selectModule} />}
          {screen === 'learn' && (
            <LearningRoom
              module={activeModule}
              lesson={activeLesson}
              setLessonId={setActiveLessonId}
              setScreen={setScreen}
            />
          )}
          {screen === 'story' && <StoryMode module={activeModule} setScreen={setScreen} />}
          {screen === 'lab' && <LabStudio module={activeModule} />}
          {screen === 'arcade' && (
            <ArcadeHub
              gameScores={gameScores}
              onGameComplete={(gameId, score) => setGameScores((scores) => ({ ...scores, [gameId]: Math.max(scores[gameId] ?? 0, score) }))}
            />
          )}
          {screen === 'career' && <CareerMode />}
          {screen === 'review' && <ReviewCenter />}
          {screen === 'mentor' && <MentorHub module={activeModule} lesson={activeLesson} />}
          {screen === 'analytics' && <AnalyticsCenter metrics={metrics} />}
          {screen === 'market' && <Marketplace />}
        </main>
      </div>
    </div>
  );
}

function CommandCenter({
  metrics,
  activeModule,
  selectModule,
  setScreen,
}: {
  metrics: ReturnType<typeof createMetricsShape>;
  activeModule: Module;
  selectModule: (module: Module, nextScreen?: Screen) => void;
  setScreen: (screen: Screen) => void;
}) {
  return (
    <section className="stack">
      <div className="hero-layout">
        <article className="hero-panel">
          <span className="eyebrow"><Sparkles size={16} /> Plataforma 2.0 completa</span>
          <h1>Aprenda como se estivesse subindo de nivel em uma carreira tech real.</h1>
          <p>
            Uma academia com mundos, aulas narrativas, revisao inteligente, projetos em sprint,
            laboratorio estilo IDE, mentor contextual, arcade, carreira, loja, conquistas e analytics.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => selectModule(activeModule)}>
              Continuar aula <ChevronRight size={18} />
            </button>
            <button className="ghost-btn" onClick={() => setScreen('lab')}>Abrir laboratorio</button>
          </div>
        </article>

        <aside className="rank-panel">
          <div className="rank-ring" style={{ ['--value' as string]: `${metrics.progress * 3.6}deg` }}>
            <span>{metrics.progress}%</span>
          </div>
          <strong>Junior Avancado</strong>
          <p>Faltam 4 missoes e 1 boss fight para liberar o rank Pleno.</p>
        </aside>
      </div>

      <StatStrip stats={[
        ['Modulos', metrics.modules],
        ['Aulas', metrics.lessons],
        ['Exercicios', metrics.exercises],
        ['Projetos', metrics.projects],
        ['Jogos', metrics.games],
        ['Checklists', metrics.checklist],
      ]} />

      <div className="section-title">
        <div>
          <span className="eyebrow"><Target size={15} /> Plano adaptativo</span>
          <h2>Missao de hoje</h2>
        </div>
        <strong>43 min - +760 XP</strong>
      </div>
      <div className="mission-grid">
        {dailyPlan.map((mission, index) => (
          <article className="mission-card" key={mission.id}>
            <div className="mission-index">0{index + 1}</div>
            <span>{mission.mode}</span>
            <h3>{mission.title}</h3>
            <p>{mission.duration} - {mission.focus}</p>
            <footer>
              <strong>{mission.xp} XP</strong>
              <small>{mission.reward}</small>
            </footer>
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <Panel title="Temporadas" icon={<Trophy size={20} />}>
          <div className="season-list">
            {seasons.map((season) => (
              <div className="season-row" key={season.title}>
                <div>
                  <strong>{season.title}</strong>
                  <span>{season.subtitle}</span>
                </div>
                <div className="meter mini"><i style={{ width: `${season.progress}%` }} /></div>
                <small>{season.reward}</small>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Inteligencia de estudo" icon={<Activity size={20} />}>
          <div className="insight-grid">
            {intelligenceCards.map((card) => (
              <div className="insight-card" key={card.title}>
                <span>{card.title}</span>
                <strong>{card.value}</strong>
                <p>{card.detail}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </section>
  );
}

function WorldMap({
  modules,
  activeModule,
  selectModule,
}: {
  modules: Module[];
  activeModule: Module;
  selectModule: (module: Module, nextScreen?: Screen) => void;
}) {
  return (
    <section className="world-layout">
      <div className="stack">
        <div className="section-title">
          <div>
            <span className="eyebrow"><MapIcon size={15} /> Mapa de conhecimento</span>
            <h2>Mundos e trilhas</h2>
          </div>
          <strong>{modules.length} modulos encontrados</strong>
        </div>

        <div className="worlds-grid">
          {learningWorlds.map((world) => (
            <article className={`world-card ${world.color}`} key={world.id}>
              <span>{world.track}</span>
              <h3>{world.title}</h3>
              <p>{world.subtitle}</p>
              <div className="chip-row">
                {world.chapters.slice(0, 4).map((chapter) => <small key={chapter}>{chapter}</small>)}
              </div>
              <strong>Capstone: {world.capstone}</strong>
            </article>
          ))}
        </div>

        <div className="module-grid">
          {modules.map((module, index) => {
            const progress = clampPercent(index < 3 ? 100 : index === 3 ? 62 : index < 12 ? 20 + index * 4 : 0);
            const locked = index > 15;
            return (
              <button
                className={`module-tile ${activeModule.id === module.id ? 'selected' : ''} ${locked ? 'locked' : ''}`}
                key={module.id}
                onClick={() => selectModule(module)}
              >
                <div className="module-topline">
                  <span>{module.emoji}</span>
                  {locked ? <Lock size={18} /> : <CheckCircle2 size={18} />}
                </div>
                <strong>{module.title}</strong>
                <p>{module.tagline}</p>
                <div className="meter mini"><i style={{ width: `${locked ? 0 : progress}%` }} /></div>
                <small>{module.lessons.length} aulas - {module.exercises.length} exercicios - {module.games.length} jogos</small>
              </button>
            );
          })}
        </div>
      </div>

      <aside className="command-card sticky">
        <span className="eyebrow"><CircleDot size={15} /> Modulo ativo</span>
        <h2>{activeModule.emoji} {activeModule.title}</h2>
        <p>{activeModule.intro}</p>
        <div className="quick-stats">
          <span><strong>{activeModule.lessons.length}</strong>Aulas</span>
          <span><strong>{activeModule.exercises.length}</strong>Exercicios</span>
          <span><strong>{activeModule.checklist.length}</strong>Checklists</span>
        </div>
        <button className="primary-btn full" onClick={() => selectModule(activeModule)}>Entrar no modulo</button>
      </aside>
    </section>
  );
}

function LearningRoom({
  module,
  lesson,
  setLessonId,
  setScreen,
}: {
  module: Module;
  lesson: LessonBlock | undefined;
  setLessonId: (lessonId: string) => void;
  setScreen: (screen: Screen) => void;
}) {
  const [activeExerciseId, setActiveExerciseId] = useState(module.exercises[0]?.id);
  const [exerciseResults, setExerciseResults] = useState<Record<string, boolean>>({});
  const activeExercise = module.exercises.find((exercise) => exercise.id === activeExerciseId) ?? module.exercises[0];
  const diagram = lesson?.diagramId ? diagramRegistry[lesson.diagramId] : null;

  if (!lesson) return null;

  return (
    <section className="learn-layout">
      <aside className="lesson-nav">
        <span className="eyebrow"><BookOpen size={15} /> {module.title}</span>
        <h2>Aulas do modulo</h2>
        <div className="lesson-list">
          {module.lessons.map((item, index) => (
            <button
              key={item.id}
              className={item.id === lesson.id ? 'active' : ''}
              onClick={() => setLessonId(item.id)}
            >
              <span>{index + 1}</span>
              <strong>{item.heading}</strong>
            </button>
          ))}
        </div>
      </aside>

      <article className="lesson-stage">
        <span className="eyebrow"><GraduationCap size={15} /> Aula escrita com contexto</span>
        <h1>{lesson.heading}</h1>
        <div className="lesson-copy">
          {cleanMarkdown(lesson.body).split(/\n\s*\n/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        {lesson.codeExample && (
          <pre className="code-block">
            <code>{lesson.codeExample.code}</code>
          </pre>
        )}
        {diagram && (
          <div className="diagram-stage">
            <div className="split">
              <strong>Diagrama interativo</strong>
              <span>{lesson.diagramId}</span>
            </div>
            {diagram()}
          </div>
        )}
        <div className="lesson-actions">
          <button className="primary-btn" onClick={() => setScreen('story')}>Transformar em historia</button>
          <button className="ghost-btn" onClick={() => setScreen('review')}>Criar revisao</button>
          <button className="ghost-btn" onClick={() => setScreen('mentor')}>Pedir ajuda da IA</button>
        </div>

        {activeExercise && (
          <div className="exercise-stage">
            <div className="section-title compact">
              <div>
                <span className="eyebrow"><Target size={15} /> Treino guiado</span>
                <h2>Exercicios do modulo</h2>
              </div>
              <strong>{Object.values(exerciseResults).filter(Boolean).length}/{module.exercises.length} corretos</strong>
            </div>
            <div className="exercise-layout">
              <aside className="exercise-picker">
                {module.exercises.slice(0, 12).map((exercise, index) => (
                  <button
                    key={exercise.id}
                    className={exercise.id === activeExercise.id ? 'active' : ''}
                    onClick={() => setActiveExerciseId(exercise.id)}
                  >
                    <span>{index + 1}</span>
                    <strong>{exercise.type}</strong>
                    {exerciseResults[exercise.id] === true && <CheckCircle2 size={16} />}
                  </button>
                ))}
              </aside>
              <div className="exercise-card-shell">
                <ExerciseRouter
                  exercise={activeExercise}
                  onResult={(correct) => setExerciseResults((results) => ({ ...results, [activeExercise.id]: correct }))}
                />
              </div>
            </div>
          </div>
        )}
      </article>

      <aside className="command-card">
        <span className="eyebrow"><Target size={15} /> Sprint do modulo</span>
        <h2>{module.projectBrief?.title ?? module.sprintLab?.title ?? 'Projeto pratico'}</h2>
        <p>{module.projectBrief?.description ?? module.sprintLab?.sprints[0]?.objective}</p>
        <div className="checklist">
          {module.checklist.slice(0, 6).map((item, index) => (
            <div key={item.id}>
              {index < 2 ? <CheckCircle2 size={18} /> : <CircleDot size={18} />}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
}

function StoryMode({ module, setScreen }: { module: Module; setScreen: (screen: Screen) => void }) {
  const story = module.storyLessons?.[0];
  const choices = story?.choices ?? [];

  return (
    <section className="stack">
      <article className="cinema-panel">
        <span className="eyebrow"><Sparkles size={15} /> Story Mode</span>
        <h1>{story?.title ?? `Missao: ${module.title}`}</h1>
        <p>{story?.mission ?? module.intro}</p>
        <div className="terminal-card">
          <strong>Tensao do capitulo</strong>
          <span>{story?.tension ?? firstParagraph(module.intro)}</span>
        </div>
        <div className="choice-grid">
          {choices.map((choice) => (
            <button className={choice.correct ? 'best' : ''} key={choice.label}>
              <strong>{choice.label}</strong>
              <span>{choice.consequence}</span>
            </button>
          ))}
        </div>
        <div className="reveal-card">
          <strong>Descoberta</strong>
          <p>{story?.reveal ?? 'A teoria aparece depois do problema, para criar contexto e memoria.'}</p>
        </div>
        <button className="primary-btn" onClick={() => setScreen('learn')}>Voltar para aula</button>
      </article>

      <Panel title="Campanhas narrativas" icon={<MapIcon size={20} />}>
        <div className="campaign-grid">
          {projectCampaigns.map((campaign) => (
            <article className="campaign-card" key={campaign.id}>
              <span>{campaign.company}</span>
              <h3>{campaign.title}</h3>
              <p>{campaign.difficulty} - {campaign.duration}</p>
              <strong>{campaign.reward}</strong>
            </article>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function LabStudio({ module }: { module: Module }) {
  const lab = module.sprintLab;

  return (
    <section className="stack">
      <div className="section-title">
        <div>
          <span className="eyebrow"><Code2 size={15} /> Laboratorio profissional</span>
          <h2>IDE de treino por sprints</h2>
        </div>
        <strong>{lab?.company ?? 'Produto real'} - {lab?.role ?? 'dev em treinamento'}</strong>
      </div>
      <div className="studio">
        <aside className="file-tree">
          <strong>Explorer</strong>
          {studioFiles.map((file) => <button key={file}>{file}</button>)}
        </aside>
        <section className="editor-panel">
          <div className="editor-tabs">
            <span>login.ts</span>
            <span>tests.spec.ts</span>
            <span>terminal</span>
          </div>
          <pre className="code-block">
            <code>{`async function completeSprint(ticket) {
  const context = await readRequirements(ticket)
  const solution = buildSmallestUsefulVersion(context)
  await testHappyPath(solution)
  await testRiskyCase(solution)
  return explainTradeoffs(solution)
}`}</code>
          </pre>
          <div className="terminal-output">
            <span>$ npm run validate:sprint</span>
            <strong>Checklist aprovado: contexto, teste, entrega e explicacao.</strong>
          </div>
        </section>
        <aside className="sprint-panel">
          <span className="eyebrow"><Target size={15} /> Sprint ativa</span>
          <h2>{lab?.title ?? `Projeto guiado: ${module.title}`}</h2>
          <div className="sprint-list">
            {(lab?.sprints ?? []).slice(0, 4).map((sprint, index) => (
              <div key={sprint.title}>
                <strong>{index + 1}. {sprint.title}</strong>
                <p>{sprint.objective}</p>
                <small>Entrega: {sprint.deliverable}</small>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function ArcadeHub({
  gameScores,
  onGameComplete,
}: {
  gameScores: Record<string, number>;
  onGameComplete: (gameId: string, score: number) => void;
}) {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const allGames = useMemo(
    () => modules.flatMap((module) => module.games.map((game) => ({ ...game, moduleTitle: module.title, moduleEmoji: module.emoji, phase: module.phase }))),
    [],
  );
  const uniqueGames = useMemo(() => Array.from(new Map(allGames.map((game) => [game.gameId, game])).values()), [allGames]);
  const activeGame = activeGameId ? uniqueGames.find((game) => game.gameId === activeGameId) : null;
  const gameDef = activeGameId ? gameRegistry[activeGameId] : null;
  const playableGames = uniqueGames.filter((game) => gameRegistry[game.gameId]);
  const missingGames = uniqueGames.filter((game) => !gameRegistry[game.gameId]);

  if (activeGameId) {
    return (
      <section className="stack">
        <button className="ghost-btn back-button" onClick={() => setActiveGameId(null)}>
          <ChevronRight size={16} className="rotate-180" />
          Voltar ao Arcade
        </button>
        <div className="section-title">
          <div>
            <span className="eyebrow"><Gamepad2 size={15} /> Jogo ativo</span>
            <h2>{activeGame?.label ?? activeGameId}</h2>
          </div>
          <strong>{gameScores[activeGameId] !== undefined ? `Melhor: ${gameScores[activeGameId]}%` : 'Sem pontuacao'}</strong>
        </div>
        <div className="game-frame">
          {gameDef
            ? gameDef.render((score) => onGameComplete(activeGameId, score))
            : <div className="empty-state">Este jogo esta cadastrado no modulo, mas nao possui componente no registry.</div>}
        </div>
      </section>
    );
  }

  return (
    <section className="stack">
      <div className="section-title">
        <div>
          <span className="eyebrow"><Gamepad2 size={15} /> Arcade tecnico</span>
          <h2>Jogos para fixar sem virar aula longa</h2>
        </div>
        <strong>{playableGames.length} jogos funcionais</strong>
      </div>
      {missingGames.length > 0 && (
        <div className="qa-warning">
          {missingGames.length} jogos foram encontrados nos modulos sem componente registrado. Eles ficam ocultos ate receberem implementacao.
        </div>
      )}
      <div className="arcade-grid">
        {playableGames.map((game) => {
          const best = gameScores[game.gameId];
          return (
            <button className="game-card interactive" key={game.gameId} onClick={() => setActiveGameId(game.gameId)}>
              <GameIcon gameId={game.gameId} className="game-mark" />
              <span>{game.moduleEmoji} Mundo {game.phase}</span>
              <h3>{game.label}</h3>
              <p>{game.description}</p>
              <strong>{best !== undefined ? `Melhor pontuacao: ${best}%` : game.moduleTitle}</strong>
              <span className="ghost-btn full"><Play size={16} /> Jogar agora</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function CareerMode() {
  return (
    <section className="stack">
      <div className="section-title">
        <div>
          <span className="eyebrow"><BriefcaseBusiness size={15} /> Carreira simulada</span>
          <h2>Do primeiro ticket a lideranca tecnica</h2>
        </div>
        <strong>Rank atual: Junior Avancado</strong>
      </div>
      <div className="career-track">
        {careerLadder.map((rank, index) => (
          <article className={`rank-step ${index < 3 ? 'done' : index === 3 ? 'active' : ''}`} key={rank.title}>
            <div>{index < 3 ? <CheckCircle2 /> : index === 3 ? <Crown /> : <Lock />}</div>
            <strong>{rank.title}</strong>
            <span>Lv {rank.level}</span>
            <p>{rank.responsibility}</p>
            <small>Libera: {rank.unlock}</small>
          </article>
        ))}
      </div>
      <Panel title="Tickets de empresa" icon={<BriefcaseBusiness size={20} />}>
        <div className="ticket-grid">
          {['Corrigir queda no checkout', 'Reduzir tempo inicial de carregamento', 'Criar endpoint de relatorio', 'Documentar decisao de arquitetura'].map((ticket, index) => (
            <article className="ticket-card" key={ticket}>
              <span>TICKET-{204 + index}</span>
              <h3>{ticket}</h3>
              <p>Objetivo, contexto, criterios de aceite e avaliacao automatica.</p>
            </article>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function ReviewCenter() {
  const [revealed, setRevealed] = useState<string | null>(null);

  return (
    <section className="review-layout">
      <div className="stack">
        <div className="section-title">
          <div>
            <span className="eyebrow"><ShieldCheck size={15} /> Revisao inteligente</span>
            <h2>Lembrar antes de consultar</h2>
          </div>
          <strong>{reviewQueue.length} itens na fila</strong>
        </div>
        <div className="review-grid">
          {reviewQueue.map((item) => (
            <article className="review-card" key={item.id}>
              <div className="split">
                <span>{item.topic}</span>
                <strong>{item.due}</strong>
              </div>
              <h3>{item.prompt}</h3>
              <div className="meter mini"><i style={{ width: `${item.strength}%` }} /></div>
              {revealed === item.id ? <p>{item.answer}</p> : <button className="ghost-btn" onClick={() => setRevealed(item.id)}>Mostrar resposta</button>}
            </article>
          ))}
        </div>
      </div>

      <aside className="command-card sticky">
        <span className="eyebrow"><Gem size={15} /> Sistema de memoria</span>
        <h2>Como o app decide o que revisar</h2>
        <p>Erros recentes, forca de lembranca, dias desde o ultimo acerto e importancia para projetos elevam a prioridade.</p>
        <div className="checklist">
          <div><CheckCircle2 size={18} /><span>Perguntar antes de explicar</span></div>
          <div><CheckCircle2 size={18} /><span>Mostrar resposta curta</span></div>
          <div><CheckCircle2 size={18} /><span>Gerar exercicio parecido</span></div>
          <div><CheckCircle2 size={18} /><span>Reagendar automaticamente</span></div>
        </div>
      </aside>
    </section>
  );
}

function MentorHub({ module, lesson }: { module: Module; lesson: LessonBlock | undefined }) {
  return (
    <section className="stack">
      <article className="mentor-panel">
        <span className="eyebrow"><Bot size={15} /> Mentor IA contextual</span>
        <h1>Ajuda no ponto exato da jornada.</h1>
        <p>
          Contexto atual: <strong>{module.title}</strong>
          {lesson ? `, aula "${lesson.heading}".` : '.'} A IA deixa de ser um chat solto e vira uma camada de explicacao,
          treino, revisao e feedback.
        </p>
        <div className="prompt-grid">
          {mentorActions.map((action) => <button key={action}>{action}</button>)}
        </div>
      </article>

      <div className="dashboard-grid">
        <Panel title="Prompt sugerido" icon={<Bot size={20} />}>
          <div className="terminal-card">
            <span>Explique {module.title} usando um problema real, depois crie 5 perguntas de revisao e um desafio pratico com criterio de aceite.</span>
          </div>
        </Panel>
        <Panel title="Acoes automaticas" icon={<Sparkles size={20} />}>
          <div className="checklist">
            <div><CheckCircle2 size={18} /><span>Gerar analogia curta</span></div>
            <div><CheckCircle2 size={18} /><span>Criar exercicio no mesmo nivel</span></div>
            <div><CheckCircle2 size={18} /><span>Subir dificuldade gradualmente</span></div>
            <div><CheckCircle2 size={18} /><span>Avaliar resposta do aluno</span></div>
          </div>
        </Panel>
      </div>
    </section>
  );
}

function AnalyticsCenter({ metrics }: { metrics: ReturnType<typeof createMetricsShape> }) {
  return (
    <section className="stack">
      <div className="section-title">
        <div>
          <span className="eyebrow"><BarChart3 size={15} /> Analytics de evolucao</span>
          <h2>Dados para estudar melhor</h2>
        </div>
        <strong>{metrics.xp.toLocaleString('pt-BR')} XP acumulado</strong>
      </div>
      <StatStrip stats={productStats.map((stat) => [stat.label, stat.value])} />
      <div className="skill-grid">
        {skillTree.map((cluster) => (
          <article className="skill-card" key={cluster.title}>
            <div className="split">
              <strong>{cluster.title}</strong>
              <span>{cluster.mastery}%</span>
            </div>
            <div className="meter mini"><i style={{ width: `${cluster.mastery}%` }} /></div>
            {cluster.skills.map((skill) => (
              <div className="skill-row" key={skill.label}>
                <span>{skill.label}</span>
                <strong>{'★'.repeat(skill.level)}{'☆'.repeat(5 - skill.level)}</strong>
                <small>{skill.evidence}</small>
              </div>
            ))}
          </article>
        ))}
      </div>
      <Panel title="Conquistas" icon={<Award size={20} />}>
        <div className="achievement-grid">
          {achievementCatalog.map((achievement, index) => (
            <article className={`achievement-card ${index < 3 ? 'unlocked' : ''}`} key={achievement.title}>
              <Trophy size={22} />
              <h3>{achievement.title}</h3>
              <p>{achievement.description}</p>
              <strong>{achievement.points} pts</strong>
            </article>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function Marketplace() {
  return (
    <section className="stack">
      <div className="section-title">
        <div>
          <span className="eyebrow"><Coins size={15} /> Loja e recompensas</span>
          <h2>Desbloqueios sem atrapalhar o estudo</h2>
        </div>
        <strong>3.280 moedas</strong>
      </div>
      <div className="market-grid">
        {marketplace.map((item) => (
          <article className="market-card" key={item.id}>
            <span>{item.type} - {item.rarity}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <footer>
              <strong>{item.price} moedas</strong>
              <button className="ghost-btn">Desbloquear</button>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

function StatStrip({ stats }: { stats: Array<[string, string | number]> }) {
  return (
    <div className="stat-strip">
      {stats.map(([label, value]) => (
        <article key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </article>
      ))}
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <div>{icon}<h2>{title}</h2></div>
        <button>Ver tudo</button>
      </div>
      {children}
    </section>
  );
}

function createMetricsShape() {
  return {
    modules: 0,
    lessons: 0,
    exercises: 0,
    checklist: 0,
    games: 0,
    projects: 0,
    progress: 0,
    xp: 0,
    level: 0,
    coins: 0,
    streak: 0,
  };
}
