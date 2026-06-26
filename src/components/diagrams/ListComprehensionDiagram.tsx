import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8];

export function ListComprehensionDiagram() {
  const [stage, setStage] = useState<'idle' | 'filter' | 'transform' | 'done'>('idle');
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    setStage('filter');
    await new Promise((r) => setTimeout(r, 900));
    setStage('transform');
    await new Promise((r) => setTimeout(r, 900));
    setStage('done');
    setRunning(false);
  }

  function reset() {
    setStage('idle');
    setRunning(false);
  }

  const filtered = NUMBERS.filter((n) => n % 2 === 0);
  const transformed = filtered.map((n) => n * n);

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <pre className="mb-3 overflow-x-auto rounded-xl bg-base-950/60 p-3 font-mono text-[12px] text-mint-200">
        [n ** 2 for n in numeros if n % 2 == 0]
      </pre>

      <div className="flex items-center justify-between gap-2">
        <button onClick={run} disabled={running} className="flex items-center gap-1 rounded-lg bg-mint-400 px-3 py-1.5 text-xs font-semibold text-base-950 disabled:opacity-40">
          <Play size={11} /> Rodar passo a passo
        </button>
        <button onClick={reset} className="flex items-center gap-1 rounded-lg border border-base-600 px-3 py-1.5 text-xs text-base-300 hover:bg-base-800">
          <RotateCcw size={11} />
        </button>
      </div>

      <div className="mt-3 space-y-1.5 rounded-xl bg-base-950/60 p-3">
        <Row label="numeros (original)" values={NUMBERS} visible color="cyan" />
        <Row label="depois do 'if n % 2 == 0'" values={filtered} visible={stage === 'filter' || stage === 'transform' || stage === 'done'} color="amber" />
        <Row label="depois do 'n ** 2'" values={transformed} visible={stage === 'transform' || stage === 'done'} color="mint" />
      </div>
      {stage === 'done' && (
        <p className="mt-3 text-center text-sm font-semibold text-mint-300">
          Resultado: [{transformed.join(', ')}]
        </p>
      )}
    </div>
  );
}

function Row({ label, values, visible, color = 'cyan' }: { label: string; values: number[]; visible: boolean; color?: 'cyan' | 'amber' | 'mint' }) {
  if (!visible) return null;
  const colorClass = { cyan: 'bg-cyan-400 text-base-950', amber: 'bg-amber-400 text-base-950', mint: 'bg-mint-400 text-base-950' }[color];
  return (
    <div className="animate-rise-in">
      <span className="text-[10px] font-semibold text-base-400">{label}</span>
      <div className="mt-1 flex flex-wrap gap-1">
        {values.map((v, i) => (
          <span key={i} className={`flex h-7 w-7 items-center justify-center rounded-md font-mono text-xs font-bold ${colorClass}`}>
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}
