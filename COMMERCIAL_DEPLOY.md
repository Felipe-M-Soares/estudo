# DevQuest Comercial - Deploy e Operacao

Esta versao inclui frontend React/Vite e backend Node. Existem dois jeitos de
rodar o backend, escolha o que combina com o que voce ja faz:

- **Voce so sobe pro GitHub e a Vercel publica sozinha** (seu caso) → leia
  a secao "Deploy na Vercel" logo abaixo. Nao precisa rodar nada na sua
  maquina.
- **Voce hospeda num servidor tradicional** (VPS, Railway, Render) ou quer
  rodar localmente → pule para "Rodar localmente".

## Deploy na Vercel (GitHub -> Vercel automatico)

A Vercel nao roda um servidor Node "ligado o tempo todo" (o `server/server.mjs`
antigo). Ela roda **funcoes serverless**: uma regra de `rewrite` em
`vercel.json` manda toda requisicao para `/api/*` (com qualquer numero de
segmentos no caminho) para `api/index.mjs`, que reaproveita toda a mesma
logica de `server/app.mjs` (nenhuma regra de negocio duplicada entre os
dois modos). Isso ja esta configurado no projeto - voce so precisa
cadastrar as variaveis de ambiente.

**Passo a passo (tudo pelo navegador, direto no painel da Vercel):**

