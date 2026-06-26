import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export function GoroutineChannelDiagram() {
  const [stage, setStage] = useState<'idle' | 'running' | 'sent' | 'received'>('idle');
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    setStage('running');
    await new Promise((r) => setTimeout(r, 800));
    setStage('sent');
    await new Promise((r) => setTimeout(r, 700));
    setStage('received');
    setRunning(false);
  }

  function reset() {
    setStage('idle');
    setRunning(false);
  }

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-base-300">go calcular(canal) rodando em paralelo</span>
        <div className="flex gap-1.5">
          <button onClick={run} disabled={running} className="flex items-center gap-1 rounded-lg bg-mint-400 px-2.5 py-1 text-xs font-bold text-base-950 disabled:opacity-40">
            <Play size={11} /> Rodar
          </button>
          <button onClick={reset} className="rounded-lg border border-base-600 px-2.5 py-1 text-xs text-base-300 hover:bg-base-800">
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 rounded-xl bg-base-950/60 p-4">
        <div className="flex flex-col items-center gap-1.5">
          <div className={`flex h-12 w-20 items-center justify-center rounded-xl text-xs font-bold transition-all ${stage === 'running' ? 'bg-amber-400/20 text-amber-200 ring-2 ring-amber-400 animate-pulse-soft' : 'bg-base-800 text-base-400'}`}>
            goroutine
          </div>
          <span className="text-[10px] text-base-500">calcular()</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className={`h-1 w-16 rounded-full transition-colors ${stage === 'sent' || stage === 'received' ? 'bg-cyan-400' : 'bg-base-700'}`} />
          <span className="text-[9px] text-base-500">{stage === 'sent' ? '100 →' : 'channel'}</span>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <div className={`flex h-12 w-20 items-center justify-center rounded-xl text-xs font-bold transition-all ${stage === 'received' ? 'bg-mint-400/20 text-mint-200 ring-2 ring-mint-400' : 'bg-base-800 text-base-400'}`}>
            main()
          </div>
          <span className="text-[10px] text-base-500">{stage === 'received' ? 'valor := 100' : 'esperando...'}</span>
        </div>
      </div>
      <p className="mt-3 text-[11px] text-base-500">
        {stage === 'idle' && 'A goroutine ainda não começou.'}
        {stage === 'running' && 'A goroutine está calculando, em paralelo, sem bloquear o resto do programa.'}
        {stage === 'sent' && 'O resultado foi enviado pelo channel...'}
        {stage === 'received' && 'main() recebeu o valor do channel e pode continuar.'}
      </p>
    </div>
  );
}
