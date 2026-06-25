import { useState } from 'react';
import { Lightbulb, Eye } from 'lucide-react';
import type { PracticalChallenge } from '../../data/interviewTypes';

interface InterviewPracticalStageProps {
  challenges: PracticalChallenge[];
  currentIdx: number;
  onMark: (challengeId: string, passed: boolean) => void;
  onNext: () => void;
}

export function InterviewPracticalStage({ challenges, currentIdx, onMark, onNext }: InterviewPracticalStageProps) {
  const challenge = challenges[currentIdx];
  const [code, setCode] = useState(challenge?.starterCode ?? '');
  const [checked, setChecked] = useState(false);
  const [passed, setPassed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  function resetForChallenge(c: PracticalChallenge) {
    setCode(c.starterCode);
    setChecked(false);
    setPassed(false);
    setShowHint(false);
    setShowSolution(false);
  }

  function handleCheck() {
    const matches = challenge.solutionContains.filter((token) => code.includes(token));
    const isPassed = matches.length >= Math.ceil(challenge.solutionContains.length * 0.6);
    setPassed(isPassed);
    setChecked(true);
    onMark(challenge.id, isPassed);
  }

  function handleNext() {
    onNext();
    const next = challenges[currentIdx + 1];
    if (next) resetForChallenge(next);
  }

  if (!challenge) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
      <div className="mb-4">
        <span className="font-mono text-xs text-base-400">Prática · Desafio {currentIdx + 1}/{challenges.length}</span>
        <h2 className="mt-1 font-display text-xl font-bold text-base-50">{challenge.title}</h2>
      </div>

      <div className="card-surface animate-rise-in rounded-2xl p-5">
        <p className="text-sm text-base-200">{challenge.prompt}</p>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={checked}
          spellCheck={false}
          rows={10}
          className="mt-3 w-full resize-none rounded-xl border border-base-700 bg-base-950/80 p-4 font-mono text-[13px] text-mint-200 outline-none focus:border-cyan-400/60 disabled:opacity-70"
        />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {!checked && (
            <>
              <button onClick={handleCheck} className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-base-950 hover:opacity-90">
                Verificar solução
              </button>
              <button
                onClick={() => setShowHint((s) => !s)}
                className="flex items-center gap-1.5 rounded-lg border border-base-600 px-3 py-2 text-sm text-base-300 hover:bg-base-800"
              >
                <Lightbulb size={13} /> Dica
              </button>
            </>
          )}
          {checked && (
            <button onClick={handleNext} className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-base-950 hover:opacity-90">
              {currentIdx + 1 < challenges.length ? 'Próximo desafio →' : 'Ir para perguntas comportamentais →'}
            </button>
          )}
        </div>

        {showHint && !checked && <p className="mt-3 text-xs text-amber-300">💡 {challenge.hint}</p>}

        {checked && (
          <div
            className={`mt-4 rounded-xl border p-3 text-sm ${
              passed ? 'border-mint-400/30 bg-mint-900/20 text-mint-200' : 'border-amber-400/30 bg-amber-500/10 text-amber-200'
            }`}
          >
            <p className="mb-1 font-semibold">
              {passed ? '✅ Sua solução contém os elementos esperados!' : '⚠️ Sua solução pode estar incompleta — compare com a abordagem ideal abaixo.'}
            </p>
            <p className="text-base-200">
              Essa verificação é heurística (procura por padrões-chave no seu código), não substitui rodar testes de verdade — em uma
              entrevista real, o que importa é seu raciocínio explicado em voz alta, não só o resultado final.
            </p>
            <button
              onClick={() => setShowSolution((s) => !s)}
              className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:underline"
            >
              <Eye size={12} /> {showSolution ? 'Esconder' : 'Ver'} abordagem ideal
            </button>
            {showSolution && (
              <pre className="mt-2 overflow-x-auto rounded-lg border border-base-700 bg-base-950/60 p-3">
                <code className="font-mono text-[12px] text-mint-200">{challenge.idealApproach}</code>
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
