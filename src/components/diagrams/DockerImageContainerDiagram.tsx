import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export function DockerImageContainerDiagram() {
  const [containers, setContainers] = useState([1, 2]);
  const [nextId, setNextId] = useState(3);

  function addContainer() {
    setContainers((prev) => [...prev, nextId]);
    setNextId((n) => n + 1);
  }

  function removeContainer(id: number) {
    setContainers((prev) => prev.filter((c) => c !== id));
  }

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:justify-center">
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex h-16 w-20 flex-col items-center justify-center rounded-xl border-2 border-dashed border-amber-400/60 bg-amber-500/10">
            <span className="text-xl">📦</span>
            <span className="text-[9px] font-semibold text-amber-300">node:20-alpine</span>
          </div>
          <span className="text-[10px] text-base-400">Imagem (blueprint)</span>
        </div>

        <div className="flex items-center pt-6 text-base-500">→</div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {containers.map((id) => (
            <div key={id} className="relative flex flex-col items-center gap-1.5">
              <button
                onClick={() => removeContainer(id)}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-base-800 text-base-400 hover:bg-ember-500/20 hover:text-ember-400"
                aria-label="Remover container"
              >
                <Trash2 size={10} />
              </button>
              <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-mint-400/15 ring-1 ring-mint-400/40 animate-rise-in">
                <span className="text-lg">🟢</span>
                <span className="font-mono text-[9px] text-mint-300">#{id}</span>
              </div>
              <span className="text-[9px] text-base-500">container</span>
            </div>
          ))}
          <button
            onClick={addContainer}
            className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-dashed border-base-600 text-base-400 hover:border-mint-400/40 hover:text-mint-300"
            aria-label="Criar novo container"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <p className="mt-3 text-center text-[11px] text-base-500">
        Uma única imagem gera quantos containers você quiser — cada um isolado, rodando independentemente.
      </p>
    </div>
  );
}
