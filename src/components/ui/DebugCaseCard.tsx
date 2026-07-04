import { useState } from 'react';
import type { DebugCase } from '../../data/types';

export function DebugCaseCard({ item }: { item: DebugCase }) {
  const [suspect, setSuspect] = useState<string | null>(null);
  const correct = suspect === item.answer;

  return (
    <div className="card-surface rounded-2xl p-5">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-300">Debug mode</p>
      <h3 className="mt-1 font-display text-lg font-bold text-base-50">{item.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-base-200">{item.context}</p>
      <p className="mt-2 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-100">{item.symptom}</p>
      <pre className="mt-3 overflow-x-auto rounded-xl border border-base-700 bg-base-950/70 p-3 text-xs text-cyan-100"><code>{item.log}</code></pre>
      <div className="mt-4 space-y-2">
        {item.suspects.map((s) => (
          <button key={s} onClick={() => setSuspect(s)} className={`w-full rounded-xl border px-3.5 py-2.5 text-left text-sm transition-all ${suspect === s ? 'border-cyan-400/50 bg-cyan-500/10 text-cyan-100' : 'border-base-700 bg-base-900/50 text-base-200 hover:border-base-500'}`}>{s}</button>
        ))}
      </div>
      {suspect && (
        <div className={`mt-4 rounded-xl border p-3 text-sm ${correct ? 'border-mint-400/30 bg-mint-500/10 text-mint-100' : 'border-amber-400/30 bg-amber-500/10 text-amber-100'}`}>
          <p className="font-semibold">{correct ? 'Diagnóstico correto.' : 'Quase. O melhor diagnóstico é outro.'}</p>
          <p className="mt-1">Resposta: {item.answer}</p>
          <p className="mt-2 text-base-200">Correção: {item.fix}</p>
        </div>
      )}
    </div>
  );
}
