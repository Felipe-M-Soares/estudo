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
        'Em um sistema distribuído, durante uma falha de rede (Partição), você é forçado a escolher entre **Consistência** (todos veem o mesmo dado, mesmo que isso signifique recusar responder) e **Disponibilidade** (sempre responder, mesmo que o dado possa estar desatualizado). Não existe sistema distribuído que garanta as três propriedades (Consistência, Disponibilidade, Tolerância a Partição) simultaneamente o tempo todo — esse é o CAP Theorem. Explore as três combinações possíveis abaixo.',
      diagramId: 'cap-theorem',
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
    {
      id: 'l5',
      heading: 'Cache: a forma mais barata de parecer rápido',
      body:
        'Cache guarda uma cópia de um dado já calculado/buscado, para responder requisições futuras sem repetir o trabalho caro. Pode existir em várias camadas: no navegador, numa CDN, num cache em memória (Redis) entre a aplicação e o banco, ou até dentro do próprio banco.\n\nO problema central de qualquer cache é **invalidação**: como saber quando o dado em cache ficou desatualizado e precisa ser atualizado ou descartado? Estratégias comuns incluem TTL (expira automaticamente após um tempo), invalidação explícita (o código avisa o cache quando o dado original muda) e write-through (toda escrita já atualiza o cache imediatamente).',
    },
    {
      id: 'l6',
      heading: 'Load Balancing: distribuindo trabalho entre várias máquinas',
      body:
        'Um Load Balancer recebe todo o tráfego de entrada e decide para qual servidor (de um conjunto de réplicas idênticas) cada requisição vai. Algoritmos comuns: **round-robin** (distribui em sequência, um para cada), **least connections** (manda para quem está com menos carga agora), e **hash baseado em IP** (o mesmo cliente sempre cai no mesmo servidor, útil quando há estado de sessão).\n\nUm bom load balancer também faz health checks: remove automaticamente da rotação qualquer servidor que parou de responder, e o devolve quando ele volta a responder normalmente.',
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
    {
      type: 'mcq',
      id: 'm16-e4',
      prompt: 'Qual é o problema central que toda estratégia de cache precisa resolver?',
      options: [
        'Onde guardar o dado fisicamente',
        'Invalidação: saber quando o dado em cache está desatualizado',
        'Cache não tem nenhum problema real',
        'Quanto cobrar pelo uso do cache',
      ],
      correctIndex: 1,
      explanation:
        'Um cache desatualizado é pior que não ter cache — ele entrega informação errada com confiança. Por isso invalidação correta é o desafio central de qualquer estratégia de cache.',
    },
    {
      type: 'match',
      id: 'm16-e5',
      prompt: 'Associe cada algoritmo de load balancing à sua estratégia.',
      pairs: [
        { left: 'Round-robin', right: 'Distribui requisições em sequência, uma para cada servidor' },
        { left: 'Least connections', right: 'Envia para o servidor com menos conexões ativas no momento' },
        { left: 'Hash por IP', right: 'O mesmo cliente sempre cai no mesmo servidor' },
      ],
      explanation:
        'Cada algoritmo otimiza para um cenário diferente — round-robin para simplicidade, least connections para carga desigual, hash por IP para sessões com estado.',
    },
  ],
  games: [
    {
      gameId: 'system-design-whiteboard',
      label: 'Quadro Branco de System Design',
      description: 'Desenhe a arquitetura de um sistema dado um cenário (ex: encurtador de URLs, feed de rede social) com componentes arrastáveis.',
    },
    {
      gameId: 'memory-concepts',
      label: 'Memória de Conceitos',
      description: 'Revise termos de infraestrutura e cloud antes de ir para o projeto final.',
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
    {
      id: 'l4',
      heading: 'Comunicação assíncrona: escrever para quem não está olhando agora',
      body:
        'Times distribuídos (e até times no mesmo escritório, hoje) dependem cada vez mais de comunicação assíncrona: mensagens, PRs, documentos — em vez de reuniões em tempo real. Escrever bem nesse formato significa dar contexto suficiente para que a pessoa não precise te perguntar de volta "mas o que você quer dizer?": qual o problema, o que você já tentou, o que precisa da outra pessoa, e até quando.\n\nUma mensagem assíncrona malfeita ("dá uma olhada nisso aí") gera dias de ida e volta perguntando contexto. Uma boa mensagem assíncrona já antecipa as perguntas óbvias e permite que a pessoa responda de forma útil na primeira tentativa.',
    },
    {
      id: 'l5',
      heading: 'Negociação técnica: discordar sem travar o time',
      body:
        'Discordar de uma decisão técnica é saudável; insistir indefinidamente depois que a decisão foi tomada, não é. O princípio "disagree and commit" (usado em vários times de tecnologia) é: exponha sua discordância com argumentos claros, mas se o time decidir seguir outro caminho, comprometa-se com ele de verdade — não saboteando passivamente nem revisitando o debate a cada oportunidade.\n\nIsso não significa concordar sempre — significa escolher bem as batalhas, trazer dados (não só opinião) quando discordar, e aceitar que nem toda decisão vai ser exatamente como você faria.',
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
    {
      type: 'mcq',
      id: 'm17-e4',
      prompt: 'O que torna uma mensagem assíncrona ("Dá uma olhada nisso") menos eficaz que uma mais elaborada?',
      options: [
        'Mensagens curtas são sempre piores',
        'Ela não dá contexto suficiente, gerando idas e voltas para esclarecer o que realmente é necessário',
        'Não há diferença real',
        'Mensagens assíncronas nunca funcionam',
      ],
      correctIndex: 1,
      explanation:
        'Sem contexto (qual o problema, o que já foi tentado, o que se espera da outra pessoa), quem recebe a mensagem precisa perguntar de volta, perdendo o principal benefício da comunicação assíncrona: resolver sem ida e volta.',
    },
    {
      type: 'truefalse',
      id: 'm17-e5',
      prompt: '"Disagree and commit" significa que você deve sempre concordar com a decisão do time, mesmo discordando.',
      answer: false,
      explanation:
        'O princípio é expor a discordância com argumentos claros antes da decisão, mas se comprometer genuinamente com o que for decidido — não significa silenciar a opinião, e sim não sabotar depois que a decisão foi tomada.',
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
    {
      id: 'l4',
      heading: 'Preparando-se para entrevistas técnicas sobre o seu próprio projeto',
      body:
        'Em entrevistas para vagas sêniores, é comum que o entrevistador peça para você apresentar e defender decisões de um projeto seu. As perguntas mais frequentes seguem um padrão: "por que você escolheu X em vez de Y?", "o que você faria diferente hoje?", "como isso escalaria com 100x mais usuários?".\n\nA resposta que impressiona não é "porque é a tecnologia mais usada" — é demonstrar que você considerou alternativas reais e escolheu com base em trade-offs específicos do seu contexto. Prepare, para cada decisão importante do projeto, uma frase curta que explique o porquê — isso é literalmente o conteúdo de um ADR que você already aprendeu a escrever.',
    },
    {
      id: 'l5',
      heading: 'Portfólio além do código: o que mais importa para quem contrata',
      body:
        'Um projeto técnico sólido é necessário, mas raramente suficiente por si só. Complementos que fazem diferença real: um LinkedIn atualizado contando a sua jornada (não só uma lista de tecnologias), contribuições visíveis em projetos open source (mesmo pequenas, como corrigir um erro de documentação), e um histórico de commits consistente no GitHub que mostra constância ao longo do tempo, não só um projeto isolado feito num fim de semana.\n\nO objetivo final desses 18 meses não é só "saber" todas essas tecnologias — é ter evidências verificáveis de que você sabe, que qualquer recrutador ou tech lead possa checar em poucos minutos.',
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
    {
      type: 'mcq',
      id: 'm18-e4',
      prompt: 'Em uma entrevista, o entrevistador pergunta "por que você não usou Kubernetes nesse projeto?". Qual resposta demonstra mais maturidade técnica?',
      options: [
        '"Não tive tempo de aprender"',
        '"Para o tamanho e o tráfego esperado desse projeto, a complexidade operacional do Kubernetes não se justificava — Docker Compose já resolvia bem"',
        '"Kubernetes é difícil demais"',
        '"Não sabia que existia essa opção"',
      ],
      correctIndex: 1,
      explanation:
        'Justificar a escolha com base em trade-offs reais (escala, complexidade operacional, tempo) demonstra julgamento técnico — exatamente o que entrevistas para vagas sêniores avaliam, mais do que conhecer todas as tecnologias possíveis.',
    },
    {
      type: 'truefalse',
      id: 'm18-e5',
      prompt: 'Um histórico de commits consistente ao longo do tempo comunica algo diferente de um projeto único feito em um fim de semana, mesmo que o código final seja parecido.',
      answer: true,
      explanation:
        'Constância visível no histórico de commits sugere capacidade de manter disciplina e progresso ao longo do tempo — um sinal que recrutadores frequentemente valorizam além da qualidade pontual do código.',
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
