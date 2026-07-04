import type { Module } from './types';

export type PlatformTheme = 'obsidian' | 'nexus' | 'daybreak';

export interface DailyMission {
  id: string;
  title: string;
  mode: string;
  duration: string;
  xp: number;
  focus: string;
  reward: string;
}

export interface LearningWorld {
  id: string;
  title: string;
  subtitle: string;
  track: Module['track'] | 'ia' | 'career';
  color: string;
  chapters: string[];
  capstone: string;
}

export interface ProjectCampaign {
  id: string;
  title: string;
  company: string;
  difficulty: string;
  duration: string;
  reward: string;
  sprints: { title: string; goal: string; output: string }[];
}

export interface CareerRank {
  title: string;
  level: number;
  responsibility: string;
  unlock: string;
}

export interface ReviewItem {
  id: string;
  topic: string;
  prompt: string;
  answer: string;
  due: string;
  strength: number;
}

export interface SkillCluster {
  title: string;
  mastery: number;
  skills: { label: string; level: number; evidence: string }[];
}

export interface MarketplaceItem {
  id: string;
  title: string;
  type: 'Tema' | 'Avatar' | 'Boost' | 'Badge' | 'Wallpaper';
  price: number;
  rarity: 'Comum' | 'Raro' | 'Epico' | 'Lendario';
  description: string;
}

export const dailyPlan: DailyMission[] = [
  {
    id: 'daily-review',
    title: 'Revisar o ponto fraco',
    mode: 'Revisao ativa',
    duration: '6 min',
    xp: 90,
    focus: 'lembrar antes de ver a resposta',
    reward: '+1 memoria tecnica',
  },
  {
    id: 'daily-lesson',
    title: 'Aula narrativa curta',
    mode: 'Story lesson',
    duration: '10 min',
    xp: 140,
    focus: 'entender uma decisao real de projeto',
    reward: '+1 capitulo',
  },
  {
    id: 'daily-debug',
    title: 'Resolver um bug guiado',
    mode: 'Debug arena',
    duration: '9 min',
    xp: 210,
    focus: 'ler sintoma, log e suspeitos',
    reward: '+1 ponto de investigacao',
  },
  {
    id: 'daily-lab',
    title: 'Entregar uma sprint',
    mode: 'Laboratorio',
    duration: '18 min',
    xp: 320,
    focus: 'transformar teoria em entrega',
    reward: '+1 reputacao profissional',
  },
];

export const learningWorlds: LearningWorld[] = [
  {
    id: 'world-foundation',
    title: 'Fundamentos',
    subtitle: 'Base mental, logica, web e ferramentas para evoluir sem buracos.',
    track: 'soft',
    color: 'blue',
    chapters: ['Logica', 'Git', 'Terminal', 'HTTP', 'Arquitetura mental'],
    capstone: 'Criar um kit de sobrevivencia dev com comandos, fluxo de trabalho e checklist.',
  },
  {
    id: 'world-frontend',
    title: 'Frontend Pro',
    subtitle: 'Interfaces rapidas, responsivas, acessiveis e prontas para produto real.',
    track: 'frontend',
    color: 'cyan',
    chapters: ['HTML', 'CSS', 'JavaScript', 'React', 'Performance'],
    capstone: 'Construir um painel SaaS responsivo com estados vazios, erro e carregamento.',
  },
  {
    id: 'world-backend',
    title: 'Backend Seguro',
    subtitle: 'APIs, auth, regras de negocio, bancos, filas, cache e observabilidade.',
    track: 'backend',
    color: 'violet',
    chapters: ['Node', 'APIs', 'SQL', 'Auth', 'Mensageria'],
    capstone: 'Criar uma API multiusuario com login, auditoria, testes e cache.',
  },
  {
    id: 'world-platform',
    title: 'Cloud & DevOps',
    subtitle: 'Deploy previsivel, Docker, CI/CD, Kubernetes, monitoramento e incidentes.',
    track: 'devops',
    color: 'orange',
    chapters: ['Docker', 'CI/CD', 'Kubernetes', 'Cloud', 'Tracing'],
    capstone: 'Publicar um produto containerizado com pipeline e painel de saude.',
  },
  {
    id: 'world-fullstack',
    title: 'Fullstack Quest',
    subtitle: 'Produtos completos com front, backend, banco, deploy e decisao tecnica.',
    track: 'fullstack',
    color: 'green',
    chapters: ['Requisitos', 'Design', 'API', 'Banco', 'Entrega'],
    capstone: 'Construir um produto de ponta a ponta simulando uma empresa real.',
  },
  {
    id: 'world-ai',
    title: 'IA Aplicada',
    subtitle: 'Prompts, agentes, RAG, automacoes e copilotos para acelerar projetos.',
    track: 'ia',
    color: 'pink',
    chapters: ['Prompting', 'APIs', 'RAG', 'Agentes', 'MCP'],
    capstone: 'Criar um assistente de estudos que gera revisoes e desafios pelo historico.',
  },
];

