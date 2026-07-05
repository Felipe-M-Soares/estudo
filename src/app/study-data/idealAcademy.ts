import type { Module, LessonBlock, Exercise, ChecklistItem, DayToDayScenario } from './types';

const trackLabels: Record<Module['track'], string> = {
  frontend: 'front-end',
  backend: 'back-end',
  devops: 'devops',
  fullstack: 'full stack',
  soft: 'base profissional',
};

const trackProblems: Record<Module['track'], string> = {
  frontend: 'uma tela que precisa ser entendida em segundos, funcionar bem no celular e continuar rápida mesmo com dados reais',
  backend: 'uma API que precisa manter regra de negócio, segurança e desempenho sem virar uma bagunça difícil de manter',
  devops: 'um produto que precisa sair do notebook e rodar com estabilidade, observabilidade e deploy previsível',
  fullstack: 'um fluxo completo onde interface, API, banco e infraestrutura precisam conversar sem atrito',
  soft: 'um problema grande que precisa ser quebrado em passos pequenos, testáveis e comunicáveis',
};

function firstConcept(module: Module) {
  return module.lessons[0]?.heading ?? module.title;
}

export function buildIdealLessons(module: Module): LessonBlock[] {
  const concept = firstConcept(module);
  const track = trackLabels[module.track];
  const problem = trackProblems[module.track];

  return [
    {
      id: `${module.id}-ideal-contexto`,
      heading: 'Aula escrita com contexto real',
      body: `Imagine que você recebeu um ticket em um produto de verdade: ${problem}. A missão deste módulo não é decorar ${module.title}; é entender qual decisão esse conhecimento permite tomar quando existe prazo, usuário e consequência.\n\nO ponto de partida é simples: antes de escrever qualquer código, descreva o problema em uma frase, liste as entradas, liste as saídas e identifique o que pode dar errado. Depois disso, o conteúdo técnico deixa de parecer teoria solta e vira ferramenta.\n\nNesta aula, use ${concept} como lente principal. Sempre que aparecer um exemplo, pergunte: qual decisão eu tomaria se isso estivesse em produção? O que eu testaria? Que erro um iniciante cometeria? Como eu explicaria a solução para outra pessoa em menos de um minuto?`,
    },
    {
      id: `${module.id}-ideal-playbook`,
      heading: 'Playbook rápido de aplicação',
      body: `Quando estiver estudando ${module.title}, siga este fluxo:\n\n- **Entenda o cenário**: qual dor real esse conteúdo resolve?\n- **Crie uma versão mínima**: faça o menor exemplo possível funcionar.\n- **Quebre de propósito**: altere uma entrada, remova uma condição, force um erro.\n- **Explique a causa**: não diga apenas “deu erro”; diga qual regra foi violada.\n- **Refatore**: deixe a solução mais clara sem mudar o comportamento.\n\nEsse playbook transforma uma aula de ${track} em treino profissional. O objetivo é terminar o módulo sabendo fazer, explicar, depurar e adaptar.`,
    },
    {
      id: `${module.id}-ideal-review`,
      heading: 'Revisão ativa: prove que aprendeu',
      body: `Feche a aula e responda sem consultar:\n\n1. Qual problema este módulo resolve?\n2. Qual erro comum alguém cometeria aqui?\n3. Qual exemplo mínimo mostra o conceito funcionando?\n4. Qual caso extremo poderia quebrar a solução?\n5. Como você explicaria ${module.title} para uma pessoa iniciante?\n\nSe travar em qualquer pergunta, volte para a parte correspondente. Revisão boa não é reler; é tentar lembrar antes de ver a resposta.`,
    },
  ];
}

export function buildIdealExercises(module: Module): Exercise[] {
  const concept = firstConcept(module);
  return [
    {
      type: 'mcq',
      id: `${module.id}-ideal-e1`,
      prompt: `Antes de aplicar ${module.title} em um projeto real, qual é a melhor primeira atitude?`,
      options: [
        'Copiar o primeiro exemplo que aparecer e adaptar depois',
        'Definir o problema, as entradas, as saídas e os riscos antes da solução',
        'Adicionar todas as ferramentas possíveis para deixar o projeto completo',
        'Pular a teoria e resolver apenas por tentativa e erro',
      ],
      correctIndex: 1,
      explanation: 'Um app de estudo rápido precisa ensinar decisão. Definir problema, entradas, saídas e riscos reduz chute e acelera a prática.',
    },
    {
      type: 'order',
      id: `${module.id}-ideal-e2`,
      prompt: `Ordene o fluxo ideal para dominar ${concept}.`,
      steps: [
        'Entender o cenário real do problema',
        'Criar um exemplo mínimo funcionando',
        'Quebrar o exemplo de propósito com um caso extremo',
        'Explicar a causa do erro e refatorar a solução',
      ],
      explanation: 'Esse fluxo cria retenção porque combina contexto, prática, erro e explicação.',
    },
    {
      type: 'truefalse',
      id: `${module.id}-ideal-e3`,
      prompt: `Uma aula de ${module.title} fica mais forte quando mostra consequências reais, e não apenas definição técnica.`,
      answer: true,
      explanation: 'Contexto e consequência ajudam o aluno a entender quando usar o conceito, não apenas o que ele significa.',
    },
  ];
}

