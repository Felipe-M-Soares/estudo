import { useMemo, useState } from 'react';
import { Play, RotateCcw, Target, CheckCircle2, ListChecks, Wand2, Terminal as TerminalIcon } from 'lucide-react';

type ConsoleLine = { type: 'log' | 'error' | 'return'; text: string };

/**
 * Executa o código JS digitado pelo usuário num sandbox isolado (apenas em memória,
 * nunca toca o DOM real nem faz chamadas de rede), capturando console.log/erros.
 * Usamos `new Function` com um console fake — é JS de verdade rodando no navegador
 * do usuário, sem nenhuma chamada saindo da página.
 */
function runJs(code: string): ConsoleLine[] {
  const lines: ConsoleLine[] = [];
  const fakeConsole = {
    log: (...args: unknown[]) => {
      lines.push({ type: 'log', text: args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ') });
    },
  };
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('console', code);
    fn(fakeConsole);
  } catch (err) {
    lines.push({ type: 'error', text: err instanceof Error ? err.message : String(err) });
  }
  return lines;
}

const PRESETS: { label: string; group: string; code: string }[] = [
  {
    label: 'Loop: somar de 1 a 10',
    group: 'Lógica & Loops',
    code: `let soma = 0;
for (let i = 1; i <= 10; i++) {
  soma += i;
}
console.log("Soma:", soma);`,
  },
  {
    label: 'Condicional: par ou ímpar',
    group: 'Lógica & Loops',
    code: `function parOuImpar(n) {
  if (n % 2 === 0) return "par";
  return "ímpar";
}
console.log(parOuImpar(7));
console.log(parOuImpar(10));`,
  },
  {
    label: 'Recursão: fatorial',
    group: 'Recursão',
    code: `function fatorial(n) {
  if (n <= 1) return 1;
  return n * fatorial(n - 1);
}
console.log("5! =", fatorial(5));`,
  },
  {
    label: 'Busca binária',
    group: 'Recursão',
    code: `function buscaBinaria(arr, alvo) {
  let inicio = 0, fim = arr.length - 1;
  while (inicio <= fim) {
    const meio = Math.floor((inicio + fim) / 2);
    if (arr[meio] === alvo) return meio;
    if (arr[meio] < alvo) inicio = meio + 1;
    else fim = meio - 1;
  }
  return -1;
}
const lista = [1, 3, 5, 7, 9, 11, 13];
console.log("Índice do 9:", buscaBinaria(lista, 9));`,
  },
  {
    label: 'Higher-order function: map/filter',
    group: 'JavaScript moderno',
    code: `const numeros = [1, 2, 3, 4, 5, 6, 7, 8];
const pares = numeros.filter((n) => n % 2 === 0);
const dobrados = pares.map((n) => n * 2);
console.log("Pares:", pares);
console.log("Dobrados:", dobrados);`,
  },
  {
    label: 'Closure: contador privado',
    group: 'JavaScript moderno',
    code: `function criarContador() {
  let contagem = 0;
  return function () {
    contagem++;
    return contagem;
  };
}
const contador = criarContador();
console.log(contador());
console.log(contador());
console.log(contador());`,
  },
  {
    label: 'Destructuring e spread',
    group: 'JavaScript moderno',
    code: `const usuario = { nome: "Ana", idade: 28, cidade: "SP" };
const { nome, ...resto } = usuario;
console.log("Nome:", nome);
console.log("Resto:", resto);

const a = [1, 2, 3];
const b = [...a, 4, 5];
console.log("Array espalhado:", b);`,
  },
  {
    label: 'Async/await simulado',
    group: 'Assíncrono',
    code: `function buscarUsuario() {
  return new Promise((resolve) => {
    resolve({ id: 1, nome: "Bruno" });
  });
}

async function main() {
  console.log("Buscando...");
  const usuario = await buscarUsuario();
  console.log("Encontrado:", usuario);
}

main();`,
  },
];

const GROUPS = Array.from(new Set(PRESETS.map((p) => p.group)));

interface Challenge {
  id: string;
  title: string;
  goal: string;
  hint: string;
  starter: string;
  check: (output: ConsoleLine[], code: string) => boolean;
}

const CHALLENGES: Challenge[] = [
  {
    id: 'fizzbuzz',
    title: 'FizzBuzz até 15',
    goal: 'Imprima os números de 1 a 15. Para múltiplos de 3, imprima "Fizz". Para múltiplos de 5, "Buzz". Para múltiplos de 3 e 5, "FizzBuzz".',
    hint: 'Use um for de 1 a 15 e um if/else if checando o resto da divisão (%) por 15, 3 e 5, nessa ordem.',
    starter: `for (let i = 1; i <= 15; i++) {
  // seu código aqui
}`,
    check: (output) => {
      const text = output.map((l) => l.text).join('\n');
      return text.includes('FizzBuzz') && text.includes('Fizz') && text.includes('Buzz') && output.length >= 15;
    },
  },
  {
    id: 'maior-array',
    title: 'Encontre o maior número',
    goal: 'Dado o array `numeros`, imprima o maior valor dele sem usar Math.max.',
    hint: 'Percorra o array com um loop, guardando numa variável o maior valor visto até agora.',
    starter: `const numeros = [4, 19, 2, 77, 41, 8];
// seu código aqui — imprima o maior valor`,
    check: (output) => output.some((l) => l.text.includes('77')),
  },
  {
    id: 'inverter-string',
    title: 'Inverta uma string',
    goal: 'Imprima a palavra "javascript" invertida ("tpircsavaj"), sem usar .reverse() em string (strings não têm esse método — pense em transformar em array primeiro).',
    hint: '"javascript".split("") transforma a string num array de letras, que aí sim tem .reverse().',
    starter: `const palavra = "javascript";
// seu código aqui`,
    check: (output) => output.some((l) => l.text.includes('tpircsavaj')),
  },
  {
    id: 'closure-banco',
    title: 'Closure: conta bancária privada',
    goal: 'Crie uma função criarConta(saldoInicial) que retorna um objeto com depositar(valor) e verSaldo(), sem expor a variável saldo diretamente. Deposite 50 e depois imprima o saldo.',
    hint: 'O saldo deve ser uma variável dentro da função externa — as funções internas "lembram" dela por closure.',
    starter: `function criarConta(saldoInicial) {
  // seu código aqui
}

const conta = criarConta(100);
conta.depositar(50);
console.log(conta.verSaldo());`,
    check: (output) => output.some((l) => l.text.trim() === '150'),
  },
  {
    id: 'async-sequencia',
    title: 'Duas chamadas assíncronas em sequência',
    goal: 'Use async/await para esperar buscarPedido() terminar, e só depois chamar buscarEntrega() — imprimindo os dois resultados em ordem.',
    hint: 'Dentro de uma função async, "await" pausa a execução até a Promise resolver, sem bloquear o resto da página.',
    starter: `function buscarPedido() {
  return new Promise((resolve) => resolve("Pedido #42"));
}
function buscarEntrega() {
  return new Promise((resolve) => resolve("Entrega prevista: 3 dias"));
}

async function main() {
  // seu código aqui
}
main();`,
    check: (output) => {
      const text = output.map((l) => l.text).join(' | ');
      const iPedido = text.indexOf('Pedido #42');
      const iEntrega = text.indexOf('Entrega prevista');
      return iPedido !== -1 && iEntrega !== -1 && iPedido < iEntrega;
    },
  },
];

const DEFAULT_CODE = PRESETS[0].code;

type SubTab = 'livre' | 'desafio';

export function LogicLab() {
  const [subTab, setSubTab] = useState<SubTab>('livre');
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState<ConsoleLine[]>([]);
  const [ran, setRan] = useState(false);

  const [activeChallenge, setActiveChallenge] = useState<Challenge>(CHALLENGES[0]);
  const [challengeCode, setChallengeCode] = useState(CHALLENGES[0].starter);
  const [challengeOutput, setChallengeOutput] = useState<ConsoleLine[]>([]);
  const [solved, setSolved] = useState<Set<string>>(new Set());

  function execute() {
    setOutput(runJs(code));
    setRan(true);
  }

  function reset() {
    setCode(DEFAULT_CODE);
    setOutput([]);
    setRan(false);
  }

  function pickChallenge(c: Challenge) {
    setActiveChallenge(c);
    setChallengeCode(c.starter);
    setChallengeOutput([]);
  }

  function executeChallenge() {
    const result = runJs(challengeCode);
    setChallengeOutput(result);
    if (activeChallenge.check(result, challengeCode) && !solved.has(activeChallenge.id)) {
      setSolved((prev) => new Set(prev).add(activeChallenge.id));
    }
  }

  const isSolved = useMemo(() => solved.has(activeChallenge.id), [solved, activeChallenge]);

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-1.5">
        <button
          onClick={() => setSubTab('livre')}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
            subTab === 'livre' ? 'bg-cyan-400 text-base-950' : 'bg-base-800 text-base-300'
          }`}
        >
          <Wand2 size={12} /> Playground livre
        </button>
        <button
          onClick={() => setSubTab('desafio')}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
            subTab === 'desafio' ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300'
          }`}
        >
          <Target size={12} /> Modo desafio {solved.size > 0 && `(${solved.size}/${CHALLENGES.length})`}
        </button>
      </div>

      {subTab === 'livre' && (
        <>
          <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 px-4 py-2.5 text-sm text-base-200">
            ⚡ É JavaScript de verdade rodando no seu navegador — nada sai da página. Use{' '}
            <code className="text-mint-300">console.log(...)</code> pra ver resultados abaixo. Bom pra testar loops, recursão,
            closures, async/await e tudo que viu nos módulos de Lógica e JavaScript.
          </div>

          <div className="space-y-2">
            {GROUPS.map((group) => (
              <div key={group} className="flex flex-wrap items-center gap-2">
                <span className="w-32 shrink-0 text-xs text-base-400">{group}:</span>
                {PRESETS.filter((p) => p.group === group).map((p) => (
                  <button
                    key={p.label}
                    onClick={() => { setCode(p.code); setOutput([]); setRan(false); }}
                    className={`rounded-full border px-3 py-1 text-xs hover:bg-base-800 ${
                      code === p.code ? 'border-cyan-400/60 bg-cyan-500/10 text-base-50' : 'border-base-600 text-base-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-base-400">Seu código</p>
              <textarea
                value={code}
                onChange={(e) => { setCode(e.target.value); setRan(false); }}
                spellCheck={false}
                rows={16}
                className="w-full resize-none rounded-xl border border-base-700 bg-base-950/80 p-3 font-mono text-[13px] text-mint-200 outline-none focus:border-cyan-400/60"
              />
              <div className="mt-2 flex gap-2">
                <button onClick={execute} className="flex items-center gap-1.5 rounded-lg bg-cyan-400 px-4 py-2 text-xs font-bold text-base-950 hover:opacity-90">
                  <Play size={12} /> Rodar código
                </button>
                <button onClick={reset} className="flex items-center gap-1.5 rounded-lg border border-base-600 px-3 py-2 text-xs text-base-300 hover:bg-base-800">
                  <RotateCcw size={12} /> Resetar
                </button>
              </div>
            </div>

            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-base-400">
                <TerminalIcon size={12} /> Console
              </p>
              <div className="rounded-xl border border-base-700 bg-base-950 p-3 font-mono text-[12.5px]" style={{ minHeight: '300px' }}>
                {!ran && <p className="text-base-600">Clique em "Rodar código" para ver a saída aqui.</p>}
                {ran && output.length === 0 && <p className="text-base-500">(o código rodou sem nenhum console.log)</p>}
                {output.map((line, i) => (
                  <div key={i} className={line.type === 'error' ? 'whitespace-pre-wrap text-ember-400' : 'whitespace-pre-wrap text-base-200'}>
                    {line.type === 'error' ? `Erro: ${line.text}` : `> ${line.text}`}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {subTab === 'desafio' && (
        <>
          <div className="rounded-xl border border-mint-400/20 bg-mint-900/10 px-4 py-2.5 text-sm text-base-200">
            🎯 Escolha um desafio, escreva o código e clique em rodar — a verificação automática confirma se o resultado bate.
          </div>

          <div className="flex flex-wrap gap-1.5">
            {CHALLENGES.map((c) => (
              <button
                key={c.id}
                onClick={() => pickChallenge(c)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  activeChallenge.id === c.id ? 'border-mint-400/60 bg-mint-400/10 text-base-50' : 'border-base-600 text-base-300 hover:bg-base-800'
                }`}
              >
                {solved.has(c.id) && <CheckCircle2 size={12} className="text-mint-400" />}
                {c.title}
              </button>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <div className="mb-2 flex items-start gap-2 rounded-xl border border-base-700 bg-base-900/60 p-3">
                <ListChecks size={15} className="mt-0.5 shrink-0 text-amber-300" />
                <div>
                  <p className="text-sm font-semibold text-base-50">{activeChallenge.title}</p>
                  <p className="mt-1 text-[12.5px] text-base-300">{activeChallenge.goal}</p>
                </div>
              </div>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-base-400">Seu código</p>
              <textarea
                value={challengeCode}
                onChange={(e) => setChallengeCode(e.target.value)}
                spellCheck={false}
                rows={11}
                className="w-full resize-none rounded-xl border border-base-700 bg-base-950/80 p-3 font-mono text-[13px] text-mint-200 outline-none focus:border-mint-400/60"
              />
              <div className="mt-2 flex gap-2">
                <button onClick={executeChallenge} className="flex items-center gap-1.5 rounded-lg bg-mint-400 px-4 py-2 text-xs font-bold text-base-950 hover:opacity-90">
                  <Play size={12} /> Rodar e verificar
                </button>
              </div>
              <details className="mt-2 text-[12px] text-amber-300">
                <summary className="cursor-pointer select-none">Ver dica</summary>
                <p className="mt-1 text-base-300">{activeChallenge.hint}</p>
              </details>
            </div>

            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-base-400">
                <TerminalIcon size={12} /> Console
              </p>
              <div className="rounded-xl border border-base-700 bg-base-950 p-3 font-mono text-[12.5px]" style={{ minHeight: '220px' }}>
                {challengeOutput.length === 0 && <p className="text-base-600">Rode o código para ver a saída aqui.</p>}
                {challengeOutput.map((line, i) => (
                  <div key={i} className={line.type === 'error' ? 'whitespace-pre-wrap text-ember-400' : 'whitespace-pre-wrap text-base-200'}>
                    {line.type === 'error' ? `Erro: ${line.text}` : `> ${line.text}`}
                  </div>
                ))}
              </div>
              {isSolved ? (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-mint-400/30 bg-mint-900/15 p-3 text-sm text-mint-200">
                  <CheckCircle2 size={16} /> Desafio resolvido! Pode tentar outro acima.
                </div>
              ) : (
                <p className="mt-3 text-[11px] text-base-500">Rode o código pelo menos uma vez — o resultado é verificado automaticamente.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