export const projectCampaigns: ProjectCampaign[] = [
  {
    id: 'campaign-bank',
    title: 'Banco Digital',
    company: 'Fintech em crescimento',
    difficulty: 'Avancado',
    duration: '6 sprints',
    reward: '3.800 XP + badge Arquiteto',
    sprints: [
      { title: 'Conta e login', goal: 'Criar auth, sessao e protecao de rotas.', output: 'Fluxo de login validado.' },
      { title: 'Extrato e saldo', goal: 'Modelar transacoes e consultas paginadas.', output: 'API de extrato com filtros.' },
      { title: 'Transferencia', goal: 'Garantir consistencia e regras de negocio.', output: 'Operacao atomica com testes.' },
      { title: 'Seguranca', goal: 'Adicionar auditoria, rate limit e permissoes.', output: 'Checklist OWASP aplicado.' },
    ],
  },
  {
    id: 'campaign-streaming',
    title: 'Streaming App',
    company: 'Plataforma de conteudo',
    difficulty: 'Intermediario',
    duration: '5 sprints',
    reward: '2.950 XP + tema Neon',
    sprints: [
      { title: 'Catalogo', goal: 'Criar home com busca, filtros e estados.', output: 'UI responsiva com cards.' },
      { title: 'Player', goal: 'Controlar estado, progresso e qualidade.', output: 'Player com controles.' },
      { title: 'Performance', goal: 'Otimizar imagens, lazy loading e bundle.', output: 'Relatorio de melhorias.' },
      { title: 'Personalizacao', goal: 'Salvar favoritos e continuar assistindo.', output: 'Persistencia local.' },
    ],
  },
  {
    id: 'campaign-delivery',
    title: 'Delivery em Tempo Real',
    company: 'Operacao local',
    difficulty: 'Avancado',
    duration: '7 sprints',
    reward: '4.500 XP + rank Especialista',
    sprints: [
      { title: 'Cardapio', goal: 'Criar fluxo de loja, carrinho e checkout.', output: 'Pedido criado.' },
      { title: 'Tempo real', goal: 'Atualizar status do pedido com eventos.', output: 'Canal de status.' },
      { title: 'Roteamento', goal: 'Modelar entregador, area e estimativa.', output: 'Simulador de rota.' },
      { title: 'Observabilidade', goal: 'Monitorar falhas e tempo de resposta.', output: 'Painel de incidentes.' },
    ],
  },
];

export const careerLadder: CareerRank[] = [
  { title: 'Aprendiz', level: 1, responsibility: 'Criar rotina, entender fundamentos e completar missoes curtas.', unlock: 'Aulas narrativas' },
  { title: 'Estagiario', level: 5, responsibility: 'Resolver tarefas pequenas com ajuda de checklists.', unlock: 'Arcade e revisoes' },
  { title: 'Junior', level: 12, responsibility: 'Entregar tickets simples, escrever codigo legivel e explicar escolhas.', unlock: 'Modo empresa' },
  { title: 'Junior Avancado', level: 18, responsibility: 'Depurar problemas reais e conectar front, API e dados.', unlock: 'Boss fights' },
  { title: 'Pleno', level: 28, responsibility: 'Tomar decisoes tecnicas com contexto de produto.', unlock: 'Campanhas fullstack' },
  { title: 'Senior', level: 40, responsibility: 'Projetar solucoes resilientes, revisar arquitetura e reduzir riscos.', unlock: 'Laboratorios avancados' },
  { title: 'Tech Lead', level: 55, responsibility: 'Guiar pessoas, priorizar trade-offs e proteger qualidade de entrega.', unlock: 'Simulador de lideranca' },
  { title: 'Staff', level: 72, responsibility: 'Criar sistemas, padroes e estrategias para varios times.', unlock: 'Missoes de escala' },
];

export const reviewQueue: ReviewItem[] = [
  {
    id: 'review-event-loop',
    topic: 'Event Loop',
    prompt: 'Explique por que uma tarefa pesada pode congelar a interface mesmo sem erro no console.',
    answer: 'Porque JavaScript executa trabalho sincrono na main thread; se uma funcao ocupa essa fila por muito tempo, a UI nao consegue renderizar nem responder eventos.',
    due: 'Hoje',
    strength: 42,
  },
  {
    id: 'review-jwt',
    topic: 'JWT e seguranca',
    prompt: 'Qual e o risco de guardar token sensivel em localStorage?',
    answer: 'Scripts maliciosos podem acessar o valor em caso de XSS. Em muitos cenarios, cookies HttpOnly e boas regras de expiracao reduzem o risco.',
    due: 'Hoje',
    strength: 57,
  },
  {
    id: 'review-sql',
    topic: 'SQL JOIN',
    prompt: 'Quando um LEFT JOIN retorna linhas com campos nulos do lado direito?',
    answer: 'Quando existe registro na tabela da esquerda, mas nenhum registro correspondente na tabela da direita.',
    due: 'Amanha',
    strength: 64,
  },
  {
    id: 'review-docker',
    topic: 'Docker',
    prompt: 'Qual diferenca pratica entre imagem e container?',
    answer: 'Imagem e o pacote imutavel com instrucoes e arquivos. Container e uma execucao dessa imagem com estado de runtime.',
    due: '2 dias',
    strength: 71,
  },
];

