# DevQuest Comercial - Deploy e Operacao

Esta versao inclui frontend React/Vite e backend Node nativo no arquivo `server/server.mjs`.

## Rodar localmente

```bash
npm install
npm run build
npm run api:dev
```

Acesse `http://127.0.0.1:8787`.

## Variaveis obrigatorias em producao

Copie `.env.example` para o ambiente do servidor e troque todos os segredos.

```bash
PORT=8787
HOST=0.0.0.0
DATA_DIR=./.data
TOKEN_SECRET=gere-um-segredo-longo
ADMIN_TOKEN=gere-um-token-admin-longo
REQUIRE_LICENSE=true
SEED_DEMO_LICENSE=false
ALLOWED_ORIGINS=https://seudominio.com
```

## Criar licencas

Com o servidor rodando:

```bash
curl -X POST http://localhost:8787/api/admin/licenses \
  -H "Content-Type: application/json" \
  -H "X-Admin-Token: SEU_ADMIN_TOKEN" \
  -d '{"plan":"pro","seats":1,"note":"Cliente inicial"}'
```

A resposta retorna uma `licenseKey`. Ela aparece apenas uma vez. Entregue essa chave ao comprador.

## Fluxo do comprador

1. O aluno cria conta.
2. Entra na tela Conta.
3. Ativa a chave de licenca.
4. Usa "Enviar progresso" e "Baixar progresso" para sincronizar.

## Endpoints principais

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/me`
- `POST /api/license/activate`
- `GET /api/progress`
- `PUT /api/progress`
- `POST /api/admin/licenses`
- `GET /api/admin/summary`

## Seguranca incluida

- Hash de senha com `scrypt` e salt por usuario.
- Tokens assinados com HMAC e expiracao.
- Rate limit simples por IP.
- Headers de seguranca.
- CSP no HTML e no servidor.
- Licencas armazenadas por hash, nao em texto puro.
- Progresso protegido por token.

## O que ainda falta para escala SaaS grande

Esta base e vendavel para uma primeira versao hospedada, venda direta ou acesso licenciado. Para escala maior, recomendo evoluir:

- trocar JSON por PostgreSQL;
- integrar Stripe/Mercado Pago;
- emails transacionais;
- recuperacao de senha;
- painel admin visual;
- testes E2E com Playwright;
- logs estruturados e monitoramento;
- backups automatizados;
- termos de uso, privacidade e LGPD.
