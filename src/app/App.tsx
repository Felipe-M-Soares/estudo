import { useState, useEffect, Fragment } from "react";
import { useProfile } from "../lib/useCloudProfile";
import {
  LayoutDashboard,
  BookOpen,
  PlayCircle,
  BarChart3,
  Users,
  ChevronRight,
  Star,
  Clock,
  Award,
  TrendingUp,
  MessageCircle,
  Heart,
  Lock,
  Check,
  X,
  Bell,
  Search,
  Play,
  FileText,
  Zap,
  Target,
  Home,
  Map,
  Sparkles,
  Code2,
  Gamepad2,
  BriefcaseBusiness,
  ShieldCheck,
  Coins,
} from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from "recharts";
import { modules, phases, library, usefulLinks, totalChecklistCount, totalExerciseCount } from "./study-data";
import type { Module } from "./study-data/types";
import {
  achievementCatalog,
  careerLadder,
  dailyPlan,
  learningWorlds,
  marketplace,
  projectCampaigns,
  reviewQueue,
  skillTree,
} from "./study-data/platform";
import { gameRegistry } from "./components/games/registry";

type Page = "dashboard" | "cursos" | "aulas" | "historia" | "laboratorio" | "arcade" | "carreira" | "revisao" | "progresso" | "loja";

const NAV_ITEMS = [
  { id: "dashboard", label: "Começar", icon: Home },
  { id: "cursos", label: "Trilha", icon: Map },
  { id: "aulas", label: "Aulas", icon: BookOpen },
  { id: "laboratorio", label: "Laboratório", icon: Code2 },
  { id: "arcade", label: "Arcade", icon: Gamepad2 },
  { id: "carreira", label: "Carreira", icon: BriefcaseBusiness },
  { id: "revisao", label: "Revisão", icon: ShieldCheck },
  { id: "progresso", label: "Analytics", icon: BarChart3 },
  { id: "loja", label: "Loja", icon: Coins },
];

// Marca Code Mage
const LOGO_SRC = "/brand/logo.png";

// Emblemas circulares (temáticos, decorativos) usados em jogos, cursos e itens da loja.
// NUNCA usar aqui os personagens — personagens ficam só na Loja/Perfil.
const GAME_BADGES = Array.from({ length: 52 }, (_, i) => `/game-icons/badge-${String(i + 1).padStart(2, "0")}.png`);

function hashKey(key: string) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return hash;
}

// Emblema determinístico por chave estável (mesmo jogo/curso sempre mostra o mesmo emblema).
function badgeForKey(key: string) {
  return GAME_BADGES[hashKey(key) % GAME_BADGES.length];
}

function badgeForIndex(index: number) {
  return GAME_BADGES[index % GAME_BADGES.length];
}

// Sinalização de linguagem/tecnologia por jogo do Arcade.
type TechFamily =
  | "js" | "ts" | "python" | "go" | "java" | "sql" | "nosql" | "css" | "git"
  | "cloud" | "arch" | "security" | "logic" | "http" | "graphql" | "practice" | "lang";

const TECH_STYLES: Record<TechFamily, string> = {
  js: "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30",
  ts: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
  python: "bg-sky-500/15 text-sky-300 border border-sky-500/30",
  go: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30",
  java: "bg-orange-500/15 text-orange-300 border border-orange-500/30",
  sql: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  nosql: "bg-lime-500/15 text-lime-300 border border-lime-500/30",
  css: "bg-pink-500/15 text-pink-300 border border-pink-500/30",
  git: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  cloud: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
  arch: "bg-purple-500/15 text-purple-300 border border-purple-500/30",
  security: "bg-red-500/15 text-red-300 border border-red-500/30",
  logic: "bg-violet-500/15 text-violet-300 border border-violet-500/30",
  http: "bg-teal-500/15 text-teal-300 border border-teal-500/30",
  graphql: "bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30",
  practice: "bg-slate-500/15 text-slate-300 border border-slate-500/30",
  lang: "bg-rose-500/15 text-rose-300 border border-rose-500/30",
};

const GAME_TECH: Record<string, { label: string; family: TechFamily }> = {
  "architecture-builder": { label: "Arquitetura", family: "arch" },
  "architecture-review-board": { label: "Arquitetura", family: "arch" },
  "aws-service-matcher": { label: "AWS", family: "cloud" },
  "bug-hunter": { label: "JavaScript", family: "js" },
  "cicd-pipeline-builder": { label: "CI/CD", family: "cloud" },
  "code-review-simulator": { label: "Boas práticas", family: "practice" },
  "css-selector-hunt": { label: "CSS", family: "css" },
  "docker-compose-builder": { label: "Docker", family: "cloud" },
  "flexbox-dojo": { label: "CSS", family: "css" },
  "fullstack-wiring": { label: "Full-Stack", family: "arch" },
  "git-branch-simulator": { label: "Git", family: "git" },
  "go-concurrency": { label: "Go", family: "go" },
  "graphql-query-shaper": { label: "GraphQL", family: "graphql" },
  "http-status-match": { label: "HTTP/API", family: "http" },
  "java-stream-builder": { label: "Java", family: "java" },
  "js-console-detective": { label: "JavaScript", family: "js" },
  "k8s-resource-builder": { label: "Kubernetes", family: "cloud" },
  "logic-maze": { label: "Lógica", family: "logic" },
  "memory-concepts": { label: "Lógica", family: "logic" },
  "microservices-architect": { label: "Arquitetura", family: "arch" },
  "middleware-pipeline": { label: "Node.js", family: "js" },
  "nosql-command": { label: "NoSQL", family: "nosql" },
  "python-detective": { label: "Python", family: "python" },
  "react-state-lab": { label: "React", family: "js" },
  "rendering-strategy-picker": { label: "Next.js", family: "js" },
  "solid-principles-sorter": { label: "SOLID", family: "practice" },
  "sort-visualizer": { label: "Algoritmos", family: "logic" },
  "sql-query-builder": { label: "SQL", family: "sql" },
  "system-design-whiteboard": { label: "System Design", family: "arch" },
  "tech-english-flashcards": { label: "Inglês Técnico", family: "lang" },
  "terminal-simulator": { label: "Terminal/Shell", family: "practice" },
  "tic-tac-toe-build": { label: "JavaScript", family: "js" },
  "typescript-type-detective": { label: "TypeScript", family: "ts" },
  "vulnerability-hunter": { label: "Segurança", family: "security" },
};

function techForGame(gameId: string) {
  return GAME_TECH[gameId] ?? { label: "Prática", family: "practice" as TechFamily };
}

function LanguageTag({ gameId }: { gameId: string }) {
  const tech = techForGame(gameId);
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${TECH_STYLES[tech.family]}`}>
      {tech.label}
    </span>
  );
}

// Personagens: exclusivos da Loja / Perfil (nunca aparecem em jogos ou cursos).
interface CharacterDef {
  id: string;
  src: string;
  name: string;
  price: number;
  rarity: "Comum" | "Raro" | "Epico" | "Lendario";
}

const CHARACTER_NAMES = [
  "Cavaleiro Templário", "Mago Ancião", "Guerreira Valquíria", "Bárbaro do Norte",
  "Clériga da Luz", "Espadachim Errante", "Guardião de Prata", "Bardo Itinerante",
  "Anão Artilheiro", "Orc Batedor", "Bárbaro Duplo-Machado", "Elfa Arcana",
  "Feiticeiro Rubro", "Demônio Menor", "Orc Guerreiro", "Cavaleiro Negro",
  "Morcego Sombrio", "Bardo de Botas Roxas", "Esqueleto Guerreiro", "Monge Punho de Ferro",
  "Arqueira Élfica", "Caçador da Floresta",
];

const CHARACTER_PRICES = [0, 350, 350, 400, 450, 500, 550, 600, 650, 700, 750, 900, 950, 1000, 1050, 1100, 1150, 1200, 1300, 1400, 1500, 1600];

function rarityForPrice(price: number): CharacterDef["rarity"] {
  if (price === 0) return "Comum";
  if (price < 700) return "Comum";
  if (price < 1100) return "Raro";
  if (price < 1450) return "Epico";
  return "Lendario";
}

const CHARACTERS: CharacterDef[] = Array.from({ length: 22 }, (_, i) => {
  const price = CHARACTER_PRICES[i] ?? 400 + i * 60;
  return {
    id: `char-${String(i + 1).padStart(2, "0")}`,
    src: `/characters/char-${String(i + 1).padStart(2, "0")}.png`,
    name: CHARACTER_NAMES[i] ?? `Personagem ${i + 1}`,
    price,
    rarity: rarityForPrice(price),
  };
});

const DEFAULT_CHARACTER_ID = "char-01";
function characterSrc(id: string) {
  return CHARACTERS.find((c) => c.id === id)?.src ?? CHARACTERS[0].src;
}

// ----------------------------------------------------------------------------
// Uso pessoal: nenhum conteúdo é bloqueado por plano/login — toda a trilha
// (todos os 22 meses, aulas, laboratório e arcade) fica sempre liberada.
// ----------------------------------------------------------------------------

function Badge({ children, color = "primary" }: { children: React.ReactNode; color?: "primary" | "accent" | "success" | "warning" }) {
  const colors = {
    primary: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
    accent: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
    success: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
}

function Card({ children, className = "", hover = false, onClick }: { children: React.ReactNode; className?: string; hover?: boolean; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
      className={`bg-card border border-border rounded-2xl p-5 ${hover ? "hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-900/20 transition-all duration-200 cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function Avatar({ src, name, size = "md" }: { src?: string; name: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg" };
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const image = src ?? characterSrc(DEFAULT_CHARACTER_ID);
  return (
    <div className={`${sizes[size]} flex-shrink-0 flex items-center justify-center`}>
      <img src={image} alt={name} className="w-full h-full object-contain" />
      {!src && <span className="sr-only">{initials}</span>}
    </div>
  );
}

