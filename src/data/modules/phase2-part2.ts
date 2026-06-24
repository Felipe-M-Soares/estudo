import type { Module } from '../types';

export const mes10: Module = {
  id: 'mes-10',
  month: 10,
  phase: 2,
  track: 'frontend',
  title: 'Next.js',
  emoji: '⚡',
  tagline: 'React com superpoderes de servidor.',
  intro:
    'React puro renderiza tudo no navegador do usuário (CSR). Next.js adiciona a capacidade de renderizar no servidor — o que melhora performance, SEO e a experiência percebida. Esse mês você aprende quando e por que escolher cada estratégia de renderização.',
  lessons: [
    {
      id: 'l1',
      heading: 'SSR, SSG e ISR: três formas de gerar a mesma página',
      body:
        '**SSR (Server-Side Rendering)**: a página é gerada no servidor a cada requisição — ótimo para conteúdo que muda com frequência ou é personalizado por usuário.\n\n**SSG (Static Site Generation)**: a página é gerada uma vez, no momento do build, e servida como HTML estático puro — extremamente rápido, ideal para conteúdo que não muda a cada acesso (blog, landing page).\n\n**ISR (Incremental Static Regeneration)**: o melhor dos dois mundos — a página é estática, mas Next.js a regenera em segundo plano após um tempo definido, sem precisar de um novo build completo do site.',
    },
    {
      id: 'l2',
      heading: 'API Routes: backend e frontend no mesmo projeto',
      body:
        'Next.js permite criar endpoints de API dentro do mesmo projeto do frontend — um arquivo dentro de `app/api/` (App Router) se torna automaticamente um endpoint HTTP. Isso é útil para backends pequenos ou para criar uma camada intermediária (BFF — Backend for Frontend) entre seu frontend e APIs externas, escondendo chaves sensíveis do navegador.',
      codeExample: {
        lang: 'typescript',
        code: '// app/api/usuarios/route.ts\nexport async function GET() {\n  const usuarios = await db.usuario.findMany();\n  return Response.json(usuarios);\n}',
      },
    },
    {
      id: 'l3',
      heading: 'Autenticação com NextAuth.js',
      body:
        'NextAuth.js (Auth.js) abstrai a complexidade de autenticação: login social (Google, GitHub), sessões, e proteção de rotas, tudo configurável declarativamente. Em vez de implementar OAuth do zero — um processo cheio de detalhes de segurança fáceis de errar — você configura provedores e o NextAuth cuida do fluxo.',
    },
  ],
  resources: [
    { label: 'Next.js Docs', url: 'https://nextjs.org/docs' },
    { label: 'Next.js Learn', url: 'https://nextjs.org/learn' },
    { label: 'Rocketseat Next', url: 'https://www.rocketseat.com.br' },
  ],
  checklist: [
    { id: 'c1', label: 'Blog com Next.js + Markdown' },
    { id: 'c2', label: 'Páginas com SSR e SSG' },
    { id: 'c3', label: 'Autenticação com NextAuth' },
  ],
  goalLabel: 'Meta: 2 páginas com SSR/SSG',
  exercises: [
    {
      type: 'mcq',
      id: 'm10-e1',
      prompt: 'Qual estratégia de renderização é mais adequada para um post de blog que raramente muda?',
      options: ['SSR a cada requisição', 'SSG (gerado uma vez no build)', 'CSR puro sem nenhum HTML inicial', 'Nenhuma renderização'],
      correctIndex: 1,
      explanation:
        'Conteúdo estável se beneficia de SSG: o HTML é gerado uma vez e servido instantaneamente, sem custo de processamento por requisição.',
    },
    {
      type: 'truefalse',
      id: 'm10-e2',
      prompt: 'ISR exige que você refaça o build completo do site toda vez que o conteúdo muda.',
      answer: false,
      explanation:
        'ISR regenera páginas individuais em segundo plano, em intervalos configurados, sem precisar de um novo build completo de todo o site.',
    },
    {
      type: 'mcq',
      id: 'm10-e3',
      prompt: 'Por que usar uma API Route do Next.js para chamar uma API externa que exige uma chave secreta?',
      options: [
        'Para deixar o código mais bonito',
        'Para esconder a chave do navegador, já que API Routes rodam no servidor',
        'Não há motivo, dá no mesmo chamar direto do componente',
        'Porque o navegador bloqueia chamadas externas',
      ],
      correctIndex: 1,
      explanation:
        'Código que roda no navegador é sempre visível ao usuário. API Routes rodam no servidor, então chaves secretas usadas ali nunca chegam ao cliente.',
    },
  ],
  games: [
    {
      gameId: 'rendering-strategy-picker',
      label: 'Escolha a Estratégia',
      description: 'Receba cenários de páginas reais e escolha SSR, SSG ou ISR — veja o impacto em velocidade e atualização.',
    },
  ],
};

