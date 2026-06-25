import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const NUMBERS = [3, 8, 12, 5, 20, 7, 15];

export function JavaStreamDiagram() {
  const [stage, setStage] = useState<'idle' | 'filter' | 'map' | 'collect'>('idle');
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    setStage('filter');
    await new Promise((r) => setTimeout(r, 900));
    setStage('map');
    await new Promise((r) => setTimeout(r, 900));
    setStage('collect');
    setRunning(false);
  }

  function reset() {
    setStage('idle');
    setRunning(false);
  }

  const filtered = NUMBERS.filter((n) => n > 6);
  const mapped = filtered.map((n) => n * 2);

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <pre className="mb-3 overflow-x-auto rounded-xl bg-base-950/60 p-3 font-mono text-[12px] text-mint-200">
        numeros.stream()
        {'\n'}  .filter(n -&gt; n &gt; 6)
        {'\n'}  .map(n -&gt; n * 2)
        {'\n'}  .collect(Collectors.toList());
      </pre>

      <div className="flex items-center justify-between gap-2">
        <button onClick={run} disabled={running} className="flex items-center gap-1 rounded-lg bg-mint-400 px-3 py-1.5 text-xs font-semibold text-base-950 disabled:opacity-40">
          <Play size={11} /> Executar stream
        </button>
        <button onClick={reset} className="flex items-center gap-1 rounded-lg border border-base-600 px-3 py-1.5 text-xs text-base-300 hover:bg-base-800">
          <RotateCcw size={11} />
        </button>
      </div>

      <div className="mt-3 space-y-2.5">
        <StreamRow label="Original" values={NUMBERS} visible color="mint" />
        <StreamRow
          label="Após .filter(n > 6)"
          values={filtered}
          visible={stage === 'filter' || stage === 'map' || stage === 'collect'}
          color="amber"
        />
        <StreamRow
          label="Após .map(n * 2)"
          values={mapped}
          visible={stage === 'map' || stage === 'collect'}
          color="violet"
        />
        {stage === 'collect' && (
          <div className="rounded-lg border border-mint-400/30 bg-mint-900/20 p-2.5 text-center font-mono text-sm text-mint-200">
            List&lt;Integer&gt; resultado = [{mapped.join(', ')}]
          </div>
        )}
      </div>
    </div>
  );
}

function StreamRow({
  label,
  values,
  visible,
  color = 'mint',
}: {
  label: string;
  values: number[];
  visible: boolean;
  color?: 'mint' | 'amber' | 'violet';
}) {
  if (!visible) return null;
  const colorClass = {
    mint: 'bg-mint-400 text-base-950',
    amber: 'bg-amber-400 text-base-950',
    violet: 'bg-violet-400 text-base-950',
  }[color];
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
