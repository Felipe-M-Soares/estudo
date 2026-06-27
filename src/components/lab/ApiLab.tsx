import { useEffect, useRef, useState } from 'react';
import { Send, RotateCcw, Radio, Repeat, Gauge, Target, CheckCircle2, ListChecks } from 'lucide-react';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Tab = 'rest' | 'graphql' | 'realtime' | 'desafio';

interface FakeApiResponse {
  status: number;
  statusText: string;
  body: string;
}

// Banco fake só na memória — simula uma API REST de "produtos".
const FAKE_PRODUCTS: { id: number; nome: string; preco: number }[] = [
  { id: 1, nome: 'Teclado mecânico', preco: 350 },
  { id: 2, nome: 'Mouse', preco: 90 },
];

function simulateRest(method: Method, path: string, body: string): FakeApiResponse {
  const match = path.match(/^\/produtos\/?(\d+)?$/);
  if (!match) {
    return { status: 404, statusText: 'Not Found', body: JSON.stringify({ error: `rota "${path}" não existe nesta API simulada` }, null, 2) };
  }
  const id = match[1] ? Number(match[1]) : null;

  if (method === 'GET' && id === null) {
    return { status: 200, statusText: 'OK', body: JSON.stringify(FAKE_PRODUCTS, null, 2) };
  }
  if (method === 'GET' && id !== null) {
    const found = FAKE_PRODUCTS.find((p) => p.id === id);
    return found
      ? { status: 200, statusText: 'OK', body: JSON.stringify(found, null, 2) }
      : { status: 404, statusText: 'Not Found', body: JSON.stringify({ error: `produto ${id} não existe` }, null, 2) };
  }
  if (method === 'POST' && id === null) {
    try {
      const parsed = JSON.parse(body || '{}');
      if (!parsed.nome || typeof parsed.preco !== 'number') {
        return { status: 400, statusText: 'Bad Request', body: JSON.stringify({ error: 'campos "nome" (string) e "preco" (number) são obrigatórios' }, null, 2) };
      }
      return { status: 201, statusText: 'Created', body: JSON.stringify({ id: 3, ...parsed }, null, 2) };
    } catch {
      return { status: 400, statusText: 'Bad Request', body: JSON.stringify({ error: 'JSON inválido no corpo da requisição' }, null, 2) };
    }
  }
  if (method === 'PUT' && id !== null) {
    const found = FAKE_PRODUCTS.find((p) => p.id === id);
    if (!found) return { status: 404, statusText: 'Not Found', body: JSON.stringify({ error: `produto ${id} não existe` }, null, 2) };
    return { status: 200, statusText: 'OK', body: JSON.stringify({ ...found, atualizado: true }, null, 2) };
  }
  if (method === 'DELETE' && id !== null) {
    const found = FAKE_PRODUCTS.find((p) => p.id === id);
    if (!found) return { status: 404, statusText: 'Not Found', body: JSON.stringify({ error: `produto ${id} não existe` }, null, 2) };
    return { status: 204, statusText: 'No Content', body: '(sem corpo na resposta)' };
  }
  return { status: 405, statusText: 'Method Not Allowed', body: JSON.stringify({ error: `método ${method} não é válido para ${path}` }, null, 2) };
}

const REST_PRESETS: { label: string; method: Method; path: string; body: string }[] = [
  { label: 'Listar produtos', method: 'GET', path: '/produtos', body: '' },
  { label: 'Buscar produto #1', method: 'GET', path: '/produtos/1', body: '' },
  { label: 'Buscar produto inexistente', method: 'GET', path: '/produtos/99', body: '' },
  { label: 'Criar produto', method: 'POST', path: '/produtos', body: '{\n  "nome": "Headset",\n  "preco": 220\n}' },
  { label: 'Criar produto (inválido)', method: 'POST', path: '/produtos', body: '{\n  "nome": "Headset"\n}' },
  { label: 'Atualizar produto #1', method: 'PUT', path: '/produtos/1', body: '{\n  "preco": 300\n}' },
  { label: 'Apagar produto #2', method: 'DELETE', path: '/produtos/2', body: '' },
];

