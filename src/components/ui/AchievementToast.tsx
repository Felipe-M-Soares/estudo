import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { achievements } from '../../data/achievements';

interface AchievementToastProps {
  achievementId: string | null;
  onDismiss: () => void;
}

export function AchievementToast({ achievementId, onDismiss }: AchievementToastProps) {
  const achievement = achievementId ? achievements.find((a) => a.id === achievementId) : null;

  useEffect(() => {
    if (!achievement) return;
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3fe08a', '#f2a93b', '#9b75e0'],
    });
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [achievement]);

  if (!achievement) return null;

  return (
    <div className="fixed inset-x-4 top-6 z-50 mx-auto max-w-sm animate-rise-in sm:right-6 sm:left-auto">
      <div className="flex items-center gap-3 rounded-2xl border border-amber-400/40 bg-base-850 p-4 shadow-2xl shadow-black/50 glow-mint">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-2xl">
          {achievement.emoji}
        </div>
        <div className="flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-amber-400">Conquista desbloqueada</div>
          <div className="font-display text-sm font-bold text-base-50">{achievement.title}</div>
          <div className="text-xs text-base-300">{achievement.description}</div>
        </div>
        <button onClick={onDismiss} className="text-base-400 hover:text-base-100" aria-label="Fechar">
          ✕
        </button>
      </div>
    </div>
  );
}
