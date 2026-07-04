import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import {
  Activity,
  Award,
  BarChart3,
  BookOpen,
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
import {
  Books,
  Brain,
  BracketsCurly,
  Browser,
  Buildings,
  Certificate,
  ChartLineUp,
  CreditCard,
  GraduationCap as PhosphorGraduationCap,
  Path,
  RocketLaunch,
  TerminalWindow,
} from '@phosphor-icons/react';
import { modules, phases, totalChecklistCount, totalExerciseCount } from './data';
import type { LessonBlock, Module } from './data/types';
import { diagramRegistry } from './components/diagrams/registry';
import { gameRegistry } from './components/games/registry';
import { GameIcon } from './components/ui/GameIcon';
import { ExerciseRouter } from './components/ui/ExerciseRouter';
import {
  activateCommercialLicense,
  createCommercialCheckout,
  getCommercialPlans,
  getCommercialMe,
  healthCheck,
  loadCloudProgress,
  loginCommercialAccount,
  readLocalCommercialProgress,
  registerCommercialAccount,
  saveCloudProgress,
  storeToken,
  writeLocalCommercialProgress,
  type CommercialPlan,
  type CommercialUser,
} from './services/commercialApi';
import {
  achievementCatalog,
  careerLadder,
  dailyPlan,
  learningWorlds,
  marketplace,
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
  | 'analytics'
  | 'market'
  | 'account';

type Language = 'pt' | 'en' | 'es';

type CommercialState = {
  checked: boolean;
  online: boolean;
  mode: string;
  user: CommercialUser | null;
  access: boolean;
  error: string | null;
};

const navItems = [
  { id: 'command', labelKey: 'nav.command', icon: Home },
  { id: 'worlds', labelKey: 'nav.worlds', icon: MapIcon },
  { id: 'learn', labelKey: 'nav.learn', icon: BookOpen },
  { id: 'story', labelKey: 'nav.story', icon: Sparkles },
  { id: 'lab', labelKey: 'nav.lab', icon: Code2 },
  { id: 'arcade', labelKey: 'nav.arcade', icon: Gamepad2 },
  { id: 'career', labelKey: 'nav.career', icon: BriefcaseBusiness },
  { id: 'review', labelKey: 'nav.review', icon: ShieldCheck },
  { id: 'analytics', labelKey: 'nav.analytics', icon: BarChart3 },
  { id: 'market', labelKey: 'nav.market', icon: Coins },
  { id: 'account', labelKey: 'nav.account', icon: ShieldCheck },
] as const;

const copy: Record<Language, Record<string, string>> = {
  pt: {
    'nav.command': 'Comecar',
    'nav.worlds': 'Trilha',
    'nav.learn': 'Aulas',
    'nav.story': 'Historia',
    'nav.lab': 'Laboratorio',
    'nav.arcade': 'Arcade',
    'nav.career': 'Carreira',
    'nav.review': 'Revisao',
    'nav.analytics': 'Analytics',
    'nav.market': 'Loja',
    'nav.account': 'Conta',
    'brand.subtitle': 'Academia guiada para devs',
    'search.placeholder': 'Pesquisar aulas, modulos e projetos...',
    'status.active': 'Conta ativa',
    'status.login': 'Entrar',
    'status.offline': 'API offline',
    'theme': 'Tema',
    'progress.global': 'Progresso global',
    'progress.next': 'Proximo passo: concluir a aula atual',
    'gate.title': 'Entre e escolha um plano para acessar a trilha.',
    'gate.body': 'O conteudo, os exercicios, o laboratorio e o progresso em nuvem ficam bloqueados ate o login e a assinatura.',
    'hero.eyebrow': 'Caminho guiado',
    'hero.title': 'Aprenda programacao na ordem certa, sem pular fundamento.',
    'hero.body': 'O app agora orienta do primeiro modulo ate projetos avancados: aula primeiro, pratica depois, revisao no fim.',
    'hero.continue': 'Continuar aula',
    'hero.openLab': 'Abrir laboratorio',
    'sequence.title': 'Roteiro do inicio ao avancado',
    'sequence.body': 'Siga os meses em ordem. Exercicios so fazem sentido depois de ler a aula e marcar entendimento.',
    'sequence.plan': 'Plano atual',
    'sequence.continue': 'Continuar modulo ativo',
    'sequence.locked': 'Bloqueado',
    'daily.title': 'Missao de hoje',
    'learn.eyebrow': 'Conteudo primeiro',
    'learn.lessons': 'Aulas do modulo',
    'learn.done': 'Aula concluida',
    'learn.markDone': 'Concluir aula',
    'learn.story': 'Ver como historia',
    'learn.review': 'Revisar depois',
    'learn.lab': 'Praticar no laboratorio',
    'learn.exerciseLockedTitle': 'Exercicios liberados depois da aula',
    'learn.exerciseLockedBody': 'Leia o conteudo, veja o exemplo e marque a aula como concluida. Depois disso o treino aparece.',
    'learn.exercises': 'Treino guiado',
    'account.heroTitle': 'Escolha sua classe. Comece a jornada.',
    'account.heroBody': 'Da logica ao deploy: suba de nivel modulo a modulo, desbloqueie laboratorio, arcade e projetos reais, e leve seu progresso para qualquer dispositivo.',
    'account.heroKicker': 'Sua jornada de dev, gamificada',
    'account.plans': 'Planos de acesso',
    'account.login': 'Login',
    'account.register': 'Cadastro',
    'account.email': 'Email',
    'account.password': 'Senha',
    'account.name': 'Nome',
    'account.buy': 'Pagar agora',
    'account.enterToBuy': 'Entre para comprar',
    'account.current': 'Plano ativo',
    'account.license': 'Chave de licenca',
    'account.activate': 'Ativar licenca',
    'account.sync': 'Sincronizacao',
    'account.billingLifetime': 'Vitalicio',
    'account.billingMonthly': 'Mensal',
    'account.rarityCommon': 'Aventureiro',
    'account.rarityRare': 'Heroico',
    'account.rarityLegendary': 'Lendario',
  },
  en: {
    'nav.command': 'Start',
    'nav.worlds': 'Path',
    'nav.learn': 'Lessons',
    'nav.story': 'Story',
    'nav.lab': 'Lab',
    'nav.arcade': 'Arcade',
    'nav.career': 'Career',
    'nav.review': 'Review',
    'nav.analytics': 'Analytics',
    'nav.market': 'Store',
    'nav.account': 'Account',
    'brand.subtitle': 'Guided academy for developers',
    'search.placeholder': 'Search lessons, modules and projects...',
    'status.active': 'Active account',
    'status.login': 'Sign in',
    'status.offline': 'API offline',
    'theme': 'Theme',
    'progress.global': 'Global progress',
    'progress.next': 'Next step: finish the current lesson',
    'gate.title': 'Sign in and choose a plan to access the path.',
    'gate.body': 'Content, exercises, lab and cloud progress stay locked until login and subscription.',
    'hero.eyebrow': 'Guided path',
    'hero.title': 'Learn programming in the right order, without skipping foundations.',
    'hero.body': 'The app now guides you from the first module to advanced projects: lesson first, practice after, review at the end.',
    'hero.continue': 'Continue lesson',
    'hero.openLab': 'Open lab',
    'sequence.title': 'Roadmap from beginner to advanced',
    'sequence.body': 'Follow the months in order. Exercises only make sense after reading the lesson and confirming understanding.',
    'sequence.plan': 'Current plan',
    'sequence.continue': 'Continue active module',
    'sequence.locked': 'Locked',
    'daily.title': 'Today mission',
    'learn.eyebrow': 'Content first',
    'learn.lessons': 'Module lessons',
    'learn.done': 'Lesson completed',
    'learn.markDone': 'Complete lesson',
    'learn.story': 'View as story',
    'learn.review': 'Review later',
    'learn.lab': 'Practice in lab',
    'learn.exerciseLockedTitle': 'Exercises unlock after the lesson',
    'learn.exerciseLockedBody': 'Read the content, inspect the example and mark the lesson as completed. Then practice appears.',
    'learn.exercises': 'Guided practice',
    'account.heroTitle': 'Pick your class. Begin the quest.',
    'account.heroBody': 'From logic to deploy: level up module by module, unlock the lab, the arcade and real projects, and carry your progress to any device.',
    'account.heroKicker': 'Your dev journey, gamified',
    'account.plans': 'Access plans',
    'account.login': 'Login',
    'account.register': 'Register',
    'account.email': 'Email',
    'account.password': 'Password',
    'account.name': 'Name',
    'account.buy': 'Pay now',
    'account.enterToBuy': 'Sign in to buy',
    'account.current': 'Active plan',
    'account.license': 'License key',
    'account.activate': 'Activate license',
    'account.sync': 'Sync',
    'account.billingLifetime': 'Lifetime',
    'account.billingMonthly': 'Monthly',
    'account.rarityCommon': 'Adventurer',
    'account.rarityRare': 'Heroic',
    'account.rarityLegendary': 'Legendary',
  },
  es: {
    'nav.command': 'Inicio',
    'nav.worlds': 'Ruta',
    'nav.learn': 'Clases',
    'nav.story': 'Historia',
    'nav.lab': 'Laboratorio',
    'nav.arcade': 'Arcade',
    'nav.career': 'Carrera',
    'nav.review': 'Repaso',
    'nav.analytics': 'Analytics',
    'nav.market': 'Tienda',
    'nav.account': 'Cuenta',
    'brand.subtitle': 'Academia guiada para devs',
    'search.placeholder': 'Buscar clases, modulos y proyectos...',
    'status.active': 'Cuenta activa',
    'status.login': 'Entrar',
    'status.offline': 'API offline',
    'theme': 'Tema',
    'progress.global': 'Progreso global',
    'progress.next': 'Siguiente paso: terminar la clase actual',
    'gate.title': 'Entra y elige un plan para acceder a la ruta.',
    'gate.body': 'Contenido, ejercicios, laboratorio y progreso en la nube quedan bloqueados hasta iniciar sesion y suscribirse.',
    'hero.eyebrow': 'Ruta guiada',
    'hero.title': 'Aprende programacion en el orden correcto, sin saltarte la base.',
    'hero.body': 'La app ahora guia desde el primer modulo hasta proyectos avanzados: clase primero, practica despues, repaso al final.',
    'hero.continue': 'Continuar clase',
    'hero.openLab': 'Abrir laboratorio',
    'sequence.title': 'Ruta desde cero hasta avanzado',
    'sequence.body': 'Sigue los meses en orden. Los ejercicios tienen sentido despues de leer la clase y confirmar comprension.',
    'sequence.plan': 'Plan actual',
    'sequence.continue': 'Continuar modulo activo',
    'sequence.locked': 'Bloqueado',
    'daily.title': 'Mision de hoy',
    'learn.eyebrow': 'Contenido primero',
    'learn.lessons': 'Clases del modulo',
    'learn.done': 'Clase completada',
    'learn.markDone': 'Completar clase',
    'learn.story': 'Ver como historia',
    'learn.review': 'Repasar despues',
    'learn.lab': 'Practicar en laboratorio',
    'learn.exerciseLockedTitle': 'Ejercicios liberados despues de la clase',
    'learn.exerciseLockedBody': 'Lee el contenido, mira el ejemplo y marca la clase como completada. Despues aparece la practica.',
    'learn.exercises': 'Practica guiada',
    'account.heroTitle': 'Elige tu clase. Comienza la aventura.',
    'account.heroBody': 'De la logica al deploy: sube de nivel modulo a modulo, desbloquea el laboratorio, el arcade y proyectos reales, y lleva tu progreso a cualquier dispositivo.',
    'account.heroKicker': 'Tu viaje como developer, gamificado',
    'account.plans': 'Planes de acceso',
    'account.login': 'Login',
    'account.register': 'Registro',
    'account.email': 'Email',
    'account.password': 'Contrasena',
    'account.name': 'Nombre',
    'account.buy': 'Pagar ahora',
    'account.enterToBuy': 'Entra para comprar',
    'account.current': 'Plan activo',
    'account.license': 'Clave de licencia',
    'account.activate': 'Activar licencia',
    'account.sync': 'Sincronizacion',
    'account.billingLifetime': 'Vitalicio',
    'account.billingMonthly': 'Mensual',
    'account.rarityCommon': 'Aventurero',
    'account.rarityRare': 'Heroico',
    'account.rarityLegendary': 'Legendario',
  },
};

const worldIcons: Record<string, typeof Books> = {
  'world-foundation': Brain,
  'world-frontend': Browser,
  'world-backend': TerminalWindow,
  'world-platform': RocketLaunch,
  'world-fullstack': Buildings,
  'world-ai': BracketsCurly,
};

const planRules = {
  starter: { maxMonth: 6, screens: new Set<Screen>(['command', 'worlds', 'learn', 'story', 'career', 'review', 'account']) },
  pro: { maxMonth: 22, screens: new Set<Screen>(['command', 'worlds', 'learn', 'story', 'lab', 'arcade', 'career', 'review', 'analytics', 'market', 'account']) },
  lifetime: { maxMonth: 22, screens: new Set<Screen>(['command', 'worlds', 'learn', 'story', 'lab', 'arcade', 'career', 'review', 'analytics', 'market', 'account']) },
} as const;

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

function formatPrice(priceCents: number) {
  return (priceCents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function unlockCopy(language: Language, maxMonth: number) {
  if (language === 'en') return `Unlocks up to month ${maxMonth} of the path.`;
  if (language === 'es') return `Libera hasta el mes ${maxMonth} de la ruta.`;
  return `Libera ate o mes ${maxMonth} da trilha.`;
}

function fallbackPlans(language: Language = 'pt'): CommercialPlan[] {
  const features = {
    pt: {
      starter: ['Fundamentos ate o mes 6', 'Aulas, exercicios e revisao', 'Progresso em nuvem com licenca ativa'],
      pro: ['Todos os 22 meses', 'Laboratorio, arcade e analytics', 'Projetos e revisoes avancadas'],
      lifetime: ['Pagamento unico', 'Acesso completo vitalicio', 'Ideal para venda direta'],
    },
    en: {
      starter: ['Foundations up to month 6', 'Lessons, exercises and review', 'Cloud progress with active license'],
      pro: ['All 22 months', 'Lab, arcade and analytics', 'Projects and advanced reviews'],
      lifetime: ['One-time payment', 'Full lifetime access', 'Ideal for direct sales'],
    },
    es: {
      starter: ['Fundamentos hasta el mes 6', 'Clases, ejercicios y repaso', 'Progreso en la nube con licencia activa'],
      pro: ['Los 22 meses completos', 'Laboratorio, arcade y analytics', 'Proyectos y repasos avanzados'],
      lifetime: ['Pago unico', 'Acceso completo vitalicio', 'Ideal para venta directa'],
    },
  }[language];
  return [
    {
      id: 'starter',
      name: 'Starter',
      priceCents: 4990,
      price: 49.9,
      currency: 'BRL',
      billing: 'monthly',
      durationDays: 30,
      seats: 1,
      maxMonth: 6,
      features: features.starter,
    },
    {
      id: 'pro',
      name: 'Pro',
      priceCents: 8990,
      price: 89.9,
      currency: 'BRL',
      billing: 'monthly',
      durationDays: 30,
      seats: 1,
      maxMonth: 22,
      features: features.pro,
    },
    {
      id: 'lifetime',
      name: 'Vitalicio',
      priceCents: 49700,
      price: 497,
      currency: 'BRL',
      billing: 'lifetime',
      durationDays: null,
      seats: 1,
      maxMonth: 22,
      features: features.lifetime,
    },
  ];
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

export default function App() {
  const [screen, setScreen] = useState<Screen>('account');
  const [theme, setTheme] = useState<PlatformTheme>('obsidian');
  const [language, setLanguage] = useState<Language>('pt');
  const [navOpen, setNavOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeModuleId, setActiveModuleId] = useState(modules[0]?.id);
  const [activeLessonId, setActiveLessonId] = useState(modules[0]?.lessons[0]?.id);
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
    language,
    lastScreen: screen,
    updatedAt: new Date().toISOString(),
  }), [activeModuleId, activeLessonId, gameScores, completedLessons, completedExercises, completedMissions, reviewAnswers, unlockedRewards, theme, language, screen]);

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
    if (saved.language === 'pt' || saved.language === 'en' || saved.language === 'es') setLanguage(saved.language);
  }, []);

  useEffect(() => {
    writeLocalCommercialProgress(commercialProgress);
  }, [commercialProgress]);

  const activePlan = commercial.access ? commercial.user?.license?.plan as keyof typeof planRules | undefined : undefined;
  const activeAllowance = activePlan && activePlan in planRules ? planRules[activePlan] : null;
  const isLicensedRuntime = commercial.online;
  const t = (key: string) => copy[language][key] ?? copy.pt[key] ?? key;

  function canUseScreen(nextScreen: Screen) {
    if (nextScreen === 'account') return true;
    if (!commercial.checked || !isLicensedRuntime || !commercial.user || !commercial.access) return false;
    if (!activeAllowance) return false;
    return activeAllowance.screens.has(nextScreen);
  }

  function canUseModule(module: Module) {
    if (!commercial.checked || !isLicensedRuntime || !commercial.user || !commercial.access) return false;
    if (!activeAllowance) return false;
    return module.month <= activeAllowance.maxMonth;
  }

  function goToScreen(nextScreen: Screen) {
    setScreen(canUseScreen(nextScreen) ? nextScreen : 'account');
    setNavOpen(false);
  }

  function selectModule(module: Module, nextScreen: Screen = 'learn') {
    if (!canUseModule(module) || !canUseScreen(nextScreen)) {
      setScreen('account');
      setNavOpen(false);
      return;
    }
    setActiveModuleId(module.id);
    setActiveLessonId(module.lessons[0]?.id);
    setScreen(nextScreen);
    setNavOpen(false);
  }

  useEffect(() => {
    if (!commercial.checked || screen === 'account') return;
    const allowed =
      commercial.online &&
      Boolean(commercial.user) &&
      commercial.access &&
      Boolean(activeAllowance?.screens.has(screen));
    if (!allowed) setScreen('account');
  }, [commercial.checked, commercial.online, commercial.user, commercial.access, activeAllowance, screen]);

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
            <span>{t('brand.subtitle')}</span>
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
                  goToScreen(item.id);
                }}
              >
                <Icon size={19} />
                <span>{t(item.labelKey)}</span>
                {!canUseScreen(item.id) && item.id !== 'account' && <Lock size={14} className="nav-lock" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-card">
          <div className="split">
            <span>{t('progress.global')}</span>
            <strong>{metrics.progress}%</strong>
          </div>
          <div className="meter">
            <i style={{ width: `${metrics.progress}%` }} />
          </div>
          <small>{t('progress.next')}</small>
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
              placeholder={t('search.placeholder')}
            />
          </div>
          <select className="language-switch" value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label="Idioma">
            <option value="pt">PT</option>
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
          <div className="hud">
            <span><Flame size={16} />{metrics.streak} dias</span>
            <span><Star size={16} />{metrics.xp.toLocaleString('pt-BR')} XP</span>
            <span><Coins size={16} />{metrics.coins.toLocaleString('pt-BR')}</span>
            <button className="hud-account" onClick={() => setScreen('account')}>
              <ShieldCheck size={16} />{commercial.user ? t('status.active') : commercial.online ? t('status.login') : t('status.offline')}
            </button>
          </div>
          <button
            className="theme-switch"
            onClick={() => setTheme(theme === 'obsidian' ? 'nexus' : theme === 'nexus' ? 'daybreak' : 'obsidian')}
          >
            <Moon size={17} />
            {t('theme')}
          </button>
        </header>

        <main className="main-shell">
          {screen === 'command' && (
            <CommandCenter
              metrics={metrics}
              activeModule={activeModule}
              selectModule={selectModule}
              setScreen={goToScreen}
              completedMissions={completedMissions}
              onCompleteMission={(missionId) => setCompletedMissions((missions) => ({ ...missions, [missionId]: !missions[missionId] }))}
              activePlanName={commercial.user?.license?.planName ?? null}
              canUseModule={canUseModule}
              t={t}
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
              canUseModule={canUseModule}
              t={t}
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
              t={t}
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
              language={language}
              t={t}
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
                if (progress.language === 'pt' || progress.language === 'en' || progress.language === 'es') setLanguage(progress.language);
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
  activePlanName,
  canUseModule,
  t,
}: {
  metrics: ReturnType<typeof createMetricsShape>;
  activeModule: Module;
  selectModule: (module: Module, nextScreen?: Screen) => void;
  setScreen: (screen: Screen) => void;
  completedMissions: Record<string, boolean>;
  onCompleteMission: (missionId: string) => void;
  activePlanName: string | null;
  canUseModule: (module: Module) => boolean;
  t: (key: string) => string;
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
          <span className="eyebrow"><Sparkles size={16} /> {t('hero.eyebrow')}</span>
          <h1>{t('hero.title')}</h1>
          <p>{t('hero.body')}</p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => selectModule(activeModule)}>
              {t('hero.continue')} <ChevronRight size={18} />
            </button>
            <button className="ghost-btn" onClick={() => setScreen('lab')}>{t('hero.openLab')}</button>
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

      <LearningSequence
        activeModule={activeModule}
        activePlanName={activePlanName}
        canUseModule={canUseModule}
        selectModule={selectModule}
        t={t}
      />

      <div className="section-title">
        <div>
          <span className="eyebrow"><Target size={15} /> {t('hero.eyebrow')}</span>
          <h2>{t('daily.title')}</h2>
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

function LearningSequence({
  activeModule,
  activePlanName,
  canUseModule,
  selectModule,
  t,
}: {
  activeModule: Module;
  activePlanName: string | null;
  canUseModule: (module: Module) => boolean;
  selectModule: (module: Module, nextScreen?: Screen) => void;
  t: (key: string) => string;
}) {
  return (
    <Panel title={t('sequence.title')} icon={<Path size={22} weight="duotone" />}>
      <div className="sequence-header">
        <div>
          <span>{t('sequence.body')}</span>
          <strong>{t('sequence.plan')}: {activePlanName ?? '-'}</strong>
        </div>
        <button className="primary-btn" onClick={() => selectModule(activeModule)}>
          {t('sequence.continue')} <ChevronRight size={17} />
        </button>
      </div>
      <div className="sequence-grid">
        {phases.map((phase) => {
          const phaseModules = modules.filter((module) => module.phase === phase.phase);
          const unlockedCount = phaseModules.filter(canUseModule).length;
          return (
            <article className={`sequence-phase ${phase.color}`} key={phase.phase}>
              <div className="split">
                <span>Fase {phase.phase}</span>
                <strong>{unlockedCount}/{phaseModules.length}</strong>
              </div>
              <h3>{phase.title}</h3>
              <p>{phase.objective}</p>
              <div className="sequence-months">
                {phaseModules.map((module) => {
                  const unlocked = canUseModule(module);
                  return (
                    <button
                      className={module.id === activeModule.id ? 'active' : ''}
                      key={module.id}
                      disabled={!unlocked}
                      onClick={() => selectModule(module)}
                      title={unlocked ? module.title : 'Disponivel no plano Pro ou Vitalicio'}
                    >
                      <span>{module.month}</span>
                      {unlocked ? module.title : t('sequence.locked')}
                    </button>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </Panel>
  );
}

function WorldMap({
  modules,
  activeModule,
  selectModule,
  completedLessons,
  completedExercises,
  gameScores,
  canUseModule,
  t,
}: {
  modules: Module[];
  activeModule: Module;
  selectModule: (module: Module, nextScreen?: Screen) => void;
  completedLessons: Record<string, boolean>;
  completedExercises: Record<string, boolean>;
  gameScores: Record<string, number>;
  canUseModule: (module: Module) => boolean;
  t: (key: string) => string;
}) {
  return (
    <section className="world-layout">
      <div className="stack">
        <div className="section-title">
          <div>
            <span className="eyebrow"><MapIcon size={15} /> {t('nav.worlds')}</span>
            <h2>{t('sequence.title')}</h2>
          </div>
          <strong>{modules.length} modulos encontrados</strong>
        </div>

        <div className="worlds-grid">
          {learningWorlds.map((world) => {
            const Icon = worldIcons[world.id] ?? Books;
            return (
              <article className={`world-card ${world.color}`} key={world.id}>
                <div className="world-visual">
                  <Icon size={34} weight="duotone" />
                </div>
                <span>{world.track}</span>
                <h3>{world.title}</h3>
                <p>{world.subtitle}</p>
                <div className="chip-row">
                  {world.chapters.slice(0, 4).map((chapter) => <small key={chapter}>{chapter}</small>)}
                </div>
                <strong>Capstone: {world.capstone}</strong>
              </article>
            );
          })}
        </div>

        <div className="module-grid">
          {modules.map((module) => {
            const progress = moduleCompletion(module, completedLessons, completedExercises, gameScores);
            const unlocked = canUseModule(module);
            return (
              <button
                className={`module-tile ${activeModule.id === module.id ? 'selected' : ''} ${unlocked ? '' : 'locked'}`}
                key={module.id}
                onClick={() => selectModule(module)}
              >
                <div className="module-topline">
                  <span>{module.emoji}</span>
                  {!unlocked ? <Lock size={18} /> : progress === 100 ? <CheckCircle2 size={18} /> : <CircleDot size={18} />}
                </div>
                <strong>{module.title}</strong>
                <p>{module.tagline}</p>
                <div className="meter mini"><i style={{ width: `${progress}%` }} /></div>
                <small>Mes {module.month} - {module.lessons.length} aulas - {module.exercises.length} exercicios - {module.games.length} jogos</small>
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
  t,
}: {
  module: Module;
  lesson: LessonBlock | undefined;
  setLessonId: (lessonId: string) => void;
  setScreen: (screen: Screen) => void;
  completedLessons: Record<string, boolean>;
  completedExercises: Record<string, boolean>;
  onMarkLessonDone: (lessonId: string) => void;
  onExerciseResult: (exerciseId: string, correct: boolean) => void;
  t: (key: string) => string;
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
        <h2>{t('learn.lessons')}</h2>
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
        <span className="eyebrow"><GraduationCap size={15} /> {t('learn.eyebrow')}</span>
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
            {completedLessons[lesson.id] ? t('learn.done') : t('learn.markDone')}
          </button>
          <button className="primary-btn" onClick={() => setScreen('story')}>{t('learn.story')}</button>
          <button className="ghost-btn" onClick={() => setScreen('review')}>{t('learn.review')}</button>
          <button className="ghost-btn" onClick={() => setScreen('lab')}>{t('learn.lab')}</button>
        </div>

        {!completedLessons[lesson.id] && (
          <div className="exercise-stage locked-stage">
            <Lock size={24} />
            <h2>{t('learn.exerciseLockedTitle')}</h2>
            <p>{t('learn.exerciseLockedBody')}</p>
          </div>
        )}

        {activeExercise && completedLessons[lesson.id] && (
          <div className="exercise-stage">
            <div className="section-title compact">
              <div>
                <span className="eyebrow"><Target size={15} /> {t('learn.exercises')}</span>
                <h2>{t('learn.exercises')}</h2>
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
  const [activeSprintIndex, setActiveSprintIndex] = useState(0);
  const [acceptedItems, setAcceptedItems] = useState<Record<string, boolean>>({});
  const sprint = lab?.sprints[activeSprintIndex] ?? lab?.sprints[0];
  const acceptanceItems = [
    'Entendi o problema antes de alterar codigo',
    'Implementei a menor entrega verificavel',
    'Validei um caminho feliz e um caso de erro',
    'Sei explicar a decisao tecnica em voz alta',
  ];
  const acceptedCount = acceptanceItems.filter((item) => acceptedItems[`${module.id}:${activeSprintIndex}:${item}`]).length;

  useEffect(() => {
    setActiveFile(files[0]);
    setActiveSprintIndex(0);
    setAcceptedItems({});
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
            <span>Sprint {activeSprintIndex + 1}</span>
          </div>
          <pre className="code-block">
            <code>{studioPreview(module, activeFile)}</code>
          </pre>
          <div className="terminal-output">
            <span>$ npm run validate:sprint</span>
            <strong>{acceptedCount === acceptanceItems.length ? 'Sprint pronta para entrega.' : `${acceptedCount}/${acceptanceItems.length} criterios validados.`}</strong>
          </div>
          <div className="lab-checklist">
            {acceptanceItems.map((item) => {
              const key = `${module.id}:${activeSprintIndex}:${item}`;
              return (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={Boolean(acceptedItems[key])}
                    onChange={() => setAcceptedItems((current) => ({ ...current, [key]: !current[key] }))}
                  />
                  <span>{item}</span>
                </label>
              );
            })}
          </div>
        </section>
        <aside className="sprint-panel">
          <span className="eyebrow"><Target size={15} /> Sprint ativa</span>
          <h2>{sprint?.title ?? lab?.title ?? `Projeto guiado: ${module.title}`}</h2>
          <p>{sprint?.objective ?? 'Escolha uma sprint, abra os arquivos sugeridos e valide os criterios de aceite.'}</p>
          {sprint?.deliverable && <div className="delivery-box"><strong>Entrega esperada</strong><span>{sprint.deliverable}</span></div>}
          <div className="sprint-list">
            {(lab?.sprints ?? []).slice(0, 4).map((sprint, index) => (
              <button className={index === activeSprintIndex ? 'active' : ''} key={sprint.title} onClick={() => setActiveSprintIndex(index)}>
                <strong>{index + 1}. {sprint.title}</strong>
                <p>{sprint.objective}</p>
                <small>Entrega: {sprint.deliverable}</small>
              </button>
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
  language,
  t,
  applyCloudProgress,
}: {
  commercial: CommercialState;
  setCommercial: Dispatch<SetStateAction<CommercialState>>;
  refreshCommercialAccount: () => Promise<void>;
  logoutCommercialAccount: () => void;
  progress: Record<string, unknown>;
  language: Language;
  t: (key: string) => string;
  applyCloudProgress: (progress: Record<string, unknown>) => void;
}) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [plans, setPlans] = useState<CommercialPlan[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const loginCardRef = useRef<HTMLElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  function goToLogin() {
    loginCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    emailInputRef.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    if (!commercial.online) return;
    let cancelled = false;
    getCommercialPlans(language)
      .then((result) => {
        if (!cancelled) setPlans(result.plans);
      })
      .catch(() => {
        if (!cancelled) setPlans([]);
      });
    return () => {
      cancelled = true;
    };
  }, [commercial.online, language]);

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

  async function startCheckout(planId: CommercialPlan['id']) {
    setBusy(true);
    setMessage(null);
    try {
      const checkout = await createCommercialCheckout(planId);
      window.location.href = checkout.checkoutUrl;
    } catch (error) {
      setCommercial((current) => ({ ...current, error: error instanceof Error ? error.message : 'Erro ao iniciar pagamento.' }));
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
        <article className="feature-panel account-hero">
          <span className="eyebrow"><ShieldCheck size={15} /> {t('account.heroKicker')}</span>
          <h1>{t('account.heroTitle')}</h1>
          <p>{t('account.heroBody')}</p>
          <div className="quest-strip">
            <span><BookOpen size={15} /> 22 {t('nav.worlds')}</span>
            <span><Code2 size={15} /> {t('nav.lab')}</span>
            <span><Gamepad2 size={15} /> {t('nav.arcade')}</span>
            <span><Trophy size={15} /> {t('nav.career')}</span>
          </div>
        </article>

        <Panel title={t('account.plans')} icon={<CreditCard size={22} weight="duotone" />}>
          <div className="pricing-grid">
            {(plans.length ? plans : fallbackPlans(language)).map((plan) => {
              const current = commercial.user?.license?.plan === plan.id;
              const rarity = plan.id === 'lifetime' ? 'legendary' : plan.id === 'pro' ? 'rare' : 'common';
              const rarityLabel =
                plan.id === 'lifetime' ? t('account.rarityLegendary') : plan.id === 'pro' ? t('account.rarityRare') : t('account.rarityCommon');
              return (
                <article className={`price-card rarity-${rarity} ${current ? 'current' : ''}`} key={plan.id}>
                  <span className="rarity-tag">{rarityLabel}</span>
                  <div className="price-icon">
                    {plan.id === 'starter' && <PhosphorGraduationCap size={28} weight="duotone" />}
                    {plan.id === 'pro' && <ChartLineUp size={28} weight="duotone" />}
                    {plan.id === 'lifetime' && <Certificate size={28} weight="duotone" />}
                  </div>
                  <span>{plan.billing === 'lifetime' ? t('account.billingLifetime') : t('account.billingMonthly')}</span>
                  <h3>{plan.name}</h3>
                  <strong>{formatPrice(plan.priceCents)}{plan.billing === 'monthly' ? '/mes' : ''}</strong>
                  <p>{unlockCopy(language, plan.maxMonth)}</p>
                  <div className="checklist compact-list">
                    {plan.features.map((feature) => (
                      <div key={feature}><CheckCircle2 size={16} /><span>{feature}</span></div>
                    ))}
                  </div>
                  <button
                    className={current ? 'success-pill full' : 'primary-btn full'}
                    disabled={current || (commercial.user ? busy : false)}
                    onClick={() => (commercial.user ? startCheckout(plan.id) : goToLogin())}
                  >
                    {current ? t('account.current') : commercial.user ? t('account.buy') : t('account.enterToBuy')}
                  </button>
                </article>
              );
            })}
          </div>
        </Panel>

        {commercial.user && (
          <Panel title={t('account.sync')} icon={<ShieldCheck size={20} />}>
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

      <aside className="command-card sticky" ref={loginCardRef}>
        {commercial.user ? (
          <>
            <span className="eyebrow"><Crown size={15} /> {t('status.active')}</span>
            <h2>{commercial.user.name}</h2>
            <p>{commercial.user.email}</p>
            <div className="account-facts">
              <span><strong>{commercial.user.role}</strong> Papel</span>
              <span><strong>{commercial.user.license?.plan ?? 'sem licenca'}</strong> Plano</span>
              <span><strong>{commercial.user.license?.status ?? 'pendente'}</strong> Status</span>
            </div>
            <label className="field-label">{t('account.license')}</label>
            <input
              className="field-input"
              value={licenseKey}
              onChange={(event) => setLicenseKey(event.target.value)}
              placeholder="DEVQUEST-XXXX-XXXX"
            />
            <button className="primary-btn full" disabled={busy || !licenseKey.trim()} onClick={activateLicense}>
              {t('account.activate')}
            </button>
          </>
        ) : (
          <>
            <span className="eyebrow"><ShieldCheck size={15} /> {t('status.login')}</span>
            <h2>{mode === 'login' ? t('account.login') : t('account.register')}</h2>
            {!commercial.online && (
              <div className="offline-warning">
                <ShieldCheck size={15} />
                <span>Servidor comercial offline. Rode <code>npm run api:dev</code> ou <code>npm start</code> para ativar a API antes de entrar ou cadastrar.</span>
              </div>
            )}
            <div className="mode-tabs">
              <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>{t('account.login')}</button>
              <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>{t('account.register')}</button>
            </div>
            {mode === 'register' && (
              <>
                <label className="field-label">{t('account.name')}</label>
                <input className="field-input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Nome do aluno" />
              </>
            )}
            <label className="field-label">{t('account.email')}</label>
            <input className="field-input" ref={emailInputRef} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="aluno@email.com" />
            <label className="field-label">{t('account.password')}</label>
            <input className="field-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="minimo 8 caracteres" />
            <button
              className="primary-btn full"
              disabled={busy || !commercial.online || !email.trim() || !password.trim() || (mode === 'register' && !name.trim())}
              onClick={submitAccount}
            >
              {mode === 'login' ? t('account.login') : t('account.register')}
            </button>
            {!commercial.online && <small className="offline-hint">Botao desabilitado ate a API responder.</small>}
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
