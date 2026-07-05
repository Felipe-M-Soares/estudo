import {
  Binary,
  Bug,
  CastleTurret,
  CloudArrowUp,
  Code,
  Cube,
  Database,
  FlowArrow,
  Flask,
  GameController,
  GitBranch,
  GridFour,
  Hammer,
  Keyhole,
  LockKey,
  MagnifyingGlass,
  PenNib,
  PuzzlePiece,
  Radio,
  Scroll,
  ShieldWarning,
  Signpost,
  Sparkle,
  Sword,
  Terminal,
  Timer,
  Translate,
} from '@phosphor-icons/react';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';

interface GameIconProps {
  gameId: string;
  className?: string;
}

type IconType = PhosphorIcon;

// Mapeamento exato por jogo (34 jogos conhecidos do arcade), usando icones
// "duotone" do Phosphor (pacote de icones profissional ja incluso no
// projeto) - bem mais ricos visualmente que icones de linha simples, com
// duas cores e mais peso visual. Cada jogo tem um icone proprio e coerente
// com o tema, sem repetir o mesmo icone para jogos diferentes.
const exactIconMap: Record<string, IconType> = {
  'architecture-builder': Hammer,
  'architecture-review-board': Scroll,
  'aws-service-matcher': CloudArrowUp,
  'bug-hunter': Bug,
  'cicd-pipeline-builder': FlowArrow,
  'code-review-simulator': MagnifyingGlass,
  'css-selector-hunt': PenNib,
  'docker-compose-builder': Cube,
  'flexbox-dojo': GridFour,
  'fullstack-wiring': FlowArrow,
  'git-branch-simulator': GitBranch,
  'go-concurrency': Radio,
  'graphql-query-shaper': Database,
  'http-status-match': Signpost,
  'java-stream-builder': Code,
  'js-console-detective': Terminal,
  'k8s-resource-builder': CastleTurret,
  'logic-maze': PuzzlePiece,
  'memory-concepts': Binary,
  'microservices-architect': FlowArrow,
  'middleware-pipeline': FlowArrow,
  'nosql-command': Database,
  'python-detective': MagnifyingGlass,
  'react-state-lab': Flask,
  'rendering-strategy-picker': Sparkle,
  'solid-principles-sorter': Binary,
  'sort-visualizer': Binary,
  'sql-query-builder': Database,
  'system-design-whiteboard': PenNib,
  'tech-english-flashcards': Translate,
  'terminal-simulator': Terminal,
  'tic-tac-toe-build': GridFour,
  'typescript-type-detective': MagnifyingGlass,
  'vulnerability-hunter': ShieldWarning,
};

// Fallback por categoria para qualquer gameId futuro que nao esteja no mapa
// exato acima.
const categoryFallback: { test: RegExp; icon: IconType }[] = [
  { test: /security|vulnerab|injection/i, icon: ShieldWarning },
  { test: /terminal|console|command/i, icon: Terminal },
  { test: /sort|binary|algorithm/i, icon: Binary },
  { test: /memory|cache/i, icon: Binary },
  { test: /sql|mongo|redis|database|query/i, icon: Database },
  { test: /docker|container/i, icon: Cube },
  { test: /kubernetes|k8s/i, icon: CastleTurret },
  { test: /architecture|system-design/i, icon: PenNib },
  { test: /flex|layout|css|grid/i, icon: GridFour },
  { test: /concurrency|channel/i, icon: Radio },
  { test: /git|branch/i, icon: GitBranch },
  { test: /lock|auth|jwt/i, icon: LockKey },
  { test: /maze|puzzle/i, icon: PuzzlePiece },
  { test: /route|path/i, icon: Signpost },
  { test: /timer|speed|challenge/i, icon: Timer },
  { test: /code|python|java|react/i, icon: Code },
  { test: /fight|battle|duel/i, icon: Sword },
  { test: /key|keyboard/i, icon: Keyhole },
  { test: /detective|debug|bug/i, icon: Bug },
];

export function GameIcon({ gameId, className = '' }: GameIconProps) {
  const Icon = exactIconMap[gameId] ?? categoryFallback.find((item) => item.test.test(gameId))?.icon ?? GameController;
  return (
    <span className={`game-icon ${className}`} aria-hidden="true">
      <Icon size={26} weight="duotone" />
    </span>
  );
}