1. No [painel da Vercel](https://vercel.com/dashboard), abra o projeto ja
   linkado ao seu repositorio do GitHub.
2. Va em **Settings > Environment Variables** e cadastre:

   | Nome | Valor | Obrigatoria? |
   |---|---|---|
   | `SUPABASE_URL` | URL do seu projeto Supabase | Sim |
   | `SUPABASE_SERVICE_ROLE_KEY` | service_role key do Supabase | Sim |
   | `TOKEN_SECRET` | valor aleatorio longo (ex.: gere com `openssl rand -hex 48`) | Sim |
   | `ADMIN_TOKEN` | valor aleatorio longo (ex.: gere com `openssl rand -hex 32`) | Sim |
   | `OWNER_SETUP_TOKEN` | outro valor aleatorio (protege quem vira "dono") | Recomendada |
   | `REQUIRE_LICENSE` | `true` | Recomendada |
   | `MERCADO_PAGO_ACCESS_TOKEN` | chave do Mercado Pago | Para checkout automatico |
   | `MERCADO_PAGO_WEBHOOK_SECRET` | segredo do webhook do Mercado Pago | Para checkout automatico |
   | `PUBLIC_APP_URL` | a URL publica do seu site na Vercel | Recomendada |

   **Importante:** na Vercel, ao contrario de rodar localmente, `TOKEN_SECRET`
   e `ADMIN_TOKEN` sao **obrigatorios** - a funcao serverless nao tem disco
   proprio para gerar e guardar esses valores sozinha entre execucoes (cada
   requisicao pode cair numa instancia diferente). Sem essas duas variaveis
   definidas, a API responde com um erro claro explicando exatamente isso.

3. Depois de salvar as variaveis, va em **Deployments** e clique em
   **Redeploy** no ultimo deploy (ou apenas faca um novo `git push` - a
   Vercel builda de novo sozinha).
4. Rode `supabase/schema.sql` no SQL Editor do seu projeto Supabase, se
   ainda nao rodou (veja `PRIMEIROS_PASSOS_SUPABASE.md`).
5. Acesse a URL do seu site na Vercel. A tela Conta deve mostrar a API
   como "online" e login/cadastro devem funcionar.

Se depois disso ainda aparecer "API offline", abra **Deployments > (ultimo
deploy) > Functions** no painel da Vercel e veja o log da funcao - ele mostra
a mensagem de erro exata (quase sempre e uma variavel de ambiente faltando
ou escrita errada).

## Rodar localmente (VPS/Railway/Render ou na sua maquina)

## 1. Configurar o Supabase (fazer uma vez)

1. Crie um projeto em [supabase.com](https://supabase.com) (ja tem conta e o GitHub linkado, entao so falta criar/selecionar o projeto).
2. No projeto, abra **SQL Editor > New query**, cole todo o conteudo de `supabase/schema.sql` e clique em **Run**. Isso cria as 5 tabelas (`devquest_users`, `devquest_licenses`, `devquest_orders`, `devquest_progress`, `devquest_events`) com RLS ligado.
3. Em **Project Settings > API**, copie:
   - **Project URL** → variavel `SUPABASE_URL`
   - **service_role key** (a secreta, NAO a `anon public`) → variavel `SUPABASE_SERVICE_ROLE_KEY`
4. Cole esses dois valores no seu `.env` (veja `.env.example`).

**Importante:** a `service_role key` da acesso total ao banco, ignorando RLS. Ela deve existir **somente no servidor** (nas variaveis de ambiente do host onde `server/server.mjs` roda), nunca no frontend, nunca em um repositorio publico. Quem tiver essa chave tem acesso total aos dados de todos os usuarios.

## 2. Instalar e rodar

```bash
npm install
npm run dev
```

Acesse o endereco do Vite mostrado no terminal. O comando sobe a API em `127.0.0.1:8787` e o frontend com proxy para `/api`. Sem `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` definidos, o servidor recusa iniciar e explica o que falta.

## Variaveis de ambiente em producao

Copie `.env.example` para o ambiente do servidor.

```bash
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
PORT=8787
HOST=0.0.0.0
DATA_DIR=./.data
PUBLIC_APP_URL=https://seudominio.com
# Opcionais: se omitidos, o servidor gera e persiste sozinho em .data/secrets.json
TOKEN_SECRET=gere-um-segredo-longo
ADMIN_TOKEN=gere-um-token-admin-longo
# Opcional: exige esse token para o primeiro cadastro virar "owner"
OWNER_SETUP_TOKEN=
REQUIRE_LICENSE=true
SEED_DEMO_LICENSE=false
ALLOWED_ORIGINS=https://seudominio.com
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxx
MERCADO_PAGO_WEBHOOK_SECRET=gere-um-segredo-de-webhook
```

`SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` sao obrigatorios (o servidor
recusa iniciar sem eles). `TOKEN_SECRET` e `ADMIN_TOKEN` nao sao obrigatorios
tecnicamente (o servidor gera valores aleatorios fortes sozinho se
faltarem), mas defini-los explicitamente em producao e mais previsivel para
operar entre reinicios e multiplas instancias — **especialmente se o host
nao mantiver disco persistente entre execucoes** (ex.: funcoes serverless),
caso em que o arquivo `.data/secrets.json` gerado automaticamente nao
sobreviveria e cada reinicio invalidaria as sessoes de todo mundo.

## Planos definidos

- `starter`: R$ 49,90/mes (ou US$ 9 no checkout internacional). Libera meses 1 a 6, aulas, exercicios, revisao e progresso em nuvem.
- `pro`: R$ 89,90/mes (ou US$ 19). Libera os 22 meses, laboratorio, arcade, projetos, analytics e atualizacoes.
- `lifetime`: R$ 497,00 pagamento unico (ou US$ 89). Libera todos os conteudos atuais e o sistema vitalicio.

Os planos ficam centralizados em `server/app.mjs` e tambem aparecem na tela Conta.

## Pagamento por plano - dois provedores

O app vende tanto no Brasil quanto no exterior, usando dois provedores
diferentes conforme o aluno escolhe na tela Conta:

- **Mercado Pago** (padrao, cobra em BRL): Pix, boleto e cartao nacional.
- **Stripe** (checkout internacional, cobra em USD): cartao de qualquer pais.

Ambos usam exatamente a mesma logica de liberacao de licenca por baixo
(`createLicenseForOrder` em `server/app.mjs`) - nao ha duplicacao de regra
de negocio entre os dois, so o provedor de cobranca muda.

### Mercado Pago (Brasil)

Com `MERCADO_PAGO_ACCESS_TOKEN` configurado, a tela Conta chama `POST /api/checkout` com `provider: "mercadopago"`, cria uma preferencia no Mercado Pago e redireciona o aluno para pagar. O webhook `POST /api/payments/mercadopago/webhook` consulta o pagamento na API do Mercado Pago; quando o status volta `approved`, o servidor cria a licenca, vincula ao usuario e libera o plano.

Configure no painel do Mercado Pago a URL:

```text
https://seudominio.com/api/payments/mercadopago/webhook
```

### Stripe (internacional)

1. Crie uma conta em [dashboard.stripe.com](https://dashboard.stripe.com).
2. Em **Developers > API keys**, copie a **Secret key** → `STRIPE_SECRET_KEY`.
3. Em **Developers > Webhooks**, clique em **Add endpoint**, informe:
   ```text
   https://seudominio.com/api/payments/stripe/webhook
   ```
   Selecione os eventos `checkout.session.completed`,
   `checkout.session.async_payment_succeeded`,
   `checkout.session.expired` e `checkout.session.async_payment_failed`.
4. Copie o **Signing secret** desse endpoint → `STRIPE_WEBHOOK_SECRET`.

Com essas duas variaveis definidas, o botao "Pagar em USD (cartao
internacional)" na tela Conta passa a criar uma sessao real de Checkout do
Stripe. Sem elas configuradas, o botao responde com um erro claro (503,
`payments_not_configured`) em vez de falhar silenciosamente.

**Assinatura verificada de verdade nos dois webhooks** (nao e so decorativo):
Mercado Pago usa HMAC sobre `id:...;request-id:...;ts:...;`, Stripe usa HMAC
sobre `timestamp.corpo_bruto` - os dois comparados em tempo constante
(`timingSafeEqual`) para nao vazar informacao por timing.

O servidor valida a assinatura real enviada pelo Mercado Pago (header
`x-signature`, formato `ts=...,v1=...`, HMAC-SHA256 com `MERCADO_PAGO_WEBHOOK_SECRET`).
Sem essa variavel configurada, o webhook aceita qualquer chamada — use isso
apenas em teste local, nunca em producao.

## Criar licencas

Troque `http://localhost:8787` pela URL do seu site (na Vercel, a URL publica do deploy) se nao estiver rodando local:

```bash
curl -X POST http://localhost:8787/api/admin/licenses \
  -H "Content-Type: application/json" \
  -H "X-Admin-Token: SEU_ADMIN_TOKEN" \
  -d '{"plan":"pro","seats":1,"note":"Cliente inicial"}'
```

A resposta retorna uma `licenseKey`. Ela aparece apenas uma vez. Entregue essa chave ao comprador.

## Confirmar pagamento manual

Para venda direta fora do checkout, crie o pedido pelo app e confirme pelo admin (mesma observacao acima sobre a URL):

```bash
curl -X POST http://localhost:8787/api/admin/payments/confirm \
  -H "Content-Type: application/json" \
  -H "X-Admin-Token: SEU_ADMIN_TOKEN" \
  -d '{"orderId":"ord_xxx","note":"PIX confirmado"}'
```

## Fluxo do comprador

1. O aluno cria conta.
2. Escolhe Starter, Pro ou Vitalicio.
3. Paga pelo checkout Mercado Pago ou ativa uma chave manual.
4. Somente depois do plano ativo acessa aulas, laboratorio, arcade, revisoes e progresso.
5. Usa "Enviar progresso" e "Baixar progresso" para sincronizar.

**Excecao para o dono da plataforma:** o primeiro cadastro (papel `owner`)
ve um botao extra na tela Conta - "Ativar acesso vitalicio (dono da
plataforma)" - que libera uma licenca vitalicia gratuita para a propria
conta com um clique, sem precisar de chave nem do token de admin. Isso
existe so para o dono testar o proprio produto; qualquer outra conta
segue o fluxo normal de compra/ativacao.

Sem usuario logado e plano ativo, o frontend redireciona qualquer tentativa de acesso para Conta.

## Endpoints principais

- `GET /api/health`
- `GET /api/plans`
- `GET /api/plans?lang=en`
- `GET /api/plans?lang=es`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/change-password`
- `GET /api/me`
- `POST /api/checkout`
- `POST /api/payments/mercadopago/webhook`
- `POST /api/payments/stripe/webhook`
- `POST /api/license/activate`
- `POST /api/owner/claim-license`
- `GET /api/progress`
- `PUT /api/progress`
- `POST /api/admin/licenses`
- `POST /api/admin/payments/confirm`
- `POST /api/admin/users/reset-password`
- `GET /api/admin/summary`

## Seguranca incluida

- Hash de senha com `scrypt` e salt por usuario.
- Tokens assinados com HMAC e expiracao.
- Rate limit simples por IP.
- Headers de seguranca.
- CSP no HTML e no servidor.
- Licencas armazenadas por hash, nao em texto puro.
- Progresso protegido por token.
- Validacao de entrada com `zod`.
- Bloqueio temporario apos tentativas repetidas de login.
- Planos e licencas liberados apenas no servidor.

## Onde os dados ficam armazenados

Tudo vive no Postgres do seu projeto Supabase, nas tabelas criadas por `supabase/schema.sql`:

- `devquest_users` - contas, senha (hash + salt, nunca em texto puro), papel, licenca vinculada.
- `devquest_licenses` - chaves de licenca (guardadas por hash), plano, assentos usados, validade.
- `devquest_orders` - pedidos de pagamento (Mercado Pago), status, valor.
- `devquest_progress` - progresso do aluno sincronizado na nuvem (JSON + checksum).
- `devquest_events` - log de auditoria (registro, login, ativacao de licenca, pagamentos etc.).

Voce pode inspecionar e editar esses dados a qualquer momento pelo **Table Editor** do painel do Supabase. `DATA_DIR`/`.data/` no servidor guarda apenas os segredos locais (`secrets.json`), nao dados de usuarios.

## O que ainda falta para escala SaaS grande

Esta base e vendavel para uma primeira versao hospedada, venda direta ou acesso licenciado. Para escala maior, recomendo evoluir:

- emails transacionais;
- recuperacao de senha por e-mail (hoje o reset e manual, via admin);
- painel admin visual (hoje e por endpoint/curl);
- testes E2E com Playwright;
- logs estruturados e monitoramento;
- backups automatizados (o Supabase ja faz backup gerenciado no plano pago);
- termos de uso, privacidade e LGPD.
