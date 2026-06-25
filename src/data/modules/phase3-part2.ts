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
        '**Sharding** divide um banco de dados muito grande em partições (shards) menores, cada uma em uma máquina diferente, distribuindo a carga. **Replicação** mantém cópias do mesmo dado em múltiplas máquinas — para tolerância a falhas (se uma cair, outra responde) e para distribuir carga de leitura. Ajuste o número de shards abaixo e veja como os dados se redistribuem.',
      diagramId: 'sharding',
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
    {
      id: 'l7',
      heading: 'Rate limiting distribuído: limitando across múltiplos servidores',
      body:
        'Rate limiting parece simples até você ter múltiplos servidores atrás de um load balancer: se cada servidor guardar a contagem de requisições só na própria memória, um cliente pode "burlar" o limite distribuindo requisições entre servidores diferentes, cada um vendo só uma fração do total real.\n\nA solução é centralizar essa contagem num lugar compartilhado por todos os servidores — geralmente Redis, por ser extremamente rápido para esse tipo de operação (incrementar um contador, verificar se passou do limite, tudo em milissegundos). Esse é outro exemplo do papel do cache/armazenamento em memória além de "acelerar leituras": coordenar estado entre múltiplas instâncias de uma aplicação.',
    },
    {
      id: 'l8',
      heading: 'CDN e edge computing: processando mais próximo do usuário',
      body:
        'Uma CDN tradicional só serve arquivos estáticos (imagens, CSS, JS) de pontos geograficamente distribuídos. **Edge computing** vai além: executa lógica de aplicação (não só arquivos estáticos) nesses pontos próximos do usuário — validar um token, redirecionar com base no país, até renderizar partes de uma página — sem precisar ir até o servidor de origem, que pode estar a milhares de quilômetros.\n\nIsso reduz drasticamente a latência para operações simples e frequentes, mas tem limites: lógica que precisa de acesso direto a um banco de dados centralizado ainda se beneficia mais de rodar próxima a esse banco do que na borda da rede.',
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
    {
      type: 'mcq',
      id: 'm16-e6',
      prompt: 'Por que rate limiting com contagem só na memória local de cada servidor falha quando há múltiplos servidores?',
      options: [
        'Não falha, funciona perfeitamente',
        'Um cliente pode distribuir requisições entre servidores diferentes, e cada um vê só uma fração do total, permitindo burlar o limite real',
        'Memória local é sempre mais lenta que um banco',
        'Rate limiting não funciona com múltiplos servidores de forma alguma',
      ],
      correctIndex: 1,
      explanation: 'Sem um contador compartilhado (como Redis), cada servidor só sabe das requisições que ele mesmo recebeu, não do total real do cliente.',
    },
    {
      type: 'truefalse',
      id: 'm16-e7',
      prompt: 'Edge computing é o mesmo que uma CDN tradicional, só com um nome diferente.',
      answer: false,
      explanation: 'CDN tradicional serve apenas arquivos estáticos. Edge computing vai além, executando lógica de aplicação nos pontos próximos do usuário, não só servindo arquivos.',
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
  scenarios: [
    {
      id: 'mes16-cen1',
      context: 'trabalho',
      title: 'Promoção da Black Friday derruba o site',
      emoji: '🛍️',
      situation:
        'Numa campanha de grande tráfego, o site de um cliente fica fora do ar nos primeiros 10 minutos — exatamente quando mais pessoas estavam acessando.',
      whatHappens:
        'O sistema foi desenhado para o tráfego do dia a dia, sem prever picos de 50x o normal. Sem cache na frente do banco, sem auto-scaling configurado, e sem load balancer distribuindo bem a carga, o primeiro gargalo (geralmente o banco de dados) trava tudo que depende dele.',
      howToSolve:
        'Para eventos de pico previsíveis, a prática é fazer teste de carga (simular o tráfego esperado) antes do evento, garantir auto-scaling com limites adequados, e colocar cache agressivo na frente de qualquer dado que não precisa ser 100% em tempo real (como contagem de estoque aproximada).',
    },
    {
      id: 'mes16-cen2',
      context: 'pessoal',
      title: 'Pensando em como o WhatsApp aguenta bilhões de mensagens',
      emoji: '🤔',
      situation:
        'Você se pergunta, curioso, como aplicativos como WhatsApp conseguem entregar mensagens instantaneamente para bilhões de pessoas sem travar.',
      whatHappens:
        'É uma pergunta de System Design de verdade — a resposta envolve várias das técnicas deste módulo trabalhando juntas: sharding (dados de usuários diferentes em servidores diferentes), replicação (cópias para tolerância a falha), e filas de mensagens para garantir entrega mesmo se o destinatário estiver offline.',
      howToSolve:
        'Exercite isso você mesmo: pegue um sistema que você usa todo dia (WhatsApp, Instagram, Uber) e tente desenhar, no papel, como ele provavelmente é estruturado por trás — esse tipo de prática mental é exatamente o que entrevistas de System Design avaliam.',
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
        'Times distribuídos (e até times no mesmo escritório, hoje) dependem cada vez mais de comunicação assíncrona: mensagens, PRs, documentos — em vez de reuniões em tempo real. Escrever bem nesse formato significa dar contexto suficiente para que a pessoa não precise te perguntar de volta "mas o que você quer dizer?": qual o problema, o que você já tentou, o que precisa da outra pessoa, e até quando.\n\nUma mensagem assíncrona malfeita ("dá uma olhada nisso aí") gera dias de ida e volta perguntando contexto. Uma boa mensagem assíncrona já antecipa as perguntas óbvias e permite que a pessoa responda de forma útil na primeira tentativa. Compare os dois exemplos abaixo.',
      diagramId: 'async-message-quality',
    },
    {
      id: 'l5',
      heading: 'Negociação técnica: discordar sem travar o time',
      body:
        'Discordar de uma decisão técnica é saudável; insistir indefinidamente depois que a decisão foi tomada, não é. O princípio "disagree and commit" (usado em vários times de tecnologia) é: exponha sua discordância com argumentos claros, mas se o time decidir seguir outro caminho, comprometa-se com ele de verdade — não saboteando passivamente nem revisitando o debate a cada oportunidade.\n\nIsso não significa concordar sempre — significa escolher bem as batalhas, trazer dados (não só opinião) quando discordar, e aceitar que nem toda decisão vai ser exatamente como você faria.',
    },
    {
      id: 'l6',
      heading: 'Apresentações técnicas: comunicando decisões para públicos diferentes',
      body:
        'A mesma decisão técnica precisa de duas versões de explicação. Para outros desenvolvedores, detalhes de implementação importam: trade-offs específicos, bibliotecas escolhidas, complexidade de cada abordagem. Para stakeholders de negócio, o que importa é impacto: tempo, custo, risco, e o que muda para o usuário final — jargão técnico nessa conversa só cria distância, não credibilidade.\n\nUma boa prática para apresentações técnicas (em reuniões, ou até em entrevistas): comece pela conclusão/recomendação, depois explique o raciocínio — não construa um arco narrativo longo até "a resposta" no final, porque a atenção do público (especialmente não-técnico) decai rápido.',
    },
    {
      id: 'l7',
      heading: 'Negociando prazos: comunicando estimativas com honestidade',
      body:
        'Pressão para "encurtar o prazo" é constante em qualquer time. A resposta produtiva não é simplesmente aceitar um prazo apertado demais (gerando trabalho malfeito ou esgotamento) nem recusar rigidamente (parecendo inflexível) — é tornar os trade-offs explícitos: "posso entregar isso até sexta cortando os testes automatizados, ou até terça-feira da semana seguinte com cobertura completa — qual prioridade faz mais sentido para vocês agora?".\n\nIsso transforma uma negociação de prazo numa decisão de produto compartilhada, em vez de uma imposição numa direção ou outra — e documenta, num e-mail ou ticket, qual escolha foi feita e por quê, protegendo todo mundo de mal-entendidos depois.',
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
    {
      type: 'mcq',
      id: 'm17-e6',
      prompt: 'Ao apresentar uma decisão técnica para stakeholders de negócio, o que deveria ser priorizado?',
      options: [
        'Detalhes de implementação e nomes de bibliotecas usadas',
        'Impacto em tempo, custo, risco e experiência do usuário final',
        'Jargão técnico para demonstrar conhecimento',
        'A história completa do processo de decisão, do início ao fim',
      ],
      correctIndex: 1,
      explanation: 'Para públicos não-técnicos, o que importa é o impacto prático da decisão — detalhes de implementação são mais relevantes para uma audiência de outros desenvolvedores.',
    },
    {
      type: 'mcq',
      id: 'm17-e7',
      prompt: 'Ao receber pressão para encurtar um prazo, qual abordagem é mais produtiva?',
      options: [
        'Aceitar sempre, para não criar atrito',
        'Recusar rigidamente, sem explicar o porquê',
        'Tornar os trade-offs explícitos (o que seria cortado ou adiado) e deixar a decisão final ser compartilhada',
        'Ignorar a pressão e fazer no seu próprio ritmo, sem comunicar nada',
      ],
      correctIndex: 2,
      explanation: 'Explicitar os trade-offs transforma a negociação numa decisão de produto compartilhada, em vez de uma imposição — e protege todos de mal-entendidos futuros.',
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
  scenarios: [
    {
      id: 'mes17-cen1',
      context: 'trabalho',
      title: 'Um comentário de review gera atrito no time',
      emoji: '😤',
      situation:
        'Um desenvolvedor júnior fica visivelmente desmotivado depois de receber vários comentários secos como "isso está errado" num Pull Request, sem nenhuma explicação do porquê.',
      whatHappens:
        'Feedback sem contexto nem sugestão de caminho não ensina nada — só comunica "errado", deixando quem recebeu sem saber como melhorar, e gerando desconfiança em pedir ajuda nas próximas vezes.',
      howToSolve:
        'Comentários de review eficazes explicam o porquê ("esse loop pode ficar lento com listas grandes") e sugerem uma direção ("que acha de usar um Map aqui?"), tratando o código como o assunto, nunca a pessoa.',
    },
    {
      id: 'mes17-cen2',
      context: 'pessoal',
      title: 'Lendo documentação técnica em inglês sem travar',
      emoji: '📖',
      situation:
        'Você quer aprender uma biblioteca nova, mas a documentação oficial só existe em inglês, e isso te deixa mais lento que gostaria.',
      whatHappens:
        'A maior parte da documentação técnica de qualidade é escrita primeiro (e às vezes exclusivamente) em inglês — não é sobre fluência de conversação, é sobre reconhecer um vocabulário técnico relativamente pequeno e repetitivo.',
      howToSolve:
        'Em vez de traduzir tudo, foque em memorizar os termos técnicos que aparecem o tempo todo (deploy, rollback, threshold, throughput, race condition) — uma vez que esse vocabulário fica automático, ler documentação técnica em inglês deixa de ser um obstáculo.',
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
        'Frontend em React + TypeScript com Next.js (aproveitando SSR onde fizer sentido para SEO ou performance). Backend em Java Spring Boot, expondo tanto REST quanto GraphQL conforme o caso de uso. PostgreSQL para dados relacionais (usuários, pedidos), MongoDB para dados mais flexíveis (logs, configurações dinâmicas). Kafka para eventos entre serviços, se a arquitetura usar múltiplos microsserviços.\n\nO objetivo não é usar **toda** tecnologia que você aprendeu só para mostrar que sabe — é usar a tecnologia certa onde ela realmente resolve um problema do seu sistema. Explore abaixo a organização em camadas que deveria guiar onde cada peça do código vive.',
      diagramId: 'layered-architecture',
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
    {
      id: 'l6',
      heading: 'Depois do lançamento: o trabalho que ninguém vê no portfólio',
      body:
        'Lançar a primeira versão do projeto final é uma conquista real, mas é também onde o trabalho mais sênior começa: observar como o sistema se comporta com uso de verdade, corrigir bugs que só aparecem fora do ambiente controlado de desenvolvimento, e decidir o que evoluir primeiro com base em sinais reais (não em achismo).\n\nSe possível, depois de lançar, monitore por algumas semanas: o que falha, o que é lento, o que ninguém usa. Documentar isso — mesmo informalmente, num arquivo `LIÇÕES.md` — é exatamente o tipo de reflexão que distingue alguém que só "termina projetos" de alguém que aprende a melhorá-los continuamente, e é ótimo material para contar numa entrevista sobre seu próprio crescimento ao longo do tempo.',
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
    {
      type: 'mcq',
      id: 'm18-e6',
      prompt: 'Por que documentar bugs e melhorias observadas após o lançamento de um projeto é valioso, mesmo informalmente?',
      options: [
        'Não tem valor real, é trabalho desnecessário',
        'Demonstra capacidade de aprender e melhorar continuamente com base em uso real, algo valorizado em entrevistas e no trabalho sênior',
        'É exigido por lei em projetos de portfólio',
        'Só importa se o projeto tiver muitos usuários',
      ],
      correctIndex: 1,
      explanation: 'Refletir sobre o que aconteceu depois do lançamento (não só durante o desenvolvimento) demonstra maturidade e capacidade de evolução contínua — uma habilidade sênior real, independente do tamanho do projeto.',
    },
  ],
  games: [
    {
      gameId: 'architecture-review-board',
      label: 'Banca de Revisão de Arquitetura',
      description: 'Apresente decisões do seu projeto final a uma "banca" simulada e receba perguntas típicas de entrevista de arquitetura.',
    },
  ],
  scenarios: [
    {
      id: 'mes18-cen1',
      context: 'trabalho',
      title: 'O projeto de portfólio que nunca termina',
      emoji: '♾️',
      situation:
        'Um candidato a vaga sênior trabalha no mesmo projeto pessoal há 8 meses, sempre adicionando "só mais uma funcionalidade" antes de considerá-lo pronto para mostrar.',
      whatHappens:
        'Sem um escopo fechado definido desde o início, projetos pessoais tendem a crescer indefinidamente — cada funcionalidade nova parece necessária no momento, mas o projeto nunca chega a um estado "pronto para mostrar", e o tempo que poderia render uma entrevista é gasto em polimento infinito.',
      howToSolve:
        'Defina por escrito, antes de começar a codar, as 3-5 funcionalidades que tornam o projeto "completo" — e pare ali. Funcionalidades extras viram itens de "próximos passos" no README, demonstrando visão sem precisar implementá-las todas antes de mostrar o trabalho.',
    },
    {
      id: 'mes18-cen2',
      context: 'pessoal',
      title: 'Decidindo o que realmente construir como projeto final',
      emoji: '🎯',
      situation:
        'Depois de 18 meses estudando, surge a paralisia de escolha: construir um clone de rede social? Um sistema de e-commerce? Algo totalmente original?',
      whatHappens:
        'Projetos clichê (mais um clone de Twitter, mais um To-Do list) competem com milhares de outros parecidos no portfólio de quem está entrando no mercado — eles provam que você sabe codar, mas não destacam você de ninguém.',
      howToSolve:
        'O projeto mais forte geralmente resolve um problema real que você mesmo tem ou conhece bem — isso naturalmente traz decisões de produto mais interessantes para justificar em entrevista do que um clone genérico, mesmo usando exatamente a mesma stack técnica.',
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
