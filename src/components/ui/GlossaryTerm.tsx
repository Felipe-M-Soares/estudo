import { useRef, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { lookupTerm } from '../../data/glossary';

interface GlossaryTermProps {
  word: string;
}

const POPUP_WIDTH = 256;
const VIEWPORT_MARGIN = 16;

export function GlossaryTerm({ word }: GlossaryTermProps) {
  const [open, setOpen] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const entry = lookupTerm(word);

  if (!entry) {
    return <>{word}</>;
  }

  function handleToggle() {
    if (!open && anchorRef.current) {
      // O popup nasce centralizado sobre o termo clicado, mas em telas estreitas
      // isso facilmente o empurra para fora da viewport (à esquerda ou à
      // direita), já que o termo pode estar em qualquer ponto de um texto
      // corrido. Medimos a posição real do termo e corrigimos o offset para o
      // popup sempre caber dentro da tela, com uma margem de respiro.
      const rect = anchorRef.current.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const halfPopup = POPUP_WIDTH / 2;
      const minCenter = halfPopup + VIEWPORT_MARGIN;
      const maxCenter = window.innerWidth - halfPopup - VIEWPORT_MARGIN;
      const clampedCenter = Math.min(Math.max(center, minCenter), maxCenter);
      setOffsetX(clampedCenter - center);
    }
    setOpen((o) => !o);
  }

  return (
    <span ref={anchorRef} className="relative inline-block">
      <button
        type="button"
        onClick={handleToggle}
        className="rounded border-b border-dashed border-cyan-400/60 text-cyan-300 transition-colors hover:bg-cyan-400/10"
      >
        {word}
      </button>
      {open && (
        <>
          <span className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <span
            className="absolute left-1/2 top-full z-50 mt-2 w-64 animate-scale-pop rounded-xl border border-cyan-400/30 bg-base-900 p-3 text-left shadow-2xl"
            style={{ transform: `translateX(calc(-50% + ${offsetX}px))` }}
          >
            <span className="mb-1 flex items-center gap-1.5 text-xs font-bold text-cyan-300">
              <BookOpen size={12} /> {entry.term}
            </span>
            <span className="block text-[13px] leading-snug text-base-200">{entry.definition}</span>
          </span>
        </>
      )}
    </span>
  );
}
