import { useMemo, useState } from 'react';
import { Plus, Trash2, Play, RotateCcw, Table2, Link2 } from 'lucide-react';

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

type Tab = 'usuarios' | 'join';

type UserPreset = { label: string; sql: string; run: (rows: UserRow[]) => UserRow[] };

const USER_PRESETS: UserPreset[] = [
  { label: 'SELECT * (todos)', sql: 'SELECT * FROM usuarios;', run: (rows) => rows },
  {
    label: 'WHERE idade > 25',
    sql: 'SELECT * FROM usuarios WHERE idade > 25;',
    run: (rows) => rows.filter((r) => r.idade > 25),
  },
  {
    label: "WHERE cidade = 'São Paulo'",
    sql: "SELECT * FROM usuarios WHERE cidade = 'São Paulo';",
    run: (rows) => rows.filter((r) => r.cidade === 'São Paulo'),
  },
  {
    label: 'ORDER BY idade',
    sql: 'SELECT * FROM usuarios ORDER BY idade ASC;',
    run: (rows) => [...rows].sort((a, b) => a.idade - b.idade),
  },
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
  for (const r of rows) {
    map.set(r.cidade, [...(map.get(r.cidade) ?? []), r]);
  }
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

export function DataLab() {
  const [tab, setTab] = useState<Tab>('usuarios');
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

  function runGroupBy() {
    setGrouped(true);
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

  function reset() {
    setUsers(INITIAL_USERS);
    setActivePreset(0);
    setGrouped(false);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 px-4 py-2.5 text-sm text-base-200">
        🗄️ Essas "tabelas" ficam só na memória do navegador. Adicione ou remova linhas em <code className="text-mint-300">usuarios</code>,
        rode filtros, agrupamentos e veja como um <code className="text-mint-300">JOIN</code> combina duas tabelas relacionadas.
      </div>

      <div className="flex justify-center gap-1.5">
        <button
          onClick={() => setTab('usuarios')}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${tab === 'usuarios' ? 'bg-cyan-400 text-base-950' : 'bg-base-800 text-base-300'}`}
        >
          <Table2 size={12} /> Tabela usuarios
        </button>
        <button
          onClick={() => setTab('join')}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${tab === 'join' ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300'}`}
        >
          <Link2 size={12} /> JOIN com pedidos
        </button>
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
              <button onClick={reset} className="flex items-center gap-1 rounded-lg border border-base-600 px-3 py-1.5 text-xs text-base-300 hover:bg-base-800">
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
              onClick={runGroupBy}
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
    </div>
  );
}
