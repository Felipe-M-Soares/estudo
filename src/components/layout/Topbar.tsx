import { useEffect, useRef, useState } from 'react';
import { Menu, Search, Palette } from 'lucide-react';
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

  // Publica a altura real da topbar como variável CSS — outras telas (como o
  // chat do Mentor IA) usam isso para calcular sua própria altura disponível
  // sem precisar adivinhar um número fixo de pixels que quebra quando a topbar
  // muda de altura (ex: a barra extra de progresso que só aparece em mobile).
  useEffect(() => {
    if (!headerRef.current) return;
    const el = headerRef.current;
    const update = () => {
      document.documentElement.style.setProperty('--topbar-h', `${el.offsetHeight}px`);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-20 border-b border-base-700/70 bg-base-950/72 shadow-[0_1px_0_0_rgba(255,255,255,0.04),0_18px_50px_-45px_rgba(0,0,0,0.9)] backdrop-blur-xl"
    >
      <div className="flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onMenuClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base-300 hover:bg-base-800 lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="font-mono text-xs text-base-400">jornada</span>
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-base-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-mint-500 to-mint-300 transition-all duration-700"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
            <span className="mono-num text-xs text-base-300">{overallPercent}%</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-10 items-center gap-2 rounded-xl border border-base-700/80 bg-base-900/70 px-2.5 text-xs text-base-400 transition-colors hover:border-cyan-400/40 hover:text-base-200 sm:px-3"
            aria-label="Buscar"
          >
            <Search size={15} />
            <span className="hidden sm:inline">Buscar</span>
            <kbd className="hidden rounded bg-base-700 px-1.5 py-0.5 font-mono text-[10px] text-base-400 sm:inline">⌘K</kbd>
          </button>
          <div className="hidden items-center gap-1 rounded-xl border border-base-700/80 bg-base-900/70 px-2 py-1 sm:flex" title="Tema visual">
            <Palette size={14} className="text-base-400" />
            {(Object.keys(themes) as DesignThemeId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setTheme(id)}
                className={`h-5 w-5 rounded-full theme-dot bg-gradient-to-br ${themes[id].preview} ${theme === id ? 'ring-2 ring-base-50/80' : 'opacity-70 hover:opacity-100'}`}
                aria-label={`Usar tema ${themes[id].name}`}
              />
            ))}
          </div>
          <span className="flex h-10 items-center gap-1 rounded-full bg-mint-900/40 px-2.5 text-xs font-semibold text-mint-300 ring-1 ring-mint-400/15">
            🔥 {progress.streakDays}
          </span>
          <XpBar xp={progress.xp} compact />
        </div>
      </div>
      {/* Barra de progresso da jornada, visível só em telas pequenas — abaixo do
          breakpoint sm ela some da linha principal, então reaparece aqui fininha. */}
      <div className="flex items-center gap-2 px-3 pb-2 sm:hidden">
        <span className="font-mono text-[10px] text-base-500">jornada</span>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-base-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-mint-500 to-mint-300 transition-all duration-700"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
        <span className="mono-num text-[10px] text-base-400">{overallPercent}%</span>
      </div>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
