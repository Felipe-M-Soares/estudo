# DevQuest - Analise de Seguranca

## Status desta versao

Esta versao recebeu reforcos para uma primeira operacao comercial:

- senhas com `scrypt`, salt por usuario e comparacao em tempo constante;
- validacao de entrada com `zod` em cadastro, login, licenca, checkout e progresso;
- bloqueio temporario apos tentativas repetidas de login;
- token de sessao assinado com HMAC e expiracao configuravel;
- rate limit por IP para rotas de API e auth;
- licencas armazenadas por hash, nunca em texto puro;
- checkout Mercado Pago criado no backend;
- webhook que consulta o pagamento no provedor antes de liberar licenca;
- CSP, `X-Frame-Options`, `nosniff`, `Referrer-Policy` e `Permissions-Policy`;
- servico de arquivos estaticos com normalizacao de caminho para reduzir traversal;
- plano e acesso definidos no servidor, nao apenas na interface.

## Configuracao obrigatoria em producao

- Trocar `TOKEN_SECRET` e `ADMIN_TOKEN` por valores longos, unicos e aleatorios.
- Usar `REQUIRE_LICENSE=true`.
- Usar `SEED_DEMO_LICENSE=false`.
- Definir `ALLOWED_ORIGINS` somente com o dominio real.
- Definir `PUBLIC_APP_URL` com HTTPS.
- Configurar `MERCADO_PAGO_ACCESS_TOKEN`.
- Configurar `MERCADO_PAGO_WEBHOOK_SECRET`.
- Rodar atras de HTTPS com proxy confiavel.
- Fazer backup do diretorio `DATA_DIR`.

## Riscos que ainda existem

- O banco em JSON e suficiente para venda inicial, mas nao para alto volume. Para escala, migrar para PostgreSQL com transacoes.
- O token fica em `localStorage`; isso e simples para PWA, mas cookies `HttpOnly`, `Secure` e `SameSite=Lax` reduzem impacto de XSS.
- Ainda nao existe recuperacao de senha, confirmacao de email ou 2FA.
- O webhook usa uma verificacao simples de segredo. Em producao, validar assinatura do provedor conforme o contrato final da conta Mercado Pago.
- Nao ha logs estruturados, alertas, WAF ou monitoramento externo.
- O painel admin e por endpoint. Para equipe maior, separar roles, auditoria detalhada e permissoes granulares.

## Checklist antes de vender em escala

- Criar testes automatizados para auth, checkout, webhook e licenca.
- Migrar dados para banco transacional.
- Adicionar cookies seguros ou estrategia hibrida de sessao.
- Adicionar termos de uso, privacidade e base LGPD.
- Configurar backup automatico e teste de restauracao.
- Configurar monitoramento de erro e uptime.
- Revisar CSP apos dominio final, imagens e integrações externas.
- Fazer teste de carga nas rotas `/api/auth/*`, `/api/checkout` e `/api/progress`.
