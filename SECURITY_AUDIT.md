# DevQuest - Analise de Seguranca

## Protecao contra segredos vazados no codigo/GitHub (04/07/2026)

Reforco adicional pedido explicitamente: garantir que nenhuma chave (Supabase,
Mercado Pago, tokens locais) acabe exposta no repositorio.

- **Arquitetura ja impede o vazamento mais grave por padrao.** O frontend
  (`src/`) nunca importa nada do Supabase - ele so fala com a API do
  DevQuest (`src/services/commercialApi.ts`). A `SUPABASE_SERVICE_ROLE_KEY`
  existe apenas em `server/db/supabase.mjs`, roda somente no servidor, e
  nunca entra no bundle enviado ao navegador. Isso foi verificado na pratica:
  buildei o projeto com uma chave falsa nas variaveis de ambiente e conferi
  que o texto dela nao aparece em nenhum arquivo gerado em `dist/`.
- **`node scripts/check-secrets.mjs`** (novo): varre os arquivos rastreados
  pelo Git e falha (saida 1) se encontrar: o arquivo `.env` versionado, a
  pasta `.data/` (onde ficam os segredos locais gerados automaticamente)
  versionada, ou qualquer string com formato de chave real (JWT do Supabase,
  token do Mercado Pago) em vez de um placeholder de exemplo.
- Esse script roda **automaticamente antes de `npm run dev` e `npm run
  build`** (hooks `predev`/`prebuild`), e tambem existe como GitHub Action
  em `.github/workflows/check-secrets.yml`, que roda em todo push/PR - uma
  segunda camada de protecao mesmo se alguem esquecer de rodar localmente
  ou usar outro computador.
- Testado com casos reais simulados (nao so lido): commit com `.env`
  versionado, commit com `.data/secrets.json` versionado e commit com uma
  string no formato de JWT dentro de um arquivo `.mjs` - os tres foram
  detectados e bloqueados (saida 1). Um repositorio limpo com apenas
  `.env.example` continua passando normalmente (sem falso positivo).
- `package.json` tambem tinha uma dependencia duplicada (`@fontsource/cinzel`
  listada duas vezes) de uma edicao anterior - corrigido.

## Migracao para Supabase (04/07/2026)

Todos os dados do app (usuarios, licencas, pedidos, progresso e eventos)
saíram do arquivo JSON local (`.data/devquest-db.json`) e passaram a viver
no Postgres gerenciado do Supabase. Pontos de seguranca dessa migracao:

- **Sem alteracao no modelo de senha**: continua `scrypt` com salt por
  usuario, guardado nas colunas `password_salt`/`password_hash` - a senha em
  texto puro nunca chega perto do banco.
- **Chaves de licenca continuam guardadas por hash** (`key_hash`), nunca em
  texto puro, igual a versao anterior.
- **RLS (Row Level Security) ligado em todas as 5 tabelas, sem nenhuma
  policy.** Isso bloqueia por padrao qualquer acesso vindo da chave publica
  (`anon key`) do Supabase - só a `service_role key`, usada exclusivamente
  pelo backend Node, consegue ler ou escrever. O frontend nunca fala com o
  Supabase diretamente, sempre passa pela API do DevQuest.
- **A `service_role key` e o dado mais sensivel de toda a aplicacao**: quem
  a possui tem acesso total ao banco, ignorando RLS. Ela só deve existir nas
  variaveis de ambiente do servidor, nunca em codigo versionado, build do
  frontend ou logs.
- Toda a logica de negocio (bloqueio de conta apos tentativas de login,
  validacao de assentos de licenca, verificacao de assinatura do webhook do
  Mercado Pago, rate limit) permanece identica - so a camada de
  armazenamento mudou.
- Antes de ir para producao, rode `supabase/schema.sql` no projeto real e
  confirme em **Authentication > Policies** que as tabelas `devquest_*`
  aparecem com RLS ativo e zero policies (acesso restrito por padrao).

## Correcoes aplicadas na revisao anterior (04/07/2026)

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

- O banco agora e Postgres gerenciado (Supabase), com backups automaticos no plano pago do Supabase. Ainda vale revisar indices conforme o volume de usuarios crescer.
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
