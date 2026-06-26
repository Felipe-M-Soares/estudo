import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const SPANS = [
  { service: 'API Gateway', duration: 5 },
  { service: 'Serviço de Pedidos', duration: 40 },
  { service: 'Serviço de Estoque', duration: 80 },
  { service: 'Serviço de Pagamento', duration: 120 },
];

export function TracingDiagram() {
  const [revealed, setRevealed] = useState(0);
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    setRevealed(0);
    for (let i = 1; i <= SPANS.length; i++) {
      await new Promise((r) => setTimeout(r, 500));
      setRevealed(i);
    }
    setRunning(false);
  }

  function reset() {
    setRevealed(0);
    setRunning(false);
  }

  const maxDuration = Math.max(...SPANS.map((s) => s.duration));
  const total = SPANS.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-base-300">trace_id: a1b2c3 — uma única requisição</span>
        <div className="flex gap-1.5">
          <button onClick={run} disabled={running} className="flex items-center gap-1 rounded-lg bg-cyan-400 px-2.5 py-1 text-xs font-bold text-base-950 disabled:opacity-40">
            <Play size={11} /> Rastrear
          </button>
          <button onClick={reset} className="rounded-lg border border-base-600 px-2.5 py-1 text-xs text-base-300 hover:bg-base-800">
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      <div className="space-y-1.5 rounded-xl bg-base-950/60 p-3">
        {SPANS.map((s, i) => (
          <div key={s.service} className={`transition-opacity ${i < revealed ? 'opacity-100' : 'opacity-20'}`}>
            <div className="mb-0.5 flex justify-between text-[10px] text-base-400">
              <span>{s.service}</span>
              <span className="mono-num">{i < revealed ? `${s.duration}ms` : '—'}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-base-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-mint-400 transition-all duration-500"
                style={{ width: i < revealed ? `${(s.duration / maxDuration) * 100}%` : '0%' }}
              />
            </div>
          </div>
        ))}
      </div>
      {revealed === SPANS.length && (
        <p className="mt-3 text-center text-sm font-semibold text-mint-300">
          Tempo total: {total}ms — gargalo identificado: Serviço de Pagamento (120ms)
        </p>
      )}
      <p className="mt-2 text-[11px] text-base-500">
        Um único trace_id conecta os spans de todos os serviços que essa requisição atravessou — sem isso, você teria que
        caçar manualmente em 4 arquivos de log separados, sem saber que pertencem à mesma requisição.
      </p>
    </div>
  );
}
