import { useState } from 'react';

export function ImageOptimizationDiagram() {
  const [viewport, setViewport] = useState<'mobile' | 'desktop'>('mobile');

  const sizes = {
    mobile: { width: 400, format: 'WebP', sizeKb: 28 },
    desktop: { width: 1600, format: 'WebP', sizeKb: 145 },
  };
  const original = { width: 4000, format: 'JPEG', sizeKb: 2400 };
  const current = sizes[viewport];

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex justify-center gap-1.5">
        <button
          onClick={() => setViewport('mobile')}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${viewport === 'mobile' ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300'}`}
        >
          📱 Celular
        </button>
        <button
          onClick={() => setViewport('desktop')}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${viewport === 'desktop' ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300'}`}
        >
          🖥️ Monitor
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-ember-400/30 bg-ember-500/10 p-3 text-center">
          <p className="text-[10px] font-semibold uppercase text-ember-300">Arquivo original</p>
          <p className="mt-1 font-mono text-sm text-base-100">{original.width}px · {original.format}</p>
          <p className="mt-1 font-mono text-lg font-bold text-ember-300">{original.sizeKb}KB</p>
        </div>
        <div className="rounded-xl border border-mint-400/30 bg-mint-900/20 p-3 text-center">
          <p className="text-[10px] font-semibold uppercase text-mint-300">Servido por &lt;Image&gt;</p>
          <p className="mt-1 font-mono text-sm text-base-100">{current.width}px · {current.format}</p>
          <p className="mt-1 font-mono text-lg font-bold text-mint-300">{current.sizeKb}KB</p>
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] text-base-500">
        O componente &lt;Image&gt; gera automaticamente o tamanho certo para cada viewport e converte para um formato mais
        leve — economia de {Math.round((1 - current.sizeKb / original.sizeKb) * 100)}% nesse exemplo.
      </p>
    </div>
  );
}
