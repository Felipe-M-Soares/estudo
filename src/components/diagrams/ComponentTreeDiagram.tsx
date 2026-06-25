import { useState } from 'react';

export function ComponentTreeDiagram() {
  const [userName, setUserName] = useState('Ana');

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3">
        <label className="mb-1 block font-mono text-xs text-base-400">Prop "nome" no componente raiz:</label>
        <input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full rounded-lg border border-base-600 bg-base-800 px-3 py-1.5 text-sm text-base-100 outline-none focus:border-mint-400"
        />
      </div>

      <div className="flex flex-col items-center gap-3 rounded-xl bg-base-950/60 p-4">
        <NodeBox label={`<App nome="${userName}">`} color="mint" />
        <Connector />
        <div className="flex gap-6">
          <div className="flex flex-col items-center gap-2">
            <NodeBox label="<Header />" color="violet" small />
            <span className="text-[10px] text-base-500">não recebe "nome"</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Connector />
            <NodeBox label={`<Perfil nome="${userName}">`} color="amber" />
            <Connector />
            <NodeBox label={`<Saudacao nome="${userName}">`} color="mint" small />
            <div className="mt-1 rounded-lg bg-mint-900/30 px-3 py-1 font-mono text-xs text-mint-200">
              "Olá, {userName}!"
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-[11px] text-base-500">
        A prop "nome" passa de <code className="text-mint-300">App</code> → <code className="text-amber-300">Perfil</code> →{' '}
        <code className="text-mint-300">Saudacao</code>. <code className="text-violet-300">Header</code> não está nesse
        caminho, então nunca recebe essa prop — mude o nome acima e veja só os componentes certos atualizarem.
      </p>
    </div>
  );
}

function NodeBox({ label, color, small = false }: { label: string; color: 'mint' | 'violet' | 'amber'; small?: boolean }) {
  const colors = {
    mint: 'bg-mint-900/40 text-mint-200 ring-mint-400/40',
    violet: 'bg-violet-500/15 text-violet-200 ring-violet-400/40',
    amber: 'bg-amber-500/15 text-amber-200 ring-amber-400/40',
  }[color];
  return (
    <div className={`rounded-lg px-3 py-1.5 font-mono ${small ? 'text-[10px]' : 'text-xs'} ring-1 ${colors}`}>
      {label}
    </div>
  );
}

function Connector() {
  return <div className="h-3 w-px bg-base-600" />;
}
