import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export function LoadBalancerDiagram() {
  const [requestCount, setRequestCount] = useState(0);
  const [loads, setLoads] = useState([0, 0, 0]);
  const [algorithm, setAlgorithm] = useState<'round-robin' | 'least-conn'>('round-robin');
  const [lastServer, setLastServer] = useState<number | null>(null);

  function sendRequest() {
    let target: number;
    if (algorithm === 'round-robin') {
      target = requestCount % 3;
    } else {
      target = loads.indexOf(Math.min(...loads));
    }
    setLoads((prev) => prev.map((l, i) => (i === target ? l + 1 : l)));
    setLastServer(target);
    setRequestCount((c) => c + 1);
  }

  function reset() {
    setRequestCount(0);
    setLoads([0, 0, 0]);
    setLastServer(null);
  }

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex gap-1.5">
          <button
            onClick={() => { setAlgorithm('round-robin'); reset(); }}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${algorithm === 'round-robin' ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300'}`}
          >
            Round-robin
          </button>
          <button
            onClick={() => { setAlgorithm('least-conn'); reset(); }}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${algorithm === 'least-conn' ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300'}`}
          >
            Least connections
          </button>
        </div>
        <div className="flex gap-1.5">
          <button onClick={sendRequest} className="flex items-center gap-1 rounded-lg bg-cyan-400 px-2.5 py-1 text-xs font-bold text-base-950">
            <Play size={11} /> Requisição
          </button>
          <button onClick={reset} className="flex items-center gap-1 rounded-lg border border-base-600 px-2.5 py-1 text-xs text-base-300 hover:bg-base-800">
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 rounded-xl bg-base-950/60 p-4">
        <span className="text-2xl">💻</span>
        <span className="text-base-500">→</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300">⚖️</span>
        <span className="text-base-500">→</span>
        <div className="flex gap-2">
          {loads.map((load, i) => (
            <div
              key={i}
              className={`flex w-14 flex-col items-center rounded-lg p-2 transition-all ${
                lastServer === i ? 'bg-amber-400/20 ring-2 ring-amber-400' : 'bg-base-800'
              }`}
            >
              <span className="text-sm">🖥️</span>
              <span className="mono-num text-xs font-bold text-base-100">{load}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-[11px] text-base-500">
        {algorithm === 'round-robin'
          ? 'Round-robin distribui em sequência, um servidor por vez, sem olhar a carga atual.'
          : 'Least connections sempre escolhe o servidor com menos carga no momento — melhor quando as requisições têm duração desigual.'}
      </p>
    </div>
  );
}
