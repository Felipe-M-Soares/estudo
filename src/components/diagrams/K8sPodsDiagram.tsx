import { useState } from 'react';
import { Plus, Minus, Skull } from 'lucide-react';

export function K8sPodsDiagram() {
  const [pods, setPods] = useState([1, 2, 3]);
  const [nextId, setNextId] = useState(4);
  const desiredReplicas = 3;

  function killPod(id: number) {
    setPods((prev) => prev.filter((p) => p !== id));
    setTimeout(() => {
      setPods((prev) => (prev.length < desiredReplicas ? [...prev, nextId] : prev));
      setNextId((n) => n + 1);
    }, 1200);
  }

  function scaleUp() {
    setPods((prev) => [...prev, nextId]);
    setNextId((n) => n + 1);
  }

  function scaleDown() {
    setPods((prev) => prev.slice(0, -1));
  }

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-base-300">Deployment: replicas desejadas = {desiredReplicas}</span>
        <div className="flex gap-1.5">
          <button onClick={scaleUp} className="flex items-center gap-1 rounded-lg border border-base-600 px-2.5 py-1 text-xs text-base-200 hover:bg-base-800">
            <Plus size={11} /> Pod manual
          </button>
          <button onClick={scaleDown} className="flex items-center gap-1 rounded-lg border border-base-600 px-2.5 py-1 text-xs text-base-200 hover:bg-base-800">
            <Minus size={11} /> Remover
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 rounded-xl bg-base-950/60 p-4">
        {pods.map((id) => (
          <div key={id} className="group relative flex flex-col items-center gap-1.5 animate-rise-in">
            <button
              onClick={() => killPod(id)}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint-400/15 text-lg ring-1 ring-mint-400/40 transition-colors hover:bg-ember-500/20 hover:ring-ember-400"
              title="Clique para simular falha deste Pod"
            >
              <span className="group-hover:hidden">🟢</span>
              <Skull size={16} className="hidden text-ember-400 group-hover:block" />
            </button>
            <span className="font-mono text-[10px] text-base-500">pod-{id}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-base-500">
        Clique num Pod para simular uma falha — o Kubernetes detecta que o número de réplicas caiu abaixo do desejado e cria
        um novo automaticamente, sem intervenção manual.
      </p>
    </div>
  );
}
