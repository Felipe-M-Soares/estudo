import { useMemo, useState } from 'react';
import {
  Plus, Trash2, Play, RotateCcw, Table2, Link2, Repeat2, Gauge, FileJson, Database,
} from 'lucide-react';

interface UserRow {
  id: number;
  nome: string;
  idade: number;
  cidade: string;
}

interface OrderRow {
  id: number;
  userId: number;
  produto: string;
  valor: number;
}

const INITIAL_USERS: UserRow[] = [
  { id: 1, nome: 'Ana', idade: 28, cidade: 'São Paulo' },
  { id: 2, nome: 'Bruno', idade: 34, cidade: 'Rio de Janeiro' },
  { id: 3, nome: 'Carla', idade: 22, cidade: 'São Paulo' },
  { id: 4, nome: 'Diego', idade: 41, cidade: 'Belo Horizonte' },
];

const INITIAL_ORDERS: OrderRow[] = [
  { id: 1, userId: 1, produto: 'Teclado mecânico', valor: 350 },
  { id: 2, userId: 1, produto: 'Mouse', valor: 90 },
  { id: 3, userId: 2, produto: 'Monitor 27"', valor: 1200 },
  { id: 4, userId: 3, produto: 'Headset', valor: 220 },
  { id: 5, userId: 4, produto: 'Cadeira gamer', valor: 890 },
];

type Tab = 'usuarios' | 'join' | 'transacoes' | 'indices' | 'nosql';

const TABS: { id: Tab; label: string; icon: typeof Table2 }[] = [
  { id: 'usuarios', label: 'Tabela usuarios', icon: Table2 },
  { id: 'join', label: 'JOIN com pedidos', icon: Link2 },
  { id: 'transacoes', label: 'Transações', icon: Repeat2 },
  { id: 'indices', label: 'Índices', icon: Gauge },
  { id: 'nosql', label: 'MongoDB & Redis', icon: FileJson },
];

// ---------- SQL básico ----------

type UserPreset = { label: string; sql: string; run: (rows: UserRow[]) => UserRow[] };

const USER_PRESETS: UserPreset[] = [
  { label: 'SELECT * (todos)', sql: 'SELECT * FROM usuarios;', run: (rows) => rows },
  { label: 'WHERE idade > 25', sql: 'SELECT * FROM usuarios WHERE idade > 25;', run: (rows) => rows.filter((r) => r.idade > 25) },
  {
    label: "WHERE cidade = 'São Paulo'",
    sql: "SELECT * FROM usuarios WHERE cidade = 'São Paulo';",
    run: (rows) => rows.filter((r) => r.cidade === 'São Paulo'),
  },
  { label: 'ORDER BY idade', sql: 'SELECT * FROM usuarios ORDER BY idade ASC;', run: (rows) => [...rows].sort((a, b) => a.idade - b.idade) },
  {
    label: 'ORDER BY idade DESC LIMIT 2',
    sql: 'SELECT * FROM usuarios ORDER BY idade DESC LIMIT 2;',
    run: (rows) => [...rows].sort((a, b) => b.idade - a.idade).slice(0, 2),
  },
];

interface GroupResult {
  cidade: string;
  total: number;
  idadeMedia: number;
}

function groupByCidade(rows: UserRow[]): GroupResult[] {
  const map = new Map<string, UserRow[]>();
  for (const r of rows) map.set(r.cidade, [...(map.get(r.cidade) ?? []), r]);
  return Array.from(map.entries()).map(([cidade, group]) => ({
    cidade,
    total: group.length,
    idadeMedia: Math.round((group.reduce((acc, g) => acc + g.idade, 0) / group.length) * 10) / 10,
  }));
}

interface JoinedRow {
  userNome: string;
  produto: string;
  valor: number;
}

function innerJoin(users: UserRow[], orders: OrderRow[]): JoinedRow[] {
  return orders
    .map((o) => {
      const u = users.find((u) => u.id === o.userId);
      return u ? { userNome: u.nome, produto: o.produto, valor: o.valor } : null;
    })
    .filter((r): r is JoinedRow => r !== null);
}

