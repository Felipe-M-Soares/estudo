import type { Module } from '../types';

export const mes01: Module = {
  id: 'mes-01',
  month: 1,
  phase: 1,
  track: 'soft',
  title: 'Lógica de Programação',
  emoji: '🧩',
  tagline: 'Antes da sintaxe, o raciocínio.',
  intro:
    'Toda linguagem de programação é só um jeito de escrever lógica. Antes de aprender JavaScript, Java ou qualquer outra, você precisa treinar o músculo que resolve problemas: decompor, repetir, comparar, guardar e buscar informação. Esse mês não é sobre decorar sintaxe — é sobre pensar como alguém que programa.',
  lessons: [
    {
      id: 'l1',
      heading: 'O que é um algoritmo, de verdade',
      body:
        'Um algoritmo é uma sequência finita de passos que resolve um problema. Receita de bolo é um algoritmo. Manual de montagem de móvel é um algoritmo. A diferença do código é que o computador não tolera ambiguidade: "misture bem" não compila, mas "repita 20 vezes: gire a colher" sim.\n\nTrês blocos constroem qualquer algoritmo:\n- **Sequência**: um passo depois do outro\n- **Decisão**: "se isso, faça aquilo, senão faça outra coisa"\n- **Repetição**: "enquanto isso for verdade, repita"\n\nQualquer programa complexo — de um app de banco a um jogo — é só uma composição enorme desses três blocos.',
    },
    {
      id: 'l2',
      heading: 'Condicionais: ensinando o programa a decidir',
      body:
        'Uma condicional compara um valor e decide o que fazer. Em pseudocódigo:\n\n```\nse idade >= 18\n    mostrar "pode dirigir"\nsenão\n    mostrar "ainda não"\n```\n\nO segredo aqui não é a sintaxe (ela muda entre linguagens), é aprender a **traduzir uma regra do mundo real em uma condição booleana** (verdadeiro ou falso). Pratique pegando regras do dia a dia — "se chover, levo guarda-chuva" — e escrevendo como condicional.',
      codeExample: {
        lang: 'pseudocódigo',
        code: 'se nota >= 7\n    aprovado\nsenao se nota >= 5\n    recuperacao\nsenao\n    reprovado',
      },
    },
    {
      id: 'l3',
      heading: 'Loops: fazendo o computador repetir por você',
      body:
        'Repetir manualmente "imprimir 1, imprimir 2, imprimir 3..." até 1000 seria insano. Um loop generaliza isso: "repita N vezes" ou "repita enquanto a condição for verdadeira".\n\nExistem dois tipos fundamentais:\n- **Loop contado** (for): você sabe quantas vezes vai repetir\n- **Loop condicional** (while): repete até uma condição mudar, sem saber de antemão quantas vezes\n\nO erro mais comum de quem está aprendendo é o **loop infinito**: esquecer de atualizar a condição que faria o loop parar.',
      codeExample: {
        lang: 'pseudocódigo',
        code: 'para i de 1 até 10\n    imprimir i\n\nenquanto fila não vazia\n    atender proxima pessoa',
      },
    },
    {
      id: 'l4',
      heading: 'Estruturas de dados básicas: onde guardar as coisas',
      body:
        'Dados precisam de um lugar para morar. As estruturas mudam **como** você acessa e organiza a informação:\n\n- **Array/Lista**: uma fileira numerada de itens. Acesso direto por posição (índice).\n- **Pilha (stack)**: o último que entra é o primeiro que sai — como uma pilha de pratos. Usada em "desfazer" (Ctrl+Z) e em chamadas de função.\n- **Fila (queue)**: o primeiro que entra é o primeiro que sai — como fila de banco. Usada em processamento de tarefas em ordem.\n- **Árvore**: cada item pode ter "filhos" — usada para representar hierarquias, como pastas de arquivos ou o DOM de uma página web.\n\nVocê vai encontrar essas quatro estruturas em praticamente todo sistema que construir daqui pra frente.',
    },
    {
      id: 'l5',
      heading: 'Ordenação e busca: os primeiros algoritmos clássicos',
      body:
        '**Bubble sort** compara pares vizinhos e troca se estiverem na ordem errada, repetindo até tudo estar ordenado. É lento (O(n²)) mas é o jeito mais intuitivo de entender ordenação.\n\n**Merge sort** divide a lista pela metade recursivamente até sobrar 1 elemento, depois junta as partes já ordenadas. É muito mais rápido (O(n log n)) e é a base de algoritmos usados em produção.\n\n**Busca binária** só funciona em listas já ordenadas: você compara o item do meio, e se não for o que procura, descarta a metade errada e repete. Por isso ela acha um item em uma lista de 1 milhão de elementos em só ~20 comparações.',
    },
  ],
  resources: [
    { label: 'Lógica de Programação — FreeCodeCamp', url: 'https://www.freecodecamp.org/portuguese/' },
    { label: 'Curso em Vídeo — Lógica', url: 'https://www.cursoemvideo.com' },
    { label: 'LeetCode', url: 'https://leetcode.com' },
    { label: 'HackerRank', url: 'https://www.hackerrank.com' },
  ],
  checklist: [
    { id: 'c1', label: '30+ exercícios no LeetCode (nível fácil)' },
    { id: 'c2', label: 'Algoritmos de ordenação implementados (bubble e merge sort)' },
    { id: 'c3', label: 'Estruturas de dados básicas implementadas (pilha e fila)' },
  ],
  goalLabel: 'Meta: 30+ exercícios resolvidos',
  exercises: [
    {
      type: 'mcq',
      id: 'm1-e1',
      prompt: 'Qual estrutura de dados segue a regra "o último que entra é o primeiro que sai"?',
      options: ['Fila (queue)', 'Pilha (stack)', 'Árvore', 'Array'],
      correctIndex: 1,
      explanation:
        'A pilha (stack) é LIFO — Last In, First Out. É a estrutura usada nas chamadas de função e no Ctrl+Z dos editores.',
    },
    {
      type: 'truefalse',
      id: 'm1-e2',
      prompt: 'Busca binária funciona em qualquer lista, ordenada ou não.',
      answer: false,
      explanation:
        'Busca binária exige que a lista já esteja ordenada. Ela descarta metades comparando com o item do meio — isso só é válido se a ordem for conhecida.',
    },
    {
      type: 'order',
      id: 'm1-e3',
      prompt: 'Coloque os passos do bubble sort na ordem correta de execução para uma única passada.',
      steps: [
        'Comparar o primeiro par de elementos vizinhos',
        'Se estiverem fora de ordem, trocar de posição',
        'Avançar para o próximo par vizinho',
        'Repetir até o fim da lista',
      ],
      explanation:
        'Bubble sort percorre a lista comparando vizinhos e trocando quando necessário, "borbulhando" o maior valor para o fim a cada passada completa.',
    },
    {
      type: 'code-fill',
      id: 'm1-e4',
      prompt: 'Complete o pseudocódigo de um loop que imprime de 1 a 5.',
      codeTemplate: 'para i de 1 ___ 5\n    imprimir i',
      answer: 'até',
      hint: 'Que palavra define o limite final de um loop contado?',
      explanation: 'Um loop "para i de 1 até 5" repete enquanto i estiver entre 1 e 5, incluindo as duas pontas.',
    },
    {
      type: 'mcq',
      id: 'm1-e5',
      prompt: 'Por que busca binária é tão mais rápida que busca linear em listas grandes?',
      options: [
        'Porque ela usa mais memória',
        'Porque ela descarta metade das possibilidades a cada comparação',
        'Porque ela funciona só com números',
        'Porque ela não precisa de loop',
      ],
      correctIndex: 1,
      explanation:
        'A cada passo, busca binária elimina metade do espaço de busca, por isso o número de comparações cresce em log(n) em vez de n.',
    },
  ],
  games: [
    {
      gameId: 'logic-maze',
      label: 'Labirinto Lógico',
      description: 'Monte uma sequência de comandos (sequência, decisão, repetição) para guiar um robô até o objetivo.',
    },
    {
      gameId: 'sort-visualizer',
      label: 'Corrida da Ordenação',
      description: 'Veja bubble sort e merge sort competindo em tempo real e entenda visualmente por que um é mais rápido.',
    },
  ],
};