function renderInlineMarkdown(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter((p) => p.length > 0);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-${i}`} className="text-foreground font-bold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={`${keyPrefix}-${i}`} className="bg-black/30 text-purple-200 rounded px-1.5 py-0.5 text-xs font-mono">{part.slice(1, -1)}</code>;
    }
    return <Fragment key={`${keyPrefix}-${i}`}>{part}</Fragment>;
  });
}

function LessonBody({ text }: { text: string }) {
  const blocks = text.split("\n\n").filter((b) => b.trim().length > 0);
  return (
    <div className="space-y-4">
      {blocks.map((block, bIndex) => {
        const lines = block.split("\n").filter((l) => l.trim().length > 0);
        const isList = lines.length > 0 && lines.every((l) => l.trim().startsWith("- "));
        if (isList) {
          return (
            <ul key={bIndex} className="space-y-2">
              {lines.map((l, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed bg-input-background/60 border border-border/60 rounded-lg px-3 py-2">
                  <span className="text-purple-400 flex-shrink-0">▸</span>
                  <span>{renderInlineMarkdown(l.replace(/^- /, ""), `${bIndex}-${i}`)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={bIndex} className="text-sm text-muted-foreground leading-relaxed">
            {lines.map((line, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {renderInlineMarkdown(line, `${bIndex}-${i}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function estimateReadingMinutes(...texts: (string | undefined)[]) {
  const words = texts.filter(Boolean).join(" ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 130));
}

function keyPointsFromBody(text: string): string[] {
  const bulletBlocks = text.split("\n\n").filter((block) => block.split("\n").every((l) => l.trim().startsWith("- ") || l.trim().length === 0));
  const points = bulletBlocks.flatMap((block) => block.split("\n").filter((l) => l.trim().startsWith("- ")).map((l) => l.replace(/^- /, "").replace(/\*\*/g, "").trim()));
  return points.slice(0, 5);
}

function missionTargetPage(missionId: string): Page {
  if (missionId.includes("review")) return "revisao";
  if (missionId.includes("lab")) return "laboratorio";
  if (missionId.includes("debug")) return "laboratorio";
  return "aulas";
}

function moduleForWorld(world: (typeof learningWorlds)[number]) {
  if (world.track === "career") return null;
  if (world.track === "ia") return modules.find((m) => m.title.toLowerCase().includes("api")) ?? modules[10] ?? modules[0];
  return modules.find((m) => m.track === world.track) ?? modules[0];
}

function exerciseAnswerText(exercise: Module["exercises"][number]) {
  if (exercise.type === "mcq") return exercise.options[exercise.correctIndex];
  if (exercise.type === "truefalse") return exercise.answer ? "Verdadeiro" : "Falso";
  if (exercise.type === "code-fill") return exercise.answer;
  if (exercise.type === "order") return exercise.steps.map((step, index) => `${index + 1}. ${step}`).join("\n");
  return exercise.pairs.map((pair) => `${pair.left} -> ${pair.right}`).join("\n");
}

function isExerciseCorrect(exercise: Module["exercises"][number], answer: string) {
  const normalized = answer.trim().toLowerCase();
  if (!normalized) return false;
  if (exercise.type === "mcq") return Number(answer) === exercise.correctIndex;
  if (exercise.type === "truefalse") return answer === String(exercise.answer);
  if (exercise.type === "code-fill") return normalized.includes(exercise.answer.trim().toLowerCase());
  if (exercise.type === "order") return exercise.steps.every((step) => normalized.includes(step.toLowerCase().slice(0, 18)));
  return exercise.pairs.every((pair) => normalized.includes(pair.left.toLowerCase()) && normalized.includes(pair.right.toLowerCase()));
}

// SIDEBAR
function Sidebar({
  page,
  setPage,
  equippedCharacterId,
  displayName,
}: {
  page: Page;
  setPage: (p: Page) => void;
  equippedCharacterId: string;
  displayName: string;
}) {
  return (
    <aside className="w-60 bg-sidebar border-r border-sidebar-border flex flex-col flex-shrink-0" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-600/10 flex items-center justify-center overflow-hidden">
            <img src={LOGO_SRC} alt="Code Mage" className="w-full h-full object-contain" />
          </div>
            <span className="text-foreground font-bold text-lg tracking-tight">Code Mage</span>
        </div>
      </div>

      <div className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = page === id;
          return (
            <button
              key={id}
              onClick={() => setPage(id as Page)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              {label}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <button onClick={() => setPage("loja")} className="w-full flex items-center gap-3 px-1 group">
          <Avatar name={displayName} size="sm" src={characterSrc(equippedCharacterId)} />
          <div className="min-w-0 text-left">
            <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate group-hover:text-purple-300 transition-colors">trocar personagem</p>
          </div>
        </button>
      </div>
    </aside>
  );
}

// TOPBAR
function Topbar({ title, setPage, coins }: { title: string; setPage: (p: Page) => void; coins: number }) {
  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-6 flex-shrink-0 bg-background/80 backdrop-blur-sm">
      <h1 className="text-base font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input className="bg-input-background border border-border rounded-xl pl-8 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-purple-500/50 w-44 transition-all" placeholder="Buscar..." />
        </div>
        <button onClick={() => setPage("loja")} className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-amber-500/20 transition-colors">
          <Coins className="w-3.5 h-3.5" />{coins.toLocaleString("pt-BR")}
        </button>
        <button className="relative w-8 h-8 rounded-xl bg-input-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-purple-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}

// DASHBOARD
function DashboardPage({
  setPage,
  activeModule,
  setActiveModule,
  completedMissions,
  completeMission,
}: {
  setPage: (p: Page) => void;
  activeModule: Module;
  setActiveModule: (m: Module) => void;
  completedMissions: Record<string, boolean>;
  completeMission: (id: string) => void;
}) {
  const progressData = [
    { name: "Seg", hours: 2.5 }, { name: "Ter", hours: 1.8 }, { name: "Qua", hours: 3.2 },
    { name: "Qui", hours: 2.1 }, { name: "Sex", hours: 4.0 }, { name: "Sáb", hours: 1.5 }, { name: "Dom", hours: 0.8 },
  ];
  const currentPhase = phases.find((p) => p.phase === activeModule.phase) ?? phases[0];
  const nextModules = modules.slice(Math.max(activeModule.month - 1, 0), Math.max(activeModule.month - 1, 0) + 4);
  const completedToday = dailyPlan.filter((mission) => completedMissions[mission.id]).length;

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Welcome */}
      <div className="rounded-2xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #4c1d95 0%, #5b21b6 50%, #0e7490 100%)" }}>
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, rgba(6,182,212,0.2) 0%, transparent 60%)" }} />
        <div className="relative p-6 flex items-center justify-between">
          <div>
            <p className="text-purple-200 text-sm font-medium mb-1">Bem-vinda de volta</p>
            <h2 className="text-2xl font-extrabold text-white mb-1">Ana Silva</h2>
            <p className="text-purple-200 text-sm">Módulo ativo: {activeModule.emoji} {activeModule.title}</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="bg-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-medium flex items-center gap-1.5">
                <Clock className="w-3 h-3" />{currentPhase.title}: {currentPhase.objective}
              </div>
              <div className="bg-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-medium flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-yellow-300" />{modules.length} módulos · {totalExerciseCount()} exercícios
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setPage("aulas")} className="bg-white text-purple-900 text-xs font-bold px-4 py-2 rounded-xl hover:bg-purple-100 transition-colors">
                Continuar aula
              </button>
              <button onClick={() => setPage("laboratorio")} className="bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-white/15 transition-colors">
                Abrir laboratório
              </button>
            </div>
          </div>
          <div className="hidden sm:block w-24 h-24 rounded-2xl overflow-hidden opacity-80">
            <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=200&fit=crop&auto=format" alt="Programação" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Módulos", value: String(modules.length), icon: BookOpen, color: "text-purple-400", bg: "bg-purple-500/10" },
          { label: "Aulas", value: String(modules.reduce((sum, m) => sum + m.lessons.length, 0)), icon: PlayCircle, color: "text-cyan-400", bg: "bg-cyan-500/10" },
          { label: "Checklists", value: String(totalChecklistCount()), icon: Award, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Fases", value: String(phases.length), icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        ].map((s) => (
          <Card key={s.label}>
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
            </div>
            <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-foreground">Missões de Hoje</h3>
            <Badge color={completedToday === dailyPlan.length ? "success" : "accent"}>{completedToday}/{dailyPlan.length} concluídas</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dailyPlan.map((mission) => {
              const done = completedMissions[mission.id];
              return (
              <div key={mission.id} className={`text-left bg-input-background border rounded-xl p-4 transition-colors ${done ? "border-emerald-500/50" : "border-border hover:border-purple-500/40"}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-foreground">{mission.title}</p>
                  <span className={`text-xs ${done ? "text-emerald-300" : "text-purple-300"}`}>{done ? "feito" : `${mission.xp} XP`}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{mission.mode} · {mission.duration}</p>
                <p className="text-xs text-foreground/80">{mission.focus}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button onClick={() => setPage(missionTargetPage(mission.id))} className="text-xs font-bold text-purple-300 hover:text-purple-200 transition-colors">
                    Ir para caminho
                  </button>
                  <button onClick={() => completeMission(mission.id)} className="text-xs font-bold text-emerald-300 hover:text-emerald-200 transition-colors">
                    {done ? "Concluída" : "Marcar concluída"}
                  </button>
                </div>
              </div>
            );})}
          </div>
        </Card>

        {/* Continue */}
        <Card>
          <h3 className="font-bold text-foreground mb-4">Continuar Trilha</h3>
          <div className="space-y-3">
            {nextModules.map((c, index) => (
              <button key={c.id} onClick={() => { setActiveModule(c); setPage("aulas"); }} className="w-full text-left group">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-foreground font-medium group-hover:text-purple-300 transition-colors">{c.emoji} {c.title}</span>
                  <span className="text-muted-foreground">Mês {c.month}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${index === 0 ? 68 : 18 + index * 14}%`, background: ["#7c3aed", "#06b6d4", "#f59e0b", "#10b981"][index] }} />
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <h3 className="font-bold text-foreground mb-4">Mundos de Aprendizagem</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {learningWorlds.map((world) => (
              <button
                key={world.id}
                onClick={() => {
                  const target = moduleForWorld(world);
                  if (target) {
                    setActiveModule(target);
                    setPage("aulas");
                  } else {
                    setPage("carreira");
                  }
                }}
                className="text-left rounded-xl bg-input-background border border-border p-4 hover:border-purple-500/40 transition-colors"
              >
                <p className="text-sm font-bold text-foreground">{world.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{world.subtitle}</p>
                <p className="text-xs text-purple-300 mt-3">{world.chapters.join(" · ")}</p>
                <p className="text-xs text-emerald-300 mt-2">Abrir conteúdo deste mundo</p>
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-bold text-foreground mb-4">Revisões Pendentes</h3>
          <div className="space-y-3">
            {reviewQueue.slice(0, 3).map((item) => (
              <button key={item.id} onClick={() => setPage("revisao")} className="w-full text-left border-l-2 border-purple-500 pl-3">
                <p className="text-sm font-semibold text-foreground">{item.topic}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{item.prompt}</p>
                <p className="text-xs text-purple-300 mt-1">{item.due} · força {item.strength}%</p>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// TRILHA
function CursosPage({ setPage, activeModule, setActiveModule }: { setPage: (p: Page) => void; activeModule: Module; setActiveModule: (m: Module) => void }) {
  const [tab, setTab] = useState<number | "todos">("todos");
  const visiblePhases = tab === "todos" ? phases : phases.filter((phase) => phase.phase === tab);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      <div>
        <Badge color="accent">Mapa de estudos</Badge>
        <h2 className="text-2xl font-extrabold text-foreground mt-3">Trilha organizada por mês e etapa</h2>
        <p className="text-sm text-muted-foreground mt-1">Use os filtros para ver uma fase por vez. Cada card abre o módulo direto nas aulas.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(["todos", ...phases.map((p) => p.phase)] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${tab === t ? "bg-purple-600 text-white shadow-md shadow-purple-900/40" : "bg-input-background text-muted-foreground hover:text-foreground border border-border"}`}>
            {t === "todos" ? "Todos" : `Fase ${t}`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {visiblePhases.map((phase) => (
          <Card key={phase.phase} className="!p-4">
            <div className="flex items-center justify-between gap-2">
              <Badge color={phase.phase === activeModule.phase ? "success" : "primary"}>Fase {phase.phase}</Badge>
              <span className="text-xs text-purple-300">{phase.months[0]}-{phase.months[phase.months.length - 1]}</span>
            </div>
            <h3 className="font-bold text-foreground mt-2 text-sm">{phase.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{phase.objective}</p>
          </Card>
        ))}
      </div>

      {visiblePhases.map((phase) => {
        const phaseModules = modules.filter((moduleItem) => moduleItem.phase === phase.phase).sort((a, b) => a.month - b.month);
        return (
          <section key={`modules-${phase.phase}`} className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-foreground">Etapa {phase.phase}: {phase.title}</h3>
                <p className="text-xs text-muted-foreground">{phase.objective}</p>
              </div>
              <Badge color="accent">Meses {phase.months[0]}-{phase.months[phase.months.length - 1]}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
              {phaseModules.map((c, index) => {
                const open = () => { setActiveModule(c); setPage("aulas"); };
                return (
                  <Card key={c.id} hover className="!p-4 relative" onClick={open}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 flex-shrink-0">
                        <img src={badgeForKey(c.id)} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap gap-1.5 mb-2">
                        <Badge color="primary">Mês {c.month}</Badge>
                        <Badge color="accent">{c.track}</Badge>
                        </div>
                        <h3 className="font-bold text-foreground text-sm leading-snug">{c.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.tagline}</p>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-purple-400 rounded-full" style={{ width: `${activeModule.id === c.id ? 68 : c.month <= activeModule.month ? 35 : 8}%` }} />
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">{c.lessons.length} aulas · {c.exercises.length} exercícios</span>
                      <button onClick={(e) => { e.stopPropagation(); open(); }} className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                        {activeModule.id === c.id ? "Continuar" : "Abrir"}<ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

// AULAS
type ModuleProgress = Partial<{
  exerciseAnswers: Record<string, string>;
  checkedExercises: Record<string, boolean>;
  projectSteps: Record<string, boolean>;
  projectSolution: string;
  projectTested: boolean;
}>;

function AulasPage({
  module,
  setPage,
  completedLessons: completedLessonsProp,
  onCompleteLesson,
  progress,
  onSaveProgress,
}: {
  module: Module;
  setPage: (p: Page) => void;
  completedLessons?: Record<string, boolean>;
  onCompleteLesson?: (key: string) => void;
  progress?: ModuleProgress;
  onSaveProgress?: (moduleId: string, progress: unknown) => void;
}) {
  const [selected, setSelected] = useState(0);
  const [contentTab, setContentTab] = useState<"aula" | "exercicios" | "checklist" | "projeto">("aula");
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, string>>(() => progress?.exerciseAnswers ?? {});
  const [checkedExercises, setCheckedExercises] = useState<Record<string, boolean>>(() => progress?.checkedExercises ?? {});
  const [localCompletedLessons, setLocalCompletedLessons] = useState<Record<string, boolean>>({});
  const completedLessons = completedLessonsProp ?? localCompletedLessons;
  const completeLesson = (key: string) => {
    if (onCompleteLesson) onCompleteLesson(key);
    else setLocalCompletedLessons((prev) => ({ ...prev, [key]: true }));
  };
  const [projectSteps, setProjectSteps] = useState<Record<string, boolean>>(() => progress?.projectSteps ?? {});
  const [projectSolution, setProjectSolution] = useState(() => progress?.projectSolution ?? "");
  const [projectTested, setProjectTested] = useState(() => progress?.projectTested ?? false);
  const currentIndex = Math.min(selected, Math.max(module.lessons.length - 1, 0));
  const current = module.lessons[currentIndex] ?? module.lessons[0];
  const lessonKey = (index: number) => `${module.id}-${module.lessons[index]?.id ?? index}`;
  const isLessonComplete = (index: number) => Boolean(completedLessons[lessonKey(index)]);
  const canOpenLesson = (index: number) => index === 0 || isLessonComplete(index - 1);
  const completedLessonsCount = module.lessons.filter((_, index) => isLessonComplete(index)).length;
  const story = module.storyLessons?.[currentIndex % Math.max(module.storyLessons.length, 1)];
  const debugCase = module.debugCases?.[currentIndex % Math.max(module.debugCases.length, 1)];
  const scenario = module.scenarios?.[currentIndex % Math.max(module.scenarios.length, 1)];
  const [scenarioCheckAnswer, setScenarioCheckAnswer] = useState<number | null>(null);
  const projectItems =
    module.projectBrief?.requirements ??
    module.sprintLab?.sprints.map((sprint) => `${sprint.title}: ${sprint.objective} Entrega: ${sprint.deliverable}`) ??
    module.checklist.map((item) => item.label);
  const completedProjectSteps = projectItems.filter((_, index) => projectSteps[`${module.id}-${index}`]).length;
  const projectPass = completedProjectSteps >= Math.min(2, projectItems.length) && projectSolution.trim().length >= 80;
  const tabsUnlocked = completedLessonsCount >= module.lessons.length;

  useEffect(() => {
    setSelected(0);
    setContentTab("aula");
    setExerciseAnswers(progress?.exerciseAnswers ?? {});
    setCheckedExercises(progress?.checkedExercises ?? {});
    setProjectSteps(progress?.projectSteps ?? {});
    setProjectSolution(progress?.projectSolution ?? "");
    setProjectTested(progress?.projectTested ?? false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module.id]);

  useEffect(() => {
    setScenarioCheckAnswer(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module.id, currentIndex]);

  // Salva o progresso (exercícios, checklist, projeto) sempre que algo muda.
  // onSaveProgress já tem debounce interno, então é seguro chamar a cada tecla.
  useEffect(() => {
    onSaveProgress?.(module.id, { exerciseAnswers, checkedExercises, projectSteps, projectSolution, projectTested });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseAnswers, checkedExercises, projectSteps, projectSolution, projectTested]);

  return (
    <div className="flex-1 overflow-hidden flex">
      {/* Player area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="relative bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 flex-shrink-0 px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge color="primary">Mês {module.month}</Badge>
              <Badge color="accent">{module.track}</Badge>
            </div>
            <h2 className="text-xl font-extrabold text-white">{current.heading}</h2>
            <p className="text-sm text-purple-200 mt-1">{module.emoji} {module.title} · {module.tagline}</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-100 bg-white/10 backdrop-blur px-3 py-1.5 rounded-xl">
            <BookOpen className="w-3.5 h-3.5" />
            ~{estimateReadingMinutes(current.body, story?.mission, story?.tension, debugCase?.context, scenario?.situation, scenario?.whatHappens, scenario?.howToSolve)} min de leitura
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Aula", tab: "aula" as const, locked: false },
              { label: `Exercícios (${module.exercises.length})`, tab: "exercicios" as const, locked: completedLessonsCount < module.lessons.length },
              { label: `Checklist (${module.checklist.length})`, tab: "checklist" as const, locked: completedLessonsCount < module.lessons.length },
              { label: "Projeto", tab: "projeto" as const, locked: completedLessonsCount < module.lessons.length },
            ].map((t) => (
              <button
                key={t.label}
                onClick={() => { if (!t.locked) setContentTab(t.tab); }}
                disabled={t.locked}
                title={t.locked ? "Conclua todas as aulas do módulo para liberar" : undefined}
                className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${contentTab === t.tab ? "bg-purple-600 text-white" : t.locked ? "bg-input-background border border-border text-muted-foreground/50 cursor-not-allowed" : "bg-input-background border border-border text-muted-foreground hover:text-foreground"}`}
              >
                {t.locked && <Lock className="w-3 h-3" />}{t.label}
              </button>
            ))}
            <button onClick={() => setPage("laboratorio")} className="px-3 py-1.5 rounded-xl text-sm font-semibold bg-input-background border border-border text-muted-foreground hover:text-foreground">Laboratório</button>
          </div>

          {completedLessonsCount < module.lessons.length && (
            <div className="flex items-center gap-3 bg-purple-500/10 border border-purple-500/20 rounded-xl px-4 py-2.5">
              <Lock className="w-3.5 h-3.5 text-purple-300 flex-shrink-0" />
              <p className="text-xs text-purple-200">
                Termine todo o conteúdo primeiro: {completedLessonsCount}/{module.lessons.length} aulas concluídas.
                Exercícios, checklist e projeto liberam automaticamente ao concluir a última aula — assim você só pratica depois de aprender.
              </p>
            </div>
          )}

          {contentTab === "aula" && (
            <div className="space-y-4">
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-foreground">Aula explicada</h3>
                  <span className="text-xs text-muted-foreground">{currentIndex + 1}/{module.lessons.length}</span>
                </div>
                <LessonBody text={current.body} />
                {current.codeExample && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-purple-300 uppercase tracking-wide mb-1.5">Exemplo · {current.codeExample.lang}</p>
                    <pre className="overflow-x-auto rounded-xl bg-black/40 border border-purple-500/20 p-4 text-xs text-purple-100">
                      <code>{current.codeExample.code}</code>
                    </pre>
                  </div>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => completeLesson(lessonKey(currentIndex))}
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                  >
                    {isLessonComplete(currentIndex) ? "Aula concluída" : "Concluir aula"}
                  </button>
                  {isLessonComplete(currentIndex) && currentIndex + 1 < module.lessons.length && (
                    <button onClick={() => setSelected(currentIndex + 1)} className="text-xs font-bold text-emerald-300 hover:text-emerald-200 transition-colors">
                      Liberar próxima aula
                    </button>
                  )}
                </div>
              </Card>

              {keyPointsFromBody(current.body).length > 0 && (
                <Card>
                  <Badge color="success">Pontos-chave</Badge>
                  <ul className="mt-3 space-y-2">
                    {keyPointsFromBody(current.body).map((point, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-foreground">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {story && (
                <Card>
                  <Badge color="accent">História dentro da aula</Badge>
                  <h3 className="font-bold text-foreground mt-3 mb-2">{story.title}</h3>
                  <p className="text-sm text-muted-foreground">{story.mission}</p>
                  <div className="mt-3 bg-input-background border border-border rounded-xl p-3">
                    <p className="text-xs text-purple-300 font-semibold mb-1">Contexto do problema</p>
                    <p className="text-sm text-foreground">{story.tension}</p>
                  </div>
                  <p className="text-xs text-emerald-300 mt-3">{story.takeaway}</p>
                </Card>
              )}

              {debugCase && (
                <Card>
                  <Badge color="warning">Bug guiado</Badge>
                  <h3 className="font-bold text-foreground mt-3 mb-2">{debugCase.title}</h3>
                  <p className="text-sm text-muted-foreground">{debugCase.context}</p>
                  <pre className="mt-3 overflow-x-auto rounded-xl bg-black/40 border border-border p-4 text-xs text-purple-100">{debugCase.log}</pre>
                  <p className="text-xs text-emerald-300 mt-3">Correção esperada: {debugCase.fix}</p>
                </Card>
              )}

              {scenario && (
                <Card>
                  <Badge color="primary">Cenário do dia a dia · {scenario.context === "trabalho" ? "no trabalho" : "uso pessoal"}</Badge>
                  <h3 className="font-bold text-foreground mt-3 mb-2">{scenario.emoji} {scenario.title}</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">A situação</p>
                      <p className="text-sm text-foreground">{scenario.situation}</p>
                    </div>
                    <div className="bg-input-background border border-border rounded-xl p-3">
                      <p className="text-xs font-semibold text-amber-300 mb-1">O que acontece</p>
                      <p className="text-sm text-foreground">{scenario.whatHappens}</p>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                      <p className="text-xs font-semibold text-emerald-300 mb-1">Como resolver</p>
                      <p className="text-sm text-foreground">{scenario.howToSolve}</p>
                    </div>
                  </div>
                  {scenario.check && (
                    <div className="mt-4 border-t border-border pt-4">
                      <p className="text-sm font-bold text-foreground mb-2">Checagem rápida: {scenario.check.question}</p>
                      <div className="grid gap-2">
                        {scenario.check.options.map((option, i) => {
                          const isChosen = scenarioCheckAnswer === i;
                          const isCorrect = i === scenario.check!.correctIndex;
                          const showState = scenarioCheckAnswer !== null;
                          return (
                            <button
                              key={option}
                              onClick={() => setScenarioCheckAnswer(i)}
                              className={`text-left rounded-lg border px-3 py-2 text-xs transition-colors ${
                                showState && isCorrect ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-200"
                                : showState && isChosen && !isCorrect ? "border-red-500/60 bg-red-500/10 text-red-200"
                                : "border-border bg-card text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                      {scenarioCheckAnswer !== null && (
                        <p className="text-xs text-muted-foreground mt-2">{scenario.check.explanation}</p>
                      )}
                    </div>
                  )}
                </Card>
              )}
            </div>
          )}

          {contentTab !== "aula" && !tabsUnlocked && (
            <Card className="text-center py-10">
              <Lock className="w-6 h-6 text-purple-300 mx-auto mb-3" />
              <h3 className="font-bold text-foreground">Conteúdo bloqueado</h3>
              <p className="text-sm text-muted-foreground mt-1">Termine todas as aulas deste módulo ({completedLessonsCount}/{module.lessons.length}) para liberar esta seção.</p>
              <button onClick={() => setContentTab("aula")} className="mt-4 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                Voltar para a aula
              </button>
            </Card>
          )}

          {contentTab === "exercicios" && tabsUnlocked && (
            <Card>
              <h3 className="font-bold text-foreground mb-3">Treino Guiado Completo</h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                {module.exercises.map((exercise) => {
                  const answer = exerciseAnswers[exercise.id] ?? "";
                  const checked = checkedExercises[exercise.id];
                  const correct = isExerciseCorrect(exercise, answer);
                  return (
                  <div key={exercise.id} className="bg-input-background border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge color="warning">{exercise.type}</Badge>
                      <span className="text-xs text-muted-foreground">treino</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{exercise.prompt}</p>
                    {"code" in exercise && exercise.code && <pre className="mt-3 overflow-x-auto rounded-lg bg-black/30 p-3 text-xs text-purple-100"><code>{exercise.code}</code></pre>}
                    {"codeTemplate" in exercise && <pre className="mt-3 overflow-x-auto rounded-lg bg-black/30 p-3 text-xs text-purple-100"><code>{exercise.codeTemplate}</code></pre>}
                    {exercise.type === "mcq" && (
                      <div className="mt-3 grid gap-2">
                        {exercise.options.map((option, optionIndex) => (
                          <button
                            key={option}
                            onClick={() => setExerciseAnswers((prev) => ({ ...prev, [exercise.id]: String(optionIndex) }))}
                            className={`text-left rounded-lg border px-3 py-2 text-xs transition-colors ${answer === String(optionIndex) ? "border-purple-500/60 bg-purple-500/10 text-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"}`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                    {exercise.type === "truefalse" && (
                      <div className="mt-3 flex gap-2">
                        {[true, false].map((value) => (
                          <button
                            key={String(value)}
                            onClick={() => setExerciseAnswers((prev) => ({ ...prev, [exercise.id]: String(value) }))}
                            className={`rounded-lg border px-3 py-2 text-xs transition-colors ${answer === String(value) ? "border-purple-500/60 bg-purple-500/10 text-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"}`}
                          >
                            {value ? "Verdadeiro" : "Falso"}
                          </button>
                        ))}
                      </div>
                    )}
                    {exercise.type === "code-fill" && (
                      <textarea
                        value={answer}
                        onChange={(e) => setExerciseAnswers((prev) => ({ ...prev, [exercise.id]: e.target.value }))}
                        placeholder={`Preencha o trecho faltante. Dica: ${exercise.hint}`}
                        className="mt-3 w-full min-h-28 bg-card border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                      />
                    )}
                    {exercise.type === "order" && (
                      <textarea
                        value={answer}
                        onChange={(e) => setExerciseAnswers((prev) => ({ ...prev, [exercise.id]: e.target.value }))}
                        placeholder="Escreva a ordem correta, um passo por linha."
                        className="mt-3 w-full min-h-28 bg-card border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                      />
                    )}
                    {exercise.type === "match" && (
                      <textarea
                        value={answer}
                        onChange={(e) => setExerciseAnswers((prev) => ({ ...prev, [exercise.id]: e.target.value }))}
                        placeholder="Relacione cada item da esquerda com a explicação correta."
                        className="mt-3 w-full min-h-28 bg-card border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                      />
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={() => setCheckedExercises((prev) => ({ ...prev, [exercise.id]: true }))} className="text-xs font-bold text-purple-300 hover:text-purple-200 transition-colors">
                        Verificar resposta
                      </button>
                      {checked && <Badge color={correct ? "success" : "warning"}>{correct ? "correta" : "ver resposta"}</Badge>}
                    </div>
                    {checked && (
                      <div className="mt-3 rounded-xl bg-card border border-border p-3">
                        <p className="text-xs font-semibold text-foreground mb-1">Resposta esperada</p>
                        <pre className="whitespace-pre-wrap text-xs text-emerald-300">{exerciseAnswerText(exercise)}</pre>
                        <p className="text-xs text-muted-foreground mt-2">{exercise.explanation}</p>
                      </div>
                    )}
                  </div>
                );})}
              </div>
            </Card>
          )}

          {contentTab === "checklist" && tabsUnlocked && (
            <Card>
              <h3 className="font-bold text-foreground mb-3">Checklist do Módulo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {module.checklist.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-2 text-sm text-foreground bg-input-background border border-border rounded-xl p-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${index < 2 ? "bg-emerald-500" : "bg-card border border-border"}`}>
                      {index < 2 && <Check className="w-3 h-3 text-white" />}
                    </div>
                    {item.label}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {contentTab === "projeto" && tabsUnlocked && (
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-foreground">Projeto: {module.projectBrief?.title ?? module.sprintLab?.title ?? module.goalLabel}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{module.projectBrief?.description ?? module.sprintLab?.company ?? "Resolva o desafio usando o conteúdo deste módulo."}</p>
                </div>
                <Badge color={projectPass ? "success" : "primary"}>{completedProjectSteps}/{projectItems.length} passos</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                {projectItems.map((req, index) => {
                  const stepKey = `${module.id}-${index}`;
                  return (
                  <button
                    key={req}
                    onClick={() => setProjectSteps((prev) => ({ ...prev, [stepKey]: !prev[stepKey] }))}
                    className={`text-left text-xs border rounded-lg p-3 transition-colors ${projectSteps[stepKey] ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-200" : "text-foreground bg-input-background border-border hover:border-purple-500/40"}`}
                  >
                    <span className="font-bold">Passo {index + 1}.</span> {req}
                  </button>
                );})}
              </div>
              <div className="bg-input-background border border-border rounded-xl p-4">
                <p className="text-sm font-bold text-foreground mb-2">Simule sua solução</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Descreva a solução, decisões, arquivos que criaria e como testaria. Ao marcar os passos e explicar bem, o simulador valida a entrega.
                </p>
                <textarea
                  value={projectSolution}
                  onChange={(e) => {
                    setProjectSolution(e.target.value);
                    setProjectTested(false);
                  }}
                  className="w-full min-h-36 bg-card border border-border rounded-xl p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                  placeholder="Ex: criaria componentes, validaria entrada, escreveria teste para cenário vazio, separaria regra de negócio..."
                />
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button onClick={() => setProjectTested(true)} className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                    Testar entrega
                  </button>
                  {projectTested && <Badge color={projectPass ? "success" : "warning"}>{projectPass ? "Entrega aceita" : "Complete mais passos e detalhe melhor"}</Badge>}
                </div>
                {projectTested && (
                  <p className="text-xs text-muted-foreground mt-3">
                    {projectPass
                      ? "Boa: sua solução cobre execução e validação. Próximo passo: levar o mesmo raciocínio para o laboratório."
                      : "Ainda falta evidência de solução. Marque pelo menos dois passos e descreva o que o usuário vê, que regra muda e como você testaria."}
                  </p>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Lesson list */}
      <aside className="w-72 border-l border-border flex flex-col bg-sidebar flex-shrink-0">
        <div className="p-4 border-b border-border">
          <h3 className="font-bold text-foreground text-sm">Conteúdo da Trilha</h3>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(completedLessonsCount / module.lessons.length) * 100}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{completedLessonsCount} de {module.lessons.length} aulas concluídas</p>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border/50">
          {module.lessons.map((l, i) => {
            const locked = !canOpenLesson(i);
            const done = isLessonComplete(i);
            return (
            <button
              key={l.id}
              disabled={locked}
              onClick={() => {
                if (!locked) setSelected(i);
              }}
              className={`w-full text-left p-4 flex items-start gap-3 transition-colors ${i === currentIndex ? "bg-purple-600/10" : locked ? "opacity-50 cursor-not-allowed" : "hover:bg-input-background"}`}
            >
              <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-emerald-500" : i === currentIndex ? "bg-purple-600" : "bg-input-background border border-border"}`}>
                {done ? <Check className="w-3 h-3 text-white" /> : locked ? <Lock className="w-3 h-3 text-muted-foreground" /> : <Play className="w-3 h-3 text-muted-foreground" />}
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-semibold truncate ${i === currentIndex ? "text-purple-300" : done ? "text-muted-foreground line-through" : "text-foreground"}`}>{l.heading}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{locked ? "conclua a anterior" : l.diagramId ? "com diagrama" : "aula narrativa"}</p>
              </div>
            </button>
          );})}
        </div>
      </aside>
    </div>
  );
}

// PROGRESSO
function ProgressoPage() {
  const weekData = [
    { day: "Seg", target: 2, real: 2.5 }, { day: "Ter", target: 2, real: 1.8 }, { day: "Qua", target: 2, real: 3.2 },
    { day: "Qui", target: 2, real: 2.1 }, { day: "Sex", target: 2, real: 4.0 }, { day: "Sáb", target: 1, real: 1.5 }, { day: "Dom", target: 1, real: 0.8 },
  ];
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalGames = modules.reduce((sum, m) => sum + m.games.length, 0);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Módulos Totais", value: String(modules.length), sub: `${phases.length} fases guiadas`, icon: Clock, color: "text-purple-400" },
          { label: "Aulas", value: String(totalLessons), sub: "conteúdo narrativo", icon: Zap, color: "text-amber-400" },
          { label: "Exercícios", value: String(totalExerciseCount()), sub: "treino guiado", icon: PlayCircle, color: "text-cyan-400" },
          { label: "Arcades", value: String(totalGames), sub: "jogos e desafios", icon: Award, color: "text-emerald-400" },
        ].map((s) => (
          <Card key={s.label}>
            <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
            <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            <p className="text-xs text-purple-400 mt-1">{s.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <h3 className="font-bold text-foreground mb-4">Horas vs. Meta</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.1)" />
              <XAxis dataKey="day" tick={{ fill: "#7b72a8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#7b72a8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#16132b", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "12px", color: "#f0eeff", fontSize: 12 }} />
              <Line type="monotone" dataKey="target" stroke="rgba(124,58,237,0.3)" strokeDasharray="4 2" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="real" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-bold text-foreground mb-4">Por Competência</h3>
          <div className="space-y-4">
            {skillTree.map((c, index) => (
              <div key={c.title}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-foreground font-medium">{c.title}</span>
                  <span className="text-muted-foreground">{c.mastery}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${c.mastery}%`, background: ["#7c3aed", "#06b6d4", "#f59e0b", "#10b981"][index % 4] }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="font-bold text-foreground mb-4">Conquistas Recentes</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {achievementCatalog.slice(0, 4).map((a, index) => (
            <div key={a.title} className={`flex flex-col items-center p-4 rounded-xl border ${index < 2 ? "border-purple-500/40 bg-purple-500/10" : "border-border bg-muted/50 opacity-50"}`}>
              <span className="text-2xl mb-2">{a.points}</span>
              <p className="text-xs font-semibold text-center text-foreground">{a.title}</p>
              <p className="text-xs text-center text-muted-foreground mt-1">{a.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function HistoriaPage({ module, setPage }: { module: Module; setPage: (p: Page) => void }) {
  const stories = module.storyLessons ?? [];
  const debugCases = module.debugCases ?? [];
  const scenarios = module.scenarios ?? [];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <Badge color="accent">Story learning</Badge>
        <h2 className="text-2xl font-extrabold text-foreground mt-3">{module.emoji} {module.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">Aprenda o conteúdo como decisões reais de projeto, problemas de trabalho e investigação de bugs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {stories.slice(0, 6).map((story) => (
          <Card key={story.id} hover>
            <h3 className="font-bold text-foreground mb-2">{story.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{story.mission}</p>
            <div className="bg-input-background border border-border rounded-xl p-3 mb-3">
              <p className="text-xs text-purple-300 font-semibold mb-1">Tensão</p>
              <p className="text-sm text-foreground">{story.tension}</p>
            </div>
            <p className="text-xs text-muted-foreground">{story.takeaway}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {debugCases.slice(0, 3).map((bug) => (
          <Card key={bug.id}>
            <Badge color="warning">Debug arena</Badge>
            <h3 className="font-bold text-foreground mt-3 mb-2">{bug.title}</h3>
            <p className="text-xs text-muted-foreground mb-2">{bug.context}</p>
            <pre className="text-xs bg-black/30 border border-border rounded-xl p-3 overflow-x-auto text-purple-100">{bug.log}</pre>
            <p className="text-xs text-emerald-300 mt-3">{bug.fix}</p>
          </Card>
        ))}
      </div>

      {scenarios.length > 0 && (
        <Card>
          <h3 className="font-bold text-foreground mb-4">Cenários do Dia a Dia</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {scenarios.slice(0, 4).map((scenario) => (
              <button key={scenario.id} onClick={() => setPage("aulas")} className="text-left bg-input-background border border-border rounded-xl p-4 hover:border-purple-500/40 transition-colors">
                <p className="text-sm font-bold text-foreground">{scenario.emoji} {scenario.title}</p>
                <p className="text-xs text-muted-foreground mt-2">{scenario.situation}</p>
                <p className="text-xs text-purple-300 mt-2">{scenario.howToSolve}</p>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function LaboratorioPage({ module, onReward }: { module: Module; onReward: (amount: number) => void }) {
  const lab = module.sprintLab;
  const campaigns = projectCampaigns;

  const starterTemplate = `// Laboratório: ${module.title}
function resolverDesafio() {
  // escreva sua solução usando o que aprendeu no módulo
  return "solução pronta";
}

console.log(resolverDesafio());`;

  const [labCode, setLabCode] = useState(starterTemplate);
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  const [validatedSprints, setValidatedSprints] = useState<Record<string, boolean>>({});
  const [rewardedRuns, setRewardedRuns] = useState<Record<string, boolean>>({});
  const [consoleLines, setConsoleLines] = useState<{ type: "log" | "error" | "result"; text: string }[]>([]);
  const [testChecks, setTestChecks] = useState<{ label: string; pass: boolean }[] | null>(null);
  const [running, setRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const activeCampaign = campaigns.find((c) => c.id === activeCampaignId) ?? null;

  const campaignTemplate = (campaign: (typeof projectCampaigns)[number]) => `// Roteiro de laboratório: ${campaign.title}
// Empresa: ${campaign.company}
// Objetivo: transformar cada sprint em uma solução testável.

const plano = [
${campaign.sprints.map((sprint, index) => `  {
    sprint: "${index + 1}. ${sprint.title}",
    fazer: "${sprint.goal}",
    testar: "Simule a entrega: ${sprint.output}"
  }`).join(",\n")}
];

function executarSprint(indice) {
  const sprint = plano[indice];
  if (!sprint) return "Sprint não encontrada";
  return \`Fazendo: \${sprint.fazer} | Teste: \${sprint.testar}\`;
}

console.log(executarSprint(0));`;

  function runLabCode() {
    setRunning(true);
    const logs: { type: "log" | "error" | "result"; text: string }[] = [];
    const fakeConsole = {
      log: (...args: unknown[]) => logs.push({ type: "log", text: args.map(stringifyArg).join(" ") }),
      error: (...args: unknown[]) => logs.push({ type: "error", text: args.map(stringifyArg).join(" ") }),
      warn: (...args: unknown[]) => logs.push({ type: "log", text: "⚠ " + args.map(stringifyArg).join(" ") }),
    };

    let threw = false;
    let hasFunction = /function\s+\w+\s*\(|=>\s*{|=>\s*[^{]/i.test(labCode);
    try {
      // eslint-disable-next-line no-new-func
      const sandboxed = new Function("console", `"use strict";\n${labCode}`);
      sandboxed(fakeConsole);
    } catch (err) {
      threw = true;
      logs.push({ type: "error", text: err instanceof Error ? `${err.name}: ${err.message}` : String(err) });
    }
    setConsoleLines(logs);
    setRunning(false);

    const producedOutput = logs.some((l) => l.type === "log");
    const checks: { label: string; pass: boolean }[] = [
      { label: "O código roda sem lançar exceção", pass: !threw },
      { label: "Existe pelo menos uma função ou arrow function", pass: hasFunction },
      { label: "O código produz alguma saída (console.log)", pass: producedOutput },
    ];

    if (activeCampaign) {
      const sprintOutputsOk = activeCampaign.sprints.every((sprint) =>
        logs.some((l) => l.text.toLowerCase().includes(sprint.goal.toLowerCase().slice(0, 12)))
        || labCode.includes(sprint.goal) || labCode.toLowerCase().includes(sprint.title.toLowerCase())
      );
      checks.push({ label: `Roteiro menciona as sprints de "${activeCampaign.title}"`, pass: sprintOutputsOk });
    }

    setTestChecks(checks);
    const allPass = checks.every((c) => c.pass);

    if (allPass && activeCampaign) {
      setValidatedSprints((prev) => ({ ...prev, [activeCampaign.id]: true }));
      if (!rewardedRuns[activeCampaign.id]) {
        onReward(80);
        setRewardedRuns((prev) => ({ ...prev, [activeCampaign.id]: true }));
      }
    } else if (allPass && !rewardedRuns["free"]) {
      onReward(30);
      setRewardedRuns((prev) => ({ ...prev, free: true }));
    }
  }

  function stringifyArg(arg: unknown) {
    if (typeof arg === "string") return arg;
    try { return JSON.stringify(arg); } catch { return String(arg); }
  }

  function loadCampaign(campaign: (typeof projectCampaigns)[number]) {
    setActiveCampaignId(campaign.id);
    setLabCode(campaignTemplate(campaign));
    setConsoleLines([]);
    setTestChecks(null);
    setShowHint(false);
  }

  function resetEditor() {
    setLabCode(starterTemplate);
    setActiveCampaignId(null);
    setConsoleLines([]);
    setTestChecks(null);
    setShowHint(false);
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(labCode);
      setConsoleLines((prev) => [...prev, { type: "result", text: "Código copiado para a área de transferência." }]);
    } catch {
      setConsoleLines((prev) => [...prev, { type: "error", text: "Não foi possível copiar automaticamente. Selecione o texto manualmente." }]);
    }
  }

  const passedCount = testChecks?.filter((c) => c.pass).length ?? 0;
  const totalChecks = testChecks?.length ?? 0;
  const allGreen = testChecks !== null && passedCount === totalChecks;

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <Badge color="success">Laboratório do módulo</Badge>
          <h2 className="text-2xl font-extrabold text-foreground mt-3">{lab?.title ?? module.goalLabel}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lab ? `${lab.company} · papel: ${lab.role}` : module.intro}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
            {(lab?.sprints ?? []).map((sprint) => (
              <div key={sprint.title} className="bg-input-background border border-border rounded-xl p-4">
                <p className="text-sm font-bold text-foreground">{sprint.title}</p>
                <p className="text-xs text-muted-foreground mt-2">{sprint.objective}</p>
                <p className="text-xs text-purple-300 mt-2">Entrega: {sprint.deliverable}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-bold text-foreground mb-3">Briefing do Projeto</h3>
          <p className="text-sm text-muted-foreground">{module.projectBrief?.description ?? "Escolha uma campanha abaixo para praticar entrega profissional."}</p>
          <div className="mt-4 space-y-2">
            {(module.projectBrief?.requirements ?? module.checklist.map((c) => c.label)).slice(0, 5).map((item) => (
              <div key={item} className="text-xs text-foreground bg-purple-500/10 border border-purple-500/20 rounded-lg p-2">{item}</div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <Badge color="accent">Área de testes</Badge>
            <h3 className="font-bold text-foreground mt-3">
              {activeCampaign ? `Roteiro ativo: ${activeCampaign.title}` : "Teste o que aprendeu neste módulo"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Escreva ou edite código JavaScript real, rode-o no console simulado e valide sua solução com testes automáticos.
            </p>
          </div>
          {testChecks && (
            <Badge color={allGreen ? "success" : "warning"}>
              {passedCount}/{totalChecks} testes passaram
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1.5">Editor</p>
            <textarea
              value={labCode}
              onChange={(e) => {
                setLabCode(e.target.value);
                setTestChecks(null);
              }}
              spellCheck={false}
              className="w-full min-h-64 bg-black/40 border border-purple-500/20 rounded-xl p-4 text-xs text-purple-100 font-mono focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button onClick={runLabCode} disabled={running} className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-60">
                {running ? "Rodando..." : "▶ Rodar código"}
              </button>
              <button onClick={resetEditor} className="text-xs font-bold text-muted-foreground hover:text-foreground px-3 py-2 rounded-xl border border-border transition-colors">
                Resetar
              </button>
              <button onClick={copyCode} className="text-xs font-bold text-muted-foreground hover:text-foreground px-3 py-2 rounded-xl border border-border transition-colors">
                Copiar código
              </button>
              <button onClick={() => setShowHint((v) => !v)} className="text-xs font-bold text-amber-300 hover:text-amber-200 px-3 py-2 rounded-xl border border-amber-500/30 transition-colors">
                {showHint ? "Esconder dica" : "Ver dica"}
              </button>
            </div>
            {showHint && (
              <div className="mt-3 text-xs text-amber-200 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                Sua solução precisa de: uma função nomeada ou arrow function, pelo menos um <code>console.log</code> de saída,
                {activeCampaign ? ` e deve executar/mencionar as sprints do roteiro "${activeCampaign.title}" (ex.: chame executarSprint para cada índice).` : " sem lançar erros ao rodar."}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1.5">Console</p>
            <div className="w-full min-h-64 max-h-64 overflow-y-auto bg-black/60 border border-border rounded-xl p-4 font-mono text-xs space-y-1">
              {consoleLines.length === 0 && !testChecks && (
                <p className="text-muted-foreground/60">Rode o código para ver a saída aqui...</p>
              )}
              {consoleLines.map((line, i) => (
                <p key={i} className={line.type === "error" ? "text-red-400" : line.type === "result" ? "text-cyan-300" : "text-emerald-300"}>
                  {line.type === "error" ? "✗ " : "› "}{line.text}
                </p>
              ))}
            </div>
            {testChecks && (
              <div className="mt-3 space-y-1.5">
                {testChecks.map((check) => (
                  <div key={check.label} className={`flex items-center gap-2 text-xs rounded-lg px-3 py-2 border ${check.pass ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-amber-500/30 bg-amber-500/10 text-amber-200"}`}>
                    {check.pass ? <Check className="w-3.5 h-3.5 flex-shrink-0" /> : <X className="w-3.5 h-3.5 flex-shrink-0" />}
                    {check.label}
                  </div>
                ))}
                {allGreen && (
                  <p className="text-xs text-emerald-300 font-semibold mt-2">
                    ✓ Solução validada{activeCampaign ? ` para "${activeCampaign.title}"` : ""}! +{activeCampaign ? 80 : 30} moedas creditadas.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {campaigns.map((campaign) => {
          const validated = Boolean(validatedSprints[campaign.id]);
          const active = activeCampaignId === campaign.id;
          return (
            <Card key={campaign.id} hover className={active ? "!border-purple-500/60 ring-1 ring-purple-500/40" : ""} onClick={() => loadCampaign(campaign)}>
              <div className="flex items-center justify-between">
                <Badge color="primary">{campaign.difficulty}</Badge>
                <span className="text-xs text-muted-foreground">{campaign.duration}</span>
              </div>
              <h3 className="font-bold text-foreground mt-3 flex items-center gap-2">
                {campaign.title}
                {validated && <Badge color="success">validado</Badge>}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{campaign.company}</p>
              <p className="text-xs text-emerald-300 mt-3">{campaign.reward}</p>
              <div className="mt-4 space-y-2">
                {campaign.sprints.slice(0, 3).map((sprint) => (
                  <div key={sprint.title} className="text-xs bg-input-background border border-border rounded-lg p-2">
                    <p><span className="font-semibold text-foreground">{sprint.title}:</span> <span className="text-muted-foreground">{sprint.goal}</span></p>
                    <p className="text-purple-300 mt-1">Teste no lab: {sprint.output}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); loadCampaign(campaign); }}
                className="mt-4 text-xs font-bold text-purple-300 hover:text-purple-200 transition-colors"
              >
                Carregar roteiro no editor
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ArcadePage({ setActiveModule, setPage, onReward }: { setActiveModule: (m: Module) => void; setPage: (p: Page) => void; onReward: (amount: number) => void }) {
  const games = modules.flatMap((m) => m.games.map((game) => ({ ...game, module: m })));
  const [selectedGameKey, setSelectedGameKey] = useState<string | null>(null);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [rewardedKey, setRewardedKey] = useState<string | null>(null);
  const selectedGame = games.find((game) => `${game.module.id}-${game.gameId}` === selectedGameKey);

  function openGame(key: string) {
    setLastScore(null);
    setSelectedGameKey(key);
  }

  function handleComplete(score: number) {
    setLastScore(score);
    if (selectedGameKey && rewardedKey !== selectedGameKey) {
      const amount = Math.max(10, Math.round(score));
      onReward(amount);
      setRewardedKey(selectedGameKey);
    }
  }

  if (selectedGame) {
    const game = gameRegistry[selectedGame.gameId];
    return (
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <button onClick={() => setSelectedGameKey(null)} className="text-xs font-bold text-purple-400 hover:text-purple-300 mb-3 flex items-center gap-1">
              <ChevronRight className="w-3 h-3 rotate-180" /> Voltar para Arcade
            </button>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge color="warning">{selectedGame.module.title}</Badge>
              <LanguageTag gameId={selectedGame.gameId} />
            </div>
            <h2 className="text-2xl font-extrabold text-foreground mt-3">{selectedGame.label}</h2>
            <p className="text-sm text-muted-foreground mt-1">{selectedGame.description}</p>
          </div>
          {lastScore !== null && (
            <div className="flex items-center gap-2">
              <Badge color="success">Última pontuação: {lastScore}%</Badge>
              {rewardedKey === selectedGameKey && (
                <Badge color="warning"><Coins className="w-3 h-3 inline mr-1" />+{Math.max(10, Math.round(lastScore))}</Badge>
              )}
            </div>
          )}
        </div>
        <Card className="overflow-hidden">
          {game ? (
            <div className="rounded-xl bg-base-950/60 border border-border p-4">
              {game.render((score) => handleComplete(score))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Este jogo ainda não tem componente registrado.</div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Badge color="warning">Arcade</Badge>
          <h2 className="text-2xl font-extrabold text-foreground mt-3">Jogos e desafios de programação</h2>
        </div>
        <Badge color="accent">{games.length} desafios</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {games.map((game) => {
          const key = `${game.module.id}-${game.gameId}`;
          return (
          <Card key={key} hover className="relative" onClick={() => openGame(key)}>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 flex-shrink-0">
                <img src={badgeForKey(key)} alt="" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-foreground">{game.label}</h3>
                </div>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <LanguageTag gameId={game.gameId} />
                  <span className="text-xs text-muted-foreground">{game.module.title}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 line-clamp-3">{game.description}</p>
            <div className="mt-4 flex items-center gap-3">
              <button onClick={(e) => { e.stopPropagation(); openGame(key); }} className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1">
                Jogar <ChevronRight className="w-3 h-3" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); setActiveModule(game.module); setPage("aulas"); }} className="text-xs font-bold text-muted-foreground hover:text-foreground">
                Ver módulo
              </button>
            </div>
          </Card>
          );
        })}
      </div>
    </div>
  );
}

function CarreiraPage({ setPage, setActiveModule }: { setPage: (p: Page) => void; setActiveModule: (m: Module) => void }) {
  const unlockTargets = careerLadder.map((rank, index) => {
    const moduleTarget =
      rank.level < 5 ? modules[0] :
      rank.level < 18 ? modules[Math.min(index, modules.length - 1)] :
      rank.level < 28 ? modules.find((m) => m.track === "backend") ?? modules[5] :
      rank.level < 40 ? modules.find((m) => m.track === "fullstack") ?? modules[8] :
      modules.find((m) => m.track === "devops") ?? modules[12];
    const pageTarget: Page =
      rank.unlock.toLowerCase().includes("arcade") ? "arcade" :
      rank.unlock.toLowerCase().includes("revis") ? "revisao" :
      rank.unlock.toLowerCase().includes("laboratorio") || rank.unlock.toLowerCase().includes("campanhas") ? "laboratorio" :
      "aulas";
    return {
      rank,
      moduleTarget,
      pageTarget,
      details: pageTarget === "arcade"
        ? "Libera jogos práticos conectados aos módulos já estudados."
        : pageTarget === "revisao"
          ? "Libera revisões ativas para reforçar pontos fracos."
          : pageTarget === "laboratorio"
            ? "Libera tarefas de empresa, entregas e simulação no laboratório."
            : `Libera conteúdo guiado em ${moduleTarget.title}.`,
    };
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <Card>
        <Badge color="accent">Carreira</Badge>
        <h2 className="text-2xl font-extrabold text-foreground mt-3">Escada de evolução profissional</h2>
        <p className="text-sm text-muted-foreground mt-1">Do aprendiz ao staff, cada nível mostra responsabilidade, desbloqueio e expectativa técnica.</p>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {unlockTargets.map(({ rank, moduleTarget, pageTarget, details }) => (
          <button
            key={rank.title}
            onClick={() => {
              setActiveModule(moduleTarget);
              setPage(pageTarget);
            }}
            className="text-left bg-card border border-border rounded-2xl p-5 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-900/20 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <Badge color={rank.level >= 40 ? "warning" : "primary"}>Nível {rank.level}</Badge>
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-bold text-foreground">{rank.title}</h3>
            <p className="text-xs text-muted-foreground mt-2">{rank.responsibility}</p>
            <div className="mt-3 rounded-xl bg-input-background border border-border p-3">
              <p className="text-xs font-semibold text-purple-300">Desbloqueia: {rank.unlock}</p>
              <p className="text-xs text-muted-foreground mt-1">{details}</p>
            </div>
            <p className="text-xs text-emerald-300 mt-3">Abrir desbloqueio</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function RevisaoPage({ setPage, setActiveModule }: { setPage: (p: Page) => void; setActiveModule: (m: Module) => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const generatedReviews = modules.slice(0, 12).map((moduleItem) => ({
    id: `generated-${moduleItem.id}`,
    topic: moduleItem.title,
    prompt: moduleItem.exercises[0]?.prompt ?? moduleItem.goalLabel,
    answer: moduleItem.exercises[0] ? exerciseAnswerText(moduleItem.exercises[0]) : moduleItem.goalLabel,
    due: `Mês ${moduleItem.month}`,
    strength: Math.max(35, 82 - moduleItem.month * 2),
    module: moduleItem,
  }));
  const activeReviews = [
    ...reviewQueue.map((item, index) => ({
      ...item,
      module: modules[index % modules.length],
    })),
    ...generatedReviews,
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-2xl font-extrabold text-foreground">Fila de Revisão Ativa</h2>
            <Badge color="accent">{activeReviews.length} revisões</Badge>
          </div>
          <div className="space-y-3">
            {activeReviews.map((item) => {
              const answer = answers[item.id] ?? "";
              const isChecked = checked[item.id];
              const correct = answer.trim().length > 0 && item.answer.toLowerCase().includes(answer.trim().toLowerCase());
              return (
              <div key={item.id} className="bg-input-background border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge color="primary">{item.topic}</Badge>
                  <span className="text-xs text-muted-foreground">{item.due}</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{item.prompt}</p>
                <textarea
                  value={answer}
                  onChange={(e) => {
                    setAnswers((prev) => ({ ...prev, [item.id]: e.target.value }));
                    setChecked((prev) => ({ ...prev, [item.id]: false }));
                  }}
                  placeholder="Responda antes de ver a resposta..."
                  className="mt-3 w-full min-h-20 bg-card border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                />
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button onClick={() => setChecked((prev) => ({ ...prev, [item.id]: true }))} className="text-xs font-bold text-purple-300 hover:text-purple-200 transition-colors">
                    Corrigir revisão
                  </button>
                  {isChecked && <Badge color={correct ? "success" : "warning"}>{correct ? "acertou" : "precisa estudar"}</Badge>}
                  {isChecked && !correct && (
                    <button
                      onClick={() => {
                        setActiveModule(item.module);
                        setPage("aulas");
                      }}
                      className="text-xs font-bold text-emerald-300 hover:text-emerald-200 transition-colors"
                    >
                      Voltar ao conteúdo
                    </button>
                  )}
                </div>
                {isChecked && (
                  <div className="mt-3 rounded-xl bg-card border border-border p-3">
                    <p className="text-xs font-semibold text-foreground mb-1">Resposta de referência</p>
                    <p className="text-xs text-muted-foreground">{item.answer}</p>
                  </div>
                )}
                <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${item.strength}%` }} />
                </div>
              </div>
            );})}
          </div>
        </Card>
        <Card>
          <h3 className="font-bold text-foreground mb-3">Biblioteca</h3>
          <div className="space-y-3">
            {library.map((book) => (
              <div key={book.title} className="border-l-2 border-purple-500 pl-3">
                <p className="text-sm font-semibold text-foreground">{book.title}</p>
                <p className="text-xs text-muted-foreground">{book.author}</p>
                <p className="text-xs text-purple-300">{book.theme}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function LojaPage({
  coins,
  ownedCharacters,
  equippedCharacterId,
  onBuyCharacter,
  onEquipCharacter,
}: {
  coins: number;
  ownedCharacters: string[];
  equippedCharacterId: string;
  onBuyCharacter: (characterId: string, localPrice: number) => Promise<{ error?: { message: string } }>;
  onEquipCharacter: (characterId: string) => Promise<{ error?: { message: string } }>;
}) {
  const [toast, setToast] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast((current) => (current === message ? null : current)), 2200);
  }

  // Checagem client-side é só pra feedback instantâneo — quem decide de
  // verdade (preço, saldo, posse) é a função no servidor (buy_character).
  async function buyCharacter(character: CharacterDef) {
    if (ownedCharacters.includes(character.id) || pendingId) return;
    if (coins < character.price) {
      flash(`Moedas insuficientes para ${character.name}. Faltam ${character.price - coins} moedas.`);
      return;
    }
    setPendingId(character.id);
    const { error } = await onBuyCharacter(character.id, character.price);
    setPendingId(null);
    flash(error ? error.message : `${character.name} comprado e equipado!`);
  }

  async function equipCharacter(character: CharacterDef) {
    if (pendingId) return;
    setPendingId(character.id);
    const { error } = await onEquipCharacter(character.id);
    setPendingId(null);
    flash(error ? error.message : `${character.name} equipado no seu perfil.`);
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Badge color="warning">Loja</Badge>
          <h2 className="text-2xl font-extrabold text-foreground mt-3">Personagens, temas e boosts</h2>
          <p className="text-sm text-muted-foreground mt-1">Compre personagens para o seu perfil e itens para personalizar sua jornada.</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold px-4 py-2 rounded-xl">
          <Coins className="w-4 h-4" />{coins.toLocaleString("pt-BR")} moedas
        </div>
      </div>

      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-card border border-purple-500/40 shadow-xl shadow-purple-900/30 rounded-xl px-4 py-3 text-sm text-foreground animate-in fade-in slide-in-from-top-2">
          {toast}
        </div>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground">Personagens</h3>
            <p className="text-xs text-muted-foreground mt-1">Use moedas ganhas na trilha, jogos e laboratório para desbloquear novos personagens de perfil.</p>
          </div>
          <Badge color="accent">{ownedCharacters.length}/{CHARACTERS.length} desbloqueados</Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
          {CHARACTERS.map((character) => {
            const owned = ownedCharacters.includes(character.id);
            const equipped = equippedCharacterId === character.id;
            return (
              <Card
                key={character.id}
                hover
                className={`!p-3 text-center ${equipped ? "!border-purple-500/60 ring-1 ring-purple-500/40" : ""}`}
                onClick={() => (owned ? equipCharacter(character) : buyCharacter(character))}
              >
                <div className="relative w-full aspect-square flex items-center justify-center">
                  <img src={character.src} alt={character.name} className="w-full h-full object-contain" />
                  {equipped && (
                    <span className="absolute top-0 right-0 bg-purple-600 text-white rounded-full p-1">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                  {!owned && (
                    <span className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
                      <Lock className="w-5 h-5 text-white/80" />
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-foreground mt-2 truncate">{character.name}</p>
                <Badge color={character.rarity === "Lendario" ? "warning" : character.rarity === "Epico" ? "accent" : character.rarity === "Raro" ? "success" : "primary"}>
                  {character.rarity}
                </Badge>
                <p className="text-xs mt-1.5 font-semibold">
                  {equipped ? (
                    <span className="text-purple-300">Equipado</span>
                  ) : owned ? (
                    <span className="text-emerald-300">Equipar</span>
                  ) : character.price === 0 ? (
                    <span className="text-emerald-300">Grátis</span>
                  ) : (
                    <span className="text-amber-300">{character.price} moedas</span>
                  )}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h3 className="font-bold text-foreground">Temas, wallpapers e boosts</h3>
          <p className="text-xs text-muted-foreground mt-1">Itens de personalização e vantagens temporárias para acelerar seu progresso.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {marketplace.map((item) => (
            <Card key={item.id} hover>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 flex-shrink-0">
                  <img src={badgeForKey(item.id)} alt="" className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <Badge color={item.rarity === "Lendario" ? "warning" : item.rarity === "Epico" ? "accent" : "primary"}>{item.rarity}</Badge>
                    <span className="text-xs text-emerald-300 whitespace-nowrap">{item.price} moedas</span>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-foreground">{item.title}</h3>
              <p className="text-xs text-purple-300 mt-1">{item.type}</p>
              <p className="text-xs text-muted-foreground mt-3">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

// APP SHELL
function AppShell() {
  const [page, setPage] = useState<Page>("dashboard");
  const [activeModule, setActiveModule] = useState<Module>(modules[0]);
  const [completedMissions, setCompletedMissions] = useState<Record<string, boolean>>({});
  const { profile, claimReward, buyCharacter, equipCharacter, markLessonComplete, saveModuleProgress } = useProfile();

  const titles: Record<Page, string> = {
    dashboard: "Começar",
    cursos: "Trilha",
    aulas: "Aulas",
    historia: "História",
    laboratorio: "Laboratório",
    arcade: "Arcade",
    carreira: "Carreira",
    revisao: "Revisão",
    progresso: "Analytics",
    loja: "Loja",
  };

  return (
    <div className="h-screen flex overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar page={page} setPage={setPage} equippedCharacterId={profile.equippedCharacterId} displayName={profile.displayName} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title={titles[page]} setPage={setPage} coins={profile.coins} />
        {page === "dashboard" && (
          <DashboardPage
            setPage={setPage}
            activeModule={activeModule}
            setActiveModule={setActiveModule}
            completedMissions={completedMissions}
            completeMission={(id) => setCompletedMissions((prev) => ({ ...prev, [id]: true }))}
          />
        )}
        {page === "cursos" && <CursosPage setPage={setPage} activeModule={activeModule} setActiveModule={setActiveModule} />}
        {page === "aulas" && (
          <AulasPage
            module={activeModule}
            setPage={setPage}
            completedLessons={profile.completedLessons}
            onCompleteLesson={markLessonComplete}
            progress={profile.lessonProgress[activeModule.id] as ModuleProgress | undefined}
            onSaveProgress={saveModuleProgress}
          />
        )}
        {page === "historia" && <HistoriaPage module={activeModule} setPage={setPage} />}
        {page === "laboratorio" && (
          <LaboratorioPage module={activeModule} onReward={(amount) => { void claimReward(amount, "laboratorio"); }} />
        )}
        {page === "arcade" && <ArcadePage setActiveModule={setActiveModule} setPage={setPage} onReward={(amount) => { void claimReward(amount, "arcade"); }} />}
        {page === "carreira" && <CarreiraPage setPage={setPage} setActiveModule={setActiveModule} />}
        {page === "revisao" && <RevisaoPage setPage={setPage} setActiveModule={setActiveModule} />}
        {page === "progresso" && <ProgressoPage />}
        {page === "loja" && (
          <LojaPage
            coins={profile.coins}
            ownedCharacters={profile.ownedCharacters}
            equippedCharacterId={profile.equippedCharacterId}
            onBuyCharacter={buyCharacter}
            onEquipCharacter={equipCharacter}
          />
        )}
      </div>
    </div>
  );
}

// App de uso pessoal: sem login/conta, sempre entra direto no app.
export default function App() {
  return <AppShell />;
}
