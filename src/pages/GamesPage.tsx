import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { modules } from '../data';
import { gameRegistry } from '../components/games/registry';
import type { UserProgress } from '../data/types';
import { GameIcon } from '../components/ui/GameIcon';

interface GamesPageProps {
  progress: UserProgress;
  onGameComplete: (gameId: string, score: number) => void;
}

const phaseFilters = [
  { id: 'all', label: 'Todos', dot: 'bg-base-400' },
  { id: 1, label: 'Fase 1', dot: 'bg-mint-400' },
  { id: 2, label: 'Fase 2', dot: 'bg-amber-400' },
  { id: 3, label: 'Fase 3', dot: 'bg-violet-400' },
  { id: 4, label: 'Fase 4', dot: 'bg-cyan-400' },
] as const;

export function GamesPage({ progress, onGameComplete }: GamesPageProps) {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 1 | 2 | 3 | 4>('all');

  const allGames = modules.flatMap((m) =>
    m.games.map((g) => ({ ...g, moduleTitle: m.title, moduleEmoji: m.emoji, phase: m.phase }))
  );
  const uniqueGames = Array.from(new Map(allGames.map((g) => [g.gameId, g])).values());
  const filteredGames = useMemo(
    () => (filter === 'all' ? uniqueGames : uniqueGames.filter((g) => g.phase === filter)),
    [filter, uniqueGames]
  );

  if (activeGameId) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8 lg:px-8">
        <button onClick={() => setActiveGameId(null)} className="mb-4 inline-flex items-center gap-1.5 text-sm text-base-400 hover:text-base-100">
          <ArrowLeft size={14} /> Todos os jogos
        </button>
        {gameRegistry[activeGameId]?.render((score) => onGameComplete(activeGameId, score))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8 lg:px-8">
      <div className="mb-6 animate-rise-in">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-400">⟢ Aprenda jogando</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-base-50">Arcade de Treino</h1>
        <p className="mt-2 text-base-300">
          {uniqueGames.length} jogos espalhados pela sua jornada, um para cada tema que você estuda.
        </p>
      </div>

      <div className="mb-5 flex gap-1.5 overflow-x-auto scrollbar-none fade-scroll-x">
        {phaseFilters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filter === f.id ? 'bg-violet-400 text-base-950' : 'bg-base-800 text-base-300 hover:bg-base-700'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${filter === f.id ? 'bg-base-950' : f.dot}`} />
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filteredGames.map((g) => {
          const best = progress.gamesScores[g.gameId];
          return (
            <button
              key={g.gameId}
              onClick={() => setActiveGameId(g.gameId)}
              className="quest-card group flex gap-4 p-4 text-left"
            >
              <GameIcon gameId={g.gameId} className="transition-transform group-hover:scale-105" />
              <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="font-mono text-[11px] text-base-500">{g.moduleEmoji} {g.moduleTitle}</span>
                <span className="font-display text-sm font-bold text-base-50">{g.label}</span>
                <span className="text-xs leading-relaxed text-base-400">{g.description}</span>
              </span>
              {best !== undefined && (
                <span className="mt-1 inline-flex items-center gap-1 self-start rounded-full bg-mint-900/40 px-2 py-0.5 text-[11px] font-semibold text-mint-300">
                  Melhor: {best}%
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
