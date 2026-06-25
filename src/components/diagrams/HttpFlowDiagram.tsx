import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

type Stage = 'idle' | 'to-server' | 'to-db' | 'back-server' | 'to-client' | 'done';

const STAGE_LABEL: Record<Stage, string> = {
  idle: 'Clique em "Enviar requisição" para simular',
  'to-server': 'Cliente envia GET /usuarios/1',
  'to-db': 'Servidor consulta o banco de dados',
  'back-server': 'Banco retorna os dados encontrados',
  'to-client': 'Servidor responde com JSON (200 OK)',
  done: 'Cliente recebe e renderiza os dados',
};

export function HttpFlowDiagram() {
  const [stage, setStage] = useState<Stage>('idle');
  const [running, setRunning] = useState(false);

  async function play() {
    setRunning(true);
    const sequence: Stage[] = ['to-server', 'to-db', 'back-server', 'to-client', 'done'];
    for (const s of sequence) {
      setStage(s);
      await new Promise((r) => setTimeout(r, 850));
    }
    setRunning(false);
  }

  function reset() {
    setStage('idle');
    setRunning(false);
  }

  const packetPosition = (): string => {
    switch (stage) {
      case 'to-server':
        return 'left-[28%]';
      case 'to-db':
        return 'left-[72%]';
      case 'back-server':
        return 'left-[72%]';
      case 'to-client':
        return 'left-[28%]';
      case 'done':
        return 'left-[2%]';
      default:
        return 'left-[2%]';
    }
  };

  const packetVisible = stage !== 'idle' && stage !== 'done';
  const packetColor = stage === 'to-db' || stage === 'back-server' ? 'bg-violet-400' : 'bg-mint-400';

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-base-300">Simulação de requisição completa</span>
        <div className="flex gap-1.5">
          <button onClick={play} disabled={running} className="flex items-center gap-1 rounded-lg bg-mint-400 px-2.5 py-1 text-xs font-semibold text-base-950 disabled:opacity-40">
            <Play size={11} /> Enviar requisição
          </button>
          <button onClick={reset} className="flex items-center gap-1 rounded-lg border border-base-600 px-2.5 py-1 text-xs text-base-300 hover:bg-base-800">
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      <div className="relative h-24 rounded-xl bg-base-950/60 px-2">
        <div className="absolute inset-x-0 top-1/2 h-px bg-base-700" />

        <Node label="Cliente" emoji="💻" position="left-[2%]" active={stage === 'done' || stage === 'idle'} />
        <Node label="Servidor" emoji="🖥️" position="left-1/2 -translate-x-1/2" active={stage === 'to-db' || stage === 'back-server'} />
        <Node label="Banco" emoji="🗄️" position="right-[2%]" active={stage === 'to-db'} />

        {packetVisible && (
          <div
            className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full transition-all duration-700 ease-in-out ${packetPosition()} ${packetColor}`}
          />
        )}
      </div>

      <div className="mt-3 min-h-[32px] rounded-lg bg-base-950/60 px-3 py-2 text-center font-mono text-xs text-base-200">
        {STAGE_LABEL[stage]}
      </div>
    </div>
  );
}

function Node({ label, emoji, position, active }: { label: string; emoji: string; position: string; active: boolean }) {
  return (
    <div className={`absolute top-1/2 flex -translate-y-1/2 flex-col items-center gap-1 ${position}`}>
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg transition-all duration-300 ${
          active ? 'bg-mint-400/20 ring-2 ring-mint-400 scale-110' : 'bg-base-800'
        }`}
      >
        {emoji}
      </div>
      <span className="text-[10px] text-base-400">{label}</span>
    </div>
  );
}
