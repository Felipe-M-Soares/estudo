# DevQuest - Analise de Seguranca

## Correcoes aplicadas nesta revisao (04/07/2026)

- **Segredos hardcoded removidos.** `TOKEN_SECRET` e `ADMIN_TOKEN` nao tem mais
  fallback fixo no codigo. Se nao forem definidos por variavel de ambiente,
  o servidor gera valores aleatorios fortes na primeira execucao e persiste
  em `.data/secrets.json` (arquivo agora no `.gitignore`). Antes, qualquer
  instalacao que nao configurasse essas variaveis usava a mesma chave
  publica presente no codigo-fonte, permitindo forjar tokens de sessao e
  acessar todos os endpoints admin.
- **Comparacao do token de admin em tempo constante.** As 4 rotas
  `/api/admin/*` agora usam `timingSafeEqual` em vez de `!==`, reduzindo o
  risco (baixo, mas real) de ataque de timing para descobrir o token.
- **Assinatura do webhook do Mercado Pago corrigida.** A checagem antiga
  apenas verificava se o segredo aparecia como substring no header
  `x-signature`, o que nao corresponde ao esquema real do provedor e podia
  ser forjado por quem soubesse o segredo (ou, em determinadas condicoes,
  nem validava nada de fato). Agora o servidor recalcula o HMAC-SHA256 real
  sobre o manifest `id:...;request-id:...;ts:...;` e compara em tempo
  constante, conforme a especificacao do Mercado Pago.
- **Rate limit mais restrito em `/api/auth/*`.** De 80 para 20 requisicoes
  por minuto por IP, dificultando ainda mais brute force de senha alem do
  bloqueio de conta ja existente.
- **Papel de "owner" protegido por token opcional.** Se `OWNER_SETUP_TOKEN`
  for definido no ambiente, o primeiro cadastro so vira owner se enviar esse
  token; sem a variavel definida, o comportamento antigo (primeiro cadastro
  = owner) e mantido para nao quebrar o uso local/pessoal.
- **Troca de senha e reset administrativo adicionados.** Novo endpoint
  `POST /api/auth/change-password` (usuario logado) e
  `POST /api/admin/users/reset-password` (admin, gera senha temporaria) -
  antes nao existia nenhuma forma de trocar senha depois do cadastro.
- **CSP com `connect-src` restrito a `'self'`.** Dois dominios de API de IA
  que nao sao usados em nenhum lugar do app foram removidos da politica,
  reduzindo superficie de ataque em caso de XSS.
- **`.data/` (banco JSON e segredos) adicionado ao `.gitignore`.**

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
- licença obrigatória por padrão, a menos que `REQUIRE_LICENSE=false` seja definido explicitamente.
- seed de licença demo desligado por padrão.
- frontend redireciona para Conta quando não existe API online, usuário logado e plano ativo.

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
- Ainda nao existe recuperacao de senha por e-mail nem 2FA (o reset agora e feito manualmente pelo admin via `/api/admin/users/reset-password`, ja que nao ha servico de e-mail configurado).
- O painel admin e por endpoint. Para equipe maior, separar roles, auditoria detalhada e permissoes granulares.
- Nao ha logs estruturados, alertas, WAF ou monitoramento externo.

## Checklist antes de vender em escala

- Criar testes automatizados para auth, checkout, webhook e licenca.
- Migrar dados para banco transacional.
- Adicionar cookies seguros ou estrategia hibrida de sessao.
- Adicionar termos de uso, privacidade e base LGPD.
- Configurar backup automatico e teste de restauracao.
- Configurar monitoramento de erro e uptime.
- Revisar CSP apos dominio final, imagens e integrações externas.
- Fazer teste de carga nas rotas `/api/auth/*`, `/api/checkout` e `/api/progress`.
