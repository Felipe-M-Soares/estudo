import { useMemo, useState } from 'react';
import {
  Award,
  BarChart3,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Code2,
  Crown,
  Flame,
  Gamepad2,
  GraduationCap,
  Home,
  Layers3,
  Lock,
  Map,
  Medal,
  Menu,
  Moon,
  Search,
  Sparkles,
  Star,
  Swords,
  Target,
  Trophy,
  X,
  Zap,
} from 'lucide-react';
import { modules } from './data';

type Screen = 'dashboard' | 'academy' | 'story' | 'labs' | 'arcade' | 'career' | 'ai' | 'stats';
type Theme = 'aurora' | 'cyber' | 'royal';

const tracks = [
  { id: 'frontend', name: 'Frontend', icon: '🎨', color: 'cyan', description: 'Interfaces, React, performance e experiência visual.' },
  { id: 'backend', name: 'Backend', icon: '🧠', color: 'violet', description: 'APIs, autenticação, bancos, cache e arquitetura.' },
  { id: 'devops', name: 'DevOps & Cloud', icon: '🚀', color: 'orange', description: 'Docker, CI/CD, Kubernetes, deploy e observabilidade.' },
  { id: 'fullstack', name: 'Fullstack Pro', icon: '⚔️', color: 'green', description: 'Projetos completos simulando empresas reais.' },
  { id: 'ia', name: 'IA Aplicada', icon: '🤖', color: 'pink', description: 'Prompts, agentes, automações, RAG e copilotos.' },
  { id: 'career', name: 'Carreira Tech', icon: '🏆', color: 'gold', description: 'Entrevistas, portfólio, comunicação e liderança.' },
];

const bossFights = [
  { title: 'Boss API REST', xp: 800, timer: '45 min', objective: 'Criar autenticação, rotas protegidas, paginação e tratamento de erro.' },
  { title: 'Boss React Performance', xp: 950, timer: '50 min', objective: 'Encontrar gargalos, memorizar componentes e cortar renderizações inúteis.' },
  { title: 'Boss Deploy Sem Medo', xp: 1100, timer: '60 min', objective: 'Containerizar app, criar pipeline e publicar uma versão estável.' },
];

const achievements = [
  ['Primeiro Commit', 'Conclua sua primeira missão'],
  ['Debug Master', 'Resolva 25 bugs simulados'],
  ['Streak de Ferro', 'Estude por 30 dias seguidos'],
  ['Arquiteto', 'Finalize 5 laboratórios de sistema'],
  ['Boss Slayer', 'Vença 10 chefões'],
  ['Mentorável', 'Use IA para revisar 50 respostas'],
  ['Fullstack Hero', 'Complete a trilha fullstack'],
  ['Tech Lead', 'Finalize o modo carreira'],
];

const dailyMissions = [
  { label: 'Revisar Event Loop', meta: '5 min', xp: 80, type: 'Revisão ativa' },
  { label: 'Resolver 8 exercícios de API', meta: '12 min', xp: 160, type: 'Treino rápido' },
  { label: 'Corrigir bug de autenticação', meta: '10 min', xp: 220, type: 'Debug mode' },
  { label: 'Continuar Sprint do projeto', meta: '18 min', xp: 300, type: 'Laboratório' },
];

const worldNodes = modules.slice(0, 22).map((m, i) => ({
  ...m,
  status: i < 3 ? 'done' : i === 3 ? 'active' : i < 12 ? 'open' : 'locked',
  power: Math.min(99, 18 + i * 4),
}));

const careerSteps = ['Estagiário', 'Júnior', 'Júnior Avançado', 'Pleno', 'Pleno Pro', 'Sênior', 'Especialista', 'Tech Lead', 'Staff Engineer', 'Principal'];

