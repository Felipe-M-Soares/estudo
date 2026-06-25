import { useState } from 'react';
import { Briefcase, Home, ChevronDown, HelpCircle, Check, X } from 'lucide-react';
import type { DayToDayScenario } from '../../data/types';

interface ScenarioCardProps {
  scenario: DayToDayScenario;
  onCheckResult?: (scenarioId: string, correct: boolean) => void;
  alreadyChecked?: boolean;
}

export function ScenarioCard({ scenario, onCheckResult, alreadyChecked }: ScenarioCardProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const isWork = scenario.context === 'trabalho';
  const check = scenario.check;

  function handleSelect(idx: number) {
    if (selected !== null || !check) return;
    setSelected(idx);
    onCheckResult?.(scenario.id, idx === check.correctIndex);
  }

  return (
    <div className="card-surface card-surface-hover overflow-hidden rounded-2xl">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-3.5 p-4 text-left">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-base-700 text-xl">{scenario.emoji}</span>
        <div className="min-w-0 flex-1">
          <span
            className={`mb-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
              isWork ? 'bg-cyan-500/15 text-cyan-300' : 'bg-violet-500/15 text-violet-300'
            }`}
          >
            {isWork ? <Briefcase size={10} /> : <Home size={10} />}
            {isWork ? 'No trabalho' : 'No dia a dia'}
          </span>
          <h4 className="font-display text-sm font-bold leading-snug text-base-50">{scenario.title}</h4>
        </div>
        {check && alreadyChecked && (
          <span className="shrink-0 rounded-full bg-mint-900/40 p-1 text-mint-400">
            <Check size={12} />
          </span>
        )}
        <ChevronDown size={16} className={`shrink-0 text-base-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="animate-rise-in space-y-3 border-t border-base-700 px-4 pb-4 pt-3.5">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-base-400">A situação</p>
            <p className="text-sm text-base-200">{scenario.situation}</p>
          </div>
          <div className="rounded-xl border border-ember-400/20 bg-ember-500/5 p-3">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ember-300">O que acontece</p>
            <p className="text-sm text-base-200">{scenario.whatHappens}</p>
          </div>
          <div className="rounded-xl border border-mint-400/20 bg-mint-900/15 p-3">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-mint-300">Como resolver</p>
            <p className="text-sm text-base-200">{scenario.howToSolve}</p>
          </div>

          {check && (
            <div className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-3">
              <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-amber-300">
                <HelpCircle size={12} /> Checagem rápida
              </p>
              <p className="mb-2.5 text-sm text-base-100">{check.question}</p>
              <div className="space-y-1.5">
                {check.options.map((opt, idx) => {
                  const isCorrect = idx === check.correctIndex;
                  const isSelected = idx === selected;
                  let styles = 'border-base-600 hover:border-base-500 hover:bg-base-800';
                  if (selected !== null) {
                    if (isCorrect) styles = 'border-mint-400/60 bg-mint-900/30';
                    else if (isSelected) styles = 'border-ember-400/60 bg-ember-500/10';
                    else styles = 'border-base-700 opacity-50';
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={selected !== null}
                      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm text-base-100 transition-colors ${styles}`}
                    >
                      {opt}
                      {selected !== null && isCorrect && <Check size={14} className="shrink-0 text-mint-400" />}
                      {selected !== null && isSelected && !isCorrect && <X size={14} className="shrink-0 text-ember-400" />}
                    </button>
                  );
                })}
              </div>
              {selected !== null && <p className="mt-2.5 text-xs text-base-300">{check.explanation}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
