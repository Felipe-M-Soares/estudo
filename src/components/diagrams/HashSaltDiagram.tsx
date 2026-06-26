import { useState } from 'react';

function fakeHash(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h.toString(16).padStart(8, '0') + h.toString(16).padStart(8, '0').slice(0, 8);
}

export function HashSaltDiagram() {
  const [password] = useState('senha123');
  const [useSalt, setUseSalt] = useState(false);

  const saltUser1 = 'a8f3';
  const saltUser2 = 'k2p9';

  const hash1 = useSalt ? fakeHash(password + saltUser1) : fakeHash(password);
  const hash2 = useSalt ? fakeHash(password + saltUser2) : fakeHash(password);

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex justify-center gap-1.5">
        <button onClick={() => setUseSalt(false)} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${!useSalt ? 'bg-ember-500 text-white' : 'bg-base-800 text-base-300'}`}>
          Hash sem salt
        </button>
        <button onClick={() => setUseSalt(true)} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${useSalt ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300'}`}>
          Hash com salt
        </button>
      </div>

      <p className="mb-2 text-center text-[11px] text-base-400">Dois usuários diferentes, mesma senha: "{password}"</p>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-base-950/60 p-3">
          <p className="text-[10px] text-base-400">Usuário A {useSalt && `(salt: ${saltUser1})`}</p>
          <code className="mt-1 block break-all font-mono text-[11px] text-cyan-300">{hash1}</code>
        </div>
        <div className="rounded-xl bg-base-950/60 p-3">
          <p className="text-[10px] text-base-400">Usuário B {useSalt && `(salt: ${saltUser2})`}</p>
          <code className="mt-1 block break-all font-mono text-[11px] text-cyan-300">{hash2}</code>
        </div>
      </div>

      <div className={`mt-3 rounded-xl border p-3 text-sm ${!useSalt ? 'border-ember-400/40 bg-ember-500/10 text-ember-300' : 'border-mint-400/30 bg-mint-900/15 text-mint-200'}`}>
        {!useSalt
          ? '🚨 Hashes idênticos! Um atacante que descobrir a senha de A automaticamente sabe a de B também.'
          : '✅ Hashes diferentes, mesmo com senha igual — o salt único por usuário quebra esse atalho.'}
      </div>
    </div>
  );
}
