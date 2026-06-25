import { useState } from 'react';

export function GraphqlVsRestDiagram() {
  const [mode, setMode] = useState<'rest' | 'graphql'>('rest');

  const fullData = { id: 1, nome: 'Ana', email: 'ana@email.com', endereco: 'Rua X, 123', telefone: '11999999999', criadoEm: '2024-01-01' };
  const neededFields = ['nome', 'email'];

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex justify-center gap-1.5">
        <button
          onClick={() => setMode('rest')}
          className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${mode === 'rest' ? 'bg-ember-500 text-white' : 'bg-base-800 text-base-300'}`}
        >
          REST: GET /usuarios/1
        </button>
        <button
          onClick={() => setMode('graphql')}
          className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${mode === 'graphql' ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300'}`}
        >
          GraphQL query
        </button>
      </div>

      <p className="mb-2 text-center text-[11px] text-base-400">Você só precisa de: <strong className="text-base-200">nome e email</strong></p>

      <div className="rounded-xl bg-base-950/60 p-3">
        {Object.entries(fullData).map(([key, value]) => {
          const isNeeded = neededFields.includes(key);
          const isReturned = mode === 'rest' || isNeeded;
          return (
            <div
              key={key}
              className={`flex items-center justify-between rounded-md px-2.5 py-1.5 font-mono text-xs transition-opacity ${
                isReturned ? (isNeeded ? 'bg-mint-900/30 text-mint-200' : 'bg-base-800/60 text-base-400') : 'opacity-20'
              }`}
            >
              <span>{key}</span>
              <span>{String(value)}</span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-[11px] text-base-500">
        {mode === 'rest'
          ? 'REST retorna o objeto inteiro do endpoint, mesmo os campos que você não vai usar — "over-fetching".'
          : 'GraphQL retorna exatamente os campos pedidos na query, nada além disso.'}
      </p>
    </div>
  );
}
