# 🚀 DevJourney — Full Stack do Zero ao Sênior

Um app pessoal, gamificado, de estudos — construído a partir do seu plano de carreira de 18 meses para se tornar desenvolvedor(a) Full Stack.

Funciona como **web app** (qualquer navegador) e como **app instalável no celular** (PWA — sem precisar de loja de aplicativos).

## DevQuest 2.0 completa

Esta versão foi reformulada como uma plataforma de aprendizado em formato RPG profissional. A interface principal agora inclui:

- Command Center com plano diário, XP, moedas, temporadas e inteligência de estudo
- Bloqueio comercial: Conta e plano ativo antes de liberar qualquer área de conteúdo
- Interface principal em português, inglês e espanhol
- Mundos de conhecimento com trilhas, capstones e módulos conectados ao conteúdo real
- Sala de Aula com conteúdo primeiro e exercícios liberados depois da aula concluída
- Modo História com escolhas, consequências e descoberta pedagógica
- Laboratório estilo IDE com explorer, editor, terminal e sprints
- Arcade técnico com modos rápidos de fixação
- Carreira simulada por ranks, responsabilidades e desbloqueios
- Revisão inteligente por força de memória
- Analytics de habilidades, conquistas e estatísticas de produto
- Loja de recompensas, temas e desbloqueios

## Modo comercial

Esta entrega tambem inclui backend comercial em `server/server.mjs`:

- cadastro e login de usuarios;
- senha com hash `scrypt` e salt;
- token de sessao assinado;
- planos Starter, Pro e Vitalicio;
- checkout Mercado Pago por plano;
- webhook que libera licenca apos pagamento aprovado;
- ativacao manual de licencas;
- progresso salvo na nuvem;
- endpoints admin para gerar licencas e confirmar venda direta;
- headers de seguranca, validacao de entrada, bloqueio de login e rate limit basico;
- **todos os dados (usuarios, licencas, pedidos, progresso e eventos) ficam no Supabase (Postgres gerenciado)**, nao em arquivo local.

Para rodar a versao completa:

```bash
npm install
npm run dev
```

Antes do primeiro `npm run dev`, configure o Supabase (crie o projeto, rode
`supabase/schema.sql` e preencha `.env` com `SUPABASE_URL` e
`SUPABASE_SERVICE_ROLE_KEY`) — veja o passo a passo em
`PRIMEIROS_PASSOS_SUPABASE.md`. Sem isso o servidor recusa iniciar e explica
o que falta.

Depois acesse o endereço do Vite mostrado no terminal. O comando sobe frontend e backend juntos; o login deixa de ficar offline no ambiente local.

Veja `COMMERCIAL_DEPLOY.md` para deploy e criacao de licencas.

O build de produção foi validado com `npm run build`.

## ✨ O que tem aqui

