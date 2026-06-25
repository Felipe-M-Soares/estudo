import { useState } from 'react';

interface BugChallenge {
  title: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  lines: string[];
  buggyLineIndex: number;
  explanation: string;
}

const challenges: BugChallenge[] = [
  {
    title: 'Função de soma',
    difficulty: 'Fácil',
    lines: [
      'function somar(a, b) {',
      '  retun a + b;',
      '}',
    ],
    buggyLineIndex: 1,
    explanation: '"retun" está com erro de digitação — deveria ser "return". JavaScript não reconhece "retun" como palavra-chave.',
  },
  {
    title: 'Verificação de idade',
    difficulty: 'Fácil',
    lines: [
      'function podeVotar(idade) {',
      '  if (idade = 16) {',
      '    return true;',
      '  }',
      '  return false;',
      '}',
    ],
    buggyLineIndex: 1,
    explanation: '`=` é atribuição, não comparação. O correto seria `idade >= 16` (ou `===` se fosse comparar igualdade exata) — usar `=` aqui sobrescreve o valor de idade silenciosamente.',
  },
  {
    title: 'Loop que nunca termina',
    difficulty: 'Médio',
    lines: [
      'function contarAte(n) {',
      '  let i = 0;',
      '  while (i < n) {',
      '    console.log(i);',
      '  }',
      '}',
    ],
    buggyLineIndex: 3,
    explanation: 'Falta incrementar "i" dentro do loop (ex: `i++`). Sem isso, a condição `i < n` nunca muda e o loop roda para sempre.',
  },
  {
    title: 'Comparação de arrays',
    difficulty: 'Médio',
    lines: [
      'const a = [1, 2, 3];',
      'const b = [1, 2, 3];',
      'if (a === b) {',
      '  console.log("Iguais");',
      '}',
    ],
    buggyLineIndex: 2,
    explanation: '`===` compara referências de objetos/arrays, não conteúdo. Dois arrays com os mesmos valores, mas criados separadamente, nunca são "===" iguais — seria necessário comparar elemento por elemento ou usar JSON.stringify.',
  },
  {
    title: 'Busca de usuário por ID',
    difficulty: 'Médio',
    lines: [
      'async function buscarUsuario(id) {',
      '  const resposta = fetch(`/api/usuarios/${id}`);',
      '  const dados = await resposta.json();',
      '  return dados;',
      '}',
    ],
    buggyLineIndex: 1,
    explanation: 'Falta o `await` antes de `fetch(...)`. Sem ele, "resposta" é uma Promise pendente, não o objeto de resposta — chamar `.json()` nela vai falhar.',
  },
  {
    title: 'Atualização de estado em React',
    difficulty: 'Difícil',
    lines: [
      'function Contador() {',
      '  const [count, setCount] = useState(0);',
      '  count = count + 1;',
      '  return <button onClick={() => setCount(count + 1)}>{count}</button>;',
      '}',
    ],
    buggyLineIndex: 2,
    explanation: 'Estado do React nunca deve ser modificado diretamente (`count = count + 1`). Mudanças de estado sempre devem passar pela função setter (`setCount`), senão o React não sabe que precisa re-renderizar.',
  },
  {
    title: 'Filtro de produtos em estoque',
    difficulty: 'Difícil',
    lines: [
      'function produtosEmEstoque(produtos) {',
      '  return produtos.filter(p => {',
      '    p.estoque > 0',
      '  });',
      '}',
    ],
    buggyLineIndex: 2,
    explanation: 'Falta o `return` dentro do corpo da arrow function com chaves `{}`. Sem ele, a função de callback do filter sempre retorna `undefined` (que é "falsy"), removendo todos os itens.',
  },
];

const difficultyColor: Record<BugChallenge['difficulty'], string> = {
  Fácil: 'text-mint-400 bg-mint-900/30',
  Médio: 'text-amber-400 bg-amber-500/15',
  Difícil: 'text-ember-400 bg-ember-500/15',
};

interface BugHunterGameProps {
  onComplete: (score: number) => void;
}

export function BugHunterGame({ onComplete }: BugHunterGameProps) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const challenge = challenges[idx];

  function selectLine(lineIdx: number) {
    if (selected !== null) return;
    setSelected(lineIdx);
    const correct = lineIdx === challenge.buggyLineIndex;
    if (correct) setScore((s) => s + 1);

    setTimeout(() => {
      if (idx + 1 < challenges.length) {
        setIdx((i) => i + 1);
        setSelected(null);
      } else {
        setFinished(true);
        onComplete(Math.round(((correct ? score + 1 : score) / challenges.length) * 100));
      }
    }, 1800);
  }

  function restart() {
    setIdx(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((score / challenges.length) * 100);
    return (
      <div className="rounded-2xl card-surface p-6 text-center">
        <div className="text-3xl">{pct >= 80 ? '🏆' : pct >= 50 ? '🔍' : '🐛'}</div>
        <h3 className="mt-2 font-display text-lg font-bold text-base-50">{score}/{challenges.length} bugs encontrados</h3>
        <p className="mt-1 text-sm text-base-400">{pct}% de acerto na caça aos bugs</p>
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
          <h3 className="font-display text-base font-bold text-base-50">🐛 Caça-Bug</h3>
          <p className="text-xs text-base-400">{challenge.title} — clique na linha com o erro</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${difficultyColor[challenge.difficulty]}`}>
          {challenge.difficulty}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-base-700 bg-base-950/60">
        {challenge.lines.map((line, i) => {
          const isBuggy = i === challenge.buggyLineIndex;
          const isSelected = i === selected;
          let styles = 'hover:bg-base-800/60';
          if (selected !== null) {
            if (isBuggy) styles = 'bg-mint-900/30';
            else if (isSelected) styles = 'bg-ember-500/15';
          }
          return (
            <button
              key={i}
              onClick={() => selectLine(i)}
              disabled={selected !== null}
              className={`flex w-full items-start gap-3 px-4 py-1.5 text-left font-mono text-[13px] transition-colors ${styles} ${
                selected !== null ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <span className="w-5 shrink-0 text-base-500">{i + 1}</span>
              <span className="whitespace-pre text-base-100">{line}</span>
              {selected !== null && isBuggy && <span className="ml-auto shrink-0 text-mint-400">🐛</span>}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div
          className={`mt-3 rounded-xl border p-3 text-sm ${
            selected === challenge.buggyLineIndex
              ? 'border-mint-400/30 bg-mint-900/20 text-mint-200'
              : 'border-ember-400/30 bg-ember-500/10 text-ember-300'
          }`}
        >
          <p className="mb-1 font-semibold">
            {selected === challenge.buggyLineIndex ? '✅ Encontrou o bug!' : '❌ Não era essa linha.'}
          </p>
          <p className="text-base-200">{challenge.explanation}</p>
        </div>
      )}
    </div>
  );
}