// ---------- Transações ----------

interface Account {
  nome: string;
  saldo: number;
}

const INITIAL_ACCOUNTS: Account[] = [
  { nome: 'Conta de Ana', saldo: 500 },
  { nome: 'Conta de Bruno', saldo: 200 },
];

type TxLogLine = { type: 'info' | 'success' | 'error'; text: string };

// ---------- Índices ----------

function generateBigTable(size: number): { id: number; email: string }[] {
  const rows: { id: number; email: string }[] = [];
  for (let i = 1; i <= size; i++) {
    rows.push({ id: i, email: `usuario${i}@exemplo.com` });
  }
  return rows;
}

const BIG_TABLE = generateBigTable(5000);

function searchWithoutIndex(table: { id: number; email: string }[], email: string): { found: boolean; comparisons: number } {
  let comparisons = 0;
  for (const row of table) {
    comparisons++;
    if (row.email === email) return { found: true, comparisons };
  }
  return { found: false, comparisons };
}

function searchWithIndex(indexMap: Map<string, number>, email: string): { found: boolean; comparisons: number } {
  // Índice = busca direta (hash/B-tree), custo praticamente constante — simulamos com 1-3 "comparações".
  const found = indexMap.has(email);
  return { found, comparisons: found ? 1 : 2 };
}

const INDEX_MAP = new Map(BIG_TABLE.map((r) => [r.email, r.id]));

// ---------- NoSQL: MongoDB ----------

interface MongoDoc {
  _id: string;
  nome: string;
  contato: { email: string; telefone?: string };
  tags: string[];
}

const MONGO_DOCS: MongoDoc[] = [
  { _id: 'a1', nome: 'Ana', contato: { email: 'ana@exemplo.com', telefone: '11999990000' }, tags: ['vip', 'frontend'] },
  { _id: 'b2', nome: 'Bruno', contato: { email: 'bruno@exemplo.com' }, tags: ['backend'] },
];

// ---------- NoSQL: Redis cache ----------

interface CacheEntry {
  value: string;
  expiresAt: number;
}

