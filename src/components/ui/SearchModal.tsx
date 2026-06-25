import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, Dumbbell, Gamepad2, Layers } from 'lucide-react';
import { searchContent, type SearchResult } from '../../data';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const typeIcon: Record<SearchResult['type'], typeof BookOpen> = {
  module: Layers,
  lesson: BookOpen,
  exercise: Dumbbell,
  game: Gamepad2,
};

const typeLabel: Record<SearchResult['type'], string> = {
  module: 'Módulo',
  lesson: 'Lição',
  exercise: 'Exercício',
  game: 'Jogo',
};

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = searchContent(query);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  function goTo(moduleId: string) {
    navigate(`/modulo/${moduleId}`);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-[10vh] backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg animate-scale-pop rounded-2xl border border-base-600 bg-base-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 border-b border-base-700 px-4 py-3">
          <Search size={16} className="shrink-0 text-cyan-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar módulos, lições, exercícios, jogos..."
            className="flex-1 bg-transparent text-sm text-base-100 outline-none placeholder:text-base-500"
          />
          <button onClick={onClose} className="shrink-0 text-base-500 hover:text-base-200" aria-label="Fechar busca">
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim().length < 2 && (
            <p className="px-3 py-6 text-center text-sm text-base-500">Digite ao menos 2 letras para buscar.</p>
          )}
          {query.trim().length >= 2 && results.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-base-500">Nada encontrado para "{query}".</p>
          )}
          {results.map((r, idx) => {
            const Icon = typeIcon[r.type];
            return (
              <button
                key={idx}
                onClick={() => goTo(r.moduleId)}
                className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-base-800"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-base-700 text-base-300">
                  <Icon size={13} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-400">
                    {typeLabel[r.type]} · {r.moduleEmoji} {r.moduleTitle}
                  </span>
                  <span className="block truncate text-sm font-medium text-base-100">{r.title}</span>
                  <span className="block truncate text-xs text-base-500">{r.snippet}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
