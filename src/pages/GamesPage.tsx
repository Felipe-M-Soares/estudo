import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { modules } from '../data';
import { gameRegistry } from '../components/games/registry';
import type { UserProgress } from '../data/types';

interface GamesPageProps {
  progress: UserProgress;
  onGameComplete: (gameId: string, score: number) => void;
}

export function GamesPage({ progress, onGameComplete }: GamesPageProps) {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  const allGames = modules.flatMap((m) => m.games.map((g) => ({ ...g, moduleTitle: m.title, moduleEmoji: m.emoji })));
  const uniqueGames = Array.from(new Map(allGames.map((g) => [g.gameId, g])).values());

  if (activeGameId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
        <button onClick={() => setActiveGameId(null)} className="mb-4 inline-flex items-center gap-1.5 text-sm text-base-400 hover:text-base-100">
          <ArrowLeft size={14} /> Todos os jogos
        </button>
        {gameRegistry[activeGameId]?.render((score) => onGameComplete(activeGameId, score))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <div className="mb-6 animate-rise-in">
        <p className="font-mono text-xs uppercase tracking-widest text-violet-400">Aprenda jogando</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-base-50">Mini-jogos</h1>
        <p className="mt-2 text-base-300">
          {uniqueGames.length} jogos espalhados pela sua jornada, um para cada tema que você estuda.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {uniqueGames.map((g) => {
          const best = progress.gamesScores[g.gameId];
          return (
            <button
              key={g.gameId}
              onClick={() => setActiveGameId(g.gameId)}
              className="flex flex-col gap-1.5 rounded-2xl border border-base-700 bg-base-850 p-4 text-left transition-colors hover:border-violet-400/40"
            >
              <span className="font-mono text-[11px] text-base-500">{g.moduleEmoji} {g.moduleTitle}</span>
              <span className="font-display text-sm font-bold text-base-50">{g.label}</span>
              <span className="text-xs text-base-400">{g.description}</span>
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
