import { useMemo, useState } from 'react';

interface FlexChallenge {
  goal: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  itemCount: number;
  targetJustify: string;
  targetAlign: string;
  targetDirection: string;
  targetWrap?: string;
  targetGap?: number;
}

const challenges: FlexChallenge[] = [
  {
    goal: 'Centralize os itens horizontalmente E verticalmente',
    difficulty: 'Fácil',
    itemCount: 3,
    targetJustify: 'center',
    targetAlign: 'center',
    targetDirection: 'row',
  },
  {
    goal: 'Distribua os itens nas duas pontas, com espaço entre eles',
    difficulty: 'Fácil',
    itemCount: 3,
    targetJustify: 'space-between',
    targetAlign: 'center',
    targetDirection: 'row',
  },
  {
    goal: 'Empilhe os itens em coluna, alinhados à direita',
    difficulty: 'Fácil',
    itemCount: 3,
    targetJustify: 'flex-start',
    targetAlign: 'flex-end',
    targetDirection: 'column',
  },
  {
    goal: 'Itens ao final do eixo principal, esticados no eixo cruzado',
    difficulty: 'Médio',
    itemCount: 3,
    targetJustify: 'flex-end',
    targetAlign: 'stretch',
    targetDirection: 'row',
  },
  {
    goal: 'Itens distribuídos com espaço igual ao redor de cada um, com 16px de espaçamento entre eles',
    difficulty: 'Médio',
    itemCount: 4,
    targetJustify: 'space-around',
    targetAlign: 'center',
    targetDirection: 'row',
    targetGap: 16,
  },
  {
    goal: 'Muitos itens numa linha — permita que quebrem para a próxima linha quando não couberem',
    difficulty: 'Difícil',
    itemCount: 8,
    targetJustify: 'flex-start',
    targetAlign: 'flex-start',
    targetDirection: 'row',
    targetWrap: 'wrap',
  },
  {
    goal: 'Coluna centralizada, com 24px de espaçamento entre cada item',
    difficulty: 'Difícil',
    itemCount: 4,
    targetJustify: 'center',
    targetAlign: 'center',
    targetDirection: 'column',
    targetGap: 24,
  },
];

const difficultyColor: Record<FlexChallenge['difficulty'], string> = {
  Fácil: 'text-mint-400 bg-mint-900/30',
  Médio: 'text-amber-400 bg-amber-500/15',
  Difícil: 'text-ember-400 bg-ember-500/15',
};

const justifyOptions = ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'];
const alignOptions = ['flex-start', 'center', 'flex-end', 'stretch'];
const directionOptions = ['row', 'column'];
const wrapOptions = ['nowrap', 'wrap'];
const gapOptions = [0, 8, 16, 24];

interface FlexboxDojoGameProps {
  onComplete: (score: number) => void;
}

export function FlexboxDojoGame({ onComplete }: FlexboxDojoGameProps) {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [justify, setJustify] = useState('flex-start');
  const [align, setAlign] = useState('flex-start');
  const [direction, setDirection] = useState('row');
  const [wrap, setWrap] = useState('nowrap');
  const [gap, setGap] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [finished, setFinished] = useState(false);

  const challenge = challenges[challengeIdx];
  const needsWrap = challenge.targetWrap !== undefined;
  const needsGap = challenge.targetGap !== undefined;

  const isCorrect = useMemo(() => {
    const base = justify === challenge.targetJustify && align === challenge.targetAlign && direction === challenge.targetDirection;
    const wrapOk = !needsWrap || wrap === challenge.targetWrap;
    const gapOk = !needsGap || gap === challenge.targetGap;
    return base && wrapOk && gapOk;
  }, [justify, align, direction, wrap, gap, challenge, needsWrap, needsGap]);

  function resetControls() {
    setJustify('flex-start');
    setAlign('flex-start');
    setDirection('row');
    setWrap('nowrap');
    setGap(0);
  }

  function check() {
    if (isCorrect) {
      setFeedback('correct');
      const newSolved = solvedCount + 1;
      setSolvedCount(newSolved);
      setTimeout(() => {
        if (challengeIdx + 1 < challenges.length) {
          setChallengeIdx((i) => i + 1);
          resetControls();
          setFeedback(null);
        } else {
          setFinished(true);
          onComplete(Math.round((newSolved / challenges.length) * 100));
        }
      }, 1000);
    } else {
      setFeedback('wrong');
    }
  }

  function restart() {
    setChallengeIdx(0);
    resetControls();
    setSolvedCount(0);
    setFeedback(null);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="rounded-2xl card-surface p-6 text-center">
        <div className="text-3xl">🤸</div>
        <h3 className="mt-2 font-display text-lg font-bold text-base-50">{solvedCount}/{challenges.length} desafios resolvidos</h3>
        <p className="mt-1 text-sm text-base-400">Você passou por justify-content, align-items, wrap e gap.</p>
        <button onClick={restart} className="mt-4 rounded-lg border border-base-600 px-4 py-2 text-sm text-base-200 hover:bg-base-800">
          Jogar de novo
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl card-surface p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-base font-bold text-base-50">🤸 Dojo do Flexbox</h3>
          <p className="text-xs text-base-400">
            Desafio {challengeIdx + 1}/{challenges.length}: <span className="text-amber-300">{challenge.goal}</span>
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${difficultyColor[challenge.difficulty]}`}>
          {challenge.difficulty}
        </span>
      </div>

      <div
        className="flex h-44 overflow-auto rounded-xl border-2 border-dashed border-base-600 bg-base-900 p-3"
        style={{
          flexDirection: direction as 'row' | 'column',
          justifyContent: justify,
          alignItems: align,
          flexWrap: wrap as 'nowrap' | 'wrap',
          gap: `${gap}px`,
        }}
      >
        {Array.from({ length: challenge.itemCount }, (_, i) => i + 1).map((n) => (
          <div key={n} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-mint-400 font-mono text-xs font-bold text-base-950">
            {n}
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Selector label="justify-content" value={justify} options={justifyOptions} onChange={setJustify} />
        <Selector label="align-items" value={align} options={alignOptions} onChange={setAlign} />
        <Selector label="flex-direction" value={direction} options={directionOptions} onChange={setDirection} />
        {needsWrap && <Selector label="flex-wrap" value={wrap} options={wrapOptions} onChange={setWrap} />}
        {needsGap && (
          <Selector label="gap" value={String(gap)} options={gapOptions.map(String)} onChange={(v) => setGap(Number(v))} />
        )}
      </div>

      <button onClick={check} className="mt-4 rounded-lg bg-mint-400 px-4 py-2 text-sm font-semibold text-base-950 hover:opacity-90">
        Verificar
      </button>

      {feedback === 'correct' && (
        <p className="mt-3 text-sm font-semibold text-mint-400">✅ Isso! Próximo desafio...</p>
      )}
      {feedback === 'wrong' && (
        <p className="mt-3 text-sm font-semibold text-ember-400">❌ Ainda não bateu com o layout pedido. Ajuste as propriedades e tente outra vez.</p>
      )}
    </div>
  );
}

function Selector({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block font-mono text-[11px] text-base-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-base-600 bg-base-800 px-2 py-1.5 text-xs text-base-100 outline-none focus:border-mint-400"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
