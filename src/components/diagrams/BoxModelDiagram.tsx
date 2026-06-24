import { useState } from 'react';

export function BoxModelDiagram() {
  const [margin, setMargin] = useState(16);
  const [border, setBorder] = useState(4);
  const [padding, setPadding] = useState(16);

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="flex items-center justify-center overflow-auto rounded-xl bg-base-950/60 p-3" style={{ minHeight: 180 }}>
        <div style={{ padding: `${margin}px`, background: 'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(242,169,59,0.08) 6px, rgba(242,169,59,0.08) 12px)' }}>
          <div
            style={{
              border: `${border}px solid #f2a93b`,
              padding: `${padding}px`,
            }}
            className="bg-mint-900/30"
          >
            <div className="flex h-12 w-20 items-center justify-center rounded bg-mint-400 font-mono text-[10px] font-bold text-base-950">
              conteúdo
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-2.5">
        <SliderRow label="margin" value={margin} onChange={setMargin} color="text-base-300" />
        <SliderRow label="border" value={border} onChange={setBorder} max={12} color="text-amber-300" />
        <SliderRow label="padding" value={padding} onChange={setPadding} color="text-mint-300" />
      </div>
      <p className="mt-2 text-[11px] text-base-500">
        De dentro para fora: conteúdo → padding (espaço interno) → border → margin (espaço externo, área pontilhada).
      </p>
    </div>
  );
}

function SliderRow({ label, value, onChange, max = 40, color }: { label: string; value: number; onChange: (v: number) => void; max?: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`w-16 shrink-0 font-mono text-xs ${color}`}>{label}</span>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-mint-400"
      />
      <span className="mono-num w-10 shrink-0 text-right text-xs text-base-400">{value}px</span>
    </div>
  );
}
