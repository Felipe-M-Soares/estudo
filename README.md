# 🚀 DevJourney — Full Stack do Zero ao Sênior

Um app pessoal, gamificado, de estudos — construído a partir do seu plano de carreira de 18 meses para se tornar desenvolvedor(a) Full Stack.

Funciona como **web app** (qualquer navegador) e como **app instalável no celular** (PWA — sem precisar de loja de aplicativos).

## ✨ O que tem aqui

- **18 módulos** (um por mês), cobrindo Lógica → HTML/CSS → JavaScript → Git/SQL → Node.js → React/TS → Java/Spring → Docker → Next.js → APIs avançadas → AWS → Microsserviços → Kubernetes → CI/CD → System Design → Liderança/Inglês → Projeto Final
- **Conteúdo didático real** em cada módulo, não só links — explicações, exemplos de código, e por quês
- **~90 exercícios interativos** em 5 formatos: múltipla escolha, completar código, ordenar passos, associar pares, verdadeiro/falso
- **~22 mini-jogos** únicos, um por tema (labirinto lógico, dojo do flexbox, construtor de queries SQL, corrida de algoritmos de ordenação, detetive do console JS, e mais)
- **Sistema de gamificação completo**: XP, níveis, sequência de estudo (streak) com mapa de constância estilo GitHub, conquistas com confetti
- **Mentor IA opcional** via API da DeepSeek, com contexto de onde você está na jornada
- **100% dos seus dados ficam no seu navegador** (localStorage) — sem backend, sem conta, sem rastreamento

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

## 🤖 Configurando o Mentor IA (opcional)

O Mentor IA usa a API da DeepSeek. Isso é **opcional** — o app funciona 100% sem ele.

1. Acesse [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys) e crie uma conta/chave gratuita
2. No app, vá em **Configurações** e cole sua chave
3. Pronto — sua chave fica só no seu navegador, nunca no código

> ⚠️ **Nunca** cole sua chave de API em nenhum arquivo de código antes de subir para o GitHub. O app foi desenhado para isso nunca ser necessário: a chave é digitada por você, direto na interface, e fica salva localmente.

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
