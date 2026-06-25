import type { Module } from '../types';

export const mes07: Module = {
  id: 'mes-07',
  month: 7,
  phase: 2,
  track: 'frontend',
  title: 'React + TypeScript',
  emoji: '⚛️',
  tagline: 'Componentes, estado, e tipos que pegam erros antes do navegador.',
  intro:
    'React mudou como o mundo constrói interfaces: em vez de manipular o DOM manualmente, você descreve **como a UI deveria parecer** dado um estado, e o React cuida de atualizar a tela. TypeScript adiciona uma camada de segurança: erros de tipo aparecem no seu editor, não na produção.',
  lessons: [
    {
      id: 'l1',
      heading: 'Componentes: a unidade fundamental do React',
      body:
        'Um componente é uma função que recebe dados (`props`) e retorna JSX — uma sintaxe que parece HTML mas é, na verdade, JavaScript. A grande virada de chave mental: você não diz "mude esse texto na tela", você diz "esse componente renderiza isso quando o estado é X" — e o React recalcula a UI sempre que o estado muda.',
      codeExample: {
        lang: 'tsx',
        code: 'function Saudacao({ nome }: { nome: string }) {\n  return <h1>Olá, {nome}!</h1>;\n}',
      },
    },
    {
      id: 'l2',
      heading: 'useState e useEffect: os dois hooks que você usa todo dia',
      body:
        '`useState` dá a um componente "memória" entre renderizações — um valor que, quando muda via sua função `set`, faz o React re-renderizar o componente. `useEffect` executa código em resposta a algo mudar (ou só uma vez, ao montar o componente) — é onde você busca dados de uma API, por exemplo.\n\nO erro mais comum de quem está aprendendo é esquecer o **array de dependências** do `useEffect`, causando loops infinitos ou efeitos que nunca disparam. Clique no botão abaixo e observe a ordem real: primeiro o re-render, só depois o efeito.',
      codeExample: {
        lang: 'tsx',
        code: 'function Lista() {\n  const [itens, setItens] = useState<string[]>([]);\n\n  useEffect(() => {\n    fetch("/api/itens")\n      .then(r => r.json())\n      .then(setItens);\n  }, []); // [] = roda só na montagem\n\n  return <ul>{itens.map(i => <li key={i}>{i}</li>)}</ul>;\n}',
      },
      diagramId: 'react-lifecycle',
    },
    {
      id: 'l3',
      heading: 'TypeScript: interfaces, generics e o porquê de "any" ser uma armadilha',
      body:
        'Uma `interface` descreve a forma de um objeto: quais campos existem e de que tipo. Isso transforma erros que só apareceriam em tempo de execução em erros visíveis enquanto você digita.\n\n`any` desliga a verificação de tipos completamente — usar `any` em excesso anula o propósito de usar TypeScript. Prefira tipar de verdade, ou no mínimo `unknown` quando o tipo realmente for desconhecido.\n\n**Generics** permitem escrever código reutilizável que funciona com vários tipos sem perder segurança: `function primeiro<T>(lista: T[]): T { return lista[0]; }` funciona para array de strings, números, ou qualquer tipo, mantendo o tipo correto no retorno.',
      codeExample: {
        lang: 'typescript',
        code: 'interface Usuario {\n  id: number;\n  nome: string;\n  email: string;\n}\n\nfunction primeiro<T>(lista: T[]): T {\n  return lista[0];\n}',
      },
    },
    {
      id: 'l4',
      heading: 'Context API: compartilhando estado sem prop drilling',
      body:
        'Quando muitos componentes em níveis diferentes da árvore precisam do mesmo dado (tema, usuário logado), passar via props por cada nível ("prop drilling") fica insustentável. Context cria um "túnel" que qualquer componente filho pode acessar direto, sem precisar que cada nível intermediário repasse a prop manualmente.',
    },
    {
      id: 'l5',
      heading: 'useMemo e useCallback: evitando trabalho repetido sem virar reflexo',
      body:
        '`useMemo` memoriza o **resultado** de um cálculo caro, recalculando só quando suas dependências mudam — útil para filtrar/ordenar listas grandes a cada render. `useCallback` memoriza a **referência** de uma função, evitando que ela seja recriada (e, por consequência, force re-renders desnecessários em componentes filhos que a recebem como prop).\n\nO erro mais comum não é esquecer de usá-los, é usá-los em todo lugar "por precaução": ambos têm um custo próprio, e otimizar prematuramente código que não tem problema de performance real só adiciona complexidade sem benefício. Meça antes de otimizar.',
      codeExample: {
        lang: 'tsx',
        code: 'const itensFiltrados = useMemo(\n  () => itens.filter(i => i.ativo),\n  [itens]\n);\n\nconst aoClicar = useCallback(() => {\n  enviar(itemId);\n}, [itemId]);',
      },
    },
    {
      id: 'l6',
      heading: 'Custom hooks: extraindo lógica reutilizável',
      body:
        'Um custom hook é só uma função cujo nome começa com `use` e que pode chamar outros hooks dentro dela. Isso permite extrair lógica com estado (ex: "buscar dados de uma URL e controlar loading/erro") em uma função reutilizável, em vez de duplicar a mesma lógica de `useState` + `useEffect` em vários componentes.\n\nCustom hooks não compartilham estado entre si — cada componente que chama `useFetch(url)` tem sua própria cópia independente do estado interno do hook. O que é compartilhado é só a **lógica**, não os dados.',
      codeExample: {
        lang: 'tsx',
        code: 'function useFetch<T>(url: string) {\n  const [dados, setDados] = useState<T | null>(null);\n  const [carregando, setCarregando] = useState(true);\n\n  useEffect(() => {\n    fetch(url).then(r => r.json()).then(setDados).finally(() => setCarregando(false));\n  }, [url]);\n\n  return { dados, carregando };\n}',
      },
    },
  ],
  resources: [
    { label: 'React Docs', url: 'https://react.dev' },
    { label: 'TypeScript Docs', url: 'https://www.typescriptlang.org/docs/' },
    { label: 'Rocketseat React', url: 'https://www.rocketseat.com.br' },
    { label: 'Alura React TS', url: 'https://www.alura.com.br' },
  ],
  checklist: [
    { id: 'c1', label: 'Dashboard de tarefas com React + TS' },
    { id: 'c2', label: 'Consumo de API com Axios' },
    { id: 'c3', label: 'Gerenciamento de estado com Context' },
  ],
  goalLabel: 'Meta: App React + TS funcional',
  exercises: [
    {
      type: 'mcq',
      id: 'm7-e1',
      prompt: 'Em React, qual hook é usado para executar efeitos colaterais (como buscar dados de uma API)?',
      options: ['useState', 'useEffect', 'useMemo', 'useRef'],
      correctIndex: 1,
      explanation: '`useEffect` executa código em resposta a mudanças de dependências, ou uma única vez na montagem com array vazio `[]`.',
    },
    {
      type: 'truefalse',
      id: 'm7-e2',
      prompt: 'Usar `any` em todo lugar no TypeScript é uma boa prática para "ganhar tempo".',
      answer: false,
      explanation:
        '`any` desativa a checagem de tipos para aquele valor, anulando o principal benefício do TypeScript: pegar erros antes de rodar o código.',
    },
    {
      type: 'code-fill',
      id: 'm7-e3',
      prompt: 'Complete a declaração de estado para uma lista de strings.',
      codeTemplate: 'const [nomes, setNomes] = ___<string[]>([]);',
      answer: 'useState',
      hint: 'O hook que cria estado local em um componente funcional.',
      explanation: '`useState<string[]>([])` cria um estado tipado como array de strings, iniciando vazio.',
    },
    {
      type: 'mcq',
      id: 'm7-e4',
      prompt: 'Qual problema o Context API resolve?',
      options: [
        'Tornar o app mais lento de propósito',
        'Evitar passar a mesma prop manualmente por vários níveis de componentes (prop drilling)',
        'Substituir o useState completamente',
        'Fazer requisições HTTP automaticamente',
      ],
      correctIndex: 1,
      explanation:
        'Context cria um valor acessível por qualquer componente descendente, sem precisar repassar a prop manualmente nível a nível.',
    },
    {
      type: 'order',
      id: 'm7-e5',
      prompt: 'Ordene o ciclo de vida de um componente que busca dados ao montar.',
      steps: [
        'Componente é renderizado pela primeira vez com estado vazio',
        'useEffect dispara porque o array de dependências está vazio',
        'Requisição à API é feita dentro do useEffect',
        'setState é chamado com os dados recebidos',
        'Componente re-renderiza mostrando os dados',
      ],
      explanation: 'Esse é o padrão clássico de "buscar dados ao montar" em React — entender essa sequência evita bugs de timing.',
    },
    {
      type: 'mcq',
      id: 'm7-e6',
      prompt: 'Qual a diferença fundamental entre useMemo e useCallback?',
      options: [
        'Não há diferença, são sinônimos',
        'useMemo memoriza um valor calculado; useCallback memoriza a referência de uma função',
        'useCallback só funciona em classes',
        'useMemo é mais rápido em qualquer situação',
      ],
      correctIndex: 1,
      explanation:
        'useMemo guarda o resultado de uma computação; useCallback guarda a própria função (sua referência), o que é útil para evitar re-renders desnecessários em componentes filhos.',
    },
    {
      type: 'truefalse',
      id: 'm7-e7',
      prompt: 'Usar useMemo e useCallback em absolutamente todo lugar sempre melhora a performance do app.',
      answer: false,
      explanation:
        'Ambos têm um custo de memória e comparação próprios. Usá-los sem necessidade real (em cálculos baratos ou componentes que não sofrem com re-render) pode até piorar levemente a performance, além de adicionar complexidade desnecessária.',
    },
    {
      type: 'code-fill',
      id: 'm7-e8',
      prompt: 'Complete o nome do custom hook seguindo a convenção do React.',
      codeTemplate: 'function ___Fetch(url: string) {\n  // lógica do hook\n}',
      answer: 'use',
      hint: 'Todo hook, customizado ou nativo, precisa começar com esse prefixo para o React reconhecê-lo como hook.',
      explanation: 'A convenção `use` no início do nome não é apenas estilo — é o que permite ao React (e ao linter de hooks) identificar a função como um hook e aplicar suas regras.',
    },
  ],
  games: [
    {
      gameId: 'react-state-lab',
      label: 'Laboratório de Estado',
      description: 'Preveja como o componente re-renderiza após cada interação, treinando intuição sobre estado e efeitos.',
    },
    {
      gameId: 'typescript-type-detective',
      label: 'Detetive de Tipos',
      description: 'Encontre o erro de tipo escondido no código TypeScript antes do compilador apontar.',
    },
    {
      gameId: 'bug-hunter',
      label: 'Caça-Bug',
      description: 'Encontre a linha com erro em trechos reais de código, incluindo um clássico de mutação de estado em React.',
    },
  ],
};

