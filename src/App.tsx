import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
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
  activateCommercialLicense,
  getCommercialMe,
  healthCheck,
  loadCloudProgress,
  loginCommercialAccount,
  readLocalCommercialProgress,
  registerCommercialAccount,
  saveCloudProgress,
  storeToken,
  writeLocalCommercialProgress,
  type CommercialUser,
} from './services/commercialApi';
import {
  achievementCatalog,
  careerLadder,
  dailyPlan,
  learningWorlds,
  marketplace,
  mentorActions,
  projectCampaigns,
  reviewQueue,
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
  | 'market'
  | 'account';

type CommercialState = {
  checked: boolean;
  online: boolean;
  mode: string;
  user: CommercialUser | null;
  access: boolean;
  error: string | null;
};

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
  { id: 'account', label: 'Conta', icon: ShieldCheck },
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

function countDone(values: Record<string, boolean>) {
  return Object.values(values).filter(Boolean).length;
}

function readMinutes(duration: string) {
  return Number(duration.match(/\d+/)?.[0] ?? 0);
}

function rankForLevel(level: number) {
  return careerLadder
    .filter((rank) => level >= rank.level)
    .at(-1) ?? careerLadder[0];
}

function nextRankForLevel(level: number) {
  return careerLadder.find((rank) => rank.level > level) ?? null;
}

function moduleCompletion(
  module: Module,
  completedLessons: Record<string, boolean>,
  completedExercises: Record<string, boolean>,
  gameScores: Record<string, number>,
) {
  const total = module.lessons.length + module.exercises.length + module.games.length;
  if (total === 0) return 0;
  const done =
    module.lessons.filter((lesson) => completedLessons[lesson.id]).length +
    module.exercises.filter((exercise) => completedExercises[exercise.id]).length +
    module.games.filter((game) => gameScores[game.gameId] !== undefined).length;
  return clampPercent(Math.round((done / total) * 100));
}

function filesForModule(module: Module) {
  const base = module.track === 'backend'
    ? ['src/server/routes.ts', 'src/server/services.ts', 'src/server/schema.sql', 'tests/api.spec.ts']
    : module.track === 'devops'
      ? ['Dockerfile', 'docker-compose.yml', '.github/workflows/deploy.yml', 'infra/healthcheck.ts']
      : ['src/app/page.tsx', 'src/components/QuestCard.tsx', 'src/hooks/useProgress.ts', 'tests/ui.spec.ts'];
  return ['README.md', ...base];
}

function studioPreview(module: Module, file: string) {
  if (file === 'README.md') {
    return `# ${module.title}

Objetivo: ${module.goalLabel}

Contexto: ${firstParagraph(module.intro)}

Entregue uma versao pequena, testavel e explicavel antes de adicionar acabamento.`;
  }

  if (file.endsWith('.sql')) {
    return `CREATE TABLE progress_events (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_progress_events_module ON progress_events(module_id);`;
  }

  if (file.includes('Docker') || file.includes('docker-compose')) {
    return `services:
  app:
    build: .
    ports:
      - "4173:4173"
    environment:
      NODE_ENV: production`;
  }

  return `export async function completeSprint(context) {
  const requirements = await readRequirements(context)
  const solution = buildSmallestUsefulVersion(requirements)
  await testHappyPath(solution)
  await testRiskyCase(solution)
  return explainTradeoffs(solution)
}`;
}

function mentorPrompt(action: string, module: Module, lesson: LessonBlock | undefined) {
  const lessonPart = lesson ? `A aula atual e "${lesson.heading}".` : 'Ainda nao ha aula selecionada.';
  return `${action} para o modulo "${module.title}". ${lessonPart} Use o contexto abaixo, corrija informacoes imprecisas, explique com exemplos praticos e finalize com uma tarefa verificavel:\n\n${firstParagraph(module.intro)}`;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('command');
  const [theme, setTheme] = useState<PlatformTheme>('obsidian');
  const [navOpen, setNavOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeModuleId, setActiveModuleId] = useState(modules[3]?.id ?? modules[0]?.id);
  const [activeLessonId, setActiveLessonId] = useState(modules[3]?.lessons[0]?.id ?? modules[0]?.lessons[0]?.id);
  const [gameScores, setGameScores] = useState<Record<string, number>>({});
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [completedMissions, setCompletedMissions] = useState<Record<string, boolean>>({});
  const [reviewAnswers, setReviewAnswers] = useState<Record<string, boolean>>({});
  const [unlockedRewards, setUnlockedRewards] = useState<Record<string, boolean>>({});
  const [commercial, setCommercial] = useState<CommercialState>({
    checked: false,
    online: false,
    mode: 'offline',
    user: null,
    access: false,
    error: null,
  });

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
    const exerciseDone = countDone(completedExercises);
    const lessonDone = countDone(completedLessons);
    const missionDone = countDone(completedMissions);
    const reviewDone = countDone(reviewAnswers);
    const gameDone = Object.keys(gameScores).length;
    const totalActions = lessons + totalExerciseCount() + games + dailyPlan.length + reviewQueue.length;
    const doneActions = lessonDone + exerciseDone + gameDone + missionDone + reviewDone;
    const gameXp = Object.values(gameScores).reduce((sum, score) => sum + Math.round(score * 2), 0);
    const xp = exerciseDone * 60 + lessonDone * 35 + missionDone * 120 + reviewDone * 45 + gameXp;
    const level = Math.max(1, Math.floor(xp / 250) + 1);
    const spentCoins = Object.keys(unlockedRewards).reduce((sum, itemId) => {
      const item = marketplace.find((reward) => reward.id === itemId);
      return sum + (item?.price ?? 0);
    }, 0);
    return {
      modules: modules.length,
      lessons,
      exercises: totalExerciseCount(),
      checklist: totalChecklistCount(),
      games,
      projects,
      progress: clampPercent(Math.round((doneActions / Math.max(totalActions, 1)) * 100)),
      xp,
      level,
      coins: Math.max(0, Math.floor(xp / 5) - spentCoins),
      streak: doneActions > 0 ? 1 : 0,
      lessonDone,
      exerciseDone,
      missionDone,
      reviewDone,
      gameDone,
    };
  }, [completedExercises, completedLessons, completedMissions, gameScores, reviewAnswers, unlockedRewards]);

  const commercialProgress = useMemo(() => ({
    activeModuleId,
    activeLessonId,
    gameScores,
    completedLessons,
    completedExercises,
    completedMissions,
    reviewAnswers,
    unlockedRewards,
    theme,
    lastScreen: screen,
    updatedAt: new Date().toISOString(),
  }), [activeModuleId, activeLessonId, gameScores, completedLessons, completedExercises, completedMissions, reviewAnswers, unlockedRewards, theme, screen]);

  useEffect(() => {
    let cancelled = false;
    async function bootCommercialMode() {
      try {
        const health = await healthCheck();
        if (cancelled) return;
        setCommercial((current) => ({ ...current, checked: true, online: true, mode: health.mode, error: null }));
        try {
          const me = await getCommercialMe();
          if (!cancelled) setCommercial((current) => ({ ...current, user: me.user, access: me.access }));
        } catch {
          if (!cancelled) setCommercial((current) => ({ ...current, user: null, access: false }));
        }
      } catch {
        if (!cancelled) setCommercial((current) => ({ ...current, checked: true, online: false, mode: 'offline', error: null }));
      }
    }
    bootCommercialMode();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const saved = readLocalCommercialProgress();
    if (typeof saved.activeModuleId === 'string') setActiveModuleId(saved.activeModuleId);
    if (typeof saved.activeLessonId === 'string') setActiveLessonId(saved.activeLessonId);
    if (saved.gameScores && typeof saved.gameScores === 'object') setGameScores(saved.gameScores as Record<string, number>);
    if (saved.completedLessons && typeof saved.completedLessons === 'object') setCompletedLessons(saved.completedLessons as Record<string, boolean>);
    if (saved.completedExercises && typeof saved.completedExercises === 'object') setCompletedExercises(saved.completedExercises as Record<string, boolean>);
    if (saved.completedMissions && typeof saved.completedMissions === 'object') setCompletedMissions(saved.completedMissions as Record<string, boolean>);
    if (saved.reviewAnswers && typeof saved.reviewAnswers === 'object') setReviewAnswers(saved.reviewAnswers as Record<string, boolean>);
    if (saved.unlockedRewards && typeof saved.unlockedRewards === 'object') setUnlockedRewards(saved.unlockedRewards as Record<string, boolean>);
    if (saved.theme === 'obsidian' || saved.theme === 'nexus' || saved.theme === 'daybreak') setTheme(saved.theme);
  }, []);

  useEffect(() => {
    writeLocalCommercialProgress(commercialProgress);
  }, [commercialProgress]);

  function selectModule(module: Module, nextScreen: Screen = 'learn') {
    setActiveModuleId(module.id);
    setActiveLessonId(module.lessons[0]?.id);
    setScreen(nextScreen);
    setNavOpen(false);
  }

  async function refreshCommercialAccount() {
    const me = await getCommercialMe();
    setCommercial((current) => ({ ...current, user: me.user, access: me.access, error: null }));
  }

  function logoutCommercialAccount() {
    storeToken(null);
    setCommercial((current) => ({ ...current, user: null, access: false, error: null }));
  }

  const currentRank = rankForLevel(metrics.level);
  const playerName = commercial.user?.name ?? 'Visitante';

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
            <strong>{playerName}</strong>
            <span>Lv {metrics.level} - {currentRank.title}</span>
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
            <button className="hud-account" onClick={() => setScreen('account')}>
              <ShieldCheck size={16} />{commercial.user ? 'Conta ativa' : commercial.online ? 'Entrar' : 'Offline'}
            </button>
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
          {screen === 'command' && (
            <CommandCenter
              metrics={metrics}
              activeModule={activeModule}
              selectModule={selectModule}
              setScreen={setScreen}
              completedMissions={completedMissions}
              onCompleteMission={(missionId) => setCompletedMissions((missions) => ({ ...missions, [missionId]: !missions[missionId] }))}
            />
          )}
          {screen === 'worlds' && (
            <WorldMap
              modules={filteredModules}
              activeModule={activeModule}
              selectModule={selectModule}
              completedLessons={completedLessons}
              completedExercises={completedExercises}
              gameScores={gameScores}
            />
          )}
          {screen === 'learn' && (
            <LearningRoom
              module={activeModule}
              lesson={activeLesson}
              setLessonId={setActiveLessonId}
              setScreen={setScreen}
              completedLessons={completedLessons}
              completedExercises={completedExercises}
              onMarkLessonDone={(lessonId) => setCompletedLessons((lessons) => ({ ...lessons, [lessonId]: true }))}
              onExerciseResult={(exerciseId, correct) => setCompletedExercises((exercises) => ({ ...exercises, [exerciseId]: correct }))}
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
          {screen === 'career' && <CareerMode metrics={metrics} />}
          {screen === 'review' && (
            <ReviewCenter
              reviewAnswers={reviewAnswers}
              onReviewAnswer={(reviewId, remembered) => setReviewAnswers((answers) => ({ ...answers, [reviewId]: remembered }))}
            />
          )}
          {screen === 'mentor' && <MentorHub module={activeModule} lesson={activeLesson} />}
          {screen === 'analytics' && <AnalyticsCenter metrics={metrics} />}
          {screen === 'market' && (
            <Marketplace
              metrics={metrics}
              unlockedRewards={unlockedRewards}
              onUnlock={(itemId) => setUnlockedRewards((rewards) => ({ ...rewards, [itemId]: true }))}
            />
          )}
          {screen === 'account' && (
            <CommercialAccount
              commercial={commercial}
              setCommercial={setCommercial}
              refreshCommercialAccount={refreshCommercialAccount}
              logoutCommercialAccount={logoutCommercialAccount}
              progress={commercialProgress}
              applyCloudProgress={(progress) => {
                if (typeof progress.activeModuleId === 'string') setActiveModuleId(progress.activeModuleId);
                if (typeof progress.activeLessonId === 'string') setActiveLessonId(progress.activeLessonId);
                if (progress.gameScores && typeof progress.gameScores === 'object') setGameScores(progress.gameScores as Record<string, number>);
                if (progress.completedLessons && typeof progress.completedLessons === 'object') setCompletedLessons(progress.completedLessons as Record<string, boolean>);
                if (progress.completedExercises && typeof progress.completedExercises === 'object') setCompletedExercises(progress.completedExercises as Record<string, boolean>);
                if (progress.completedMissions && typeof progress.completedMissions === 'object') setCompletedMissions(progress.completedMissions as Record<string, boolean>);
                if (progress.reviewAnswers && typeof progress.reviewAnswers === 'object') setReviewAnswers(progress.reviewAnswers as Record<string, boolean>);
                if (progress.unlockedRewards && typeof progress.unlockedRewards === 'object') setUnlockedRewards(progress.unlockedRewards as Record<string, boolean>);
                if (progress.theme === 'obsidian' || progress.theme === 'nexus' || progress.theme === 'daybreak') setTheme(progress.theme);
              }}
            />
          )}
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
  completedMissions,
  onCompleteMission,
}: {
  metrics: ReturnType<typeof createMetricsShape>;
  activeModule: Module;
  selectModule: (module: Module, nextScreen?: Screen) => void;
  setScreen: (screen: Screen) => void;
  completedMissions: Record<string, boolean>;
  onCompleteMission: (missionId: string) => void;
}) {
  const currentRank = rankForLevel(metrics.level);
  const nextRank = nextRankForLevel(metrics.level);
  const dailyMinutes = dailyPlan.reduce((sum, mission) => sum + readMinutes(mission.duration), 0);
  const dailyXp = dailyPlan.reduce((sum, mission) => sum + mission.xp, 0);
  const remainingLevels = nextRank ? nextRank.level - metrics.level : 0;
  const seasonProgress = [
    { title: 'Base de conteudo', subtitle: `${metrics.lessonDone}/${metrics.lessons} aulas concluidas`, progress: metrics.lessons ? Math.round((metrics.lessonDone / metrics.lessons) * 100) : 0, reward: 'Libera revisoes melhores' },
    { title: 'Pratica guiada', subtitle: `${metrics.exerciseDone}/${metrics.exercises} exercicios corretos`, progress: metrics.exercises ? Math.round((metrics.exerciseDone / metrics.exercises) * 100) : 0, reward: 'Aumenta XP e moedas' },
    { title: 'Arcade e projetos', subtitle: `${metrics.gameDone}/${metrics.games} jogos com pontuacao`, progress: metrics.games ? Math.round((metrics.gameDone / metrics.games) * 100) : 0, reward: 'Alimenta carreira e conquistas' },
  ];
  const insights = [
    { title: 'Modulo ativo', value: activeModule.title, detail: activeModule.goalLabel },
    { title: 'Rank atual', value: currentRank.title, detail: nextRank ? `Faltam ${remainingLevels} niveis para ${nextRank.title}.` : 'Ultimo rank da trilha liberado.' },
    { title: 'Revisoes feitas', value: metrics.reviewDone, detail: `${reviewQueue.length - metrics.reviewDone} itens ainda pendentes.` },
    { title: 'Saldo real', value: metrics.coins, detail: 'Moedas calculadas por XP ganho menos recompensas compradas.' },
  ];

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
          <strong>{currentRank.title}</strong>
          <p>{nextRank ? `Faltam ${remainingLevels} niveis para liberar ${nextRank.title}.` : 'Todos os ranks principais foram liberados.'}</p>
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
        <strong>{dailyMinutes} min - ate +{dailyXp} XP</strong>
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
              <button className={completedMissions[mission.id] ? 'success-pill' : 'ghost-btn'} onClick={() => onCompleteMission(mission.id)}>
                {completedMissions[mission.id] ? 'Concluida' : 'Concluir'}
              </button>
            </footer>
            <small>{mission.reward}</small>
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <Panel title="Temporadas" icon={<Trophy size={20} />}>
          <div className="season-list">
            {seasonProgress.map((season) => (
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
            {insights.map((card) => (
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
  completedLessons,
  completedExercises,
  gameScores,
}: {
  modules: Module[];
  activeModule: Module;
  selectModule: (module: Module, nextScreen?: Screen) => void;
  completedLessons: Record<string, boolean>;
  completedExercises: Record<string, boolean>;
  gameScores: Record<string, number>;
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
          {modules.map((module) => {
            const progress = moduleCompletion(module, completedLessons, completedExercises, gameScores);
            return (
              <button
                className={`module-tile ${activeModule.id === module.id ? 'selected' : ''}`}
                key={module.id}
                onClick={() => selectModule(module)}
              >
                <div className="module-topline">
                  <span>{module.emoji}</span>
                  {progress === 100 ? <CheckCircle2 size={18} /> : <CircleDot size={18} />}
                </div>
                <strong>{module.title}</strong>
                <p>{module.tagline}</p>
                <div className="meter mini"><i style={{ width: `${progress}%` }} /></div>
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
  completedLessons,
  completedExercises,
  onMarkLessonDone,
  onExerciseResult,
}: {
  module: Module;
  lesson: LessonBlock | undefined;
  setLessonId: (lessonId: string) => void;
  setScreen: (screen: Screen) => void;
  completedLessons: Record<string, boolean>;
  completedExercises: Record<string, boolean>;
  onMarkLessonDone: (lessonId: string) => void;
  onExerciseResult: (exerciseId: string, correct: boolean) => void;
}) {
  const [activeExerciseId, setActiveExerciseId] = useState(module.exercises[0]?.id);
  const activeExercise = module.exercises.find((exercise) => exercise.id === activeExerciseId) ?? module.exercises[0];
  const diagram = lesson?.diagramId ? diagramRegistry[lesson.diagramId] : null;

  useEffect(() => {
    setActiveExerciseId(module.exercises[0]?.id);
  }, [module.id, module.exercises]);

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
              {completedLessons[item.id] && <CheckCircle2 size={16} />}
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
          <button className={completedLessons[lesson.id] ? 'success-pill' : 'primary-btn'} onClick={() => onMarkLessonDone(lesson.id)}>
            {completedLessons[lesson.id] ? 'Aula concluida' : 'Concluir aula'}
          </button>
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
              <strong>{module.exercises.filter((exercise) => completedExercises[exercise.id]).length}/{module.exercises.length} corretos</strong>
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
                    {completedExercises[exercise.id] === true && <CheckCircle2 size={16} />}
                  </button>
                ))}
              </aside>
              <div className="exercise-card-shell">
                <ExerciseRouter
                  exercise={activeExercise}
                  onResult={(correct) => onExerciseResult(activeExercise.id, correct)}
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
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const selected = choices.find((choice) => choice.label === selectedChoice);

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
            <button
              className={`${selectedChoice === choice.label ? 'selected' : ''} ${selectedChoice && choice.correct ? 'best' : ''}`}
              key={choice.label}
              onClick={() => setSelectedChoice(choice.label)}
            >
              <strong>{choice.label}</strong>
              <span>{selectedChoice === choice.label ? choice.consequence : 'Escolha para ver a consequencia.'}</span>
            </button>
          ))}
        </div>
        {selected && (
          <div className="reveal-card">
            <strong>{selected.correct ? 'Boa decisao' : 'Consequencia aprendida'}</strong>
            <p>{story?.reveal ?? 'A teoria aparece depois do problema, para criar contexto e memoria.'}</p>
            {story?.takeaway && <small>{story.takeaway}</small>}
          </div>
        )}
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
  const files = useMemo(() => filesForModule(module), [module]);
  const [activeFile, setActiveFile] = useState(files[0]);

  useEffect(() => {
    setActiveFile(files[0]);
  }, [files]);

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
          {files.map((file) => (
            <button className={file === activeFile ? 'active' : ''} key={file} onClick={() => setActiveFile(file)}>
              {file}
            </button>
          ))}
        </aside>
        <section className="editor-panel">
          <div className="editor-tabs">
            <span>{activeFile}</span>
            <span>terminal</span>
          </div>
          <pre className="code-block">
            <code>{studioPreview(module, activeFile)}</code>
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

function CareerMode({ metrics }: { metrics: ReturnType<typeof createMetricsShape> }) {
  const currentRank = rankForLevel(metrics.level);
  return (
    <section className="stack">
      <div className="section-title">
        <div>
          <span className="eyebrow"><BriefcaseBusiness size={15} /> Carreira simulada</span>
          <h2>Do primeiro ticket a lideranca tecnica</h2>
        </div>
        <strong>Rank atual: {currentRank.title}</strong>
      </div>
      <div className="career-track">
        {careerLadder.map((rank) => (
          <article className={`rank-step ${rank.title === currentRank.title ? 'active' : metrics.level >= rank.level ? 'done' : ''}`} key={rank.title}>
            <div>{rank.title === currentRank.title ? <Crown /> : metrics.level >= rank.level ? <CheckCircle2 /> : <Lock />}</div>
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

function ReviewCenter({
  reviewAnswers,
  onReviewAnswer,
}: {
  reviewAnswers: Record<string, boolean>;
  onReviewAnswer: (reviewId: string, remembered: boolean) => void;
}) {
  const [revealed, setRevealed] = useState<string | null>(null);

  return (
    <section className="review-layout">
      <div className="stack">
        <div className="section-title">
          <div>
            <span className="eyebrow"><ShieldCheck size={15} /> Revisao inteligente</span>
            <h2>Lembrar antes de consultar</h2>
          </div>
          <strong>{Object.keys(reviewAnswers).length}/{reviewQueue.length} revisoes registradas</strong>
        </div>
        <div className="review-grid">
          {reviewQueue.map((item) => (
            <article className="review-card" key={item.id}>
              <div className="split">
                <span>{item.topic}</span>
                <strong>{item.due}</strong>
              </div>
              <h3>{item.prompt}</h3>
              <div className="meter mini"><i style={{ width: `${reviewAnswers[item.id] ? 100 : item.strength}%` }} /></div>
              {revealed === item.id ? (
                <>
                  <p>{item.answer}</p>
                  <div className="hero-actions">
                    <button className="primary-btn" onClick={() => onReviewAnswer(item.id, true)}>Lembrei</button>
                    <button className="ghost-btn" onClick={() => onReviewAnswer(item.id, false)}>Nao lembrei</button>
                  </div>
                </>
              ) : (
                <button className="ghost-btn" onClick={() => setRevealed(item.id)}>Mostrar resposta</button>
              )}
              {item.id in reviewAnswers && (
                <small>{reviewAnswers[item.id] ? 'Registrado como lembrado.' : 'Registrado para reforco futuro.'}</small>
              )}
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
  const [selectedAction, setSelectedAction] = useState(mentorActions[0]);
  const generatedPrompt = mentorPrompt(selectedAction, module, lesson);

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
          {mentorActions.map((action) => (
            <button className={selectedAction === action ? 'active' : ''} key={action} onClick={() => setSelectedAction(action)}>
              {action}
            </button>
          ))}
        </div>
      </article>

      <div className="dashboard-grid">
        <Panel title="Prompt sugerido" icon={<Bot size={20} />}>
          <div className="terminal-card">
            <span>{generatedPrompt}</span>
          </div>
          <p className="muted-copy">Gerado localmente com o contexto da aula. Para resposta automatica real, conecte uma API de IA no backend comercial.</p>
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
  const trackRows = ['frontend', 'backend', 'devops', 'fullstack', 'soft'].map((track) => {
    const trackModules = modules.filter((module) => module.track === track);
    const trackLessons = trackModules.reduce((sum, module) => sum + module.lessons.length, 0);
    const trackExercises = trackModules.reduce((sum, module) => sum + module.exercises.length, 0);
    const mastery = metrics.progress;
    return { track, modules: trackModules.length, lessons: trackLessons, exercises: trackExercises, mastery };
  });

  return (
    <section className="stack">
      <div className="section-title">
        <div>
          <span className="eyebrow"><BarChart3 size={15} /> Analytics de evolucao</span>
          <h2>Dados para estudar melhor</h2>
        </div>
        <strong>{metrics.xp.toLocaleString('pt-BR')} XP acumulado</strong>
      </div>
      <StatStrip stats={[
        ['Aulas reais', metrics.lessons],
        ['Aulas concluidas', metrics.lessonDone],
        ['Exercicios reais', metrics.exercises],
        ['Exercicios corretos', metrics.exerciseDone],
        ['Jogos jogados', metrics.gameDone],
        ['Revisoes lembradas', metrics.reviewDone],
      ]} />
      <div className="skill-grid">
        {trackRows.map((cluster) => (
          <article className="skill-card" key={cluster.track}>
            <div className="split">
              <strong>{cluster.track}</strong>
              <span>{cluster.mastery}%</span>
            </div>
            <div className="meter mini"><i style={{ width: `${cluster.mastery}%` }} /></div>
            <div className="skill-row">
              <span>Modulos cadastrados</span>
              <strong>{cluster.modules}</strong>
              <small>Conteudo real encontrado nos arquivos da trilha.</small>
            </div>
            <div className="skill-row">
              <span>Aulas</span>
              <strong>{cluster.lessons}</strong>
              <small>Quantidade real, sem marcador +.</small>
            </div>
            <div className="skill-row">
              <span>Exercicios</span>
              <strong>{cluster.exercises}</strong>
              <small>Usados para treino, revisao e XP.</small>
            </div>
          </article>
        ))}
      </div>
      <Panel title="Conquistas" icon={<Award size={20} />}>
        <div className="achievement-grid">
          {achievementCatalog.map((achievement, index) => {
            const unlocked = metrics.xp >= achievement.points || index === 0 && metrics.missionDone > 0;
            return (
            <article className={`achievement-card ${unlocked ? 'unlocked' : ''}`} key={achievement.title}>
              <Trophy size={22} />
              <h3>{achievement.title}</h3>
              <p>{achievement.description}</p>
              <strong>{unlocked ? 'Liberada' : `${achievement.points} XP alvo`}</strong>
            </article>
          )})}
        </div>
      </Panel>
    </section>
  );
}

function Marketplace({
  metrics,
  unlockedRewards,
  onUnlock,
}: {
  metrics: ReturnType<typeof createMetricsShape>;
  unlockedRewards: Record<string, boolean>;
  onUnlock: (itemId: string) => void;
}) {
  const [message, setMessage] = useState<string | null>(null);

  function unlock(itemId: string, price: number) {
    if (unlockedRewards[itemId]) {
      setMessage('Este item ja foi desbloqueado.');
      return;
    }
    if (metrics.coins < price) {
      setMessage(`Saldo insuficiente. Faltam ${price - metrics.coins} moedas.`);
      return;
    }
    onUnlock(itemId);
    setMessage('Item desbloqueado e salvo no progresso local.');
  }

  return (
    <section className="stack">
      <div className="section-title">
        <div>
          <span className="eyebrow"><Coins size={15} /> Loja e recompensas</span>
          <h2>Desbloqueios sem atrapalhar o estudo</h2>
        </div>
        <strong>{metrics.coins.toLocaleString('pt-BR')} moedas</strong>
      </div>
      {message && <div className="success-note">{message}</div>}
      <div className="market-grid">
        {marketplace.map((item) => (
          <article className="market-card" key={item.id}>
            <span>{item.type} - {item.rarity}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <footer>
              <strong>{item.price} moedas</strong>
              <button
                className={unlockedRewards[item.id] ? 'success-pill' : 'ghost-btn'}
                disabled={!unlockedRewards[item.id] && metrics.coins < item.price}
                onClick={() => unlock(item.id, item.price)}
              >
                {unlockedRewards[item.id] ? 'Desbloqueado' : metrics.coins < item.price ? 'Sem saldo' : 'Desbloquear'}
              </button>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

function CommercialAccount({
  commercial,
  setCommercial,
  refreshCommercialAccount,
  logoutCommercialAccount,
  progress,
  applyCloudProgress,
}: {
  commercial: CommercialState;
  setCommercial: Dispatch<SetStateAction<CommercialState>>;
  refreshCommercialAccount: () => Promise<void>;
  logoutCommercialAccount: () => void;
  progress: Record<string, unknown>;
  applyCloudProgress: (progress: Record<string, unknown>) => void;
}) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submitAccount() {
    setBusy(true);
    setMessage(null);
    try {
      const session = mode === 'login'
        ? await loginCommercialAccount({ email, password })
        : await registerCommercialAccount({ name, email, password });
      setCommercial((current) => ({
        ...current,
        online: true,
        user: session.user,
        access: session.access,
        error: null,
      }));
      setMessage(mode === 'login' ? 'Login realizado com sucesso.' : 'Conta criada com sucesso.');
    } catch (error) {
      setCommercial((current) => ({ ...current, error: error instanceof Error ? error.message : 'Erro inesperado.' }));
    } finally {
      setBusy(false);
    }
  }

  async function activateLicense() {
    setBusy(true);
    setMessage(null);
    try {
      const result = await activateCommercialLicense(licenseKey);
      setCommercial((current) => ({ ...current, user: result.user, access: result.access, error: null }));
      setMessage('Licenca ativada. Sincronizacao em nuvem liberada.');
    } catch (error) {
      setCommercial((current) => ({ ...current, error: error instanceof Error ? error.message : 'Erro ao ativar licenca.' }));
    } finally {
      setBusy(false);
    }
  }

  async function syncUp() {
    setBusy(true);
    setMessage(null);
    try {
      const saved = await saveCloudProgress({ ...readLocalCommercialProgress(), ...progress });
      setMessage(`Progresso enviado para nuvem. Checksum: ${saved.progress.checksum.slice(0, 10)}...`);
    } catch (error) {
      setCommercial((current) => ({ ...current, error: error instanceof Error ? error.message : 'Erro ao sincronizar.' }));
    } finally {
      setBusy(false);
    }
  }

  async function syncDown() {
    setBusy(true);
    setMessage(null);
    try {
      const loaded = await loadCloudProgress();
      if (!loaded.progress?.data) {
        setMessage('Nenhum progresso salvo na nuvem ainda.');
      } else {
        applyCloudProgress(loaded.progress.data);
        writeLocalCommercialProgress(loaded.progress.data);
        setMessage(`Progresso restaurado de ${new Date(loaded.progress.updatedAt).toLocaleString('pt-BR')}.`);
      }
    } catch (error) {
      setCommercial((current) => ({ ...current, error: error instanceof Error ? error.message : 'Erro ao baixar progresso.' }));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="account-layout">
      <div className="stack">
        <article className="mentor-panel account-hero">
          <span className="eyebrow"><ShieldCheck size={15} /> Produto comercial</span>
          <h1>Conta, licenca e progresso em nuvem.</h1>
          <p>
            Esta camada transforma o app em uma base vendavel: usuario com senha protegida,
            token de sessao, ativacao de licenca e sincronizacao no servidor.
          </p>
          <div className="account-status-grid">
            <div>
              <span>API</span>
              <strong>{commercial.online ? 'Online' : 'Offline'}</strong>
            </div>
            <div>
              <span>Modo</span>
              <strong>{commercial.mode}</strong>
            </div>
            <div>
              <span>Acesso</span>
              <strong>{commercial.access ? 'Liberado' : 'Pendente'}</strong>
            </div>
          </div>
        </article>

        {commercial.user && (
          <Panel title="Sincronizacao" icon={<ShieldCheck size={20} />}>
            <div className="sync-grid">
              <button className="primary-btn" disabled={busy || !commercial.access} onClick={syncUp}>Enviar progresso</button>
              <button className="ghost-btn" disabled={busy || !commercial.access} onClick={syncDown}>Baixar progresso</button>
              <button className="ghost-btn" disabled={busy} onClick={refreshCommercialAccount}>Atualizar conta</button>
              <button className="danger-btn" disabled={busy} onClick={logoutCommercialAccount}>Sair</button>
            </div>
            {!commercial.access && (
              <div className="qa-warning">Ative uma licenca para liberar sincronizacao quando REQUIRE_LICENSE=true.</div>
            )}
          </Panel>
        )}
      </div>

      <aside className="command-card sticky">
        {commercial.user ? (
          <>
            <span className="eyebrow"><Crown size={15} /> Conta ativa</span>
            <h2>{commercial.user.name}</h2>
            <p>{commercial.user.email}</p>
            <div className="account-facts">
              <span><strong>{commercial.user.role}</strong> Papel</span>
              <span><strong>{commercial.user.license?.plan ?? 'sem licenca'}</strong> Plano</span>
              <span><strong>{commercial.user.license?.status ?? 'pendente'}</strong> Status</span>
            </div>
            <label className="field-label">Chave de licenca</label>
            <input
              className="field-input"
              value={licenseKey}
              onChange={(event) => setLicenseKey(event.target.value)}
              placeholder="DEVQUEST-XXXX-XXXX"
            />
            <button className="primary-btn full" disabled={busy || !licenseKey.trim()} onClick={activateLicense}>
              Ativar licenca
            </button>
          </>
        ) : (
          <>
            <span className="eyebrow"><ShieldCheck size={15} /> Entrar</span>
            <h2>{mode === 'login' ? 'Acessar conta' : 'Criar conta'}</h2>
            {!commercial.online && <p>Servidor comercial offline. Rode `npm run api:dev` ou `npm start` para ativar API.</p>}
            <div className="mode-tabs">
              <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
              <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Cadastro</button>
            </div>
            {mode === 'register' && (
              <>
                <label className="field-label">Nome</label>
                <input className="field-input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Nome do aluno" />
              </>
            )}
            <label className="field-label">Email</label>
            <input className="field-input" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="aluno@email.com" />
            <label className="field-label">Senha</label>
            <input className="field-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="minimo 8 caracteres" />
            <button className="primary-btn full" disabled={busy || !commercial.online || !email.trim() || !password.trim()} onClick={submitAccount}>
              {mode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </>
        )}
        {message && <div className="success-note">{message}</div>}
        {commercial.error && <div className="error-note">{commercial.error}</div>}
      </aside>
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
    lessonDone: 0,
    exerciseDone: 0,
    missionDone: 0,
    reviewDone: 0,
    gameDone: 0,
  };
}
