import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface Frame {
  n: number;
  status: 'calling' | 'waiting' | 'returning' | 'done';
  result?: number;
}

export function RecursionStackDiagram() {
  const [n, setN] = useState(4);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [running, setRunning] = useState(false);
  const [finalResult, setFinalResult] = useState<number | null>(null);

  async function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function runFactorial() {
    setRunning(true);
    setFinalResult(null);
    const stack: Frame[] = [];

    for (let i = n; i >= 1; i--) {
      stack.push({ n: i, status: 'calling' });
      setFrames([...stack]);
      await sleep(500);
      stack[stack.length - 1].status = 'waiting';
      setFrames([...stack]);
      await sleep(150);
    }

    let acc = 1;
    for (let i = stack.length - 1; i >= 0; i--) {
      acc = acc * stack[i].n;
      stack[i].status = 'returning';
      stack[i].result = acc;
      setFrames([...stack]);
      await sleep(550);
      stack.pop();
      setFrames([...stack]);
      await sleep(150);
    }

    setFinalResult(acc);
    setRunning(false);
  }

  function reset() {
    setFrames([]);
    setFinalResult(null);
    setRunning(false);
  }

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-base-300">fatorial({n}) — empilha até o caso base, depois desempilha calculando</span>
        <div className="flex items-center gap-2">
          <select
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            disabled={running}
            className="rounded-lg border border-base-600 bg-base-800 px-2 py-1 text-xs text-base-100"
          >
            {[3, 4, 5, 6].map((v) => (
              <option key={v} value={v}>n = {v}</option>
            ))}
          </select>
          <button onClick={runFactorial} disabled={running} className="flex items-center gap-1 rounded-lg bg-mint-400 px-2.5 py-1 text-xs font-semibold text-base-950 disabled:opacity-40">
            <Play size={11} /> Rodar
          </button>
          <button onClick={reset} className="flex items-center gap-1 rounded-lg border border-base-600 px-2.5 py-1 text-xs text-base-300 hover:bg-base-800">
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      <div className="flex min-h-[200px] flex-col-reverse items-center justify-start gap-1.5 rounded-xl bg-base-950/60 p-3">
        {frames.length === 0 && <span className="text-xs text-base-500">Pilha de chamadas vazia</span>}
        {frames.map((f, idx) => (
          <div
            key={idx}
            className={`flex w-44 items-center justify-between rounded-lg px-3 py-2 font-mono text-xs transition-all duration-300 ${
              f.status === 'calling'
                ? 'bg-amber-400/20 text-amber-200 ring-1 ring-amber-400/40'
                : f.status === 'waiting'
                ? 'bg-base-700 text-base-300'
                : 'bg-mint-900/40 text-mint-200 ring-1 ring-mint-400/40'
            }`}
          >
            <span>fatorial({f.n})</span>
            {f.result !== undefined && <span className="font-bold">→ {f.result}</span>}
          </div>
        ))}
      </div>

      {finalResult !== null && (
        <p className="mt-3 text-center text-sm font-semibold text-mint-300">
          🎉 fatorial({n}) = {finalResult}
        </p>
      )}
      <p className="mt-2 text-center text-[11px] text-base-500">
        Cada chamada fica "esperando" na pilha até a chamada de baixo (caso base) retornar — só então o cálculo sobe de volta.
      </p>
    </div>
  );
}
