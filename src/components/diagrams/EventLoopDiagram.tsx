import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface Step {
  label: string;
  zone: 'stack' | 'task' | 'micro' | 'done';
}

const STEPS: Step[] = [
  { label: 'console.log("1")', zone: 'stack' },
  { label: 'setTimeout(() => log("3"), 0)', zone: 'task' },
  { label: 'Promise.resolve().then(() => log("4"))', zone: 'micro' },
  { label: 'console.log("2")', zone: 'stack' },
  { label: '— pilha vazia, roda microtasks —', zone: 'micro' },
  { label: 'log("4") executa', zone: 'done' },
  { label: '— roda macrotask (setTimeout) —', zone: 'task' },
  { label: 'log("3") executa', zone: 'done' },
];

const OUTPUT_ORDER = ['1', '2', '4', '3'];

export function EventLoopDiagram() {
  const [stepIdx, setStepIdx] = useState(-1);
  const [running, setRunning] = useState(false);

  async function play() {
    setRunning(true);
    for (let i = 0; i < STEPS.length; i++) {
      setStepIdx(i);
      await new Promise((r) => setTimeout(r, 900));
    }
    setRunning(false);
  }

  function reset() {
    setStepIdx(-1);
    setRunning(false);
  }

  const outputCount = stepIdx >= 5 ? (stepIdx >= 7 ? 4 : 3) : stepIdx >= 3 ? 2 : stepIdx >= 0 ? 1 : 0;
  const current = stepIdx >= 0 ? STEPS[stepIdx] : null;

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-base-300">Simulação: ordem real de execução</span>
        <div className="flex gap-1.5">
          <button onClick={play} disabled={running} className="flex items-center gap-1 rounded-lg bg-mint-400 px-2.5 py-1 text-xs font-semibold text-base-950 disabled:opacity-40">
            <Play size={11} /> Rodar
          </button>
          <button onClick={reset} className="flex items-center gap-1 rounded-lg border border-base-600 px-2.5 py-1 text-xs text-base-300 hover:bg-base-800">
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Zone
          title="Call Stack"
          subtitle="código síncrono"
          active={current?.zone === 'stack'}
          color="mint"
        />
        <Zone
          title="Microtasks"
          subtitle="Promises"
          active={current?.zone === 'micro'}
          color="violet"
        />
        <Zone
          title="Macrotasks"
          subtitle="setTimeout"
          active={current?.zone === 'task'}
          color="amber"
        />
      </div>

      <div className="mt-3 min-h-[36px] rounded-lg bg-base-950/60 px-3 py-2 text-center font-mono text-xs text-base-200">
        {current ? current.label : 'Clique em "Rodar" para simular'}
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5">
        <span className="text-[11px] text-base-500">console:</span>
        {OUTPUT_ORDER.map((val, i) => (
          <span
            key={i}
            className={`flex h-6 w-6 items-center justify-center rounded font-mono text-[11px] font-bold transition-all duration-300 ${
              i < outputCount ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-600'
            }`}
          >
            {val}
          </span>
        ))}
      </div>
      <p className="mt-2 text-center text-[11px] text-base-500">
        Síncrono primeiro, depois microtasks (Promises), só então macrotasks (setTimeout) — mesmo com delay 0.
      </p>
    </div>
  );
}

function Zone({ title, subtitle, active, color }: { title: string; subtitle: string; active: boolean; color: 'mint' | 'violet' | 'amber' }) {
  const colors = {
    mint: 'border-mint-400 bg-mint-900/30 text-mint-300',
    violet: 'border-violet-400 bg-violet-500/15 text-violet-300',
    amber: 'border-amber-400 bg-amber-500/15 text-amber-300',
  }[color];
  return (
    <div className={`rounded-xl border p-2.5 text-center transition-all duration-300 ${active ? colors + ' scale-105 shadow-lg' : 'border-base-700 bg-base-800/40 text-base-400'}`}>
      <div className="text-[11px] font-bold">{title}</div>
      <div className="text-[10px] opacity-80">{subtitle}</div>
    </div>
  );
}
