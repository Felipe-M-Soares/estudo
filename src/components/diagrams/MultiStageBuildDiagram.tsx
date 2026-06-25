import { useState } from 'react';

export function MultiStageBuildDiagram() {
  const [showMultiStage, setShowMultiStage] = useState(false);

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex justify-center gap-1.5">
        <button
          onClick={() => setShowMultiStage(false)}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            !showMultiStage ? 'bg-ember-500 text-white' : 'bg-base-800 text-base-300'
          }`}
        >
          Build simples
        </button>
        <button
          onClick={() => setShowMultiStage(true)}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            showMultiStage ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300'
          }`}
        >
          Multi-stage
        </button>
      </div>

      {!showMultiStage ? (
        <div className="rounded-xl bg-base-950/60 p-4">
          <div className="rounded-lg border-2 border-ember-400/40 bg-ember-500/10 p-3">
            <p className="text-xs font-semibold text-ember-300">Imagem final única</p>
            <div className="mt-2 space-y-1 font-mono text-[11px] text-base-300">
              <div>📦 Node.js + npm (300MB)</div>
              <div>📦 Dependências de build (250MB)</div>
              <div>📦 Código fonte + node_modules (180MB)</div>
              <div>📦 Build final (20MB)</div>
            </div>
            <p className="mt-2 text-right text-sm font-bold text-ember-300">≈ 750MB</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2 rounded-xl bg-base-950/60 p-4">
          <div className="rounded-lg border border-base-600 bg-base-800/60 p-2.5 opacity-60">
            <p className="text-[10px] font-semibold text-base-400">Estágio 1: build (descartado depois)</p>
            <p className="mt-1 font-mono text-[10px] text-base-400">Node.js + npm + deps + código fonte</p>
          </div>
          <div className="text-center text-base-500">↓ copia só o resultado ↓</div>
          <div className="rounded-lg border-2 border-mint-400/40 bg-mint-900/20 p-3">
            <p className="text-xs font-semibold text-mint-300">Estágio 2: imagem final</p>
            <div className="mt-2 font-mono text-[11px] text-base-200">📦 Apenas o build final (20MB)</div>
            <p className="mt-2 text-right text-sm font-bold text-mint-300">≈ 25MB</p>
          </div>
        </div>
      )}
      <p className="mt-3 text-[11px] text-base-500">
        O multi-stage descarta tudo que só era necessário para compilar, mantendo na imagem final só o que realmente precisa
        rodar em produção.
      </p>
    </div>
  );
}
