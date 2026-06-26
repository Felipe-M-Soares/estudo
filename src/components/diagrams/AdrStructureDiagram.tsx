import { useState } from 'react';

const SECTIONS = [
  { title: 'Contexto', content: 'O time precisa escolher entre REST e GraphQL para a nova API de catálogo de produtos, que será consumida por 3 apps diferentes (web, mobile, parceiros).', color: 'cyan' as const },
  { title: 'Decisão', content: 'Vamos usar GraphQL, pois cada cliente precisa de campos diferentes do mesmo recurso, e REST geraria over-fetching significativo ou múltiplos endpoints especializados.', color: 'mint' as const },
  { title: 'Alternativas consideradas', content: 'REST com endpoints especializados por cliente (rejeitado: duplicação de lógica). REST genérico com query params para campos (rejeitado: implementação caseira de algo que GraphQL já resolve).', color: 'amber' as const },
  { title: 'Consequências', content: 'Positivo: menos over-fetching, um schema único documentado. Negativo: curva de aprendizado para o time, cache HTTP tradicional fica mais complexo.', color: 'violet' as const },
];

export function AdrStructureDiagram() {
  const [selected, setSelected] = useState(0);
  const current = SECTIONS[selected];

  const colorMap = {
    cyan: 'border-cyan-400/50 bg-cyan-500/10 text-cyan-200',
    mint: 'border-mint-400/50 bg-mint-900/20 text-mint-200',
    amber: 'border-amber-400/50 bg-amber-500/10 text-amber-200',
    violet: 'border-violet-400/50 bg-violet-500/10 text-violet-200',
  };

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <p className="mb-3 text-center text-xs font-semibold text-base-400">ADR-014: Escolha de GraphQL para API de catálogo</p>
      <div className="mb-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {SECTIONS.map((s, i) => (
          <button
            key={s.title}
            onClick={() => setSelected(i)}
            className={`rounded-lg px-2 py-2 text-[11px] font-semibold transition-all ${
              selected === i ? colorMap[s.color] + ' scale-[1.03]' : 'border border-base-700 bg-base-800/40 text-base-400'
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>
      <div className="animate-rise-in rounded-xl bg-base-950/60 p-3 text-sm text-base-200">{current.content}</div>
      <p className="mt-3 text-[11px] text-base-500">
        Um ADR não registra só "o que" foi decidido — registra "por quê", o que foi descartado, e o que se aceita perder em
        troca. Isso evita que a mesma discussão se repita meses depois, sem ninguém lembrar o raciocínio original.
      </p>
    </div>
  );
}
