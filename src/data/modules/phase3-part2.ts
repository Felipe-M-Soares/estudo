import type { Module } from '../types';

export const mes16: Module = {
  id: 'mes-16',
  month: 16,
  phase: 3,
  track: 'fullstack',
  title: 'System Design',
  emoji: '🏛️',
  tagline: 'Pensar em sistemas, não só em código.',
  intro:
    'System Design é a habilidade de projetar sistemas que escalam, ficam disponíveis e se mantêm consistentes — mesmo quando a demanda multiplica por 100 ou um servidor cai no meio da madrugada. É também o tipo de entrevista mais temida (e mais decisiva) para vagas sênior.',
  lessons: [
    {
      id: 'l1',
      heading: 'Escalabilidade, disponibilidade e consistência',
      body:
        '**Escalabilidade** é a capacidade do sistema de lidar com mais carga adicionando recursos — vertical (máquina maior) ou horizontal (mais máquinas). **Disponibilidade** mede quanto tempo o sistema está operacional e respondendo. **Consistência** garante que todos que leem o dado veem a mesma versão dele — em sistemas distribuídos, isso é surpreendentemente difícil de garantir o tempo todo.',
    },
    {
      id: 'l2',
      heading: 'CAP Theorem: você não pode ter tudo',
      body:
        'Em um sistema distribuído, durante uma falha de rede (Partição), você é forçado a escolher entre **Consistência** (todos veem o mesmo dado, mesmo que isso signifique recusar responder) e **Disponibilidade** (sempre responder, mesmo que o dado possa estar desatualizado). Não existe sistema distribuído que garanta as três propriedades (Consistência, Disponibilidade, Tolerância a Partição) simultaneamente o tempo todo — esse é o CAP Theorem.',
    },
    {
      id: 'l3',
      heading: 'CQRS, Event Sourcing e Saga',
      body:
        '**CQRS** (Command Query Responsibility Segregation) separa o caminho de escrita (comandos) do caminho de leitura (queries) — útil quando os padrões de leitura e escrita têm necessidades muito diferentes de performance ou modelo de dados.\n\n**Event Sourcing** guarda o histórico completo de eventos que levaram a um estado, em vez de só o estado atual — permitindo reconstruir o passado e auditar exatamente o que aconteceu.\n\n**Saga** coordena uma transação que abrange múltiplos microsserviços, onde uma transação ACID tradicional (de um único banco) não é possível — cada passo tem uma ação compensatória caso algo falhe no meio do caminho.',
    },
    {
      id: 'l4',
      heading: 'Sharding e replicação',
      body:
        '**Sharding** divide um banco de dados muito grande em partições (shards) menores, cada uma em uma máquina diferente, distribuindo a carga. **Replicação** mantém cópias do mesmo dado em múltiplas máquinas — para tolerância a falhas (se uma cair, outra responde) e para distribuir carga de leitura.',
    },
  ],
  resources: [
    { label: 'Grokking System Design', url: 'https://www.educative.io/courses/grokking-the-system-design-interview' },
    { label: 'System Design Primer (GitHub)', url: 'https://github.com/donnemartin/system-design-primer' },
  ],
  checklist: [
    { id: 'c1', label: 'Documento de arquitetura completo' },
    { id: 'c2', label: 'Diagramas C4' },
    { id: 'c3', label: 'Análise de trade-offs' },
  ],
  goalLabel: 'Meta: Documento de arquitetura',
  exercises: [
    {
      type: 'mcq',
      id: 'm16-e1',
      prompt: 'O que é o CAP Theorem em sistemas distribuídos?',
      options: [
        'Consistência, Disponibilidade, Particionamento',
        'Cache, API, Performance',
        'Container, Application, Platform',
        'Cloud, Availability, Privacy',
      ],
      correctIndex: 0,
      explanation:
        'CAP Theorem afirma que, durante uma partição de rede, um sistema distribuído deve escolher entre priorizar Consistência ou Disponibilidade — não pode garantir ambas perfeitamente ao mesmo tempo.',
    },
    {
      type: 'truefalse',
      id: 'm16-e2',
      prompt: 'Sharding e replicação resolvem exatamente o mesmo problema, de forma intercambiável.',
      answer: false,
      explanation:
        'Sharding distribui dados diferentes entre máquinas diferentes (escala de volume). Replicação copia o mesmo dado em várias máquinas (tolerância a falhas e escala de leitura). São complementares, não substitutos.',
    },
    {
      type: 'mcq',
      id: 'm16-e3',
      prompt: 'Por que o padrão Saga é necessário em arquiteturas de microsserviços?',
      options: [
        'Porque transações ACID tradicionais não funcionam entre múltiplos bancos/serviços independentes',
        'Porque é mais rápido que uma transação normal',
        'Porque elimina a necessidade de tratamento de erros',
        'Porque substitui a necessidade de testes',
      ],
      correctIndex: 0,
      explanation:
        'Quando uma operação de negócio abrange vários serviços com bancos próprios, não há uma transação atômica única possível — Saga coordena isso com passos e compensações.',
    },
  ],
  games: [
    {
      gameId: 'system-design-whiteboard',
      label: 'Quadro Branco de System Design',
      description: 'Desenhe a arquitetura de um sistema dado um cenário (ex: encurtador de URLs, feed de rede social) com componentes arrastáveis.',
    },
  ],
};

