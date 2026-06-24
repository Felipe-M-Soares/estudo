import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const ARRAY = [3, 8, 12, 19, 25, 31, 40, 52, 67, 78, 91];
const TARGET = 52;

export function BinarySearchDiagram() {
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(ARRAY.length - 1);
  const [mid, setMid] = useState<number | null>(null);
  const [found, setFound] = useState(false);
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState(0);
  const [message, setMessage] = useState('Clique em "Buscar" para encontrar o número 52');

  async function search() {
    setRunning(true);
    setFound(false);
    setSteps(0);
    let l = 0;
    let h = ARRAY.length - 1;
    setLow(l);
    setHigh(h);
    let count = 0;

    while (l <= h) {
      count++;
      const m = Math.floor((l + h) / 2);
      setMid(m);
      setSteps(count);
      await new Promise((r) => setTimeout(r, 900));

      if (ARRAY[m] === TARGET) {
        setMessage(`Encontrado! ${TARGET} está na posição ${m}, em ${count} comparações.`);
        setFound(true);
        setRunning(false);
        return;
      } else if (ARRAY[m] < TARGET) {
        setMessage(`${ARRAY[m]} < ${TARGET} → descarta a metade da esquerda`);
        l = m + 1;
      } else {
        setMessage(`${ARRAY[m]} > ${TARGET} → descarta a metade da direita`);
        h = m - 1;
      }
      setLow(l);
      setHigh(h);
      await new Promise((r) => setTimeout(r, 500));
    }
    setRunning(false);
  }

  function reset() {
    setLow(0);
    setHigh(ARRAY.length - 1);
    setMid(null);
    setFound(false);
    setSteps(0);
    setMessage('Clique em "Buscar" para encontrar o número 52');
  }

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-base-300">Buscando o número {TARGET}</span>
        <div className="flex gap-1.5">
          <button onClick={search} disabled={running} className="flex items-center gap-1 rounded-lg bg-mint-400 px-2.5 py-1 text-xs font-semibold text-base-950 disabled:opacity-40">
            <Play size={11} /> Buscar
          </button>
          <button onClick={reset} className="flex items-center gap-1 rounded-lg border border-base-600 px-2.5 py-1 text-xs text-base-300 hover:bg-base-800">
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-1 overflow-x-auto pb-1">
        {ARRAY.map((val, idx) => {
          const inRange = idx >= low && idx <= high;
          const isMid = idx === mid;
          return (
            <div key={idx} className="flex flex-col items-center gap-1">
              {isMid && <span className="text-[9px] text-amber-300">↓</span>}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold transition-all duration-300 ${
                  found && isMid
                    ? 'bg-mint-400 text-base-950 scale-110'
                    : isMid
                    ? 'bg-amber-400 text-base-950 scale-110'
                    : inRange
                    ? 'bg-base-700 text-base-100'
                    : 'bg-base-900 text-base-600 opacity-40'
                }`}
              >
                {val}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 min-h-[36px] rounded-lg bg-base-950/60 px-3 py-2 text-center text-xs text-base-200">
        {message}
      </div>
      {steps > 0 && (
        <p className="mt-1.5 text-center text-[11px] text-base-500">
          {steps} comparação(ões) até agora — numa lista de {ARRAY.length} itens, busca linear poderia precisar de até {ARRAY.length}.
        </p>
      )}
    </div>
  );
}
