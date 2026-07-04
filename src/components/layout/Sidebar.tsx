import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Home, Trophy, Gamepad2, Bot, Settings, X, Compass, LogOut, Briefcase, FlaskConical, GraduationCap, Crown } from 'lucide-react';
import { moduleMetas, phases } from '../../data/moduleMeta';
import type { UserProgress } from '../../data/types';

interface SidebarProps {
  progress: UserProgress;
  open: boolean;
  onClose: () => void;
  profileName: string;
  profileEmoji: string;
  onLogout: () => void;
}

const phaseColorClasses: Record<number, { dot: string; text: string; bar: string; line: string }> = {
  1: { dot: 'bg-mint-400', text: 'text-mint-400', bar: 'bg-mint-400', line: 'from-mint-400/60' },
  2: { dot: 'bg-amber-400', text: 'text-amber-400', bar: 'bg-amber-400', line: 'from-amber-400/60' },
  3: { dot: 'bg-violet-400', text: 'text-violet-400', bar: 'bg-violet-400', line: 'from-violet-400/60' },
  4: { dot: 'bg-cyan-400', text: 'text-cyan-400', bar: 'bg-cyan-400', line: 'from-cyan-400/60' },
};

export function Sidebar({ progress, open, onClose, profileName, profileEmoji, onLogout }: SidebarProps) {
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
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-[86vw] max-w-[300px] flex-col border-r border-base-700/70 bg-base-950/88 shadow-[14px_0_60px_-38px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-transform duration-300 lg:sticky lg:top-0 lg:w-[280px] lg:max-w-none lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-base-700/70 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-mint-300 via-cyan-400 to-violet-400 font-display text-sm font-bold text-base-950 shadow-[0_0_28px_-8px_theme(colors.cyan.400)]">
              <Crown size={17} strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-display text-sm font-bold leading-tight text-base-50">CodeQuest</div>
              <div className="text-[11px] leading-tight text-base-400">RPG de Estudos · Full Stack</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-base-300 hover:bg-base-800 lg:hidden"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 border-b border-base-700/70 px-3 py-3">
          <SidebarLink to="/" icon={<Home size={16} />} label="Painel" onClick={onClose} />
          <SidebarLink to="/academia" icon={<GraduationCap size={16} />} label="Academia Ideal" onClick={onClose} highlight />
          <SidebarLink to="/conquistas" icon={<Trophy size={16} />} label="Conquistas" onClick={onClose} />
          <SidebarLink to="/jogos" icon={<Gamepad2 size={16} />} label="Mini-jogos" onClick={onClose} />
          <SidebarLink to="/entrevista" icon={<Briefcase size={16} />} label="Modo Entrevista" onClick={onClose} highlight />
          <SidebarLink to="/laboratorio" icon={<FlaskConical size={16} />} label="Laboratório Prático" onClick={onClose} highlight />
          <SidebarLink to="/mentor" icon={<Bot size={16} />} label="Mentor IA" onClick={onClose} />
          <SidebarLink to="/configuracoes" icon={<Settings size={16} />} label="Configurações" onClick={onClose} />
        </nav>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          <div className="mb-2.5 flex items-center gap-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-base-400">
            <Compass size={12} />
            Jornada
          </div>
          {phases.map((phase) => (
            <div key={phase.phase} className="mb-5">
              <div className="mb-2 flex items-center gap-2 px-2">
                <span className={`h-1.5 w-1.5 rounded-full ${phaseColorClasses[phase.phase].dot}`} />
                <span className={`text-[11px] font-semibold uppercase tracking-wide ${phaseColorClasses[phase.phase].text}`}>
                  Fase {phase.phase} · {phase.title}
                </span>
              </div>
              {/* Trilho de circuito: conecta visualmente os módulos da fase, com nós preenchidos por progresso */}
              <div className="relative space-y-0.5 pl-1">
                <div
                  className={`absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b ${phaseColorClasses[phase.phase].line} to-transparent opacity-50`}
                  aria-hidden="true"
                />
                {moduleMetas
                  .filter((m) => m.phase === phase.phase)
                  .map((m) => {
                    const pct = progress.moduleProgress[m.id] ?? 0;
                    const isCurrent = progress.currentModuleId === m.id;
                    const isDone = pct >= 100;
                    return (
                      <NavLink
                        key={m.id}
                        to={`/modulo/${m.id}`}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `group relative flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-sm transition-colors ${
                            isActive
                              ? 'nav-glow-active text-base-50'
                              : 'text-base-300 hover:bg-base-800/60 hover:text-base-100'
                          }`
                        }
                      >
                        <span
                          className={`relative z-10 flex h-3 w-3 shrink-0 items-center justify-center rounded-full ring-2 ring-base-900 ${
                            isDone ? phaseColorClasses[phase.phase].bar : isCurrent ? `${phaseColorClasses[phase.phase].bar} animate-pulse-soft` : 'bg-base-600'
                          }`}
                        />
                        <span className="w-5 shrink-0 font-mono text-[10px] text-base-500">
                          {String(m.month).padStart(2, '0')}
                        </span>
                        <span className="flex-1 truncate" title={m.title}>{m.emoji} {m.title}</span>
                        {isDone ? (
                          <span className="text-xs text-mint-400">✓</span>
                        ) : pct > 0 ? (
                          <span className="mono-num text-[10px] text-base-400">{pct}%</span>
                        ) : null}
                      </NavLink>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2.5 border-t border-base-700/70 bg-base-950/55 px-4 py-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-base-700 to-base-800 text-base">{profileEmoji}</span>
          <span className="flex-1 truncate text-sm font-medium text-base-200" title={profileName}>{profileName}</span>
          <button
            onClick={onLogout}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base-400 hover:bg-base-800 hover:text-base-100"
            aria-label="Trocar de perfil"
            title="Trocar de perfil"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({
  to,
  icon,
  label,
  onClick,
  highlight = false,
}: {
  to: string;
  icon: ReactNode;
  label: string;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? highlight
              ? 'nav-glow-active text-cyan-200'
              : 'nav-glow-active text-mint-200'
            : highlight
              ? 'text-cyan-300/90 hover:bg-cyan-400/10 hover:text-cyan-200'
              : 'text-base-300 hover:bg-base-800 hover:text-base-100'
        }`
      }
    >
      {icon}
      {label}
      {highlight && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_theme(colors.cyan.400)]" />}
    </NavLink>
  );
}