export const mes08: Module = {
  id: 'mes-08',
  month: 8,
  phase: 2,
  track: 'backend',
  title: 'Java & Spring Boot',
  emoji: '☕',
  tagline: 'A linguagem mais usada em sistemas corporativos do mundo, com o framework que a moderniza.',
  intro:
    'Enquanto Node.js domina startups e produtos web ágeis, Java + Spring Boot ainda é o motor de bancos, seguradoras e grandes corporações. Aprender essa stack abre um mercado inteiro diferente, e ensina conceitos de arquitetura mais rigorosos que você vai usar pelo resto da carreira.',
  lessons: [
    {
      id: 'l1',
      heading: 'Java 17+: Streams, Optional e Records',
      body:
        '**Streams** processam coleções de forma declarativa: em vez de loops manuais, você descreve a transformação (`filter`, `map`, `collect`). **Optional** representa explicitamente um valor que pode não existir, evitando `NullPointerException` — o erro mais clássico e mais doloroso de Java.\n\n**Records** (desde Java 14+) eliminam o boilerplate de classes que só guardam dados: um record gera automaticamente construtor, getters, `equals`, `hashCode` e `toString`.',
      codeExample: {
        lang: 'java',
        code: 'record Usuario(String nome, String email) {}\n\nList<String> nomes = usuarios.stream()\n    .filter(u -> u.email().endsWith("@empresa.com"))\n    .map(Usuario::nome)\n    .toList();',
      },
    },
    {
      id: 'l2',
      heading: 'Spring Boot: Web, JPA e Security em poucas anotações',
      body:
        'Spring Boot reduz configuração massiva a anotações. `@RestController` marca uma classe que expõe endpoints REST. `@Entity` (parte do JPA) mapeia uma classe Java diretamente para uma tabela do banco, sem você escrever SQL manual para operações básicas.\n\nSpring Security cuida de autenticação e autorização de forma configurável — desde login simples até integração com JWT e OAuth.',
      codeExample: {
        lang: 'java',
        code: '@RestController\n@RequestMapping("/usuarios")\nclass UsuarioController {\n\n  @GetMapping("/{id}")\n  public Usuario buscar(@PathVariable Long id) {\n    return repository.findById(id).orElseThrow();\n  }\n}',
      },
    },
    {
      id: 'l3',
      heading: 'Clean Architecture e SOLID: organizando código que sobrevive ao tempo',
      body:
        'SOLID é um conjunto de 5 princípios para código manutenível. O mais citado é o **S** — Single Responsibility: cada classe deve ter um, e só um, motivo para mudar. Uma classe que valida dados, salva no banco e envia e-mail está fazendo três trabalhos diferentes — e qualquer mudança em um deles arrisca quebrar os outros.\n\nClean Architecture organiza o código em camadas (domínio, aplicação, infraestrutura) onde as regras de negócio não dependem de detalhes técnicos como qual banco de dados você usa. Isso permite trocar Postgres por MongoDB sem reescrever a lógica de negócio.',
    },
    {
      id: 'l4',
      heading: 'Testes unitários com JUnit',
      body:
        'Um teste unitário verifica uma única unidade de comportamento isoladamente. JUnit é o framework padrão em Java: você escreve um método anotado com `@Test` que chama o código real e usa `assertEquals` (ou similar) para confirmar o resultado esperado.\n\nTestes não são "trabalho extra" — eles são a rede de segurança que permite você mudar código com confiança sem precisar testar manualmente cada fluxo toda vez.',
      codeExample: {
        lang: 'java',
        code: '@Test\nvoid deveRetornarUsuarioPeloId() {\n  Usuario usuario = service.buscarPorId(1L);\n  assertEquals("Ana", usuario.getNome());\n}',
      },
    },
    {
      id: 'l5',
      heading: 'Injeção de dependência: o motor invisível do Spring',
      body:
        'Em vez de uma classe criar manualmente suas próprias dependências (`new UsuarioRepository()`), o Spring as "injeta" automaticamente via `@Autowired` ou pelo construtor. A classe só declara "eu preciso de um UsuarioRepository" e o Spring se encarrega de fornecer a instância certa.\n\nO benefício prático: trocar a implementação real por uma falsa (mock) em testes fica trivial, porque a classe nunca decidiu sozinha qual implementação usar — isso é fundamental para testar código que depende de banco de dados ou serviços externos sem realmente acessá-los durante o teste.',
      codeExample: {
        lang: 'java',
        code: '@Service\nclass UsuarioService {\n  private final UsuarioRepository repository;\n\n  // injeção via construtor — a forma recomendada\n  UsuarioService(UsuarioRepository repository) {\n    this.repository = repository;\n  }\n}',
      },
    },
    {
      id: 'l6',
      heading: 'Spring Data JPA: relacionamentos sem escrever SQL repetitivo',
      body:
        'Spring Data JPA gera automaticamente as operações de banco mais comuns (buscar por id, salvar, deletar) só a partir da interface `JpaRepository`, sem você escrever uma linha de SQL. Para relacionamentos entre tabelas, anotações como `@OneToMany` e `@ManyToOne` descrevem a relação direto nas classes Java, e o JPA cuida de gerar as queries necessárias.\n\nCuidado com o "problema N+1": carregar uma lista de entidades e depois acessar uma relação de cada uma, um por um, pode gerar uma query adicional para cada item — péssimo para performance. `@EntityGraph` ou JOIN FETCH explícito resolvem isso carregando tudo de uma vez.',
      codeExample: {
        lang: 'java',
        code: '@Entity\nclass Pedido {\n  @ManyToOne\n  private Cliente cliente;\n}\n\ninterface PedidoRepository extends JpaRepository<Pedido, Long> {\n  List<Pedido> findByClienteId(Long clienteId);\n}',
      },
    },
  ],
  resources: [
    { label: 'Java Docs', url: 'https://docs.oracle.com/en/java/' },
    { label: 'Spring Boot', url: 'https://spring.io/projects/spring-boot' },
    { label: 'Algaworks', url: 'https://www.algaworks.com' },
    { label: 'Udemy — Spring', url: 'https://www.udemy.com' },
  ],
  checklist: [
    { id: 'c1', label: 'API de usuários com Spring Boot + JWT' },
    { id: 'c2', label: 'Testes unitários com JUnit' },
    { id: 'c3', label: 'Spring Data JPA com relacionamentos' },
  ],
  goalLabel: 'Meta: API Spring Boot completa',
  exercises: [
    {
      type: 'mcq',
      id: 'm8-e1',
      prompt: 'Em Spring Boot, qual anotação define um controller REST?',
      options: ['@Controller', '@RestController', '@Service', '@Repository'],
      correctIndex: 1,
      explanation:
        '`@RestController` combina `@Controller` com `@ResponseBody`, fazendo os retornos dos métodos serem serializados direto como JSON.',
    },
    {
      type: 'mcq',
      id: 'm8-e2',
      prompt: 'O que o princípio "S" do SOLID (Single Responsibility) recomenda?',
      options: [
        'Cada classe deve ter um único método',
        'Cada classe deve ter um, e só um, motivo para mudar',
        'Cada projeto deve ter um único desenvolvedor',
        'Cada arquivo deve ter no máximo 10 linhas',
      ],
      correctIndex: 1,
      explanation:
        'Single Responsibility é sobre coesão de propósito: uma classe deve encapsular uma responsabilidade clara, não sobre tamanho de arquivo.',
    },
    {
      type: 'truefalse',
      id: 'm8-e3',
      prompt: '`Optional` em Java existe para eliminar completamente a possibilidade de NullPointerException no programa.',
      answer: false,
      explanation:
        '`Optional` torna explícito que um valor pode estar ausente, ajudando a tratar esse caso de forma segura — mas não elimina NullPointerException por si só, já que ainda é possível usá-lo incorretamente.',
    },
    {
      type: 'code-fill',
      id: 'm8-e4',
      prompt: 'Complete a anotação que mapeia uma classe Java para uma tabela do banco via JPA.',
      codeTemplate: '___\npublic class Usuario {\n  @Id\n  private Long id;\n}',
      answer: '@Entity',
      hint: 'A anotação do JPA que marca uma classe como uma entidade persistível.',
      explanation: '`@Entity` informa ao JPA que essa classe deve ser mapeada para uma tabela no banco de dados.',
    },
    {
      type: 'order',
      id: 'm8-e5',
      prompt: 'Ordene o fluxo de uma requisição numa API Spring Boot bem estruturada (Clean Architecture).',
      steps: [
        'Controller recebe a requisição HTTP',
        'Controller delega para a camada de serviço (regra de negócio)',
        'Serviço usa o repositório para acessar dados',
        'Repositório consulta o banco de dados via JPA',
      ],
      explanation:
        'Cada camada tem uma responsabilidade isolada: controller lida com HTTP, serviço com regra de negócio, repositório com persistência.',
    },
    {
      type: 'mcq',
      id: 'm8-e6',
      prompt: 'Qual a principal vantagem de usar injeção de dependência via construtor em vez de instanciar dependências manualmente com "new"?',
      options: [
        'O código fica mais curto, só isso',
        'Permite substituir a implementação real por um mock em testes, sem mudar a classe',
        'É a única forma que o Java permite',
        'Torna o programa mais rápido automaticamente',
      ],
      correctIndex: 1,
      explanation:
        'Como a classe recebe a dependência de fora, em testes você pode injetar uma versão falsa (mock) dessa dependência, isolando o teste do comportamento real do banco ou serviço externo.',
    },
    {
      type: 'truefalse',
      id: 'm8-e7',
      prompt: 'O "problema N+1" em JPA significa que uma query inicial dispara uma query adicional para cada item de uma lista relacionada.',
      answer: true,
      explanation:
        'Esse é exatamente o problema: buscar N entidades e depois acessar uma relação lazy de cada uma dispara N queries adicionais, em vez de uma única query otimizada que já traga tudo junto.',
    },
    {
      type: 'mcq',
      id: 'm8-e8',
      prompt: 'Qual anotação JPA descreve a relação "um pedido pertence a um único cliente"?',
      options: ['@OneToMany', '@ManyToOne', '@ManyToMany', '@Entity'],
      correctIndex: 1,
      explanation:
        '`@ManyToOne` no lado do Pedido expressa que muitos pedidos podem pertencer a um único cliente — a relação inversa seria `@OneToMany` no lado do Cliente.',
    },
  ],
  games: [
    {
      gameId: 'solid-principles-sorter',
      label: 'Classificador SOLID',
      description: 'Identifique qual princípio SOLID está sendo violado em trechos de código reais.',
    },
    {
      gameId: 'java-stream-builder',
      label: 'Montador de Streams',
      description: 'Encadeie filter, map e collect na ordem certa para transformar uma lista no resultado pedido.',
    },
  ],
};