export const mes17: Module = {
  id: 'mes-17',
  month: 17,
  phase: 3,
  track: 'soft',
  title: 'Liderança & Inglês',
  emoji: '🗣️',
  tagline: 'A parte da carreira que o código não ensina.',
  intro:
    'Em algum momento, sua carreira deixa de ser só sobre escrever código e passa a ser sobre influenciar decisões, orientar outras pessoas e comunicar com clareza — muitas vezes em inglês. Essas são as habilidades que diferenciam quem é "bom tecnicamente" de quem realmente cresce para posições sênior.',
  lessons: [
    {
      id: 'l1',
      heading: 'Code Review que ensina, não que humilha',
      body:
        'Um bom code review foca no código, não na pessoa: "esse loop pode causar um problema de performance com listas grandes" em vez de "você não pensou nisso?". Pergunte antes de afirmar quando não tiver certeza da intenção do autor. Elogie o que está bom, não só o que precisa mudar — isso constrói confiança no time para receber feedback no futuro.',
    },
    {
      id: 'l2',
      heading: 'Mentoria e tomada de decisão técnica',
      body:
        'Mentorar não é dar a resposta pronta — é fazer as perguntas certas para que a pessoa chegue à resposta sozinha, desenvolvendo o raciocínio dela, não sua dependência de você.\n\nDecisões técnicas relevantes merecem registro: um ADR (Architecture Decision Record) documenta o que foi decidido, por quê, e quais alternativas foram consideradas — isso evita repetir debates antigos e dá contexto para quem entra no time depois.',
    },
    {
      id: 'l3',
      heading: 'Inglês técnico: vocabulário que aparece todo dia',
      body:
        'A maior parte da documentação técnica, das discussões em fóruns e das vagas internacionais é em inglês. Você não precisa de fluência de cinema — precisa de vocabulário técnico sólido (deploy, rollback, threshold, throughput, race condition) e confiança para escrever um PR description ou participar de uma daily em inglês sem travar.',
    },
  ],
  resources: [
    { label: 'Tandem (troca de idiomas)', url: 'https://www.tandem.net' },
    { label: 'StaffEng', url: 'https://staffeng.com' },
  ],
  checklist: [
    { id: 'c1', label: '5+ code reviews em projetos' },
    { id: 'c2', label: '1 apresentação técnica em inglês' },
    { id: 'c3', label: 'Perfil no LinkedIn atualizado' },
  ],
  goalLabel: 'Meta: 5 PRs revisados',
  exercises: [
    {
      type: 'mcq',
      id: 'm17-e1',
      prompt: 'Qual é a abordagem mais construtiva ao apontar um problema em um code review?',
      options: [
        '"Isso está errado, refaça."',
        '"Esse loop pode causar lentidão com listas grandes — que acha de usar um Map aqui?"',
        'Ignorar o problema para não criar atrito',
        'Aprovar mesmo assim e comentar depois informalmente',
      ],
      correctIndex: 1,
      explanation:
        'Feedback eficaz é específico, explica o porquê, e convida a uma solução conjunta — em vez de só apontar erro sem contexto ou alternativa.',
    },
    {
      type: 'truefalse',
      id: 'm17-e2',
      prompt: 'Mentoria eficaz significa sempre dar a resposta certa rapidamente para a pessoa não perder tempo.',
      answer: false,
      explanation:
        'Mentoria eficaz frequentemente envolve guiar com perguntas, ajudando a pessoa a desenvolver seu próprio raciocínio, em vez de criar dependência de respostas prontas.',
    },
    {
      type: 'mcq',
      id: 'm17-e3',
      prompt: 'Qual a função de um ADR (Architecture Decision Record)?',
      options: [
        'Documentar decisões técnicas importantes, o porquê, e as alternativas consideradas',
        'Substituir testes automatizados',
        'Ser um tipo de banco de dados',
        'Gerenciar permissões de acesso ao código',
      ],
      correctIndex: 0,
      explanation: 'Um ADR registra o contexto e raciocínio por trás de uma decisão arquitetural, preservando esse conhecimento ao longo do tempo.',
    },
  ],
  games: [
    {
      gameId: 'code-review-simulator',
      label: 'Simulador de Code Review',
      description: 'Receba trechos de código com problemas reais e escreva comentários de review — veja como sua abordagem seria recebida.',
    },
    {
      gameId: 'tech-english-flashcards',
      label: 'Flashcards de Inglês Técnico',
      description: 'Pratique vocabulário técnico em inglês usado em código, PRs e reuniões do dia a dia.',
    },
  ],
};

