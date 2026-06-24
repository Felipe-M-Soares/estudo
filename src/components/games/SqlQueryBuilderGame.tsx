import { useState } from 'react';

interface SqlChallenge {
  scenario: string;
  table: string;
  columns: string[];
  sampleRows: Record<string, string | number>[];
  targetClauses: string[]; // ex: ['SELECT nome', 'FROM clientes', 'WHERE idade > 18']
  explanation: string;
}

const challenges: SqlChallenge[] = [
  {
    scenario: 'Liste o nome de todos os clientes maiores de idade.',
    table: 'clientes',
    columns: ['id', 'nome', 'idade'],
    sampleRows: [
      { id: 1, nome: 'Ana', idade: 17 },
      { id: 2, nome: 'Bruno', idade: 25 },
      { id: 3, nome: 'Carla', idade: 19 },
    ],
    targetClauses: ['SELECT nome', 'FROM clientes', 'WHERE idade >= 18'],
    explanation: 'WHERE filtra linhas antes de retornar — só clientes com idade >= 18 aparecem no resultado.',
  },
  {
    scenario: 'Conte quantos pedidos cada cliente fez.',
    table: 'pedidos',
    columns: ['id', 'cliente_id', 'valor'],
    sampleRows: [
      { id: 1, cliente_id: 1, valor: 50 },
      { id: 2, cliente_id: 1, valor: 30 },
      { id: 3, cliente_id: 2, valor: 80 },
    ],
    targetClauses: ['SELECT cliente_id, COUNT(*)', 'FROM pedidos', 'GROUP BY cliente_id'],
    explanation: 'GROUP BY agrupa linhas com o mesmo cliente_id, e COUNT(*) conta quantas linhas existem em cada grupo.',
  },
];

const optionPool = [
  'SELECT nome',
  'SELECT *',
  'SELECT cliente_id, COUNT(*)',
  'FROM clientes',
  'FROM pedidos',
  'WHERE idade >= 18',
  'WHERE idade > 0',
  'GROUP BY cliente_id',
  'ORDER BY nome',
];

interface SqlQueryBuilderGameProps {
  onComplete: (score: number) => void;
}

export function SqlQueryBuilderGame({ onComplete }: SqlQueryBuilderGameProps) {
  const [idx, setIdx] = useState(0);
  const [built, setBuilt] = useState<string[]>([]);
  const [solved, setSolved] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const challenge = challenges[idx];

  function addClause(clause: string) {
    if (built.includes(clause)) return;
    setBuilt((b) => [...b, clause]);
  }

  function removeClause(clause: string) {
    setBuilt((b) => b.filter((c) => c !== clause));
  }

  function check() {
    const correct =
      built.length === challenge.targetClauses.length &&
      challenge.targetClauses.every((c) => built.includes(c));

    if (correct) {
      setFeedback('correct');
      const newSolved = solved + 1;
      setSolved(newSolved);
      setTimeout(() => {
        if (idx + 1 < challenges.length) {
          setIdx((i) => i + 1);
          setBuilt([]);
          setFeedback(null);
        } else {
          onComplete(Math.round((newSolved / challenges.length) * 100));
        }
      }, 1400);
    } else {
      setFeedback('wrong');
    }
  }

  return (
    <div className="rounded-2xl border border-base-700 bg-base-850 p-5">
      <h3 className="font-display text-base font-bold text-base-50">🗃️ Construtor de Queries</h3>
      <p className="mt-1 text-xs text-amber-300">{challenge.scenario}</p>

      <div className="mt-3 overflow-x-auto rounded-xl border border-base-700">
        <table className="w-full text-left text-xs">
          <thead className="bg-base-800 text-base-300">
            <tr>
              {challenge.columns.map((c) => (
                <th key={c} className="px-3 py-2 font-mono">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {challenge.sampleRows.map((row, i) => (
              <tr key={i} className="border-t border-base-700 text-base-200">
                {challenge.columns.map((c) => (
                  <td key={c} className="px-3 py-2 font-mono">{row[c]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 min-h-[52px] rounded-xl border border-base-700 bg-base-900 p-3">
        {built.length === 0 ? (
          <span className="font-mono text-xs text-base-500">Clique nas cláusulas abaixo para montar a query...</span>
        ) : (
          <code className="font-mono text-sm text-mint-200">
            {built.join(' ')}
            <span className="text-base-500">;</span>
          </code>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {optionPool.map((opt) => (
          <button
            key={opt}
            onClick={() => (built.includes(opt) ? removeClause(opt) : addClause(opt))}
            className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors ${
              built.includes(opt)
                ? 'border-mint-400/60 bg-mint-900/30 text-mint-200'
                : 'border-base-600 text-base-200 hover:border-base-500 hover:bg-base-800'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <button onClick={check} disabled={built.length === 0} className="mt-4 rounded-lg bg-mint-400 px-4 py-2 text-sm font-semibold text-base-950 disabled:opacity-40">
        Executar query
      </button>

      {feedback === 'correct' && (
        <div className="mt-3 rounded-xl border border-mint-400/30 bg-mint-900/20 p-3 text-sm text-mint-200">
          ✅ Query correta! {challenge.explanation}
        </div>
      )}
      {feedback === 'wrong' && (
        <p className="mt-3 text-sm font-semibold text-ember-400">❌ Essa combinação de cláusulas não resolve o pedido. Revise e tente novamente.</p>
      )}
    </div>
  );
}
