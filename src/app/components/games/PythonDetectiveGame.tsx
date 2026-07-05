import { useState } from 'react';

interface PyChallenge {
  code: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const challenges: PyChallenge[] = [
  {
    code: 'numeros = [1, 2, 3]\nprint(numeros * 2)',
    options: ['[2, 4, 6]', '[1, 2, 3, 1, 2, 3]', '[1, 2, 3, 2]', 'Erro'],
    correctIndex: 1,
    explanation: 'Multiplicar uma lista por um número repete a lista inteira aquele número de vezes — não multiplica cada elemento (isso seria feito com list comprehension).',
  },
  {
    code: 'def f(a, lista=[]):\n    lista.append(a)\n    return lista\n\nprint(f(1))\nprint(f(2))',
    options: ['[1] depois [2]', '[1] depois [1, 2]', '[1, 2] nas duas vezes', 'Erro'],
    correctIndex: 1,
    explanation: 'Listas como valor padrão em Python são criadas UMA VEZ, na definição da função, e reutilizadas entre chamadas — uma das pegadinhas mais famosas da linguagem.',
  },
  {
    code: 'print(3 / 2)\nprint(3 // 2)',
    options: ['1.5 e 1', '1 e 1.5', '1.5 e 1.5', '1 e 1'],
    correctIndex: 0,
    explanation: '/ sempre retorna float (divisão real); // é divisão inteira, descartando o resto (floor division).',
  },
  {
    code: 'texto = "python"\nprint(texto[-1])',
    options: ['Erro', '"p"', '"n"', 'undefined'],
    correctIndex: 2,
    explanation: 'Índices negativos em Python contam a partir do final — texto[-1] é o último caractere, "n".',
  },
  {
    code: 'a = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)',
    options: ['[1, 2, 3]', '[1, 2, 3, 4]', 'Erro', '[4]'],
    correctIndex: 1,
    explanation: 'b = a não copia a lista, só cria outra referência para o mesmo objeto — modificar b também modifica a.',
  },
  {
    code: 'print(type(5) == int)\nprint(isinstance(5, int))',
    options: ['False e False', 'True e True', 'False e True', 'True e False'],
    correctIndex: 1,
    explanation: 'Ambas confirmam que 5 é int, mas isinstance é geralmente preferido porque também funciona corretamente com herança de classes.',
  },
];

interface PythonDetectiveGameProps {
  onComplete: (score: number) => void;
}

export function PythonDetectiveGame({ onComplete }: PythonDetectiveGameProps) {
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
        <div className="text-3xl">{pct >= 80 ? '🐍' : '🕵️'}</div>
        <h3 className="mt-2 font-display text-lg font-bold text-base-50">{score}/{challenges.length} previsões corretas</h3>
        <p className="mt-1 text-sm text-base-400">Você decifrou as pegadinhas do Python.</p>
        <button onClick={restart} className="mt-4 rounded-lg border border-base-600 px-4 py-2 text-sm text-base-200 hover:bg-base-800">
          Jogar de novo
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl card-surface p-5">
      <h3 className="font-display text-base font-bold text-base-50">🐍 Detetive Python</h3>
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
