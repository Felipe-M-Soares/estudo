import { useState } from 'react';
import { LayoutGrid, GitBranch, ShieldAlert, Database, FlaskConical, Braces, Plug } from 'lucide-react';
import { LayoutLab } from '../components/lab/LayoutLab';
import { GitLab } from '../components/lab/GitLab';
import { SecurityLab } from '../components/lab/SecurityLab';
import { DataLab } from '../components/lab/DataLab';
import { LogicLab } from '../components/lab/LogicLab';
import { ApiLab } from '../components/lab/ApiLab';

type LabTab = 'logic' | 'layout' | 'git' | 'api' | 'security' | 'data';

const TABS: { id: LabTab; label: string; icon: typeof LayoutGrid; color: string }[] = [
  { id: 'logic', label: 'Lógica & JS', icon: Braces, color: 'text-amber-300' },
  { id: 'layout', label: 'Layout & CSS', icon: LayoutGrid, color: 'text-cyan-300' },
  { id: 'git', label: 'Git na prática', icon: GitBranch, color: 'text-amber-300' },
  { id: 'api', label: 'API & HTTP', icon: Plug, color: 'text-cyan-300' },
  { id: 'security', label: 'Segurança', icon: ShieldAlert, color: 'text-ember-300' },
  { id: 'data', label: 'Dados', icon: Database, color: 'text-mint-300' },
];

export function LabPage() {
  const [tab, setTab] = useState<LabTab>('logic');

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8 lg:px-8">
      <div className="mb-6 animate-rise-in">
        <p className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
          <FlaskConical size={13} /> Laboratório prático
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-base-50">Coloque a mão na massa</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-base-300">
          Seis espaços isolados cobrindo a jornada inteira — lógica e JavaScript de verdade rodando no navegador, layout e CSS
          com desafios automáticos, um terminal Git completo com missões guiadas (até conflito de merge), um cliente de API
          REST/GraphQL/tempo real, 7 cenários de segurança ofensiva e defensiva, e bancos de dados SQL, transações, índices,
          MongoDB e Redis. Nada aqui é salvo entre sessões e nada se conecta a sistemas reais — é tudo local, seguro, e só seu.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                active ? 'border-cyan-400/50 bg-cyan-500/10 text-base-50' : 'border-base-700 bg-base-900/40 text-base-300 hover:border-base-500'
              }`}
            >
              <Icon size={15} className={active ? t.color : 'text-base-500'} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="card-surface animate-rise-in rounded-2xl p-3.5 sm:p-5">
        {tab === 'logic' && <LogicLab />}
        {tab === 'layout' && <LayoutLab />}
        {tab === 'git' && <GitLab />}
        {tab === 'api' && <ApiLab />}
        {tab === 'security' && <SecurityLab />}
        {tab === 'data' && <DataLab />}
      </div>
    </div>
  );
}