export function DataLab() {
  const [tab, setTab] = useState<Tab>('usuarios');

  // usuarios / join state
  const [users, setUsers] = useState<UserRow[]>(INITIAL_USERS);
  const [orders] = useState<OrderRow[]>(INITIAL_ORDERS);
  const [activePreset, setActivePreset] = useState(0);
  const [grouped, setGrouped] = useState(false);
  const [newRow, setNewRow] = useState({ nome: '', idade: '', cidade: '' });

  const filteredUsers = useMemo(() => USER_PRESETS[activePreset].run(users), [activePreset, users]);
  const groupResult = useMemo(() => groupByCidade(users), [users]);
  const joinedRows = useMemo(() => innerJoin(users, orders), [users, orders]);

  function runQuery(idx: number) {
    setActivePreset(idx);
    setGrouped(false);
  }

  function addRow() {
    if (!newRow.nome.trim()) return;
    const nextId = Math.max(0, ...users.map((r) => r.id)) + 1;
    const row: UserRow = { id: nextId, nome: newRow.nome, idade: Number(newRow.idade) || 0, cidade: newRow.cidade || 'Sem cidade' };
    setUsers((prev) => [...prev, row]);
    setNewRow({ nome: '', idade: '', cidade: '' });
  }

  function deleteRow(id: number) {
    setUsers((prev) => prev.filter((r) => r.id !== id));
  }

  function resetUsers() {
    setUsers(INITIAL_USERS);
    setActivePreset(0);
    setGrouped(false);
  }

  // ---------- Transações ----------
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [txAmount, setTxAmount] = useState(100);
  const [txLog, setTxLog] = useState<TxLogLine[]>([]);
  const [simulateCrash, setSimulateCrash] = useState(false);

  function runTransaction(withCommit: boolean) {
    const log: TxLogLine[] = [];
    log.push({ type: 'info', text: 'BEGIN TRANSACTION;' });

    const origem = accounts[0];
    const destino = accounts[1];

    if (origem.saldo < txAmount) {
      log.push({ type: 'error', text: `Saldo insuficiente em "${origem.nome}" — ROLLBACK automático, nada é alterado.` });
      setTxLog(log);
      return;
    }

    log.push({ type: 'info', text: `UPDATE contas SET saldo = saldo - ${txAmount} WHERE nome = '${origem.nome}';  -- ainda não confirmado` });
    log.push({ type: 'info', text: `UPDATE contas SET saldo = saldo + ${txAmount} WHERE nome = '${destino.nome}';  -- ainda não confirmado` });

    if (simulateCrash) {
      log.push({ type: 'error', text: '💥 Falha simulada no meio da operação (queda de conexão, erro de rede...)' });
      log.push({ type: 'error', text: 'ROLLBACK automático — como nada foi COMMITado, as duas atualizações são desfeitas. Os saldos continuam exatamente como antes.' });
      setTxLog(log);
      return;
    }

    if (!withCommit) {
      log.push({ type: 'error', text: 'Você esqueceu o COMMIT — a transação fica pendente e, ao fim da sessão, normalmente sofre ROLLBACK. Nada vira permanente.' });
      setTxLog(log);
      return;
    }

    log.push({ type: 'success', text: 'COMMIT;' });
    log.push({ type: 'success', text: 'As duas atualizações foram confirmadas juntas — ou as duas acontecem, ou nenhuma (atomicidade).' });
    setAccounts([
      { ...origem, saldo: origem.saldo - txAmount },
      { ...destino, saldo: destino.saldo + txAmount },
    ]);
    setTxLog(log);
  }

  function resetTx() {
    setAccounts(INITIAL_ACCOUNTS);
    setTxLog([]);
    setSimulateCrash(false);
  }

  // ---------- Índices ----------
  const [searchEmail, setSearchEmail] = useState('usuario4999@exemplo.com');
  const [indexResult, setIndexResult] = useState<{ withIdx: ReturnType<typeof searchWithIndex>; withoutIdx: ReturnType<typeof searchWithoutIndex> } | null>(null);

  function runIndexSearch() {
    setIndexResult({
      withIdx: searchWithIndex(INDEX_MAP, searchEmail),
      withoutIdx: searchWithoutIndex(BIG_TABLE, searchEmail),
    });
  }

  // ---------- NoSQL ----------
  const [mongoFilter, setMongoFilter] = useState('vip');
  const filteredMongo = useMemo(() => MONGO_DOCS.filter((d) => d.tags.includes(mongoFilter)), [mongoFilter]);

  const [cache, setCache] = useState<Record<string, CacheEntry>>({});
  const [cacheKey] = useState('produto:42');
  const [cacheLog, setCacheLog] = useState<TxLogLine[]>([]);
  const [now, setNow] = useState(Date.now());

  function refreshNow() {
    setNow(Date.now());
  }

  function cacheRead() {
    refreshNow();
    const entry = cache[cacheKey];
    if (entry && entry.expiresAt > Date.now()) {
      setCacheLog((prev) => [...prev, { type: 'success', text: `🟢 Cache HIT — "${cacheKey}" encontrado no Redis, sem consultar o banco. Resposta quase instantânea.` }]);
    } else {
      setCacheLog((prev) => [
        ...prev,
        { type: 'error', text: `🔴 Cache MISS — "${cacheKey}" não está no Redis (ou expirou). Precisa consultar o banco de verdade (mais lento)...` },
        { type: 'info', text: 'SELECT * FROM produtos WHERE id = 42;  (consulta "lenta" simulada)' },
      ]);
      const ttlMs = 5000;
      setCache((prev) => ({ ...prev, [cacheKey]: { value: 'Teclado mecânico — R$ 350', expiresAt: Date.now() + ttlMs } }));
      setCacheLog((prev) => [...prev, { type: 'success', text: 'Resultado salvo no Redis com TTL de 5 segundos (SETEX).' }]);
    }
  }

  function resetCache() {
    setCache({});
    setCacheLog([]);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 px-4 py-2.5 text-sm text-base-200">
        🗄️ Tabelas, transações, índices e bancos NoSQL — tudo simulado só na memória do navegador. Explore cada aba pra ver um
        conceito diferente do módulo de SQL e dos módulos de MongoDB/Redis.
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
                active ? 'border-base-400/60 bg-base-800 text-base-50' : 'border-base-700 text-base-300 hover:bg-base-800'
              }`}
            >
              <Icon size={13} className={active ? 'text-cyan-300' : 'text-base-500'} />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'usuarios' && (
        <>
          <div className="rounded-xl border border-base-700 bg-base-900/60 p-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-base-400">Tabela "usuarios" — adicione uma linha</p>
            <div className="flex flex-wrap gap-1.5">
              <input
                value={newRow.nome}
                onChange={(e) => setNewRow((p) => ({ ...p, nome: e.target.value }))}
                placeholder="nome"
                className="w-28 rounded-lg border border-base-600 bg-base-800 px-2.5 py-1.5 text-xs text-base-100 outline-none focus:border-cyan-400"
              />
              <input
                value={newRow.idade}
                onChange={(e) => setNewRow((p) => ({ ...p, idade: e.target.value }))}
                placeholder="idade"
                type="number"
                className="w-20 rounded-lg border border-base-600 bg-base-800 px-2.5 py-1.5 text-xs text-base-100 outline-none focus:border-cyan-400"
              />
              <input
                value={newRow.cidade}
                onChange={(e) => setNewRow((p) => ({ ...p, cidade: e.target.value }))}
                placeholder="cidade"
                className="w-32 rounded-lg border border-base-600 bg-base-800 px-2.5 py-1.5 text-xs text-base-100 outline-none focus:border-cyan-400"
              />
              <button onClick={addRow} className="flex items-center gap-1 rounded-lg bg-mint-400 px-3 py-1.5 text-xs font-bold text-base-950">
                <Plus size={12} /> Adicionar
              </button>
              <button onClick={resetUsers} className="flex items-center gap-1 rounded-lg border border-base-600 px-3 py-1.5 text-xs text-base-300 hover:bg-base-800">
                <RotateCcw size={12} /> Resetar
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <span className="self-center text-xs text-base-400">Rodar:</span>
            {USER_PRESETS.map((p, idx) => (
              <button
                key={p.label}
                onClick={() => runQuery(idx)}
                className={`flex items-center gap-1 rounded-full px-3 py-1 font-mono text-xs ${
                  !grouped && activePreset === idx ? 'bg-cyan-400 text-base-950' : 'border border-base-600 text-base-300 hover:bg-base-800'
                }`}
              >
                <Play size={10} /> {p.label}
              </button>
            ))}
            <button
              onClick={() => setGrouped(true)}
              className={`flex items-center gap-1 rounded-full px-3 py-1 font-mono text-xs ${
                grouped ? 'bg-mint-400 text-base-950' : 'border border-base-600 text-base-300 hover:bg-base-800'
              }`}
            >
              <Play size={10} /> GROUP BY cidade
            </button>
          </div>

          <pre className="overflow-x-auto rounded-lg bg-base-950/80 p-2.5 font-mono text-[11.5px] text-mint-200">
            {grouped ? 'SELECT cidade, COUNT(*) AS total, AVG(idade) AS idade_media\nFROM usuarios\nGROUP BY cidade;' : USER_PRESETS[activePreset].sql}
          </pre>

          {!grouped && (
            <div className="overflow-x-auto rounded-xl border border-base-700 bg-base-950/60">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-base-700 text-[11px] uppercase text-base-400">
                    <th className="px-3 py-2">id</th>
                    <th className="px-3 py-2">nome</th>
                    <th className="px-3 py-2">idade</th>
                    <th className="px-3 py-2">cidade</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((r) => (
                    <tr key={r.id} className="border-b border-base-800 text-base-100">
                      <td className="px-3 py-2 font-mono text-base-500">{r.id}</td>
                      <td className="px-3 py-2">{r.nome}</td>
                      <td className="px-3 py-2 font-mono">{r.idade}</td>
                      <td className="px-3 py-2">{r.cidade}</td>
                      <td className="px-3 py-2 text-right">
                        <button onClick={() => deleteRow(r.id)} className="text-base-500 hover:text-ember-400">
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-center text-xs text-base-500">
                        Nenhuma linha corresponde a esse filtro.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {grouped && (
            <div className="overflow-x-auto rounded-xl border border-base-700 bg-base-950/60">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-base-700 text-[11px] uppercase text-base-400">
                    <th className="px-3 py-2">cidade</th>
                    <th className="px-3 py-2">total</th>
                    <th className="px-3 py-2">idade média</th>
                  </tr>
                </thead>
                <tbody>
                  {groupResult.map((g) => (
                    <tr key={g.cidade} className="border-b border-base-800 text-base-100">
                      <td className="px-3 py-2">{g.cidade}</td>
                      <td className="px-3 py-2 font-mono text-mint-300">{g.total}</td>
                      <td className="px-3 py-2 font-mono">{g.idadeMedia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-[11px] text-base-500">
            {grouped ? `${groupResult.length} grupo(s)` : `${filteredUsers.length} de ${users.length} linha(s) — resultado de "${USER_PRESETS[activePreset].label}"`}
          </p>
        </>
      )}

      {tab === 'join' && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="overflow-x-auto rounded-xl border border-base-700 bg-base-950/60">
              <p className="border-b border-base-700 px-3 py-1.5 text-[11px] font-semibold uppercase text-base-400">usuarios</p>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] uppercase text-base-500">
                    <th className="px-3 py-1.5">id</th>
                    <th className="px-3 py-1.5">nome</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t border-base-800 text-base-200">
                      <td className="px-3 py-1.5 font-mono text-base-500">{u.id}</td>
                      <td className="px-3 py-1.5">{u.nome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto rounded-xl border border-base-700 bg-base-950/60">
              <p className="border-b border-base-700 px-3 py-1.5 text-[11px] font-semibold uppercase text-base-400">pedidos</p>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] uppercase text-base-500">
                    <th className="px-3 py-1.5">userId</th>
                    <th className="px-3 py-1.5">produto</th>
                    <th className="px-3 py-1.5">valor</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-t border-base-800 text-base-200">
                      <td className="px-3 py-1.5 font-mono text-base-500">{o.userId}</td>
                      <td className="px-3 py-1.5">{o.produto}</td>
                      <td className="px-3 py-1.5 font-mono">R$ {o.valor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <pre className="overflow-x-auto rounded-lg bg-base-950/80 p-2.5 font-mono text-[11.5px] text-mint-200">
            {`SELECT usuarios.nome, pedidos.produto, pedidos.valor\nFROM pedidos\nJOIN usuarios ON pedidos."userId" = usuarios.id;`}
          </pre>

          <div className="overflow-x-auto rounded-xl border border-base-700 bg-base-950/60">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-base-700 text-[11px] uppercase text-base-400">
                  <th className="px-3 py-2">nome</th>
                  <th className="px-3 py-2">produto</th>
                  <th className="px-3 py-2">valor</th>
                </tr>
              </thead>
              <tbody>
                {joinedRows.map((r, i) => (
                  <tr key={i} className="border-b border-base-800 text-base-100">
                    <td className="px-3 py-2">{r.userNome}</td>
                    <td className="px-3 py-2">{r.produto}</td>
                    <td className="px-3 py-2 font-mono text-mint-300">R$ {r.valor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-base-500">
            💡 Apague o usuário "Diego" na aba "Tabela usuarios" e volte aqui — o pedido dele desaparece do resultado do JOIN, porque não
            há mais um usuário correspondente pra combinar.
          </p>
        </>
      )}

      {tab === 'transacoes' && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {accounts.map((acc) => (
              <div key={acc.nome} className="rounded-xl border border-base-700 bg-base-900/60 p-4 text-center">
                <p className="text-xs text-base-400">{acc.nome}</p>
                <p className="mt-1 font-mono text-2xl font-bold text-mint-300">R$ {acc.saldo}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-base-700 bg-base-900/60 p-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-base-400">Transferir de "{accounts[0].nome}" para "{accounts[1].nome}"</p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="number"
                value={txAmount}
                onChange={(e) => setTxAmount(Number(e.target.value))}
                className="w-28 rounded-lg border border-base-600 bg-base-800 px-2.5 py-1.5 text-sm text-base-100 outline-none focus:border-cyan-400"
              />
              <label className="flex items-center gap-1.5 text-[11px] text-base-400">
                <input type="checkbox" checked={simulateCrash} onChange={(e) => setSimulateCrash(e.target.checked)} className="accent-ember-400" />
                Simular falha no meio da transação
              </label>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button onClick={() => runTransaction(true)} className="rounded-lg bg-mint-400 px-3 py-1.5 text-xs font-bold text-base-950">
                Rodar com COMMIT
              </button>
              <button onClick={() => runTransaction(false)} className="rounded-lg border border-base-600 px-3 py-1.5 text-xs text-base-200 hover:bg-base-800">
                Rodar sem COMMIT
              </button>
              <button onClick={resetTx} className="flex items-center gap-1 rounded-lg border border-base-600 px-3 py-1.5 text-xs text-base-300 hover:bg-base-800">
                <RotateCcw size={12} /> Resetar contas
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-base-700 bg-base-950 p-3 font-mono text-[12px]" style={{ minHeight: '120px' }}>
            {txLog.length === 0 && <p className="text-base-600">Rode uma transferência para ver o log da transação aqui.</p>}
            {txLog.map((l, i) => (
              <div key={i} className={l.type === 'error' ? 'text-ember-400' : l.type === 'success' ? 'text-mint-300' : 'text-base-300'}>
                {l.text}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-base-500">
            💡 Marque "simular falha" e rode com COMMIT — note que, mesmo com a operação interrompida no meio, nenhuma conta fica com
            valor errado. É isso que uma transação garante: tudo ou nada.
          </p>
        </>
      )}

      {tab === 'indices' && (
        <>
          <div className="rounded-xl border border-base-700 bg-base-900/60 p-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-base-400">
              Tabela simulada com {BIG_TABLE.length.toLocaleString('pt-BR')} linhas — busque por um email
            </p>
            <div className="flex flex-wrap gap-1.5">
              <input
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="min-w-[220px] flex-1 rounded-lg border border-base-600 bg-base-800 px-2.5 py-1.5 font-mono text-xs text-base-100 outline-none focus:border-cyan-400"
              />
              <button onClick={runIndexSearch} className="flex items-center gap-1 rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-bold text-base-950">
                <Play size={12} /> Buscar
              </button>
            </div>
            <p className="mt-2 text-[11px] text-base-500">Dica: tente "usuario1@exemplo.com" (perto do início) vs "usuario4999@exemplo.com" (perto do fim).</p>
          </div>

          {indexResult && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-ember-400/30 bg-ember-500/5 p-4">
                <p className="text-[11px] font-semibold uppercase text-ember-300">SEM índice (table scan)</p>
                <p className="mt-1 text-[12px] text-base-300">Percorre linha por linha até achar.</p>
                <p className="mt-2 font-mono text-xl font-bold text-ember-300">{indexResult.withoutIdx.comparisons.toLocaleString('pt-BR')}</p>
                <p className="text-[11px] text-base-500">comparações feitas</p>
              </div>
              <div className="rounded-xl border border-mint-400/30 bg-mint-900/10 p-4">
                <p className="text-[11px] font-semibold uppercase text-mint-300">COM índice (B-tree/hash)</p>
                <p className="mt-1 text-[12px] text-base-300">Vai direto ao ponto, sem varrer tudo.</p>
                <p className="mt-2 font-mono text-xl font-bold text-mint-300">{indexResult.withIdx.comparisons.toLocaleString('pt-BR')}</p>
                <p className="text-[11px] text-base-500">comparações feitas</p>
              </div>
            </div>
          )}
          <p className="text-[11px] text-base-500">
            💡 Quanto mais perto do fim da tabela o registro estiver, mais a busca sem índice sofre — o índice continua praticamente
            instantâneo independente de onde o dado está. É por isso que <code className="text-mint-300">CREATE INDEX</code> em colunas
            muito buscadas faz tanta diferença em tabelas grandes.
          </p>
        </>
      )}

      {tab === 'nosql' && (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-base-700 bg-base-900/60 p-4">
              <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-base-400">
                <Database size={13} className="text-mint-300" /> MongoDB — documentos, não tabelas
              </p>
              <div className="space-y-2">
                {MONGO_DOCS.map((d) => (
                  <pre key={d._id} className="overflow-x-auto rounded-lg bg-base-950 p-2.5 font-mono text-[11px] text-mint-200">
                    {JSON.stringify(d, null, 2)}
                  </pre>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-base-500">
                💡 Note que "Bruno" não tem telefone — em MongoDB, documentos da mesma coleção podem ter formatos um pouco diferentes,
                sem precisar de uma coluna obrigatória "telefone" vazia pra todo mundo, como aconteceria numa tabela SQL.
              </p>

              <p className="mt-4 mb-1.5 text-[11px] font-semibold uppercase text-base-400">db.usuarios.find({`{ tags: "..." }`})</p>
              <div className="flex flex-wrap gap-1.5">
                {['vip', 'frontend', 'backend'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setMongoFilter(tag)}
                    className={`rounded-full border px-3 py-1 font-mono text-xs ${mongoFilter === tag ? 'border-mint-400/60 bg-mint-400/10 text-base-50' : 'border-base-600 text-base-300 hover:bg-base-800'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="mt-2 space-y-1">
                {filteredMongo.map((d) => (
                  <p key={d._id} className="rounded-lg bg-base-800/60 px-2.5 py-1.5 text-xs text-base-100">{d.nome}</p>
                ))}
                {filteredMongo.length === 0 && <p className="text-xs text-base-500">Nenhum documento com essa tag.</p>}
              </div>
            </div>

            <div className="rounded-xl border border-base-700 bg-base-900/60 p-4">
              <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-base-400">
                <Gauge size={13} className="text-amber-300" /> Redis — cache com expiração (TTL)
              </p>
              <p className="text-[12px] text-base-300">
                Clique em "Buscar produto" algumas vezes seguidas: a primeira vez é um MISS (vai ao banco "lento"); as próximas, por
                até 5 segundos, são HIT (vêm do Redis, quase instantâneo). Depois de 5s sem buscar, o cache expira e o ciclo recomeça.
              </p>
              <div className="mt-3 flex gap-2">
                <button onClick={cacheRead} className="rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-base-950">
                  Buscar produto #42
                </button>
                <button onClick={resetCache} className="flex items-center gap-1 rounded-lg border border-base-600 px-3 py-1.5 text-xs text-base-300 hover:bg-base-800">
                  <RotateCcw size={12} /> Resetar cache
                </button>
              </div>
              <div className="mt-3 rounded-xl border border-base-700 bg-base-950 p-3 font-mono text-[11.5px]" style={{ minHeight: '160px', maxHeight: '200px', overflowY: 'auto' }}>
                {cacheLog.length === 0 && <p className="text-base-600">O log de cache aparece aqui.</p>}
                {cacheLog.map((l, i) => (
                  <div key={i} className={l.type === 'error' ? 'text-ember-400' : l.type === 'success' ? 'text-mint-300' : 'text-base-400'}>
                    {l.text}
                  </div>
                ))}
              </div>
              {cache[cacheKey] && (
                <p className="mt-2 text-[11px] text-base-500">
                  Expira em: {Math.max(0, Math.round((cache[cacheKey].expiresAt - now) / 1000))}s{' '}
                  <button onClick={refreshNow} className="ml-1 underline">atualizar</button>
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
