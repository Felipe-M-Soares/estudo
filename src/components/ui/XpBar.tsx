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
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/20 to-amber-500/10 font-display text-[12px] font-bold text-amber-300 ring-1 ring-amber-400/30">
          {level}
        </div>
        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-base-700/80 ring-1 ring-black/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="card-surface relative overflow-hidden rounded-2xl p-4">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/25 to-amber-500/10 font-display text-lg font-bold text-amber-300 ring-1 ring-amber-400/40 shadow-[0_0_30px_-4px_theme(colors.amber.400)]">
            {level}
          </div>
          <div>
            <div className="font-display text-sm font-semibold text-base-50">{levelTitle(level)}</div>
            <div className="mono-num text-xs text-base-300">{xp.toLocaleString('pt-BR')} XP total</div>
          </div>
        </div>
        <div className="mono-num text-xs text-base-400">{into}/{XP_PER_LEVEL}</div>
      </div>
      <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-base-700/80 ring-1 ring-black/20">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
