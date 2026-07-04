import { NavLink, Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
  Briefcase,
  ChevronRight,
  Crown,
  FlaskConical,
  Gamepad2,
  GraduationCap,
  Home,
  LogOut,
  Map,
  Settings,
  Shield,
  Trophy,
  X,
} from 'lucide-react';
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

const phaseStyle: Record<number, { text: string; dot: string; fill: string }> = {
  1: { text: 'text-mint-300', dot: 'bg-mint-400', fill: 'bg-mint-400' },
  2: { text: 'text-amber-300', dot: 'bg-amber-400', fill: 'bg-amber-400' },
  3: { text: 'text-violet-300', dot: 'bg-violet-400', fill: 'bg-violet-400' },
  4: { text: 'text-cyan-300', dot: 'bg-cyan-400', fill: 'bg-cyan-400' },
};

export function Sidebar({ progress, open, onClose, profileName, profileEmoji, onLogout }: SidebarProps) {
  const level = Math.max(1, Math.floor(progress.xp / 500) + 1);
  const xpPct = Math.min(100, (progress.xp % 500) / 5);

  return (
    <>
      {open && <div className="pro-sidebar-backdrop" onClick={onClose} aria-hidden="true" />}
      <aside className={`pro-sidebar ${open ? 'is-open' : ''}`}>
        <div className="pro-sidebar-brand">
          <Link to="/" onClick={onClose} className="flex min-w-0 items-center gap-3">
            <span className="pro-logo"><Crown size={24} strokeWidth={2.8} /></span>
            <span className="min-w-0">
              <span className="block font-display text-lg font-black leading-none text-base-50">CodeQuest</span>
              <span className="mt-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-mint-300"><Shield size={11} /> Pro Academy</span>
            </span>
          </Link>
          <button onClick={onClose} className="pro-icon-button lg:hidden" aria-label="Fechar menu"><X size={18} /></button>
        </div>

        <div className="pro-player-card">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-base-800 text-xl ring-1 ring-base-600">{profileEmoji}</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-black text-base-50" title={profileName}>{profileName}</span>
              <span className="rounded-full bg-mint-400/12 px-2 py-0.5 font-mono text-[10px] font-black text-mint-300">LV {level}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-base-700"><div className="h-full rounded-full bg-gradient-to-r from-mint-400 to-cyan-400" style={{ width: `${xpPct}%` }} /></div>
          </div>
        </div>

        <nav className="pro-primary-nav" aria-label="Navegação principal">
          <SidebarLink to="/" icon={<Home size={18} />} label="Command" onClick={onClose} />
          <SidebarLink to="/academia" icon={<GraduationCap size={18} />} label="Academia" onClick={onClose} hot />
          <SidebarLink to="/jogos" icon={<Gamepad2 size={18} />} label="Arcade" onClick={onClose} hot />
          <SidebarLink to="/laboratorio" icon={<FlaskConical size={18} />} label="Labs" onClick={onClose} />
          <SidebarLink to="/entrevista" icon={<Briefcase size={18} />} label="Arena" onClick={onClose} />
          <SidebarLink to="/conquistas" icon={<Trophy size={18} />} label="Troféus" onClick={onClose} />
          <SidebarLink to="/configuracoes" icon={<Settings size={18} />} label="Ajustes" onClick={onClose} />
        </nav>

        <section className="pro-journey-panel" aria-label="Mapa de módulos">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-base-400"><Map size={13} /> Jornada</span>
            <span className="font-mono text-[10px] text-base-500">22 missões</span>
          </div>
          <div className="pro-journey-scroll">
            {phases.map((phase) => {
              const style = phaseStyle[phase.phase];
              const phaseModules = moduleMetas.filter((m) => m.phase === phase.phase);
              const pct = Math.round(phaseModules.reduce((acc, m) => acc + (progress.moduleProgress[m.id] ?? 0), 0) / phaseModules.length);
              return (
                <div key={phase.phase} className="pro-world-card">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className={`flex min-w-0 items-center gap-2 text-[11px] font-black uppercase tracking-[0.12em] ${style.text}`}>
                      <span className={`h-2 w-2 rounded-full ${style.dot}`} /> Mundo {phase.phase}
                    </span>
                    <span className="font-mono text-[10px] text-base-400">{pct}%</span>
                  </div>
                  <div className="grid gap-1.5">
                    {phaseModules.map((m) => {
                      const modulePct = progress.moduleProgress[m.id] ?? 0;
                      return (
                        <NavLink
                          key={m.id}
                          to={`/modulo/${m.id}`}
                          onClick={onClose}
                          className={({ isActive }) => `pro-module-link ${isActive ? 'is-active' : ''}`}
                        >
                          <span className="text-base">{m.emoji}</span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[12px] font-bold">{m.title}</span>
                            <span className="mt-1 block h-1 overflow-hidden rounded-full bg-base-700"><span className={`block h-full rounded-full ${style.fill}`} style={{ width: `${modulePct}%` }} /></span>
                          </span>
                          <ChevronRight size={13} className="text-base-500" />
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <button onClick={onLogout} className="pro-logout-button"><LogOut size={16} /> Trocar perfil</button>
      </aside>
    </>
  );
}

function SidebarLink({ to, icon, label, onClick, hot = false }: { to: string; icon: ReactNode; label: string; onClick: () => void; hot?: boolean }) {
  return (
    <NavLink to={to} onClick={onClick} className={({ isActive }) => `pro-nav-link ${isActive ? 'is-active' : ''} ${hot ? 'is-hot' : ''}`}>
      <span className="pro-nav-icon">{icon}</span>
      <span className="min-w-0 truncate">{label}</span>
      {hot && <span className="ml-auto rounded-full bg-cyan-400/12 px-2 py-0.5 font-mono text-[9px] font-black text-cyan-300">XP</span>}
    </NavLink>
  );
}