- **22 módulos** em 4 fases: Fundamentos → Especialização → Integração Full Stack → **Extras de Mercado** (Segurança/Hacking Ético, Python, Go, MongoDB e Redis) — cobrindo Lógica → HTML/CSS → JavaScript → Git/SQL → Node.js → React/TS → Java/Spring → Docker → Next.js → APIs avançadas → AWS → Microsserviços → Kubernetes → CI/CD → System Design → Liderança/Inglês → Projeto Final → Segurança → Python → Go → MongoDB/Redis
- **196 lições escritas** com explicações, exemplos de código, e por quês — não só links, incluindo lições marcadas **[Nível sênior]** nos pontos onde entrevistas de vagas sêniores cobram mais profundidade (complexidade amortizada, isolamento de transações e deadlocks, Virtual DOM/Suspense, Outbox Pattern, estimativa de capacidade, consistent hashing, feedback difícil, influência sem autoridade)
- **42 diagramas interativos e animados** nas lições mais conceituais, em todos os 22 módulos: pilha vs fila, recursão, Event Loop, closures, CSS Grid/Box Model, JOINs de SQL, pipeline de middlewares, árvore de componentes React, Java Streams, multi-stage Docker, SSR vs SSG vs ISR, GraphQL vs REST, Load Balancer, padrão Saga, Pods e Probes do Kubernetes, pipeline CI/CD, sharding, comunicação síncrona vs assíncrona, arquitetura em camadas, CAP Theorem, validação de dados, princípios SOLID, otimização de imagens, WebSocket vs Polling, permissões IAM, tracing distribuído, estrutura de ADR, SQL Injection, hash/salt de senha, list comprehension em Python, goroutines/channels em Go, cache hit/miss com Redis, e mais
- **Cenários do dia a dia** em todos os módulos — situações reais de trabalho de um dev (bugs em produção, code review, deploy) e de uso pessoal de lógica, sempre no formato "o que acontece → como resolver"
- **Modo Entrevista**: simulação completa com perguntas teóricas atualizadas (cronometradas), desafios práticos de código, e perguntas comportamentais com dicas de estrutura de resposta — por trilha (Frontend/Backend/Full Stack) e nível (Júnior/Pleno/Sênior)
- **224 exercícios interativos** em 5 formatos: múltipla escolha, completar código, ordenar passos, associar pares, verdadeiro/falso
- **Glossário clicável**: termos técnicos destacados no texto (tipo {{api}}) abrem um popup com explicação direto na lição, sem precisar sair da tela
- **30 mini-jogos** únicos, vários com níveis progressivos de dificuldade
- **Sistema de gamificação completo**: XP, níveis, sequência de estudo (streak) com mapa de constância estilo GitHub, conquistas com confetti
- **Visual neon cyberpunk**: paleta vibrante (menta, magenta, violeta, ciano elétrico) sobre fundo escuro arroxeado, com glow e scanlines sutis
- **Múltiplos perfis no mesmo navegador**: cada pessoa cria seu perfil com nome (e PIN opcional), e o progresso fica separado por perfil
- **Sistema comercial** com conta, licenca, plano e progresso em nuvem quando o backend esta ativo
- **Trava correta de venda**: sem login e sem assinatura ativa, o aluno permanece na tela Conta

## 🖥️ Como rodar localmente

