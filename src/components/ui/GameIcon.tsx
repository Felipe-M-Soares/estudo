import {
  Binary,
  Bug,
  Castle,
  Cloud,
  Code2,
  Container,
  Cpu,
  Database,
  FlaskConical,
  GitBranch,
  Gamepad2,
  Grid3x3,
  Hammer,
  Keyboard,
  Languages,
  Layers3,
  LockKeyhole,
  Network,
  PenTool,
  Puzzle,
  Radio,
  Route,
  ScrollText,
  Search,
  ShieldAlert,
  Sparkles,
  Swords,
  TerminalSquare,
  Timer,
  Workflow,
} from 'lucide-react';
import type { ComponentType } from 'react';

interface GameIconProps {
  gameId: string;
  className?: string;
}

type IconType = ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;

// Mapeamento exato por jogo (34 jogos conhecidos do arcade). Isso evita as
// colisoes que a versao anterior tinha por regex generico - por exemplo,
// 8 jogos diferentes (arquitetura, docker, k8s, cicd, microservicos) todos
// caiam no mesmo icone de castelo, e jogos de SQL mostravam um icone de
// escudo de seguranca por engano (a regex de "seguranca" continha "sql"
// como substring). Cada jogo agora tem um icone proprio e coerente com o
// tema. Novos jogos que nao estiverem aqui caem no fallback por categoria.
const exactIconMap: Record<string, IconType> = {
  'architecture-builder': Hammer,
  'architecture-review-board': ScrollText,
  'aws-service-matcher': Cloud,
  'bug-hunter': Bug,
  'cicd-pipeline-builder': Workflow,
  'code-review-simulator': Search,
  'css-selector-hunt': PenTool,
  'docker-compose-builder': Container,
  'flexbox-dojo': Layers3,
  'fullstack-wiring': Network,
  'git-branch-simulator': GitBranch,
  'go-concurrency': Radio,
  'graphql-query-shaper': Database,
  'http-status-match': Grid3x3,
  'java-stream-builder': Code2,
  'js-console-detective': TerminalSquare,
  'k8s-resource-builder': Castle,
  'logic-maze': Puzzle,
  'memory-concepts': Cpu,
  'microservices-architect': Network,
  'middleware-pipeline': Workflow,
  'nosql-command': Database,
  'python-detective': Search,
  'react-state-lab': FlaskConical,
  'rendering-strategy-picker': Sparkles,
  'solid-principles-sorter': Binary,
  'sort-visualizer': Binary,
  'sql-query-builder': Database,
  'system-design-whiteboard': PenTool,
  'tech-english-flashcards': Languages,
  'terminal-simulator': TerminalSquare,
  'tic-tac-toe-build': Grid3x3,
  'typescript-type-detective': Search,
  'vulnerability-hunter': ShieldAlert,
};

// Fallback por categoria para qualquer gameId futuro que nao esteja no mapa
// exato acima - mais restrito que antes, para reduzir falsos positivos.
const categoryFallback: { test: RegExp; icon: IconType }[] = [
  { test: /security|vulnerab|injection/i, icon: ShieldAlert },
  { test: /terminal|console|command/i, icon: TerminalSquare },
  { test: /sort|binary|algorithm/i, icon: Binary },
  { test: /memory|cache/i, icon: Cpu },
  { test: /sql|mongo|redis|database|query/i, icon: Database },
  { test: /docker|container/i, icon: Container },
  { test: /kubernetes|k8s/i, icon: Castle },
  { test: /architecture|system-design/i, icon: PenTool },
  { test: /flex|layout|css|grid/i, icon: Layers3 },
  { test: /concurrency|channel/i, icon: Radio },
  { test: /git|branch/i, icon: GitBranch },
  { test: /lock|auth|jwt/i, icon: LockKeyhole },
  { test: /maze|puzzle/i, icon: Puzzle },
  { test: /route|path/i, icon: Route },
  { test: /timer|speed|challenge/i, icon: Timer },
  { test: /code|python|java|react/i, icon: Code2 },
  { test: /fight|battle|duel/i, icon: Swords },
  { test: /key|keyboard/i, icon: Keyboard },
  { test: /detective|debug|bug/i, icon: Bug },
];

export function GameIcon({ gameId, className = '' }: GameIconProps) {
  const Icon = exactIconMap[gameId] ?? categoryFallback.find((item) => item.test.test(gameId))?.icon ?? Gamepad2;
  return (
    <span className={`game-icon ${className}`} aria-hidden="true">
      <Icon size={22} strokeWidth={2.2} />
    </span>
  );
}