export const mes02: Module = {
  id: 'mes-02',
  month: 2,
  phase: 1,
  track: 'frontend',
  title: 'HTML5 & CSS3',
  emoji: '🎨',
  tagline: 'A estrutura e a aparência de tudo que existe na web.',
  intro:
    'Todo site que você já visitou — banco, rede social, loja — é HTML descrevendo a estrutura e CSS descrevendo a aparência. Esse mês você aprende a escrever páginas que fazem sentido para humanos e para leitores de tela, e a estilizá-las de forma responsiva, sem gambiarra.',
  lessons: [
    {
      id: 'l1',
      heading: 'HTML semântico: estrutura com significado',
      body:
        'Um `<div>` não diz nada sobre o que está dentro. Tags semânticas dizem: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`. Isso importa por três razões:\n\n- **Acessibilidade**: leitores de tela usam essas tags para navegar a página por voz\n- **SEO**: motores de busca entendem melhor a hierarquia do conteúdo\n- **Manutenção**: outro dev (ou você em 6 meses) entende a estrutura sem precisar ler todo o CSS\n\nRegra prática: só use `<div>` quando nenhuma tag semântica fizer sentido.',
      codeExample: {
        lang: 'html',
        code: '<header>\n  <nav>...</nav>\n</header>\n<main>\n  <article>\n    <h1>Título</h1>\n    <p>Conteúdo</p>\n  </article>\n</main>\n<footer>...</footer>',
      },
    },
    {
      id: 'l2',
      heading: 'Formulários e acessibilidade',
      body:
        'Todo `<input>` precisa de um `<label>` associado — sem isso, alguém usando leitor de tela não sabe o que aquele campo pede. Use o atributo `for` no label apontando para o `id` do input.\n\nAtributos de validação nativa (`required`, `type="email"`, `pattern`, `minlength`) evitam reinventar validação em JavaScript para casos simples. Eles também disparam mensagens de erro acessíveis automaticamente no navegador.',
      codeExample: {
        lang: 'html',
        code: '<label for="email">E-mail</label>\n<input id="email" type="email" required />',
      },
    },
    {
      id: 'l3',
      heading: 'Flexbox: alinhar em uma direção',
      body:
        'Flexbox resolve "como alinho estes itens numa linha ou coluna". O container vira `display: flex`, e os filhos se organizam ao longo de um eixo principal.\n\n`justify-content` controla o eixo principal (geralmente horizontal). `align-items` controla o eixo transversal (geralmente vertical). `gap` cria espaçamento entre os itens sem precisar de margin manual.\n\nUse flexbox para: barras de navegação, cards em linha, qualquer alinhamento "1D".',
      codeExample: {
        lang: 'css',
        code: '.nav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n}',
      },
    },
    {
      id: 'l4',
      heading: 'CSS Grid: alinhar em duas direções',
      body:
        'Grid resolve "como organizo isso em linhas E colunas ao mesmo tempo". Você define `grid-template-columns` para descrever quantas colunas existem e quanto espaço cada uma ocupa.\n\n`repeat(auto-fit, minmax(200px, 1fr))` é um padrão extremamente útil: cria quantas colunas de no mínimo 200px couberem, e distribui o espaço restante igualmente — isso sozinho resolve grande parte dos layouts responsivos sem media query.',
      codeExample: {
        lang: 'css',
        code: '.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 20px;\n}',
      },
    },
    {
      id: 'l5',
      heading: 'Mobile-first: comece pequeno, expanda depois',
      body:
        'Mobile-first significa escrever o CSS base pensando na tela pequena, e usar `@media (min-width: ...)` para adicionar regras conforme a tela cresce — nunca o contrário. Isso evita uma cascata de overrides confusos e reflete a realidade: a maioria do tráfego web hoje é mobile.\n\n```css\n.card { padding: 12px; }\n\n@media (min-width: 768px) {\n  .card { padding: 24px; }\n}\n```\n\nDesign system básico significa definir, antes de estilizar qualquer coisa: sua paleta de cores, escala de espaçamento (4px, 8px, 16px, 24px...) e escala tipográfica. Isso evita estilizar "no olho" cada componente.',
    },
  ],
  resources: [
    { label: 'HTML — MDN', url: 'https://developer.mozilla.org/pt-BR/docs/Web/HTML' },
    { label: 'CSS — MDN', url: 'https://developer.mozilla.org/pt-BR/docs/Web/CSS' },
    { label: 'Origamid', url: 'https://www.origamid.com' },
    { label: 'Flexbox Guide — CSS-Tricks', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/' },
    { label: 'Grid Guide — CSS-Tricks', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/' },
  ],
  checklist: [
    { id: 'c1', label: 'Página de portfólio pessoal (responsiva)' },
    { id: 'c2', label: 'Landing page de produto fictício' },
    { id: 'c3', label: 'Formulário com validação básica (HTML nativo)' },
  ],
  goalLabel: 'Meta: 2 páginas responsivas publicadas',
  exercises: [
    {
      type: 'mcq',
      id: 'm2-e1',
      prompt: 'Qual a vantagem real de usar `<nav>` em vez de `<div class="nav">`?',
      options: [
        'Nenhuma, é só estética',
        'Leitores de tela e motores de busca entendem a função daquele bloco',
        'Faz a página carregar mais rápido',
        '`<nav>` é obrigatório por lei em sites brasileiros',
      ],
      correctIndex: 1,
      explanation:
        'Tags semânticas comunicam significado para tecnologias assistivas e para SEO — uma `<div>` não carrega nenhuma informação sobre seu papel na página.',
    },
    {
      type: 'mcq',
      id: 'm2-e2',
      prompt: 'Em Flexbox, qual propriedade controla o alinhamento ao longo do eixo principal?',
      options: ['align-items', 'justify-content', 'flex-wrap', 'gap'],
      correctIndex: 1,
      explanation:
        '`justify-content` alinha itens ao longo do eixo principal (normalmente horizontal em `flex-direction: row`). `align-items` cuida do eixo transversal.',
    },
    {
      type: 'code-fill',
      id: 'm2-e3',
      prompt: 'Complete a regra Grid que cria colunas responsivas de no mínimo 200px cada.',
      codeTemplate: 'grid-template-columns: repeat(auto-fit, ___(200px, 1fr));',
      answer: 'minmax',
      hint: 'A função que define um intervalo mínimo e máximo para o tamanho de cada coluna.',
      explanation:
        '`minmax(200px, 1fr)` diz: cada coluna tem no mínimo 200px, mas pode crescer e dividir o espaço restante igualmente (`1fr`).',
    },
    {
      type: 'truefalse',
      id: 'm2-e4',
      prompt: 'Em uma abordagem mobile-first, as media queries usam `max-width` para adicionar estilos em telas maiores.',
      answer: false,
      explanation:
        'Mobile-first usa `min-width`: o CSS base já é o mobile, e você adiciona regras quando a tela atinge ou supera um certo tamanho.',
    },
    {
      type: 'match',
      id: 'm2-e5',
      prompt: 'Associe cada tag semântica à sua função correta.',
      pairs: [
        { left: '<header>', right: 'Cabeçalho da página ou seção' },
        { left: '<main>', right: 'Conteúdo principal único da página' },
        { left: '<article>', right: 'Conteúdo independente e reutilizável (post, notícia)' },
        { left: '<footer>', right: 'Rodapé com informações de encerramento' },
      ],
      explanation:
        'Cada tag HTML5 semântica comunica uma função estrutural específica, ajudando navegação assistiva e organização do código.',
    },
  ],
  games: [
    {
      gameId: 'flexbox-dojo',
      label: 'Dojo do Flexbox',
      description: 'Ajuste justify-content, align-items e flex-direction em desafios visuais até acertar o alinhamento pedido.',
    },
    {
      gameId: 'css-selector-hunt',
      label: 'Caça ao Seletor CSS',
      description: 'Encontre o seletor CSS certo para acertar exatamente os elementos destacados na tela.',
    },
  ],
};

export const mes03: Module = {
  id: 'mes-03',
  month: 3,
  phase: 1,
  track: 'frontend',
  title: 'JavaScript (ES6+)',
  emoji: '⚡',
  tagline: 'A linguagem que dá vida à página.',
  intro:
    'HTML estrutura, CSS estiliza, JavaScript comporta. É a única linguagem que roda nativamente em todo navegador, e moderna o suficiente (ES6+) para escrever código limpo e assíncrono. Esse mês você sai de "página estática" para "aplicação que reage ao usuário".',
  lessons: [
    {
      id: 'l1',
      heading: 'Variáveis, funções e o problema do var',
      body:
        '`let` e `const` substituem `var` porque respeitam escopo de bloco (dentro de `{}`), evitando bugs clássicos de variáveis "escapando" do loop ou do if. Use `const` por padrão; só use `let` quando o valor realmente precisar mudar.\n\nFunções podem ser declaradas de três formas, e a diferença mais importante hoje é a **arrow function**, que não cria seu próprio `this` — ela herda do contexto onde foi escrita. Isso evita uma classe inteira de bugs em callbacks.',
      codeExample: {
        lang: 'javascript',
        code: 'const dobrar = (x) => x * 2;\n\nconst pessoa = {\n  nome: "Ana",\n  saudar() {\n    console.log(`Oi, ${this.nome}`);\n  }\n};',
      },
    },
    {
      id: 'l2',
      heading: 'Destructuring, spread e template literals',
      body:
        '**Destructuring** extrai valores de objetos/arrays direto em variáveis: `const { nome, idade } = pessoa`. Economiza linhas e deixa claro quais campos você está usando.\n\n**Spread** (`...`) expande um array ou objeto: útil para copiar sem mutar o original — fundamental em React, onde você nunca modifica estado diretamente.\n\n**Template literals** (crase, não aspas) permitem interpolar variáveis direto na string: `` `Olá, ${nome}` `` — muito mais legível que concatenação com `+`.',
      codeExample: {
        lang: 'javascript',
        code: 'const usuario = { nome: "Bia", idade: 28 };\nconst { nome, idade } = usuario;\n\nconst copia = { ...usuario, idade: 29 };\n\nconsole.log(`${nome} tem ${idade} anos`);',
      },
    },
    {
      id: 'l3',
      heading: 'Promises e async/await: lidando com o tempo',
      body:
        'Buscar dados de um servidor leva tempo — o JavaScript não pode simplesmente "esperar parado", porque isso travaria a página inteira. Uma **Promise** representa "um valor que vai existir no futuro": ela pode estar pendente, cumprida ou rejeitada.\n\n`async/await` é açúcar sintático sobre Promises que faz o código assíncrono **parecer** síncrono, sem o encadeamento confuso de `.then().then().then()`. Hoje é o padrão da indústria.',
      codeExample: {
        lang: 'javascript',
        code: 'async function buscarUsuario(id) {\n  try {\n    const resposta = await fetch(`/api/usuarios/${id}`);\n    const dados = await resposta.json();\n    return dados;\n  } catch (erro) {\n    console.error("Falhou:", erro);\n  }\n}',
      },
    },
    {
      id: 'l4',
      heading: 'Manipulação do DOM e eventos',
      body:
        'O DOM (Document Object Model) é a representação da página em forma de árvore de objetos que o JavaScript pode ler e modificar. `document.querySelector` busca um elemento; `.addEventListener` reage a interações do usuário (clique, digitação, envio de formulário).\n\nO erro mais comum de quem está começando é manipular o DOM diretamente em excesso — frameworks como React existem justamente para abstrair isso, mas entender o DOM puro primeiro é o que faz você realmente entender o que o framework está fazendo por debaixo.',
      codeExample: {
        lang: 'javascript',
        code: 'const botao = document.querySelector("#enviar");\n\nbotao.addEventListener("click", () => {\n  console.log("Clicado!");\n});',
      },
    },
  ],
  resources: [
    { label: 'JavaScript — MDN', url: 'https://developer.mozilla.org/pt-BR/docs/Web/JavaScript' },
    { label: 'JavaScript.info', url: 'https://javascript.info' },
    { label: 'Origamid JS', url: 'https://www.origamid.com/curso/javascript' },
  ],
  checklist: [
    { id: 'c1', label: 'To-Do App com localStorage' },
    { id: 'c2', label: 'Consumo de API pública (GitHub API)' },
    { id: 'c3', label: 'Mini-game interativo (ex: jogo da velha)' },
  ],
  goalLabel: 'Meta: 2 aplicações interativas',
  exercises: [
    {
      type: 'mcq',
      id: 'm3-e1',
      prompt: 'Qual é a saída de `console.log(typeof [])`?',
      code: 'console.log(typeof [])',
      options: ['"array"', '"object"', '"undefined"', '"null"'],
      correctIndex: 1,
      explanation:
        'Em JavaScript, arrays são tecnicamente um tipo de objeto. `typeof []` retorna `"object"` — para checar se algo é array de fato, use `Array.isArray()`.',
    },
    {
      type: 'code-fill',
      id: 'm3-e2',
      prompt: 'Complete a função para que ela espere a Promise antes de continuar.',
      codeTemplate: 'async function carregar() {\n  const r = ___ fetch("/api/dados");\n  return r.json();\n}',
      answer: 'await',
      hint: 'A palavra-chave que pausa a execução até a Promise resolver, dentro de uma função async.',
      explanation:
        '`await` só funciona dentro de uma função marcada como `async`, e pausa a execução daquela função até a Promise resolver ou rejeitar.',
    },
    {
      type: 'mcq',
      id: 'm3-e3',
      prompt: 'O que o spread operator faz em `const copia = { ...original, idade: 30 }`?',
      options: [
        'Modifica o objeto original diretamente',
        'Cria um novo objeto copiando os campos de original e sobrescrevendo idade',
        'Deleta o campo idade do original',
        'Cria uma referência ao mesmo objeto',
      ],
      correctIndex: 1,
      explanation:
        'O spread espalha todas as propriedades de `original` no novo objeto, e o campo `idade` escrito depois sobrescreve o valor copiado — sem mutar o original.',
    },
    {
      type: 'truefalse',
      id: 'm3-e4',
      prompt: 'Arrow functions criam seu próprio valor de `this`, assim como funções tradicionais.',
      answer: false,
      explanation:
        'Arrow functions não têm `this` próprio — elas herdam o `this` do escopo onde foram definidas. Isso é o que as torna seguras dentro de callbacks e métodos de objeto modernos.',
    },
    {
      type: 'order',
      id: 'm3-e5',
      prompt: 'Ordene os passos para buscar dados de uma API e exibir na tela, do primeiro ao último.',
      steps: [
        'Chamar fetch() com a URL da API',
        'Aguardar (await) a resposta chegar',
        'Converter a resposta para JSON com .json()',
        'Atualizar o DOM ou estado com os dados recebidos',
      ],
      explanation:
        'Esse é o fluxo padrão de qualquer chamada de API no frontend: requisitar, esperar, converter o formato, e então renderizar.',
    },
  ],
  games: [
    {
      gameId: 'js-console-detective',
      label: 'Detetive do Console',
      description: 'Preveja a saída exata de trechos de JavaScript antes de rodar — treina entendimento profundo da linguagem.',
    },
    {
      gameId: 'tic-tac-toe-build',
      label: 'Construtor de Jogo da Velha',
      description: 'Monte a lógica de um jogo da velha arrastando blocos de lógica na ordem certa.',
    },
  ],
};
