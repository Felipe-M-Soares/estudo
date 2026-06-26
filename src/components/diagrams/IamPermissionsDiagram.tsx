import { useState } from 'react';

const RESOURCES = ['Ler S3', 'Escrever S3', 'Deletar S3', 'Acessar RDS', 'Criar EC2', 'Deletar EC2'];

export function IamPermissionsDiagram() {
  const [mode, setMode] = useState<'broad' | 'narrow'>('broad');
  const granted = mode === 'broad' ? RESOURCES : ['Ler S3', 'Escrever S3'];

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex justify-center gap-1.5">
        <button
          onClick={() => setMode('broad')}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${mode === 'broad' ? 'bg-ember-500 text-white' : 'bg-base-800 text-base-300'}`}
        >
          Permissão ampla (*)
        </button>
        <button
          onClick={() => setMode('narrow')}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${mode === 'narrow' ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300'}`}
        >
          Menor privilégio
        </button>
      </div>

      <p className="mb-2 text-center text-[11px] text-base-400">
        Uma função Lambda que só precisa <strong className="text-base-200">ler e escrever arquivos no S3</strong>
      </p>

      <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-base-950/60 p-3 sm:grid-cols-3">
        {RESOURCES.map((r) => {
          const isGranted = granted.includes(r);
          const isNeeded = r === 'Ler S3' || r === 'Escrever S3';
          return (
            <div
              key={r}
              className={`rounded-lg px-2 py-2 text-center text-[11px] font-medium transition-colors ${
                isGranted
                  ? isNeeded
                    ? 'bg-mint-900/30 text-mint-200'
                    : 'bg-ember-500/15 text-ember-300'
                  : 'bg-base-800/50 text-base-600'
              }`}
            >
              {r} {isGranted && !isNeeded && '⚠️'}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-base-500">
        {mode === 'broad'
          ? '⚠️ Se essa função for comprometida (ex: por uma dependência vulnerável), o atacante herda TODAS essas permissões, incluindo deletar instâncias EC2.'
          : '✅ Mesmo comprometida, essa função só conseguiria ler/escrever no S3 — o dano possível fica limitado ao que ela realmente precisa fazer.'}
      </p>
    </div>
  );
}
