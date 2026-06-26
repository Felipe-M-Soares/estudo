import { useState } from 'react';

export function SqlInjectionDiagram() {
  const [input, setInput] = useState("' OR '1'='1");
  const [safe, setSafe] = useState(false);

  const queryUnsafe = `SELECT * FROM usuarios WHERE email = 'x@x.com' AND senha = '${input}'`;
  const wouldBypass = input.toLowerCase().includes('or') && input.includes('=');

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex justify-center gap-1.5">
        <button
          onClick={() => setSafe(false)}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${!safe ? 'bg-ember-500 text-white' : 'bg-base-800 text-base-300'}`}
        >
          Query vulnerável
        </button>
        <button
          onClick={() => setSafe(true)}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${safe ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300'}`}
        >
          Query parametrizada
        </button>
      </div>

      <label className="mb-1 block text-[11px] text-base-400">Digite o que o "atacante" colocaria no campo senha:</label>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="mb-3 w-full rounded-lg border border-base-600 bg-base-800 px-3 py-2 font-mono text-xs text-base-100 outline-none focus:border-cyan-400"
      />

      <div className="rounded-xl bg-base-950/60 p-3">
        <p className="mb-1 text-[10px] font-semibold uppercase text-base-400">Query executada de verdade no banco</p>
        {safe ? (
          <code className="block whitespace-pre-wrap break-all font-mono text-xs text-mint-200">
            SELECT * FROM usuarios WHERE email = $1 AND senha = $2{'\n'}// parâmetro 2 = "{input}" (tratado como texto puro)
          </code>
        ) : (
          <code className="block whitespace-pre-wrap break-all font-mono text-xs text-ember-300">{queryUnsafe}</code>
        )}
      </div>

      <div className={`mt-3 rounded-xl border p-3 text-sm ${!safe && wouldBypass ? 'border-ember-400/40 bg-ember-500/10 text-ember-300' : 'border-mint-400/30 bg-mint-900/15 text-mint-200'}`}>
        {!safe && wouldBypass && '🚨 Essa condição vira sempre verdadeira — o atacante entra sem saber a senha real.'}
        {!safe && !wouldBypass && '✅ Esse valor específico não quebra a query, mas a vulnerabilidade continua existindo.'}
        {safe && '✅ O valor é tratado como texto puro, não importa o que for digitado — nunca altera a estrutura da query.'}
      </div>
    </div>
  );
}
