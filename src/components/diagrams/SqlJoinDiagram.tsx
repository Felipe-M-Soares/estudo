import { useState } from 'react';

type JoinType = 'inner' | 'left' | 'right' | 'full';

const tableA = [1, 2, 3, 4];
const tableB = [3, 4, 5, 6];

const joinResults: Record<JoinType, { rows: string; label: string; desc: string }> = {
  inner: {
    rows: '3, 4',
    label: 'INNER JOIN',
    desc: 'Só as linhas que existem em AMBAS as tabelas.',
  },
  left: {
    rows: '1, 2, 3, 4',
    label: 'LEFT JOIN',
    desc: 'Todas as linhas da tabela A, com NULL onde não há correspondência em B.',
  },
  right: {
    rows: '3, 4, 5, 6',
    label: 'RIGHT JOIN',
    desc: 'Todas as linhas da tabela B, com NULL onde não há correspondência em A.',
  },
  full: {
    rows: '1, 2, 3, 4, 5, 6',
    label: 'FULL JOIN',
    desc: 'Todas as linhas de ambas as tabelas, combinando onde há correspondência.',
  },
};

export function SqlJoinDiagram() {
  const [joinType, setJoinType] = useState<JoinType>('inner');

  function isHighlighted(value: number, table: 'a' | 'b'): boolean {
    const inOther = table === 'a' ? tableB.includes(value) : tableA.includes(value);
    if (joinType === 'inner') return inOther;
    if (joinType === 'left') return table === 'a' || inOther;
    if (joinType === 'right') return table === 'b' || inOther;
    return true;
  }

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {(['inner', 'left', 'right', 'full'] as JoinType[]).map((t) => (
          <button
            key={t}
            onClick={() => setJoinType(t)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              joinType === t ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300 hover:bg-base-700'
            }`}
          >
            {joinResults[t].label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-6 rounded-xl bg-base-950/60 p-5">
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] font-semibold text-base-400">Tabela A</span>
          {tableA.map((v) => (
            <div
              key={v}
              className={`flex h-8 w-12 items-center justify-center rounded-md font-mono text-xs font-bold transition-colors ${
                isHighlighted(v, 'a') ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-500'
              }`}
            >
              {v}
            </div>
          ))}
        </div>
        <div className="text-2xl text-base-500">⋈</div>
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] font-semibold text-base-400">Tabela B</span>
          {tableB.map((v) => (
            <div
              key={v}
              className={`flex h-8 w-12 items-center justify-center rounded-md font-mono text-xs font-bold transition-colors ${
                isHighlighted(v, 'b') ? 'bg-violet-400 text-base-950' : 'bg-base-800 text-base-500'
              }`}
            >
              {v}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-mint-400/20 bg-mint-900/15 p-3 text-sm">
        <p className="font-mono text-xs text-mint-300">Resultado: {joinResults[joinType].rows}</p>
        <p className="mt-1 text-base-200">{joinResults[joinType].desc}</p>
      </div>
    </div>
  );
}
