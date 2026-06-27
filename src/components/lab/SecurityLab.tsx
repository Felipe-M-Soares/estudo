import { useState } from 'react';
import {
  ShieldAlert, ShieldCheck, RotateCcw, Eye, Database, Code2, KeyRound, FileWarning,
  Link2Off, Gauge, ListChecks, CheckCircle2,
} from 'lucide-react';

// Tudo nesta tela é 100% falso e local — só existe na memória deste componente,
// nunca sai do navegador, não é um servidor real, não representa nenhum
// sistema de verdade. Serve só para demonstrar, de forma segura e isolada,
// como vulnerabilidades comuns funcionam e como se defender delas.

type Mode = 'vulnerable' | 'safe';
type Scenario = 'sqli' | 'xss' | 'password' | 'leak' | 'csrf' | 'bruteforce' | 'owasp';

const SCENARIOS: { id: Scenario; label: string; icon: typeof Database; color: string }[] = [
  { id: 'sqli', label: 'SQL Injection', icon: Database, color: 'text-ember-300' },
  { id: 'xss', label: 'XSS (script malicioso)', icon: Code2, color: 'text-amber-300' },
  { id: 'csrf', label: 'CSRF', icon: Link2Off, color: 'text-amber-300' },
  { id: 'password', label: 'Força de senha', icon: KeyRound, color: 'text-cyan-300' },
  { id: 'bruteforce', label: 'Brute force & rate limiting', icon: Gauge, color: 'text-cyan-300' },
  { id: 'leak', label: 'Exposição de dados', icon: FileWarning, color: 'text-mint-300' },
  { id: 'owasp', label: 'Quiz OWASP Top 10', icon: ListChecks, color: 'text-mint-300' },
];

// --- Cenário 1: SQL Injection ---
const FAKE_USERS = [
  { email: 'ana@exemplo.com', senha: 'flores123' },
  { email: 'bruno@exemplo.com', senha: 'senha2024' },
];

function simulateLogin(email: string, senha: string, mode: Mode): { success: boolean; queryShown: string; reason: string } {
  if (mode === 'vulnerable') {
    const query = `SELECT * FROM usuarios WHERE email = '${email}' AND senha = '${senha}'`;
    const looksLikeInjection = /'\s*or\s*'?1'?\s*=\s*'?1|--|\bor\b.*=/i.test(email) || /'\s*or\s*'?1'?\s*=\s*'?1|--|\bor\b.*=/i.test(senha);

    if (looksLikeInjection) {
      return {
        success: true,
        queryShown: query,
        reason: 'A condição foi manipulada para ficar sempre verdadeira — o "banco" (simulado) retornou um usuário sem checar a senha real.',
      };
    }

    const found = FAKE_USERS.find((u) => u.email === email && u.senha === senha);
    return {
      success: !!found,
      queryShown: query,
      reason: found ? 'Login correto, sem nenhum truque.' : 'Email ou senha não correspondem a nenhum usuário.',
    };
  }

  const found = FAKE_USERS.find((u) => u.email === email && u.senha === senha);
  return {
    success: !!found,
    queryShown: `SELECT * FROM usuarios WHERE email = $1 AND senha = $2  -- parâmetros: ["${email}", "${senha}"]`,
    reason: found
      ? 'Login correto.'
      : 'Mesmo tentando truques de SQL Injection, o valor é tratado como texto puro — nunca altera a estrutura da query.',
  };
}