Pré-requisito: [Node.js](https://nodejs.org) 18 ou mais recente.

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (geralmente `http://localhost:5173`).

## 📱 Como instalar no celular

1. Suba o projeto para produção (veja "Deploy" abaixo) ou rode `npm run dev -- --host` na sua rede local e acesse pelo celular
2. Abra o endereço no navegador do celular (Chrome no Android, Safari no iPhone)
3. Toque no menu do navegador → **"Adicionar à tela inicial"** ou **"Instalar app"**
4. O DevJourney passa a abrir como um app normal, com ícone próprio

## ☁️ Deploy gratuito

Qualquer um destes funciona bem com este projeto (é só Vite + React, sem backend):

- **Vercel**: `npm i -g vercel` → `vercel`
- **Netlify**: arraste a pasta `dist` (depois de `npm run build`) em [app.netlify.com/drop](https://app.netlify.com/drop)
- **GitHub Pages**: rode `npm run build` e publique a pasta `dist` numa branch `gh-pages`

## 🧠 Revisão espaçada

Sempre que você resolve um exercício, ele entra num ciclo de revisão (1 → 3 → 7 → 16 → 35 → 90 dias). Quando algum exercício "vence", ele aparece direto no Painel, na seção "Revisão espaçada" — é a forma mais eficaz de não esquecer o que você já estudou. Errar uma revisão volta o intervalo para o início.

## 📂 Notas de projeto

Em qualquer módulo, na aba Checklist (ou Projeto, quando houver), você pode salvar notas pessoais e links (ex: o repositório no GitHub daquele projeto) — fica salvo com seu perfil, num lugar só.

## 🔍 Busca global

Aperte `Ctrl+K` (ou `⌘K` no Mac) em qualquer tela, ou clique em "Buscar" no topo, para encontrar módulos, lições, exercícios e jogos por palavra-chave.

## 💾 Backup exportável

Em Configurações, exporte seu progresso completo como um arquivo `.json` a qualquer momento, e importe de volta se precisar (trocar de computador, restaurar depois de limpar o navegador). Isso é separado por perfil.

## 🎯 Modo Entrevista

Acesse pelo menu lateral (destacado em ciano). Escolha sua trilha (Frontend, Backend ou Full Stack) e nível (Júnior, Pleno, Sênior), e passe pelas 3 etapas:

1. **Teoria** — 10 perguntas de múltipla escolha cronometradas (40s cada), cobrindo desde fundamentos até tópicos atuais como boas práticas com IA no desenvolvimento e observabilidade.
2. **Prática** — 3 desafios reais de completar código, com dica opcional e comparação com uma abordagem ideal.
3. **Comportamental** — 4 perguntas estilo "me conte sobre um desafio que você enfrentou", com dica do que avaliadores procuram e de como estruturar a resposta (STAR).

No final, você recebe uma pontuação por etapa e uma nota geral. Suas últimas 5 tentativas ficam visíveis na tela inicial do Modo Entrevista, com indicação se você melhorou ou piorou desde a última vez. É uma ferramenta de prática, não uma nota oficial — o valor está em repetir.

## 🧪 Laboratório Prático

Acesse pelo menu lateral. São 4 sandboxes isolados para testar de verdade o que você estudou, sem nenhum deles se conectar a sistemas reais ou salvar nada entre sessões:

- **Layout & CSS** — edite CSS num textarea e veja o resultado mudar ao vivo num preview ao lado, com presets rápidos de flexbox/grid para começar.
- **Git na prática** — um terminal simulado onde você cria arquivos, e roda comandos Git reais (`git add`, `git commit -m "..."`, `git branch`, `git checkout`) contra um repositório fake guardado só na memória do navegador.
- **Segurança** — um login propositalmente vulnerável a SQL Injection, ao lado da versão corrigida com query parametrizada. Tudo simulado: não existe banco de dados real nem servidor, é só uma demonstração visual de como o ataque (e a defesa) funcionam.
- **Dados** — uma "tabela" editável onde você adiciona/remove linhas e roda filtros para ver como uma query muda o resultado.

## 👤 Perfis (múltiplas pessoas, mesmo navegador)

Na primeira vez que abrir o app, você cria um perfil com um nome (e, se quiser, um PIN de 4+ dígitos). Esse PIN **não é uma senha de verdade** — é só uma trava simples para impedir que outra pessoa usando o mesmo navegador abra seu perfil por engano. Tudo fica salvo localmente, sem servidor.

Quer usar com mais de uma pessoa? Cada uma cria seu próprio perfil, e o progresso (XP, módulos, conquistas) fica completamente separado entre eles. Para trocar de perfil, use o botão de logout no rodapé da barra lateral.

> ⚠️ Perfis **não sincronizam entre dispositivos** — um perfil "João" criado no notebook é diferente de um perfil "João" no celular, mesmo com o mesmo nome.

## 🛠️ Stack técnica

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- React Router (navegação)
- Lucide Icons
- Phosphor Icons
- Zod
- Canvas Confetti (celebrações de conquista)
- PWA via Service Worker nativo (sem dependências externas)

## 📂 Estrutura do projeto

```
src/
  data/         conteúdo dos 22 módulos, tipos, conquistas, glossário
  components/
    games/      os mini-jogos
    layout/     sidebar, topbar
    ui/         componentes de exercício, XP bar, toasts
  hooks/        useProgress (gamificação), perfis e tema visual
  pages/        as telas do app
  utils/        utilitários locais do app
```

## 📝 Customizando seu conteúdo

Quer ajustar algum módulo, adicionar exercícios ou mudar o ritmo? Todo o conteúdo está em `src/data/modules/*.ts` — são arrays de objetos TypeScript simples, sem necessidade de tocar em nenhum componente visual.

---

Bons estudos — e bom código! 💚
