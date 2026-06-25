# 🚀 DevJourney — Full Stack do Zero ao Sênior

Um app pessoal, gamificado, de estudos — construído a partir do seu plano de carreira de 18 meses para se tornar desenvolvedor(a) Full Stack.

Funciona como **web app** (qualquer navegador) e como **app instalável no celular** (PWA — sem precisar de loja de aplicativos).

## ✨ O que tem aqui

- **18 módulos** (um por mês), cobrindo Lógica → HTML/CSS → JavaScript → Git/SQL → Node.js → React/TS → Java/Spring → Docker → Next.js → APIs avançadas → AWS → Microsserviços → Kubernetes → CI/CD → System Design → Liderança/Inglês → Projeto Final
- **Conteúdo didático real** em cada módulo — explicações, exemplos de código, e por quês
- **Diagramas interativos e animados** nas lições mais conceituais: pilha vs fila, Event Loop, busca binária, Box Model do CSS, fluxo de autenticação JWT, CAP Theorem, Docker, e mais
- **Cenários do dia a dia** em todos os módulos — situações reais de trabalho de um dev (bugs em produção, code review, deploy) e de uso pessoal de lógica, sempre no formato "o que acontece → como resolver"
- **Modo Entrevista**: simulação completa com perguntas teóricas atualizadas (cronometradas), desafios práticos de código, e perguntas comportamentais com dicas de estrutura de resposta — por trilha (Frontend/Backend/Full Stack) e nível (Júnior/Pleno/Sênior)
- **~118 exercícios interativos** em 5 formatos: múltipla escolha, completar código, ordenar passos, associar pares, verdadeiro/falso
- **30 mini-jogos** únicos, vários com níveis progressivos de dificuldade
- **Sistema de gamificação completo**: XP, níveis, sequência de estudo (streak) com mapa de constância estilo GitHub, conquistas com confetti
- **Visual neon cyberpunk**: paleta vibrante (menta, magenta, violeta, ciano elétrico) sobre fundo escuro arroxeado, com glow e scanlines sutis
- **Múltiplos perfis no mesmo navegador**: cada pessoa cria seu perfil com nome (e PIN opcional), e o progresso fica separado por perfil
- **Mentor IA opcional** via API da DeepSeek, com contexto de onde você está na jornada
- **100% dos seus dados ficam no seu navegador** (localStorage) — sem backend, sem conta na nuvem, sem rastreamento

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

## 🤖 Mentor IA com contexto real

O Mentor IA agora enxerga seu desempenho real: módulos onde sua taxa de acerto está mais baixa, e quantos exercícios você tentou 3+ vezes sem sucesso. Ele usa isso pra personalizar a conversa, sem expor números de forma fria.

## 🎯 Modo Entrevista

Acesse pelo menu lateral (destacado em ciano). Escolha sua trilha (Frontend, Backend ou Full Stack) e nível (Júnior, Pleno, Sênior), e passe pelas 3 etapas:

1. **Teoria** — 10 perguntas de múltipla escolha cronometradas (40s cada), cobrindo desde fundamentos até tópicos atuais como boas práticas com IA no desenvolvimento e observabilidade.
2. **Prática** — 3 desafios reais de completar código, com dica opcional e comparação com uma abordagem ideal.
3. **Comportamental** — 4 perguntas estilo "me conte sobre um desafio que você enfrentou", com dica do que avaliadores procuram e de como estruturar a resposta (STAR).

No final, você recebe uma pontuação por etapa e uma nota geral. Suas últimas 5 tentativas ficam visíveis na tela inicial do Modo Entrevista, com indicação se você melhorou ou piorou desde a última vez. É uma ferramenta de prática, não uma nota oficial — o valor está em repetir.

## 👤 Perfis (múltiplas pessoas, mesmo navegador)

Na primeira vez que abrir o app, você cria um perfil com um nome (e, se quiser, um PIN de 4+ dígitos). Esse PIN **não é uma senha de verdade** — é só uma trava simples para impedir que outra pessoa usando o mesmo navegador abra seu perfil por engano. Tudo fica salvo localmente, sem servidor.

Quer usar com mais de uma pessoa? Cada uma cria seu próprio perfil, e o progresso (XP, módulos, conquistas) fica completamente separado entre eles. Para trocar de perfil, use o botão de logout no rodapé da barra lateral.

> ⚠️ Perfis **não sincronizam entre dispositivos** — um perfil "João" criado no notebook é diferente de um perfil "João" no celular, mesmo com o mesmo nome.

## 🤖 Configurando o Mentor IA (opcional)

O Mentor IA usa a API da DeepSeek. Isso é **opcional** — o app funciona 100% sem ele.

1. Acesse [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys) e crie uma conta/chave gratuita
2. No app, vá em **Configurações** e cole sua chave
3. Pronto — sua chave fica só no seu navegador, nunca no código

> ⚠️ **Nunca** cole sua chave de API em nenhum arquivo de código antes de subir para o GitHub. O app foi desenhado para isso nunca ser necessário: a chave é digitada por você, direto na interface, e fica salva localmente.

> 💡 **Erro 402 (Insufficient Balance)?** Isso não é um bug — significa que sua conta DeepSeek está sem saldo. Acesse [platform.deepseek.com/usage](https://platform.deepseek.com/usage) e adicione um valor pequeno de crédito; sua chave continua válida, só falta saldo para a API processar as chamadas. O app mostra essa explicação automaticamente na tela do Mentor quando isso acontece.

## 🛠️ Stack técnica

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- React Router (navegação)
- Lucide Icons
- Canvas Confetti (celebrações de conquista)
- PWA via Service Worker nativo (sem dependências externas)

## 📂 Estrutura do projeto

```
src/
  data/         conteúdo dos 18 módulos, tipos, conquistas
  components/
    games/      os mini-jogos
    layout/     sidebar, topbar
    ui/         componentes de exercício, XP bar, toasts
  hooks/        useProgress (gamificação), useSettings (chave de API)
  pages/        as telas do app
  utils/        cliente da API DeepSeek
```

## 📝 Customizando seu conteúdo

Quer ajustar algum módulo, adicionar exercícios ou mudar o ritmo? Todo o conteúdo está em `src/data/modules/*.ts` — são arrays de objetos TypeScript simples, sem necessidade de tocar em nenhum componente visual.

---

Bons estudos — e bom código! 💚