export const mes11: Module = {
  id: 'mes-11',
  month: 11,
  phase: 2,
  track: 'backend',
  title: 'APIs Avançadas',
  emoji: '🔌',
  tagline: 'Além do REST: GraphQL, tempo real e documentação que não mente.',
  intro:
    'REST resolve a maioria dos casos, mas tem limites: às vezes você busca dados demais (over-fetching), às vezes de menos. GraphQL ataca esse problema. WebSockets resolvem outro: comunicação em tempo real, onde o servidor precisa **avisar** o cliente, não só responder quando perguntado.',
  lessons: [
    {
      id: 'l1',
      heading: 'GraphQL: o cliente pede exatamente o que precisa',
      body:
        'Em REST, um endpoint `/usuarios/1` retorna um formato fixo — se você só precisa do nome, recebe tudo de qualquer forma. Em GraphQL, o cliente envia uma query descrevendo exatamente os campos que quer, e o servidor retorna só isso.\n\nApollo Server (backend) e Apollo Client (frontend) são as ferramentas mais usadas para implementar GraphQL no ecossistema JavaScript.',
      codeExample: {
        lang: 'graphql',
        code: 'query {\n  usuario(id: "1") {\n    nome\n    mensagens {\n      texto\n    }\n  }\n}',
      },
    },
    {
      id: 'l2',
      heading: 'WebSockets: quando o servidor precisa falar primeiro',
      body:
        'HTTP tradicional é "pergunta e resposta": o cliente sempre inicia. Um chat em tempo real precisa do inverso também — o servidor avisando "chegou mensagem nova" sem o cliente perguntar a cada segundo (polling).\n\nWebSocket abre uma conexão persistente e bidirecional. Socket.io é a biblioteca mais popular em Node.js para isso, abstraindo detalhes de reconexão e fallback.',
      codeExample: {
        lang: 'javascript',
        code: 'io.on("connection", (socket) => {\n  socket.on("mensagem", (texto) => {\n    io.emit("mensagem", texto); // envia para todos conectados\n  });\n});',
      },
    },
    {
      id: 'l3',
      heading: 'Documentação com Swagger/OpenAPI',
      body:
        'OpenAPI é um formato padronizado para descrever uma API REST — quais endpoints existem, quais parâmetros aceitam, quais respostas retornam. Swagger UI transforma essa descrição em uma página interativa onde qualquer dev pode testar a API direto do navegador, sem precisar ler código.\n\nDocumentar a API não é burocracia — é o que permite que outro time (ou você mesmo, meses depois) integre com seu sistema sem precisar te perguntar nada.',
    },
  ],
  resources: [
    { label: 'GraphQL', url: 'https://graphql.org' },
    { label: 'Socket.io', url: 'https://socket.io' },
    { label: 'Swagger', url: 'https://swagger.io' },
  ],
  checklist: [
    { id: 'c1', label: 'API GraphQL para sistema de chat' },
    { id: 'c2', label: 'WebSocket para mensagens em tempo real' },
    { id: 'c3', label: 'Documentação OpenAPI/Swagger' },
  ],
  goalLabel: 'Meta: API GraphQL + WebSocket',
  exercises: [
    {
      type: 'mcq',
      id: 'm11-e1',
      prompt: 'Qual o principal problema do REST que o GraphQL resolve?',
      options: [
        'REST é mais lento sempre',
        'Over-fetching: receber mais (ou menos) dados do que o cliente realmente precisa',
        'REST não funciona com JSON',
        'REST não pode usar HTTPS',
      ],
      correctIndex: 1,
      explanation:
        'GraphQL permite que o cliente especifique exatamente os campos desejados, eliminando o problema de receber dados em excesso ou de menos.',
    },
    {
      type: 'truefalse',
      id: 'm11-e2',
      prompt: 'Polling (perguntar repetidamente em intervalos) é tão eficiente quanto WebSocket para atualizações em tempo real.',
      answer: false,
      explanation:
        'Polling gera requisições desnecessárias mesmo quando não há nada novo. WebSocket mantém uma conexão aberta e o servidor só envia dados quando realmente há algo novo.',
    },
    {
      type: 'code-fill',
      id: 'm11-e3',
      prompt: 'Complete o evento Socket.io que envia uma mensagem para todos os clientes conectados.',
      codeTemplate: 'io.___("mensagem", texto);',
      answer: 'emit',
      hint: 'O método que dispara um evento para os clientes ouvindo.',
      explanation: '`io.emit()` envia o evento para todos os clientes conectados ao servidor Socket.io.',
    },
    {
      type: 'mcq',
      id: 'm11-e4',
      prompt: 'Qual a função prática de uma especificação OpenAPI/Swagger?',
      options: [
        'Tornar a API mais rápida automaticamente',
        'Descrever os endpoints de forma padronizada e gerar documentação interativa testável',
        'Substituir a necessidade de testes',
        'Criptografar automaticamente as respostas',
      ],
      correctIndex: 1,
      explanation:
        'OpenAPI padroniza a descrição da API, permitindo gerar documentação interativa (Swagger UI) e até gerar código cliente automaticamente.',
    },
  ],
  games: [
    {
      gameId: 'graphql-query-shaper',
      label: 'Moldando Queries GraphQL',
      description: 'Escreva queries GraphQL que retornem exatamente os campos pedidos pelo desafio — nem mais, nem menos.',
    },
  ],
};

