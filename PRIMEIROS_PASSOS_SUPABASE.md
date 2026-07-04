# Primeiros passos com o Supabase

Este app agora guarda todos os dados (usuarios, licencas, pedidos, progresso
e eventos) no Supabase. Como os dados moram no SEU projeto Supabase (nao em
um arquivo dentro deste zip), a conta de teste precisa ser criada por voce,
uma vez, depois de configurar as chaves. Leva menos de 5 minutos.

## 1. Rodar o schema no seu projeto Supabase

1. Abra [supabase.com/dashboard](https://supabase.com/dashboard) e entre no
   projeto que voce ja criou.
2. No menu lateral, clique em **SQL Editor > New query**.
3. Abra o arquivo `supabase/schema.sql` (deste zip), copie todo o conteudo,
   cole no editor e clique em **Run**.
4. Confirme que apareceram 5 tabelas novas em **Table Editor**:
   `devquest_users`, `devquest_licenses`, `devquest_orders`,
   `devquest_progress`, `devquest_events`.

## 2. Pegar as chaves do projeto

Em **Project Settings > API**, copie:

- **Project URL** → isso e o `SUPABASE_URL`
- **service_role key** (secreta, fica escondida por padrao - clique em
  "reveal") → isso e o `SUPABASE_SERVICE_ROLE_KEY`

## 3. Criar o arquivo `.env`

Copie `.env.example` para `.env` na raiz do projeto e preencha pelo menos:

```bash
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=cole-a-service-role-key-aqui
```

## 4. Instalar, rodar e criar sua conta de teste

```bash
npm install
npm run dev
```

Acesse o endereco mostrado no terminal (geralmente `http://localhost:5173`),
va na tela **Conta**, escolha **Cadastro** e crie a sua conta com um e-mail
e senha (minimo 10 caracteres, com letra e numero). Essa primeira conta
criada vira automaticamente **owner** (dona da plataforma).

## 5. Ativar um plano na conta de teste

Sem `MERCADO_PAGO_ACCESS_TOKEN` configurado, o botao de comprar plano fica
em modo "configure pagamentos", entao pra testar o acesso completo gere uma
licenca manual pelo terminal usando o token de admin desta instalacao
(gerado automaticamente na primeira vez que voce roda o servidor, salvo em
`.data/secrets.json`):

```bash
# pegue o ADMIN_TOKEN gerado
cat .data/secrets.json

# gere uma licenca vitalicia de teste
curl -X POST http://localhost:8787/api/admin/licenses \
  -H "Content-Type: application/json" \
  -H "X-Admin-Token: COLE_O_ADMIN_TOKEN_AQUI" \
  -d '{"plan":"lifetime","seats":5,"note":"Conta de teste"}'
```

A resposta traz uma `licenseKey` no formato `DEVQUEST-XXXX-XXXX`. Volte na
tela Conta do app, ja logado, cole essa chave em "Chave de licenca" e clique
em "Ativar licenca". Pronto — acesso liberado a todos os 22 meses,
laboratorio, arcade e analytics.

## Onde ver os dados de verdade

A qualquer momento, abra **Table Editor** no painel do Supabase para ver as
contas criadas, licencas emitidas, pedidos e o progresso salvo de cada
aluno — sao os mesmos dados que a API usa, direto do Postgres.

## Antes de vender para clientes de verdade

Leia `COMMERCIAL_DEPLOY.md` e `SECURITY_AUDIT.md`. Principais pontos:

1. Defina `TOKEN_SECRET` e `ADMIN_TOKEN` explicitamente nas variaveis de
   ambiente do host de producao (nao dependa do arquivo local gerado
   automaticamente se o host nao mantiver disco entre execucoes).
2. Configure `MERCADO_PAGO_ACCESS_TOKEN` e `MERCADO_PAGO_WEBHOOK_SECRET`
   reais para checkout automatico.
3. Nunca exponha a `SUPABASE_SERVICE_ROLE_KEY` no frontend, em builds
   publicos ou em repositorios publicos do GitHub.

## Protecao automatica contra segredo vazado no GitHub

O projeto ja roda `node scripts/check-secrets.mjs` sozinho antes de
`npm run dev` e `npm run build`, e de novo no GitHub a cada push/PR (veja
`.github/workflows/check-secrets.yml`). Se algum dia voce (ou alguem do
time) commitar sem querer o `.env`, a pasta `.data/` ou colar uma chave real
direto num arquivo, esse commit trava com um erro explicando o que fazer -
antes de virar um problema no ar. Nao precisa configurar nada, ja vem
pronto.