export const skillTree: SkillCluster[] = [
  {
    title: 'Pensamento de produto',
    mastery: 63,
    skills: [
      { label: 'Quebrar problemas', level: 4, evidence: 'Transforma pedidos vagos em requisitos testaveis.' },
      { label: 'Priorizar entrega', level: 3, evidence: 'Separa essencial de acabamento.' },
      { label: 'Comunicar trade-offs', level: 3, evidence: 'Explica custo, risco e beneficio.' },
    ],
  },
  {
    title: 'Engenharia frontend',
    mastery: 58,
    skills: [
      { label: 'Layout responsivo', level: 4, evidence: 'Cria telas sem sobreposicao.' },
      { label: 'Estado de UI', level: 3, evidence: 'Modela carregamento, erro e vazio.' },
      { label: 'Performance', level: 2, evidence: 'Reconhece gargalos de renderizacao.' },
    ],
  },
  {
    title: 'Engenharia backend',
    mastery: 46,
    skills: [
      { label: 'APIs REST', level: 4, evidence: 'Define rotas, status e contratos.' },
      { label: 'Auth', level: 3, evidence: 'Protege recursos e sessoes.' },
      { label: 'Dados', level: 2, evidence: 'Modela entidades e relacoes.' },
    ],
  },
  {
    title: 'Entrega profissional',
    mastery: 39,
    skills: [
      { label: 'Testes', level: 2, evidence: 'Cobre regra critica.' },
      { label: 'Deploy', level: 2, evidence: 'Publica versoes previsiveis.' },
      { label: 'Observabilidade', level: 1, evidence: 'Lida com logs e metricas.' },
    ],
  },
];

export const achievementCatalog = [
  { title: 'Primeira Sprint', description: 'Entregue uma tarefa de laboratorio.', points: 50 },
  { title: 'Mente de Debug', description: 'Resolva 10 casos de investigacao.', points: 120 },
  { title: 'Constancia 30', description: 'Mantenha 30 dias de sequencia.', points: 300 },
  { title: 'Boss Slayer', description: 'Venca 5 chefes de modulo.', points: 420 },
  { title: 'Fullstack Hero', description: 'Finalize um produto completo.', points: 700 },
  { title: 'Tech Lead Mindset', description: 'Complete missoes de arquitetura e decisao.', points: 900 },
];

export const marketplace: MarketplaceItem[] = [
  { id: 'theme-torchlight', title: 'Tema Torchlight', type: 'Tema', price: 0, rarity: 'Comum', description: 'O tema padrao: masmorra escura a luz de tocha, dourado e rubi.' },
  { id: 'theme-arcane', title: 'Tema Arcano', price: 900, type: 'Tema', rarity: 'Raro', description: 'Masmorra magica em tons de violeta e teal, para quem prefere feiticaria.' },
  { id: 'theme-parchment', title: 'Tema Pergaminho', type: 'Tema', price: 900, rarity: 'Raro', description: 'Modo claro: mapa do tesouro a luz do dia, para leitura confortavel.' },
  { id: 'wallpaper-ember', title: 'Wallpaper Brasas', type: 'Wallpaper', price: 500, rarity: 'Comum', description: 'Fundo com brasas suaves atras do menu lateral.' },
  { id: 'wallpaper-aurora', title: 'Wallpaper Aurora', type: 'Wallpaper', price: 1100, rarity: 'Epico', description: 'Fundo com um brilho de aurora esverdeada, sutil e elegante.' },
  { id: 'wallpaper-nebula', title: 'Wallpaper Nebulosa', type: 'Wallpaper', price: 1400, rarity: 'Lendario', description: 'Fundo com nebulosa arroxeada, para quem quer um visual unico.' },
  { id: 'avatar-scholar', title: 'Avatar Estudioso', type: 'Avatar', price: 300, rarity: 'Comum', description: 'Icone de formatura, para quem esta comecando a jornada.' },
  { id: 'avatar-warrior', title: 'Avatar Guerreiro', type: 'Avatar', price: 800, rarity: 'Raro', description: 'Icone de espadas cruzadas, para quem enfrenta boss fights.' },
  { id: 'avatar-explorer', title: 'Avatar Explorador', type: 'Avatar', price: 800, rarity: 'Raro', description: 'Icone de mapa, para quem completa a trilha inteira.' },
  { id: 'avatar-architect', title: 'Avatar Arquiteto', type: 'Avatar', price: 1500, rarity: 'Lendario', description: 'Icone de castelo, liberado para quem conclui campanhas de sistema.' },
  { id: 'boost-review', title: 'Boost de Revisao', type: 'Boost', price: 400, rarity: 'Comum', description: 'Duplica XP de revisao ativa por um dia.' },
  { id: 'boost-streak-shield', title: 'Escudo de Sequencia', type: 'Boost', price: 600, rarity: 'Raro', description: 'Protege sua sequencia de dias caso perca um dia de estudo.' },
];
