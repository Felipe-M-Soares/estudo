interface StreakMapProps {
  activeDates: string[];
  streakDays: number;
}

function buildWeeks(activeDates: string[]): { date: string; active: boolean }[][] {
  const activeSet = new Set(activeDates);
  const today = new Date();
  const days: { date: string; active: boolean }[] = [];

  // 119 dias atrás até hoje (~17 semanas), alinhado terminando hoje
  for (let i = 118; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    days.push({ date: iso, active: activeSet.has(iso) });
  }

  const weeks: { date: string; active: boolean }[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

export function StreakMap({ activeDates, streakDays }: StreakMapProps) {
  const weeks = buildWeeks(activeDates);

  return (
    <div className="rounded-2xl border border-base-700 bg-base-850 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-display text-sm font-semibold text-base-50">Constância</span>
        <span className="flex items-center gap-1.5 rounded-full bg-mint-900/40 px-2.5 py-1 text-xs font-semibold text-mint-300">
          🔥 {streakDays} {streakDays === 1 ? 'dia' : 'dias'}
        </span>
      </div>
      <div className="flex gap-[3px] overflow-x-auto pb-1 scrollbar-none">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day) => (
              <div
                key={day.date}
                title={day.date}
                className={`h-[11px] w-[11px] rounded-[3px] ${
                  day.active
                    ? 'bg-mint-400'
                    : 'bg-base-700'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-base-400">Cada quadrado é um dia em que você estudou.</p>
    </div>
  );
}
