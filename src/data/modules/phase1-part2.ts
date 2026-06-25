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
    {
      id: 'l5',
      heading: 'Conflitos de merge: quando o Git não consegue decidir por você',
      body:
        'Um conflito acontece quando duas branches alteram a mesma linha de um arquivo de formas diferentes — o Git não sabe qual versão manter, então marca o trecho conflitante no arquivo com `<<<<<<<`, `=======` e `>>>>>>>`, e espera você decidir manualmente.\n\nResolver um conflito é: abrir o arquivo, escolher (ou combinar) qual versão deve ficar, remover os marcadores, e fazer um novo commit. Conflitos não são "erro" — são esperados em qualquer projeto colaborativo, e saber resolvê-los com calma é uma habilidade básica, não avançada.',
      codeExample: {
        lang: 'text',
        code: '<<<<<<< HEAD\nconst taxa = 0.05;\n=======\nconst taxa = 0.08;\n>>>>>>> feature/nova-taxa',
      },
    },
    {
      id: 'l6',
      heading: 'Tipos de JOIN: nem toda combinação de tabelas é igual',
      body:
        '`INNER JOIN` retorna só as linhas que têm correspondência em ambas as tabelas — se um cliente não tem pedido nenhum, ele não aparece. `LEFT JOIN` retorna todas as linhas da tabela da esquerda, mesmo sem correspondência na direita (preenchendo com `NULL` o que não existe) — essencial para perguntas como "quais clientes nunca fizeram um pedido?".\n\nEscolher o JOIN errado é uma das causas mais comuns de bugs sutis em relatórios: um `INNER JOIN` onde deveria haver um `LEFT JOIN` simplesmente faz registros desaparecerem do resultado, sem erro nenhum.',
      codeExample: {
        lang: 'sql',
        code: '-- Clientes que NUNCA fizeram pedido\nSELECT clientes.nome\nFROM clientes\nLEFT JOIN pedidos ON pedidos.cliente_id = clientes.id\nWHERE pedidos.id IS NULL;',
      },
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
    {
      type: 'mcq',
      id: 'm4-e6',
      prompt: 'Você quer listar todos os clientes, incluindo os que nunca fizeram nenhum pedido. Qual JOIN usar?',
      options: ['INNER JOIN', 'LEFT JOIN (a partir de clientes)', 'Não é possível com SQL', 'GROUP JOIN'],
      correctIndex: 1,
      explanation:
        'LEFT JOIN mantém todas as linhas da tabela à esquerda (clientes), preenchendo com NULL os campos da tabela à direita quando não há correspondência.',
    },
    {
      type: 'truefalse',
      id: 'm4-e7',
      prompt: 'Um conflito de merge no Git significa que o repositório está corrompido.',
      answer: false,
      explanation:
        'Conflito de merge é uma situação normal e esperada: significa apenas que duas branches alteraram a mesma parte de um arquivo de formas diferentes, e o Git precisa que você decida manualmente qual versão manter.',
    },
    {
      type: 'mcq',
      id: 'm4-e8',
      prompt: 'Em um arquivo com marcadores de conflito (<<<<<<<, =======, >>>>>>>), qual é o passo correto após decidir qual código manter?',
      options: [
        'Deixar os marcadores no arquivo para referência futura',
        'Remover os marcadores e fazer um novo commit',
        'Apagar o arquivo inteiro',
        'Reverter para a versão anterior ao conflito automaticamente',
      ],
      correctIndex: 1,
      explanation:
        'Depois de escolher (ou combinar) o código correto, é preciso remover todos os marcadores de conflito e commitar o arquivo já resolvido.',
    },
  ],
  games: [
    {
      gameId: 'sql-query-builder',
      label: 'Construtor de Queries',
      description: 'Monte queries SQL arrastando cláusulas (SELECT, WHERE, JOIN, LEFT JOIN) — 5 desafios progressivos.',
    },
    {
      gameId: 'git-branch-simulator',
      label: 'Simulador de Branches',
      description: 'Visualize e pratique git checkout, merge e resolução de conflitos num simulador visual de árvore de commits.',
    },
    {
      gameId: 'terminal-simulator',
      label: 'Terminal Simulado',
      description: 'Digite comandos reais de Git num terminal simulado — sem multiple choice, é você e o teclado.',
    },
  ],
  scenarios: [
    {
      id: 'mes04-cen1',
      context: 'trabalho',
      title: '"Sumiram" 2 dias de trabalho de um colega',
      emoji: '😱',
      situation:
        'Um colega de time roda um comando de Git sem entender bem o que faz, e de repente o código que ele escreveu nos últimos 2 dias parece ter desaparecido da branch.',
      whatHappens:
        'Provavelmente ele rodou algo como `git reset --hard` apontando para um commit antigo, ou fez checkout para outra branch sem commitar antes — o trabalho não commitado fica perdido (ou fica "preso" em outra branch, dependendo do caso).',
      howToSolve:
        'Antes de qualquer comando que reescreve histórico (`reset --hard`, `rebase`, `push --force`), comite ou pelo menos salve um stash do trabalho em progresso. E na maioria dos casos, `git reflog` consegue recuperar commits que pareciam perdidos — ele guarda um histórico de tudo que o HEAD apontou recentemente.',
    },
    {
      id: 'mes04-cen2',
      context: 'pessoal',
      title: 'Organizando uma coleção pessoal (livros, jogos, receitas)',
      emoji: '📚',
      situation:
        'Você quer montar um catálogo dos seus livros com autor, ano, e quais já leu, e poder perguntar coisas como "quais livros de um autor X eu ainda não li".',
      whatHappens:
        'Isso é exatamente o que um banco relacional com algumas tabelas relacionadas resolve bem — muito mais flexível que uma planilha quando as perguntas que você quer fazer aos dados vão ficando mais específicas.',
      howToSolve:
        'Uma tabela `livros` com colunas (titulo, autor, ano, lido) já resolve casos simples. `SELECT titulo FROM livros WHERE autor = \'Autor X\' AND lido = false` responde exatamente a pergunta, sem precisar abrir e escanear visualmente uma planilha inteira.',
    },
    {
      id: 'mes04-cen3',
      context: 'trabalho',
      title: 'Dois devs editaram o mesmo arquivo — conflito no merge',
      emoji: '⚔️',
      situation:
        'Você abre um Pull Request para juntar sua branch na main, e o GitHub avisa que há conflitos — duas pessoas mudaram a mesma função de formas diferentes.',
      whatHappens:
        'O Git não tem como adivinhar qual das duas versões (ou uma combinação delas) é a correta, então ele marca o trecho com `<<<<<<<`, `=======`, `>>>>>>>` e espera uma decisão humana.',
      howToSolve:
        'Abra o arquivo conflitante, leia as duas versões com calma (geralmente conversando com quem fez a outra mudança), decida qual manter ou como combiná-las, remova os marcadores, e comite a resolução. Conflitos são normais em qualquer time — não é sinal de que algo está errado.',
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
    {
      id: 'l5',
      heading: 'Variáveis de ambiente: segredos fora do código',
      body:
        'Senhas de banco, chaves de API e outras configurações sensíveis nunca devem ficar escritas direto no código — se isso for versionado no Git, qualquer pessoa com acesso ao repositório (ou, em repositórios públicos, qualquer pessoa do mundo) vê esses segredos.\n\nVariáveis de ambiente resolvem isso: valores são definidos fora do código (geralmente em um arquivo `.env`, que fica no `.gitignore` e nunca é commitado) e lidos em tempo de execução via `process.env.NOME_DA_VARIAVEL`. Isso também permite usar configurações diferentes em desenvolvimento e produção sem mudar uma linha de código.',
      codeExample: {
        lang: 'javascript',
        code: '// .env (nunca commitado)\nDATABASE_URL=postgres://user:senha@localhost/meubanco\n\n// no código\nconst conexao = process.env.DATABASE_URL;',
      },
    },
    {
      id: 'l6',
      heading: 'Validação de entrada: nunca confie no que chega na requisição',
      body:
        'Todo dado que chega numa API — seja do formulário de um usuário bem-intencionado ou de um atacante testando seu sistema — deve ser validado antes de ser usado. Sem validação, campos podem chegar vazios, em formato errado, ou maliciosamente construídos para explorar falhas (como SQL Injection, quando texto não validado é inserido direto numa query).\n\nBibliotecas como Zod ou Joi permitem declarar exatamente a forma esperada dos dados (quais campos, quais tipos, quais obrigatórios) e rejeitar automaticamente qualquer requisição que não corresponda, antes mesmo de chegar na lógica de negócio.',
      codeExample: {
        lang: 'javascript',
        code: 'const schema = z.object({\n  nome: z.string().min(2),\n  email: z.string().email(),\n});\n\nconst resultado = schema.safeParse(req.body);\nif (!resultado.success) {\n  return res.status(400).json({ erro: "Dados inválidos" });\n}',
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
    {
      type: 'truefalse',
      id: 'm5-e6',
      prompt: 'É seguro commitar um arquivo .env com a senha do banco de dados em um repositório privado no GitHub.',
      answer: false,
      explanation:
        'Mesmo em repositórios privados, segredos não deveriam ser commitados: pessoas podem ganhar acesso ao repo depois, ferramentas de CI podem expor logs, e o histórico do Git mantém esses dados mesmo se o arquivo for removido depois. O padrão é sempre usar .gitignore para arquivos .env.',
    },
    {
      type: 'mcq',
      id: 'm5-e7',
      prompt: 'Por que validar dados de entrada na API é importante mesmo se o frontend já valida o formulário?',
      options: [
        'Não é importante, validação duplicada é desperdício',
        'Porque qualquer pessoa pode enviar requisições diretamente à API, ignorando o frontend completamente',
        'Porque o frontend nunca tem bugs',
        'Porque o banco de dados já rejeita tudo que é inválido',
      ],
      correctIndex: 1,
      explanation:
        'Validação no frontend é só para experiência do usuário — qualquer pessoa pode usar ferramentas como Postman ou curl para enviar requisições direto à API, contornando completamente qualquer validação da interface.',
    },
    {
      type: 'code-fill',
      id: 'm5-e8',
      prompt: 'Complete a forma correta de ler uma variável de ambiente em Node.js.',
      codeTemplate: 'const urlBanco = process.___.DATABASE_URL;',
      answer: 'env',
      hint: 'O objeto global do Node.js que expõe as variáveis de ambiente do processo.',
      explanation: '`process.env` é o objeto que contém todas as variáveis de ambiente disponíveis para o processo Node.js em execução.',
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
  scenarios: [
    {
      id: 'mes05-cen1',
      context: 'trabalho',
      title: 'API "cai" sempre que alguém manda dado errado',
      emoji: '💥',
      situation:
        'O time de mobile reporta que o app trava quando o usuário deixa um campo vazio no cadastro — e olhando os logs do servidor, a API simplesmente parou de responder (status 500) sem mensagem útil.',
      whatHappens:
        'Uma rota está acessando `req.body.email.toLowerCase()` sem checar se `email` realmente existe. Quando ele vem `undefined`, chamar `.toLowerCase()` nele lança uma exceção que não foi capturada, derrubando aquela requisição (e, sem tratamento de erro global, possivelmente o processo).',
      howToSolve:
        'Validação de entrada (com algo como Zod) deveria rejeitar a requisição com um 400 claro antes mesmo de chegar na lógica de negócio. E um middleware de erro global garante que qualquer exceção não prevista vire uma resposta 500 controlada, em vez de derrubar o servidor.',
    },
    {
      id: 'mes05-cen2',
      context: 'pessoal',
      title: 'Automatizando um lembrete pessoal',
      emoji: '⏰',
      situation:
        'Você quer um pequeno script que roda todo dia de manhã e te manda uma mensagem (ou só imprime no terminal) lembrando dos compromissos do dia.',
      whatHappens:
        'Isso é um pequeno servidor Node.js de propósito único — não precisa de banco de dados nem de frontend, só de uma rotina que executa uma tarefa e produz um resultado, exatamente os conceitos básicos de um servidor que você está aprendendo.',
      howToSolve:
        'Um script Node simples com `setInterval` (para rodar enquanto o processo está ativo) ou agendado via cron do sistema operacional, fazendo uma chamada HTTP para uma API de mensagens (ex: Telegram Bot API), resolve isso em poucas linhas.',
    },
    {
      id: 'mes05-cen3',
      context: 'trabalho',
      title: 'Chave secreta vazou no GitHub',
      emoji: '🔓',
      situation:
        'Alguém do time commitou por engano um arquivo com a senha do banco de dados de produção escrita direto no código, e isso foi enviado para o repositório (mesmo que privado).',
      whatHappens:
        'Uma vez que um segredo entra no histórico do Git, ele continua lá mesmo se o arquivo for deletado depois — qualquer pessoa com acesso ao histórico (ou bots, se o repo for público) pode encontrá-lo.',
      howToSolve:
        'A correção imediata é trocar a senha/chave exposta — apagar do código não resolve, porque o histórico já a expôs. A prevenção é usar variáveis de ambiente (`.env` no `.gitignore`) desde o primeiro commit do projeto, nunca escrevendo segredos direto no código-fonte.',
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
        'Frontend e backend são processos separados que conversam por HTTP. O frontend roda no navegador do usuário; o backend roda em um servidor e fala com o banco de dados.\n\nO fluxo típico: usuário interage na UI → JavaScript do frontend faz um `fetch` para a API → Express recebe, valida, consulta/grava no PostgreSQL → retorna JSON → frontend atualiza a tela. Desenhar esse fluxo no papel antes de codar evita confusão depois. Simule esse fluxo completo abaixo.',
      diagramId: 'http-flow',
    },
    {
      id: 'l2',
      heading: 'Autenticação com JWT: provando quem é o usuário sem guardar sessão',
      body:
        'JWT (JSON Web Token) é um token assinado que contém informações do usuário (como o ID) e pode ser verificado sem consultar o banco a cada requisição. No login, o backend gera o token; o frontend guarda (geralmente em memória ou localStorage) e envia no header `Authorization` em toda requisição protegida.\n\nUm middleware de autenticação verifica e decodifica esse token antes de deixar a requisição passar para a rota protegida — se inválido ou ausente, retorna `401`. Veja o fluxo completo simulado abaixo.',
      codeExample: {
        lang: 'javascript',
        code: 'function autenticar(req, res, next) {\n  const token = req.headers.authorization?.split(" ")[1];\n  if (!token) return res.status(401).json({ erro: "Não autenticado" });\n  try {\n    req.usuario = jwt.verify(token, process.env.JWT_SECRET);\n    next();\n  } catch {\n    res.status(401).json({ erro: "Token inválido" });\n  }\n}',
      },
      diagramId: 'jwt-flow',
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
    {
      gameId: 'architecture-builder',
      label: 'Arquiteto de Sistemas',
      description: 'Monte o fluxo correto de componentes para cenários reais, do básico ao uso de filas assíncronas.',
    },
  ],
  scenarios: [
    {
      id: 'mes06-cen1',
      context: 'trabalho',
      title: 'Usuário consegue ver tarefas de outra pessoa',
      emoji: '🚨',
      situation:
        'Um usuário percebe, por acaso, que mudando o número no final da URL (`/tarefas/41` para `/tarefas/42`) consegue ver a tarefa de outra pessoa.',
      whatHappens:
        'A rota verifica se o usuário está autenticado (tem um token válido), mas não verifica se aquela tarefa específica pertence a ele — autenticação sem autorização. Qualquer usuário logado pode acessar dados de qualquer outro só adivinhando IDs.',
      howToSolve:
        'Toda consulta a um recurso específico precisa checar a propriedade: `WHERE id = $1 AND usuario_id = $2`, nunca só `WHERE id = $1`. Esse tipo de falha (chamada de "IDOR" — Insecure Direct Object Reference) é uma das mais comuns e mais graves em aplicações reais.',
    },
    {
      id: 'mes06-cen2',
      context: 'pessoal',
      title: 'Construindo seu próprio gerenciador de hábitos',
      emoji: '✅',
      situation:
        'Você quer uma versão simples e sua de um app de hábitos — marcar o que fez no dia, ver sequência de dias seguidos, sem depender de um app de terceiros com anúncios.',
      whatHappens:
        'É literalmente o mesmo projeto que você está construindo neste módulo (CRUD + autenticação), só trocando "tarefa" por "hábito" — a estrutura de dados e a lógica de autenticação são idênticas.',
      howToSolve:
        'Reaproveite a mesma base: tabela de usuários, tabela de hábitos (ou tarefas) ligada ao usuário, autenticação JWT. Adicione um campo de "streak" calculado a partir das datas marcadas — exercício prático de transformar o que você aprendeu num projeto pessoal de verdade.',
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
