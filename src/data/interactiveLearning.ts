import type { Module, LessonBlock } from './types';

export interface StoryChoice {
  label: string;
  consequence: string;
  correct?: boolean;
}

export interface StoryLesson {
  id: string;
  title: string;
  mission: string;
  tension: string;
  choices: StoryChoice[];
  reveal: string;
  takeaway: string;
}

export interface DebugCase {
  id: string;
  title: string;
  context: string;
  symptom: string;
  log: string;
  suspects: string[];
  answer: string;
  fix: string;
}

export interface SprintLab {
  id: string;
  title: string;
  company: string;
  role: string;
  sprints: { title: string; objective: string; deliverable: string }[];
}

export interface SkillNode {
  id: string;
  label: string;
  level: number;
  evidence: string;
}

const trackContext: Record<Module['track'], { company: string; problem: string; role: string }> = {
  frontend: { company: 'uma startup com muitos usuários no celular', problem: 'a tela precisa ficar clara, rápida e fácil de usar', role: 'dev front-end' },
  backend: { company: 'uma plataforma que recebe muitas requisições por minuto', problem: 'a regra de negócio precisa ser confiável e segura', role: 'dev back-end' },
  devops: { company: 'um time que faz deploy todos os dias', problem: 'o sistema precisa subir sem quebrar produção', role: 'dev de plataforma' },
  fullstack: { company: 'um produto digital crescendo rápido', problem: 'front, API, dados e deploy precisam conversar', role: 'dev full stack' },
  soft: { company: 'um time remoto com prazos apertados', problem: 'a comunicação precisa evitar retrabalho', role: 'dev em evolução profissional' },
};

function plain(text: string) {
  return text.replace(/[`*_#>-]/g, '').replace(/\s+/g, ' ').trim();
}

function firstSentence(text: string) {
  return plain(text).split(/(?<=[.!?])\s+/)[0] || plain(text).slice(0, 140);
}

export function buildStoryLessons(module: Module): StoryLesson[] {
  const ctx = trackContext[module.track];
  return module.lessons.slice(0, 3).map((lesson: LessonBlock) => {
    const concept = lesson.heading.replace(/^\d+[.)]\s*/, '');
    return {
      id: `${module.id}-story-${lesson.id}`,
      title: concept,
      mission: `Você entrou em ${ctx.company}. O desafio de hoje é usar ${concept} porque ${ctx.problem}.`,
      tension: `O time tentou resolver no improviso, mas surgiu um efeito colateral: ${firstSentence(lesson.body)}`,
      choices: [
        {
          label: 'Copiar uma solução pronta e seguir para a próxima tarefa.',
          consequence: 'Funciona por alguns minutos, mas você não entende o motivo e o mesmo erro volta em outro lugar.',
        },
        {
          label: `Entender o princípio por trás de ${concept} antes de mexer no código.`,
          consequence: 'Você resolve o problema atual e ainda cria uma regra mental para reconhecer casos parecidos.',
          correct: true,
        },
        {
          label: 'Adicionar mais complexidade para cobrir todos os casos de uma vez.',
          consequence: 'O código cresce rápido demais e fica difícil saber qual parte realmente resolveu o problema.',
        },
      ],
      reveal: `A descoberta da aula: ${firstSentence(lesson.body)} Agora o conteúdo deixa de ser teoria solta e vira ferramenta de decisão.`,
      takeaway: `Quando aparecer um problema parecido, pergunte: “qual decisão ${concept} me ajuda a tomar agora?”`,
    };
  });
}

export function buildDebugCases(module: Module): DebugCase[] {
  return module.lessons.slice(0, 2).map((lesson, index) => ({
    id: `${module.id}-debug-${lesson.id}`,
    title: `Caso ${index + 1}: algo quebrou em ${lesson.heading}`,
    context: `Você assumiu um ticket relacionado a ${lesson.heading}. O código parece correto, mas o comportamento final não bate com o esperado.`,
    symptom: `Sintoma percebido: a solução até roda, porém falha quando o cenário deixa de ser o exemplo perfeito da aula.`,
    log: `[ticket-${module.month}-${index + 1}] comportamento inconsistente detectado\ncontexto: ${plain(module.title)}\npista: ${firstSentence(lesson.body)}`,
    suspects: [
      'O problema está só no visual.',
      'Existe uma regra do conceito sendo ignorada.',
      'A solução precisa ser reescrita do zero antes de investigar.',
    ],
    answer: 'Existe uma regra do conceito sendo ignorada.',
    fix: `Volte para o princípio central de ${lesson.heading}, teste um caso simples, depois aumente a complexidade aos poucos.`,
  }));
}

export function buildSprintLab(module: Module): SprintLab {
  const ctx = trackContext[module.track];
  return {
    id: `${module.id}-sprint-lab`,
    title: `Projeto guiado: ${module.title}`,
    company: ctx.company,
    role: ctx.role,
    sprints: [
      { title: 'Sprint 1 — Entender o problema', objective: module.intro, deliverable: 'Escrever em 5 linhas qual dor real esse módulo resolve.' },
      { title: 'Sprint 2 — Construir a primeira versão', objective: `Aplicar ${module.lessons[0]?.heading ?? module.title} em um exemplo pequeno.`, deliverable: 'Criar um mini protótipo ou pseudocódigo funcional.' },
      { title: 'Sprint 3 — Quebrar de propósito', objective: 'Testar um cenário errado para descobrir o limite da solução.', deliverable: 'Registrar o erro, a causa e a correção.' },
      { title: 'Sprint 4 — Explicar como dev profissional', objective: 'Transformar o aprendizado em uma explicação curta e clara.', deliverable: 'Escrever uma resposta de entrevista sobre o tema.' },
    ],
  };
}

export function buildSkillNodes(module: Module): SkillNode[] {
  const lessons = module.lessons.slice(0, 5);
  return lessons.map((lesson, idx) => ({
    id: `${module.id}-skill-${lesson.id}`,
    label: lesson.heading,
    level: Math.max(1, 5 - Math.floor(idx / 2)),
    evidence: `Dominar este ponto ajuda a completar: ${module.goalLabel}`,
  }));
}

export function careerStage(progressPercent: number) {
  if (progressPercent >= 85) return { title: 'Tech Lead em treinamento', next: 'orientar decisões técnicas e revisar arquitetura' };
  if (progressPercent >= 60) return { title: 'Dev Pleno em evolução', next: 'resolver problemas com menos ajuda e mais contexto' };
  if (progressPercent >= 30) return { title: 'Dev Júnior consistente', next: 'ligar conceitos e criar soluções completas' };
  return { title: 'Aprendiz focado', next: 'construir base, rotina e confiança nos fundamentos' };
}
