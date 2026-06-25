import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface MiddlewareStep {
  name: string;
}

const STEPS: MiddlewareStep[] = [{ name: 'CORS' }, { name: 'Autenticação' }, { name: 'Validação' }, { name: 'Controller' }];

export function MiddlewarePipelineDiagram() {
  const [activeIdx, setActiveIdx] = useState(-1);
  const [running, setRunning] = useState(false);
  const [failAt, setFailAt] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  async function run(failIdx: number | null) {
    setRunning(true);
    setDone(false);
    setFailAt(null);
    for (let i = 0; i < STEPS.length; i++) {
      setActiveIdx(i);
      await new Promise((r) => setTimeout(r, 700));
      if (failIdx === i) {
        setFailAt(i);
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
    setFailAt(null);
    setDone(false);
    setRunning(false);
  }

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-base-300">Requisição passando pela pipeline</span>
        <div className="flex gap-1.5">
          <button onClick={() => run(null)} disabled={running} className="flex items-center gap-1 rounded-lg bg-mint-400 px-2.5 py-1 text-xs font-semibold text-base-950 disabled:opacity-40">
            <Play size={11} /> Sucesso
          </button>
          <button onClick={() => run(1)} disabled={running} className="flex items-center gap-1 rounded-lg bg-ember-500 px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-40">
            <Play size={11} /> Sem token
          </button>
          <button onClick={reset} className="flex items-center gap-1 rounded-lg border border-base-600 px-2.5 py-1 text-xs text-base-300 hover:bg-base-800">
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl bg-base-950/60 p-4">
        {STEPS.map((step, idx) => (
          <div key={step.name} className="flex items-center gap-2">
            <div
              className={`flex h-14 w-20 flex-col items-center justify-center gap-0.5 rounded-xl text-center transition-all duration-300 ${
                failAt === idx
                  ? 'bg-ember-500/20 ring-2 ring-ember-400'
                  : activeIdx === idx
                  ? 'bg-amber-400/20 ring-2 ring-amber-400 scale-105'
                  : (done || (activeIdx > idx && failAt === null))
                  ? 'bg-mint-900/30 ring-1 ring-mint-400/40'
                  : 'bg-base-800 text-base-400'
              }`}
            >
              <span className="text-[10px] font-semibold leading-tight">{step.name}</span>
              {failAt === idx && <span className="text-[9px] text-ember-300">401 ✕</span>}
            </div>
            {idx < STEPS.length - 1 && <span className="text-base-500">→</span>}
          </div>
        ))}
      </div>

      {done && <p className="mt-3 text-center text-sm font-semibold text-mint-300">✅ Requisição atendida com sucesso (200 OK)</p>}
      {failAt !== null && (
        <p className="mt-3 text-center text-sm font-semibold text-ember-400">
          ❌ Middleware de {STEPS[failAt].name} bloqueou a requisição — ela nunca chega ao Controller.
        </p>
      )}
    </div>
  );
}
