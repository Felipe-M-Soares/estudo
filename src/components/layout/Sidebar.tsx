import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Home, Trophy, Gamepad2, Bot, Settings, X, LogOut, Briefcase, FlaskConical, GraduationCap, Crown, Shield, Map } from 'lucide-react';
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

const phaseColors: Record<number, { dot: string; text: string; bar: string; bg: string }> = {
  1: { dot: 'bg-mint-400', text: 'text-mint-300', bar: 'bg-mint-400', bg: 'from-mint-400/12' },
  2: { dot: 'bg-amber-400', text: 'text-amber-300', bar: 'bg-amber-400', bg: 'from-amber-400/12' },
  3: { dot: 'bg-violet-400', text: 'text-violet-300', bar: 'bg-violet-400', bg: 'from-violet-400/12' },
  4: { dot: 'bg-cyan-400', text: 'text-cyan-300', bar: 'bg-cyan-400', bg: 'from-cyan-400/12' },
};

export function Sidebar({ progress, open, onClose, profileName, profileEmoji, onLogout }: SidebarProps) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden" onClick={onClose} aria-hidden="true" />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-[88vw] max-w-[330px] flex-col border-r border-base-600/60 bg-base-950/92 shadow-[24px_0_90px_-48px_rgba(0,0,0,0.95)] backdrop-blur-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:w-[318px] lg:max-w-none lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="relative overflow-hidden border-b border-base-700/70 p-4">
          <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-mint-400/12 blur-2xl" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-mint-300 via-cyan-400 to-violet-400 text-base-950 shadow-[0_0_34px_-10px_var(--color-cyan-400)]">
                <Crown size={24} strokeWidth={2.7} />
              </div>
              <div>
                <div className="font-display text-lg font-black leading-none text-base-50">CodeQuest</div>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-mint-300"><Shield size={12} /> Pro Hub</div>
              </div>
            </div>
            <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl text-base-300 hover:bg-base-800 lg:hidden" aria-label="Fechar menu">
              <X size={20} />
            </button>
          </div>

          <div className="relative mt-4 rounded-2xl border border-base-700 bg-base-900/55 p-3">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-base-400">Status da conta</span>
              <span className="font-mono font-bold text-mint-300">LVL {Math.max(1, Math.floor(progress.xp / 500) + 1)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-base-700">
              <div className="h-full rounded-full bg-gradient-to-r from-mint-400 to-cyan-400" style={{ width: `${Math.min(100, (progress.xp % 500) / 5)}%` }} />
            </div>
          </div>
        </div>

        <nav className="grid gap-2 border-b border-base-700/70 p-3">
          <SidebarLink to="/" icon={<Home size={17} />} label="Command Center" onClick={onClose} />
          <SidebarLink to="/academia" icon={<GraduationCap size={17} />} label="Academia" onClick={onClose} highlight />
          <SidebarLink to="/jogos" icon={<Gamepad2 size={17} />} label="Arcade" onClick={onClose} highlight />
          <SidebarLink to="/laboratorio" icon={<FlaskConical size={17} />} label="Laboratório" onClick={onClose} />
          <SidebarLink to="/entrevista" icon={<Briefcase size={17} />} label="Arena Entrevista" onClick={onClose} />
          <SidebarLink to="/conquistas" icon={<Trophy size={17} />} label="Troféus" onClick={onClose} />
          <SidebarLink to="/mentor" icon={<Bot size={17} />} label="Mentor IA" onClick={onClose} />
          <SidebarLink to="/configuracoes" icon={<Settings size={17} />} label="Configurações" onClick={onClose} />
        </nav>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-3 flex items-center gap-2 px-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-base-400">
            <Map size={13} /> Mapa da jornada
          </div>
          <div className="space-y-3">
            {phases.map((phase) => {
              const style = phaseColors[phase.phase];
              const phaseModules = moduleMetas.filter((m) => m.phase === phase.phase);
              const pct = Math.round(phaseModules.reduce((acc, m) => acc + (progress.moduleProgress[m.id] ?? 0), 0) / phaseModules.length);
              return (
                <section key={phase.phase} className={`rounded-2xl border border-base-700 bg-gradient-to-br ${style.bg} to-base-900/50 p-2.5`}>
                  <div className="mb-2 flex items-center justify-between gap-2 px-1">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
                      <span className={`truncate text-[11px] font-bold uppercase tracking-wide ${style.text}`}>Fase {phase.phase} · {phase.title}</span>
                    </div>
                    <span className="font-mono text-[10px] text-base-400">{pct}%</span>
                  </div>
                  <div className="space-y-1">
                    {phaseModules.map((m) => {
                      const modulePct = progress.moduleProgress[m.id] ?? 0;
                      const isDone = modulePct >= 100;
                      return (
                        <NavLink
                          key={m.id}
                          to={`/modulo/${m.id}`}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `group grid grid-cols-[26px_1fr_auto] items-center gap-2 rounded-xl px-2 py-2 text-sm transition-all ${isActive ? 'nav-glow-active text-base-50' : 'text-base-300 hover:bg-base-800/70 hover:text-base-100'}`
                          }
                        >
                          <span className="grid h-6 w-6 place-items-center rounded-lg bg-base-950/60 text-sm ring-1 ring-base-700">{m.emoji}</span>
                          <span className="min-w-0">
                            <span className="block truncate text-[13px] font-medium">{m.title}</span>
                            <span className="mt-1 block h-1 overflow-hidden rounded-full bg-base-700">
                              <span className={`block h-full rounded-full ${style.bar}`} style={{ width: `${modulePct}%` }} />
                            </span>
                          </span>
                          <span className="font-mono text-[10px] text-base-500">{isDone ? 'OK' : `${modulePct}%`}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        <div className="border-t border-base-700/70 p-3">
          <div className="flex items-center gap-3 rounded-2xl border border-base-700 bg-base-900/60 p-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-base-800 text-lg">{profileEmoji}</span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-base-100" title={profileName}>{profileName}</div>
              <div className="text-[11px] text-base-500">Perfil ativo</div>
            </div>
            <button onClick={onLogout} className="grid h-10 w-10 place-items-center rounded-xl text-base-400 hover:bg-base-800 hover:text-base-100" aria-label="Trocar de perfil" title="Trocar de perfil">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ to, icon, label, onClick, highlight = false }: { to: string; icon: ReactNode; label: string; onClick: () => void; highlight?: boolean }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition-all ${isActive ? 'bg-base-800 text-base-50 ring-1 ring-mint-400/25 shadow-[0_0_28px_-20px_var(--color-mint-400)]' : highlight ? 'text-cyan-200 hover:bg-cyan-400/10' : 'text-base-300 hover:bg-base-800/80 hover:text-base-100'}`
      }
    >
      <span className={`grid h-9 w-9 place-items-center rounded-xl ${highlight ? 'bg-cyan-400/12 text-cyan-300' : 'bg-base-900 text-base-300'}`}>{icon}</span>
      <span>{label}</span>
      {highlight && <span className="ml-auto rounded-full bg-cyan-400/15 px-2 py-0.5 font-mono text-[10px] text-cyan-200">XP</span>}
    </NavLink>
  );
}
