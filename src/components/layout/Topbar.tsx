import { Menu } from 'lucide-react';
import { XpBar } from '../ui/XpBar';
import type { UserProgress } from '../../data/types';

interface TopbarProps {
  progress: UserProgress;
  overallPercent: number;
  onMenuClick: () => void;
}

export function Topbar({ progress, overallPercent, onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-base-700/80 bg-base-900/85 px-4 py-3 shadow-[0_1px_0_0_rgba(255,255,255,0.03)] backdrop-blur-md lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-1.5 text-base-300 hover:bg-base-800 lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </button>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="font-mono text-xs text-base-400">jornada</span>
          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-base-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-mint-500 to-mint-300 transition-all duration-700"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
          <span className="mono-num text-xs text-base-300">{overallPercent}%</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden items-center gap-1 rounded-full bg-mint-900/40 px-2.5 py-1 text-xs font-semibold text-mint-300 sm:flex">
          🔥 {progress.streakDays}
        </span>
        <XpBar xp={progress.xp} compact />
      </div>
    </header>
  );
}
