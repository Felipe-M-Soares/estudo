import { useState } from 'react';

interface TerminalChallenge {
  scenario: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  expectedCommand: string;
  acceptableAlternatives?: string[];
  hint: string;
  explanation: string;
}

const challenges: TerminalChallenge[] = [
  {
    scenario: 'Você editou arquivos e quer adicionar TODOS eles para o próximo commit.',
    difficulty: 'Fácil',
    expectedCommand: 'git add .',
    hint: 'O comando "add" seguido de um símbolo que significa "tudo no diretório atual".',
    explanation: '`git add .` adiciona todas as mudanças do diretório atual à área de staging, preparando-as para o commit.',
  },
  {
    scenario: 'Você já adicionou os arquivos. Agora registre o commit com a mensagem "corrige bug do login".',
    difficulty: 'Fácil',
    expectedCommand: 'git commit -m "corrige bug do login"',
    hint: 'O comando "commit" precisa da flag -m seguida da mensagem entre aspas.',
    explanation: '`git commit -m "mensagem"` cria um novo commit com a mensagem fornecida, registrando uma fotografia do estado atual do projeto.',
  },
  {
    scenario: 'Crie uma nova branch chamada "feature/perfil" E já mude para ela, em um único comando.',
    difficulty: 'Médio',
    expectedCommand: 'git checkout -b feature/perfil',
    acceptableAlternatives: ['git switch -c feature/perfil'],
    hint: 'O comando "checkout" tem uma flag que cria a branch antes de mudar para ela.',
    explanation: '`git checkout -b nome` cria a branch "nome" e move você para ela imediatamente — equivalente a "git branch nome" seguido de "git checkout nome".',
  },
  {
    scenario: 'Envie sua branch local "feature/perfil" para o repositório remoto "origin".',
    difficulty: 'Médio',
    expectedCommand: 'git push origin feature/perfil',
    hint: 'O comando "push" precisa do nome do remoto e do nome da branch.',
    explanation: '`git push origin nome-da-branch` envia os commits locais daquela branch para o repositório remoto chamado "origin".',
  },
  {
    scenario: 'Veja o histórico de commits de forma resumida, uma linha por commit.',
    difficulty: 'Médio',
    expectedCommand: 'git log --oneline',
    hint: 'O comando "log" tem uma flag que condensa cada commit em uma única linha.',
    explanation: '`git log --oneline` mostra um histórico compacto, com hash curto e mensagem de cada commit em uma única linha — muito mais fácil de visualizar que o log completo.',
  },
  {
    scenario: 'Você commitou na branch errada por engano. Descubra como desfazer o ÚLTIMO commit, mantendo as mudanças nos arquivos (sem perdê-las).',
    difficulty: 'Difícil',
    expectedCommand: 'git reset --soft HEAD~1',
    hint: 'O comando "reset" com a flag --soft desfaz o commit, mas preserva as mudanças nos arquivos.',
    explanation: '`git reset --soft HEAD~1` volta um commit atrás, mas mantém todas as mudanças daquele commit na área de staging — nada é perdido, só o commit em si é desfeito.',
  },
  {
    scenario: 'Liste todas as branches locais do repositório.',
    difficulty: 'Fácil',
    expectedCommand: 'git branch',
    hint: 'O comando "branch" sem nenhum argumento já lista todas as branches locais.',
    explanation: '`git branch` (sem argumentos) lista todas as branches locais, marcando com um asterisco (*) a branch em que você está atualmente.',
  },
];

const difficultyColor: Record<TerminalChallenge['difficulty'], string> = {
  Fácil: 'text-mint-400 bg-mint-900/30',
  Médio: 'text-amber-400 bg-amber-500/15',
  Difícil: 'text-ember-400 bg-ember-500/15',
};

interface TerminalSimulatorGameProps {
  onComplete: (score: number) => void;
}

