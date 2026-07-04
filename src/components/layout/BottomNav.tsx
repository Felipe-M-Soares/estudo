import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Gamepad2, Briefcase, GraduationCap, Menu } from 'lucide-react';

interface BottomNavProps {
  onMoreClick: () => void;
}

const ITEMS = [
  { to: '/', icon: Home, label: 'Painel' },
  { to: '/jogos', icon: Gamepad2, label: 'Jogos' },
  { to: '/entrevista', icon: Briefcase, label: 'Entrevista' },
  { to: '/academia', icon: GraduationCap, label: 'Academia' },
] as const;

/**
 * Barra de navegação fixa no rodapé, visível só em mobile/tablet (escondida a
 * partir de lg, onde a Sidebar já cobre a navegação). Cobre os 4 destinos mais
 * usados; o botão "Mais" abre a Sidebar completa para conquistas, ajustes e a
 * trilha completa de módulos.
 */
export function BottomNav({ onMoreClick }: BottomNavProps) {
  const navRef = useRef<HTMLElement>(null);

  // Publica a própria altura como variável CSS para telas que reservam espaço no
  // rodapé sem depender de um valor fixo em pixels.
  useEffect(() => {
    if (!navRef.current) return;
    const el = navRef.current;
    const update = () => {
      document.documentElement.style.setProperty('--bottomnav-h', `${el.offsetHeight}px`);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      observer.disconnect();
      document.documentElement.style.setProperty('--bottomnav-h', '0px');
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-base-700/70 bg-base-950/92 shadow-[0_-18px_55px_-42px_rgba(0,0,0,0.9)] backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Navegação principal"
    >
      {ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                isActive ? 'text-mint-200' : 'text-base-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                    isActive ? 'bg-gradient-to-br from-mint-400/25 to-cyan-400/15 ring-1 ring-mint-400/25' : ''
                  }`}
                >
                  <Icon size={19} strokeWidth={isActive ? 2.3 : 2} />
                </span>
                {item.label}
              </>
            )}
          </NavLink>
        );
      })}
      <button
        onClick={onMoreClick}
        className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium text-base-400 transition-colors active:text-base-100"
        aria-label="Abrir menu completo"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full">
          <Menu size={19} />
        </span>
        Mais
      </button>
    </nav>
  );
}
