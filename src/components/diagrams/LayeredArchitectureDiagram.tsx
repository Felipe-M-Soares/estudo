import { useState } from 'react';

const LAYERS = [
  { name: 'Apresentação', desc: 'Controllers, rotas HTTP, UI', color: 'cyan' as const },
  { name: 'Aplicação', desc: 'Casos de uso, orquestração', color: 'amber' as const },
  { name: 'Domínio', desc: 'Regras de negócio puras', color: 'mint' as const },
  { name: 'Infraestrutura', desc: 'Banco de dados, APIs externas', color: 'violet' as const },
];

export function LayeredArchitectureDiagram() {
  const [selected, setSelected] = useState<number | null>(null);

  const colorMap = {
    cyan: 'border-cyan-400/50 bg-cyan-500/10 text-cyan-200',
    amber: 'border-amber-400/50 bg-amber-500/10 text-amber-200',
    mint: 'border-mint-400/50 bg-mint-900/20 text-mint-200',
    violet: 'border-violet-400/50 bg-violet-500/10 text-violet-200',
  };

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="space-y-2">
        {LAYERS.map((layer, idx) => (
          <button
            key={layer.name}
            onClick={() => setSelected(idx)}
            className={`block w-full rounded-xl border-2 p-3 text-left transition-all ${
              selected === idx ? colorMap[layer.color] + ' scale-[1.02]' : 'border-base-700 bg-base-950/40 hover:border-base-500'
            }`}
          >
            <span className="font-mono text-sm font-bold">{layer.name}</span>
          </button>
        ))}
      </div>

      {selected !== null && (
        <div className="mt-3 animate-rise-in rounded-xl border border-base-700 bg-base-950/60 p-3 text-sm text-base-200">
          <strong className="text-base-50">{LAYERS[selected].name}:</strong> {LAYERS[selected].desc}
        </div>
      )}

      <p className="mt-3 text-[11px] text-base-500">
        A regra principal: camadas internas (Domínio) nunca conhecem as externas (Infraestrutura) — a dependência sempre
        aponta de fora para dentro. Isso permite trocar o banco de dados sem tocar nas regras de negócio.
      </p>
    </div>
  );
}
