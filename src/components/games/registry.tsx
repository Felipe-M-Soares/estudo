import { lazy, Suspense, type ReactNode } from 'react';
import { GameLoader } from '../ui/GameLoader';

// Jogos com lógica própria (não são apenas SpeedChallenge) carregam sob demanda —
// assim quem nunca abre "Labirinto Lógico" nunca baixa o código dele.
const LogicMazeGame = lazy(() => import('./LogicMazeGame').then((m) => ({ default: m.LogicMazeGame })));
const SortVisualizerGame = lazy(() => import('./SortVisualizerGame').then((m) => ({ default: m.SortVisualizerGame })));
const FlexboxDojoGame = lazy(() => import('./FlexboxDojoGame').then((m) => ({ default: m.FlexboxDojoGame })));
const SqlQueryBuilderGame = lazy(() => import('./SqlQueryBuilderGame').then((m) => ({ default: m.SqlQueryBuilderGame })));
const ConsoleDetectiveGame = lazy(() => import('./ConsoleDetectiveGame').then((m) => ({ default: m.ConsoleDetectiveGame })));
const BugHunterGame = lazy(() => import('./BugHunterGame').then((m) => ({ default: m.BugHunterGame })));
const MemoryGame = lazy(() => import('./MemoryGame').then((m) => ({ default: m.MemoryGame })));
const TerminalSimulatorGame = lazy(() => import('./TerminalSimulatorGame').then((m) => ({ default: m.TerminalSimulatorGame })));
const ArchitectureBuilderGame = lazy(() => import('./ArchitectureBuilderGame').then((m) => ({ default: m.ArchitectureBuilderGame })));
const VulnerabilityHunterGame = lazy(() => import('./VulnerabilityHunterGame').then((m) => ({ default: m.VulnerabilityHunterGame })));
const PythonDetectiveGame = lazy(() => import('./PythonDetectiveGame').then((m) => ({ default: m.PythonDetectiveGame })));
const GoConcurrencyGame = lazy(() => import('./GoConcurrencyGame').then((m) => ({ default: m.GoConcurrencyGame })));
const NoSqlCommandGame = lazy(() => import('./NoSqlCommandGame').then((m) => ({ default: m.NoSqlCommandGame })));
import { SpeedChallengeGame, type SpeedChallengeQuestion } from './SpeedChallengeGame';

function withLoader(node: ReactNode): ReactNode {
  return <Suspense fallback={<GameLoader />}>{node}</Suspense>;
}

interface GameDef {
  render: (onComplete: (score: number) => void) => ReactNode;
}

