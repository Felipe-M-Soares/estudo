import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Home, BookOpen, Trophy, Gamepad2, Bot, Settings, X } from 'lucide-react';
import { modules, phases } from '../../data';
import type { UserProgress } from '../../data/types';

interface SidebarProps {
  progress: UserProgress;
  open: boolean;
  onClose: () => void;
}

const phaseColorClasses: Record<number, { dot: string; text: string; bar: string }> = {
  1: { dot: 'bg-mint-400', text: 'text-mint-400', bar: 'bg-mint-400' },
  2: { dot: 'bg-amber-400', text: 'text-amber-400', bar: 'bg-amber-400' },
  3: { dot: 'bg-violet-400', text: 'text-violet-400', bar: 'bg-violet-400' },
};

export function Sidebar({ progress, open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-base-700 bg-base-900 transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-base-700 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint-400 font-display text-sm font-bold text-base-950">
              {'</>'}
            </div>
            <div>
              <div className="font-display text-sm font-bold leading-tight text-base-50">DevJourney</div>
              <div className="text-[11px] leading-tight text-base-400">Full Stack · 18 meses</div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-base-300 hover:bg-base-800 lg:hidden" aria-label="Fechar menu">
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 border-b border-base-700 px-3 py-3">
          <SidebarLink to="/" icon={<Home size={16} />} label="Painel" onClick={onClose} />
          <SidebarLink to="/conquistas" icon={<Trophy size={16} />} label="Conquistas" onClick={onClose} />
          <SidebarLink to="/jogos" icon={<Gamepad2 size={16} />} label="Mini-jogos" onClick={onClose} />
          <SidebarLink to="/mentor" icon={<Bot size={16} />} label="Mentor IA" onClick={onClose} />
          <SidebarLink to="/configuracoes" icon={<Settings size={16} />} label="Configurações" onClick={onClose} />
        </nav>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          <div className="mb-2 flex items-center gap-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-base-400">
            <BookOpen size={12} />
            Jornada
          </div>
          {phases.map((phase) => (
            <div key={phase.phase} className="mb-4">
              <div className="mb-1.5 flex items-center gap-2 px-2">
                <span className={`h-1.5 w-1.5 rounded-full ${phaseColorClasses[phase.phase].dot}`} />
                <span className={`text-[11px] font-semibold uppercase tracking-wide ${phaseColorClasses[phase.phase].text}`}>
                  Fase {phase.phase} · {phase.title}
                </span>
              </div>
              <div className="space-y-0.5">
                {modules
                  .filter((m) => m.phase === phase.phase)
                  .map((m) => {
                    const pct = progress.moduleProgress[m.id] ?? 0;
                    const isCurrent = progress.currentModuleId === m.id;
                    return (
                      <NavLink
                        key={m.id}
                        to={`/modulo/${m.id}`}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                            isActive
                              ? 'bg-base-800 text-base-50'
                              : 'text-base-300 hover:bg-base-800/60 hover:text-base-100'
                          }`
                        }
                      >
                        <span className="w-6 shrink-0 font-mono text-[10px] text-base-500">
                          {String(m.month).padStart(2, '0')}
                        </span>
                        <span className="flex-1 truncate">{m.emoji} {m.title}</span>
                        {pct >= 100 ? (
                          <span className="text-xs text-mint-400">✓</span>
                        ) : pct > 0 ? (
                          <span className="mono-num text-[10px] text-base-400">{pct}%</span>
                        ) : isCurrent ? (
                          <span className={`h-1.5 w-1.5 rounded-full ${phaseColorClasses[phase.phase].bar} animate-pulse-soft`} />
                        ) : null}
                      </NavLink>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ to, icon, label, onClick }: { to: string; icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
          isActive ? 'bg-mint-400/10 text-mint-300' : 'text-base-300 hover:bg-base-800 hover:text-base-100'
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
