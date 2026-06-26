import { useState } from 'react';

interface DbChallenge {
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const challenges: DbChallenge[] = [
  {
    scenario: 'Buscar todos os produtos com preço menor que 100 no MongoDB',
    options: [
      'db.produtos.find({ preco: { $lt: 100 } })',
      'db.produtos.find({ preco: < 100 })',
      'SELECT * FROM produtos WHERE preco < 100',
      'db.produtos.where(preco < 100)',
    ],
    correctIndex: 0,
    explanation: 'MongoDB usa operadores prefixados com $ dentro de um objeto de filtro — $lt significa "less than".',
  },
  {
    scenario: 'Guardar o resultado de uma busca cara no Redis, expirando em 5 minutos (300 segundos)',
    options: [
      'redis.set(chave, valor)',
      'redis.setex(chave, 300, valor)',
      'redis.save(chave, valor, 300)',
      'redis.cache(chave, valor)',
    ],
    correctIndex: 1,
    explanation: 'SETEX define um valor com tempo de expiração em segundos — depois desse tempo, o Redis remove a chave automaticamente.',
  },
  {
    scenario: 'Incrementar atomicamente um contador de tentativas de login no Redis',
    options: ['redis.add(chave)', 'redis.plus(chave)', 'redis.incr(chave)', 'redis.sum(chave, 1)'],
    correctIndex: 2,
    explanation: 'INCR incrementa o valor de forma atômica — segura mesmo com múltiplos servidores tentando incrementar a mesma chave ao mesmo tempo.',
  },
  {
    scenario: 'Atualizar o preço de um produto específico no MongoDB',
    options: [
      'db.produtos.updateOne({ nome: "Boné" }, { $set: { preco: 39.90 } })',
      'db.produtos.update({ nome: "Boné" }, preco = 39.90)',
      'UPDATE produtos SET preco = 39.90 WHERE nome = "Boné"',
      'db.produtos.set({ nome: "Boné" }, 39.90)',
    ],
    correctIndex: 0,
    explanation: 'updateOne recebe um filtro e um objeto de operações — $set altera apenas os campos especificados, sem afetar o resto do documento.',
  },
  {
    scenario: 'Você tem 3 instâncias do backend rodando. Onde guardar a sessão de um usuário para que qualquer instância consiga acessá-la?',
    options: [
      'Na memória local de cada instância',
      'Num arquivo no disco de uma das instâncias',
      'No Redis, compartilhado entre todas as instâncias',
      'Em uma variável global do JavaScript',
    ],
    correctIndex: 2,
    explanation: 'Redis é compartilhado entre todas as instâncias do backend — guardar sessão na memória de uma instância específica falha quando a próxima requisição cai numa instância diferente.',
  },
  {
    scenario: 'Adicionar um item numa fila de processamento de emails, usando Redis como fila simples',
    options: ['redis.push(fila, item)', 'redis.lpush(fila, item)', 'redis.queue(fila, item)', 'redis.add(fila, item)'],
    correctIndex: 1,
    explanation: 'LPUSH adiciona um item no início de uma lista Redis — combinado com RPOP (remover do final) no consumidor, forma uma fila simples FIFO.',
  },
];

interface NoSqlCommandGameProps {
  onComplete: (score: number) => void;
}

export function NoSqlCommandGame({ onComplete }: NoSqlCommandGameProps) {
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
        <div className="text-3xl">{pct >= 80 ? '🍃' : '🔍'}</div>
        <h3 className="mt-2 font-display text-lg font-bold text-base-50">{score}/{challenges.length} comandos corretos</h3>
        <p className="mt-1 text-sm text-base-400">Você sabe escolher entre MongoDB e Redis na hora certa.</p>
        <button onClick={restart} className="mt-4 rounded-lg border border-base-600 px-4 py-2 text-sm text-base-200 hover:bg-base-800">
          Jogar de novo
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl card-surface p-5">
      <h3 className="font-display text-base font-bold text-base-50">🍃 Comando Certo</h3>
      <p className="mt-1 text-xs text-base-400">Cenário {idx + 1}/{challenges.length} — escolha o comando correto</p>

      <div className="my-3 rounded-xl border border-base-700 bg-base-900 p-4">
        <p className="text-sm text-base-100">{challenge.scenario}</p>
      </div>

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
              className={`w-full rounded-xl border px-4 py-2.5 text-left font-mono text-[13px] text-base-100 transition-colors ${styles}`}
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
