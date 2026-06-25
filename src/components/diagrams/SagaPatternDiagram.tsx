import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const STEPS = ['Reservar estoque', 'Processar pagamento', 'Confirmar envio'];

export function SagaPatternDiagram() {
  const [activeIdx, setActiveIdx] = useState(-1);
  const [running, setRunning] = useState(false);
  const [compensating, setCompensating] = useState(false);
  const [compensateIdx, setCompensateIdx] = useState(-1);
  const [failed, setFailed] = useState(false);

  async function run(shouldFail: boolean) {
    setRunning(true);
    setFailed(false);
    setCompensating(false);
    setCompensateIdx(-1);

    for (let i = 0; i < STEPS.length; i++) {
      setActiveIdx(i);
      await new Promise((r) => setTimeout(r, 700));
      if (shouldFail && i === 1) {
        setFailed(true);
        setCompensating(true);
        await new Promise((r) => setTimeout(r, 500));
        for (let j = i - 1; j >= 0; j--) {
          setCompensateIdx(j);
          await new Promise((r) => setTimeout(r, 700));
        }
        setRunning(false);
        return;
      }
    }
    setActiveIdx(-1);
    setRunning(false);
  }

  function reset() {
    setActiveIdx(-1);
    setCompensating(false);
    setCompensateIdx(-1);
    setFailed(false);
    setRunning(false);
  }

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-base-300">Transação distribuída entre 3 serviços</span>
        <div className="flex gap-1.5">
          <button onClick={() => run(false)} disabled={running} className="rounded-lg bg-mint-400 px-2.5 py-1 text-xs font-semibold text-base-950 disabled:opacity-40">
            <Play size={11} className="mr-1 inline" />Sucesso
          </button>
          <button onClick={() => run(true)} disabled={running} className="rounded-lg bg-ember-500 px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-40">
            <Play size={11} className="mr-1 inline" />Falha no pagamento
          </button>
          <button onClick={reset} className="rounded-lg border border-base-600 px-2.5 py-1 text-xs text-base-300 hover:bg-base-800">
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      <div className="space-y-2 rounded-xl bg-base-950/60 p-4">
        {STEPS.map((step, idx) => (
          <div
            key={step}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all duration-300 ${
              compensateIdx === idx
                ? 'bg-ember-500/20 text-ember-200 ring-1 ring-ember-400'
                : activeIdx === idx
                ? 'bg-amber-400/20 text-amber-200 ring-1 ring-amber-400'
                : idx < activeIdx || (idx === 0 && !failed && activeIdx === -1 && !running)
                ? 'bg-mint-900/30 text-mint-200'
                : 'bg-base-800 text-base-400'
            }`}
          >
            <span>{step}</span>
            {compensateIdx === idx && <span className="text-xs font-bold">↩ compensando</span>}
          </div>
        ))}
      </div>
      {compensating && compensateIdx === 0 && (
        <p className="mt-3 text-center text-sm font-semibold text-ember-400">
          ❌ Pagamento falhou — Saga desfaz a reserva de estoque para manter consistência.
        </p>
      )}
      {!failed && activeIdx === -1 && !running && (
        <p className="mt-3 text-center text-[11px] text-base-500">Clique em "Sucesso" ou "Falha" para simular a transação.</p>
      )}
    </div>
  );
}
