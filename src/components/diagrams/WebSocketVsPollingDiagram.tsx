import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export function WebSocketVsPollingDiagram() {
  const [mode, setMode] = useState<'polling' | 'websocket'>('polling');
  const [requests, setRequests] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const [connected, setConnected] = useState(false);

  async function run() {
    setRunning(true);
    setRequests([]);
    setConnected(false);

    if (mode === 'polling') {
      for (let i = 0; i < 6; i++) {
        await new Promise((r) => setTimeout(r, 350));
        setRequests((prev) => [...prev, i]);
      }
    } else {
      await new Promise((r) => setTimeout(r, 300));
      setConnected(true);
      for (let i = 0; i < 3; i++) {
        await new Promise((r) => setTimeout(r, 500));
        setRequests((prev) => [...prev, i]);
      }
    }
    setRunning(false);
  }

  function reset() {
    setRequests([]);
    setConnected(false);
    setRunning(false);
  }

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex gap-1.5">
          <button onClick={() => { setMode('polling'); reset(); }} className={`rounded-full px-3 py-1 text-xs font-semibold ${mode === 'polling' ? 'bg-ember-500 text-white' : 'bg-base-800 text-base-300'}`}>
            Polling
          </button>
          <button onClick={() => { setMode('websocket'); reset(); }} className={`rounded-full px-3 py-1 text-xs font-semibold ${mode === 'websocket' ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300'}`}>
            WebSocket
          </button>
        </div>
        <div className="flex gap-1.5">
          <button onClick={run} disabled={running} className="flex items-center gap-1 rounded-lg bg-cyan-400 px-2.5 py-1 text-xs font-bold text-base-950 disabled:opacity-40">
            <Play size={11} /> Simular 3s
          </button>
          <button onClick={reset} className="rounded-lg border border-base-600 px-2.5 py-1 text-xs text-base-300 hover:bg-base-800">
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-base-950/60 p-4">
        {mode === 'polling' ? (
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-[10px] font-bold transition-all ${
                  requests.includes(i) ? 'bg-ember-500/20 text-ember-300 ring-1 ring-ember-400/40' : 'bg-base-800 text-base-600'
                }`}
              >
                GET
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-24 items-center justify-center rounded-lg text-xs font-bold transition-all ${connected ? 'bg-mint-900/30 text-mint-300 ring-1 ring-mint-400/40' : 'bg-base-800 text-base-500'}`}>
              {connected ? 'conectado' : 'conectando'}
            </div>
            <span className="text-base-500">→</span>
            <div className="flex gap-1.5">
              {requests.map((r) => (
                <span key={r} className="flex h-8 w-8 items-center justify-center rounded-full bg-mint-400/20 text-[10px] font-bold text-mint-300 ring-1 ring-mint-400/40">
                  📩
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <p className="mt-3 text-[11px] text-base-500">
        {mode === 'polling'
          ? 'Polling refaz a pergunta repetidamente ("mudou? mudou? mudou?"), mesmo quando nada muda — desperdiça requisições e ainda atrasa a atualização real.'
          : 'WebSocket abre uma conexão única e o servidor envia dados só quando há algo novo — sem repetir perguntas, sem desperdício.'}
      </p>
    </div>
  );
}
