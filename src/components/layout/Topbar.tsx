import { useEffect, useRef, useState } from 'react';
import { Bell, Menu, Palette, Search, Zap } from 'lucide-react';
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
    <header ref={headerRef} className="pro-topbar">
      <div className="pro-topbar-inner">
        <button onClick={onMenuClick} className="pro-icon-button lg:hidden" aria-label="Abrir menu"><Menu size={20} /></button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-sm font-black text-base-50 sm:text-base">Central de Missões</span>
            <span className="rounded-full bg-mint-400/12 px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-[0.14em] text-mint-300 ring-1 ring-mint-400/20">online</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 max-w-72 flex-1 overflow-hidden rounded-full bg-base-700"><div className="h-full rounded-full bg-gradient-to-r from-mint-400 to-cyan-300" style={{ width: `${overallPercent}%` }} /></div>
            <span className="font-mono text-[10px] text-base-400">{overallPercent}%</span>
          </div>
        </div>

        <button onClick={() => setSearchOpen(true)} className="pro-search-button" aria-label="Buscar"><Search size={16} /><span className="hidden sm:inline">Buscar</span><kbd className="hidden rounded-md bg-base-800 px-1.5 py-0.5 font-mono text-[10px] text-base-400 md:inline">⌘K</kbd></button>

        <div className="hidden items-center gap-1 rounded-2xl border border-base-700 bg-base-900/70 p-1.5 md:flex" title="Tema visual">
          <Palette size={14} className="mx-1 text-base-400" />
          {(Object.keys(themes) as DesignThemeId[]).map((id) => (
            <button key={id} type="button" onClick={() => setTheme(id)} className={`h-6 w-6 rounded-full theme-dot bg-gradient-to-br ${themes[id].preview} ${theme === id ? 'ring-2 ring-base-50/80' : 'opacity-70 hover:opacity-100'}`} aria-label={`Usar tema ${themes[id].name}`} />
          ))}
        </div>

        <span className="pro-hud-pill"><Zap size={14} /> {progress.streakDays}</span>
        <button className="pro-icon-button hidden sm:grid" aria-label="Notificações"><Bell size={17} /></button>
        <XpBar xp={progress.xp} compact />
      </div>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