export function buildIdealChecklist(module: Module): ChecklistItem[] {
  return [
    { id: `${module.id}-ideal-c1`, label: 'Escrever uma explicação de 1 minuto sobre o módulo sem consultar' },
    { id: `${module.id}-ideal-c2`, label: 'Criar um exemplo mínimo do conteúdo estudado' },
    { id: `${module.id}-ideal-c3`, label: 'Quebrar o exemplo com um caso extremo e registrar a correção' },
    { id: `${module.id}-ideal-c4`, label: 'Transformar o aprendizado em um mini ticket de projeto real' },
  ];
}

export function buildIdealScenarios(module: Module): DayToDayScenario[] {
  return [
    {
      id: `${module.id}-ideal-scenario-prod`,
      context: 'trabalho',
      title: `Ticket real: aplicar ${module.title}`,
      situation: `Um time precisa resolver ${trackProblems[module.track]}. O conteúdo do módulo aparece como parte da decisão técnica, não como teoria isolada.`,
      whatHappens: `Se a solução for feita sem contexto, o projeto pode até funcionar no exemplo, mas quebra quando aparece usuário real, dado inesperado ou manutenção por outra pessoa.`,
      howToSolve: `Comece pequeno, prove o comportamento, teste um caso ruim, documente a decisão e só depois aumente a complexidade. Use a aula como checklist de decisão.`,
      emoji: '🏢',
      check: {
        question: 'Qual é a atitude mais profissional nesse cenário?',
        options: ['Adicionar complexidade primeiro', 'Entender o problema e validar com exemplo mínimo', 'Ignorar casos extremos'],
        correctIndex: 1,
        explanation: 'A solução profissional nasce de problema claro, exemplo mínimo e validação progressiva.',
      },
    },
  ];
}

export function enhanceModuleForIdealApp(module: Module): Module {
  const extraLessons = buildIdealLessons(module);
  const extraExercises = buildIdealExercises(module);
  const extraChecklist = buildIdealChecklist(module);
  const extraScenarios = buildIdealScenarios(module);

  return {
    ...module,
    tagline: `${module.tagline} · agora com missão, prática guiada, revisão ativa e aplicação real.`,
    intro: `${module.intro}\n\nNesta versão reformulada, cada módulo funciona como uma unidade completa de aprendizado rápido: contexto real, aula escrita, prática, debug, revisão ativa, projeto e checklist de domínio.`,
    lessons: [...module.lessons, ...extraLessons],
    exercises: [...module.exercises, ...extraExercises],
    checklist: [...module.checklist, ...extraChecklist],
    scenarios: [...(module.scenarios ?? []), ...extraScenarios],
    projectBrief: module.projectBrief ?? {
      title: `Projeto prático — ${module.title} em produção`,
      description: `Construa uma entrega pequena que prove domínio de ${module.title}: um exemplo funcional, testável e explicado como se fosse enviado para revisão técnica.`,
      requirements: [
        'Ter um cenário de usuário ou problema real',
        'Mostrar a solução mínima funcionando',
        'Incluir pelo menos um caso de erro ou limite',
        'Registrar o que foi aprendido em linguagem simples',
      ],
    },
  };
}

export const idealTracks = [
  {
    title: 'Aprender em 15 minutos',
    emoji: '⚡',
    description: 'Uma aula curta com missão, exemplo, erro comum e revisão ativa.',
    steps: ['Contexto', 'Conceito', 'Exemplo mínimo', 'Erro comum', 'Pergunta de memória'],
  },
  {
    title: 'Treino de projeto',
    emoji: '🏗️',
    description: 'Cada módulo vira uma entrega prática com requisito, limite e explicação.',
    steps: ['Ticket', 'Protótipo', 'Teste ruim', 'Correção', 'Entrega'],
  },
  {
    title: 'Modo carreira',
    emoji: '🚀',
    description: 'O aluno evolui de aprendiz para dev júnior, pleno e tech lead em treinamento.',
    steps: ['Base', 'Autonomia', 'Decisão', 'Arquitetura', 'Comunicação'],
  },
  {
    title: 'Revisão inteligente',
    emoji: '🧠',
    description: 'O app força lembrar antes de mostrar resposta, aumentando retenção.',
    steps: ['Lembrar', 'Responder', 'Comparar', 'Corrigir', 'Repetir depois'],
  },
];
