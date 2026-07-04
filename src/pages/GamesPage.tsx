import { useMemo, useState } from 'react';
import { ArrowLeft, Gamepad2, Trophy, Zap, Target, Swords } from 'lucide-react';
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
  { id: 1, label: 'Mundo 1', dot: 'bg-mint-400' },
  { id: 2, label: 'Mundo 2', dot: 'bg-amber-400' },
  { id: 3, label: 'Mundo 3', dot: 'bg-violet-400' },
  { id: 4, label: 'Mundo 4', dot: 'bg-cyan-400' },
] as const;

export function GamesPage({ progress, onGameComplete }: GamesPageProps) {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 1 | 2 | 3 | 4>('all');

  const allGames = modules.flatMap((m) => m.games.map((g) => ({ ...g, moduleTitle: m.title, moduleEmoji: m.emoji, phase: m.phase })));
  const uniqueGames = Array.from(new Map(allGames.map((g) => [g.gameId, g])).values());
  const filteredGames = useMemo(() => (filter === 'all' ? uniqueGames : uniqueGames.filter((g) => g.phase === filter)), [filter, uniqueGames]);
  const played = uniqueGames.filter((g) => progress.gamesScores[g.gameId] !== undefined).length;
  const bestScore = Math.max(0, ...Object.values(progress.gamesScores));

  if (activeGameId) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8 lg:px-6">
        <button onClick={() => setActiveGameId(null)} className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-base-700 bg-base-900/60 px-3 py-2 text-sm font-bold text-base-400 hover:text-base-100">
          <ArrowLeft size={14} /> Voltar ao Arcade
        </button>
        <div className="game-frame rounded-[2rem] p-4 sm:p-6">
          {gameRegistry[activeGameId]?.render((score) => onGameComplete(activeGameId, score))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:py-8 lg:px-6">
      <section className="game-frame quest-map relative mb-5 overflow-hidden rounded-[2rem] p-5 sm:p-7">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-violet-400/16 blur-3xl" />
        <div className="relative grid gap-5 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-violet-300">Arcade de treino</p>
            <h1 className="mt-2 font-display text-4xl font-black leading-tight text-base-50 sm:text-6xl">Aprenda jogando, mas com foco profissional</h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-base-300">
              A tela foi reorganizada como uma arena: filtros claros, cards grandes, status visível e cada jogo associado ao módulo certo.
            </p>
          </div>
          <div className="inventory-grid lg:grid-cols-2">
            <ArcadeStat icon={<Gamepad2 size={17} />} label="Jogos" value={uniqueGames.length} />
            <ArcadeStat icon={<Trophy size={17} />} label="Jogados" value={played} />
            <ArcadeStat icon={<Zap size={17} />} label="Melhor" value={`${bestScore}%`} />
            <ArcadeStat icon={<Target size={17} />} label="Filtro" value={filter === 'all' ? 'Todos' : filter} />
          </div>
        </div>
      </section>

      <div className="mb-5 flex gap-2 overflow-x-auto scrollbar-none fade-scroll-x rounded-3xl border border-base-700 bg-base-950/45 p-2">
        {phaseFilters.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)} className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-black transition-all ${filter === f.id ? 'bg-violet-400 text-base-950' : 'bg-base-900 text-base-300 hover:bg-base-800'}`}>
            <span className={`h-2 w-2 rounded-full ${filter === f.id ? 'bg-base-950' : f.dot}`} />
            {f.label}
          </button>
        ))}
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredGames.map((g, index) => {
          const best = progress.gamesScores[g.gameId];
          return (
            <button key={g.gameId} onClick={() => setActiveGameId(g.gameId)} className="arcade-card group relative overflow-hidden p-5 text-left">
              <div className="absolute right-4 top-4 font-mono text-[3rem] font-black leading-none text-base-50/5">{String(index + 1).padStart(2, '0')}</div>
              <div className="relative flex items-start gap-4">
                <GameIcon gameId={g.gameId} className="h-14 w-14 transition-transform group-hover:scale-110 group-hover:rotate-3" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-base-950/60 px-2 py-1 font-mono text-[10px] text-base-400 ring-1 ring-base-700">{g.moduleEmoji} Mundo {g.phase}</span>
                    {best !== undefined && <span className="rounded-full bg-mint-400/12 px-2 py-1 font-mono text-[10px] font-black text-mint-300 ring-1 ring-mint-400/20">{best}%</span>}
                  </div>
                  <h2 className="mt-3 font-display text-lg font-black leading-tight text-base-50">{g.label}</h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-base-400">{g.description}</p>
                </div>
              </div>
              <div className="relative mt-5 flex items-center justify-between border-t border-base-700/70 pt-4">
                <span className="truncate text-xs font-semibold text-base-500">{g.moduleTitle}</span>
                <span className="mission-button px-3 py-1.5 text-xs"><Swords size={13} /> Jogar</span>
              </div>
            </button>
          );
        })}
      </section>
    </div>
  );
}

function ArcadeStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="hud-card p-3">
      <div className="flex items-center gap-2 text-base-400">{icon}<span className="text-xs font-semibold">{label}</span></div>
      <div className="mt-1 font-display text-2xl font-black text-base-50">{value}</div>
    </div>
  );
}
