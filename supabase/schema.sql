-- DevQuest - Schema do Supabase
--
-- Como aplicar:
-- 1. Abra seu projeto em https://supabase.com/dashboard
-- 2. Va em "SQL Editor" > "New query"
-- 3. Cole todo este arquivo e clique em "Run"
--
-- Isso cria as 5 tabelas que guardam TODOS os dados principais do app
-- (usuarios, licencas, pedidos/pagamentos, progresso na nuvem e eventos de
-- auditoria). O backend Node (server/server.mjs) acessa essas tabelas com a
-- "service role key" do Supabase, que ignora RLS por definicao - por isso as
-- tabelas ficam com RLS ligado e SEM nenhuma policy: isso bloqueia qualquer
-- acesso vindo do navegador com a chave publica (anon key), e permite acesso
-- apenas pelo backend. Nunca exponha a service role key no frontend.

create table if not exists devquest_users (
  id text primary key,
  name text not null,
  email text not null unique,
  password_salt text not null,
  password_hash text not null,
  role text not null default 'student',
  status text not null default 'active',
  license_id text,
  failed_login_count integer not null default 0,
  locked_until timestamptz,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists devquest_licenses (
  id text primary key,
  key_hash text not null unique,
  plan text not null,
  seats integer not null default 1,
  used_by text[] not null default '{}',
  status text not null default 'active',
  expires_at timestamptz,
  order_id text,
  source text,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists devquest_orders (
  id text primary key,
  user_id text not null references devquest_users(id) on delete cascade,
  plan_id text not null,
  amount_cents integer not null,
  currency text not null default 'BRL',
  provider text not null default 'mercadopago',
  status text not null default 'pending',
  preference_id text,
  checkout_url text,
  license_id text,
  payment_meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists devquest_progress (
  user_id text primary key references devquest_users(id) on delete cascade,
  data jsonb not null,
  checksum text not null,
  updated_at timestamptz not null default now()
);

create table if not exists devquest_events (
  id text primary key,
  type text not null,
  user_id text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_devquest_orders_user on devquest_orders(user_id);
create index if not exists idx_devquest_licenses_order on devquest_licenses(order_id);
create index if not exists idx_devquest_licenses_key_hash on devquest_licenses(key_hash);
create index if not exists idx_devquest_events_created_at on devquest_events(created_at desc);
create index if not exists idx_devquest_users_email on devquest_users(email);

-- Row Level Security ligado em todas as tabelas, sem nenhuma policy.
-- Resultado: a chave anon/publica do Supabase nao consegue ler nem escrever
-- nada aqui (RLS ligado + zero policies = acesso negado por padrao). Apenas
-- a service role key (usada exclusivamente pelo server.mjs, nunca pelo
-- navegador) consegue acessar, porque ela ignora RLS.
alter table devquest_users enable row level security;
alter table devquest_licenses enable row level security;
alter table devquest_orders enable row level security;
alter table devquest_progress enable row level security;
alter table devquest_events enable row level security;
