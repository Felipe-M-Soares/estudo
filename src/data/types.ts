// ===== Tipos centrais do conteúdo da jornada =====

export type Phase = 1 | 2 | 3 | 4;

export type Track = 'frontend' | 'backend' | 'devops' | 'fullstack' | 'soft';

export interface Resource {
  label: string;
  url: string;
}

export interface LessonBlock {
  id: string;
  heading: string;
  body: string; // markdown simples (negrito **x**, listas -, código `x`)
  codeExample?: {
    lang: string;
    code: string;
  };
  diagramId?: string; // referência a um diagrama interativo (ver components/diagrams/registry)
}

export interface ChecklistItem {
  id: string;
  label: string;
}

export type ExerciseType = 'mcq' | 'code-fill' | 'order' | 'match' | 'truefalse';

export interface MCQExercise {
  type: 'mcq';
  id: string;
  prompt: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CodeFillExercise {
  type: 'code-fill';
  id: string;
  prompt: string;
  codeTemplate: string; // usa ___ como blank
  answer: string;
  hint: string;
  explanation: string;
}

export interface OrderExercise {
  type: 'order';
  id: string;
  prompt: string;
  steps: string[]; // na ordem correta
  explanation: string;
}

export interface MatchExercise {
  type: 'match';
  id: string;
  prompt: string;
  pairs: { left: string; right: string }[];
  explanation: string;
}

export interface TrueFalseExercise {
  type: 'truefalse';
  id: string;
  prompt: string;
  answer: boolean;
  explanation: string;
}

export type Exercise =
  | MCQExercise
  | CodeFillExercise
  | OrderExercise
  | MatchExercise
  | TrueFalseExercise;

export interface GameRef {
  gameId: string; // referencia ao componente de jogo (ver games/registry.ts)
  label: string;
  description: string;
}

export interface ScenarioCheck {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DayToDayScenario {
  id: string;
  context: 'trabalho' | 'pessoal'; // dia a dia profissional de dev vs uso pessoal de lógica
  title: string;
  situation: string; // o que está acontecendo
  whatHappens: string; // o que acontece / por que isso é um problema
  howToSolve: string; // como resolver, passo a passo ou princípio
  emoji: string;
  check?: ScenarioCheck; // checagem rápida opcional de entendimento
}

export interface StoryChoice {
  label: string;
  consequence: string;
  correct?: boolean;
}

export interface StoryLesson {
  id: string;
  title: string;
  mission: string;
  tension: string;
  choices: StoryChoice[];
  reveal: string;
  takeaway: string;
}

export interface DebugCase {
  id: string;
  title: string;
  context: string;
  symptom: string;
  log: string;
  suspects: string[];
  answer: string;
  fix: string;
}

export interface SprintLab {
  id: string;
  title: string;
  company: string;
  role: string;
  sprints: { title: string; objective: string; deliverable: string }[];
}

export interface SkillNode {
  id: string;
  label: string;
  level: number;
  evidence: string;
}

export interface Module {
  id: string; // ex: 'mes-01'
  month: number;
  phase: Phase;
  track: Track;
  title: string;
  emoji: string;
  tagline: string;
  intro: string;
  lessons: LessonBlock[];
  resources: Resource[];
  checklist: ChecklistItem[];
  goalLabel: string;
  exercises: Exercise[];
  games: GameRef[];
  scenarios?: DayToDayScenario[];
  projectBrief?: {
    title: string;
    description: string;
    requirements: string[];
  };
  storyLessons?: StoryLesson[];
  debugCases?: DebugCase[];
  sprintLab?: SprintLab;
  skillNodes?: SkillNode[];
}

export interface SpacedReviewItem {
  exerciseId: string;
  moduleId: string;
  intervalIdx: number; // índice no array de intervalos (0 = primeiro, cresce a cada acerto)
  dueDate: string; // ISO date — quando esse item deve ser revisado de novo
  lastResult: 'correct' | 'wrong' | null;
}

export interface ProjectNote {
  moduleId: string;
  text: string;
  links: { label: string; url: string }[];
  updatedAt: string;
}

// PhaseInfo foi movido para moduleMeta.ts (arquivo leve, sem conteúdo pesado de
// lições/exercícios) — importe de '../data/moduleMeta' ou '../data' (reexportado).

// ===== Progresso do usuário (persistido) =====

export interface UserProgress {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string | null; // ISO date
  activeDates: string[]; // histórico para o "mapa de constância"
  completedChecklist: Record<string, boolean>; // checklistItemId -> done
  completedExercises: Record<string, boolean>; // exerciseId -> done correctly
  exerciseAttempts: Record<string, number>;
  gamesScores: Record<string, number>; // gameId -> melhor score
  unlockedAchievements: string[];
  moduleProgress: Record<string, number>; // moduleId -> 0-100
  currentModuleId: string;
  notes: Record<string, string>; // moduleId -> nota pessoal (legado, mantido por compatibilidade)
  projectNotes: Record<string, ProjectNote>; // moduleId -> nota de projeto com links
  spacedReview: Record<string, SpacedReviewItem>; // exerciseId -> estado de revisão
  interviewHistory: InterviewHistoryEntry[];
}

export interface InterviewHistoryEntry {
  id: string;
  trackLabel: string;
  levelLabel: string;
  overallScore: number;
  theoryScore: number;
  practicalScore: number;
  behavioralAnswered: number;
  behavioralTotal: number;
  completedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  check: (p: UserProgress) => boolean;
}
