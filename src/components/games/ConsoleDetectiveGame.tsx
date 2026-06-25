import { useState } from 'react';

interface ConsoleChallenge {
  code: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const challenges: ConsoleChallenge[] = [
  {
    code: 'console.log(typeof null)',
    options: ['"null"', '"object"', '"undefined"', '"boolean"'],
    correctIndex: 1,
    explanation: 'Isso é uma peculiaridade histórica do JavaScript: `typeof null` retorna `"object"`, não `"null"`.',
  },
  {
    code: 'console.log(1 + "1")',
    options: ['2', '"11"', 'NaN', 'undefined'],
    correctIndex: 1,
    explanation: 'O operador `+` com uma string converte o número para string e concatena: "1" + "1" = "11".',
  },
  {
    code: 'console.log([1,2,3].map(x => x * 2))',
    options: ['[2,4,6]', '[1,2,3,1,2,3]', 'NaN', '6'],
    correctIndex: 0,
    explanation: '`.map()` cria um novo array aplicando a função a cada elemento, sem modificar o original.',
  },
  {
    code: 'console.log(0.1 + 0.2 === 0.3)',
    options: ['true', 'false', 'undefined', 'Erro'],
    correctIndex: 1,
    explanation: 'Por causa de imprecisão de ponto flutuante, 0.1 + 0.2 resulta em 0.30000000000000004, não exatamente 0.3.',
  },
  {
    code: 'let x;\nconsole.log(x ?? "padrão")',
    options: ['undefined', '"padrão"', 'null', 'Erro'],
    correctIndex: 1,
    explanation: 'O operador `??` (nullish coalescing) retorna o valor da direita quando a esquerda é `null` ou `undefined`.',
  },
  {
    code: 'console.log([..."abc"])',
    options: ['"abc"', "['a','b','c']", 'Erro', 'undefined'],
    correctIndex: 1,
    explanation: 'Strings são iteráveis, então o spread operator as transforma em um array de caracteres individuais.',
  },
  {
    code: 'function criarContador() {\n  let c = 0;\n  return () => ++c;\n}\nconst contar = criarContador();\ncontar();\nconsole.log(contar())',
    options: ['1', '2', 'undefined', 'Erro'],
    correctIndex: 1,
    explanation: 'Closure: a função retornada mantém acesso à variável "c" entre chamadas. A primeira chamada de contar() incrementa para 1 (não exibida), a segunda para 2 (exibida).',
  },
  {
    code: 'console.log([1, [2, 3], [4, [5]]].flat(Infinity))',
    options: ['[1, 2, 3, 4, 5]', '[1, [2,3], [4,[5]]]', 'Erro', '5'],
    correctIndex: 0,
    explanation: '`.flat(Infinity)` achata arrays aninhados em qualquer profundidade, resultando em um único array sem sub-arrays.',
  },
  {
    code: 'const obj = { nome: "Ana" };\nconst { nome, idade = 30 } = obj;\nconsole.log(idade)',
    options: ['undefined', '30', 'Erro', 'null'],
    correctIndex: 1,
    explanation: 'Destructuring permite definir um valor padrão (= 30) que é usado quando a propriedade não existe no objeto original.',
  },
  {
    code: 'console.log(typeof NaN)',
    options: ['"NaN"', '"number"', '"undefined"', '"object"'],
    correctIndex: 1,
    explanation: 'Apesar do nome "Not a Number", NaN é tecnicamente do tipo "number" em JavaScript — uma das peculiaridades mais citadas da linguagem.',
  },
];

interface ConsoleDetectiveGameProps {
  onComplete: (score: number) => void;
}

export function ConsoleDetectiveGame({ onComplete }: ConsoleDetectiveGameProps) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const challenge = challenges[idx];

  function answer(i: number) {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === challenge.correctIndex;
    if (correct) setScore((s) => s + 1);

    setTimeout(() => {
      if (idx + 1 < challenges.length) {
        setIdx((v) => v + 1);
        setSelected(null);
      } else {
        setFinished(true);
        onComplete(Math.round(((correct ? score + 1 : score) / challenges.length) * 100));
      }
    }, 1600);
  }

  if (finished) {
    return (
      <div className="rounded-2xl card-surface p-6 text-center">
        <div className="text-3xl">🕵️</div>
        <h3 className="mt-2 font-display text-lg font-bold text-base-50">{score}/{challenges.length} previsões corretas</h3>
        <p className="mt-1 text-sm text-base-400">Você decifrou as pegadinhas do JavaScript.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl card-surface p-5">
      <h3 className="font-display text-base font-bold text-base-50">🕵️ Detetive do Console</h3>
      <p className="mt-1 text-xs text-base-400">Pergunta {idx + 1}/{challenges.length} — qual é a saída exata?</p>

      <pre className="my-3 overflow-x-auto rounded-xl border border-base-700 bg-base-900 p-4">
        <code className="font-mono text-[13px] leading-relaxed text-mint-200 whitespace-pre-wrap">{challenge.code}</code>
      </pre>

      <div className="space-y-2">
        {challenge.options.map((opt, i) => {
          const isCorrect = i === challenge.correctIndex;
          const isSelected = i === selected;
          let styles = 'border-base-600 hover:border-base-500 hover:bg-base-800';
          if (selected !== null) {
            if (isCorrect) styles = 'border-mint-400/60 bg-mint-900/30';
            else if (isSelected) styles = 'border-ember-400/60 bg-ember-500/10';
            else styles = 'border-base-700 opacity-50';
          }
          return (
            <button
              key={i}
              onClick={() => answer(i)}
              disabled={selected !== null}
              className={`w-full rounded-xl border px-4 py-2.5 text-left font-mono text-sm text-base-100 transition-colors ${styles}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div
          className={`mt-3 rounded-xl border p-3 text-sm ${
            selected === challenge.correctIndex
              ? 'border-mint-400/30 bg-mint-900/20 text-mint-200'
              : 'border-ember-400/30 bg-ember-500/10 text-ember-300'
          }`}
        >
          {challenge.explanation}
        </div>
      )}
    </div>
  );
}
