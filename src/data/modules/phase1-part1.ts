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
        'Dados precisam de um lugar para morar. As estruturas mudam **como** você acessa e organiza a informação:\n\n- **Array/Lista**: uma fileira numerada de itens. Acesso direto por posição (índice).\n- **Pilha (stack)**: o último que entra é o primeiro que sai — como uma pilha de pratos. Usada em "desfazer" (Ctrl+Z) e em chamadas de função.\n- **Fila (queue)**: o primeiro que entra é o primeiro que sai — como fila de banco. Usada em processamento de tarefas em ordem.\n- **Árvore**: cada item pode ter "filhos" — usada para representar hierarquias, como pastas de arquivos ou o DOM de uma página web.\n\nVocê vai encontrar essas quatro estruturas em praticamente todo sistema que construir daqui pra frente. Experimente a simulação abaixo para sentir a diferença entre pilha e fila na prática.',
      diagramId: 'stack-queue',
    },
    {
      id: 'l5',
      heading: 'Ordenação e busca: os primeiros algoritmos clássicos',
      body:
        '**Bubble sort** compara pares vizinhos e troca se estiverem na ordem errada, repetindo até tudo estar ordenado. É lento (O(n²)) mas é o jeito mais intuitivo de entender ordenação.\n\n**Merge sort** divide a lista pela metade recursivamente até sobrar 1 elemento, depois junta as partes já ordenadas. É muito mais rápido (O(n log n)) e é a base de algoritmos usados em produção.\n\n**Busca binária** só funciona em listas já ordenadas: você compara o item do meio, e se não for o que procura, descarta a metade errada e repete. Por isso ela acha um item em uma lista de 1 milhão de elementos em só ~20 comparações. Veja o passo a passo animado abaixo.',
      diagramId: 'binary-search',
    },
    {
      id: 'l6',
      heading: 'Recursão: uma função que chama a si mesma',
      body:
        'Recursão é quando uma função resolve um problema chamando uma versão menor de si mesma, até chegar a um caso tão simples que pode ser resolvido direto — o **caso base**. Sem caso base, a função chama a si mesma para sempre e o programa quebra (stack overflow).\n\nO exemplo clássico é o fatorial: `fatorial(5) = 5 × fatorial(4)`, e `fatorial(4) = 4 × fatorial(3)`, até chegar em `fatorial(1) = 1` (o caso base, que não chama mais nada).\n\nRecursão não é "mais avançada" que loops — é só outra forma de expressar repetição, mais natural para problemas que já são definidos em termos de si mesmos, como percorrer uma árvore de pastas ou o próprio merge sort que você acabou de ver. Veja abaixo como a pilha de chamadas cresce até o caso base, e depois desempilha calculando o resultado.',
      codeExample: {
        lang: 'pseudocódigo',
        code: 'funcao fatorial(n)\n    se n <= 1\n        retornar 1        // caso base\n    senao\n        retornar n * fatorial(n - 1)',
      },
      diagramId: 'recursion-stack',
    },
    {
      id: 'l7',
      heading: 'Complexidade: por que "funciona" não é a única pergunta',
      body:
        'Dois algoritmos podem dar a resposta certa, mas um pode ser inutilizável em escala. **Notação Big O** descreve como o tempo (ou memória) que um algoritmo gasta cresce conforme a entrada cresce — não o tempo exato em segundos, mas a **tendência**.\n\n- `O(1)`: tempo constante, não importa o tamanho da entrada (acessar um item de array pelo índice)\n- `O(log n)`: cresce bem devagar (busca binária)\n- `O(n)`: cresce proporcional ao tamanho (percorrer uma lista uma vez)\n- `O(n²)`: cresce muito rápido (bubble sort, loops aninhados sobre os mesmos dados)\n\nNa prática: um algoritmo O(n²) que roda em 1 segundo com 1.000 itens pode levar quase **3 horas** com 1.000.000 de itens. Entender isso é o que separa "funciona no meu teste" de "funciona em produção". Arraste o slider abaixo e veja a diferença crescer.',
      diagramId: 'big-o',
    },
    {
      id: 'l8',
      heading: 'Tabelas hash: a estrutura mais usada que você nunca viu',
      body:
        'Uma tabela hash (hash table, ou "mapa") guarda pares chave-valor e permite buscar, inserir e remover em tempo **O(1)** na média — independente de quantos itens existem. Isso parece quase mágico, mas o segredo é uma **função de hash**: ela transforma a chave (ex: uma string) num número, que indica diretamente em qual posição interna do array aquele valor está guardado.\n\nObjetos `{}` e `Map` em JavaScript, `dict` em Python, e `HashMap` em Java são todos implementações de tabela hash. É a estrutura por trás de quase todo "cache", "índice" ou "dicionário" que você vai usar na carreira.\n\nO trade-off: tabelas hash não mantêm ordem (a menos que a implementação garanta isso explicitamente, como `Map` do JS) e podem ter colisões — duas chaves diferentes gerando o mesmo hash, resolvidas internamente sem você precisar pensar nisso na maioria dos casos.',
      codeExample: {
        lang: 'javascript',
        code: 'const idades = new Map();\nidades.set("Ana", 28);\nidades.set("Bruno", 34);\n\nidades.get("Ana"); // 28 — busca O(1), não importa quantos itens existem',
      },
    },
    {
      id: 'l9',
      heading: 'Recursão vs iteração: quando escolher cada uma',
      body:
        'Todo problema resolvível com recursão também é resolvível com um loop, e vice-versa — a escolha é sobre clareza e custo, não sobre capacidade.\n\nRecursão tende a ser mais legível quando o problema já é naturalmente recursivo (percorrer uma árvore, estruturas aninhadas) — o código fica mais próximo da definição matemática do problema. Iteração tende a ser mais eficiente em memória, porque não acumula uma pilha de chamadas: cada chamada recursiva consome memória até retornar, e problemas muito profundos podem esgotar a pilha (stack overflow) antes mesmo de serem matematicamente complexos.\n\nRegra prática: comece pela versão que for mais fácil de entender e provar correta — geralmente a recursiva, para problemas recursivos por natureza. Otimize para iteração depois, só se a profundidade da recursão for um risco real (milhares de chamadas).',
    },
    {
      id: 'l10',
      heading: '[Nível sênior] Complexidade amortizada e o trade-off espaço-tempo',
      body:
        'Big O "simples" mede o pior caso de uma única operação, mas isso pode enganar. O exemplo clássico: adicionar um item a um array dinâmico (`push`) é O(1) na maioria das vezes, mas ocasionalmente o array precisa duplicar de tamanho e copiar todo o conteúdo — uma operação O(n). Mesmo assim, dizemos que `push` é O(1) **amortizado**: somando o custo de todas as operações e dividindo pelo número de operações, a média converge para O(1), porque os "n" itens só são copiados a cada potência de 2 inserções, nunca a cada inserção.\n\nEm entrevistas sênior, isso costuma aparecer como "explique por que push num array dinâmico é considerado O(1) mesmo que ocasionalmente seja O(n)" — quem só memorizou a tabela de Big O sem entender o "amortizado" trava nessa pergunta.\n\nO segundo conceito que separa pleno de sênior: **trade-off espaço-tempo**. Quase toda otimização de tempo custa memória, e vice-versa. Um cache evita recalcular algo (ganha tempo), mas ocupa memória para guardar o resultado. Um índice de banco acelera leitura (tempo), mas ocupa espaço em disco e torna escritas mais lentas. A pergunta certa nunca é "qual é mais rápido", é "qual recurso é mais escasso no meu sistema agora — tempo de CPU ou memória/disco disponível".',
      codeExample: {
        lang: 'javascript',
        code: '// push é O(1) amortizado: a cópia O(n) só ocorre quando\n// a capacidade interna do array esgota (geralmente dobra de tamanho)\nconst lista = [];\nfor (let i = 0; i < 1000000; i++) {\n  lista.push(i); // rápido na maioria das vezes, raramente custoso\n}',
      },
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
    {
      type: 'mcq',
      id: 'm1-e6',
      prompt: 'O que acontece se uma função recursiva nunca atinge seu caso base?',
      options: [
        'Ela retorna undefined automaticamente',
        'Ela chama a si mesma infinitamente até travar (stack overflow)',
        'O JavaScript corrige isso automaticamente',
        'Ela funciona normalmente, só mais lenta',
      ],
      correctIndex: 1,
      explanation:
        'Sem um caso base alcançável, a recursão nunca para de empilhar chamadas, e a memória reservada para essas chamadas (a pilha de execução) eventualmente esgota.',
    },
    {
      type: 'order',
      id: 'm1-e7',
      prompt: 'Ordene as classes de complexidade da mais rápida (cresce menos) para a mais lenta, conforme a entrada cresce.',
      steps: ['O(1) — tempo constante', 'O(log n) — busca binária', 'O(n) — percorrer a lista uma vez', 'O(n²) — loops aninhados'],
      explanation:
        'Essa é a ordem clássica de crescimento: tempo constante não muda com o tamanho da entrada, enquanto O(n²) cresce drasticamente mais rápido que as outras conforme os dados aumentam.',
    },
    {
      type: 'code-fill',
      id: 'm1-e8',
      prompt: 'Complete o caso base da função recursiva de fatorial.',
      codeTemplate: 'funcao fatorial(n)\n    se n ___ 1\n        retornar 1\n    senao\n        retornar n * fatorial(n - 1)',
      answer: '<=',
      hint: 'Que comparação garante que a recursão para tanto para n=1 quanto para n=0?',
      explanation: 'Usar `<= 1` cobre tanto o caso n=1 quanto eventuais chamadas com n=0, evitando recursão infinita para entradas no limite.',
    },
    {
      type: 'mcq',
      id: 'm1-e9',
      prompt: 'Por que uma tabela hash consegue buscar um valor em O(1), independente do tamanho da coleção?',
      options: [
        'Porque ela guarda os dados em ordem alfabética',
        'Porque a função de hash calcula diretamente a posição onde o valor está, sem precisar percorrer os outros itens',
        'Porque ela usa busca binária internamente',
        'Na verdade, ela não é mais rápida que um array',
      ],
      correctIndex: 1,
      explanation: 'A função de hash transforma a chave num índice direto — não há necessidade de comparar com os outros itens, diferente de uma busca sequencial.',
    },
    {
      type: 'truefalse',
      id: 'm1-e10',
      prompt: 'Um problema resolvido com recursão nunca poderia ser resolvido com um loop.',
      answer: false,
      explanation: 'Todo problema recursivo tem uma versão iterativa equivalente — a escolha entre os dois é sobre clareza de código e custo de memória, não sobre capacidade de resolver o problema.',
    },
    {
      type: 'mcq',
      id: 'm1-e11',
      prompt: 'Qual é o principal risco de usar recursão em problemas com profundidade muito grande?',
      options: [
        'O código fica mais difícil de ler',
        'Stack overflow — a pilha de chamadas pode esgotar a memória disponível antes de chegar ao caso base',
        'Recursão sempre é mais lenta que loops',
        'Não existe esse risco',
      ],
      correctIndex: 1,
      explanation: 'Cada chamada recursiva ocupa espaço na pilha de execução até retornar — recursões muito profundas (milhares de níveis) podem esgotar essa memória, mesmo que o problema em si não seja complexo.',
    },
    {
      type: 'mcq',
      id: 'm1-e12',
      prompt: '[Nível sênior] Por que o método push() de um array dinâmico é considerado O(1) "amortizado", mesmo que ocasionalmente precise copiar todo o array (O(n))?',
      options: [
        'Porque a cópia nunca acontece de fato na prática',
        'Porque, somando o custo de todas as inserções e dividindo pelo número de operações, a média converge para O(1) — a cópia cara ocorre raramente, não em toda inserção',
        'Porque arrays dinâmicos não existem de verdade',
        'O(1) amortizado significa que a operação é sempre instantânea',
      ],
      correctIndex: 1,
      explanation: 'Complexidade amortizada mede o custo médio ao longo de uma sequência de operações, não o pior caso de uma única operação isolada — a cópia O(n) é rara o suficiente para não afetar a média.',
    },
    {
      type: 'truefalse',
      id: 'm1-e13',
      prompt: '[Nível sênior] Otimizar um algoritmo para usar menos tempo de CPU nunca tem custo de memória, e vice-versa.',
      answer: false,
      explanation: 'O trade-off espaço-tempo é quase universal: caches, índices de banco e tabelas de memoização todos trocam mais uso de memória por menos tempo de processamento — a pergunta certa é qual recurso é mais escasso no seu contexto.',
    },
  ],
  games: [
    {
      gameId: 'logic-maze',
      label: 'Labirinto Lógico',
      description: 'Monte uma sequência de comandos (sequência, decisão, repetição) para guiar um robô até o objetivo. 6 níveis, do fácil ao mestre.',
    },
    {
      gameId: 'sort-visualizer',
      label: 'Corrida da Ordenação',
      description: 'Veja bubble sort e merge sort competindo em tempo real e entenda visualmente por que um é mais rápido.',
    },
    {
      gameId: 'memory-concepts',
      label: 'Memória de Conceitos',
      description: 'Jogo da memória com termos e definições de estruturas de dados, APIs e infraestrutura.',
    },
  ],
  scenarios: [
    {
      id: 'mes01-cen1',
      context: 'trabalho',
      title: 'O sistema "trava" com muitos dados',
      emoji: '🐢',
      situation:
        'Um colega avisa que a tela de relatórios, que sempre foi rápida nos testes, está demorando mais de 30 segundos para carregar agora que a empresa tem 200 mil clientes cadastrados.',
      whatHappens:
        'O código usa dois loops aninhados para comparar cada cliente com todos os outros — um algoritmo O(n²). Com 100 clientes isso é invisível (10 mil operações). Com 200 mil clientes, são 40 bilhões de operações.',
      howToSolve:
        'Antes de otimizar "no escuro", meça onde o tempo está indo (profiling). Depois, troque a estrutura: em vez de comparar todo mundo com todo mundo, usar um índice (como um objeto/Map para busca O(1)) costuma resolver boa parte desses casos, transformando O(n²) em O(n).',
    },
    {
      id: 'mes01-cen2',
      context: 'pessoal',
      title: 'Organizando as tarefas da semana',
      emoji: '📋',
      situation:
        'Você quer decidir em que ordem fazer 5 tarefas de casa, algumas dependendo de outras terem sido feitas antes (ex: "lavar roupa" antes de "passar roupa").',
      whatHappens:
        'Isso é exatamente o problema que listas e filas resolvem na programação: você tem itens com uma ordem de dependência, e precisa decidir uma sequência válida — o mesmo princípio usado para ordenar etapas de deploy ou tarefas de um pipeline.',
      howToSolve:
        'Liste as dependências de cada tarefa (o que precisa estar pronto antes). Tarefas sem dependência pendente entram primeiro na fila. Conforme cada uma é concluída, libera as que dependiam dela — isso, formalizado em código, se chama ordenação topológica.',
    },
    {
      id: 'mes01-cen3',
      context: 'trabalho',
      title: 'Loop infinito derruba o servidor',
      emoji: '🔥',
      situation:
        'Em produção, o servidor para de responder de repente e o uso de CPU vai a 100%. Os logs simplesmente paravam de aparecer no meio de uma função.',
      whatHappens:
        'Uma condição de parada do `while` dependia de uma variável que, por um caminho específico do código, nunca era atualizada — o loop roda para sempre, consumindo CPU e travando o processo.',
      howToSolve:
        'Sempre garanta que toda condição de saída de um loop seja alcançável em qualquer caminho possível do código, não só no caminho "feliz". Em produção, limites de tempo (timeouts) e monitoramento de CPU são a rede de segurança que avisa antes que isso derrube o sistema inteiro.',
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
      heading: 'O Box Model: a régua invisível de todo elemento',
      body:
        'Todo elemento HTML é, para o CSS, uma caixa retangular composta por quatro camadas, de dentro para fora: **conteúdo** (o texto/imagem em si), **padding** (espaço interno, entre o conteúdo e a borda), **border** (a borda visível) e **margin** (espaço externo, que empurra outros elementos para longe).\n\nUm erro clássico de quem está aprendendo: aumentar o `padding` de um elemento com largura fixa e ele "estourar" o layout — isso acontece porque, por padrão, `width` define só a largura do **conteúdo**, e padding/border se somam a ela. `box-sizing: border-box` resolve isso fazendo `width` incluir padding e border, o que é o comportamento que a maioria dos projetos modernos usa por padrão.',
      codeExample: {
        lang: 'css',
        code: '* {\n  box-sizing: border-box; /* padding e border não estouram a largura */\n}\n\n.card {\n  width: 200px;\n  padding: 16px;\n  border: 4px solid #f2a93b;\n  margin: 16px;\n}',
      },
      diagramId: 'box-model',
    },
    {
      id: 'l4',
      heading: 'Flexbox: alinhar em uma direção',
      body:
        'Flexbox resolve "como alinho estes itens numa linha ou coluna". O container vira `display: flex`, e os filhos se organizam ao longo de um eixo principal.\n\n`justify-content` controla o eixo principal (geralmente horizontal). `align-items` controla o eixo transversal (geralmente vertical). `gap` cria espaçamento entre os itens sem precisar de margin manual.\n\nUse flexbox para: barras de navegação, cards em linha, qualquer alinhamento "1D".',
      codeExample: {
        lang: 'css',
        code: '.nav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n}',
      },
    },
    {
      id: 'l5',
      heading: 'CSS Grid: alinhar em duas direções',
      body:
        'Grid resolve "como organizo isso em linhas E colunas ao mesmo tempo". Você define `grid-template-columns` para descrever quantas colunas existem e quanto espaço cada uma ocupa.\n\n`repeat(auto-fit, minmax(200px, 1fr))` é um padrão extremamente útil: cria quantas colunas de no mínimo 200px couberem, e distribui o espaço restante igualmente — isso sozinho resolve grande parte dos layouts responsivos sem media query. Experimente os controles abaixo.',
      codeExample: {
        lang: 'css',
        code: '.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 20px;\n}',
      },
      diagramId: 'css-grid',
    },
    {
      id: 'l6',
      heading: 'Mobile-first: comece pequeno, expanda depois',
      body:
        'Mobile-first significa escrever o CSS base pensando na tela pequena, e usar `@media (min-width: ...)` para adicionar regras conforme a tela cresce — nunca o contrário. Isso evita uma cascata de overrides confusos e reflete a realidade: a maioria do tráfego web hoje é mobile.\n\n```css\n.card { padding: 12px; }\n\n@media (min-width: 768px) {\n  .card { padding: 24px; }\n}\n```\n\nDesign system básico significa definir, antes de estilizar qualquer coisa: sua paleta de cores, escala de espaçamento (4px, 8px, 16px, 24px...) e escala tipográfica. Isso evita estilizar "no olho" cada componente.',
    },
    {
      id: 'l7',
      heading: 'Variáveis CSS: design system de verdade, sem pré-processador',
      body:
        'Variáveis CSS nativas (`--cor-primaria: #2b6cb0`) permitem definir um valor uma vez e reutilizá-lo em toda a folha de estilo com `var(--cor-primaria)`. A grande vantagem sobre simplesmente repetir o valor: mudar a variável em um lugar atualiza tudo que a usa — essencial para temas (claro/escuro) e manutenção em projetos grandes.\n\nVariáveis definidas em `:root` ficam disponíveis globalmente. Você também pode redefinir a mesma variável dentro de um seletor específico para criar variações locais.',
      codeExample: {
        lang: 'css',
        code: ':root {\n  --cor-primaria: #2b6cb0;\n  --espaco-md: 16px;\n}\n\n.botao {\n  background: var(--cor-primaria);\n  padding: var(--espaco-md);\n}',
      },
    },
    {
      id: 'l8',
      heading: 'Transições e animações: movimento com propósito',
      body:
        '`transition` anima a mudança de uma propriedade entre dois estados (ex: cor ao passar o mouse), de forma simples: você diz qual propriedade, duração e curva de aceleração. `@keyframes` + `animation` dá controle total sobre uma sequência de estados ao longo do tempo, útil para algo mais elaborado que um simples hover.\n\nRegra de bom gosto: anime `transform` e `opacity` sempre que possível — o navegador consegue acelerar essas duas por hardware, enquanto animar `width`, `height` ou `margin` força o navegador a recalcular o layout inteiro a cada frame, podendo travar em dispositivos mais fracos.',
      codeExample: {
        lang: 'css',
        code: '.botao {\n  transition: transform 0.2s ease, background 0.2s ease;\n}\n.botao:hover {\n  transform: translateY(-2px);\n}',
      },
    },
    {
      id: 'l9',
      heading: 'Pseudo-classes e pseudo-elementos: estilizar sem precisar de classes extras',
      body:
        'Pseudo-classes selecionam elementos baseado num **estado** (`:hover`, `:focus`, `:disabled`, `:first-child`, `:nth-child(2)`), sem precisar adicionar nenhuma classe via JavaScript. Pseudo-elementos (`::before`, `::after`) criam conteúdo visual extra ligado a um elemento existente, sem precisar de uma tag HTML adicional no DOM — muito usados para ícones decorativos, aspas estilizadas, ou tooltips simples.\n\nA diferença na sintaxe (`:` único vs `::` duplo) existe formalmente desde o CSS3, mas a maioria dos navegadores aceita `:before`/`:after` por compatibilidade — ainda assim, `::before`/`::after` é o padrão recomendado hoje.',
      codeExample: {
        lang: 'css',
        code: '.card:nth-child(odd) {\n  background: #1a1a1a;\n}\n\n.tooltip::after {\n  content: "Clique para copiar";\n  position: absolute;\n}',
      },
    },
    {
      id: 'l10',
      heading: 'ARIA: acessibilidade quando o HTML semântico não é suficiente',
      body:
        'Tags semânticas resolvem a maioria dos casos, mas componentes de interface mais complexos (um menu dropdown customizado, um carrossel, abas) precisam de atributos ARIA (Accessible Rich Internet Applications) para comunicar seu estado a leitores de tela.\n\n`aria-expanded="true/false"` informa se um menu está aberto. `aria-label` dá um nome acessível a um elemento sem texto visível (como um botão só com ícone). `role="alert"` avisa o leitor de tela imediatamente sobre uma mensagem importante, como um erro de formulário.\n\nRegra de ouro: ARIA complementa HTML semântico, nunca substitui — sempre prefira a tag HTML nativa correta (`<button>` em vez de `<div role="button">`) quando ela existir, porque tags nativas já vêm com comportamento de teclado e foco corretos de fábrica.',
      codeExample: {
        lang: 'html',
        code: '<button aria-expanded="false" aria-controls="menu-id">\n  Menu ☰\n</button>\n<ul id="menu-id" hidden>...</ul>',
      },
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
    {
      type: 'code-fill',
      id: 'm2-e6',
      prompt: 'Complete a sintaxe para usar uma variável CSS chamada --cor-primaria.',
      codeTemplate: '.botao {\n  background: ___(--cor-primaria);\n}',
      answer: 'var',
      hint: 'A função que lê o valor de uma variável CSS customizada.',
      explanation: '`var(--nome-da-variavel)` lê o valor armazenado naquela variável CSS, permitindo reutilização e atualização centralizada.',
    },
    {
      type: 'mcq',
      id: 'm2-e7',
      prompt: 'Por que é recomendado animar `transform` e `opacity` em vez de `width` ou `margin`?',
      options: [
        'Não há diferença real de performance',
        'transform e opacity podem ser acelerados pelo hardware gráfico, sem recalcular o layout inteiro',
        'width e margin não podem ser animados',
        'opacity sempre deixa elementos invisíveis',
      ],
      correctIndex: 1,
      explanation:
        'Animar propriedades de layout (width, height, margin) força o navegador a recalcular posições de toda a página a cada frame, o que é custoso. transform e opacity evitam esse recálculo.',
    },
    {
      type: 'truefalse',
      id: 'm2-e8',
      prompt: 'Uma variável CSS definida dentro de um seletor específico só se aplica dentro daquele seletor e seus descendentes.',
      answer: true,
      explanation:
        'Variáveis CSS seguem a cascata normal: redefinir uma variável dentro de um seletor cria uma versão local que sobrescreve a global apenas para aquele escopo.',
    },
    {
      type: 'mcq',
      id: 'm2-e9',
      prompt: 'Qual seletor aplica um estilo apenas ao segundo item de uma lista?',
      options: [':first-child', ':nth-child(2)', ':last-child', ':only-child'],
      correctIndex: 1,
      explanation: '`:nth-child(2)` seleciona especificamente o segundo elemento entre os filhos do seu pai — `:first-child` seria o primeiro.',
    },
    {
      type: 'mcq',
      id: 'm2-e10',
      prompt: 'Você tem um botão só com um ícone de lixeira, sem texto visível. Como torná-lo acessível para leitores de tela?',
      options: [
        'Não é possível tornar acessível',
        'Adicionando aria-label="Excluir item" ao botão',
        'Aumentando o tamanho do ícone',
        'Trocando a cor do ícone',
      ],
      correctIndex: 1,
      explanation: '`aria-label` fornece um nome acessível ao elemento, que o leitor de tela anuncia, mesmo sem texto visível na tela.',
    },
    {
      type: 'truefalse',
      id: 'm2-e11',
      prompt: 'ARIA deveria substituir tags semânticas nativas como <button>, usando <div role="button"> no lugar.',
      answer: false,
      explanation: 'A regra geral é o oposto: prefira sempre a tag nativa correta quando ela existir, porque já vem com comportamento de teclado e foco corretos — ARIA é para os casos que o HTML semântico não cobre.',
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
  scenarios: [
    {
      id: 'mes02-cen1',
      context: 'trabalho',
      title: 'O layout quebra "só no celular do cliente"',
      emoji: '📱',
      situation:
        'O site fica perfeito no seu notebook, mas o cliente manda um print do celular dele mostrando os botões cortados e o texto saindo da tela.',
      whatHappens:
        'O CSS foi escrito pensando primeiro na tela grande, com larguras fixas em pixels (`width: 800px`) que não cabem numa tela de 375px. Sem testar em telas pequenas durante o desenvolvimento, esses problemas só aparecem depois.',
      howToSolve:
        'Use o DevTools do navegador (F12 → ícone de celular) para testar em vários tamanhos de tela enquanto desenvolve, não só no final. Prefira unidades relativas (`%`, `rem`, `minmax()`) a pixels fixos, e adote mobile-first como hábito, não como correção posterior.',
    },
    {
      id: 'mes02-cen2',
      context: 'pessoal',
      title: 'Organizando o orçamento doméstico numa tabela',
      emoji: '💰',
      situation:
        'Você quer montar uma página simples para acompanhar gastos do mês, com categorias alinhadas em colunas e linhas, sem usar planilha.',
      whatHappens:
        'Esse é exatamente o problema que Grid resolve — organizar conteúdo em linhas E colunas ao mesmo tempo, como uma tabela, mas com controle total de espaçamento e responsividade que uma tabela HTML tradicional não dá tão facilmente.',
      howToSolve:
        '`display: grid` com `grid-template-columns: repeat(auto-fit, minmax(120px, 1fr))` cria colunas que se ajustam automaticamente ao tamanho da tela — no celular vira 1-2 colunas, no monitor vira 4-5, sem escrever uma media query para cada caso.',
    },
    {
      id: 'mes02-cen3',
      context: 'trabalho',
      title: 'Reclamação de acessibilidade chega ao time',
      emoji: '♿',
      situation:
        'Um usuário que usa leitor de tela abre um chamado dizendo que não consegue preencher o formulário de cadastro — ele não sabe o que cada campo pede.',
      whatHappens:
        'Os campos `<input>` foram estilizados visualmente com um texto ao lado (que parece um label), mas sem a tag `<label>` de verdade associada via `for`/`id`. Leitores de tela não têm como adivinhar essa associação visual.',
      howToSolve:
        'Toda entrada de formulário precisa de um `<label>` real associado, não só um texto próximo visualmente. É uma correção rápida que evita excluir uma parte real dos usuários — e em muitos países é também uma exigência legal para serviços públicos e empresas grandes.',
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
        'Buscar dados de um servidor leva tempo — o JavaScript não pode simplesmente "esperar parado", porque isso travaria a página inteira. Uma **Promise** representa "um valor que vai existir no futuro": ela pode estar pendente, cumprida ou rejeitada.\n\n`async/await` é açúcar sintático sobre Promises que faz o código assíncrono **parecer** síncrono, sem o encadeamento confuso de `.then().then().then()`. Hoje é o padrão da indústria. A simulação abaixo mostra a ordem real de execução — repare que Promises sempre rodam antes de setTimeout, mesmo com delay 0.',
      codeExample: {
        lang: 'javascript',
        code: 'async function buscarUsuario(id) {\n  try {\n    const resposta = await fetch(`/api/usuarios/${id}`);\n    const dados = await resposta.json();\n    return dados;\n  } catch (erro) {\n    console.error("Falhou:", erro);\n  }\n}',
      },
      diagramId: 'event-loop',
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
    {
      id: 'l5',
      heading: 'Higher-order functions: funções que recebem ou retornam outras funções',
      body:
        'Uma higher-order function é qualquer função que recebe outra função como parâmetro, retorna uma função, ou ambos. `map`, `filter` e `reduce` são os três exemplos mais usados no dia a dia: `map` transforma cada item de um array, `filter` mantém só os itens que passam um teste, e `reduce` combina todos os itens em um único valor.\n\nEsse estilo (programação funcional) tende a gerar código mais curto e com menos bugs do que escrever o mesmo loop manualmente, porque a intenção fica explícita no nome do método.',
      codeExample: {
        lang: 'javascript',
        code: 'const precos = [10, 25, 8, 40];\n\nconst comDesconto = precos.map(p => p * 0.9);\nconst caros = precos.filter(p => p > 15);\nconst total = precos.reduce((soma, p) => soma + p, 0);',
      },
    },
    {
      id: 'l6',
      heading: 'Closures: funções que "lembram" de onde nasceram',
      body:
        'Uma closure acontece quando uma função interna continua tendo acesso às variáveis da função externa, mesmo depois que a função externa já terminou de executar. Isso parece abstrato, mas é a base de padrões extremamente comuns: contadores privados, debounce/throttle, e até como hooks do React guardam estado entre renderizações.\n\nNo exemplo abaixo, cada chamada de `criarContador()` cria uma variável `contagem` independente, e a função retornada "lembra" da sua própria cópia dessa variável para sempre. Crie alguns contadores abaixo e veja que cada um tem sua própria memória, isolada dos outros.',
      codeExample: {
        lang: 'javascript',
        code: 'function criarContador() {\n  let contagem = 0;\n  return function () {\n    contagem++;\n    return contagem;\n  };\n}\n\nconst contador1 = criarContador();\ncontador1(); // 1\ncontador1(); // 2',
      },
      diagramId: 'closure',
    },
    {
      id: 'l7',
      heading: 'Módulos ES6: organizando código em arquivos separados',
      body:
        'Antes dos módulos nativos, dividir JavaScript em vários arquivos exigia gambiarras (variáveis globais, ordem de scripts cuidadosamente planejada). `import`/`export` resolvem isso de forma nativa: cada arquivo controla explicitamente o que expõe para fora (`export`) e o que usa de outros arquivos (`import`).\n\n`export default` marca o "principal" export de um módulo (geralmente um por arquivo); `export` nomeado permite exportar várias coisas do mesmo arquivo. Essa é a base de como qualquer projeto React, Node ou TypeScript moderno organiza dezenas (ou centenas) de arquivos sem virar um caos de dependências.',
      codeExample: {
        lang: 'javascript',
        code: '// utils.js\nexport function formatarData(data) { /* ... */ }\nexport const TAMANHO_PAGINA = 20;\n\n// app.js\nimport { formatarData, TAMANHO_PAGINA } from "./utils.js";',
      },
    },
    {
      id: 'l8',
      heading: 'Destructuring avançado: extraindo o que importa, ignorando o resto',
      body:
        'Destructuring vai além de extrair campos simples — você pode renomear variáveis durante a extração (`const { nome: nomeCompleto } = usuario`), extrair de objetos aninhados em um único passo, e usar o operador rest (`...resto`) para capturar "tudo que sobrou" num objeto ou array separado.\n\nEm parâmetros de função, destructuring é extremamente comum para simular "argumentos nomeados" — uma função que recebe um objeto de opções fica muito mais legível no ponto de chamada do que uma lista longa de parâmetros posicionais.',
      codeExample: {
        lang: 'javascript',
        code: 'function criarUsuario({ nome, idade, ativo = true }) {\n  return { nome, idade, ativo };\n}\n\nconst { primeiro, ...resto } = [10, 20, 30, 40];\n// primeiro = 10, resto = [20, 30, 40]',
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
    {
      type: 'mcq',
      id: 'm3-e6',
      prompt: 'Qual método de array você usaria para transformar `[1, 2, 3]` em `[2, 4, 6]`?',
      code: '[1, 2, 3] → [2, 4, 6]',
      options: ['filter', 'map', 'reduce', 'forEach'],
      correctIndex: 1,
      explanation: '`map` cria um novo array aplicando uma transformação a cada elemento — exatamente o caso de multiplicar cada item por 2.',
    },
    {
      type: 'truefalse',
      id: 'm3-e7',
      prompt: 'Uma closure perde acesso às variáveis da função externa depois que essa função externa termina de executar.',
      answer: false,
      explanation:
        'É exatamente o contrário: a característica central de uma closure é que a função interna continua tendo acesso a essas variáveis mesmo depois que a função externa já retornou.',
    },
    {
      type: 'code-fill',
      id: 'm3-e8',
      prompt: 'Complete o uso de reduce para somar todos os números de um array.',
      codeTemplate: 'const total = numeros.___((soma, n) => soma + n, 0);',
      answer: 'reduce',
      hint: 'O método de array que combina todos os elementos em um único valor acumulado.',
      explanation: '`reduce` percorre o array acumulando um resultado — aqui, somando cada número ao total acumulado, começando de 0.',
    },
    {
      type: 'mcq',
      id: 'm3-e9',
      prompt: 'Qual a diferença entre `export default` e `export` nomeado num módulo ES6?',
      options: [
        'Não há diferença prática',
        'export default marca um export principal (geralmente um por arquivo); export nomeado permite exportar várias coisas do mesmo arquivo',
        'export default só funciona em Node.js',
        'export nomeado é mais rápido em runtime',
      ],
      correctIndex: 1,
      explanation: 'Um arquivo pode ter no máximo um `export default`, mas vários exports nomeados — a escolha depende de quantas coisas distintas aquele módulo precisa expor.',
    },
    {
      type: 'code-fill',
      id: 'm3-e10',
      prompt: 'Complete o destructuring que captura o primeiro item e o resto do array numa variável separada.',
      codeTemplate: 'const [primeiro, ___resto] = [10, 20, 30, 40];',
      answer: '...',
      hint: 'O operador que "espalha" ou "agrupa o restante" — o mesmo símbolo usado no spread, mas aqui em contexto de captura.',
      explanation: 'O operador rest (`...resto`) captura todos os elementos restantes do array num novo array, depois que os elementos anteriores já foram extraídos individualmente.',
    },
    {
      type: 'truefalse',
      id: 'm3-e11',
      prompt: 'Em destructuring de parâmetros de função, é possível definir um valor padrão para uma propriedade que não foi fornecida.',
      answer: true,
      explanation: 'Sintaxe como `{ ativo = true }` no destructuring define um valor padrão usado automaticamente quando essa propriedade não está presente no objeto recebido.',
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
    {
      gameId: 'bug-hunter',
      label: 'Caça-Bug',
      description: 'Encontre a linha com erro em trechos reais de JavaScript — 7 desafios, do fácil ao difícil.',
    },
  ],
  scenarios: [
    {
      id: 'mes03-cen1',
      context: 'trabalho',
      title: 'O botão de salvar "não faz nada" às vezes',
      emoji: '🖱️',
      situation:
        'Um usuário relata que, de vez em quando, clica em "Salvar" e nada acontece — sem erro visível, sem confirmação, só silêncio.',
      whatHappens:
        'O código faz uma chamada `fetch` sem `await` e sem `.catch()`. Quando a API demora ou falha, a Promise é rejeitada silenciosamente, e como ninguém está "escutando" esse erro, ele desaparece no console sem afetar a interface.',
      howToSolve:
        'Toda Promise precisa de um destino para o caso de erro — `try/catch` com `await`, ou `.catch()` no encadeamento. Além disso, é boa prática dar feedback visual imediato ("Salvando...") para o usuário nunca ficar sem saber se algo está acontecendo.',
    },
    {
      id: 'mes03-cen2',
      context: 'pessoal',
      title: 'Organizando uma lista de compras que repete itens',
      emoji: '🛒',
      situation:
        'Você anotou itens de compras em vários momentos do dia e quer uma lista final sem duplicatas, com tudo somado (ex: "2 leites" + "1 leite" = "3 leites").',
      whatHappens:
        'Esse é um problema clássico de agregação de dados — o mesmo padrão usado para somar vendas por produto ou contar visitas por página em um sistema real.',
      howToSolve:
        'Um objeto (ou `Map`) usando o nome do item como chave resolve isso elegantemente: para cada item novo, você soma à quantidade já existente naquela chave (ou cria com quantidade 1, se for a primeira vez). Isso é o mesmo princípio do `reduce` que você aprendeu nesse módulo.',
    },
    {
      id: 'mes03-cen3',
      context: 'trabalho',
      title: 'Página fica lenta ao digitar no campo de busca',
      emoji: '⌨️',
      situation:
        'Um campo de busca que filtra uma lista em tempo real está fazendo o navegador travar a cada letra digitada, especialmente em listas grandes.',
      whatHappens:
        'Uma função cara (que faz uma chamada de API ou um cálculo pesado) está sendo executada a cada tecla pressionada — se você digita "notebook" são 8 chamadas, uma para cada letra, a maioria descartada antes mesmo de terminar.',
      howToSolve:
        '"Debounce" é a técnica padrão: espera um pequeno intervalo (ex: 300ms) sem novas teclas antes de disparar a busca de verdade. Isso reduz drasticamente o número de chamadas, sem prejudicar a experiência percebida pelo usuário.',
    },
  ],
};
