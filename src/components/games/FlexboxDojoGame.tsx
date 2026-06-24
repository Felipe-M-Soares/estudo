import { useMemo, useState } from 'react';

interface FlexChallenge {
  goal: string;
  targetJustify: string;
  targetAlign: string;
  targetDirection: string;
}

const challenges: FlexChallenge[] = [
  { goal: 'Centralize os itens horizontalmente E verticalmente', targetJustify: 'center', targetAlign: 'center', targetDirection: 'row' },
  { goal: 'Distribua os itens nas duas pontas, com espaço entre eles', targetJustify: 'space-between', targetAlign: 'center', targetDirection: 'row' },
  { goal: 'Empilhe os itens em coluna, alinhados à direita', targetJustify: 'flex-start', targetAlign: 'flex-end', targetDirection: 'column' },
  { goal: 'Itens ao final do eixo principal, esticados no eixo cruzado', targetJustify: 'flex-end', targetAlign: 'stretch', targetDirection: 'row' },
];

const justifyOptions = ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'];
const alignOptions = ['flex-start', 'center', 'flex-end', 'stretch'];
const directionOptions = ['row', 'column'];

interface FlexboxDojoGameProps {
  onComplete: (score: number) => void;
}

export function FlexboxDojoGame({ onComplete }: FlexboxDojoGameProps) {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [justify, setJustify] = useState('flex-start');
  const [align, setAlign] = useState('flex-start');
  const [direction, setDirection] = useState('row');
  const [solvedCount, setSolvedCount] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const challenge = challenges[challengeIdx];

  const isCorrect = useMemo(
    () => justify === challenge.targetJustify && align === challenge.targetAlign && direction === challenge.targetDirection,
    [justify, align, direction, challenge]
  );

  function check() {
    if (isCorrect) {
      setFeedback('correct');
      const newSolved = solvedCount + 1;
      setSolvedCount(newSolved);
      setTimeout(() => {
        if (challengeIdx + 1 < challenges.length) {
          setChallengeIdx((i) => i + 1);
          setJustify('flex-start');
          setAlign('flex-start');
          setDirection('row');
          setFeedback(null);
        } else {
          onComplete(Math.round((newSolved / challenges.length) * 100));
        }
      }, 1000);
    } else {
      setFeedback('wrong');
    }
  }

  return (
    <div className="rounded-2xl border border-base-700 bg-base-850 p-5">
      <div className="mb-4">
        <h3 className="font-display text-base font-bold text-base-50">🤸 Dojo do Flexbox</h3>
        <p className="text-xs text-base-400">
          Desafio {challengeIdx + 1}/{challenges.length}: <span className="text-amber-300">{challenge.goal}</span>
        </p>
      </div>

      <div
        className="flex h-40 gap-2 rounded-xl border-2 border-dashed border-base-600 bg-base-900 p-3"
        style={{
          flexDirection: direction as 'row' | 'column',
          justifyContent: justify,
          alignItems: align,
        }}
      >
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-mint-400 font-mono text-xs font-bold text-base-950">
            {n}
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Selector label="justify-content" value={justify} options={justifyOptions} onChange={setJustify} />
        <Selector label="align-items" value={align} options={alignOptions} onChange={setAlign} />
        <Selector label="flex-direction" value={direction} options={directionOptions} onChange={setDirection} />
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
