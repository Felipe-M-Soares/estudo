import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const STAGES = ['Lint', 'Testes', 'Build', 'Deploy'];

export function CicdPipelineDiagram() {
  const [activeIdx, setActiveIdx] = useState(-1);
  const [failIdx, setFailIdx] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  async function run(shouldFailAtTests: boolean) {
    setRunning(true);
    setDone(false);
    setFailIdx(null);
    for (let i = 0; i < STAGES.length; i++) {
      setActiveIdx(i);
      await new Promise((r) => setTimeout(r, 650));
      if (shouldFailAtTests && i === 1) {
        setFailIdx(i);
        setRunning(false);
        return;
      }
    }
    setActiveIdx(-1);
    setDone(true);
    setRunning(false);
  }

  function reset() {
    setActiveIdx(-1);
    setFailIdx(null);
    setDone(false);
    setRunning(false);
  }

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-base-300">Pipeline disparada por um push</span>
        <div className="flex gap-1.5">
          <button onClick={() => run(false)} disabled={running} className="rounded-lg bg-mint-400 px-2.5 py-1 text-xs font-semibold text-base-950 disabled:opacity-40">
            <Play size={11} className="mr-1 inline" />Tudo passa
          </button>
          <button onClick={() => run(true)} disabled={running} className="rounded-lg bg-ember-500 px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-40">
            <Play size={11} className="mr-1 inline" />Teste falha
          </button>
          <button onClick={reset} className="rounded-lg border border-base-600 px-2.5 py-1 text-xs text-base-300 hover:bg-base-800">
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl bg-base-950/60 p-4">
        {STAGES.map((stage, idx) => (
          <div key={stage} className="flex items-center gap-2">
            <div
              className={`flex h-12 w-20 items-center justify-center rounded-lg text-center text-[11px] font-semibold transition-all duration-300 ${
                failIdx === idx
                  ? 'bg-ember-500/20 text-ember-300 ring-2 ring-ember-400'
                  : activeIdx === idx
                  ? 'bg-amber-400/20 text-amber-200 ring-2 ring-amber-400 scale-105'
                  : (done || (failIdx === null && activeIdx > idx))
                  ? 'bg-mint-900/30 text-mint-200'
                  : 'bg-base-800 text-base-400'
              }`}
            >
              {stage}
            </div>
            {idx < STAGES.length - 1 && <span className="text-base-500">→</span>}
          </div>
        ))}
      </div>
      {done && <p className="mt-3 text-center text-sm font-semibold text-mint-300">✅ Deploy concluído com sucesso!</p>}
      {failIdx !== null && (
        <p className="mt-3 text-center text-sm font-semibold text-ember-400">
          ❌ Pipeline interrompida em "{STAGES[failIdx]}" — o deploy nunca chega a acontecer com código quebrado.
        </p>
      )}
    </div>
  );
}