const cssSelectorHuntQuestions: SpeedChallengeQuestion[] = [
  {
    prompt: 'Qual seletor CSS aplica estilo a TODOS os parágrafos <p> da página?',
    options: ['.p', '#p', 'p', '*p'],
    correctIndex: 2,
  },
  {
    prompt: 'Qual seletor escolhe um elemento com id="menu"?',
    options: ['.menu', '#menu', 'menu', '[menu]'],
    correctIndex: 1,
  },
  {
    prompt: 'Qual seletor escolhe todos os elementos com class="card"?',
    options: ['#card', 'card', '.card', '*card'],
    correctIndex: 2,
  },
  {
    prompt: 'O que `div > p` seleciona?',
    options: [
      'Todo <p> dentro de qualquer <div>, em qualquer profundidade',
      'Apenas <p> que são filhos diretos de um <div>',
      'Apenas <div> que contêm <p>',
      'Não é um seletor válido',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'O que `a:hover` representa?',
    options: ['Todos os links visitados', 'O estado de um link quando o mouse passa por cima', 'Links sem href', 'Links externos'],
    correctIndex: 1,
  },
];

const httpStatusQuestions: SpeedChallengeQuestion[] = [
  {
    prompt: 'Um recurso foi criado com sucesso via POST. Qual status retornar?',
    options: ['200', '201', '204', '301'],
    correctIndex: 1,
  },
  {
    prompt: 'O cliente enviou dados em formato inválido. Qual status?',
    options: ['400', '404', '500', '200'],
    correctIndex: 0,
  },
  {
    prompt: 'O usuário não está autenticado e tentou acessar uma rota protegida. Qual status?',
    options: ['403', '401', '400', '500'],
    correctIndex: 1,
  },
  {
    prompt: 'O usuário está autenticado mas não tem permissão para essa ação específica. Qual status?',
    options: ['401', '403', '404', '409'],
    correctIndex: 1,
  },
  {
    prompt: 'O servidor teve um erro inesperado processando a requisição. Qual status?',
    options: ['400', '404', '500', '200'],
    correctIndex: 2,
  },
];

const gitBranchQuestions: SpeedChallengeQuestion[] = [
  {
    prompt: 'Qual comando cria e muda para uma nova branch chamada "feature/login" de uma vez?',
    options: ['git branch feature/login', 'git checkout -b feature/login', 'git merge feature/login', 'git push feature/login'],
    correctIndex: 1,
  },
  {
    prompt: 'Você terminou uma feature e quer trazer suas mudanças para a main. Qual ação é o passo recomendado?',
    options: ['Apagar a branch main', 'Abrir um Pull Request da feature para a main', 'Fazer push direto na main sem revisão', 'Clonar o repositório de novo'],
    correctIndex: 1,
  },
  {
    prompt: 'O que significa um "conflito de merge"?',
    options: [
      'O Git travou permanentemente',
      'Duas branches modificaram a mesma parte de um arquivo de formas diferentes e o Git não sabe qual manter',
      'Você não tem permissão para fazer merge',
      'O repositório está corrompido',
    ],
    correctIndex: 1,
  },
];

const solidQuestions: SpeedChallengeQuestion[] = [
  {
    prompt: 'Uma classe "RelatorioService" gera relatórios E envia e-mails E salva logs. Qual princípio SOLID ela viola?',
    options: ['Open/Closed', 'Single Responsibility', 'Liskov Substitution', 'Dependency Inversion'],
    correctIndex: 1,
  },
  {
    prompt: 'O princípio "Open/Closed" diz que uma classe deve estar:',
    options: [
      'Aberta para modificação, fechada para extensão',
      'Aberta para extensão, fechada para modificação',
      'Sempre aberta para tudo',
      'Sempre fechada para tudo',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'Dependency Inversion sugere que módulos de alto nível devem depender de:',
    options: ['Implementações concretas específicas', 'Abstrações/interfaces, não detalhes concretos', 'Nada, devem ser isolados', 'Bibliotecas externas sempre'],
    correctIndex: 1,
  },
];

const middlewareQuestions: SpeedChallengeQuestion[] = [
  {
    prompt: 'Numa API, qual ordem de middlewares faz mais sentido para uma rota protegida?',
    options: [
      'Validação do body → Autenticação → Handler da rota',
      'Autenticação → Validação do body → Handler da rota',
      'Handler da rota → Autenticação → Validação',
      'A ordem nunca importa',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'O que acontece se um middleware não chamar next() nem enviar uma resposta?',
    options: ['Nada, o Express ignora', 'A requisição fica travada, sem resposta', 'O servidor reinicia', 'O middleware é pulado automaticamente'],
    correctIndex: 1,
  },
];

const renderingQuestions: SpeedChallengeQuestion[] = [
  {
    prompt: 'Um e-commerce com preços que mudam toda hora deveria usar, para a página de produto:',
    options: ['SSG puro, sem revalidação', 'SSR ou ISR com revalidação curta', 'Apenas HTML estático fixo', 'Nenhuma renderização no servidor'],
    correctIndex: 1,
  },
  {
    prompt: 'Uma página "Sobre nós" institucional, que quase nunca muda, é ideal para:',
    options: ['SSR a cada requisição', 'SSG', 'WebSocket', 'Polling constante'],
    correctIndex: 1,
  },
];

const englishFlashcards: SpeedChallengeQuestion[] = [
  {
    prompt: 'O que significa "rollback" no contexto de deploy?',
    options: ['Avançar para a próxima versão', 'Reverter para uma versão anterior estável', 'Reiniciar o servidor', 'Compilar o código'],
    correctIndex: 1,
  },
  {
    prompt: 'O que é "race condition"?',
    options: [
      'Uma corrida entre dois servidores',
      'Quando o resultado de um programa depende da ordem/tempo de execução de operações concorrentes',
      'Um tipo de erro de sintaxe',
      'Um teste automatizado',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'O que significa "throughput" em sistemas?',
    options: ['Tempo de resposta de uma única requisição', 'Quantidade de trabalho processado por unidade de tempo', 'Tamanho do banco de dados', 'Número de erros'],
    correctIndex: 1,
  },
  {
    prompt: 'O que é um "threshold" numa configuração de alerta?',
    options: ['Um tipo de banco de dados', 'Um valor limite que, ao ser cruzado, dispara uma ação', 'O nome de um servidor', 'Um tipo de teste'],
    correctIndex: 1,
  },
];

export const gameRegistry: Record<string, GameDef> = {
  'logic-maze': { render: (onComplete) => withLoader(<LogicMazeGame onComplete={onComplete} />) },
  'sort-visualizer': { render: (onComplete) => withLoader(<SortVisualizerGame onComplete={onComplete} />) },
  'flexbox-dojo': { render: (onComplete) => withLoader(<FlexboxDojoGame onComplete={onComplete} />) },
  'bug-hunter': { render: (onComplete) => withLoader(<BugHunterGame onComplete={onComplete} />) },
  'memory-concepts': { render: (onComplete) => withLoader(<MemoryGame onComplete={onComplete} />) },
  'terminal-simulator': { render: (onComplete) => withLoader(<TerminalSimulatorGame onComplete={onComplete} />) },
  'architecture-builder': { render: (onComplete) => withLoader(<ArchitectureBuilderGame onComplete={onComplete} />) },
  'vulnerability-hunter': { render: (onComplete) => withLoader(<VulnerabilityHunterGame onComplete={onComplete} />) },
  'python-detective': { render: (onComplete) => withLoader(<PythonDetectiveGame onComplete={onComplete} />) },
  'go-concurrency': { render: (onComplete) => withLoader(<GoConcurrencyGame onComplete={onComplete} />) },
  'nosql-command': { render: (onComplete) => withLoader(<NoSqlCommandGame onComplete={onComplete} />) },
  'css-selector-hunt': {
    render: (onComplete) => (
      <SpeedChallengeGame
        title="Caça ao Seletor CSS"
        emoji="🎯"
        description="Identifique o seletor CSS correto para cada cenário."
        questions={cssSelectorHuntQuestions}
        onComplete={onComplete}
      />
    ),
  },
  'js-console-detective': { render: (onComplete) => withLoader(<ConsoleDetectiveGame onComplete={onComplete} />) },
  'tic-tac-toe-build': {
    render: (onComplete) => (
      <SpeedChallengeGame
        title="Construtor de Jogo da Velha"
        emoji="❌⭕"
        description="Decida a lógica certa para cada situação do jogo da velha."
        questions={[
          {
            prompt: 'Como você verifica se alguém venceu numa linha do tabuleiro?',
            options: [
              'Comparando se as 3 posições da linha têm o mesmo valor e não estão vazias',
              'Contando o número de jogadas totais',
              'Verificando só a primeira posição',
              'Não é possível verificar isso',
            ],
            correctIndex: 0,
          },
          {
            prompt: 'O que indica um jogo empatado no jogo da velha?',
            options: [
              'Um jogador venceu duas vezes',
              'Todas as 9 posições foram preenchidas e nenhuma combinação venceu',
              'O jogo nunca empata',
              'Quando o "X" joga primeiro',
            ],
            correctIndex: 1,
          },
        ]}
        onComplete={onComplete}
      />
    ),
  },
  'sql-query-builder': { render: (onComplete) => withLoader(<SqlQueryBuilderGame onComplete={onComplete} />) },
  'git-branch-simulator': {
    render: (onComplete) => (
      <SpeedChallengeGame
        title="Simulador de Branches"
        emoji="🌿"
        description="Pratique decisões do fluxo de trabalho com Git e branches."
        questions={gitBranchQuestions}
        onComplete={onComplete}
      />
    ),
  },
  'http-status-match': {
    render: (onComplete) => (
      <SpeedChallengeGame
        title="Combinando Status Codes"
        emoji="🚦"
        description="Escolha o status HTTP correto para cada cenário de API."
        questions={httpStatusQuestions}
        secondsPerQuestion={12}
        onComplete={onComplete}
      />
    ),
  },
  'middleware-pipeline': {
    render: (onComplete) => (
      <SpeedChallengeGame
        title="Pipeline de Middlewares"
        emoji="🔗"
        description="Decida a ordem e o comportamento corretos de middlewares Express."
        questions={middlewareQuestions}
        onComplete={onComplete}
      />
    ),
  },
  'react-state-lab': {
    render: (onComplete) => (
      <SpeedChallengeGame
        title="Laboratório de Estado"
        emoji="🧪"
        description="Preveja como o componente React se comporta após cada interação."
        questions={[
          {
            prompt: 'Chamar setState com o mesmo valor que já está no estado causa um novo render?',
            options: ['Sempre causa', 'O React pode pular o re-render se o valor for idêntico', 'Causa um erro', 'Reseta o componente'],
            correctIndex: 1,
          },
          {
            prompt: 'useEffect com array de dependências [count] executa quando:',
            options: ['Nunca', 'Toda renderização, sem excessão', 'Sempre que o valor de count mudar entre renders', 'Só uma vez, ao montar'],
            correctIndex: 2,
          },
        ]}
        onComplete={onComplete}
      />
    ),
  },
  'typescript-type-detective': {
    render: (onComplete) => (
      <SpeedChallengeGame
        title="Detetive de Tipos"
        emoji="🔎"
        description="Encontre o erro de tipo escondido no código TypeScript."
        questions={[
          {
            prompt: 'Qual o problema neste código?',
            code: 'function soma(a: number, b: number) {\n  return a + b;\n}\nsoma("3", 4);',
            options: ['Nenhum problema', '"3" é string, mas o parâmetro espera number', 'Faltou o tipo de retorno', 'JavaScript não tem tipos'],
            correctIndex: 1,
          },
          {
            prompt: 'Por que `let x: any = "texto"; x.toFixed(2);` não gera erro de compilação, mesmo sendo inválido em runtime?',
            options: ['TypeScript sempre verifica em runtime', '`any` desliga toda checagem de tipo para aquela variável', 'toFixed funciona em strings', 'É um bug do TypeScript'],
            correctIndex: 1,
          },
        ]}
        onComplete={onComplete}
      />
    ),
  },
  'solid-principles-sorter': {
    render: (onComplete) => (
      <SpeedChallengeGame
        title="Classificador SOLID"
        emoji="🏛️"
        description="Identifique qual princípio SOLID está envolvido em cada cenário."
        questions={solidQuestions}
        onComplete={onComplete}
      />
    ),
  },
  'java-stream-builder': {
    render: (onComplete) => (
      <SpeedChallengeGame
        title="Montador de Streams"
        emoji="☕"
        description="Decida a sequência correta de operações de Stream em Java."
        questions={[
          {
            prompt: 'Para filtrar uma lista e depois transformar os itens restantes, a ordem correta de operações de Stream é:',
            options: ['map() então filter()', 'filter() então map()', 'collect() então filter()', 'A ordem nunca importa'],
            correctIndex: 1,
          },
          {
            prompt: 'O que `.collect(Collectors.toList())` faz ao final de uma stream?',
            options: ['Filtra a lista', 'Converte o stream de volta para uma List concreta', 'Ordena a lista', 'Remove duplicatas'],
            correctIndex: 1,
          },
        ]}
        onComplete={onComplete}
      />
    ),
  },
  'docker-compose-builder': {
    render: (onComplete) => (
      <SpeedChallengeGame
        title="Montador de Compose"
        emoji="🐳"
        description="Decida configurações corretas de docker-compose.yml para cenários reais."
        questions={[
          {
            prompt: 'Para garantir que dados do PostgreSQL sobrevivam a um `docker-compose down`, você deve usar:',
            options: ['Nada especial, é automático', 'Um volume nomeado mapeado para o diretório de dados do Postgres', 'Apenas mais memória', 'Rodar como root'],
            correctIndex: 1,
          },
          {
            prompt: 'O campo `depends_on` no docker-compose garante que:',
            options: [
              'Um serviço espera o outro estar 100% pronto para aceitar conexões',
              'A ordem de inicialização dos containers, mas não necessariamente que o serviço já esteja pronto para uso',
              'Os serviços compartilham o mesmo banco automaticamente',
              'Não tem nenhum efeito',
            ],
            correctIndex: 1,
          },
        ]}
        onComplete={onComplete}
      />
    ),
  },
  'rendering-strategy-picker': {
    render: (onComplete) => (
      <SpeedChallengeGame
        title="Escolha a Estratégia"
        emoji="⚡"
        description="Escolha SSR, SSG ou ISR para cada cenário de página."
        questions={renderingQuestions}
        onComplete={onComplete}
      />
    ),
  },
  'graphql-query-shaper': {
    render: (onComplete) => (
      <SpeedChallengeGame
        title="Moldando Queries GraphQL"
        emoji="📊"
        description="Decida o que uma query GraphQL deve incluir para cada pedido."
        questions={[
          {
            prompt: 'O cliente só precisa do nome e e-mail de um usuário, nada mais. A vantagem do GraphQL aqui é:',
            options: [
              'Nenhuma vantagem real',
              'A query pode pedir só esses dois campos, evitando over-fetching de dados desnecessários',
              'GraphQL é sempre mais lento',
              'GraphQL não suporta múltiplos campos',
            ],
            correctIndex: 1,
          },
        ]}
        onComplete={onComplete}
      />
    ),
  },
  'aws-service-matcher': {
    render: (onComplete) => (
      <SpeedChallengeGame
        title="Mapeando Serviços AWS"
        emoji="☁️"
        description="Escolha a combinação certa de serviços AWS para cada cenário de produto."
        questions={[
          {
            prompt: 'Você precisa rodar uma função simples só quando um arquivo é enviado, sem manter servidor ligado o tempo todo. Use:',
            options: ['EC2 sempre ligado', 'Lambda', 'RDS', 'IAM'],
            correctIndex: 1,
          },
          {
            prompt: 'Você precisa armazenar milhões de imagens de forma durável e barata. Use:',
            options: ['EC2', 'S3', 'Lambda', 'CloudWatch'],
            correctIndex: 1,
          },
        ]}
        onComplete={onComplete}
      />
    ),
  },
  'microservices-architect': {
    render: (onComplete) => (
      <SpeedChallengeGame
        title="Arquiteto de Microsserviços"
        emoji="🧩"
        description="Decida onde aplicar gateway, mensageria e circuit breaker num cenário dado."
        questions={[
          {
            prompt: 'O serviço de pagamento está instável e lento. Para proteger o resto do sistema, você aplica:',
            options: ['Nada, espera melhorar sozinho', 'Circuit Breaker nas chamadas a esse serviço', 'Remove o serviço completamente', 'Aumenta o timeout para infinito'],
            correctIndex: 1,
          },
        ]}
        onComplete={onComplete}
      />
    ),
  },
  'k8s-resource-builder': {
    render: (onComplete) => (
      <SpeedChallengeGame
        title="Montador de Recursos K8s"
        emoji="☸️"
        description="Escolha o recurso Kubernetes correto para cada necessidade."
        questions={[
          {
            prompt: 'Você quer garantir 3 réplicas de um Pod sempre rodando. Use:',
            options: ['Service', 'Deployment', 'Ingress', 'ConfigMap'],
            correctIndex: 1,
          },
          {
            prompt: 'Você quer expor sua aplicação externamente via HTTPS com um domínio específico. Use:',
            options: ['Pod', 'Secret', 'Ingress', 'ConfigMap'],
            correctIndex: 2,
          },
        ]}
        onComplete={onComplete}
      />
    ),
  },
  'cicd-pipeline-builder': {
    render: (onComplete) => (
      <SpeedChallengeGame
        title="Montador de Pipeline"
        emoji="⚙️"
        description="Decida a ordem e o conteúdo correto de estágios de uma pipeline CI/CD."
        questions={[
          {
            prompt: 'Qual a ordem mais lógica de estágios numa pipeline CI?',
            options: [
              'Deploy → Testes → Lint',
              'Lint → Testes → Build → Deploy',
              'Build → Deploy → Testes',
              'A ordem não importa',
            ],
            correctIndex: 1,
          },
        ]}
        onComplete={onComplete}
      />
    ),
  },
  'system-design-whiteboard': {
    render: (onComplete) => (
      <SpeedChallengeGame
        title="Quadro Branco de System Design"
        emoji="🏛️"
        description="Tome decisões de arquitetura para cenários clássicos de entrevista."
        questions={[
          {
            prompt: 'Um encurtador de URLs precisa, acima de tudo, de leitura extremamente rápida. A melhor estratégia de banco é:',
            options: [
              'Um único banco relacional sem nenhuma otimização',
              'Cache (ex: Redis) na frente do banco, para a maioria das leituras nunca tocar o disco',
              'Sem nenhum tipo de armazenamento',
              'Recalcular a URL original a cada requisição',
            ],
            correctIndex: 1,
          },
        ]}
        onComplete={onComplete}
      />
    ),
  },
  'code-review-simulator': {
    render: (onComplete) => (
      <SpeedChallengeGame
        title="Simulador de Code Review"
        emoji="👀"
        description="Escolha a abordagem de feedback mais construtiva para cada situação."
        questions={[
          {
            prompt: 'Você encontra uma função com nome confuso e sem testes. O comentário mais construtivo é:',
            options: [
              '"Esse código está uma bagunça."',
              '"Que acha de renomear para refletir o que a função faz, e adicionar um teste cobrindo o caso principal?"',
              'Aprovar sem comentar nada',
              '"Refaça tudo."',
            ],
            correctIndex: 1,
          },
        ]}
        onComplete={onComplete}
      />
    ),
  },
  'tech-english-flashcards': {
    render: (onComplete) => (
      <SpeedChallengeGame
        title="Flashcards de Inglês Técnico"
        emoji="🌎"
        description="Pratique vocabulário técnico em inglês usado no dia a dia de desenvolvimento."
        questions={englishFlashcards}
        onComplete={onComplete}
      />
    ),
  },
  'architecture-review-board': {
    render: (onComplete) => (
      <SpeedChallengeGame
        title="Banca de Revisão de Arquitetura"
        emoji="🎓"
        description="Responda perguntas típicas de uma banca de arquitetura sobre o seu projeto final."
        questions={[
          {
            prompt: 'Um avaliador pergunta: "por que você usou Kafka aqui em vez de chamadas HTTP diretas?" A melhor resposta demonstra:',
            options: [
              '"Porque é mais moderno"',
              'Entendimento de que mensageria assíncrona reduz acoplamento e tolera falhas parciais entre serviços',
              '"Não sei, só copiei de um tutorial"',
              '"Porque HTTP não funciona em produção"',
            ],
            correctIndex: 1,
          },
        ]}
        onComplete={onComplete}
      />
    ),
  },
  'fullstack-wiring': {
    render: (onComplete) => (
      <SpeedChallengeGame
        title="Conecte o Sistema"
        emoji="🔌"
        description="Decida a sequência correta de conexões entre frontend, API e banco de dados."
        questions={[
          {
            prompt: 'No fluxo de login de um sistema fullstack, o que acontece imediatamente após o backend validar a senha corretamente?',
            options: [
              'O backend apaga o usuário',
              'O backend gera um token JWT e o retorna ao frontend',
              'O frontend ignora a resposta',
              'Nada acontece',
            ],
            correctIndex: 1,
          },
        ]}
        onComplete={onComplete}
      />
    ),
  },
};