export const mes09: Module = {
  id: 'mes-09',
  month: 9,
  phase: 2,
  track: 'devops',
  title: 'Docker & Containerização',
  emoji: '🐳',
  tagline: '"Funciona na minha máquina" deixa de ser desculpa.',
  intro:
    'Docker empacota sua aplicação com tudo que ela precisa para rodar — código, dependências, configuração — em um container que funciona identicamente em qualquer máquina. Esse mês resolve, de vez, o problema de ambiente que assombra todo desenvolvedor.',
  lessons: [
    {
      id: 'l1',
      heading: 'Imagens e containers: o blueprint e a casa construída',
      body:
        'Uma **imagem** é um blueprint imutável — uma receita de como montar o ambiente da sua aplicação, definida em um `Dockerfile`. Um **container** é uma instância em execução dessa imagem — você pode rodar vários containers da mesma imagem simultaneamente, cada um isolado.\n\n`docker build` cria a imagem a partir do Dockerfile; `docker run` cria e inicia um container a partir dela. Experimente criar e remover containers abaixo.',
      codeExample: {
        lang: 'dockerfile',
        code: 'FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD ["node", "server.js"]',
      },
      diagramId: 'docker-image-container',
    },
    {
      id: 'l2',
      heading: 'Docker Compose: orquestrando múltiplos serviços',
      body:
        'Aplicações reais raramente são um container só — você tem frontend, backend e banco de dados, cada um em seu próprio container, precisando se comunicar. `docker-compose.yml` descreve todos esses serviços, suas portas e dependências em um único arquivo, e `docker-compose up` levanta tudo de uma vez, na ordem certa.',
      codeExample: {
        lang: 'yaml',
        code: 'services:\n  api:\n    build: ./api\n    ports: ["3000:3000"]\n    depends_on: [db]\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_PASSWORD: senha\n    volumes:\n      - dados:/var/lib/postgresql/data\nvolumes:\n  dados:',
      },
    },
    {
      id: 'l3',
      heading: 'Volumes: persistindo dados além da vida do container',
      body:
        'Por padrão, qualquer dado escrito dentro de um container some quando ele é destruído — containers são descartáveis por design. **Volumes** criam um espaço de armazenamento que vive fora do ciclo de vida do container, garantindo que dados de banco, por exemplo, sobrevivam a reinicializações e recriações.',
    },
    {
      id: 'l4',
      heading: 'Multi-stage build: imagens menores e mais seguras',
      body:
        'Um Dockerfile comum inclui ferramentas de build (compiladores, dependências de desenvolvimento) que não são necessárias para **rodar** a aplicação em produção — só para construí-la. Multi-stage build usa múltiplos blocos `FROM` no mesmo Dockerfile: um estágio compila/builda o projeto, e o estágio final copia só os artefatos prontos, descartando tudo que foi usado apenas para build.\n\nO resultado prático: imagens finais drasticamente menores (menos tempo de deploy, menos superfície de ataque) sem perder nada da capacidade de build.',
      codeExample: {
        lang: 'dockerfile',
        code: '# Estágio 1: build\nFROM node:20 AS build\nWORKDIR /app\nCOPY . .\nRUN npm install && npm run build\n\n# Estágio 2: produção\nFROM nginx:alpine\nCOPY --from=build /app/dist /usr/share/nginx/html',
      },
    },
    {
      id: 'l5',
      heading: 'Redes Docker: como containers se encontram',
      body:
        'Containers no mesmo `docker-compose.yml` automaticamente compartilham uma rede privada, e podem se comunicar usando o **nome do serviço** como hostname — não `localhost`, e não o IP. Se seu backend precisa falar com o banco, ele usa `db:5432` (onde `db` é o nome do serviço no compose), não `localhost:5432`.\n\nEsse é um dos erros mais comuns de quem está aprendendo Docker: tentar usar `localhost` de dentro de um container para acessar outro container — isso só funcionaria se ambos estivessem na mesma máquina física fora de containers, mas dentro da rede Docker, cada container tem seu próprio `localhost` isolado.',
    },
  ],
  resources: [
    { label: 'Docker Docs', url: 'https://docs.docker.com' },
    { label: 'Udemy — Docker', url: 'https://www.udemy.com' },
    { label: 'Alura Docker', url: 'https://www.alura.com.br' },
  ],
  checklist: [
    { id: 'c1', label: 'Dockerizar frontend + backend + banco' },
    { id: 'c2', label: 'docker-compose com 3 serviços' },
    { id: 'c3', label: 'Volumes configurados' },
  ],
  goalLabel: 'Meta: docker-compose up funcionando',
  exercises: [
    {
      type: 'mcq',
      id: 'm9-e1',
      prompt: 'Qual comando Docker constrói uma imagem a partir de um Dockerfile?',
      options: ['docker build -t nome .', 'docker create -t nome .', 'docker run -t nome .', 'docker image create .'],
      correctIndex: 0,
      explanation: '`docker build -t nome .` lê o Dockerfile do diretório atual e cria uma imagem com a tag (nome) especificada.',
    },
    {
      type: 'truefalse',
      id: 'm9-e2',
      prompt: 'Dados gravados dentro de um container, sem volume, sobrevivem quando o container é removido.',
      answer: false,
      explanation:
        'Sem um volume, qualquer dado escrito dentro do container é perdido ao removê-lo — containers são tratados como descartáveis por design.',
    },
    {
      type: 'code-fill',
      id: 'm9-e3',
      prompt: 'Complete o comando que sobe todos os serviços definidos no docker-compose.yml.',
      codeTemplate: 'docker-compose ___',
      answer: 'up',
      hint: 'O subcomando que cria e inicia todos os containers do arquivo de composição.',
      explanation: '`docker-compose up` lê o arquivo, cria a rede, os volumes e inicia todos os serviços na ordem de dependência correta.',
    },
    {
      type: 'mcq',
      id: 'm9-e4',
      prompt: 'Qual a diferença fundamental entre uma imagem e um container?',
      options: [
        'Não há diferença, são sinônimos',
        'Imagem é o blueprint estático; container é uma instância em execução dessa imagem',
        'Imagem só funciona no Windows',
        'Container é sempre mais pesado que a imagem',
      ],
      correctIndex: 1,
      explanation:
        'A imagem é imutável e reutilizável; você pode criar quantos containers quiser a partir da mesma imagem, cada um rodando isoladamente.',
    },
    {
      type: 'mcq',
      id: 'm9-e5',
      prompt: 'Qual o principal benefício de um multi-stage build no Dockerfile?',
      options: [
        'Permite usar duas linguagens de programação ao mesmo tempo',
        'Gera uma imagem final menor, sem as ferramentas de build que só eram necessárias para compilar',
        'Torna o build mais lento de propósito',
        'É obrigatório para qualquer Dockerfile',
      ],
      correctIndex: 1,
      explanation:
        'O estágio final copia só os artefatos já prontos do estágio de build, descartando compiladores e dependências de desenvolvimento que inflariam a imagem final sem necessidade.',
    },
    {
      type: 'truefalse',
      id: 'm9-e6',
      prompt: 'Dentro de um docker-compose, um container de backend deve usar "localhost" para se conectar ao container do banco de dados.',
      answer: false,
      explanation:
        'Containers no mesmo compose se comunicam usando o nome do serviço como hostname (ex: "db"), não "localhost" — cada container tem seu próprio localhost isolado.',
    },
    {
      type: 'code-fill',
      id: 'm9-e7',
      prompt: 'Complete o hostname correto para o backend se conectar a um serviço de banco chamado "db" no compose.',
      codeTemplate: 'DATABASE_URL=postgres://user:senha@___:5432/meubanco',
      answer: 'db',
      hint: 'No mesmo docker-compose, qual nome identifica o outro container na rede interna?',
      explanation: 'O nome do serviço definido no docker-compose.yml funciona como hostname na rede interna compartilhada entre os containers daquele compose.',
    },
  ],
  games: [
    {
      gameId: 'docker-compose-builder',
      label: 'Montador de Compose',
      description: 'Arraste serviços, portas e volumes para montar um docker-compose.yml válido para um cenário dado.',
    },
  ],
};
