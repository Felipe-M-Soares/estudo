# Code Mage — Configurar login, banco de dados e pagamento de verdade

Este guia liga o app (que hoje roda só no navegador, sem nada real por trás) a:
- **Supabase**: login (e-mail/senha, Google, GitHub) + banco de dados
- **Mercado Pago**: pagamento por cartão, Pix e boleto
- **Vercel**: hospedagem do site + das funções de backend (`/api`)

Sem esses 3 passos configurados, o app continua funcionando em "modo demo"
(sem persistência, sem OAuth, sem pagamento real) — ele avisa isso na tela.

---

## 1. Supabase (login + banco de dados)

1. Crie uma conta em https://supabase.com e um novo projeto (escolha uma senha
   forte para o banco e guarde-a).
2. No painel do projeto, vá em **SQL Editor** → **New query**, cole todo o
   conteúdo do arquivo [`supabase/schema.sql`](./supabase/schema.sql) deste
   projeto e clique em **Run**. Isso cria as tabelas `profiles` e
   `subscriptions`, já com Row Level Security (cada usuário só enxerga os
   próprios dados).
3. Vá em **Project Settings → API**. Copie:
   - `Project URL` → vai virar `VITE_SUPABASE_URL` e `SUPABASE_URL`
   - `anon public` key → vira `VITE_SUPABASE_ANON_KEY`
   - `service_role` key (clique em "Reveal") → vira `SUPABASE_SERVICE_ROLE_KEY`
     (⚠️ essa chave é secreta, nunca vai no navegador — só no Vercel/servidor)

### 1.1 Ativar login com Google

