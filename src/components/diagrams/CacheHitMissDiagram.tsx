import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export function CacheHitMissDiagram() {
  const [scenario, setScenario] = useState<'miss' | 'hit'>('miss');
  const [stage, setStage] = useState(0);
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    setStage(1);
    await new Promise((r) => setTimeout(r, 700));
    if (scenario === 'hit') {
      setStage(2);
    } else {
      setStage(3);
      await new Promise((r) => setTimeout(r, 900));
      setStage(4);
    }
    setRunning(false);
  }

  function reset() {
    setStage(0);
    setRunning(false);
  }

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex gap-1.5">
          <button onClick={() => { setScenario('miss'); reset(); }} className={`rounded-full px-3 py-1 text-xs font-semibold ${scenario === 'miss' ? 'bg-ember-500 text-white' : 'bg-base-800 text-base-300'}`}>
            Cache miss
          </button>
          <button onClick={() => { setScenario('hit'); reset(); }} className={`rounded-full px-3 py-1 text-xs font-semibold ${scenario === 'hit' ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300'}`}>
            Cache hit
          </button>
        </div>
        <div className="flex gap-1.5">
          <button onClick={run} disabled={running} className="flex items-center gap-1 rounded-lg bg-cyan-400 px-2.5 py-1 text-xs font-bold text-base-950 disabled:opacity-40">
            <Play size={11} /> Simular
          </button>
          <button onClick={reset} className="rounded-lg border border-base-600 px-2.5 py-1 text-xs text-base-300 hover:bg-base-800">
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 rounded-xl bg-base-950/60 p-4">
        <Node label="App" active={stage >= 1} icon="🖥️" />
        <Arrow active={stage >= 1} />
        <Node label="Redis" active={stage === 2 || stage === 3} icon="⚡" highlight={stage === 2} />
        {scenario === 'miss' && (
          <>
            <Arrow active={stage >= 3} dimmed={stage < 3} />
            <Node label="Banco" active={stage >= 3} icon="🗄️" highlight={stage === 4} />
          </>
        )}
      </div>
      <p className="mt-3 text-center text-sm font-semibold">
        {stage === 0 && <span className="text-base-500">Clique em "Simular" pra ver o fluxo.</span>}
        {stage === 1 && <span className="text-amber-300">Checando o Redis...</span>}
        {stage === 2 && <span className="text-mint-300">✅ Cache hit! Retornou direto do Redis, sem tocar no banco.</span>}
        {stage === 3 && <span className="text-ember-300">Cache miss — precisando consultar o banco principal...</span>}
        {stage === 4 && <span className="text-ember-300">Banco respondeu. Resultado agora vai ser guardado no Redis pra próxima vez ser hit.</span>}
      </p>
    </div>
  );
}

function Node({ label, active, icon, highlight }: { label: string; active: boolean; icon: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`flex h-12 w-14 items-center justify-center rounded-xl text-lg transition-all ${highlight ? 'bg-mint-400/20 ring-2 ring-mint-400 scale-110' : active ? 'bg-amber-400/20 ring-2 ring-amber-400' : 'bg-base-800'}`}>
        {icon}
      </div>
      <span className="text-[10px] text-base-400">{label}</span>
    </div>
  );
}

function Arrow({ active, dimmed }: { active: boolean; dimmed?: boolean }) {
  return <span className={`text-lg ${active && !dimmed ? 'text-cyan-400' : 'text-base-700'}`}>→</span>;
}
