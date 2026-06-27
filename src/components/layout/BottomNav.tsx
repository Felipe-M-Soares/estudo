import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Gamepad2, Briefcase, FlaskConical, Menu } from 'lucide-react';

interface BottomNavProps {
  onMoreClick: () => void;
}

const ITEMS = [
  { to: '/', icon: Home, label: 'Painel' },
  { to: '/jogos', icon: Gamepad2, label: 'Jogos' },
  { to: '/entrevista', icon: Briefcase, label: 'Entrevista' },
  { to: '/laboratorio', icon: FlaskConical, label: 'Lab' },
] as const;

/**
 * Barra de navegação fixa no rodapé, visível só em mobile/tablet (escondida a
 * partir de lg, onde a Sidebar já cobre a navegação). Cobre os 4 destinos mais
 * usados; o botão "Mais" abre a Sidebar completa para tudo o resto (Conquistas,
 * Mentor IA, Configurações, e a trilha completa de módulos).
 */
export function BottomNav({ onMoreClick }: BottomNavProps) {
  const navRef = useRef<HTMLElement>(null);

  // Publica a própria altura como variável CSS (mesmo mecanismo da Topbar) para
  // que outras telas com altura calculada (ex: chat do Mentor IA) saibam quanto
  // espaço reservar no rodapé sem depender de um valor fixo em pixels.
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
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-base-700 bg-base-900/95 backdrop-blur-md lg:hidden"
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
                isActive ? 'text-mint-300' : 'text-base-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                    isActive ? 'bg-mint-400/15' : ''
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
