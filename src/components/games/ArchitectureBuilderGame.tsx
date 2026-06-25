import { useState } from 'react';

interface ArchChallenge {
  scenario: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  components: string[];
  pool: string[];
  explanation: string;
}

const challenges: ArchChallenge[] = [
  {
    scenario: 'Um usuário acessa um site e o navegador busca a página. Monte o fluxo básico, do cliente até a resposta.',
    difficulty: 'Fácil',
    components: ['Navegador', 'Servidor Web', 'Banco de Dados'],
    pool: ['Navegador', 'Servidor Web', 'Banco de Dados', 'Impressora', 'Antivírus'],
    explanation: 'O fluxo mais básico: o navegador faz a requisição, o servidor processa e consulta o banco quando necessário, e a resposta volta pelo mesmo caminho.',
  },
  {
    scenario: 'Uma API precisa autenticar o usuário antes de processar o pedido. Monte o fluxo de uma requisição autenticada.',
    difficulty: 'Médio',
    components: ['Cliente', 'API Gateway', 'Middleware de Autenticação', 'Controller', 'Banco de Dados'],
    pool: ['Cliente', 'API Gateway', 'Middleware de Autenticação', 'Controller', 'Banco de Dados', 'CDN', 'DNS'],
    explanation: 'A requisição passa pelo Gateway, é validada pelo middleware de autenticação antes de chegar ao Controller, que então consulta o banco de dados.',
  },
  {
    scenario: 'Um e-commerce de alto tráfego precisa servir imagens rapidamente para usuários no mundo todo, com banco protegido por cache.',
    difficulty: 'Médio',
    components: ['Cliente', 'CDN', 'Load Balancer', 'Cache (Redis)', 'Banco de Dados'],
    pool: ['Cliente', 'CDN', 'Load Balancer', 'Cache (Redis)', 'Banco de Dados', 'Impressora', 'FTP'],
    explanation: 'A CDN serve conteúdo estático próximo do usuário; o Load Balancer distribui requisições dinâmicas; o cache evita consultas repetidas ao banco.',
  },
  {
    scenario: 'Um sistema de pedidos precisa notificar o serviço de estoque sem ficar esperando a resposta (comunicação assíncrona).',
    difficulty: 'Difícil',
    components: ['Serviço de Pedidos', 'Fila de Mensagens (Kafka)', 'Serviço de Estoque'],
    pool: ['Serviço de Pedidos', 'Fila de Mensagens (Kafka)', 'Serviço de Estoque', 'Chamada HTTP direta', 'FTP'],
    explanation: 'Em vez de uma chamada HTTP direta (que criaria acoplamento forte), o Serviço de Pedidos publica um evento na fila, e o Serviço de Estoque consome quando estiver disponível.',
  },
  {
    scenario: 'Uma requisição precisa atravessar autenticação, validação de dados, e só então chegar na lógica de negócio.',
    difficulty: 'Difícil',
    components: ['Requisição', 'Middleware de Autenticação', 'Middleware de Validação', 'Lógica de Negócio'],
    pool: ['Requisição', 'Middleware de Autenticação', 'Middleware de Validação', 'Lógica de Negócio', 'Cache', 'CDN'],
    explanation: 'A ordem de middlewares importa: autenticar primeiro (quem é você?), validar os dados depois (os dados estão corretos?), e só então executar a lógica de negócio.',
  },
];

const difficultyColor: Record<ArchChallenge['difficulty'], string> = {
  Fácil: 'text-mint-400 bg-mint-900/30',
  Médio: 'text-amber-400 bg-amber-500/15',
  Difícil: 'text-ember-400 bg-ember-500/15',
};

interface ArchitectureBuilderGameProps {
  onComplete: (score: number) => void;
}