const STATUS_MEANINGS: Record<number, string> = {
  200: '200 OK — deu certo, aqui está o resultado.',
  201: '201 Created — um novo recurso foi criado.',
  204: '204 No Content — deu certo, mas não há nada para retornar (comum em DELETE).',
  400: '400 Bad Request — a requisição está malformada ou faltam campos.',
  404: '404 Not Found — o recurso pedido não existe.',
  405: '405 Method Not Allowed — esse método HTTP não é suportado nessa rota.',
};

// --- GraphQL vs REST ---
const GRAPHQL_FAKE_DATA = {
  usuario: { id: 1, nome: 'Ana', email: 'ana@exemplo.com', idade: 28, cidade: 'São Paulo', pedidos: [{ produto: 'Teclado', valor: 350 }] },
};

function simulateGraphQL(fields: string[]): string {
  const result: Record<string, unknown> = {};
  for (const f of fields) {
    if (f in GRAPHQL_FAKE_DATA.usuario) {
      result[f] = (GRAPHQL_FAKE_DATA.usuario as Record<string, unknown>)[f];
    }
  }
  return JSON.stringify({ data: { usuario: result } }, null, 2);
}

const GRAPHQL_FIELDS = ['id', 'nome', 'email', 'idade', 'cidade', 'pedidos'];

