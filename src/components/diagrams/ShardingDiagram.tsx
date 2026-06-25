import { useState } from 'react';

const USERS = Array.from({ length: 12 }, (_, i) => i + 1);

export function ShardingDiagram() {
  const [shardCount, setShardCount] = useState(3);

  function shardFor(userId: number): number {
    return userId % shardCount;
  }

  const shardColors = ['bg-mint-400', 'bg-amber-400', 'bg-violet-400', 'bg-cyan-400'];

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex items-center gap-3">
        <span className="font-mono text-xs text-base-400">número de shards:</span>
        <input
          type="range"
          min={2}
          max={4}
          value={shardCount}
          onChange={(e) => setShardCount(Number(e.target.value))}
          className="flex-1 accent-mint-400"
        />
        <span className="mono-num text-sm font-bold text-base-100">{shardCount}</span>
      </div>

      <div className="mb-3 flex flex-wrap justify-center gap-1.5 rounded-xl bg-base-950/60 p-3">
        {USERS.map((id) => (
          <div
            key={id}
            className={`flex h-8 w-8 items-center justify-center rounded-md font-mono text-[11px] font-bold text-base-950 ${shardColors[shardFor(id)]}`}
          >
            {id}
          </div>
        ))}
      </div>

      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${shardCount}, 1fr)` }}>
        {Array.from({ length: shardCount }, (_, i) => i).map((shardIdx) => (
          <div key={shardIdx} className="rounded-lg border border-base-700 bg-base-800/40 p-2 text-center">
            <span className={`inline-block h-2 w-2 rounded-full ${shardColors[shardIdx]}`} />
            <p className="mt-1 font-mono text-[10px] text-base-300">shard {shardIdx}</p>
            <p className="text-[10px] text-base-500">{USERS.filter((id) => shardFor(id) === shardIdx).length} usuários</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-base-500">
        Cada usuário é roteado para um shard com base no seu ID (aqui, id % número de shards) — cada shard guarda só uma
        fração dos dados totais, distribuindo a carga entre máquinas diferentes.
      </p>
    </div>
  );
}
