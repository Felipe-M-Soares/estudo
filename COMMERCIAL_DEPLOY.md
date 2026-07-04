# DevQuest Comercial - Deploy e Operacao

Esta versao inclui frontend React/Vite e backend Node nativo no arquivo `server/server.mjs`.

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse o endereco do Vite mostrado no terminal. O comando sobe a API em `127.0.0.1:8787` e o frontend com proxy para `/api`.

## Variaveis de ambiente em producao

Copie `.env.example` para o ambiente do servidor.

```bash
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

`TOKEN_SECRET` e `ADMIN_TOKEN` nao sao mais obrigatorios tecnicamente (o
servidor gera valores aleatorios fortes sozinho se faltarem), mas defini-los
explicitamente em producao e mais previsivel para operar entre reinicios e
multiplas instancias.

## Planos definidos

- `starter`: R$ 49,90 por mes. Libera meses 1 a 6, aulas, exercicios, revisao e progresso em nuvem.
- `pro`: R$ 89,90 por mes. Libera os 22 meses, laboratorio, arcade, projetos, analytics e atualizacoes.
- `lifetime`: R$ 497,00 pagamento unico. Libera todos os conteudos atuais e o sistema vitalicio.

Os planos ficam centralizados em `server/server.mjs` e tambem aparecem na tela Conta.

## Pagamento por plano

Com `MERCADO_PAGO_ACCESS_TOKEN` configurado, a tela Conta chama `POST /api/checkout`, cria uma preferencia no Mercado Pago e redireciona o aluno para pagar. O webhook `POST /api/payments/mercadopago/webhook` consulta o pagamento na API do Mercado Pago; quando o status volta `approved`, o servidor cria a licenca, vincula ao usuario e libera o plano.

Configure no painel do Mercado Pago a URL:

```text
https://seudominio.com/api/payments/mercadopago/webhook
```

O servidor valida a assinatura real enviada pelo Mercado Pago (header
`x-signature`, formato `ts=...,v1=...`, HMAC-SHA256 com `MERCADO_PAGO_WEBHOOK_SECRET`).
Sem essa variavel configurada, o webhook aceita qualquer chamada — use isso
apenas em teste local, nunca em producao.

## Criar licencas

Com o servidor rodando:

```bash
curl -X POST http://localhost:8787/api/admin/licenses \
  -H "Content-Type: application/json" \
  -H "X-Admin-Token: SEU_ADMIN_TOKEN" \
  -d '{"plan":"pro","seats":1,"note":"Cliente inicial"}'
```

A resposta retorna uma `licenseKey`. Ela aparece apenas uma vez. Entregue essa chave ao comprador.

## Confirmar pagamento manual

Para venda direta fora do checkout, crie o pedido pelo app e confirme pelo admin:

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
- `POST /api/license/activate`
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

## O que ainda falta para escala SaaS grande

Esta base e vendavel para uma primeira versao hospedada, venda direta ou acesso licenciado. Para escala maior, recomendo evoluir:

- trocar JSON por PostgreSQL;
- emails transacionais;
- recuperacao de senha;
- painel admin visual;
- testes E2E com Playwright;
- logs estruturados e monitoramento;
- backups automatizados;
- termos de uso, privacidade e LGPD.