// --- Cenário 2: XSS ---
function sanitizeHtml(input: string): string {
  return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function looksLikeXssAttempt(input: string): boolean {
  return /<script|onerror=|onload=|<img|javascript:/i.test(input);
}

// --- Cenário 3: Força de senha ---
function checkPasswordStrength(senha: string): { score: number; label: string; color: string; tips: string[] } {
  const tips: string[] = [];
  let score = 0;

  if (senha.length >= 8) score++;
  else tips.push('Use pelo menos 8 caracteres.');

  if (senha.length >= 12) score++;

  if (/[A-Z]/.test(senha)) score++;
  else tips.push('Adicione pelo menos uma letra maiúscula.');

  if (/[0-9]/.test(senha)) score++;
  else tips.push('Adicione pelo menos um número.');

  if (/[^A-Za-z0-9]/.test(senha)) score++;
  else tips.push('Adicione um símbolo (ex: !, @, #).');

  const commonPasswords = ['123456', 'senha123', 'password', 'qwerty', '12345678', 'admin123'];
  if (commonPasswords.includes(senha.toLowerCase())) {
    score = 0;
    tips.unshift('Essa é uma das senhas mais usadas do mundo — evite completamente.');
  }

  if (senha.length === 0) return { score: 0, label: '—', color: 'text-base-500', tips: [] };

  const labels = ['Muito fraca', 'Fraca', 'Razoável', 'Boa', 'Forte', 'Excelente'];
  const colors = ['text-ember-400', 'text-ember-400', 'text-amber-300', 'text-amber-300', 'text-mint-300', 'text-mint-400'];
  return { score, label: labels[score], color: colors[score], tips };
}

// --- Cenário 4: Exposição de dados em mensagens de erro ---
const FAKE_DB_RECORD = { id: 4821, email: 'cliente.real@empresa.com', cartao: '4532 **** **** 9911', cpf: '123.456.789-00' };

function simulateApiError(query: string, mode: Mode): { status: number; body: string } {
  const triggersError = query.trim().length === 0 || query.includes("'");
  if (!triggersError) {
    return { status: 200, body: JSON.stringify({ ok: true, resultado: 'consulta executada' }, null, 2) };
  }
  if (mode === 'vulnerable') {
    return {
      status: 500,
      body: JSON.stringify(
        {
          error: 'SQLSTATE[42000] Syntax error near token',
          query: `SELECT * FROM clientes WHERE filtro = '${query}'`,
          stack: 'em /app/src/db/connection.js:88 -> pool.query()',
          registro_exemplo: FAKE_DB_RECORD,
          db_host: '10.0.4.221',
          db_user: 'app_prod_rw',
        },
        null,
        2
      ),
    };
  }
  return {
    status: 400,
    body: JSON.stringify({ error: 'Requisição inválida. Verifique os parâmetros enviados.', codigo: 'ERR_BAD_REQUEST' }, null, 2),
  };
}

// --- Cenário 5: CSRF ---
// Simula um "banco real" mudando de email só porque o usuário clicou num link
// malicioso enquanto estava logado — sem token CSRF, o navegador envia o
// cookie de sessão automaticamente, e o servidor não tem como saber que o
// pedido não veio de uma ação intencional do usuário no site real.
function simulateCsrfClick(mode: Mode, loggedIn: boolean): { changed: boolean; message: string } {
  if (!loggedIn) {
    return { changed: false, message: 'Você precisa estar "logado" no banco fake para esse ataque fazer sentido. Marque a opção de login acima.' };
  }
  if (mode === 'vulnerable') {
    return {
      changed: true,
      message:
        '🚨 O email da conta foi trocado para invasor@maligno.com sem você perceber! O site malicioso mandou uma requisição para o banco, ' +
        'seu navegador anexou o cookie de sessão automaticamente (porque você estava logado), e o servidor aceitou — sem checar se o pedido realmente partiu do site do banco.',
    };
  }
  return {
    changed: false,
    message:
      '✅ A requisição foi bloqueada. O servidor exigia um token CSRF único (gerado só dentro do site do banco) que o site malicioso não tinha como conhecer — então o pedido foi rejeitado.',
  };
}

// --- Cenário 6: Brute force & rate limiting ---
const FAKE_PASSWORD = 'flores123';

interface BruteForceState {
  attempts: number;
  blocked: boolean;
  log: { text: string; ok: boolean }[];
}

function attemptLogin(currentSenha: string, mode: Mode, state: BruteForceState): BruteForceState {
  if (mode === 'safe' && state.blocked) {
    return { ...state, log: [...state.log, { text: '🔒 Bloqueado por rate limiting — espere antes de tentar de novo.', ok: false }] };
  }
  const correct = currentSenha === FAKE_PASSWORD;
  const attempts = state.attempts + 1;
  const log = [...state.log, { text: correct ? `Tentativa ${attempts}: "${currentSenha}" → ✅ senha correta!` : `Tentativa ${attempts}: "${currentSenha}" → ❌ incorreta`, ok: correct }];

  if (mode === 'safe' && !correct && attempts >= 3) {
    return { attempts, blocked: true, log: [...log, { text: '🛑 3 tentativas erradas — conta temporariamente bloqueada por 10 segundos (rate limiting).', ok: false }] };
  }
  return { attempts, blocked: false, log };
}

const COMMON_PASSWORD_LIST = ['123456', 'senha123', 'flores123', 'admin', 'qwerty', 'password', '111111'];

// --- Cenário 7: Quiz OWASP Top 10 ---
interface OwaspQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const OWASP_QUESTIONS: OwaspQuestion[] = [
  {
    question: 'Um atacante consegue ver pedidos de outros clientes só trocando o número no final da URL (/pedidos/123 → /pedidos/124), sem nenhuma checagem de permissão. Isso é um exemplo de:',
    options: ['Quebra de controle de acesso', 'Falha criptográfica', 'Design inseguro', 'Falha de log e monitoramento'],
    correctIndex: 0,
    explanation: 'Quando o sistema não verifica se o usuário logado tem permissão sobre aquele recurso específico, isso é "Broken Access Control" — a categoria #1 do OWASP Top 10.',
  },
  {
    question: 'Um site guarda senhas de usuários em texto puro no banco de dados. Se esse banco for vazado, todas as senhas reais ficam expostas. Que categoria é essa?',
    options: ['Injeção', 'Falhas criptográficas', 'CSRF', 'Componentes vulneráveis'],
    correctIndex: 1,
    explanation: 'Não usar hash (como bcrypt) para senhas é uma falha criptográfica — dados sensíveis precisam estar protegidos mesmo se o armazenamento for comprometido.',
  },
  {
    question: 'Uma aplicação usa uma biblioteca de terceiros com uma vulnerabilidade conhecida publicada há 2 anos, e nunca foi atualizada. Esse risco se chama:',
    options: ['Injeção de SQL', 'Componentes vulneráveis e desatualizados', 'XSS', 'Falha de identificação'],
    correctIndex: 1,
    explanation: 'Usar dependências com vulnerabilidades conhecidas e não corrigidas é uma categoria própria no OWASP Top 10 — manter dependências atualizadas é parte da segurança.',
  },
  {
    question: 'Um formulário de "esqueci minha senha" informa "email não encontrado" quando o email não existe, e "senha incorreta" quando existe. Isso ajuda um atacante a:',
    options: ['Quebrar a criptografia do banco', 'Descobrir quais emails têm conta no sistema', 'Fazer um ataque de CSRF', 'Explorar XSS'],
    correctIndex: 1,
    explanation: 'Mensagens de erro diferentes "vazam" informação (enumeração de usuários). A defesa é responder sempre com uma mensagem genérica.',
  },
  {
    question: 'Um sistema de e-commerce loga todas as tentativas de login, mas ninguém nunca olha esses logs nem é alertado sobre padrões suspeitos. Que categoria descreve essa fragilidade?',
    options: ['Falhas de log e monitoramento', 'Design inseguro', 'Injeção', 'SSRF'],
    correctIndex: 0,
    explanation: 'Ter logs que nunca são monitorados é quase tão arriscado quanto não ter logs — ataques em andamento passam despercebidos por muito tempo.',
  },
];

export function SecurityLab() {
  const [scenario, setScenario] = useState<Scenario>('sqli');
  const [mode, setMode] = useState<Mode>('vulnerable');

  // sqli state
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [sqliResult, setSqliResult] = useState<ReturnType<typeof simulateLogin> | null>(null);
  const [showHint, setShowHint] = useState(false);

  // xss state
  const [comment, setComment] = useState('');
  const [postedComments, setPostedComments] = useState<{ raw: string; mode: Mode }[]>([]);

  // password state
  const [pwd, setPwd] = useState('');

  // leak state
  const [apiQuery, setApiQuery] = useState('');
  const [apiResult, setApiResult] = useState<ReturnType<typeof simulateApiError> | null>(null);

  // csrf state
  const [csrfLoggedIn, setCsrfLoggedIn] = useState(true);
  const [csrfResult, setCsrfResult] = useState<ReturnType<typeof simulateCsrfClick> | null>(null);

  // brute force state
  const [bfPassword, setBfPassword] = useState('');
  const [bfState, setBfState] = useState<BruteForceState>({ attempts: 0, blocked: false, log: [] });

  // owasp quiz state
  const [owaspIdx, setOwaspIdx] = useState(0);
  const [owaspSelected, setOwaspSelected] = useState<number | null>(null);
  const [owaspScore, setOwaspScore] = useState<Set<number>>(new Set());

  function changeScenario(s: Scenario) {
    setScenario(s);
    setSqliResult(null);
    setPostedComments([]);
    setApiResult(null);
    setShowHint(false);
    setCsrfResult(null);
    setBfState({ attempts: 0, blocked: false, log: [] });
    setOwaspIdx(0);
    setOwaspSelected(null);
  }

  function tryLogin() {
    setSqliResult(simulateLogin(email, senha, mode));
  }

  function postComment() {
    if (!comment.trim()) return;
    setPostedComments((prev) => [...prev, { raw: comment, mode }]);
    setComment('');
  }

  function runApiQuery() {
    setApiResult(simulateApiError(apiQuery, mode));
  }

  function clickMaliciousLink() {
    setCsrfResult(simulateCsrfClick(mode, csrfLoggedIn));
  }

  function submitBfAttempt() {
    setBfState((prev) => attemptLogin(bfPassword, mode, prev));
    setBfPassword('');
  }

  function tryCommonPassword(pwd: string) {
    setBfPassword(pwd);
  }

  function unlockBf() {
    setBfState({ attempts: 0, blocked: false, log: [] });
  }

  function answerOwasp(idx: number) {
    if (owaspSelected !== null) return;
    setOwaspSelected(idx);
    if (idx === OWASP_QUESTIONS[owaspIdx].correctIndex) {
      setOwaspScore((prev) => new Set(prev).add(owaspIdx));
    }
  }

  function nextOwasp() {
    setOwaspSelected(null);
    setOwaspIdx((i) => Math.min(i + 1, OWASP_QUESTIONS.length - 1));
  }

  function restartOwasp() {
    setOwaspIdx(0);
    setOwaspSelected(null);
    setOwaspScore(new Set());
  }

  const owaspDone = owaspIdx === OWASP_QUESTIONS.length - 1 && owaspSelected !== null;

  function reset() {
    setEmail('');
    setSenha('');
    setSqliResult(null);
    setComment('');
    setPostedComments([]);
    setPwd('');
    setApiQuery('');
    setApiResult(null);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-ember-400/30 bg-ember-500/10 px-4 py-2.5 text-sm text-ember-200">
        ⚠️ Tudo aqui é 100% falso e simulado só neste componente — não existe banco de dados real, não existe servidor, nada
        sai do seu navegador. É um sandbox seguro para praticar como vulnerabilidades comuns funcionam e como se defender delas.
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {SCENARIOS.map((s) => {
          const Icon = s.icon;
          const active = scenario === s.id;
          return (
            <button
              key={s.id}
              onClick={() => changeScenario(s.id)}
              className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
                active ? 'border-base-400/60 bg-base-800 text-base-50' : 'border-base-700 text-base-300 hover:bg-base-800'
              }`}
            >
              <Icon size={13} className={active ? s.color : 'text-base-500'} />
              {s.label}
            </button>
          );
        })}
      </div>

      {(scenario === 'sqli' || scenario === 'xss' || scenario === 'leak' || scenario === 'csrf' || scenario === 'bruteforce') && (
        <div className="flex justify-center gap-1.5">
          <button
            onClick={() => { setMode('vulnerable'); reset(); setCsrfResult(null); setBfState({ attempts: 0, blocked: false, log: [] }); }}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${mode === 'vulnerable' ? 'bg-ember-500 text-white' : 'bg-base-800 text-base-300'}`}
          >
            <ShieldAlert size={12} /> Versão vulnerável
          </button>
          <button
            onClick={() => { setMode('safe'); reset(); setCsrfResult(null); setBfState({ attempts: 0, blocked: false, log: [] }); }}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${mode === 'safe' ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300'}`}
          >
            <ShieldCheck size={12} /> Versão corrigida
          </button>
        </div>
      )}

      {scenario === 'sqli' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-base-700 bg-base-900/60 p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-base-400">
              Formulário de login {mode === 'vulnerable' ? '(sem proteção)' : '(com query parametrizada)'}
            </p>
            <div className="space-y-2.5">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                className="w-full rounded-lg border border-base-600 bg-base-800 px-3 py-2 text-sm text-base-100 outline-none focus:border-cyan-400"
              />
              <input
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="senha"
                className="w-full rounded-lg border border-base-600 bg-base-800 px-3 py-2 text-sm text-base-100 outline-none focus:border-cyan-400"
              />
              <button onClick={tryLogin} className="w-full rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-base-950 hover:opacity-90">
                Entrar
              </button>
            </div>

            {mode === 'vulnerable' && (
              <button onClick={() => setShowHint((s) => !s)} className="mt-3 flex items-center gap-1.5 text-xs text-amber-300 hover:underline">
                <Eye size={11} /> {showHint ? 'Esconder' : 'Ver'} dica de como tentar
              </button>
            )}
            {showHint && mode === 'vulnerable' && (
              <p className="mt-2 rounded-lg bg-base-800/60 p-2.5 text-[11px] text-base-300">
                Tente digitar algo no campo senha que, se colado direto numa query SQL, faria uma comparação sempre verdadeira —
                pensando em como a lição de SQL Injection explicou o operador OR.
              </p>
            )}

            <button onClick={reset} className="mt-3 flex items-center gap-1.5 text-xs text-base-400 hover:text-base-200">
              <RotateCcw size={11} /> Limpar
            </button>
          </div>

          <div className="rounded-xl border border-base-700 bg-base-950/60 p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-base-400">O que aconteceria no banco (simulado)</p>
            {sqliResult ? (
              <>
                <pre className="overflow-x-auto rounded-lg bg-base-900 p-2.5 font-mono text-[11px] text-mint-200">{sqliResult.queryShown}</pre>
                <div
                  className={`mt-3 rounded-lg border p-3 text-sm ${
                    sqliResult.success
                      ? mode === 'vulnerable'
                        ? 'border-ember-400/30 bg-ember-500/10 text-ember-200'
                        : 'border-mint-400/30 bg-mint-900/15 text-mint-200'
                      : 'border-base-600 bg-base-800/40 text-base-300'
                  }`}
                >
                  <p className="mb-1 font-semibold">
                    {sqliResult.success ? (mode === 'vulnerable' ? '🚨 Login burlado!' : '✅ Login válido') : '❌ Acesso negado'}
                  </p>
                  <p>{sqliResult.reason}</p>
                </div>
              </>
            ) : (
              <p className="text-xs text-base-500">Tente fazer login para ver a query simulada aqui.</p>
            )}
          </div>
        </div>
      )}

      {scenario === 'xss' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-base-700 bg-base-900/60 p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-base-400">
              Caixa de comentários {mode === 'vulnerable' ? '(renderiza HTML direto)' : '(escapa o conteúdo)'}
            </p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='Tente: <img src=x onerror="alert(1)">'
              rows={3}
              spellCheck={false}
              className="w-full resize-none rounded-lg border border-base-600 bg-base-800 px-3 py-2 font-mono text-sm text-base-100 outline-none focus:border-cyan-400"
            />
            <button onClick={postComment} className="mt-2 w-full rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-base-950 hover:opacity-90">
              Publicar comentário
            </button>
            <p className="mt-3 rounded-lg bg-base-800/60 p-2.5 text-[11px] text-base-300">
              💡 No mundo real, um atacante posta um comentário com um <code className="text-mint-300">&lt;script&gt;</code> ou uma tag{' '}
              <code className="text-mint-300">&lt;img onerror=...&gt;</code> esperando que outros usuários vejam essa página — e o script
              malicioso rode no navegador deles. Aqui, em vez de executar o script de verdade, mostramos o alerta de forma segura.
            </p>
            <button onClick={reset} className="mt-3 flex items-center gap-1.5 text-xs text-base-400 hover:text-base-200">
              <RotateCcw size={11} /> Limpar comentários
            </button>
          </div>

          <div className="rounded-xl border border-base-700 bg-base-950/60 p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-base-400">Como a página renderiza os comentários</p>
            {postedComments.length === 0 && <p className="text-xs text-base-500">Publique um comentário para ver o resultado aqui.</p>}
            <div className="space-y-2">
              {postedComments.map((c, i) => {
                const isAttempt = looksLikeXssAttempt(c.raw);
                return (
                  <div key={i} className="rounded-lg border border-base-700 bg-base-900/60 p-3">
                    {c.mode === 'vulnerable' ? (
                      isAttempt ? (
                        <div className="rounded border border-ember-400/40 bg-ember-500/10 p-2 text-sm text-ember-200">
                          🚨 Script executado! (simulado) — o HTML/JS foi inserido direto na página sem nenhum tratamento. Conteúdo
                          bruto: <code className="break-all font-mono text-[11px]">{c.raw}</code>
                        </div>
                      ) : (
                        <p className="text-sm text-base-100">{c.raw}</p>
                      )
                    ) : (
                      <>
                        <p className="text-sm text-base-100">{sanitizeHtml(c.raw)}</p>
                        {isAttempt && (
                          <p className="mt-1.5 text-[11px] text-mint-300">
                            ✅ As tags foram escapadas — o navegador mostra o texto literal em vez de executar o código.
                          </p>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {scenario === 'password' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-base-700 bg-base-900/60 p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-base-400">Crie uma senha e veja a força em tempo real</p>
            <input
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="digite uma senha de teste"
              className="w-full rounded-lg border border-base-600 bg-base-800 px-3 py-2 font-mono text-sm text-base-100 outline-none focus:border-cyan-400"
            />
            <p className="mt-3 rounded-lg bg-base-800/60 p-2.5 text-[11px] text-base-300">
              💡 Essa senha não é enviada a lugar nenhum — fica só na memória da página enquanto você digita, e some quando você sai
              do Laboratório.
            </p>
            <button onClick={() => setPwd('')} className="mt-3 flex items-center gap-1.5 text-xs text-base-400 hover:text-base-200">
              <RotateCcw size={11} /> Limpar
            </button>
          </div>

          <div className="rounded-xl border border-base-700 bg-base-950/60 p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-base-400">Análise de força</p>
            {(() => {
              const result = checkPasswordStrength(pwd);
              return (
                <>
                  <div className="mb-2 flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full ${
                          i < result.score ? (result.score <= 1 ? 'bg-ember-400' : result.score <= 3 ? 'bg-amber-300' : 'bg-mint-400') : 'bg-base-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-sm font-semibold ${result.color}`}>{result.label}</p>
                  {result.tips.length > 0 && (
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-[12px] text-base-300">
                      {result.tips.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  )}
                  {pwd.length > 0 && result.tips.length === 0 && (
                    <p className="mt-2 text-[12px] text-mint-300">✅ Senha forte: bom tamanho, mistura de letras, números e símbolos.</p>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {scenario === 'leak' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-base-700 bg-base-900/60 p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-base-400">
              Campo de busca da API {mode === 'vulnerable' ? '(erro detalhado em produção)' : '(erro genérico em produção)'}
            </p>
            <input
              value={apiQuery}
              onChange={(e) => setApiQuery(e.target.value)}
              placeholder={`Tente algo com aspas: o'reilly`}
              className="w-full rounded-lg border border-base-600 bg-base-800 px-3 py-2 font-mono text-sm text-base-100 outline-none focus:border-cyan-400"
            />
            <button onClick={runApiQuery} className="mt-2 w-full rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-base-950 hover:opacity-90">
              Buscar
            </button>
            <p className="mt-3 rounded-lg bg-base-800/60 p-2.5 text-[11px] text-base-300">
              💡 Em apps reais, mensagens de erro "completas" (stack trace, query SQL, IP do banco) ajudam o desenvolvedor — mas se
              aparecerem para o usuário final em produção, ajudam também um atacante a mapear o sistema.
            </p>
            <button onClick={reset} className="mt-3 flex items-center gap-1.5 text-xs text-base-400 hover:text-base-200">
              <RotateCcw size={11} /> Limpar
            </button>
          </div>

          <div className="rounded-xl border border-base-700 bg-base-950/60 p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-base-400">Resposta da API (simulada)</p>
            {apiResult ? (
              <>
                <p
                  className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    apiResult.status >= 500
                      ? 'bg-ember-500/15 text-ember-300'
                      : apiResult.status >= 400
                      ? 'bg-amber-500/15 text-amber-300'
                      : 'bg-mint-900/40 text-mint-300'
                  }`}
                >
                  HTTP {apiResult.status}
                </p>
                <pre className="overflow-x-auto rounded-lg bg-base-900 p-2.5 font-mono text-[11px] text-mint-200">{apiResult.body}</pre>
                {apiResult.status === 500 && (
                  <p className="mt-2 text-[11px] text-ember-300">
                    🚨 Essa resposta vazou a query SQL real, um registro de cliente, e até o IP interno do banco — tudo isso dá pistas
                    valiosas para um ataque.
                  </p>
                )}
              </>
            ) : (
              <p className="text-xs text-base-500">Rode uma busca para ver a resposta da API aqui.</p>
            )}
          </div>
        </div>
      )}
      {scenario === 'csrf' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-base-700 bg-base-900/60 p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-base-400">
              Cenário: você está logado no "banco" {mode === 'vulnerable' ? '(sem proteção CSRF)' : '(com token CSRF)'}
            </p>
            <label className="flex items-center gap-2 text-[12.5px] text-base-300">
              <input type="checkbox" checked={csrfLoggedIn} onChange={(e) => setCsrfLoggedIn(e.target.checked)} className="accent-cyan-400" />
              Estou logado no site do banco fake (cookie de sessão ativo)
            </label>
            <div className="mt-3 rounded-lg border border-base-600 bg-base-800/60 p-3">
              <p className="text-[12px] text-base-300">
                Agora imagine que, em outra aba, você visita um site qualquer que tem este botão escondido:
              </p>
              <button onClick={clickMaliciousLink} className="mt-2 w-full rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-base-950 hover:opacity-90">
                🎁 Clique aqui para ganhar um prêmio!
              </button>
              <p className="mt-2 text-[11px] text-base-500">(esse botão, sem você saber, manda uma requisição escondida para trocar o email da sua conta no banco)</p>
            </div>
            <button onClick={() => setCsrfResult(null)} className="mt-3 flex items-center gap-1.5 text-xs text-base-400 hover:text-base-200">
              <RotateCcw size={11} /> Limpar
            </button>
          </div>
          <div className="rounded-xl border border-base-700 bg-base-950/60 p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-base-400">O que aconteceu no servidor (simulado)</p>
            {csrfResult ? (
              <div
                className={`rounded-lg border p-3 text-sm ${
                  csrfResult.changed ? 'border-ember-400/30 bg-ember-500/10 text-ember-200' : 'border-mint-400/30 bg-mint-900/15 text-mint-200'
                }`}
              >
                {csrfResult.message}
              </div>
            ) : (
              <p className="text-xs text-base-500">Clique no botão "prêmio" para ver o resultado aqui.</p>
            )}
          </div>
        </div>
      )}

      {scenario === 'bruteforce' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-base-700 bg-base-900/60 p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-base-400">
              Login fake {mode === 'vulnerable' ? '(tentativas ilimitadas)' : '(com rate limiting após 3 erros)'}
            </p>
            <div className="flex gap-1.5">
              <input
                value={bfPassword}
                onChange={(e) => setBfPassword(e.target.value)}
                placeholder="tente uma senha"
                className="flex-1 rounded-lg border border-base-600 bg-base-800 px-3 py-2 font-mono text-sm text-base-100 outline-none focus:border-cyan-400"
              />
              <button onClick={submitBfAttempt} className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-base-950 hover:opacity-90">
                Entrar
              </button>
            </div>
            <p className="mt-2 text-[11px] text-base-400">Senhas comuns para testar (como um atacante faria):</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {COMMON_PASSWORD_LIST.map((p) => (
                <button key={p} onClick={() => tryCommonPassword(p)} className="rounded-full border border-base-600 px-2.5 py-1 font-mono text-[11px] text-base-300 hover:bg-base-800">
                  {p}
                </button>
              ))}
            </div>
            {mode === 'safe' && bfState.blocked && (
              <button onClick={unlockBf} className="mt-3 flex items-center gap-1.5 text-xs text-amber-300 hover:underline">
                <RotateCcw size={11} /> Simular espera de 10s e tentar de novo
              </button>
            )}
          </div>
          <div className="rounded-xl border border-base-700 bg-base-950/60 p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-base-400">Log de tentativas</p>
            <div className="rounded-lg bg-base-900 p-2.5 font-mono text-[11.5px]" style={{ minHeight: '180px', maxHeight: '220px', overflowY: 'auto' }}>
              {bfState.log.length === 0 && <p className="text-base-600">Tente fazer login para ver o log aqui.</p>}
              {bfState.log.map((l, i) => (
                <div key={i} className={l.ok ? 'text-mint-300' : 'text-base-300'}>{l.text}</div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-base-500">
              {mode === 'vulnerable'
                ? '🚨 Sem limite de tentativas, um atacante pode testar milhares de senhas comuns por segundo (brute force) até acertar.'
                : '✅ Depois de poucas tentativas erradas, o rate limiting bloqueia novas tentativas por um tempo — tornando o brute force inviável na prática.'}
            </p>
          </div>
        </div>
      )}

      {scenario === 'owasp' && (
        <div className="mx-auto max-w-2xl">
          {!owaspDone || owaspSelected === null ? (
            <div className="rounded-xl border border-base-700 bg-base-900/60 p-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-base-400">
                Pergunta {owaspIdx + 1} de {OWASP_QUESTIONS.length}
              </p>
              <p className="text-sm text-base-100">{OWASP_QUESTIONS[owaspIdx].question}</p>
              <div className="mt-3 space-y-1.5">
                {OWASP_QUESTIONS[owaspIdx].options.map((opt, idx) => {
                  const isCorrect = idx === OWASP_QUESTIONS[owaspIdx].correctIndex;
                  const isSelected = owaspSelected === idx;
                  let style = 'border-base-600 text-base-200 hover:bg-base-800';
                  if (owaspSelected !== null) {
                    if (isCorrect) style = 'border-mint-400/60 bg-mint-900/20 text-mint-200';
                    else if (isSelected) style = 'border-ember-400/60 bg-ember-500/10 text-ember-200';
                  }
                  return (
                    <button key={idx} onClick={() => answerOwasp(idx)} disabled={owaspSelected !== null} className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${style}`}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {owaspSelected !== null && (
                <>
                  <p className="mt-3 rounded-lg bg-base-800/60 p-2.5 text-[12px] text-base-300">{OWASP_QUESTIONS[owaspIdx].explanation}</p>
                  {owaspIdx < OWASP_QUESTIONS.length - 1 && (
                    <button onClick={nextOwasp} className="mt-3 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-base-950 hover:opacity-90">
                      Próxima pergunta →
                    </button>
                  )}
                </>
              )}
            </div>
          ) : null}
          {owaspDone && owaspSelected !== null && owaspIdx === OWASP_QUESTIONS.length - 1 && (
            <div className="mt-4 rounded-xl border border-mint-400/30 bg-mint-900/10 p-4 text-center">
              <CheckCircle2 className="mx-auto mb-2 text-mint-300" size={24} />
              <p className="text-sm font-semibold text-base-50">
                Você acertou {owaspScore.size} de {OWASP_QUESTIONS.length}
              </p>
              <button onClick={restartOwasp} className="mt-3 flex items-center gap-1.5 mx-auto rounded-lg border border-base-600 px-3 py-1.5 text-xs text-base-300 hover:bg-base-800">
                <RotateCcw size={12} /> Refazer quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
