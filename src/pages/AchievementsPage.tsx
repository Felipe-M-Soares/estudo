import { achievements } from '../data/achievements';
import type { UserProgress } from '../data/types';

interface AchievementsPageProps {
  progress: UserProgress;
}

export function AchievementsPage({ progress }: AchievementsPageProps) {
  const unlockedCount = progress.unlockedAchievements.length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <div className="mb-6 animate-rise-in">
        <p className="font-mono text-xs uppercase tracking-widest text-amber-400">Sua coleção</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-base-50">Conquistas</h1>
        <p className="mt-2 text-base-300">
          {unlockedCount} de {achievements.length} desbloqueadas. Continue estudando, praticando e jogando para destravar todas.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {achievements.map((a) => {
          const unlocked = progress.unlockedAchievements.includes(a.id);
          return (
            <div
              key={a.id}
              className={`flex items-center gap-3.5 rounded-2xl border p-4 transition-colors ${
                unlocked ? 'border-amber-400/40 bg-amber-500/10' : 'border-base-700 bg-base-850 opacity-60'
              }`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
                  unlocked ? 'bg-amber-400/15' : 'bg-base-800 grayscale'
                }`}
              >
                {a.emoji}
              </div>
              <div>
                <div className="font-display text-sm font-bold text-base-50">{a.title}</div>
                <div className="text-xs text-base-400">{a.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