export function TerminalSimulatorGame({ onComplete }: TerminalSimulatorGameProps) {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ cmd: string; correct: boolean }[]>([]);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  const challenge = challenges[idx];

  function normalize(s: string): string {
    return s.trim().replace(/\s+/g, ' ').replace(/'/g, '"');
  }

  function handleSubmit() {
    if (!input.trim() || revealed) return;
    const userCmd = normalize(input);
    const matches =
      normalize(challenge.expectedCommand) === userCmd ||
      (challenge.acceptableAlternatives ?? []).some((alt) => normalize(alt) === userCmd);

    setHistory((h) => [...h, { cmd: input, correct: matches }]);
    setRevealed(true);
    if (matches) setScore((s) => s + 1);

    setTimeout(() => {
      if (idx + 1 < challenges.length) {
        setIdx((i) => i + 1);
        setInput('');
        setRevealed(false);
        setShowHint(false);
      } else {
        setFinished(true);
        onComplete(Math.round(((matches ? score + 1 : score) / challenges.length) * 100));
      }
    }, 1800);
  }

  function restart() {
    setIdx(0);
    setInput('');
    setHistory([]);
    setScore(0);
    setShowHint(false);
    setRevealed(false);
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((score / challenges.length) * 100);
    return (
      <div className="rounded-2xl card-surface p-6 text-center">
        <div className="text-3xl">{pct >= 80 ? '🏆' : '⌨️'}</div>
        <h3 className="mt-2 font-display text-lg font-bold text-base-50">{score}/{challenges.length} comandos corretos</h3>
        <p className="mt-1 text-sm text-base-400">{pct}% de acerto no terminal</p>
        <button onClick={restart} className="mt-4 rounded-lg border border-base-600 px-4 py-2 text-sm text-base-200 hover:bg-base-800">
          Jogar de novo
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl card-surface p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-base font-bold text-base-50">⌨️ Terminal Simulado</h3>
          <p className="text-xs text-base-400">Desafio {idx + 1}/{challenges.length}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${difficultyColor[challenge.difficulty]}`}>
          {challenge.difficulty}
        </span>
      </div>

      <p className="mb-3 text-sm text-amber-300">{challenge.scenario}</p>

      <div className="rounded-xl border border-base-700 bg-base-950/80 p-3 font-mono text-[13px] shadow-inner">
        {history.slice(0, -1).slice(-2).map((h, i) => (
          <div key={i} className="mb-1 opacity-50">
            <span className="text-mint-400">$</span> <span className="text-base-200">{h.cmd}</span>
          </div>
        ))}
        {revealed ? (
          <div className="mb-1">
            <span className="text-mint-400">$</span> <span className="text-base-200">{history[history.length - 1]?.cmd}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-mint-400">$</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              autoFocus
              placeholder="digite o comando..."
              className="flex-1 bg-transparent text-base-100 outline-none placeholder:text-base-600"
            />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        {!revealed && (
          <>
            <button onClick={handleSubmit} disabled={!input.trim()} className="rounded-lg bg-mint-400 px-4 py-2 text-sm font-semibold text-base-950 disabled:opacity-40">
              Executar
            </button>
            <button onClick={() => setShowHint((s) => !s)} className="rounded-lg border border-base-600 px-3 py-2 text-sm text-base-300 hover:bg-base-800">
              💡 Dica
            </button>
          </>
        )}
      </div>

      {showHint && !revealed && <p className="mt-2 text-xs text-amber-300">{challenge.hint}</p>}

      {revealed && (
        <div
          className={`mt-3 rounded-xl border p-3 text-sm ${
            history[history.length - 1]?.correct
              ? 'border-mint-400/30 bg-mint-900/20 text-mint-200'
              : 'border-ember-400/30 bg-ember-500/10 text-ember-300'
          }`}
        >
          <p className="mb-1 font-semibold">
            {history[history.length - 1]?.correct ? '✅ Comando correto!' : (
              <>❌ Comando esperado: <code className="font-mono">{challenge.expectedCommand}</code></>
            )}
          </p>
          <p className="text-base-200">{challenge.explanation}</p>
        </div>
      )}
    </div>
  );
}
