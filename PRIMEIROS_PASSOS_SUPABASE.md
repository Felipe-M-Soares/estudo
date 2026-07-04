# Primeiros passos com o Supabase

Este app agora guarda todos os dados (usuarios, licencas, pedidos, progresso
e eventos) no Supabase. Como os dados moram no SEU projeto Supabase (nao em
um arquivo dentro deste zip), a conta de teste precisa ser criada por voce,
uma vez, depois de configurar as chaves. Leva menos de 10 minutos.

Escolha o caminho que combina com o que voce faz:

- **So sobe pro GitHub e a Vercel publica sozinha** (nunca abre nada local)
  → siga a secao **"Caminho Vercel"** abaixo.
- **Roda `npm run dev` na sua maquina ou hospeda num VPS/Railway/Render**
  → siga a secao **"Caminho local"**.

## 1. Rodar o schema no seu projeto Supabase (igual nos dois caminhos)

1. Abra [supabase.com/dashboard](https://supabase.com/dashboard) e entre no
   projeto que voce ja criou.
2. No menu lateral, clique em **SQL Editor > New query**.
3. Abra o arquivo `supabase/schema.sql` (deste zip), copie todo o conteudo,
   cole no editor e clique em **Run**.
4. Confirme que apareceram 5 tabelas novas em **Table Editor**:
   `devquest_users`, `devquest_licenses`, `devquest_orders`,
   `devquest_progress`, `devquest_events`.
5. Ainda em **Project Settings > API**, copie:
   - **Project URL** → isso e o `SUPABASE_URL`
   - **service_role key** (secreta, clique em "reveal") → isso e o
     `SUPABASE_SERVICE_ROLE_KEY`

## Caminho Vercel (voce so usa GitHub + Vercel)

1. No [painel da Vercel](https://vercel.com/dashboard), abra o projeto
   linkado ao seu repositorio.
2. Va em **Settings > Environment Variables** e cadastre (tudo pelo
   navegador, nao precisa terminal nem rodar nada local):

   ```
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=cole-a-service-role-key-aqui
   TOKEN_SECRET=um-valor-aleatorio-bem-longo
   ADMIN_TOKEN=outro-valor-aleatorio-bem-longo
   ```

   Para gerar os dois valores aleatorios sem precisar de nada instalado,
   use qualquer gerador de senha forte (32+ caracteres) ou peca para o
   ChatGPT/Claude gerar uma string aleatoria longa - qualquer texto longo e
   imprevisivel serve.

3. Va em **Deployments**, abra o ultimo deploy e clique em **Redeploy**
   (ou apenas de um `git push` - a Vercel builda sozinha de novo).
4. Acesse a URL do seu site publicado na Vercel. Na tela **Conta**, escolha
   **Cadastro** e crie sua conta. A primeira conta criada vira
   automaticamente **owner** (dona da plataforma).
5. Para ativar um plano de teste sem pagar de verdade, gere uma licenca
   manual (troque `SEU-SITE.vercel.app` pela sua URL real e
   `SEU_ADMIN_TOKEN` pelo valor que voce cadastrou no passo 2):

   ```bash
   curl -X POST https://SEU-SITE.vercel.app/api/admin/licenses \
     -H "Content-Type: application/json" \
     -H "X-Admin-Token: SEU_ADMIN_TOKEN" \
     -d '{"plan":"lifetime","seats":5,"note":"Conta de teste"}'
   ```

   Isso pode ser rodado de qualquer terminal (nao precisa ser o seu projeto
   local) - inclusive o console do proprio navegador, ou ferramentas como
   Postman/Insomnia se preferir nao usar linha de comando.
6. A resposta traz uma `licenseKey` no formato `DEVQUEST-XXXX-XXXX`. Volte
   no site, ja logado, cole essa chave em "Chave de licenca" e clique em
   "Ativar licenca". Pronto — acesso liberado a todos os 22 meses,
   laboratorio, arcade e analytics.

Se a tela Conta mostrar "API offline" mesmo depois disso, veja
**Deployments > (ultimo deploy) > Functions** no painel da Vercel - o log
da funcao mostra o erro exato (quase sempre uma variavel de ambiente
faltando ou escrita errada).

## Caminho local (npm run dev / VPS / Railway / Render)

1. Copie `.env.example` para `.env` na raiz do projeto e preencha:

   ```bash
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=cole-a-service-role-key-aqui
   ```

2. Instale e rode:

   ```bash
   npm install
   npm run dev
   ```

3. Acesse o endereco mostrado no terminal (geralmente
   `http://localhost:5173`), va na tela **Conta**, escolha **Cadastro** e
   crie sua conta. Ela vira automaticamente **owner**.
4. Para ativar um plano de teste, pegue o `ADMIN_TOKEN` gerado
   automaticamente na primeira execucao (salvo em `.data/secrets.json`) e
   gere uma licenca:

   ```bash
   cat .data/secrets.json

   curl -X POST http://localhost:8787/api/admin/licenses \
     -H "Content-Type: application/json" \
     -H "X-Admin-Token: COLE_O_ADMIN_TOKEN_AQUI" \
     -d '{"plan":"lifetime","seats":5,"note":"Conta de teste"}'
   ```

5. Cole a `licenseKey` retornada na tela Conta e clique em "Ativar licenca".

## Onde ver os dados de verdade

A qualquer momento, abra **Table Editor** no painel do Supabase para ver as
contas criadas, licencas emitidas, pedidos e o progresso salvo de cada
aluno — sao os mesmos dados que a API usa, direto do Postgres. Isso vale
tanto pro caminho Vercel quanto pro caminho local: os dois falam com o
mesmo banco.

## Antes de vender para clientes de verdade

Leia `COMMERCIAL_DEPLOY.md` e `SECURITY_AUDIT.md`. Principais pontos:

1. `TOKEN_SECRET` e `ADMIN_TOKEN` sao **obrigatorios** na Vercel (funcao
   serverless nao tem disco proprio para gerar sozinha). No caminho local
   eles sao opcionais (o servidor gera se faltarem), mas definir
   explicitamente e mais previsivel.
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

