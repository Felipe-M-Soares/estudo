import { useState } from 'react';

const CURVES = [
  { key: 'o1', label: 'O(1)', color: '#3fe08a', fn: () => 1 },
  { key: 'ologn', label: 'O(log n)', color: '#9b75e0', fn: (n: number) => Math.log2(Math.max(n, 1)) },
  { key: 'on', label: 'O(n)', color: '#f2a93b', fn: (n: number) => n },
  { key: 'on2', label: 'O(n²)', color: '#f2415b', fn: (n: number) => n * n },
];

export function BigODiagram() {
  const [n, setN] = useState(10);
  const maxN = 20;

  const points: Record<string, { x: number; y: number }[]> = {};
  for (const curve of CURVES) {
    const pts: { x: number; y: number }[] = [];
    for (let i = 1; i <= maxN; i++) {
      pts.push({ x: i, y: curve.fn(i) });
    }
    points[curve.key] = pts;
  }

  const maxY = Math.max(...points.on2.map((p) => p.y));
  const W = 260;
  const H = 140;

  function toSvgX(x: number) {
    return (x / maxN) * (W - 20) + 10;
  }
  function toSvgY(y: number) {
    return H - 10 - (y / maxY) * (H - 20);
  }

  function pathFor(key: string) {
    return points[key].map((p, i) => `${i === 0 ? 'M' : 'L'} ${toSvgX(p.x)} ${toSvgY(p.y)}`).join(' ');
  }

  const currentValues = CURVES.map((c) => ({ ...c, value: Math.round(c.fn(n)) }));

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="overflow-x-auto rounded-xl bg-base-950/60 p-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-32 w-full max-w-xs">
          <line x1="10" y1={H - 10} x2={W - 10} y2={H - 10} stroke="currentColor" className="text-base-700" strokeWidth="1" />
          <line x1="10" y1="10" x2="10" y2={H - 10} stroke="currentColor" className="text-base-700" strokeWidth="1" />
          {CURVES.map((c) => (
            <path key={c.key} d={pathFor(c.key)} fill="none" stroke={c.color} strokeWidth="2" />
          ))}
          <line
            x1={toSvgX(n)}
            y1="10"
            x2={toSvgX(n)}
            y2={H - 10}
            stroke="currentColor"
            className="text-base-500"
            strokeWidth="1"
            strokeDasharray="3,3"
          />
        </svg>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span className="shrink-0 font-mono text-xs text-base-400">n =</span>
        <input
          type="range"
          min={1}
          max={maxN}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="flex-1 accent-mint-400"
        />
        <span className="mono-num w-8 shrink-0 text-right text-sm font-bold text-base-100">{n}</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {currentValues.map((c) => (
          <div key={c.key} className="rounded-lg bg-base-950/60 px-2 py-1.5 text-center">
            <div className="text-[10px] font-semibold" style={{ color: c.color }}>{c.label}</div>
            <div className="mono-num text-sm font-bold text-base-100">{c.value.toLocaleString('pt-BR')}</div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-[11px] text-base-500">
        Arraste o slider e veja como O(n²) dispara muito mais rápido que as outras conforme n cresce.
      </p>
    </div>
  );
}
