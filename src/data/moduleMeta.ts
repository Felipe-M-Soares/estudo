// Metadados mínimos de cada módulo, usados pela Sidebar (e outros lugares que só
// precisam de id/título/emoji para navegação) sem precisar importar o conteúdo
// completo de lições, exercícios e diagramas de cada módulo — isso mantém o
// bundle inicial pequeno mesmo com 22 módulos de conteúdo extenso.
//
// IMPORTANTE: se um módulo novo for adicionado em src/data/modules/, adicione a
// entrada correspondente aqui também (id, month, phase, title, emoji).

export interface ModuleMeta {
  id: string;
  month: number;
  phase: number;
  title: string;
  emoji: string;
  tagline: string;
}

export interface PhaseInfo {
  phase: number;
  title: string;
  objective: string;
  months: number[];
  color: string;
}

export const phases: PhaseInfo[] = [
  {
    phase: 1,
    title: 'Fundamentos',
    objective: 'Construir a base sólida',
    months: [1, 2, 3, 4, 5, 6],
    color: 'mint',
  },
  {
    phase: 2,
    title: 'Especialização',
    objective: 'Aprofundar em tecnologias modernas',
    months: [7, 8, 9, 10, 11, 12],
    color: 'amber',
  },
  {
    phase: 3,
    title: 'Integração Full Stack',
    objective: 'Arquitetura e escalabilidade',
    months: [13, 14, 15, 16, 17, 18],
    color: 'violet',
  },
  {
    phase: 4,
    title: 'Extras de Mercado',
    objective: 'Outras linguagens, bancos e segurança',
    months: [19, 20, 21, 22],
    color: 'cyan',
  },
];

export const moduleMetas: ModuleMeta[] = [
  { id: 'mes-01', month: 1, phase: 1, title: 'Lógica de Programação', emoji: '🧩', tagline: 'Antes da sintaxe, o raciocínio.' },
  { id: 'mes-02', month: 2, phase: 1, title: 'HTML5 & CSS3', emoji: '🎨', tagline: 'A estrutura e a aparência de tudo que existe na web.' },
  { id: 'mes-03', month: 3, phase: 1, title: 'JavaScript (ES6+)', emoji: '⚡', tagline: 'A linguagem que dá vida à página.' },
  { id: 'mes-04', month: 4, phase: 1, title: 'Git & SQL', emoji: '🗃️', tagline: 'Versionar código e modelar dados — as duas habilidades invisíveis que todo dev usa todo dia.' },
  { id: 'mes-05', month: 5, phase: 1, title: 'Node.js & Express', emoji: '🟩', tagline: 'JavaScript saindo do navegador para virar um servidor de verdade.' },
  { id: 'mes-06', month: 6, phase: 1, title: 'Projeto Integrador 1', emoji: '🏗️', tagline: 'Tudo que você aprendeu nos últimos 5 meses, junto, funcionando.' },
  { id: 'mes-07', month: 7, phase: 2, title: 'React + TypeScript', emoji: '⚛️', tagline: 'Componentes, estado, e tipos que pegam erros antes do navegador.' },
  { id: 'mes-08', month: 8, phase: 2, title: 'Java & Spring Boot', emoji: '☕', tagline: 'A linguagem mais usada em sistemas corporativos do mundo, com o framework que a moderniza.' },
  { id: 'mes-09', month: 9, phase: 2, title: 'Docker & Containerização', emoji: '🐳', tagline: '"Funciona na minha máquina" deixa de ser desculpa.' },
  { id: 'mes-10', month: 10, phase: 2, title: 'Next.js', emoji: '⚡', tagline: 'React com superpoderes de servidor.' },
  { id: 'mes-11', month: 11, phase: 2, title: 'APIs Avançadas', emoji: '🔌', tagline: 'Além do REST: GraphQL, tempo real e documentação que não mente.' },
  { id: 'mes-12', month: 12, phase: 2, title: 'AWS Cloud', emoji: '☁️', tagline: 'Tirando sua aplicação do seu computador e pondo no mundo.' },
  { id: 'mes-13', month: 13, phase: 3, title: 'Microsserviços', emoji: '🧩', tagline: 'Quebrando um sistema gigante em pedaços que evoluem sozinhos.' },
  { id: 'mes-14', month: 14, phase: 3, title: 'Kubernetes', emoji: '☸️', tagline: 'O sistema operacional dos containers em escala.' },
  { id: 'mes-15', month: 15, phase: 3, title: 'CI/CD & Observabilidade', emoji: '⚙️', tagline: 'Automatizando o caminho do código até produção, e vendo o que acontece depois.' },
  { id: 'mes-16', month: 16, phase: 3, title: 'System Design', emoji: '🏛️', tagline: 'Pensar em sistemas, não só em código.' },
  { id: 'mes-17', month: 17, phase: 3, title: 'Liderança & Inglês', emoji: '🗣️', tagline: 'A parte da carreira que o código não ensina.' },
  { id: 'mes-18', month: 18, phase: 3, title: 'Projeto Final Full Stack', emoji: '🏆', tagline: 'Tudo que você construiu nos últimos 17 meses, em um único sistema.' },
  { id: 'mes-19', month: 19, phase: 4, title: 'Segurança e Hacking Ético', emoji: '🛡️', tagline: 'Pensar como atacante pra defender melhor.' },
  { id: 'mes-20', month: 20, phase: 4, title: 'Python', emoji: '🐍', tagline: 'A linguagem mais pedida em data, IA e automação.' },
  { id: 'mes-21', month: 21, phase: 4, title: 'Go (Golang)', emoji: '🐹', tagline: 'A linguagem por trás de Docker, Kubernetes e meio mundo da infra moderna.' },
  { id: 'mes-22', month: 22, phase: 4, title: 'MongoDB e Redis', emoji: '🍃', tagline: 'Banco de documentos e cache, os dois NoSQL mais usados do mercado.' },
];
