export interface GlossaryEntry {
  term: string;
  definition: string;
}

// Chave em minúsculas, sem acento, para facilitar o lookup case-insensitive.
// O "term" é o que aparece no popup como título (pode ter acento/maiúscula correta).
export const glossary: Record<string, GlossaryEntry> = {
  api: {
    term: 'API',
    definition: 'Conjunto de regras que permite que um programa "converse" com outro — geralmente trocando dados pela internet, no formato JSON.',
  },
  json: {
    term: 'JSON',
    definition: 'Formato de texto pra representar dados (objetos, listas, números, texto) que praticamente toda API usa hoje. Tipo um objeto JavaScript, mas em texto puro.',
  },
  framework: {
    term: 'Framework',
    definition: 'Um "esqueleto" de código já pronto que te dá uma estrutura pra seguir — você preenche as partes específicas do seu projeto, em vez de montar tudo do zero.',
  },
  biblioteca: {
    term: 'Biblioteca',
    definition: 'Um conjunto de código pronto que você importa e usa quando precisa — diferente de framework, você decide quando e como chamar ela, ela não dita a estrutura do seu projeto.',
  },
  middleware: {
    term: 'Middleware',
    definition: 'Uma função que roda no meio do caminho de uma requisição, antes dela chegar no destino final — tipo um segurança que checa cada um antes de deixar entrar.',
  },
  endpoint: {
    term: 'Endpoint',
    definition: 'Um "endereço" específico de uma API que faz uma coisa — tipo /usuarios/123 pra buscar um usuário específico.',
  },
  payload: {
    term: 'Payload',
    definition: 'O "conteúdo de verdade" de uma requisição ou mensagem — os dados que estão sendo enviados, sem contar os metadados (headers, etc).',
  },
  schema: {
    term: 'Schema',
    definition: 'A "planta baixa" de como os dados devem ser estruturados — quais campos existem, que tipo cada um é, o que é obrigatório.',
  },
  query: {
    term: 'Query',
    definition: 'Uma pergunta/consulta que você faz a um banco de dados (ou API) pra buscar ou filtrar dados específicos.',
  },
  cache: {
    term: 'Cache',
    definition: 'Uma cópia de algo já calculado/buscado, guardada num lugar rápido de acessar, pra não precisar refazer o trabalho caro de novo.',
  },
  hash: {
    term: 'Hash',
    definition: 'O resultado de passar um dado por uma função matemática que sempre gera a mesma "impressão digital" (um código) pra aquele dado — usado pra senhas, índices, verificação de integridade.',
  },
  token: {
    term: 'Token',
    definition: 'Uma "credencial" temporária que prova que você já fez login — em vez de mandar usuário e senha em toda requisição, você manda esse código.',
  },
  serializar: {
    term: 'Serializar',
    definition: 'Transformar um dado (objeto, lista) em um formato que pode ser enviado/guardado, tipo texto (JSON) — o processo inverso é "desserializar".',
  },
  assincrono: {
    term: 'Assíncrono',
    definition: 'Quando uma operação não bloqueia o resto do código enquanto espera terminar — o programa continua fazendo outras coisas e "volta" quando o resultado chega.',
  },
  sincrono: {
    term: 'Síncrono',
    definition: 'Quando uma operação bloqueia o código até terminar — só depois que ela acaba é que a próxima linha roda.',
  },
  thread: {
    term: 'Thread',
    definition: 'Uma "linha de execução" dentro de um programa — várias threads podem rodar coisas diferentes ao mesmo tempo (em paralelo, se a máquina tiver múltiplos núcleos).',
  },
  deploy: {
    term: 'Deploy',
    definition: 'O processo de colocar uma versão nova do seu código pra rodar de verdade, no ar, acessível pelos usuários.',
  },
  build: {
    term: 'Build',
    definition: 'O processo de transformar seu código fonte (que você escreve) numa versão otimizada e pronta pra rodar em produção.',
  },
  runtime: {
    term: 'Runtime',
    definition: 'O ambiente que executa seu código de fato — tipo o Node.js é o runtime que executa JavaScript fora do navegador.',
  },
  binario: {
    term: 'Binário',
    definition: 'Dado representado em formato de máquina (0s e 1s), não em texto legível — mais compacto e rápido de processar, mas você não consegue simplesmente "abrir e ler".',
  },
  latencia: {
    term: 'Latência',
    definition: 'O tempo que leva entre pedir uma coisa e receber a resposta — quanto menor, mais "instantâneo" parece pro usuário.',
  },
  throughput: {
    term: 'Throughput',
    definition: 'Quantas operações um sistema consegue processar por unidade de tempo — tipo "quantas requisições por segundo esse servidor aguenta".',
  },
  idempotente: {
    term: 'Idempotente',
    definition: 'Uma operação que dá o mesmo resultado final não importa quantas vezes você repetir ela — útil pra lidar com falhas de rede sem duplicar efeitos.',
  },
  webhook: {
    term: 'Webhook',
    definition: 'O inverso de uma API normal: em vez de você perguntar "aconteceu alguma coisa?", o outro sistema te avisa automaticamente quando algo acontece, mandando uma requisição pro seu servidor.',
  },
  orquestracao: {
    term: 'Orquestração',
    definition: 'Coordenar várias partes de um sistema (containers, serviços) automaticamente — decidindo onde rodar, quando reiniciar, como escalar.',
  },
  pipeline: {
    term: 'Pipeline',
    definition: 'Uma sequência de etapas automatizadas que o código passa, uma depois da outra — tipo lint, depois teste, depois build, depois deploy.',
  },
  fork: {
    term: 'Fork',
    definition: 'Criar sua própria cópia de um repositório de código, geralmente pra poder modificar sem afetar o original.',
  },
};

export function lookupTerm(key: string): GlossaryEntry | null {
  const normalized = key
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return glossary[normalized] ?? null;
}
