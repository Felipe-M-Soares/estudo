import { useState } from 'react';
import { Play, RotateCcw, Lock, Unlock } from 'lucide-react';

type Stage = 'idle' | 'login' | 'token-issued' | 'has-token' | 'request' | 'verified' | 'response';

const LABELS: Record<Stage, string> = {
  idle: 'Clique para simular o login e uma requisição autenticada',
  login: 'Cliente envia email + senha para /login',
  'token-issued': 'Servidor valida e gera um JWT assinado',
  'has-token': 'Cliente guarda o token (ex: em memória)',
  request: 'Cliente envia GET /perfil com "Authorization: Bearer <token>"',
  verified: 'Servidor verifica a assinatura do token — sem consultar o banco',
  response: 'Servidor responde com os dados do perfil',
};

export function JwtFlowDiagram() {
  const [stage, setStage] = useState<Stage>('idle');
  const [running, setRunning] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  async function play() {
    setRunning(true);
    setHasToken(false);
    const seq: Stage[] = ['login', 'token-issued', 'has-token', 'request', 'verified', 'response'];
    for (const s of seq) {
      setStage(s);
      if (s === 'has-token') setHasToken(true);
      await new Promise((r) => setTimeout(r, 950));
    }
    setRunning(false);
  }

  function reset() {
    setStage('idle');
    setHasToken(false);
    setRunning(false);
  }

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-base-300">Login → Token → Requisição autenticada</span>
        <div className="flex gap-1.5">
          <button onClick={play} disabled={running} className="flex items-center gap-1 rounded-lg bg-mint-400 px-2.5 py-1 text-xs font-semibold text-base-950 disabled:opacity-40">
            <Play size={11} /> Simular
          </button>
          <button onClick={reset} className="flex items-center gap-1 rounded-lg border border-base-600 px-2.5 py-1 text-xs text-base-300 hover:bg-base-800">
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-around rounded-xl bg-base-950/60 p-4">
        <div className="flex flex-col items-center gap-1.5">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl transition-all ${
            stage === 'login' || stage === 'request' ? 'bg-mint-400/20 ring-2 ring-mint-400 scale-110' : 'bg-base-800'
          }`}>
            💻
          </div>
          <span className="text-[10px] text-base-400">Cliente</span>
          {hasToken && (
            <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-semibold text-amber-300">
              <Lock size={9} /> JWT
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col items-center px-2">
          <div className="h-px w-full bg-base-700" />
          {stage !== 'idle' && (
            <span className="mt-1 animate-pulse text-[9px] text-mint-400">→</span>
          )}
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl transition-all ${
            stage === 'token-issued' || stage === 'verified' || stage === 'response' ? 'bg-violet-500/20 ring-2 ring-violet-400 scale-110' : 'bg-base-800'
          }`}>
            🖥️
          </div>
          <span className="text-[10px] text-base-400">Servidor</span>
          {(stage === 'verified' || stage === 'response') && (
            <span className="flex items-center gap-1 rounded-full bg-mint-900/40 px-2 py-0.5 text-[9px] font-semibold text-mint-300">
              <Unlock size={9} /> válido
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 min-h-[36px] rounded-lg bg-base-950/60 px-3 py-2 text-center font-mono text-[11px] text-base-200">
        {LABELS[stage]}
      </div>
    </div>
  );
}