export function ApiLab() {
  const [tab, setTab] = useState<Tab>('rest');

  // REST state
  const [method, setMethod] = useState<Method>('GET');
  const [path, setPath] = useState('/produtos');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<FakeApiResponse | null>(null);

  // GraphQL state
  const [selectedFields, setSelectedFields] = useState<string[]>(['nome', 'email']);

  // Realtime (WebSocket vs polling) state
  const [mode, setMode] = useState<'polling' | 'websocket'>('polling');
  const [running, setRunning] = useState(false);
  const [events, setEvents] = useState<{ text: string; time: number }[]>([]);
  const [requestCount, setRequestCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function runRest() {
    setResponse(simulateRest(method, path, body));
  }

  function applyRestPreset(p: typeof REST_PRESETS[number]) {
    setMethod(p.method);
    setPath(p.path);
    setBody(p.body);
    setResponse(null);
  }

  function toggleField(f: string) {
    setSelectedFields((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  }

  // Simulador de tempo real: em "polling", o cliente pergunta de X em X segundos
  // (gastando requisições mesmo sem novidade); em "websocket", o servidor avisa
  // só quando há uma mudança real. Tudo simulado, sem rede de verdade.
  useEffect(() => {
    if (!running) return;
    let tick = 0;
    intervalRef.current = setInterval(() => {
      tick++;
      if (mode === 'polling') {
        setRequestCount((c) => c + 1);
        const hasUpdate = tick % 4 === 0;
        setEvents((prev) => [
          ...prev,
          { text: hasUpdate ? '📨 Cliente perguntou: "tem novidade?" → Sim! Nova mensagem.' : '📭 Cliente perguntou: "tem novidade?" → Não.', time: tick },
        ]);
      } else {
        if (tick % 4 === 0) {
          setRequestCount((c) => c + 1);
          setEvents((prev) => [...prev, { text: '⚡ Servidor empurrou: "Nova mensagem!" (sem o cliente perguntar)', time: tick }]);
        }
      }
    }, 700);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, mode]);

  function startRealtime() {
    setEvents([]);
    setRequestCount(0);
    setRunning(true);
  }

  function stopRealtime() {
    setRunning(false);
  }

  function switchRealtimeMode(m: 'polling' | 'websocket') {
    setRunning(false);
    setMode(m);
    setEvents([]);
    setRequestCount(0);
  }

  // --- Desafios ---
  const [activeChallenge, setActiveChallenge] = useState(0);
  const [challengeMethod, setChallengeMethod] = useState<Method>('GET');
  const [challengePath, setChallengePath] = useState('');
  const [challengeBody, setChallengeBody] = useState('');
  const [challengeResult, setChallengeResult] = useState<FakeApiResponse | null>(null);
  const [solved, setSolved] = useState<Set<number>>(new Set());

  const CHALLENGES = [
    {
      title: 'Crie um produto novo',
      goal: 'Use o método e a rota certos para criar um produto chamado "Webcam" custando 180. Envie o corpo correto.',
      check: (r: FakeApiResponse) => r.status === 201,
    },
    {
      title: 'Provoque um 404 de propósito',
      goal: 'Faça uma requisição GET que busque um produto que não existe (id 50, por exemplo) e observe o status retornado.',
      check: (r: FakeApiResponse) => r.status === 404,
    },
    {
      title: 'Provoque um erro de validação',
      goal: 'Tente criar um produto sem o campo "preco" — qual status a API retorna quando os dados estão incompletos?',
      check: (r: FakeApiResponse) => r.status === 400,
    },
  ];

  function runChallenge() {
    const result = simulateRest(challengeMethod, challengePath, challengeBody);
    setChallengeResult(result);
    if (CHALLENGES[activeChallenge].check(result)) {
      setSolved((prev) => new Set(prev).add(activeChallenge));
    }
  }

  function pickChallenge(idx: number) {
    setActiveChallenge(idx);
    setChallengeMethod('GET');
    setChallengePath('/produtos');
    setChallengeBody('');
    setChallengeResult(null);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 px-4 py-2.5 text-sm text-base-200">
        🔌 Uma API fake de "produtos" só na memória do navegador — sem servidor real, sem rede. Pratique verbos HTTP, status
        codes, GraphQL vs REST, e a diferença entre polling e WebSocket.
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        <button onClick={() => setTab('rest')} className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${tab === 'rest' ? 'border-cyan-400/60 bg-cyan-500/10 text-base-50' : 'border-base-700 text-base-300 hover:bg-base-800'}`}>
          <Send size={12} /> Cliente REST
        </button>
        <button onClick={() => setTab('graphql')} className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${tab === 'graphql' ? 'border-amber-400/60 bg-amber-500/10 text-base-50' : 'border-base-700 text-base-300 hover:bg-base-800'}`}>
          <Gauge size={12} /> GraphQL vs REST
        </button>
        <button onClick={() => setTab('realtime')} className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${tab === 'realtime' ? 'border-mint-400/60 bg-mint-400/10 text-base-50' : 'border-base-700 text-base-300 hover:bg-base-800'}`}>
          <Radio size={12} /> Polling vs WebSocket
        </button>
        <button onClick={() => setTab('desafio')} className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${tab === 'desafio' ? 'border-base-400/60 bg-base-800 text-base-50' : 'border-base-700 text-base-300 hover:bg-base-800'}`}>
          <Target size={12} /> Desafios {solved.size > 0 && `(${solved.size}/${CHALLENGES.length})`}
        </button>
      </div>

      {tab === 'rest' && (
        <>
          <div className="flex flex-wrap gap-1.5">
            {REST_PRESETS.map((p) => (
              <button key={p.label} onClick={() => applyRestPreset(p)} className="rounded-full border border-base-600 px-3 py-1 text-xs text-base-200 hover:bg-base-800">
                {p.label}
              </button>
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-base-700 bg-base-900/60 p-4">
              <div className="flex gap-1.5">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as Method)}
                  className="rounded-lg border border-base-600 bg-base-800 px-2 py-2 text-xs font-bold text-cyan-300 outline-none"
                >
                  <option>GET</option>
                  <option>POST</option>
                  <option>PUT</option>
                  <option>DELETE</option>
                </select>
                <input
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  placeholder="/produtos/1"
                  className="flex-1 rounded-lg border border-base-600 bg-base-800 px-3 py-2 font-mono text-sm text-base-100 outline-none focus:border-cyan-400"
                />
              </div>
              {(method === 'POST' || method === 'PUT') && (
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="corpo JSON da requisição"
                  rows={5}
                  spellCheck={false}
                  className="mt-2 w-full resize-none rounded-lg border border-base-600 bg-base-950 p-2.5 font-mono text-[12px] text-mint-200 outline-none focus:border-cyan-400"
                />
              )}
              <button onClick={runRest} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-base-950 hover:opacity-90">
                <Send size={13} /> Enviar requisição
              </button>
            </div>

            <div className="rounded-xl border border-base-700 bg-base-950/60 p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-base-400">Resposta</p>
              {response ? (
                <>
                  <p
                    className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      response.status < 300 ? 'bg-mint-900/40 text-mint-300' : response.status < 500 ? 'bg-amber-500/15 text-amber-300' : 'bg-ember-500/15 text-ember-300'
                    }`}
                  >
                    {response.status} {response.statusText}
                  </p>
                  <pre className="overflow-x-auto rounded-lg bg-base-900 p-2.5 font-mono text-[11px] text-mint-200">{response.body}</pre>
                  {STATUS_MEANINGS[response.status] && <p className="mt-2 text-[11.5px] text-base-400">{STATUS_MEANINGS[response.status]}</p>}
                </>
              ) : (
                <p className="text-xs text-base-500">Envie uma requisição para ver a resposta aqui.</p>
              )}
            </div>
          </div>
        </>
      )}

      {tab === 'graphql' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-base-700 bg-base-900/60 p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-base-400">Escolha exatamente os campos que quer</p>
            <div className="flex flex-wrap gap-1.5">
              {GRAPHQL_FIELDS.map((f) => (
                <button
                  key={f}
                  onClick={() => toggleField(f)}
                  className={`rounded-full border px-3 py-1 font-mono text-xs ${
                    selectedFields.includes(f) ? 'border-amber-400/60 bg-amber-400/10 text-base-50' : 'border-base-600 text-base-300 hover:bg-base-800'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-base-950 p-2.5 font-mono text-[11.5px] text-amber-200">
              {`query {\n  usuario {\n${selectedFields.map((f) => `    ${f}`).join('\n')}\n  }\n}`}
            </pre>
            <p className="mt-2 text-[11.5px] text-base-400">
              💡 Em REST, você normalmente receberia o objeto inteiro do usuário (todos os campos), mesmo que só precisasse de
              2 deles. No GraphQL, o cliente pede exatamente os campos que vai usar.
            </p>
          </div>
          <div className="rounded-xl border border-base-700 bg-base-950/60 p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-base-400">Resposta GraphQL (só os campos pedidos)</p>
            <pre className="overflow-x-auto rounded-lg bg-base-900 p-2.5 font-mono text-[11px] text-mint-200">
              {selectedFields.length > 0 ? simulateGraphQL(selectedFields) : '// selecione pelo menos um campo'}
            </pre>
            <p className="mb-1.5 mt-4 text-[11px] font-semibold uppercase tracking-wide text-base-400">Resposta REST equivalente (sempre tudo)</p>
            <pre className="overflow-x-auto rounded-lg bg-base-900 p-2.5 font-mono text-[11px] text-base-400">
              {JSON.stringify({ data: GRAPHQL_FAKE_DATA.usuario }, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {tab === 'realtime' && (
        <div className="space-y-3">
          <div className="flex justify-center gap-1.5">
            <button onClick={() => switchRealtimeMode('polling')} className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${mode === 'polling' ? 'bg-amber-400 text-base-950' : 'bg-base-800 text-base-300'}`}>
              <Repeat size={12} /> Polling
            </button>
            <button onClick={() => switchRealtimeMode('websocket')} className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${mode === 'websocket' ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300'}`}>
              <Radio size={12} /> WebSocket
            </button>
          </div>
          <p className="text-center text-[12px] text-base-400">
            {mode === 'polling'
              ? 'O cliente pergunta repetidamente "tem novidade?" — gasta requisição mesmo quando a resposta é não.'
              : 'O servidor mantém a conexão aberta e só fala quando realmente há algo novo — sem perguntas desnecessárias.'}
          </p>
          <div className="flex justify-center gap-2">
            {!running ? (
              <button onClick={startRealtime} className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-base-950 hover:opacity-90">
                Iniciar simulação
              </button>
            ) : (
              <button onClick={stopRealtime} className="rounded-lg border border-base-600 px-4 py-2 text-sm text-base-200 hover:bg-base-800">
                Parar
              </button>
            )}
          </div>
          <div className="rounded-xl border border-base-700 bg-base-950 p-3 font-mono text-[12.5px]" style={{ minHeight: '200px', maxHeight: '260px', overflowY: 'auto' }}>
            {events.length === 0 && <p className="text-base-600">Clique em "Iniciar simulação" para ver os eventos aqui.</p>}
            {events.map((e, i) => (
              <div key={i} className="text-base-200">{e.text}</div>
            ))}
          </div>
          <p className="text-center text-[11px] text-base-500">
            Requisições/mensagens de rede usadas até agora: <span className="font-mono text-cyan-300">{requestCount}</span>
          </p>
        </div>
      )}

      {tab === 'desafio' && (
        <>
          <div className="flex flex-wrap gap-1.5">
            {CHALLENGES.map((c, idx) => (
              <button
                key={c.title}
                onClick={() => pickChallenge(idx)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  activeChallenge === idx ? 'border-mint-400/60 bg-mint-400/10 text-base-50' : 'border-base-600 text-base-300 hover:bg-base-800'
                }`}
              >
                {solved.has(idx) && <CheckCircle2 size={12} className="text-mint-400" />}
                {c.title}
              </button>
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <div className="mb-2 flex items-start gap-2 rounded-xl border border-base-700 bg-base-900/60 p-3">
                <ListChecks size={15} className="mt-0.5 shrink-0 text-amber-300" />
                <p className="text-[12.5px] text-base-300">{CHALLENGES[activeChallenge].goal}</p>
              </div>
              <div className="flex gap-1.5">
                <select value={challengeMethod} onChange={(e) => setChallengeMethod(e.target.value as Method)} className="rounded-lg border border-base-600 bg-base-800 px-2 py-2 text-xs font-bold text-cyan-300 outline-none">
                  <option>GET</option>
                  <option>POST</option>
                  <option>PUT</option>
                  <option>DELETE</option>
                </select>
                <input value={challengePath} onChange={(e) => setChallengePath(e.target.value)} placeholder="/produtos" className="flex-1 rounded-lg border border-base-600 bg-base-800 px-3 py-2 font-mono text-sm text-base-100 outline-none focus:border-mint-400" />
              </div>
              <textarea
                value={challengeBody}
                onChange={(e) => setChallengeBody(e.target.value)}
                placeholder="corpo JSON (se precisar)"
                rows={4}
                spellCheck={false}
                className="mt-2 w-full resize-none rounded-lg border border-base-600 bg-base-950 p-2.5 font-mono text-[12px] text-mint-200 outline-none focus:border-mint-400"
              />
              <button onClick={runChallenge} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-mint-400 px-4 py-2 text-sm font-bold text-base-950 hover:opacity-90">
                <Send size={13} /> Enviar e verificar
              </button>
            </div>
            <div>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-base-400">Resposta</p>
              <div className="rounded-xl border border-base-700 bg-base-950/60 p-3" style={{ minHeight: '160px' }}>
                {challengeResult ? (
                  <>
                    <p className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${challengeResult.status < 300 ? 'bg-mint-900/40 text-mint-300' : 'bg-amber-500/15 text-amber-300'}`}>
                      {challengeResult.status} {challengeResult.statusText}
                    </p>
                    <pre className="overflow-x-auto rounded-lg bg-base-900 p-2.5 font-mono text-[11px] text-mint-200">{challengeResult.body}</pre>
                  </>
                ) : (
                  <p className="text-xs text-base-500">Envie a requisição para ver o resultado.</p>
                )}
              </div>
              {solved.has(activeChallenge) && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-mint-400/30 bg-mint-900/15 p-3 text-sm text-mint-200">
                  <CheckCircle2 size={16} /> Desafio resolvido!
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <button onClick={() => { setResponse(null); setEvents([]); setRunning(false); }} className="flex items-center gap-1.5 text-xs text-base-400 hover:text-base-200">
        <RotateCcw size={11} /> Limpar resultados
      </button>
    </div>
  );
}
