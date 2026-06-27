import { useEffect, useState } from 'react';
import type { XpGainEvent } from '../../hooks/useProgress';

interface XpToastProps {
  event: XpGainEvent | null;
}

export function XpToast({ event }: XpToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!event) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(t);
  }, [event]);

  if (!event || !visible) return null;

  return (
    <div
      key={event.key}
      className="fixed left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-amber-400/30 bg-base-850 px-4 py-2 shadow-2xl shadow-black/40 animate-rise-in"
      style={{ bottom: 'calc(var(--bottomnav-h, 0px) + 1.25rem)' }}
    >
      <span className="font-display text-sm font-bold text-amber-400">+{event.amount} XP</span>
      <span className="text-xs text-base-300">{event.reason}</span>
    </div>
  );
}
