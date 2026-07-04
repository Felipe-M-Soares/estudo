import { Binary, Bug, Castle, Code2, Cpu, Database, Gamepad2, GitBranch, Keyboard, Layers3, LockKeyhole, Network, Puzzle, ShieldAlert, Swords, Timer, TerminalSquare, Zap } from 'lucide-react';
import type { ComponentType } from 'react';

interface GameIconProps {
  gameId: string;
  className?: string;
}

const iconMap: { test: RegExp; icon: ComponentType<{ size?: number; className?: string; strokeWidth?: number }> }[] = [
  { test: /bug|detective|debug/i, icon: Bug },
  { test: /security|vulner|sql|injection|hash/i, icon: ShieldAlert },
  { test: /terminal|console|command/i, icon: TerminalSquare },
  { test: /sort|binary|algorithm|logic/i, icon: Binary },
  { test: /memory|cache/i, icon: Cpu },
  { test: /sql|mongo|redis|data|query/i, icon: Database },
  { test: /architecture|builder|system|micro/i, icon: Castle },
  { test: /flex|layout|css|grid/i, icon: Layers3 },
  { test: /concurrency|go|channel/i, icon: Network },
  { test: /speed|challenge|timer/i, icon: Timer },
  { test: /git|branch/i, icon: GitBranch },
  { test: /lock|auth|jwt/i, icon: LockKeyhole },
  { test: /maze/i, icon: Puzzle },
  { test: /code|python|java|react/i, icon: Code2 },
  { test: /fight|battle|duel/i, icon: Swords },
  { test: /key|keyboard/i, icon: Keyboard },
];

export function GameIcon({ gameId, className = '' }: GameIconProps) {
  const Match = iconMap.find((item) => item.test.test(gameId));
  const Icon = Match?.icon ?? Gamepad2;
  return (
    <span className={`game-icon ${className}`} aria-hidden="true">
      <Icon size={20} strokeWidth={2.3} />
      <Zap size={10} className="absolute -right-0.5 -top-0.5 opacity-75" />
    </span>
  );
}
