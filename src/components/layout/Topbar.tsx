import { useEffect, useRef, useState } from 'react';
import { Menu, Search, Palette, Zap, ShieldCheck } from 'lucide-react';
import { XpBar } from '../ui/XpBar';
import { SearchModal } from '../ui/SearchModal';
import type { UserProgress } from '../../data/types';
import { useDesignTheme, type DesignThemeId } from '../../hooks/useDesignTheme';

interface TopbarProps {
  progress: UserProgress;
  overallPercent: number;
  onMenuClick: () => void;
}

export function Topbar({ progress, overallPercent, onMenuClick }: TopbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, setTheme, themes } = useDesignTheme();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!headerRef.current) return;
    const el = headerRef.current;
    const update = () => document.documentElement.style.setProperty('--topbar-h', `${el.offsetHeight}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-20 px-2 pt-2 sm:px-4 lg:px-0 lg:pt-4">
      <div className="game-frame mx-auto flex max-w-7xl items-center justify-between rounded-3xl px-3 py-2.5 backdrop-blur-2xl sm:px-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button onClick={onMenuClick} className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-base-900 text-base-200 ring-1 ring-base-700 hover:bg-base-800 lg:hidden" aria-label="Abrir menu">
            <Menu size={20} />
          </button>
          <div className="hidden h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-mint-400 to-cyan-400 text-base-950 shadow-[0_0_30px_-14px_var(--color-cyan-400)] sm:grid">
            <ShieldCheck size={21} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate font-display text-sm font-black text-base-50 sm:text-base">Central da Missão</span>
              <span className="hidden rounded-full bg-mint-400/12 px-2 py-0.5 font-mono text-[10px] font-bold text-mint-300 ring-1 ring-mint-400/20 sm:inline">ONLINE</span>
            </div>
            <div className="mt-1 hidden items-center gap-2 sm:flex">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-base-500">Jornada</span>
              <div className="h-1.5 w-32 overflow-hidden rounded-full bg-base-700">
                <div className="h-full rounded-full bg-gradient-to-r from-mint-500 to-cyan-300 transition-all duration-700" style={{ width: `${overallPercent}%` }} />
              </div>
              <span className="mono-num text-[11px] text-base-300">{overallPercent}%</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <button onClick={() => setSearchOpen(true)} className="hidden h-11 items-center gap-2 rounded-2xl border border-base-700 bg-base-900/70 px-3 text-xs font-semibold text-base-300 transition-colors hover:border-cyan-400/40 hover:text-base-100 xs:flex" aria-label="Buscar">
            <Search size={15} /> Buscar <kbd className="rounded-md bg-base-800 px-1.5 py-0.5 font-mono text-[10px] text-base-400">⌘K</kbd>
          </button>
          <button onClick={() => setSearchOpen(true)} className="grid h-11 w-11 place-items-center rounded-2xl border border-base-700 bg-base-900/70 text-base-300 xs:hidden" aria-label="Buscar">
            <Search size={18} />
          </button>
          <div className="hidden items-center gap-1 rounded-2xl border border-base-700 bg-base-900/70 px-2 py-1.5 md:flex" title="Tema visual">
            <Palette size={14} className="text-base-400" />
            {(Object.keys(themes) as DesignThemeId[]).map((id) => (
              <button key={id} type="button" onClick={() => setTheme(id)} className={`h-6 w-6 rounded-full theme-dot bg-gradient-to-br ${themes[id].preview} ${theme === id ? 'ring-2 ring-base-50/80' : 'opacity-70 hover:opacity-100'}`} aria-label={`Usar tema ${themes[id].name}`} />
            ))}
          </div>
          <span className="flex h-11 items-center gap-1.5 rounded-2xl bg-amber-500/12 px-3 text-xs font-black text-amber-300 ring-1 ring-amber-400/18">
            <Zap size={14} /> {progress.streakDays}
          </span>
          <XpBar xp={progress.xp} compact />
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 pb-2 pt-2 sm:hidden">
        <span className="font-mono text-[10px] text-base-500">jornada</span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-base-700"><div className="h-full rounded-full bg-gradient-to-r from-mint-500 to-cyan-300" style={{ width: `${overallPercent}%` }} /></div>
        <span className="mono-num text-[10px] text-base-400">{overallPercent}%</span>
      </div>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
