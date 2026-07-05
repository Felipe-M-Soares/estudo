import { useState } from 'react';

interface GoChallenge {
  code: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const challenges: GoChallenge[] = [
  {
    code: 'func main() {\n    go fmt.Println("oi")\n    fmt.Println("main")\n}',
    options: [
      '"oi" sempre aparece antes de "main"',
      '"main" pode aparecer sem "oi" nunca aparecer — o programa termina antes da goroutine rodar',
      'Erro de compilação',
      'As duas sempre aparecem juntas, na ordem certa',
    ],
    correctIndex: 1,
    explanation: 'main() não espera goroutines terminarem automaticamente — se main() retornar primeiro, o programa encerra e a goroutine pode nunca chegar a executar.',
  },
  {
    code: 'func dividir(a, b int) (int, error) {\n    if b == 0 {\n        return 0, errors.New("erro")\n    }\n    return a / b, nil\n}\n\nresultado, err := dividir(10, 0)\nfmt.Println(err == nil)',
    options: ['true', 'false', 'Erro de compilação', 'panic'],
    correctIndex: 1,
    explanation: 'Como b é 0, a função retorna um erro não-nil — err == nil é false, indicando que houve falha.',
  },
  {
    code: 'var contador int\nfmt.Println(contador)',
    options: ['undefined', 'null', '0', 'Erro: variável não inicializada'],
    correctIndex: 2,
    explanation: 'Go não tem undefined/null para tipos primitivos — toda variável tem um "valor zero" automático; para int, esse valor é 0.',
  },
  {
    code: 'canal := make(chan int)\ngo func() { canal <- 42 }()\nvalor := <-canal\nfmt.Println(valor)',
    options: ['42', '0', 'Trava para sempre (deadlock)', 'Erro de compilação'],
    correctIndex: 0,
    explanation: 'A goroutine envia 42 pelo canal, e <-canal bloqueia esperando até receber esse valor — funciona corretamente, sem deadlock, porque há exatamente um envio e um recebimento.',
  },
  {
    code: 'func main() {\n    canal := make(chan int)\n    valor := <-canal // ninguém envia nada\n    fmt.Println(valor)\n}',
    options: ['0', 'Trava para sempre (deadlock)', 'nil', 'Erro de compilação'],
    correctIndex: 1,
    explanation: 'Sem nenhuma goroutine enviando pelo canal, <-canal espera indefinidamente — isso é um deadlock, e o Go runtime geralmente detecta e encerra com erro de "all goroutines are asleep".',
  },
];

interface GoConcurrencyGameProps {
  onComplete: (score: number) => void;
}

export function GoConcurrencyGame({ onComplete }: GoConcurrencyGameProps) {
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
        <div className="text-3xl">{pct >= 80 ? '🐹' : '🕵️'}</div>
        <h3 className="mt-2 font-display text-lg font-bold text-base-50">{score}/{challenges.length} previsões corretas</h3>
        <p className="mt-1 text-sm text-base-400">Você entendeu como goroutines e channels se comportam.</p>
        <button onClick={restart} className="mt-4 rounded-lg border border-base-600 px-4 py-2 text-sm text-base-200 hover:bg-base-800">
          Jogar de novo
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl card-surface p-5">
      <h3 className="font-display text-base font-bold text-base-50">🐹 Detetive da Concorrência</h3>
      <p className="mt-1 text-xs text-base-400">Pergunta {idx + 1}/{challenges.length} — o que esse código Go realmente faz?</p>

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
