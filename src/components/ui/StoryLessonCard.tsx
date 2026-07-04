import { useState } from 'react';
import type { StoryLesson } from '../../data/types';

export function StoryLessonCard({ story }: { story: StoryLesson }) {
  const [choice, setChoice] = useState<number | null>(null);
  const selected = choice === null ? null : story.choices[choice];

  return (
    <div className="card-surface card-surface-hover rounded-2xl p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-300">Story lesson</p>
          <h3 className="mt-1 font-display text-lg font-bold text-base-50">{story.title}</h3>
        </div>
        <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-200 ring-1 ring-amber-400/20">missão</span>
      </div>

      <p className="text-sm leading-relaxed text-base-200">{story.mission}</p>
      <p className="mt-3 rounded-xl border border-base-700 bg-base-950/40 p-3 text-sm leading-relaxed text-base-300">⚠️ {story.tension}</p>

      <div className="mt-4 space-y-2">
        {story.choices.map((option, index) => (
          <button
            key={option.label}
            onClick={() => setChoice(index)}
            className={`w-full rounded-xl border px-3.5 py-3 text-left text-sm transition-all ${
              choice === index ? 'border-mint-400/50 bg-mint-900/20 text-mint-100' : 'border-base-700 bg-base-900/40 text-base-200 hover:border-base-500'
            }`}
          >
            <span className="mr-2 font-mono text-xs text-base-500">{String.fromCharCode(65 + index)}</span>
            {option.label}
          </button>
        ))}
      </div>

      {selected && (
        <div className={`mt-4 rounded-xl border p-3 text-sm leading-relaxed ${selected.correct ? 'border-mint-400/30 bg-mint-500/10 text-mint-100' : 'border-amber-400/30 bg-amber-500/10 text-amber-100'}`}>
          <p className="font-semibold">{selected.correct ? 'Boa decisão.' : 'Consequência dessa escolha.'}</p>
          <p className="mt-1">{selected.consequence}</p>
          <p className="mt-3 text-base-200">{story.reveal}</p>
          <p className="mt-2 font-medium text-base-100">Resumo mental: {story.takeaway}</p>
        </div>
      )}
    </div>
  );
}
