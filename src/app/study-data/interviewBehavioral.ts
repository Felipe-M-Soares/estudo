import type { BehavioralQuestion } from './interviewTypes';

export const behavioralQuestions: BehavioralQuestion[] = [
  {
    id: 'bh-01',
    level: ['junior', 'pleno', 'senior'],
    question: 'Me conte sobre um desafio técnico difícil que você enfrentou e como resolveu.',
    whatTheyWantToHear:
      'Não é sobre o quão impressionante foi o problema — é sobre seu processo de investigação, as alternativas que você considerou, e o que você aprendeu. Detalhes técnicos específicos (não vagos) aumentam a credibilidade da resposta.',
    structureTip:
      'Use a estrutura STAR: Situação (contexto breve), Tarefa (o que precisava ser resolvido), Ação (o que você fez, passo a passo), Resultado (o que aconteceu e o que você aprendeu).',
  },
  {
    id: 'bh-02',
    level: ['junior', 'pleno', 'senior'],
    question: 'Descreva uma situação em que você discordou de uma decisão técnica do time. O que você fez?',
    whatTheyWantToHear:
      'Avaliadores procuram maturidade para discordar com argumentos (não só opinião), e capacidade de se comprometer com a decisão final do time mesmo sem total acordo — "disagree and commit", não sabotagem silenciosa.',
    structureTip:
      'Mostre que você trouxe dados/exemplos concretos para sustentar sua posição, e explique como agiu depois que a decisão foi tomada, independente de ter sido a sua opção ou não.',
  },
  {
    id: 'bh-03',
    level: ['pleno', 'senior'],
    question: 'Conte sobre uma vez em que você cometeu um erro que impactou produção. Como lidou com isso?',
    whatTheyWantToHear:
      'Essa pergunta avalia honestidade e responsabilidade. Evite respostas genéricas ("nunca cometi erros grandes") — todo profissional experiente já causou algum impacto. O que importa é como você reagiu: comunicação rápida, correção, e o que mudou depois para evitar repetição.',
    structureTip:
      'Seja específico sobre a causa raiz do erro, mas gaste mais tempo na resposta/correção e no aprendizado/prevenção do que se desculpando ou se culpando excessivamente.',
  },
  {
    id: 'bh-04',
    level: ['junior', 'pleno'],
    question: 'Como você se mantém atualizado com novas tecnologias e práticas da área?',
    whatTheyWantToHear:
      'Não existe resposta "certa" única, mas respostas vagas ("eu leio sobre tudo") são menos convincentes que hábitos concretos e específicos que demonstram curiosidade genuína, não só uma resposta preparada para a entrevista.',
    structureTip:
      'Cite fontes/hábitos reais (newsletters específicas, comunidades, projetos pessoais, contribuições open source) e, se possível, um exemplo concreto de algo que você aprendeu recentemente e já aplicou.',
  },
  {
    id: 'bh-05',
    level: ['pleno', 'senior'],
    question: 'Descreva como você explicaria um conceito técnico complexo para alguém não-técnico (ex: um stakeholder de negócio).',
    whatTheyWantToHear:
      'Avalia capacidade de comunicação e empatia com diferentes públicos — uma habilidade frequentemente subestimada por quem é muito técnico, mas crítica para influenciar decisões e alinhar expectativas.',
    structureTip:
      'Se possível, dê um exemplo real de algo que você já precisou explicar (ex: por que algo vai demorar mais do que o esperado, ou por que pagar "dívida técnica" importa), usando analogias do dia a dia em vez de jargão.',
  },
  {
    id: 'bh-06',
    level: ['junior', 'pleno', 'senior'],
    question: 'Por que você quer trabalhar nesta empresa/vaga especificamente?',
    whatTheyWantToHear:
      'Avaliadores notam rapidamente respostas genéricas que serviriam para qualquer empresa. Eles querem ver que você pesquisou sobre o produto, a stack, ou os desafios específicos da empresa, e como isso conecta com seus próprios objetivos de carreira.',
    structureTip:
      'Mencione algo específico (um produto da empresa que você usa/admira, uma tecnologia que eles usam e você quer aprofundar, um desafio do setor deles que te interessa) — evite respostas que soariam idênticas em qualquer entrevista.',
  },
  {
    id: 'bh-07',
    level: ['senior'],
    question: 'Conte sobre uma vez em que você precisou mentorear ou ajudar alguém menos experiente do time.',
    whatTheyWantToHear:
      'Para vagas sêniores, isso avalia se você cresce além de "só código" — capacidade de elevar o nível do time, não só o próprio. Respostas que mostram paciência e técnicas de ensino (não só "expliquei e ele entendeu") são mais fortes.',
    structureTip:
      'Descreva a dificuldade específica da pessoa, sua abordagem (perguntas guiadas vs. respostas prontas, por exemplo), e o resultado — idealmente, como aquela pessoa evoluiu depois, não só o momento pontual.',
  },
  {
    id: 'bh-08',
    level: ['pleno', 'senior'],
    question: 'Como você prioriza quando tem múltiplas tarefas urgentes ao mesmo tempo?',
    whatTheyWantToHear:
      'Avalia organização e julgamento sob pressão. Respostas fortes mencionam critérios concretos (impacto no usuário, dependências de outros times, reversibilidade) em vez de "eu simplesmente me organizo bem".',
    structureTip:
      'Dê um exemplo real de um momento com múltiplas prioridades conflitantes, explique o critério usado para decidir a ordem, e o resultado dessa decisão.',
  },
];
