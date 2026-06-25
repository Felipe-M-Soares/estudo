import { useState } from 'react';

type Strategy = 'ssr' | 'ssg' | 'isr';

const info: Record<Strategy, { label: string; timing: string; freshness: string; speed: number; desc: string }> = {
  ssg: {
    label: 'SSG',
    timing: 'Gerado 1x, no build',
    freshness: 'Pode ficar desatualizado',
    speed: 95,
    desc: 'HTML pronto servido instantaneamente — ideal para conteúdo que quase não muda.',
  },
  isr: {
    label: 'ISR',
    timing: 'Gerado no build + revalidado',
    freshness: 'Atualiza periodicamente',
    speed: 85,
    desc: 'Estático na maior parte do tempo, mas se regenera em segundo plano em intervalos definidos.',
  },
  ssr: {
    label: 'SSR',
    timing: 'Gerado a cada requisição',
    freshness: 'Sempre atual',
    speed: 55,
    desc: 'O servidor processa e monta o HTML toda vez — mais lento, mas sempre com dado fresco.',
  },
};

export function RenderingStrategyDiagram() {
  const [strategy, setStrategy] = useState<Strategy>('ssg');
  const current = info[strategy];

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex justify-center gap-1.5">
        {(['ssg', 'isr', 'ssr'] as Strategy[]).map((s) => (
          <button
            key={s}
            onClick={() => setStrategy(s)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
              strategy === s ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300 hover:bg-base-700'
            }`}
          >
            {info[s].label}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-base-950/60 p-4">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-base-400">Velocidade percebida</span>
          <span className="mono-num font-bold text-mint-300">{current.speed}/100</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-base-700">
          <div className="h-full rounded-full bg-gradient-to-r from-mint-500 to-mint-300 transition-all duration-500" style={{ width: `${current.speed}%` }} />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-base-800/60 p-2.5">
            <p className="text-[10px] text-base-400">Quando gera o HTML</p>
            <p className="text-base-100">{current.timing}</p>
          </div>
          <div className="rounded-lg bg-base-800/60 p-2.5">
            <p className="text-[10px] text-base-400">Atualização do conteúdo</p>
            <p className="text-base-100">{current.freshness}</p>
          </div>
        </div>
      </div>
      <p className="mt-3 text-[11px] text-base-500">{current.desc}</p>
    </div>
  );
}
