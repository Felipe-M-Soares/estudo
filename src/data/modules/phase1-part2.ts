import type { Module } from '../types';

export const mes04: Module = {
  id: 'mes-04',
  month: 4,
  phase: 1,
  track: 'backend',
  title: 'Git & SQL',
  emoji: '🗃️',
  tagline: 'Versionar código e modelar dados — as duas habilidades invisíveis que todo dev usa todo dia.',
  intro:
    'Git e SQL não são "tecnologias da moda", são a infraestrutura silenciosa de qualquer carreira em programação. Você vai usar Git em literalmente todo emprego, e SQL aparece sempre que houver dados para guardar — o que é quase sempre.',
  lessons: [
    {
      id: 'l1',
      heading: 'Git: commits como fotografias do seu código',
      body:
        'Cada commit é uma fotografia do estado do seu projeto em um momento. Um bom commit é pequeno, tem uma mensagem clara no imperativo ("adiciona validação de e-mail", não "mudanças") e representa uma unidade lógica de trabalho — não 40 arquivos misturados.\n\n`git add` prepara o que vai entrar no commit; `git commit` registra a fotografia; `git push` envia para o repositório remoto (GitHub). É um fluxo que você vai repetir centenas de vezes por semana.',
      codeExample: {
        lang: 'bash',
        code: 'git add .\ngit commit -m "adiciona validação de formulário de login"\ngit push origin main',
      },
    },
    {
      id: 'l2',
      heading: 'Branches, merge e o porquê de nunca trabalhar direto na main',
      body:
        'Uma branch é uma linha paralela de desenvolvimento. Você cria uma branch para cada funcionalidade ou correção, trabalha isolado da `main` (que deve sempre estar estável), e depois junta (`merge`) suas mudanças de volta.\n\n**Pull Request (PR)** é o pedido formal de "quero juntar minha branch na main" — é onde o time revisa seu código antes de aceitar. Aprender a abrir PRs claros, pequenos e bem descritos é uma habilidade subestimada que separa devs juniores de devs eficazes.',
      codeExample: {
        lang: 'bash',
        code: 'git checkout -b feature/login\n# ... trabalha, commita ...\ngit push origin feature/login\n# abre PR no GitHub: feature/login -> main',
      },
    },
    {
      id: 'l3',
      heading: 'SQL: SELECT, JOIN e o pensamento relacional',
      body:
        'Banco relacional organiza dados em tabelas que se relacionam por chaves. `SELECT` busca dados; `WHERE` filtra; `JOIN` combina linhas de tabelas diferentes baseado numa relação (ex: pedidos e clientes).\n\nO pulo do gato é pensar em **conjuntos**, não em loops: em vez de "para cada cliente, busque seus pedidos", você escreve uma única query que já traz tudo junto. Isso é mais rápido e é como bancos de dados foram desenhados para funcionar.',
      codeExample: {
        lang: 'sql',
        code: 'SELECT clientes.nome, pedidos.valor\nFROM pedidos\nJOIN clientes ON pedidos.cliente_id = clientes.id\nWHERE pedidos.valor > 100\nGROUP BY clientes.nome;',
      },
    },
    {
      id: 'l4',
      heading: 'Modelagem e índices: pensando antes de criar tabelas',
      body:
        'Um diagrama ERD (Entity-Relationship Diagram) mapeia entidades (tabelas) e seus relacionamentos antes de você escrever uma linha de SQL. Pensar nisso primeiro evita retrabalho doloroso depois.\n\nÍndices são estruturas que aceleram busca em colunas específicas — sem índice, o banco varre a tabela inteira linha por linha (scan completo). Com índice numa coluna muito consultada (como `email` numa tabela de usuários), a busca vira praticamente instantânea, mesmo com milhões de linhas.',
    },
  ],
  resources: [
    { label: 'Guia Git — Atlassian', url: 'https://www.atlassian.com/br/git/tutorials' },
    { label: 'PostgreSQL Docs', url: 'https://www.postgresql.org/docs/' },
    { label: 'SQL — W3Schools', url: 'https://www.w3schools.com/sql/' },
    { label: 'Alura PostgreSQL', url: 'https://www.alura.com.br' },
  ],
  checklist: [
    { id: 'c1', label: 'Diagrama ERD para sistema de biblioteca' },
    { id: 'c2', label: '10+ queries SQL com JOINs' },
    { id: 'c3', label: 'Repositório no GitHub com README' },
  ],
  goalLabel: 'Meta: 10 queries otimizadas',
  exercises: [
    {
      type: 'mcq',
      id: 'm4-e1',
      prompt: 'Qual comando SQL retorna todos os registros de uma tabela?',
      options: ['SELECT * FROM tabela', 'GET ALL FROM tabela', 'FIND * IN tabela', 'RETURN * FROM tabela'],
      correctIndex: 0,
      explanation: '`SELECT * FROM tabela` é a sintaxe padrão SQL para buscar todas as colunas de todas as linhas de uma tabela.',
    },
    {
      type: 'mcq',
      id: 'm4-e2',
      prompt: 'Por que você nunca deve commitar direto na branch main em projetos com time?',
      options: [
        'Porque o GitHub bloqueia automaticamente',
        'Porque a main deve ficar estável; mudanças passam por revisão em branches separadas',
        'Porque main só aceita arquivos .md',
        'Não há motivo real, é só convenção sem importância',
      ],
      correctIndex: 1,
      explanation:
        'Trabalhar em branches isola mudanças em progresso e permite revisão via Pull Request antes de afetar o código que está estável e em produção.',
    },
    {
      type: 'code-fill',
      id: 'm4-e3',
      prompt: 'Complete a query que junta pedidos e clientes pela chave de relacionamento.',
      codeTemplate: 'SELECT * FROM pedidos\n___ clientes ON pedidos.cliente_id = clientes.id;',
      answer: 'JOIN',
      hint: 'Palavra-chave SQL que combina linhas de duas tabelas baseado numa condição.',
      explanation: '`JOIN` (ou `INNER JOIN`) combina linhas de duas tabelas onde a condição especificada em `ON` é verdadeira.',
    },
    {
      type: 'truefalse',
      id: 'm4-e4',
      prompt: 'Um índice em uma coluna torna toda busca instantânea, sem nenhum custo.',
      answer: false,
      explanation:
        'Índices aceleram leitura, mas têm custo: ocupam espaço em disco e tornam escritas (INSERT/UPDATE) um pouco mais lentas, pois o índice precisa ser atualizado também.',
    },
    {
      type: 'order',
      id: 'm4-e5',
      prompt: 'Ordene o fluxo correto de trabalho com Git ao criar uma nova funcionalidade.',
      steps: [
        'Criar uma nova branch a partir da main',
        'Fazer commits pequenos e descritivos',
        'Enviar a branch para o repositório remoto (push)',
        'Abrir um Pull Request para revisão',
      ],
      explanation:
        'Esse é o fluxo padrão de feature branch workflow, usado pela maioria dos times de desenvolvimento profissionais.',
    },
  ],
  games: [
    {
      gameId: 'sql-query-builder',
      label: 'Construtor de Queries',
      description: 'Monte queries SQL arrastando cláusulas (SELECT, WHERE, JOIN) para resolver desafios de dados reais.',
    },
    {
      gameId: 'git-branch-simulator',
      label: 'Simulador de Branches',
      description: 'Visualize e pratique git checkout, merge e resolução de conflitos num simulador visual de árvore de commits.',
    },
  ],
};