export const mes18: Module = {
  id: 'mes-18',
  month: 18,
  phase: 3,
  track: 'fullstack',
  title: 'Projeto Final Full Stack',
  emoji: '🏆',
  tagline: 'Tudo que você construiu nos últimos 17 meses, em um único sistema.',
  intro:
    'Esse é o projeto que vai para seu portfólio e que você vai apresentar em entrevistas. Uma plataforma completa, usando praticamente toda a stack que você estudou: frontend moderno, backend robusto, infraestrutura em nuvem, e dados híbridos relacionais/não-relacionais com eventos.',
  lessons: [
    {
      id: 'l1',
      heading: 'Planejando antes de codar',
      body:
        'Antes de escrever a primeira linha, defina: qual problema real esse sistema resolve? Quem é o usuário? Quais são as 3-5 funcionalidades centrais (não 20) que realmente importam para a primeira versão? Um projeto final ambicioso demais que nunca termina vale menos no portfólio do que um projeto focado e completo.',
    },
    {
      id: 'l2',
      heading: 'Integrando a stack completa',
      body:
        'Frontend em React + TypeScript com Next.js (aproveitando SSR onde fizer sentido para SEO ou performance). Backend em Java Spring Boot, expondo tanto REST quanto GraphQL conforme o caso de uso. PostgreSQL para dados relacionais (usuários, pedidos), MongoDB para dados mais flexíveis (logs, configurações dinâmicas). Kafka para eventos entre serviços, se a arquitetura usar múltiplos microsserviços.\n\nO objetivo não é usar **toda** tecnologia que você aprendeu só para mostrar que sabe — é usar a tecnologia certa onde ela realmente resolve um problema do seu sistema.',
    },
    {
      id: 'l3',
      heading: 'Documentação e apresentação: o que faz alguém contratar você',
      body:
        'Um README excelente explica: o que o projeto faz, como rodar localmente, decisões de arquitetura importantes, e o que você aprenderia/faria diferente com mais tempo. Um vídeo curto de demonstração (3-5 min) mostrando o sistema funcionando vale mais que qualquer descrição em texto — recrutadores raramente vão clonar e rodar seu projeto, mas quase sempre assistem um vídeo de 3 minutos.',
    },
  ],
  resources: [
    { label: 'Seu repositório no GitHub', url: 'https://github.com' },
  ],
  checklist: [
    { id: 'c1', label: 'Código no GitHub com README' },
    { id: 'c2', label: 'Documentação de arquitetura' },
    { id: 'c3', label: 'Deploy em produção' },
    { id: 'c4', label: 'Vídeo de demonstração' },
  ],
  goalLabel: 'Meta: Projeto Full Stack Sênior!',
  exercises: [
    {
      type: 'mcq',
      id: 'm18-e1',
      prompt: 'Qual abordagem é mais valiosa para um projeto final de portfólio?',
      options: [
        'Usar todas as tecnologias possíveis, mesmo sem necessidade real',
        'Focar em 3-5 funcionalidades centrais bem executadas e documentadas',
        'Maximizar o número de linhas de código',
        'Copiar a arquitetura de uma big tech sem adaptar ao escopo real',
      ],
      correctIndex: 1,
      explanation:
        'Um projeto focado, bem executado e bem documentado demonstra julgamento técnico — uma habilidade sênior mais valiosa do que apenas empilhar tecnologias.',
    },
    {
      type: 'truefalse',
      id: 'm18-e2',
      prompt: 'Um vídeo de demonstração curto do projeto tende a ser mais efetivo do que só uma descrição em texto no README.',
      answer: true,
      explanation:
        'Recrutadores e gestores raramente têm tempo de clonar e rodar um projeto — um vídeo de poucos minutos mostrando o sistema em ação comunica valor muito mais rápido.',
    },
    {
      type: 'mcq',
      id: 'm18-e3',
      prompt: 'Por que escolher PostgreSQL para dados de usuários/pedidos e MongoDB para logs/configurações é uma decisão defensável?',
      options: [
        'Porque é sempre obrigatório usar dois bancos diferentes',
        'Porque cada modelo de dados se encaixa melhor em um tipo de banco: relacional para dados estruturados com integridade forte, documento para dados flexíveis e variáveis',
        'Porque MongoDB é sempre mais rápido que PostgreSQL',
        'Não é defensável, deveria usar só um banco sempre',
      ],
      correctIndex: 1,
      explanation:
        'A escolha de tecnologia deveria seguir as características reais dos dados e do caso de uso, não modismo — esse raciocínio é exatamente o que se espera de um dev sênior.',
    },
  ],
  games: [
    {
      gameId: 'architecture-review-board',
      label: 'Banca de Revisão de Arquitetura',
      description: 'Apresente decisões do seu projeto final a uma "banca" simulada e receba perguntas típicas de entrevista de arquitetura.',
    },
  ],
  projectBrief: {
    title: 'Plataforma Completa Full Stack',
    description:
      'Um sistema real, ponta a ponta, que integra frontend moderno, backend robusto, dados híbridos e infraestrutura em nuvem — o artefato central do seu portfólio sênior.',
    requirements: [
      'Frontend em React + TypeScript com Next.js (SSR/SSG onde fizer sentido)',
      'Backend em Java Spring Boot expondo REST e/ou GraphQL',
      'Docker + Kubernetes para empacotamento e orquestração',
      'Deploy real na AWS com infraestrutura via Terraform',
      'PostgreSQL para dados relacionais e MongoDB para dados flexíveis',
      'Kafka para eventos entre serviços, se houver múltiplos microsserviços',
      'README completo com decisões de arquitetura e instruções de execução',
      'Vídeo de demonstração de 3-5 minutos',
    ],
  },
};
