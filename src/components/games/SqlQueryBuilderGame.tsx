import { useState } from 'react';

interface SqlChallenge {
  scenario: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  columns: string[];
  sampleRows: Record<string, string | number>[];
  optionPool: string[];
  targetClauses: string[];
  explanation: string;
}

const challenges: SqlChallenge[] = [
  {
    scenario: 'Liste o nome de todos os clientes maiores de idade.',
    difficulty: 'Fácil',
    columns: ['id', 'nome', 'idade'],
    sampleRows: [
      { id: 1, nome: 'Ana', idade: 17 },
      { id: 2, nome: 'Bruno', idade: 25 },
      { id: 3, nome: 'Carla', idade: 19 },
    ],
    optionPool: ['SELECT nome', 'SELECT *', 'FROM clientes', 'WHERE idade >= 18', 'WHERE idade > 0'],
    targetClauses: ['SELECT nome', 'FROM clientes', 'WHERE idade >= 18'],
    explanation: 'WHERE filtra linhas antes de retornar — só clientes com idade >= 18 aparecem no resultado.',
  },
  {
    scenario: 'Liste os produtos com preço acima de 100, do mais caro para o mais barato.',
    difficulty: 'Fácil',
    columns: ['id', 'nome', 'preco'],
    sampleRows: [
      { id: 1, nome: 'Teclado', preco: 150 },
      { id: 2, nome: 'Mouse', preco: 80 },
      { id: 3, nome: 'Monitor', preco: 900 },
    ],
    optionPool: ['SELECT nome', 'FROM produtos', 'WHERE preco > 100', 'ORDER BY preco DESC', 'ORDER BY preco ASC'],
    targetClauses: ['SELECT nome', 'FROM produtos', 'WHERE preco > 100', 'ORDER BY preco DESC'],
    explanation: 'ORDER BY preco DESC ordena do maior para o menor valor — DESC é "descendente".',
  },
  {
    scenario: 'Conte quantos pedidos cada cliente fez.',
    difficulty: 'Médio',
    columns: ['id', 'cliente_id', 'valor'],
    sampleRows: [
      { id: 1, cliente_id: 1, valor: 50 },
      { id: 2, cliente_id: 1, valor: 30 },
      { id: 3, cliente_id: 2, valor: 80 },
    ],
    optionPool: ['SELECT cliente_id, COUNT(*)', 'SELECT *', 'FROM pedidos', 'GROUP BY cliente_id', 'ORDER BY cliente_id'],
    targetClauses: ['SELECT cliente_id, COUNT(*)', 'FROM pedidos', 'GROUP BY cliente_id'],
    explanation: 'GROUP BY agrupa linhas com o mesmo cliente_id, e COUNT(*) conta quantas linhas existem em cada grupo.',
  },
  {
    scenario: 'Liste o nome do cliente junto com o valor de cada pedido que ele fez.',
    difficulty: 'Médio',
    columns: ['pedido_id', 'cliente_nome', 'valor'],
    sampleRows: [
      { pedido_id: 1, cliente_nome: 'Ana', valor: 50 },
      { pedido_id: 2, cliente_nome: 'Bruno', valor: 80 },
    ],
    optionPool: ['SELECT clientes.nome, pedidos.valor', 'SELECT *', 'FROM pedidos', 'JOIN clientes ON pedidos.cliente_id = clientes.id', 'WHERE valor > 0'],
    targetClauses: ['SELECT clientes.nome, pedidos.valor', 'FROM pedidos', 'JOIN clientes ON pedidos.cliente_id = clientes.id'],
    explanation: 'JOIN combina linhas das duas tabelas onde a condição em ON é verdadeira — aqui, ligando cada pedido ao seu respectivo cliente.',
  },
  {
    scenario: 'Liste todos os clientes que NUNCA fizeram nenhum pedido.',
    difficulty: 'Difícil',
    columns: ['nome'],
    sampleRows: [{ nome: 'Daniela' }],
    optionPool: [
      'SELECT clientes.nome',
      'FROM clientes',
      'JOIN pedidos ON pedidos.cliente_id = clientes.id',
      'LEFT JOIN pedidos ON pedidos.cliente_id = clientes.id',
      'WHERE pedidos.id IS NULL',
    ],
    targetClauses: ['SELECT clientes.nome', 'FROM clientes', 'LEFT JOIN pedidos ON pedidos.cliente_id = clientes.id', 'WHERE pedidos.id IS NULL'],
    explanation: 'LEFT JOIN mantém todos os clientes mesmo sem pedido (preenchendo com NULL), e WHERE pedidos.id IS NULL filtra exatamente quem não tem nenhuma correspondência.',
  },
];

const difficultyColor: Record<SqlChallenge['difficulty'], string> = {
  Fácil: 'text-mint-400 bg-mint-900/30',
  Médio: 'text-amber-400 bg-amber-500/15',
  Difícil: 'text-ember-400 bg-ember-500/15',
};

interface SqlQueryBuilderGameProps {
  onComplete: (score: number) => void;
}

export function SqlQueryBuilderGame({ onComplete }: SqlQueryBuilderGameProps) {
  const [idx, setIdx] = useState(0);
  const [built, setBuilt] = useState<string[]>([]);
  const [solved, setSolved] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [finished, setFinished] = useState(false);

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
          setFinished(true);
          onComplete(Math.round((newSolved / challenges.length) * 100));
        }
      }, 1600);
    } else {
      setFeedback('wrong');
    }
  }

  function restart() {
    setIdx(0);
    setBuilt([]);
    setSolved(0);
    setFeedback(null);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="rounded-2xl card-surface p-6 text-center">
        <div className="text-3xl">🗃️</div>
        <h3 className="mt-2 font-display text-lg font-bold text-base-50">{solved}/{challenges.length} queries corretas</h3>
        <p className="mt-1 text-sm text-base-400">Do SELECT básico até LEFT JOIN — você passou por todos os níveis.</p>
        <button onClick={restart} className="mt-4 rounded-lg border border-base-600 px-4 py-2 text-sm text-base-200 hover:bg-base-800">
          Jogar de novo
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl card-surface p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-base font-bold text-base-50">🗃️ Construtor de Queries</h3>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${difficultyColor[challenge.difficulty]}`}>
          {challenge.difficulty}
        </span>
      </div>
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
        {challenge.optionPool.map((opt) => (
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
