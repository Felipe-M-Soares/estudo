import { useEffect, useState } from 'react';

interface MemorySet {
  title: string;
  pairs: { term: string; def: string }[];
}

const sets: MemorySet[] = [
  {
    title: 'Fundamentos',
    pairs: [
      { term: 'Pilha', def: 'LIFO: último a entrar, primeiro a sair' },
      { term: 'Fila', def: 'FIFO: primeiro a entrar, primeiro a sair' },
      { term: 'Recursão', def: 'Função que chama a si mesma' },
      { term: 'Big O', def: 'Notação de crescimento de algoritmos' },
      { term: 'Closure', def: 'Função que lembra variáveis externas' },
      { term: 'Array', def: 'Lista numerada de itens' },
    ],
  },
  {
    title: 'Backend & APIs',
    pairs: [
      { term: 'JWT', def: 'Token assinado para autenticação' },
      { term: 'Middleware', def: 'Função executada entre requisição e rota' },
      { term: 'REST', def: 'Estilo de API baseado em verbos HTTP' },
      { term: 'GraphQL', def: 'Cliente pede exatamente os campos que quer' },
      { term: 'Rate Limit', def: 'Restringe número de requisições por tempo' },
      { term: 'Idempotência', def: 'Mesmo resultado em múltiplas execuções' },
    ],
  },
  {
    title: 'Infra & Cloud',
    pairs: [
      { term: 'Docker', def: 'Empacota app com tudo que ela precisa' },
      { term: 'Kubernetes', def: 'Orquestra containers em escala' },
      { term: 'CI/CD', def: 'Automatiza teste e entrega de código' },
      { term: 'Load Balancer', def: 'Distribui tráfego entre servidores' },
      { term: 'CDN', def: 'Aproxima conteúdo estático do usuário' },
      { term: 'Auto Scaling', def: 'Ajusta capacidade conforme demanda' },
    ],
  },
];

interface Card {
  id: string;
  label: string;
  pairId: number;
  kind: 'term' | 'def';
}

function buildCards(setIdx: number): Card[] {
  const set = sets[setIdx];
  const cards: Card[] = [];
  set.pairs.forEach((p, i) => {
    cards.push({ id: `t-${i}`, label: p.term, pairId: i, kind: 'term' });
    cards.push({ id: `d-${i}`, label: p.def, pairId: i, kind: 'def' });
  });
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

interface MemoryGameProps {
  onComplete: (score: number) => void;
}

export function MemoryGame({ onComplete }: MemoryGameProps) {
  const [setIdx, setSetIdx] = useState(0);
  const [cards, setCards] = useState<Card[]>(() => buildCards(0));
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  const allMatched = matched.length === cards.length;

  useEffect(() => {
    if (allMatched && cards.length > 0) {
      const score = Math.max(100 - (moves - cards.length / 2) * 5, 30);
      onComplete(Math.round(score));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMatched]);

  function handleFlip(card: Card) {
    if (locked || flipped.includes(card.id) || matched.includes(card.id)) return;
    const next = [...flipped, card.id];
    setFlipped(next);

    if (next.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);
      const [firstId, secondId] = next;
      const first = cards.find((c) => c.id === firstId)!;
      const second = cards.find((c) => c.id === secondId)!;

      if (first.pairId === second.pairId && first.kind !== second.kind) {
        setTimeout(() => {
          setMatched((m) => [...m, firstId, secondId]);
          setFlipped([]);
          setLocked(false);
        }, 500);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 900);
      }
    }
  }

  function changeSet(idx: number) {
    setSetIdx(idx);
    setCards(buildCards(idx));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLocked(false);
  }

  function restart() {
    changeSet(setIdx);
  }

  return (
    <div className="rounded-2xl card-surface p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-base font-bold text-base-50">🧠 Memória de Conceitos</h3>
          <p className="text-xs text-base-400">Encontre os pares de termo + definição — {sets[setIdx].title}</p>
        </div>
        <span className="mono-num text-xs text-base-400">{moves} jogadas</span>
      </div>

      <div className="mb-4 flex gap-1.5">
        {sets.map((s, i) => (
          <button
            key={s.title}
            onClick={() => changeSet(i)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              setIdx === i ? 'bg-violet-400 text-base-950' : 'bg-base-800 text-base-300 hover:bg-base-700'
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
          const isMatched = matched.includes(card.id);
          return (
            <button
              key={card.id}
              onClick={() => handleFlip(card)}
              disabled={isFlipped}
              className={`flex h-20 items-center justify-center rounded-lg border p-2 text-center text-[11px] font-medium leading-snug transition-all ${
                isMatched
                  ? 'border-mint-400/50 bg-mint-900/30 text-mint-200'
                  : isFlipped
                  ? card.kind === 'term'
                    ? 'border-amber-400/50 bg-amber-500/15 text-amber-100'
                    : 'border-violet-400/50 bg-violet-500/15 text-violet-100'
                  : 'border-base-600 bg-base-800 text-transparent hover:border-base-500'
              }`}
            >
              {isFlipped ? card.label : '?'}
            </button>
          );
        })}
      </div>

      {allMatched && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-mint-400/30 bg-mint-900/20 p-3 text-sm text-mint-200">
          <span>🎉 Todos os pares encontrados em {moves} jogadas!</span>
          <button onClick={restart} className="rounded-lg bg-mint-400 px-3 py-1.5 text-xs font-semibold text-base-950">
            Jogar de novo
          </button>
        </div>
      )}
    </div>
  );
}