1. No Supabase: **Authentication → Providers → Google** → habilite.
2. Crie um OAuth Client no [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
   - Tipo: "Web application"
   - Em **Authorized redirect URIs**, cole a URL que o próprio Supabase mostra
     na tela do provider Google (algo como
     `https://SEU-PROJETO.supabase.co/auth/v1/callback`)
3. Copie o **Client ID** e **Client Secret** gerados pelo Google e cole nos
   campos correspondentes na tela do provider Google dentro do Supabase.
   Salve.

### 1.2 Ativar login com GitHub

1. No Supabase: **Authentication → Providers → GitHub** → habilite.
2. Crie um OAuth App em https://github.com/settings/developers → "New OAuth App":
   - Homepage URL: a URL do seu site (ex: `https://codemage.vercel.app`)
   - Authorization callback URL: a mesma URL de callback que o Supabase mostra
     na tela do provider GitHub.
3. Copie o **Client ID** e gere um **Client Secret**, cole nos campos do
   Supabase. Salve.

### 1.3 Configurar URLs permitidas

Em **Authentication → URL Configuration**, defina:
- **Site URL**: a URL de produção do seu site (ex: `https://codemage.vercel.app`)
- **Redirect URLs**: adicione também `http://localhost:5173` (para testar local)

---

## 2. Mercado Pago (pagamento)

1. Entre em https://www.mercadopago.com.br/developers/panel
2. Crie uma aplicação (ou use uma existente).
3. Em **Credenciais de teste**, copie o **Access Token de teste** — use-o
   primeiro para testar todo o fluxo sem mexer com dinheiro real.
4. Quando estiver tudo validado, troque pelas **Credenciais de produção**
   (Access Token de produção) nas variáveis de ambiente do Vercel.
5. Em **Webhooks**, configure a URL `https://SEU-DOMINIO/api/webhook` e
   marque os eventos: `Pagamentos` (payment), `Assinaturas` (subscription
   preapproval) e `Pagamentos de assinatura` (subscription authorized
   payment) — os três são usados: o primeiro pelo plano Vitalício (pagamento
   único), os outros dois pela renovação automática do Starter/Pro. Copie a
   **Chave secreta de assinatura** → vira `MP_WEBHOOK_SECRET`.
6. **Antes de ir pra produção**, teste o fluxo completo do Starter/Pro com as
   credenciais de TESTE: assine, confirme que a tela de Conta e Plano mostra
   "Plano ativo", espere a Mercado Pago simular a cobrança de teste e
   confirme que `active_until` avançou ~30 dias na tabela `subscriptions`
   (Supabase → Table Editor). Esse é o pedaço mais novo da integração — vale
   a pena confirmar com calma antes de cobrar gente de verdade.

### Sobre vender para fora do Brasil

A Mercado Pago aceita cartões internacionais (Visa/Mastercard/Amex emitidos
fora do Brasil), mas a cobrança é sempre processada em Reais (BRL) — não existe
liquidação nativa em dólar dentro dessa integração. O app mostra o valor de
referência em US$ para o cliente entender quanto vai pagar, mas o cartão dele
é cobrado em BRL pela bandeira, que faz a conversão automaticamente. Se no
futuro você quiser cobrança nativa em USD/EUR (liquidando fora do Brasil),
seria necessário um segundo gateway (ex.: Stripe) — posso implementar depois
se precisar.

---

## 3. Vercel (hospedar o site + o backend)

1. Suba este projeto para um repositório no GitHub.
2. Em https://vercel.com → **Add New → Project** → importe o repositório.
   O Vercel detecta automaticamente que é um projeto Vite e também publica
   tudo dentro de `/api` como funções serverless — não precisa configurar nada
   manualmente além das variáveis de ambiente abaixo.
3. Em **Project Settings → Environment Variables**, cadastre (uma por uma,
   valores reais, não os de exemplo):

   | Nome                          | Valor                                  | Onde pegar |
   |-------------------------------|-----------------------------------------|------------|
   | `VITE_SUPABASE_URL`           | URL do projeto Supabase                 | Passo 1 |
   | `VITE_SUPABASE_ANON_KEY`      | anon public key                         | Passo 1 |
   | `SUPABASE_URL`                | mesma URL do projeto Supabase           | Passo 1 |
   | `SUPABASE_SERVICE_ROLE_KEY`   | service_role key (secreta)              | Passo 1 |
   | `MP_ACCESS_TOKEN`             | Access Token do Mercado Pago            | Passo 2 |
   | `MP_WEBHOOK_SECRET`           | Chave secreta de assinatura do webhook  | Passo 2 |
   | `PUBLIC_SITE_URL`             | URL final do site (ex: `https://codemage.vercel.app`) | — |

4. Clique em **Deploy**.
5. Depois do primeiro deploy, volte no Supabase (Authentication → URL
   Configuration) e no Google/GitHub OAuth Apps e troque a URL de
   desenvolvimento pela URL final do Vercel, se ainda não tiver feito isso.

---

## 4. Testando localmente

```bash
cp .env.example .env
# edite o .env com suas chaves (pode usar as credenciais de TESTE da Mercado Pago)
npm install
npm run dev
```

O Vercel CLI (`npm i -g vercel` e depois `vercel dev`) é necessário se você
quiser testar as funções de `/api` localmente também — rodando só `npm run dev`
(Vite puro) o site abre normalmente, mas as chamadas para `/api/*` só
funcionam quando publicadas no Vercel (ou via `vercel dev`).

---

## O que já está pronto no código

- Login real (e-mail/senha + Google + GitHub) via Supabase Auth.
- Cadastro de conta com confirmação por e-mail.
- "Esqueci minha senha" com e-mail de redefinição.
- Perfil do jogador (moedas, personagem equipado, aulas concluídas) salvo no
  Supabase e sincronizado automaticamente.
- Página de Conta e Plano cria uma cobrança real na Mercado Pago: pagamento
  único (Checkout Pro: cartão, Pix e boleto) para o Vitalício, e assinatura
  recorrente (PreApproval, renovação automática mensal no cartão) para
  Starter/Pro — nenhum dado de cartão passa pelo nosso servidor.
- Webhook que confirma pagamentos e cobranças recorrentes direto na API da
  Mercado Pago (nunca confia apenas na notificação recebida) e libera/renova
  o plano no banco automaticamente a cada cobrança mensal aprovada.
- Cancelamento de assinatura self-service: o usuário cancela a renovação
  automática direto na tela de Conta e Plano, sem precisar de suporte.
- Bloqueio de conteúdo por plano: sem assinatura ativa só o mês 1 é liberado;
  Starter libera até o mês 6; Pro/Vitalício liberam os 22 meses (Trilha,
  Aulas, História, Laboratório e Arcade checam isso e mostram uma tela de
  upgrade quando bloqueado).
- Moedas, personagens e aulas concluídas só mudam através de funções no
  banco (`claim_reward`, `buy_character`, `equip_character`,
  `mark_lesson_complete`) que validam preço/saldo/posse no servidor — não dá
  mais pra editar isso direto pelo console do navegador.
- Progresso fino por aula (respostas de exercício, checklist marcado,
  rascunho do projeto) é salvo na nuvem por módulo (`save_module_progress`)
  — atualizar a página não perde mais o que já foi preenchido.

## O que ainda fica de fora (próximos passos possíveis)

- A ordem/pré-requisito das aulas dentro de um módulo ainda é validada só no
  front-end (o grafo de aulas vive no código, não no banco) — dá pra reforçar
  espelhando essa estrutura no Supabase, se quiser uma trava 100% server-side.
- Progresso de exercícios/checklist/projeto por aula ainda fica só na sessão
  do navegador (só a conclusão de aula, moedas e personagem são salvos hoje).
