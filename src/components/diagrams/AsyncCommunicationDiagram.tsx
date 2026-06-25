import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export function AsyncCommunicationDiagram() {
  const [mode, setMode] = useState<'sync' | 'async'>('sync');
  const [stage, setStage] = useState(0);
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    setStage(1);
    await new Promise((r) => setTimeout(r, mode === 'sync' ? 1800 : 500));
    setStage(2);
    if (mode === 'async') {
      await new Promise((r) => setTimeout(r, 1200));
      setStage(3);
    }
    setRunning(false);
  }

  function reset() {
    setStage(0);
    setRunning(false);
  }

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex gap-1.5">
          <button onClick={() => { setMode('sync'); reset(); }} className={`rounded-full px-3 py-1 text-xs font-semibold ${mode === 'sync' ? 'bg-ember-500 text-white' : 'bg-base-800 text-base-300'}`}>
            Chamada direta
          </button>
          <button onClick={() => { setMode('async'); reset(); }} className={`rounded-full px-3 py-1 text-xs font-semibold ${mode === 'async' ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300'}`}>
            Fila assíncrona
          </button>
        </div>
        <div className="flex gap-1.5">
          <button onClick={run} disabled={running} className="flex items-center gap-1 rounded-lg bg-cyan-400 px-2.5 py-1 text-xs font-bold text-base-950 disabled:opacity-40">
            <Play size={11} /> Simular
          </button>
          <button onClick={reset} className="rounded-lg border border-base-600 px-2.5 py-1 text-xs text-base-300 hover:bg-base-800">
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 rounded-xl bg-base-950/60 p-4">
        <Node label="Pedidos" active={stage >= 1} />
        {mode === 'sync' ? (
          <>
            <Arrow active={stage === 1} label={stage === 1 ? 'aguardando...' : ''} />
            <Node label="Estoque" active={stage >= 1} slow={stage === 1} />
          </>
        ) : (
          <>
            <Arrow active={stage >= 1} label="publica evento" />
            <Node label="Fila" active={stage >= 1} icon="📬" />
            <Arrow active={stage >= 2} label="consome quando livre" />
            <Node label="Estoque" active={stage >= 2} />
          </>
        )}
      </div>
      <p className="mt-3 text-[11px] text-base-500">
        {mode === 'sync'
          ? 'Na chamada direta, "Pedidos" fica bloqueado esperando "Estoque" responder — se Estoque estiver lento ou fora do ar, Pedidos também trava.'
          : 'Com fila, "Pedidos" publica o evento e segue seu fluxo imediatamente — "Estoque" consome quando puder, sem travar ninguém.'}
      </p>
    </div>
  );
}

function Node({ label, active, slow, icon }: { label: string; active: boolean; slow?: boolean; icon?: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`flex h-12 w-16 items-center justify-center rounded-xl text-lg transition-all ${active ? (slow ? 'bg-amber-400/20 ring-2 ring-amber-400 animate-pulse-soft' : 'bg-mint-400/20 ring-2 ring-mint-400') : 'bg-base-800'}`}>
        {icon ?? '🖥️'}
      </div>
      <span className="text-[10px] text-base-400">{label}</span>
    </div>
  );
}

function Arrow({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`text-lg ${active ? 'text-mint-400' : 'text-base-600'}`}>→</span>
      {label && <span className="text-[9px] text-base-500">{label}</span>}
    </div>
  );
}
