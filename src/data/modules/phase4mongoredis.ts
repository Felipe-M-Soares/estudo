import type { Module } from '../types';

export const mes22: Module = {
  id: 'mes-22',
  month: 22,
  phase: 4,
  track: 'backend',
  title: 'MongoDB e Redis',
  emoji: '🍃',
  tagline: 'Banco de documentos e cache, os dois NoSQL mais usados do mercado.',
  intro:
    'Até aqui você só viu banco relacional (SQL). Mas boa parte das vagas hoje espera que você conheça pelo menos um banco NoSQL também — MongoDB (documentos) e Redis (chave-valor em memória) são, de longe, os dois mais comuns no mercado, cada um resolvendo um problema bem diferente do SQL tradicional.',
  lessons: [
    {
      id: 'l1',
      heading: 'MongoDB: guardando dados como documentos, não como tabelas',
      body:
        'Em vez de linhas e colunas fixas como no SQL, MongoDB guarda dados como **documentos** — basicamente {{json}}. Cada documento pode ter uma estrutura ligeiramente diferente dos outros na mesma coleção (o equivalente a uma "tabela"), o que dá flexibilidade quando seus dados não são uniformes ou mudam de formato com frequência.\n\nIsso é uma troca, não uma vitória absoluta: você ganha flexibilidade, mas perde algumas garantias fortes que SQL te dá de fábrica (como JOINs nativos eficientes entre coleções diferentes).',
      codeExample: {
        lang: 'javascript',
        code: '// Um documento de produto no MongoDB\n{\n  _id: ObjectId("..."),\n  nome: "Tênis Esportivo",\n  preco: 199.90,\n  tags: ["esporte", "corrida"],\n  variacoes: [\n    { tamanho: 40, estoque: 5 },\n    { tamanho: 42, estoque: 0 }\n  ]\n}',
      },
    },
    {
      id: 'l2',
      heading: 'Quando usar MongoDB em vez de SQL',
      body:
        'MongoDB brilha quando: seus dados têm estrutura variável entre registros (cada produto de um catálogo pode ter campos bem diferentes), você precisa de escala horizontal fácil desde o início (sharding é mais nativo no Mongo), ou o dado já "nasce" parecido com JSON (logs de eventos, configurações).\n\nSQL ainda é a escolha melhor quando: seus dados são altamente relacionais (muitos JOINs entre entidades), você precisa de transações complexas e fortes (ACID completo), ou a consistência dos dados é mais crítica que a flexibilidade de estrutura — o exemplo clássico onde SQL ganha de longe é sistema financeiro.',
    },
    {
      id: 'l3',
      heading: 'CRUD no MongoDB: a sintaxe básica',
      body:
        'As operações são parecidas em espírito com SQL, mas com sintaxe de método e objetos JS em vez de comandos textuais. find busca documentos com um filtro (parecido com WHERE), insertOne/insertMany cria documentos novos, updateOne atualiza, deleteOne remove.',
      codeExample: {
        lang: 'javascript',
        code: '// Buscar produtos com preço menor que 100\ndb.produtos.find({ preco: { $lt: 100 } })\n\n// Inserir um novo produto\ndb.produtos.insertOne({ nome: "Boné", preco: 49.90 })\n\n// Atualizar o preço de um produto\ndb.produtos.updateOne({ nome: "Boné" }, { $set: { preco: 39.90 } })',
      },
    },
    {
      id: 'l4',
      heading: 'Índices no MongoDB: o mesmo princípio do SQL',
      body:
        'Assim como em bancos relacionais, buscar num campo sem índice no MongoDB significa varrer **todo** o documento da coleção, um por um — lento em coleções grandes. Criar um índice nos campos que você mais filtra/ordena resolve isso, exatamente como índices funcionam em SQL.\n\nO trade-off é o mesmo de sempre: índices aceleram leitura, mas custam espaço e tornam escritas um pouco mais lentas (porque o índice precisa ser atualizado a cada inserção).',
      codeExample: {
        lang: 'javascript',
        code: 'db.produtos.createIndex({ nome: 1 }) // 1 = ordem ascendente\ndb.produtos.createIndex({ preco: -1 }) // -1 = descendente',
      },
    },
    {
      id: 'l5',
      heading: 'Redis: banco de dados que vive na memória',
      body:
        'Redis guarda dados na **memória RAM** em vez de disco, o que o torna absurdamente rápido (operações em microssegundos) — mas com a contrapartida de que, sem configuração extra de persistência, os dados podem se perder se o servidor reiniciar. Por isso Redis raramente é o banco "principal" de uma aplicação — ele é usado como {{cache}}, sessão, ou fila, na frente de um banco principal mais durável.\n\nA estrutura básica é chave-valor, mas Redis suporta tipos mais ricos que um simples par chave-valor: listas, sets, hashes, e até filas de mensagens simples.',
      codeExample: {
        lang: 'bash',
        code: 'SET usuario:123:nome "Ana"\nGET usuario:123:nome  # "Ana"\n\nSETEX sessao:abc123 3600 "dados-da-sessao"  # expira em 3600 segundos\n\nLPUSH fila:emails "enviar-boas-vindas"  # adiciona numa lista (fila)',
      },
    },
    {
      id: 'l6',
      heading: 'Cache com Redis: o caso de uso mais comum',
      body:
        'O padrão mais usado de Redis em produção: antes de consultar o banco principal (Postgres, MongoDB), você checa se o resultado já está no Redis. Se estiver (**cache hit**), retorna na hora, sem nem tocar no banco principal. Se não estiver (**cache miss**), consulta o banco, guarda o resultado no Redis com um tempo de expiração, e retorna.\n\nIsso reduz drasticamente a carga no banco principal pra dados consultados com frequência e que não mudam toda hora — perfil de usuário, configurações, resultado de uma busca cara de calcular.',
      codeExample: {
        lang: 'javascript',
        code: 'async function buscarProduto(id) {\n  const cacheKey = `produto:${id}`;\n  const emCache = await redis.get(cacheKey);\n  if (emCache) return JSON.parse(emCache); // cache hit\n\n  const produto = await db.produto.findUnique({ where: { id } }); // cache miss\n  await redis.setex(cacheKey, 300, JSON.stringify(produto)); // guarda por 5 min\n  return produto;\n}',
      },
      diagramId: 'cache-hit-miss',
    },
    {
      id: 'l7',
      heading: 'Redis para sessões e rate limiting',
      body:
        'Além de cache, Redis é extremamente comum pra guardar **sessões de usuário** em aplicações com múltiplos servidores — se você tem 3 instâncias do backend rodando, guardar sessão na memória de uma instância específica não funciona (a próxima requisição pode cair em outra instância). Redis, sendo compartilhado entre todas as instâncias, resolve isso.\n\nO mesmo vale para rate limiting (que você já estudou no contexto de Express): contar quantas requisições um IP fez exige um contador compartilhado entre todas as instâncias do servidor — Redis é a estrutura padrão pra isso, com comandos atômicos como INCR que evitam condições de corrida mesmo com múltiplos servidores incrementando ao mesmo tempo.',
      codeExample: {
        lang: 'javascript',
        code: 'const chave = `ratelimit:${ip}`;\nconst tentativas = await redis.incr(chave); // incrementa atomicamente\nif (tentativas === 1) await redis.expire(chave, 60); // expira em 60s na primeira vez\nif (tentativas > 10) throw new Error("Limite excedido");',
      },
    },
  ],
  resources: [
    { label: 'MongoDB Docs', url: 'https://www.mongodb.com/docs/' },
    { label: 'Redis Docs', url: 'https://redis.io/docs/' },
    { label: 'MongoDB University (gratuito)', url: 'https://learn.mongodb.com' },
  ],
  checklist: [
    { id: 'c1', label: 'Fiz um CRUD completo no MongoDB' },
    { id: 'c2', label: 'Criei um índice e medi a diferença de performance' },
    { id: 'c3', label: 'Implementei cache com Redis numa API real' },
    { id: 'c4', label: 'Usei Redis para rate limiting ou sessão' },
  ],
  goalLabel: 'Saber quando escolher SQL vs MongoDB, e usar Redis pra acelerar uma aplicação de verdade.',
  exercises: [
    {
      type: 'mcq',
      id: 'm22-e1',
      prompt: 'Qual a diferença fundamental entre como SQL e MongoDB guardam dados?',
      options: [
        'Não há diferença real',
        'SQL usa tabelas com colunas fixas; MongoDB usa documentos flexíveis, que podem variar de estrutura entre si',
        'MongoDB só funciona com números',
        'SQL é sempre mais rápido em qualquer cenário',
      ],
      correctIndex: 1,
      explanation: 'MongoDB permite que documentos da mesma coleção tenham estruturas diferentes entre si, algo que uma tabela SQL tradicional não permite sem alterar o schema.',
    },
    {
      type: 'mcq',
      id: 'm22-e2',
      prompt: 'Em qual cenário SQL ainda é geralmente a escolha melhor que MongoDB?',
      options: [
        'Quando os dados têm estrutura muito variável entre registros',
        'Quando o sistema exige transações fortes e muitos relacionamentos entre entidades, como um sistema financeiro',
        'Quando você precisa de flexibilidade de schema acima de tudo',
        'MongoDB é sempre melhor em qualquer cenário',
      ],
      correctIndex: 1,
      explanation: 'Sistemas com forte necessidade de consistência transacional e relacionamentos complexos (como sistemas financeiros) se beneficiam das garantias e dos JOINs nativos do SQL.',
    },
    {
      type: 'code-fill',
      id: 'm22-e3',
      prompt: 'Complete o operador do MongoDB que filtra produtos com preço menor que um valor.',
      codeTemplate: 'db.produtos.find({ preco: { ___: 100 } })',
      answer: '$lt',
      hint: 'O operador de "menor que" no MongoDB, sempre prefixado com $.',
      explanation: '$lt significa "less than" — MongoDB usa operadores prefixados com $ para comparações dentro de filtros.',
    },
    {
      type: 'truefalse',
      id: 'm22-e4',
      prompt: 'Assim como em SQL, criar um índice no MongoDB acelera leituras mas tem custo em escritas e espaço.',
      answer: true,
      explanation: 'O princípio de índices é o mesmo em qualquer banco: aceleram busca, mas precisam ser atualizados a cada escrita e ocupam espaço adicional.',
    },
    {
      type: 'mcq',
      id: 'm22-e5',
      prompt: 'Por que Redis é tão mais rápido que um banco de dados tradicional em disco?',
      options: [
        'Porque usa uma linguagem de programação mais rápida',
        'Porque guarda os dados na memória RAM, que é ordens de magnitude mais rápida de acessar que disco',
        'Porque comprime os dados automaticamente',
        'Não há diferença real de velocidade',
      ],
      correctIndex: 1,
      explanation: 'Acessar RAM é muito mais rápido que acessar disco (mesmo SSD) — essa é a razão central da velocidade do Redis, com a contrapartida de durabilidade menor por padrão.',
    },
    {
      type: 'mcq',
      id: 'm22-e6',
      prompt: 'O que significa um "cache hit" no padrão de cache com Redis?',
      options: [
        'Um erro ao buscar dados no Redis',
        'O dado pedido já estava no Redis, então não foi necessário consultar o banco principal',
        'O dado não foi encontrado em lugar nenhum',
        'Redis travou momentaneamente',
      ],
      correctIndex: 1,
      explanation: 'Cache hit é exatamente o cenário ideal: o dado já estava disponível no Redis, evitando o custo de consultar o banco principal.',
    },
    {
      type: 'mcq',
      id: 'm22-e7',
      prompt: 'Por que Redis é uma boa escolha para guardar sessões quando há múltiplas instâncias do backend rodando?',
      options: [
        'Redis é a única forma de guardar sessões',
        'Porque é compartilhado entre todas as instâncias, então qualquer uma consegue acessar a mesma sessão, diferente de guardar na memória de uma instância específica',
        'Redis criptografa dados automaticamente',
        'Sessões não funcionam sem Redis',
      ],
      correctIndex: 1,
      explanation: 'Se a sessão fosse guardada na memória de uma instância específica, requisições que caíssem em outra instância não teriam acesso a ela — Redis resolve isso sendo compartilhado.',
    },
  ],
  games: [
    {
      gameId: 'nosql-command',
      label: 'Comando Certo',
      description: 'Escolha o comando correto de MongoDB ou Redis para cada cenário real.',
    },
  ],
};
