import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const COLORS = ['bg-mint-400', 'bg-amber-400', 'bg-violet-400', 'bg-ember-400', 'bg-mint-300', 'bg-amber-300'];

export function StackQueueDiagram() {
  const [mode, setMode] = useState<'stack' | 'queue'>('stack');
  const [items, setItems] = useState<{ id: number; colorIdx: number }[]>([
    { id: 1, colorIdx: 0 },
    { id: 2, colorIdx: 1 },
  ]);
  const [nextId, setNextId] = useState(3);
  const [lastAction, setLastAction] = useState<string | null>(null);

  function push() {
    const colorIdx = items.length % COLORS.length;
    setItems((prev) => [...prev, { id: nextId, colorIdx }]);
    setNextId((n) => n + 1);
    setLastAction(mode === 'stack' ? `push(${nextId}) — entra no topo` : `enqueue(${nextId}) — entra no fim da fila`);
  }

  function pop() {
    if (items.length === 0) return;
    if (mode === 'stack') {
      const removed = items[items.length - 1];
      setItems((prev) => prev.slice(0, -1));
      setLastAction(`pop() — remove ${removed.id}, que era o topo (último a entrar)`);
    } else {
      const removed = items[0];
      setItems((prev) => prev.slice(1));
      setLastAction(`dequeue() — remove ${removed.id}, que era o primeiro a entrar`);
    }
  }

  function switchMode(newMode: 'stack' | 'queue') {
    setMode(newMode);
    setLastAction(null);
  }

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex gap-1.5">
          <button
            onClick={() => switchMode('stack')}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              mode === 'stack' ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300'
            }`}
          >
            Pilha (LIFO)
          </button>
          <button
            onClick={() => switchMode('queue')}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              mode === 'queue' ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300'
            }`}
          >
            Fila (FIFO)
          </button>
        </div>
        <div className="flex gap-1.5">
          <button onClick={push} className="flex items-center gap-1 rounded-lg border border-base-600 px-2.5 py-1 text-xs font-semibold text-base-100 hover:bg-base-800">
            <Plus size={12} /> {mode === 'stack' ? 'push' : 'enqueue'}
          </button>
          <button
            onClick={pop}
            disabled={items.length === 0}
            className="flex items-center gap-1 rounded-lg border border-base-600 px-2.5 py-1 text-xs font-semibold text-base-100 hover:bg-base-800 disabled:opacity-30"
          >
            <Minus size={12} /> {mode === 'stack' ? 'pop' : 'dequeue'}
          </button>
        </div>
      </div>

      <div className="flex min-h-[140px] items-center justify-center rounded-xl bg-base-950/60 p-4">
        {mode === 'stack' ? (
          <div className="flex flex-col-reverse items-center gap-1">
            {items.length === 0 && <span className="text-xs text-base-500">Pilha vazia</span>}
            {items.map((item, idx) => (
              <div
                key={item.id}
                className={`flex h-9 w-24 items-center justify-center rounded-lg font-mono text-sm font-bold text-base-950 transition-all duration-300 ${COLORS[item.colorIdx]} ${
                  idx === items.length - 1 ? 'ring-2 ring-base-50 ring-offset-2 ring-offset-base-950' : ''
                }`}
              >
                {item.id}
              </div>
            ))}
            {items.length > 0 && <span className="mt-1 text-[10px] text-base-500">↑ topo (próximo a sair)</span>}
          </div>
        ) : (
          <div className="flex items-center gap-1">
            {items.length === 0 && <span className="text-xs text-base-500">Fila vazia</span>}
            {items.map((item, idx) => (
              <div
                key={item.id}
                className={`flex h-9 w-12 items-center justify-center rounded-lg font-mono text-sm font-bold text-base-950 transition-all duration-300 ${COLORS[item.colorIdx]} ${
                  idx === 0 ? 'ring-2 ring-base-50 ring-offset-2 ring-offset-base-950' : ''
                }`}
              >
                {item.id}
              </div>
            ))}
            {items.length > 0 && (
              <div className="ml-2 flex flex-col text-[10px] text-base-500">
                <span>↑ saída</span>
              </div>
            )}
          </div>
        )}
      </div>

      {lastAction && (
        <p className="mt-2 text-center font-mono text-[11px] text-mint-300">{lastAction}</p>
      )}
    </div>
  );
}
