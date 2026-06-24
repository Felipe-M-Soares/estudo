import { levelFromXp, levelTitle, xpIntoCurrentLevel, XP_PER_LEVEL } from '../../data/achievements';

interface XpBarProps {
  xp: number;
  compact?: boolean;
}

export function XpBar({ xp, compact = false }: XpBarProps) {
  const level = levelFromXp(xp);
  const into = xpIntoCurrentLevel(xp);
  const pct = Math.round((into / XP_PER_LEVEL) * 100);

  if (compact) {
    return (
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400/15 font-display text-[11px] font-bold text-amber-400 ring-1 ring-amber-400/30">
          {level}
        </div>
        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-base-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-base-700 bg-base-850 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/15 font-display text-lg font-bold text-amber-400 ring-1 ring-amber-400/30">
            {level}
          </div>
          <div>
            <div className="font-display text-sm font-semibold text-base-50">{levelTitle(level)}</div>
            <div className="mono-num text-xs text-base-300">{xp.toLocaleString('pt-BR')} XP total</div>
          </div>
        </div>
        <div className="mono-num text-xs text-base-400">{into}/{XP_PER_LEVEL}</div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-base-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
