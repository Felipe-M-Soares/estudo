import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface FieldState {
  name: string;
  value: string;
  rule: string;
  valid: boolean | null;
}

const SCENARIOS: { label: string; fields: { name: string; value: string; rule: string }[] }[] = [
  {
    label: 'Cadastro válido',
    fields: [
      { name: 'nome', value: 'Ana Silva', rule: 'min 2 caracteres' },
      { name: 'email', value: 'ana@email.com', rule: 'formato de email' },
      { name: 'idade', value: '28', rule: 'número >= 18' },
    ],
  },
  {
    label: 'Cadastro com erros',
    fields: [
      { name: 'nome', value: 'A', rule: 'min 2 caracteres' },
      { name: 'email', value: 'nao-e-email', rule: 'formato de email' },
      { name: 'idade', value: '15', rule: 'número >= 18' },
    ],
  },
];

function validateField(name: string, value: string): boolean {
  if (name === 'nome') return value.trim().length >= 2;
  if (name === 'email') return /^\S+@\S+\.\S+$/.test(value);
  if (name === 'idade') return Number(value) >= 18;
  return true;
}

export function ValidationDiagram() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [fields, setFields] = useState<FieldState[]>(
    SCENARIOS[0].fields.map((f) => ({ ...f, valid: null }))
  );
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<'idle' | 'pass' | 'fail'>('idle');

  async function run(idx: number) {
    setScenarioIdx(idx);
    setRunning(true);
    setResult('idle');
    const base = SCENARIOS[idx].fields.map((f) => ({ ...f, valid: null as boolean | null }));
    setFields(base);

    let allValid = true;
    for (let i = 0; i < base.length; i++) {
      await new Promise((r) => setTimeout(r, 500));
      const ok = validateField(base[i].name, base[i].value);
      if (!ok) allValid = false;
      setFields((prev) => prev.map((f, idx2) => (idx2 === i ? { ...f, valid: ok } : f)));
    }
    await new Promise((r) => setTimeout(r, 300));
    setResult(allValid ? 'pass' : 'fail');
    setRunning(false);
  }

  function reset() {
    setFields(SCENARIOS[scenarioIdx].fields.map((f) => ({ ...f, valid: null })));
    setResult('idle');
    setRunning(false);
  }

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex gap-1.5">
          {SCENARIOS.map((s, i) => (
            <button
              key={s.label}
              onClick={() => run(i)}
              disabled={running}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-40 ${
                scenarioIdx === i ? 'bg-mint-400 text-base-950' : 'bg-base-800 text-base-300'
              }`}
            >
              <Play size={10} className="mr-1 inline" /> {s.label}
            </button>
          ))}
        </div>
        <button onClick={reset} className="rounded-lg border border-base-600 px-2.5 py-1 text-xs text-base-300 hover:bg-base-800">
          <RotateCcw size={11} />
        </button>
      </div>

      <div className="space-y-2 rounded-xl bg-base-950/60 p-3">
        {fields.map((f) => (
          <div
            key={f.name}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
              f.valid === true ? 'bg-mint-900/30 text-mint-200' : f.valid === false ? 'bg-ember-500/15 text-ember-300' : 'bg-base-800 text-base-300'
            }`}
          >
            <span className="font-mono text-xs">{f.name}: "{f.value}"</span>
            <span className="text-[10px] text-base-400">{f.rule}</span>
            {f.valid !== null && <span className="font-bold">{f.valid ? '✓' : '✕'}</span>}
          </div>
        ))}
      </div>

      {result === 'pass' && <p className="mt-3 text-center text-sm font-semibold text-mint-300">✅ 200 — dados aceitos, segue para a lógica de negócio</p>}
      {result === 'fail' && <p className="mt-3 text-center text-sm font-semibold text-ember-400">❌ 400 — requisição rejeitada antes de tocar no banco de dados</p>}
    </div>
  );
}
