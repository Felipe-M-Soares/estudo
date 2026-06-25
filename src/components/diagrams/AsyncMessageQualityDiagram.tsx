import { useState } from 'react';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

export function AsyncMessageQualityDiagram() {
  const [view, setView] = useState<'weak' | 'strong'>('weak');

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex justify-center gap-1.5">
        <button
          onClick={() => setView('weak')}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            view === 'weak' ? 'bg-ember-500 text-white' : 'bg-base-800 text-base-300'
          }`}
        >
          <ThumbsDown size={12} /> Mensagem fraca
        </button>
        <button
          onClick={() => setView('strong')}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            view === 'strong' ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300'
          }`}
        >
          <ThumbsUp size={12} /> Mensagem forte
        </button>
      </div>

      <div className="rounded-xl bg-base-950/60 p-4">
        {view === 'weak' ? (
          <div className="rounded-xl border border-ember-400/30 bg-ember-500/10 p-3">
            <p className="font-mono text-sm text-ember-200">"Dá uma olhada nisso aí quando puder"</p>
          </div>
        ) : (
          <div className="rounded-xl border border-mint-400/30 bg-mint-900/20 p-3">
            <p className="font-mono text-sm text-mint-200">
              "O endpoint /pedidos está retornando 500 desde o deploy de ontem (14h). Já chequei os logs e parece ser timeout no
              banco. Pode dar uma olhada hoje? Não é urgente, mas impacta o time de QA."
            </p>
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
        <div className={`rounded-lg p-2.5 ${view === 'weak' ? 'bg-ember-500/10 text-ember-200' : 'bg-base-800/40 text-base-500'}`}>
          Sem contexto: o que é "isso"? Quando é "quando puder"? Gera pergunta de volta.
        </div>
        <div className={`rounded-lg p-2.5 ${view === 'strong' ? 'bg-mint-900/20 text-mint-200' : 'bg-base-800/40 text-base-500'}`}>
          O que, desde quando, o que já foi investigado, urgência clara — responde sem precisar perguntar de volta.
        </div>
      </div>
    </div>
  );
}
