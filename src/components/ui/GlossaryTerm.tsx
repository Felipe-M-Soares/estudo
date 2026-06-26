import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { lookupTerm } from '../../data/glossary';

interface GlossaryTermProps {
  word: string;
}

export function GlossaryTerm({ word }: GlossaryTermProps) {
  const [open, setOpen] = useState(false);
  const entry = lookupTerm(word);

  if (!entry) {
    return <>{word}</>;
  }

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded border-b border-dashed border-cyan-400/60 text-cyan-300 transition-colors hover:bg-cyan-400/10"
      >
        {word}
      </button>
      {open && (
        <>
          <span className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <span className="absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 animate-scale-pop rounded-xl border border-cyan-400/30 bg-base-900 p-3 text-left shadow-2xl">
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
