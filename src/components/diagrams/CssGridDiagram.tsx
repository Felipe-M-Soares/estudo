import { useState } from 'react';

export function CssGridDiagram() {
  const [cols, setCols] = useState(3);
  const [gap, setGap] = useState(12);
  const [itemCount, setItemCount] = useState(6);

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div
        className="rounded-xl bg-base-950/60 p-3"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: `${gap}px`,
        }}
      >
        {Array.from({ length: itemCount }, (_, i) => i + 1).map((n) => (
          <div
            key={n}
            className="flex h-12 items-center justify-center rounded-lg bg-mint-400/80 font-mono text-xs font-bold text-base-950"
          >
            {n}
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2.5">
        <div className="flex items-center gap-3">
          <span className="w-24 shrink-0 font-mono text-xs text-base-300">colunas</span>
          <input type="range" min={1} max={5} value={cols} onChange={(e) => setCols(Number(e.target.value))} className="flex-1 accent-mint-400" />
          <span className="mono-num w-6 text-right text-xs text-base-100">{cols}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-24 shrink-0 font-mono text-xs text-base-300">gap</span>
          <input type="range" min={0} max={32} value={gap} onChange={(e) => setGap(Number(e.target.value))} className="flex-1 accent-mint-400" />
          <span className="mono-num w-10 text-right text-xs text-base-100">{gap}px</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-24 shrink-0 font-mono text-xs text-base-300">itens</span>
          <input type="range" min={2} max={12} value={itemCount} onChange={(e) => setItemCount(Number(e.target.value))} className="flex-1 accent-mint-400" />
          <span className="mono-num w-6 text-right text-xs text-base-100">{itemCount}</span>
        </div>
      </div>
      <pre className="mt-3 rounded-lg bg-base-950/80 p-2.5 font-mono text-[11px] text-mint-200">
        grid-template-columns: repeat({cols}, 1fr);{'\n'}gap: {gap}px;
      </pre>
      <p className="mt-2 text-[11px] text-base-500">
        Ajuste os controles e veja como os itens se reorganizam automaticamente — esse é o "auto-fit" que o Grid resolve sem
        media queries manuais.
      </p>
    </div>
  );
}