export const mes05: Module = {
  id: 'mes-05',
  month: 5,
  phase: 1,
  track: 'backend',
  title: 'Node.js & Express',
  emoji: '🟩',
  tagline: 'JavaScript saindo do navegador para virar um servidor de verdade.',
  intro:
    'Node.js permite rodar JavaScript fora do navegador — em um servidor. Express é o framework que torna construir APIs com Node simples e direto. Esse mês você cria seu primeiro backend de verdade: algo que recebe requisições, processa dados e responde.',
  lessons: [
    {
      id: 'l1',
      heading: 'Node.js: módulos e o event loop',
      body:
        'Node organiza código em módulos — cada arquivo `.js` pode exportar funções/valores e outros arquivos importam com `require` ou `import`. Isso evita um único arquivo gigante e permite reuso.\n\nO **event loop** é o motor que permite Node lidar com milhares de conexões simultâneas sem criar uma thread para cada uma: operações lentas (ler arquivo, consultar banco) são delegadas e o loop continua processando outras coisas enquanto espera, retomando via callback/Promise quando o resultado chega.',
    },
    {
      id: 'l2',
      heading: 'Express: rotas e middlewares',
      body:
        'Uma rota mapeia um verbo HTTP + caminho para uma função: `app.get("/usuarios", handler)`. Um **middleware** é uma função que roda antes da rota final — usado para autenticação, logging, validação, tratamento de CORS.\n\nMiddlewares são encadeados: cada um pode passar para o próximo (`next()`) ou interromper a cadeia (ex: retornando 401 se não autenticado). Esse padrão de pipeline é central no Express.',
      codeExample: {
        lang: 'javascript',
        code: 'app.use(express.json());\n\napp.get("/usuarios/:id", (req, res) => {\n  const { id } = req.params;\n  res.json({ id, nome: "Exemplo" });\n});',
      },
    },
    {
      id: 'l3',
      heading: 'Verbos HTTP e status codes: o vocabulário das APIs REST',
      body:
        'Cada verbo HTTP tem uma intenção: `GET` busca, `POST` cria, `PUT`/`PATCH` atualiza, `DELETE` remove. Seguir essa convenção (REST) torna sua API previsível para quem a consome.\n\nStatus codes comunicam o resultado sem precisar ler o corpo da resposta: `200` sucesso, `201` criado, `400` requisição inválida, `401` não autenticado, `404` não encontrado, `500` erro no servidor. Retornar sempre `200` mesmo em erro é um anti-padrão comum que dificulta a vida de quem consome sua API.',
    },
    {
      id: 'l4',
      heading: 'Tratamento de erros: nunca deixe o servidor cair em silêncio',
      body:
        'Um middleware de erro no Express captura exceções não tratadas e responde de forma consistente, em vez de derrubar o processo inteiro. Envolver código assíncrono em `try/catch` e repassar o erro com `next(erro)` é o padrão básico de resiliência.',
      codeExample: {
        lang: 'javascript',
        code: 'app.use((err, req, res, next) => {\n  console.error(err);\n  res.status(500).json({ erro: "Algo deu errado" });\n});',
      },
    },
  ],
  resources: [
    { label: 'Node.js Docs', url: 'https://nodejs.org/en/docs' },
    { label: 'Express.js', url: 'https://expressjs.com' },
    { label: 'Rocketseat Node', url: 'https://www.rocketseat.com.br' },
    { label: 'Alura Node', url: 'https://www.alura.com.br' },
  ],
  checklist: [
    { id: 'c1', label: 'API de CRUD de usuários com Node.js' },
    { id: 'c2', label: 'Integração com PostgreSQL' },
    { id: 'c3', label: 'Documentação da API (Swagger/Postman)' },
  ],
  goalLabel: 'Meta: API com 5+ endpoints',
  exercises: [
    {
      type: 'mcq',
      id: 'm5-e1',
      prompt: 'Em Node.js, qual método do Express é usado para criar uma rota GET?',
      options: ["app.post('/rota', ...)", "app.get('/rota', ...)", "app.route('/rota', ...)", "app.use('/rota', ...)"],
      correctIndex: 1,
      explanation: '`app.get()` registra um handler para requisições HTTP GET naquele caminho.',
    },
    {
      type: 'match',
      id: 'm5-e2',
      prompt: 'Associe cada status code HTTP ao seu significado correto.',
      pairs: [
        { left: '200', right: 'Sucesso' },
        { left: '201', right: 'Criado com sucesso' },
        { left: '404', right: 'Recurso não encontrado' },
        { left: '500', right: 'Erro interno do servidor' },
      ],
      explanation: 'Status codes seguem convenções padronizadas que toda API REST profissional deve respeitar.',
    },
    {
      type: 'code-fill',
      id: 'm5-e3',
      prompt: 'Complete o middleware para que ele passe o controle para o próximo handler.',
      codeTemplate: 'function logger(req, res, next) {\n  console.log(req.method, req.url);\n  ___();\n}',
      answer: 'next',
      hint: 'A função que o Express injeta para continuar a cadeia de middlewares.',
      explanation: 'Chamar `next()` repassa o controle ao próximo middleware ou rota na cadeia. Sem isso, a requisição fica travada.',
    },
    {
      type: 'truefalse',
      id: 'm5-e4',
      prompt: 'Em uma API REST bem desenhada, o verbo DELETE deveria ser usado para criar um novo recurso.',
      answer: false,
      explanation: 'DELETE remove um recurso existente. Para criar, o verbo correto é POST.',
    },
    {
      type: 'mcq',
      id: 'm5-e5',
      prompt: 'Por que o Node.js consegue lidar com muitas requisições simultâneas usando uma única thread principal?',
      options: [
        'Porque ele ignora requisições em excesso',
        'Por causa do event loop, que delega operações lentas e continua processando outras tarefas',
        'Porque o JavaScript é mais rápido que outras linguagens',
        'Porque cada requisição cria uma nova thread automaticamente',
      ],
      correctIndex: 1,
      explanation:
        'O event loop não bloqueia a thread principal esperando operações de I/O (disco, rede, banco) — ele delega e retoma via callback quando o resultado está pronto.',
    },
  ],
  games: [
    {
      gameId: 'http-status-match',
      label: 'Combinando Status Codes',
      description: 'Receba cenários de API e escolha o status code HTTP correto sob o relógio.',
    },
    {
      gameId: 'middleware-pipeline',
      label: 'Pipeline de Middlewares',
      description: 'Ordene middlewares (auth, validação, logging) na sequência certa para que uma requisição passe com sucesso.',
    },
  ],
};

