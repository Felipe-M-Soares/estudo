import { useState } from 'react';
import { Plus } from 'lucide-react';

interface Counter {
  id: number;
  value: number;
}

export function ClosureDiagram() {
  const [counters, setCounters] = useState<Counter[]>([{ id: 1, value: 0 }]);
  const [nextId, setNextId] = useState(2);

  function createCounter() {
    setCounters((prev) => [...prev, { id: nextId, value: 0 }]);
    setNextId((n) => n + 1);
  }

  function increment(id: number) {
    setCounters((prev) => prev.map((c) => (c.id === id ? { ...c, value: c.value + 1 } : c)));
  }

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <pre className="mb-3 overflow-x-auto rounded-xl bg-base-950/60 p-3 font-mono text-[12px] text-mint-200">
        function criarContador() {'{'}
        {'\n'}  let contagem = 0; <span className="text-base-500">// "presa" nesta closure</span>
        {'\n'}  return () =&gt; ++contagem;
        {'\n'}{'}'}
      </pre>

      <div className="flex flex-wrap gap-3">
        {counters.map((c) => (
          <div key={c.id} className="flex flex-col items-center gap-2 rounded-xl border border-base-700 bg-base-950/60 p-3">
            <span className="font-mono text-[10px] text-base-500">contador{c.id} = criarContador()</span>
            <span className="font-mono text-2xl font-bold text-mint-300">{c.value}</span>
            <button
              onClick={() => increment(c.id)}
              className="rounded-lg bg-mint-400 px-3 py-1 text-xs font-bold text-base-950 hover:opacity-90"
            >
              contador{c.id}()
            </button>
          </div>
        ))}
        <button
          onClick={createCounter}
          className="flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-base-600 px-4 py-3 text-base-400 hover:border-mint-400/40 hover:text-mint-300"
        >
          <Plus size={16} />
          <span className="text-[10px]">novo contador</span>
        </button>
      </div>
      <p className="mt-3 text-[11px] text-base-500">
        Cada chamada de <code className="text-mint-300">criarContador()</code> cria uma variável "contagem" independente — as
        closures não compartilham estado entre si, cada uma lembra apenas da sua própria.
      </p>
    </div>
  );
}
