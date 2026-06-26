import { useState } from 'react';
import { ShieldAlert, ShieldCheck, RotateCcw, Eye, Database, Code2, KeyRound, FileWarning } from 'lucide-react';

// Tudo nesta tela é 100% falso e local — só existe na memória deste componente,
// nunca sai do navegador, não é um servidor real, não representa nenhum
// sistema de verdade. Serve só para demonstrar, de forma segura e isolada,
// como vulnerabilidades comuns funcionam e como se defender delas.

type Mode = 'vulnerable' | 'safe';
type Scenario = 'sqli' | 'xss' | 'password' | 'leak';

const SCENARIOS: { id: Scenario; label: string; icon: typeof Database; color: string }[] = [
  { id: 'sqli', label: 'SQL Injection', icon: Database, color: 'text-ember-300' },
  { id: 'xss', label: 'XSS (script malicioso)', icon: Code2, color: 'text-amber-300' },
  { id: 'password', label: 'Força de senha', icon: KeyRound, color: 'text-cyan-300' },
  { id: 'leak', label: 'Exposição de dados', icon: FileWarning, color: 'text-mint-300' },
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

  function changeScenario(s: Scenario) {
    setScenario(s);
    setSqliResult(null);
    setPostedComments([]);
    setApiResult(null);
    setShowHint(false);
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

      {(scenario === 'sqli' || scenario === 'xss' || scenario === 'leak') && (
        <div className="flex justify-center gap-1.5">
          <button
            onClick={() => { setMode('vulnerable'); reset(); }}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${mode === 'vulnerable' ? 'bg-ember-500 text-white' : 'bg-base-800 text-base-300'}`}
          >
            <ShieldAlert size={12} /> Versão vulnerável
          </button>
          <button
            onClick={() => { setMode('safe'); reset(); }}
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
    </div>
  );
}
