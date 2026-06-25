import { useState } from 'react';

export function MonolithVsMicroservicesDiagram() {
  const [view, setView] = useState<'monolith' | 'micro'>('monolith');

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex justify-center gap-1.5">
        <button
          onClick={() => setView('monolith')}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            view === 'monolith' ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300'
          }`}
        >
          Monolito
        </button>
        <button
          onClick={() => setView('micro')}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            view === 'micro' ? 'bg-violet-400 text-base-950' : 'bg-base-800 text-base-300'
          }`}
        >
          Microsserviços
        </button>
      </div>

      <div className="min-h-[150px] rounded-xl bg-base-950/60 p-4">
        {view === 'monolith' ? (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <div className="grid w-full max-w-xs grid-cols-2 gap-1.5 rounded-xl border-2 border-mint-400/50 bg-mint-900/20 p-3">
              {['Usuários', 'Pedidos', 'Pagamentos', 'Estoque'].map((m) => (
                <div key={m} className="rounded-lg bg-base-800 px-2 py-1.5 text-center text-[11px] text-base-200">
                  {m}
                </div>
              ))}
            </div>
            <span className="text-[11px] text-mint-300">1 deploy, 1 banco, tudo junto</span>
          </div>
        ) : (
          <div className="flex h-full flex-wrap items-center justify-center gap-2">
            {[
              { name: 'Usuários', db: 'DB' },
              { name: 'Pedidos', db: 'DB' },
              { name: 'Pagamentos', db: 'DB' },
              { name: 'Estoque', db: 'DB' },
            ].map((s) => (
              <div key={s.name} className="flex flex-col items-center gap-1 rounded-xl border-2 border-violet-400/50 bg-violet-500/10 p-2.5">
                <span className="text-[11px] font-medium text-base-100">{s.name}</span>
                <span className="rounded bg-base-800 px-1.5 py-0.5 text-[9px] text-base-400">{s.db}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
        <div className={`rounded-lg p-2.5 ${view === 'monolith' ? 'bg-mint-900/20 text-mint-200' : 'bg-base-800/40 text-base-500'}`}>
          <strong>Vantagem:</strong> simples de desenvolver e fazer deploy no início.
        </div>
        <div className={`rounded-lg p-2.5 ${view === 'micro' ? 'bg-violet-500/10 text-violet-200' : 'bg-base-800/40 text-base-500'}`}>
          <strong>Vantagem:</strong> times e deploys independentes, escala cada parte separadamente.
        </div>
      </div>
    </div>
  );
}