export default function App() {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [theme, setTheme] = useState<Theme>('aurora');
  const [navOpen, setNavOpen] = useState(false);
  const [activeModule, setActiveModule] = useState(worldNodes[3]);
  const [query, setQuery] = useState('');

  const filteredModules = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return worldNodes;
    return worldNodes.filter((m) => `${m.title} ${m.tagline} ${m.track}`.toLowerCase().includes(q));
  }, [query]);

  const completedPercent = 34;
  const xp = 12450;
  const level = 18;

  const nav = [
    { id: 'dashboard', label: 'Command Center', icon: Home },
    { id: 'academy', label: 'Academia', icon: GraduationCap },
    { id: 'story', label: 'Modo História', icon: Map },
    { id: 'labs', label: 'Laboratórios', icon: Code2 },
    { id: 'arcade', label: 'Arcade', icon: Gamepad2 },
    { id: 'career', label: 'Carreira', icon: BriefcaseBusiness },
    { id: 'ai', label: 'Mentor IA', icon: Bot },
    { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
  ] as const;

  return (
    <div className={`mega-app theme-${theme}`}>
      <aside className={`mega-sidebar ${navOpen ? 'open' : ''}`}>
        <div className="brand-card">
          <div className="brand-orb"><Zap size={26} /></div>
          <div>
            <strong>DevQuest 2.0</strong>
            <span>RPG de aprendizado técnico</span>
          </div>
          <button className="mobile-close" onClick={() => setNavOpen(false)}><X size={20} /></button>
        </div>

        <div className="profile-card">
          <div className="avatar">👨‍💻</div>
          <div>
            <strong>Felipe</strong>
            <span>Lv {level} • Programador</span>
          </div>
        </div>

        <nav className="side-nav">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = screen === item.id;
            return (
              <button key={item.id} className={active ? 'active' : ''} onClick={() => { setScreen(item.id as Screen); setNavOpen(false); }}>
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-progress">
          <div className="row"><span>Progresso global</span><strong>{completedPercent}%</strong></div>
          <div className="progress"><i style={{ width: `${completedPercent}%` }} /></div>
          <small>Próximo título: Desenvolvedor Pleno</small>
        </div>
      </aside>

      <div className="mega-main">
        <header className="topbar">
          <button className="hamburger" onClick={() => setNavOpen(true)}><Menu /></button>
          <div className="search-box"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Pesquisar aulas, missões, bugs, projetos..." /></div>
          <div className="top-stats">
            <span><Flame size={16} />15 dias</span>
            <span><Star size={16} />{xp.toLocaleString('pt-BR')} XP</span>
            <span><Crown size={16} />Lv {level}</span>
          </div>
          <button className="theme-btn" onClick={() => setTheme(theme === 'aurora' ? 'cyber' : theme === 'cyber' ? 'royal' : 'aurora')}><Moon size={18} /> Tema</button>
        </header>

        <main className="content-shell">
          {screen === 'dashboard' && <Dashboard setScreen={setScreen} completedPercent={completedPercent} />}
          {screen === 'academy' && <Academy modules={filteredModules} activeModule={activeModule} setActiveModule={setActiveModule} />}
          {screen === 'story' && <StoryMode activeModule={activeModule} />}
          {screen === 'labs' && <Labs />}
          {screen === 'arcade' && <Arcade />}
          {screen === 'career' && <Career />}
          {screen === 'ai' && <MentorAI activeModule={activeModule} />}
          {screen === 'stats' && <Stats />}
        </main>
      </div>
    </div>
  );
}

function Dashboard({ setScreen, completedPercent }: { setScreen: (screen: Screen) => void; completedPercent: number }) {
  return (
    <section className="page-stack">
      <div className="hero-grid">
        <div className="hero-card">
          <span className="eyebrow"><Sparkles size={16} /> Plataforma 2.0 → 5.0</span>
          <h1>Seu centro de treinamento para virar desenvolvedor completo.</h1>
          <p>Missões diárias, aulas narrativas, projetos reais, revisão inteligente, IA contextual, arcade, carreira simulada e boss fights em uma experiência única.</p>
          <div className="hero-actions">
            <button onClick={() => setScreen('academy')} className="primary">Continuar jornada <ChevronRight size={18} /></button>
            <button onClick={() => setScreen('labs')} className="secondary">Abrir laboratório</button>
          </div>
        </div>
        <div className="rank-card">
          <div className="rank-ring"><span>{completedPercent}%</span></div>
          <h3>Rank atual</h3>
          <strong>Programador</strong>
          <p>Complete mais 4 missões para desbloquear Pleno.</p>
        </div>
      </div>

      <div className="section-head"><h2>Missão de hoje</h2><span>35 min • +760 XP</span></div>
      <div className="mission-grid">
        {dailyMissions.map((m, i) => <MissionCard key={m.label} mission={m} index={i} />)}
      </div>

      <div className="two-col">
        <Panel title="Trilhas principais" icon={<Layers3 size={20} />}>
          <div className="track-grid compact">
            {tracks.map((track) => <div className={`track-card ${track.color}`} key={track.id}><b>{track.icon} {track.name}</b><span>{track.description}</span></div>)}
          </div>
        </Panel>
        <Panel title="Boss fights liberados" icon={<Swords size={20} />}>
          <div className="boss-list">
            {bossFights.map((b) => <div className="boss-row" key={b.title}><Trophy size={19} /><div><b>{b.title}</b><span>{b.objective}</span></div><strong>{b.xp} XP</strong></div>)}
          </div>
        </Panel>
      </div>
    </section>
  );
}

function MissionCard({ mission, index }: { mission: typeof dailyMissions[number]; index: number }) {
  return <article className="mission-card"><div className="mission-index">0{index + 1}</div><span>{mission.type}</span><h3>{mission.label}</h3><p>{mission.meta} • +{mission.xp} XP</p><button>Iniciar</button></article>;
}

function Academy({ modules, activeModule, setActiveModule }: { modules: typeof worldNodes; activeModule: typeof worldNodes[number]; setActiveModule: (m: typeof worldNodes[number]) => void }) {
  return (
    <section className="academy-layout">
      <div className="academy-map">
        <div className="section-head"><h2>Mapa de conhecimento</h2><span>{modules.length} mundos</span></div>
        <div className="world-grid">
          {modules.map((m, i) => <button key={m.id} onClick={() => setActiveModule(m)} className={`world-node ${activeModule.id === m.id ? 'selected' : ''} ${m.status}`}><span className="node-emoji">{m.status === 'locked' ? '🔒' : m.emoji}</span><b>{m.title}</b><small>Mundo {i + 1} • {m.power}%</small><div className="node-bar"><i style={{ width: `${m.status === 'locked' ? 0 : m.power}%` }} /></div></button>)}
        </div>
      </div>
      <aside className="module-command">
        <span className="eyebrow"><Target size={15} /> Missão ativa</span>
        <h2>{activeModule.emoji} {activeModule.title}</h2>
        <p>{activeModule.intro || activeModule.tagline}</p>
        <div className="module-stats"><span>{activeModule.lessons.length} aulas</span><span>{activeModule.exercises.length} exercícios</span><span>{activeModule.games.length} jogos</span></div>
        <div className="lesson-list">
          {activeModule.lessons.slice(0, 5).map((lesson, i) => <div key={lesson.id} className="lesson-row"><CheckCircle2 size={18} /><div><b>{lesson.heading}</b><span>{i < 2 ? 'Concluído' : 'Disponível'}</span></div></div>)}
        </div>
        <button className="primary full">Entrar na aula</button>
      </aside>
    </section>
  );
}

function StoryMode({ activeModule }: { activeModule: typeof worldNodes[number] }) {
  const story = activeModule.storyLessons?.[0];
  return <section className="page-stack"><div className="cinema-card"><span className="eyebrow"><Map size={16} /> Story Mode</span><h1>{story?.title || 'Primeiro dia na startup'}</h1><p>{story?.mission || 'Você entrou em uma empresa em crescimento. Cada decisão técnica altera a estabilidade do produto, sua reputação e o XP recebido.'}</p><div className="story-terminal"><b>Contexto</b><span>{story?.tension || 'O sistema está lento, os usuários reclamam e a equipe precisa de uma solução ainda hoje.'}</span></div><div className="choice-grid">{(story?.choices || [{ label: 'Corrigir sem investigar', consequence: 'Rápido, mas perigoso.' }, { label: 'Ler logs e reproduzir o bug', consequence: 'Mais confiável e profissional.', correct: true }, { label: 'Reescrever tudo', consequence: 'Custo alto e risco enorme.' }]).map((c) => <button key={c.label} className={c.correct ? 'best' : ''}><b>{c.label}</b><span>{c.consequence}</span></button>)}</div></div><Panel title="Capítulos da campanha" icon={<BookOpen size={20} />}><div className="chapter-grid">{['Onboarding', 'Primeiro bug', 'Feature urgente', 'Deploy crítico', 'Incidente real', 'Promoção'].map((c, i) => <div className="chapter" key={c}><span>{i + 1}</span><b>{c}</b><small>{i < 2 ? 'Aberto' : 'Bloqueado por nível'}</small></div>)}</div></Panel></section>;
}

function Labs() {
  return <section className="page-stack"><div className="section-head"><h2>Laboratórios estilo VS Code</h2><span>Projetos reais em sprints</span></div><div className="lab-shell"><aside><b>Explorer</b>{['auth.ts', 'routes.ts', 'database.sql', 'dockerfile', 'README.md'].map((f) => <span key={f}>{f}</span>)}</aside><div className="editor"><div className="tabs"><span>auth.ts</span><span>terminal</span><span>preview</span></div><pre>{`async function login(req, res) {\n  const user = await db.user.findUnique({ email })\n  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' })\n  const token = signJwt({ sub: user.id })\n  return res.json({ token })\n}`}</pre></div><aside className="brief"><b>Sprint atual</b><h3>Login seguro com JWT</h3><p>Objetivo: criar autenticação, refresh token, proteção de rotas e checklist de segurança.</p><button className="primary full">Validar entrega</button></aside></div></section>;
}

function Arcade() {
  const games = ['Quiz Rush', 'Debug Arena', 'Memory Code', 'Speed Typing', 'Boss Fight', 'Flashcards', 'SQL Duel', 'API Builder'];
  return <section className="page-stack"><div className="section-head"><h2>Arcade de aprendizado</h2><span>Jogos rápidos para fixação</span></div><div className="arcade-grid">{games.map((g, i) => <article className="game-card" key={g}><div className="game-icon">{['⚡','🐞','🧩','⌨️','👹','🃏','🗃️','🔌'][i]}</div><h3>{g}</h3><p>Treino rápido com pontuação, combo, tempo e recompensa de XP.</p><button>Jogar</button></article>)}</div></section>;
}

function Career() {
  return <section className="page-stack"><div className="section-head"><h2>Carreira simulada</h2><span>De estagiário a principal engineer</span></div><div className="career-road">{careerSteps.map((step, i) => <div className={`career-step ${i < 3 ? 'done' : i === 3 ? 'active' : ''}`} key={step}><div>{i < 3 ? <CheckCircle2 /> : i === 3 ? <Crown /> : <Lock />}</div><b>{step}</b><span>{i < 3 ? 'Concluído' : i === 3 ? 'Atual' : 'Bloqueado'}</span></div>)}</div><Panel title="Tickets da empresa" icon={<BriefcaseBusiness size={20} />}><div className="ticket-grid">{['Corrigir login no Safari', 'Criar endpoint de pagamento', 'Reduzir bundle inicial', 'Criar testes de integração'].map((t) => <div className="ticket" key={t}><b>BUG #{Math.floor(Math.random()*800)+100}</b><h3>{t}</h3><p>Recompensa: XP + reputação técnica.</p></div>)}</div></Panel></section>;
}

function MentorAI({ activeModule }: { activeModule: typeof worldNodes[number] }) {
  return <section className="page-stack"><div className="ai-card"><span className="eyebrow"><Bot size={16} /> Mentor contextual</span><h1>IA integrada em cada aula, exercício e projeto.</h1><p>O mentor sabe qual módulo você está estudando: <b>{activeModule.title}</b>. Ele pode explicar de outro jeito, gerar exercícios, criar flashcards e revisar suas respostas.</p><div className="prompt-grid">{['Explique de forma simples', 'Crie 5 exercícios', 'Me faça perguntas', 'Mostre analogia', 'Aumente a dificuldade', 'Gere flashcards', 'Revise meu código', 'Monte plano diário'].map((p) => <button key={p}>{p}</button>)}</div></div></section>;
}

function Stats() {
  return <section className="page-stack"><div className="stats-grid">{[['Horas estudadas','128h'],['Exercícios','1.842'],['Acertos','86%'],['Boss fights','12'],['Projetos','9'],['Revisões','340']].map(([k,v]) => <div className="stat-card" key={k}><span>{k}</span><b>{v}</b><div className="fake-chart"><i /><i /><i /><i /><i /></div></div>)}</div><Panel title="Conquistas épicas" icon={<Award size={20} />}><div className="achievement-grid">{achievements.map(([a,b], i) => <div className={`achievement ${i < 4 ? 'unlocked' : ''}`} key={a}><Medal size={22} /><b>{a}</b><span>{b}</span></div>)}</div></Panel></section>;
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <section className="panel"><div className="panel-head"><div>{icon}<h2>{title}</h2></div><button>Ver tudo</button></div>{children}</section>;
}