export function ArchitectureBuilderGame({ onComplete }: ArchitectureBuilderGameProps) {
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<string[]>([]);
  const [solved, setSolved] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [finished, setFinished] = useState(false);

  const challenge = challenges[idx];

  function addComponent(comp: string) {
    if (feedback) return;
    setChosen((c) => [...c, comp]);
  }

  function removeLast() {
    if (feedback) return;
    setChosen((c) => c.slice(0, -1));
  }

  function check() {
    const correct = chosen.length === challenge.components.length && chosen.every((c, i) => c === challenge.components[i]);
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) {
      const newSolved = solved + 1;
      setSolved(newSolved);
      setTimeout(() => {
        if (idx + 1 < challenges.length) {
          setIdx((i) => i + 1);
          setChosen([]);
          setFeedback(null);
        } else {
          setFinished(true);
          onComplete(Math.round((newSolved / challenges.length) * 100));
        }
      }, 1800);
    }
  }

  function tryAgain() {
    setChosen([]);
    setFeedback(null);
  }

  function restart() {
    setIdx(0);
    setChosen([]);
    setSolved(0);
    setFeedback(null);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="rounded-2xl card-surface p-6 text-center">
        <div className="text-3xl">🏛️</div>
        <h3 className="mt-2 font-display text-lg font-bold text-base-50">{solved}/{challenges.length} arquiteturas corretas</h3>
        <p className="mt-1 text-sm text-base-400">Do fluxo básico até mensageria assíncrona.</p>
        <button onClick={restart} className="mt-4 rounded-lg border border-base-600 px-4 py-2 text-sm text-base-200 hover:bg-base-800">
          Jogar de novo
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl card-surface p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="font-display text-base font-bold text-base-50">🏛️ Arquiteto de Sistemas</h3>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${difficultyColor[challenge.difficulty]}`}>
          {challenge.difficulty}
        </span>
      </div>
      <p className="mb-3 text-sm text-amber-300">{challenge.scenario}</p>

      <div className="min-h-[60px] rounded-xl border border-base-700 bg-base-900 p-3">
        {chosen.length === 0 ? (
          <span className="font-mono text-xs text-base-500">Clique nos componentes abaixo, na ordem do fluxo...</span>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5">
            {chosen.map((c, i) => (
              <span key={i} className="flex items-center gap-1 rounded-lg bg-mint-900/40 px-2.5 py-1 text-xs font-medium text-mint-200">
                {i > 0 && <span className="text-base-500">→</span>} {c}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {challenge.pool.map((comp) => (
          <button
            key={comp}
            onClick={() => addComponent(comp)}
            disabled={!!feedback}
            className="rounded-lg border border-base-600 px-3 py-1.5 text-xs text-base-200 transition-colors hover:border-base-500 hover:bg-base-800 disabled:opacity-40"
          >
            {comp}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        {!feedback && (
          <>
            <button onClick={check} disabled={chosen.length === 0} className="rounded-lg bg-mint-400 px-4 py-2 text-sm font-semibold text-base-950 disabled:opacity-40">
              Verificar fluxo
            </button>
            <button onClick={removeLast} disabled={chosen.length === 0} className="rounded-lg border border-base-600 px-3 py-2 text-sm text-base-300 hover:bg-base-800 disabled:opacity-40">
              Desfazer último
            </button>
          </>
        )}
      </div>

      {feedback === 'correct' && (
        <div className="mt-3 rounded-xl border border-mint-400/30 bg-mint-900/20 p-3 text-sm text-mint-200">
          ✅ Fluxo correto! {challenge.explanation}
        </div>
      )}
      {feedback === 'wrong' && (
        <div className="mt-3 rounded-xl border border-ember-400/30 bg-ember-500/10 p-3 text-sm text-ember-300">
          <p className="mb-2">❌ Essa ordem não está certa. O fluxo esperado era: {challenge.components.join(' → ')}.</p>
          <button onClick={tryAgain} className="rounded-lg border border-ember-400/40 px-3 py-1.5 text-xs font-semibold text-ember-200 hover:bg-ember-500/10">
            Tentar de novo
          </button>
        </div>
      )}
    </div>
  );
}
