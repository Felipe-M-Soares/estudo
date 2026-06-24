import { useState } from 'react';

export function ReactLifecycleDiagram() {
  const [count, setCount] = useState(0);
  const [renders, setRenders] = useState(1);
  const [effectRan, setEffectRan] = useState(true);
  const [flash, setFlash] = useState(false);

  function increment() {
    setCount((c) => c + 1);
    setRenders((r) => r + 1);
    setEffectRan(false);
    setFlash(true);
    setTimeout(() => {
      setEffectRan(true);
      setFlash(false);
    }, 700);
  }

  function reset() {
    setCount(0);
    setRenders(1);
    setEffectRan(true);
    setFlash(false);
  }

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-base-300">Componente real, reagindo a cliques</span>
        <button onClick={reset} className="rounded-lg border border-base-600 px-2.5 py-1 text-xs text-base-300 hover:bg-base-800">
          Reiniciar
        </button>
      </div>

      <div
        className={`rounded-xl border-2 p-4 text-center transition-colors duration-300 ${
          flash ? 'border-amber-400 bg-amber-500/10' : 'border-base-700 bg-base-950/60'
        }`}
      >
        <p className="font-mono text-2xl font-bold text-base-50">{count}</p>
        <button onClick={increment} className="mt-2 rounded-lg bg-mint-400 px-4 py-1.5 text-sm font-semibold text-base-950">
          setCount(count + 1)
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-base-950/60 p-2.5 text-center">
          <div className="mono-num text-lg font-bold text-mint-300">{renders}</div>
          <div className="text-[10px] text-base-400">renderizações</div>
        </div>
        <div className={`rounded-lg p-2.5 text-center transition-colors ${effectRan ? 'bg-violet-500/15' : 'bg-base-950/60'}`}>
          <div className={`text-sm font-bold ${effectRan ? 'text-violet-300' : 'text-base-500'}`}>
            {effectRan ? '✓ executado' : '⏳ disparando...'}
          </div>
          <div className="text-[10px] text-base-400">useEffect</div>
        </div>
      </div>
      <p className="mt-2 text-center text-[11px] text-base-500">
        Cada clique chama setCount → React re-renderiza → useEffect dispara depois, porque a dependência (count) mudou.
      </p>
    </div>
  );
}
