import { useState } from 'react';
import { Play, RotateCcw, Plus, Trash2 } from 'lucide-react';

type Command = 'frente' | 'esquerda' | 'direita';

interface Level {
  grid: number[][]; // 0 = livre, 1 = parede
  start: { x: number; y: number; dir: 0 | 1 | 2 | 3 }; // 0=N,1=E,2=S,3=O
  goal: { x: number; y: number };
  difficulty: 'Fácil' | 'Médio' | 'Difícil' | 'Mestre';
}

const levels: Level[] = [
  {
    grid: [
      [0, 0, 0],
      [1, 1, 0],
      [0, 0, 0],
    ],
    start: { x: 0, y: 0, dir: 1 },
    goal: { x: 2, y: 2 },
    difficulty: 'Fácil',
  },
  {
    grid: [
      [0, 1, 0, 0],
      [0, 1, 0, 1],
      [0, 0, 0, 1],
      [1, 1, 0, 0],
    ],
    start: { x: 0, y: 0, dir: 2 },
    goal: { x: 3, y: 3 },
    difficulty: 'Fácil',
  },
  {
    grid: [
      [0, 0, 0, 0, 1],
      [1, 1, 0, 1, 0],
      [0, 0, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ],
    start: { x: 0, y: 0, dir: 1 },
    goal: { x: 4, y: 4 },
    difficulty: 'Médio',
  },
  {
    grid: [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 0, 1],
      [0, 0, 0, 0, 1],
      [1, 1, 0, 1, 1],
      [0, 0, 0, 0, 0],
    ],
    start: { x: 0, y: 0, dir: 2 },
    goal: { x: 0, y: 4 },
    difficulty: 'Médio',
  },
  {
    grid: [
      [0, 0, 0, 1, 0, 0],
      [1, 1, 0, 1, 0, 1],
      [0, 0, 0, 0, 0, 1],
      [0, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 0, 1],
      [1, 1, 0, 0, 0, 0],
    ],
    start: { x: 0, y: 0, dir: 1 },
    goal: { x: 5, y: 5 },
    difficulty: 'Difícil',
  },
  {
    grid: [
      [0, 0, 0, 0, 1, 0, 0],
      [1, 1, 1, 0, 1, 0, 1],
      [0, 0, 0, 0, 0, 0, 1],
      [0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ],
    start: { x: 0, y: 0, dir: 1 },
    goal: { x: 6, y: 6 },
    difficulty: 'Mestre',
  },
];

const difficultyColor: Record<Level['difficulty'], string> = {
  Fácil: 'text-mint-400 bg-mint-900/30',
  Médio: 'text-amber-400 bg-amber-500/15',
  Difícil: 'text-ember-400 bg-ember-500/15',
  Mestre: 'text-violet-400 bg-violet-500/15',
};

const DIRS = [
  { dx: 0, dy: -1 }, // N
  { dx: 1, dy: 0 }, // E
  { dx: 0, dy: 1 }, // S
  { dx: -1, dy: 0 }, // O
];

interface LogicMazeGameProps {
  onComplete: (score: number) => void;
}

export function LogicMazeGame({ onComplete }: LogicMazeGameProps) {
  const [levelIdx, setLevelIdx] = useState(0);
  const [program, setProgram] = useState<Command[]>([]);
  const [running, setRunning] = useState(false);
  const [robot, setRobot] = useState(levels[0].start);
  const [status, setStatus] = useState<'idle' | 'won' | 'crashed' | 'finished'>('idle');
  const [stepIdx, setStepIdx] = useState(-1);
  const [levelsCleared, setLevelsCleared] = useState(0);

  const level = levels[levelIdx];

  function addCommand(cmd: Command) {
    if (running) return;
    setProgram((p) => [...p, cmd]);
  }

  function clearProgram() {
    setProgram([]);
    setRobot(level.start);
    setStatus('idle');
    setStepIdx(-1);
  }

  async function run() {
    if (program.length === 0) return;
    setRunning(true);
    setStatus('idle');
    let current = { ...level.start };
    setRobot(current);

    for (let i = 0; i < program.length; i++) {
      await new Promise((r) => setTimeout(r, 320));
      setStepIdx(i);
      const cmd = program[i];

      if (cmd === 'esquerda') {
        current = { ...current, dir: ((current.dir + 3) % 4) as 0 | 1 | 2 | 3 };
      } else if (cmd === 'direita') {
        current = { ...current, dir: ((current.dir + 1) % 4) as 0 | 1 | 2 | 3 };
      } else if (cmd === 'frente') {
        const d = DIRS[current.dir];
        const nx = current.x + d.dx;
        const ny = current.y + d.dy;
        const inBounds = ny >= 0 && ny < level.grid.length && nx >= 0 && nx < level.grid[0].length;
        if (!inBounds || level.grid[ny][nx] === 1) {
          setStatus('crashed');
          setRunning(false);
          setRobot(current);
          return;
        }
        current = { ...current, x: nx, y: ny };
      }
      setRobot(current);
    }

    setStepIdx(-1);
    setRunning(false);
    if (current.x === level.goal.x && current.y === level.goal.y) {
      setStatus('won');
      const newCleared = levelsCleared + 1;
      setLevelsCleared(newCleared);
      if (levelIdx === levels.length - 1) {
        onComplete(100);
      } else {
        const score = Math.round((newCleared / levels.length) * 100);
        onComplete(score);
      }
    } else {
      setStatus('crashed');
    }
  }

  function nextLevel() {
    if (levelIdx + 1 >= levels.length) {
      setStatus('finished');
      return;
    }
    const next = levelIdx + 1;
    setLevelIdx(next);
    setProgram([]);
    setRobot(levels[next].start);
    setStatus('idle');
    setStepIdx(-1);
  }

  function restartAll() {
    setLevelIdx(0);
    setProgram([]);
    setRobot(levels[0].start);
    setStatus('idle');
    setStepIdx(-1);
    setLevelsCleared(0);
  }

  const rotation = robot.dir * 90;

  if (status === 'finished') {
    return (
      <div className="rounded-2xl card-surface p-6 text-center">
        <div className="text-3xl">🏆</div>
        <h3 className="mt-2 font-display text-lg font-bold text-base-50">Labirinto dominado!</h3>
        <p className="mt-1 text-sm text-base-400">Você completou todos os {levels.length} níveis, do fácil ao mestre.</p>
        <button onClick={restartAll} className="mt-4 rounded-lg border border-base-600 px-4 py-2 text-sm text-base-200 hover:bg-base-800">
          Jogar de novo
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl card-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-bold text-base-50">🧩 Labirinto Lógico</h3>
          <p className="text-xs text-base-400">Nível {levelIdx + 1} de {levels.length} — guie o robô até a bandeira.</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${difficultyColor[level.difficulty]}`}>
          {level.difficulty}
        </span>
      </div>

      <div
        className="mx-auto grid w-fit gap-1 rounded-xl border border-base-700 bg-base-900 p-3"
        style={{ gridTemplateColumns: `repeat(${level.grid[0].length}, minmax(0, 40px))` }}
      >
        {level.grid.map((row, y) =>
          row.map((cell, x) => {
            const isRobot = robot.x === x && robot.y === y;
            const isGoal = level.goal.x === x && level.goal.y === y;
            return (
              <div
                key={`${x}-${y}`}
                className={`flex h-10 w-10 items-center justify-center rounded-md text-lg ${
                  cell === 1 ? 'bg-base-700' : 'bg-base-800'
                }`}
              >
                {isRobot ? (
                  <span className="inline-block transition-transform duration-300" style={{ transform: `rotate(${rotation}deg)` }}>
                    🤖
                  </span>
                ) : isGoal ? (
                  '🚩'
                ) : null}
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <button onClick={() => addCommand('frente')} className="rounded-lg border border-base-600 px-3 py-1.5 text-xs font-semibold text-base-100 hover:bg-base-800">
          <Plus size={12} className="mr-1 inline" /> Frente
        </button>
        <button onClick={() => addCommand('esquerda')} className="rounded-lg border border-base-600 px-3 py-1.5 text-xs font-semibold text-base-100 hover:bg-base-800">
          ↺ Esquerda
        </button>
        <button onClick={() => addCommand('direita')} className="rounded-lg border border-base-600 px-3 py-1.5 text-xs font-semibold text-base-100 hover:bg-base-800">
          ↻ Direita
        </button>
      </div>

      <div className="mt-4 min-h-[44px] rounded-xl border border-base-700 bg-base-900 p-2">
        <div className="flex flex-wrap gap-1.5">
          {program.length === 0 && <span className="px-2 py-1 text-xs text-base-500">Seu programa aparece aqui...</span>}
          {program.map((cmd, idx) => (
            <span
              key={idx}
              className={`flex items-center gap-1 rounded-md px-2 py-1 font-mono text-xs ${
                idx === stepIdx ? 'bg-mint-400 text-base-950' : 'bg-base-700 text-base-100'
              }`}
            >
              {cmd === 'frente' ? '↑' : cmd === 'esquerda' ? '↺' : '↻'}
              {!running && (
                <button onClick={() => setProgram((p) => p.filter((_, i) => i !== idx))} className="text-base-400 hover:text-ember-400">
                  <Trash2 size={10} />
                </button>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={run}
          disabled={running || program.length === 0}
          className="flex items-center gap-1.5 rounded-lg bg-mint-400 px-4 py-2 text-sm font-semibold text-base-950 disabled:opacity-40"
        >
          <Play size={14} /> Executar
        </button>
        <button onClick={clearProgram} disabled={running} className="flex items-center gap-1.5 rounded-lg border border-base-600 px-3 py-2 text-sm text-base-300 hover:bg-base-800">
          <RotateCcw size={14} /> Limpar
        </button>
      </div>

      {status === 'won' && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-mint-400/30 bg-mint-900/20 p-3 text-sm text-mint-200">
          <span>🎉 Resolvido com {program.length} comandos!</span>
          <button onClick={nextLevel} className="rounded-lg bg-mint-400 px-3 py-1.5 text-xs font-semibold text-base-950">
            {levelIdx < levels.length - 1 ? 'Próximo nível →' : 'Ver resultado 🏆'}
          </button>
        </div>
      )}
      {status === 'crashed' && (
        <div className="mt-4 rounded-xl border border-ember-400/30 bg-ember-500/10 p-3 text-sm text-ember-300">
          💥 O robô bateu numa parede ou saiu da grade. Ajuste o programa e tente de novo.
        </div>
      )}
    </div>
  );
}
