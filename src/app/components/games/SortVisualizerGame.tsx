import { useEffect, useRef, useState } from 'react';

function generateArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

interface SortVisualizerGameProps {
  onComplete: (score: number) => void;
}

export function SortVisualizerGame({ onComplete }: SortVisualizerGameProps) {
  const [original] = useState(() => generateArray(16));
  const [bubble, setBubble] = useState<number[]>(original);
  const [merge, setMerge] = useState<number[]>(original);
  const [bubbleComparing, setBubbleComparing] = useState<number[]>([]);
  const [mergeComparing, setMergeComparing] = useState<number[]>([]);
  const [bubbleDone, setBubbleDone] = useState(false);
  const [mergeDone, setMergeDone] = useState(false);
  const [running, setRunning] = useState(false);
  const [winner, setWinner] = useState<'bubble' | 'merge' | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (bubbleDone && mergeDone && !completedRef.current) {
      completedRef.current = true;
      onComplete(60);
    }
  }, [bubbleDone, mergeDone, onComplete]);

  async function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function runBubble() {
    const arr = [...original];
    let swaps = 0;
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setBubbleComparing([j, j + 1]);
        await sleep(40);
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setBubble([...arr]);
          swaps++;
        }
      }
    }
    setBubbleComparing([]);
    setBubbleDone(true);
    if (!winner) setWinner('merge'); // bubble quase sempre termina depois
    return swaps;
  }

  async function runMerge() {
    const arr = [...original];

    async function mergeSort(start: number, end: number): Promise<number[]> {
      if (end - start <= 1) return arr.slice(start, end);
      const mid = Math.floor((start + end) / 2);
      const left = await mergeSort(start, mid);
      const right = await mergeSort(mid, end);

      const merged: number[] = [];
      let i = 0;
      let j = 0;
      while (i < left.length && j < right.length) {
        setMergeComparing([start + i, mid + j]);
        await sleep(40);
        if (left[i] <= right[j]) merged.push(left[i++]);
        else merged.push(right[j++]);
      }
      while (i < left.length) merged.push(left[i++]);
      while (j < right.length) merged.push(right[j++]);

      for (let k = 0; k < merged.length; k++) {
        arr[start + k] = merged[k];
      }
      setMerge([...arr]);
      return merged;
    }

    await mergeSort(0, arr.length);
    setMergeComparing([]);
    setMergeDone(true);
    if (!winner) setWinner('merge');
  }

  async function startRace() {
    setRunning(true);
    setBubble([...original]);
    setMerge([...original]);
    setBubbleDone(false);
    setMergeDone(false);
    setWinner(null);
    completedRef.current = false;
    await Promise.all([runBubble(), runMerge()]);
    setRunning(false);
  }

  function renderBars(arr: number[], comparing: number[], color: string) {
    return (
      <div className="flex h-32 items-end gap-1">
        {arr.map((val, idx) => (
          <div
            key={idx}
            className={`flex-1 rounded-t-sm transition-all duration-150 ${
              comparing.includes(idx) ? 'bg-amber-400' : color
            }`}
            style={{ height: `${val}%` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-2xl card-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-bold text-base-50">🏁 Corrida da Ordenação</h3>
          <p className="text-xs text-base-400">Bubble Sort vs Merge Sort — observe quem termina primeiro e por quê.</p>
        </div>
        <button
          onClick={startRace}
          disabled={running}
          className="rounded-lg bg-mint-400 px-4 py-2 text-sm font-semibold text-base-950 disabled:opacity-40"
        >
          {running ? 'Correndo...' : 'Iniciar corrida'}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-semibold">
            <span className="text-base-200">Bubble Sort · O(n²)</span>
            {bubbleDone && <span className="text-mint-400">✓ concluído</span>}
          </div>
          {renderBars(bubble, bubbleComparing, 'bg-violet-400')}
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-semibold">
            <span className="text-base-200">Merge Sort · O(n log n)</span>
            {mergeDone && <span className="text-mint-400">✓ concluído</span>}
          </div>
          {renderBars(merge, mergeComparing, 'bg-mint-400')}
        </div>
      </div>

      {bubbleDone && mergeDone && (
        <div className="mt-4 rounded-xl border border-mint-400/30 bg-mint-900/20 p-3 text-sm text-mint-200">
          🎉 Ambos terminaram! Note como o Merge Sort faz muito menos comparações totais — essa é a diferença entre O(n²) e O(n log n) na prática.
        </div>
      )}
    </div>
  );
}