export const mes06: Module = {
  id: 'mes-06',
  month: 6,
  phase: 1,
  track: 'fullstack',
  title: 'Projeto Integrador 1',
  emoji: '🏗️',
  tagline: 'Tudo que você aprendeu nos últimos 5 meses, junto, funcionando.',
  intro:
    'Esse mês não tem conteúdo novo — é sobre integração. Você vai construir um Sistema de Tarefas completo: frontend em HTML/CSS/JS puro consumindo um backend em Node.js + Express + PostgreSQL, com autenticação real. É o primeiro projeto que prova, para você e para qualquer recrutador, que você sabe construir algo do zero ao fim.',
  lessons: [
    {
      id: 'l1',
      heading: 'Arquitetura do projeto: como as peças se conectam',
      body:
        'Frontend e backend são processos separados que conversam por HTTP. O frontend roda no navegador do usuário; o backend roda em um servidor e fala com o banco de dados.\n\nO fluxo típico: usuário interage na UI → JavaScript do frontend faz um `fetch` para a API → Express recebe, valida, consulta/grava no PostgreSQL → retorna JSON → frontend atualiza a tela. Desenhar esse fluxo no papel antes de codar evita confusão depois.',
    },
    {
      id: 'l2',
      heading: 'Autenticação com JWT: provando quem é o usuário sem guardar sessão',
      body:
        'JWT (JSON Web Token) é um token assinado que contém informações do usuário (como o ID) e pode ser verificado sem consultar o banco a cada requisição. No login, o backend gera o token; o frontend guarda (geralmente em memória ou localStorage) e envia no header `Authorization` em toda requisição protegida.\n\nUm middleware de autenticação verifica e decodifica esse token antes de deixar a requisição passar para a rota protegida — se inválido ou ausente, retorna `401`.',
      codeExample: {
        lang: 'javascript',
        code: 'function autenticar(req, res, next) {\n  const token = req.headers.authorization?.split(" ")[1];\n  if (!token) return res.status(401).json({ erro: "Não autenticado" });\n  try {\n    req.usuario = jwt.verify(token, process.env.JWT_SECRET);\n    next();\n  } catch {\n    res.status(401).json({ erro: "Token inválido" });\n  }\n}',
      },
    },
    {
      id: 'l3',
      heading: 'CRUD completo: as quatro operações que toda aplicação tem',
      body:
        'Create, Read, Update, Delete — virtualmente toda aplicação de software é uma variação de CRUD sobre alguma entidade. Para o sistema de tarefas: criar tarefa, listar tarefas do usuário, marcar como concluída/editar, e excluir.\n\nO ponto de atenção é sempre verificar que o usuário só pode ler/editar/excluir **suas próprias** tarefas — isso é autorização, uma camada além da autenticação.',
    },
  ],
  resources: [
    { label: 'Express — MDN', url: 'https://developer.mozilla.org/pt-BR/docs/Learn/Server-side/Express_Nodejs' },
    { label: 'You Don\u2019t Know JS (livro)', url: 'https://github.com/getify/You-Dont-Know-JS' },
  ],
  checklist: [
    { id: 'c1', label: 'Frontend consumindo a API' },
    { id: 'c2', label: 'Backend com autenticação JWT' },
    { id: 'c3', label: 'Deploy local funcionando' },
  ],
  goalLabel: 'Meta: Sistema completo rodando',
  exercises: [
    {
      type: 'mcq',
      id: 'm6-e1',
      prompt: 'O que um JWT permite que um backend evite fazer a cada requisição autenticada?',
      options: [
        'Evita ter que validar dados de entrada',
        'Evita consultar o banco de dados só para confirmar quem é o usuário',
        'Evita usar HTTPS',
        'Evita usar middlewares',
      ],
      correctIndex: 1,
      explanation:
        'Como o JWT é assinado e contém os dados do usuário, o backend pode verificar a assinatura e confiar no conteúdo sem precisar consultar o banco para validar a sessão.',
    },
    {
      type: 'truefalse',
      id: 'm6-e2',
      prompt: 'Autenticação e autorização são a mesma coisa.',
      answer: false,
      explanation:
        'Autenticação confirma quem é o usuário. Autorização decide o que esse usuário específico tem permissão de fazer (ex: só editar suas próprias tarefas).',
    },
    {
      type: 'order',
      id: 'm6-e3',
      prompt: 'Ordene o fluxo completo de uma requisição autenticada, do clique do usuário até a tela atualizar.',
      steps: [
        'Usuário clica em "concluir tarefa" na interface',
        'Frontend envia requisição PUT com o token no header Authorization',
        'Middleware de autenticação valida o token no backend',
        'Backend atualiza o registro no PostgreSQL',
        'Frontend recebe a resposta e atualiza a tela',
      ],
      explanation:
        'Esse é o ciclo de vida completo de uma operação autenticada num sistema fullstack — entender essa cadeia é a base de qualquer debugging futuro.',
    },
    {
      type: 'mcq',
      id: 'm6-e4',
      prompt: 'Em um sistema de tarefas multiusuário, o que falta nesta query: `SELECT * FROM tarefas WHERE id = $1`?',
      code: 'SELECT * FROM tarefas WHERE id = $1',
      options: [
        'Nada, está correta',
        'Falta verificar que a tarefa pertence ao usuário autenticado (ex: AND usuario_id = $2)',
        'Falta um JOIN',
        'Falta ORDER BY',
      ],
      correctIndex: 1,
      explanation:
        'Sem checar o dono da tarefa, qualquer usuário autenticado poderia ler ou editar tarefas de outras pessoas só sabendo o ID — uma falha clássica de autorização.',
    },
  ],
  games: [
    {
      gameId: 'fullstack-wiring',
      label: 'Conecte o Sistema',
      description: 'Arraste conexões entre frontend, rotas da API, middlewares e banco de dados para montar a arquitetura correta.',
    },
  ],
  projectBrief: {
    title: 'Sistema de Tarefas Completo',
    description:
      'Uma aplicação de gerenciamento de tarefas com cadastro, login, e CRUD completo, persistindo dados em PostgreSQL e com frontend consumindo a API via fetch.',
    requirements: [
      'Cadastro e login de usuário com senha criptografada (bcrypt)',
      'Autenticação via JWT em todas as rotas protegidas',
      'CRUD completo de tarefas (criar, listar, editar, concluir, excluir)',
      'Cada usuário só vê e edita suas próprias tarefas',
      'Frontend responsivo consumindo a API via fetch/async-await',
      'README explicando como rodar o projeto localmente',
    ],
  },
};
