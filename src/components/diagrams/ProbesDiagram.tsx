import { useState } from 'react';

type PodState = 'starting' | 'ready' | 'stuck';

export function ProbesDiagram() {
  const [state, setState] = useState<PodState>('starting');

  const liveness = state !== 'stuck';
  const readiness = state === 'ready';

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex justify-center gap-1.5">
        <button onClick={() => setState('starting')} className={`rounded-full px-3 py-1 text-xs font-semibold ${state === 'starting' ? 'bg-amber-400 text-base-950' : 'bg-base-800 text-base-300'}`}>
          Inicializando
        </button>
        <button onClick={() => setState('ready')} className={`rounded-full px-3 py-1 text-xs font-semibold ${state === 'ready' ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300'}`}>
          Pronto
        </button>
        <button onClick={() => setState('stuck')} className={`rounded-full px-3 py-1 text-xs font-semibold ${state === 'stuck' ? 'bg-ember-500 text-white' : 'bg-base-800 text-base-300'}`}>
          Travado
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-xl bg-base-950/60 p-4">
        <div className={`rounded-xl border p-3 text-center ${liveness ? 'border-mint-400/40 bg-mint-900/20' : 'border-ember-400/40 bg-ember-500/15'}`}>
          <p className="text-[10px] font-semibold uppercase text-base-400">Liveness Probe</p>
          <p className={`mt-1 text-lg font-bold ${liveness ? 'text-mint-300' : 'text-ember-300'}`}>{liveness ? 'Vivo ✓' : 'Reinicia ✕'}</p>
        </div>
        <div className={`rounded-xl border p-3 text-center ${readiness ? 'border-mint-400/40 bg-mint-900/20' : 'border-amber-400/40 bg-amber-500/15'}`}>
          <p className="text-[10px] font-semibold uppercase text-base-400">Readiness Probe</p>
          <p className={`mt-1 text-lg font-bold ${readiness ? 'text-mint-300' : 'text-amber-300'}`}>{readiness ? 'Recebe tráfego ✓' : 'Sem tráfego'}</p>
        </div>
      </div>
      <p className="mt-3 text-[11px] text-base-500">
        {state === 'starting' && 'O processo está rodando (liveness ok), mas ainda carregando cache/conectando ao banco — o Service não envia tráfego ainda.'}
        {state === 'ready' && 'Totalmente pronto: o processo responde, e já terminou sua inicialização — agora recebe tráfego normalmente.'}
        {state === 'stuck' && 'O processo travou (ex: deadlock interno) — o Kubernetes detecta via liveness probe e reinicia o container automaticamente.'}
      </p>
    </div>
  );
}