export const mes12: Module = {
  id: 'mes-12',
  month: 12,
  phase: 2,
  track: 'devops',
  title: 'AWS Cloud',
  emoji: '☁️',
  tagline: 'Tirando sua aplicação do seu computador e pondo no mundo.',
  intro:
    'AWS é a maior nuvem do planeta, e dominar seus serviços fundamentais (computação, armazenamento, banco de dados gerenciado) é o que permite seu projeto sair do "roda na minha máquina" para "está em produção, atendendo usuários reais".',
  lessons: [
    {
      id: 'l1',
      heading: 'EC2, S3 e RDS: os três pilares mais usados',
      body:
        '**EC2** (Elastic Compute Cloud) são servidores virtuais — você aluga uma máquina na nuvem para rodar sua aplicação. **S3** (Simple Storage Service) é armazenamento de arquivos (imagens, backups, qualquer blob) altamente durável e barato. **RDS** (Relational Database Service) é banco de dados relacional gerenciado — a AWS cuida de backups, atualizações e replicação para você, em vez de você administrar o PostgreSQL manualmente num servidor.',
    },
    {
      id: 'l2',
      heading: 'IAM e Lambda: permissões e computação sem servidor',
      body:
        '**IAM** (Identity and Access Management) controla quem (pessoa ou serviço) pode fazer o quê na sua conta AWS. A regra de ouro é o **princípio do menor privilégio**: dar a cada usuário/serviço só as permissões mínimas necessárias, nunca acesso total "por garantia".\n\n**Lambda** executa código sob demanda, sem você gerenciar servidor algum — você só paga pelo tempo de execução real. Ideal para tarefas pontuais: processar uma imagem ao ser enviada, rodar uma rotina agendada.',
    },
    {
      id: 'l3',
      heading: 'Terraform: infraestrutura descrita como código',
      body:
        'Em vez de clicar manualmente no painel da AWS para criar cada recurso (o que não é repetível nem versionável), Terraform permite descrever toda sua infraestrutura em arquivos de configuração. Isso significa: você pode recriar todo o ambiente do zero, revisar mudanças de infraestrutura em um Pull Request, e nunca mais perder tempo lembrando "como eu configurei aquilo mesmo?".',
      codeExample: {
        lang: 'hcl',
        code: 'resource "aws_instance" "servidor" {\n  ami           = "ami-12345"\n  instance_type = "t2.micro"\n}',
      },
    },
    {
      id: 'l4',
      heading: 'CloudWatch: observando o que está rodando',
      body:
        'Colocar algo em produção sem monitoramento é voar no escuro. CloudWatch coleta métricas (uso de CPU, memória, latência), logs, e permite configurar alarmes que te avisam antes que um problema pequeno se torne uma queda total do sistema.',
    },
  ],
  resources: [
    { label: 'AWS Training', url: 'https://aws.amazon.com/training/digital/' },
    { label: 'Terraform Docs', url: 'https://developer.hashicorp.com/terraform' },
    { label: 'Udemy — AWS', url: 'https://www.udemy.com' },
  ],
  checklist: [
    { id: 'c1', label: 'Deploy da aplicação na AWS' },
    { id: 'c2', label: 'Infraestrutura com Terraform' },
    { id: 'c3', label: 'Monitoramento com CloudWatch' },
  ],
  goalLabel: 'Meta: App em produção na AWS',
  exercises: [
    {
      type: 'match',
      id: 'm12-e1',
      prompt: 'Associe cada serviço AWS à sua função principal.',
      pairs: [
        { left: 'EC2', right: 'Servidor virtual para rodar aplicações' },
        { left: 'S3', right: 'Armazenamento de arquivos e blobs' },
        { left: 'RDS', right: 'Banco de dados relacional gerenciado' },
        { left: 'Lambda', right: 'Execução de código sob demanda, sem servidor' },
      ],
      explanation: 'Cada serviço AWS resolve um problema de infraestrutura específico — entender essa divisão evita usar a ferramenta errada.',
    },
    {
      type: 'mcq',
      id: 'm12-e2',
      prompt: 'O que é o "princípio do menor privilégio" no IAM?',
      options: [
        'Dar acesso total a todos por padrão, para simplificar',
        'Conceder a cada usuário ou serviço só as permissões mínimas necessárias para sua função',
        'Nunca conceder nenhuma permissão',
        'Um princípio que só se aplica a contas gratuitas',
      ],
      correctIndex: 1,
      explanation:
        'Limitar permissões ao mínimo necessário reduz drasticamente o impacto de uma credencial comprometida ou de um erro de configuração.',
    },
    {
      type: 'truefalse',
      id: 'm12-e3',
      prompt: 'Terraform permite versionar e revisar mudanças de infraestrutura como se fosse código de aplicação.',
      answer: true,
      explanation:
        'Como a infraestrutura é descrita em arquivos de texto, ela pode ser versionada no Git, revisada em Pull Requests, e recriada de forma reprodutível.',
    },
    {
      type: 'mcq',
      id: 'm12-e4',
      prompt: 'Por que monitorar com CloudWatch é importante mesmo quando tudo "parece estar funcionando"?',
      options: [
        'Não é importante, é só burocracia',
        'Permite detectar degradação gradual (ex: memória subindo) antes que se torne uma queda total',
        'CloudWatch torna a aplicação mais rápida',
        'É exigido por lei em todos os países',
      ],
      correctIndex: 1,
      explanation:
        'Monitoramento proativo identifica tendências preocupantes (uso crescente de recursos, aumento de erros) antes que se tornem incidentes graves.',
    },
  ],
  games: [
    {
      gameId: 'aws-service-matcher',
      label: 'Mapeando Serviços AWS',
      description: 'Receba um cenário de produto e escolha a combinação certa de serviços AWS para resolvê-lo com custo eficiente.',
    },
  ],
};
