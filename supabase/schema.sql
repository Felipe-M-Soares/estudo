-- ============================================================================
-- Code Mage — schema do Supabase
-- Como usar: Supabase Dashboard > SQL Editor > cole este arquivo inteiro > Run
-- ============================================================================

-- Extensão usada para gerar UUIDs
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- PROFILES: dados de jogo do usuário (moedas, personagem, aulas concluídas)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Aventureiro(a)',
  coins integer not null default 600,
  equipped_character text not null default 'char-01',
  owned_characters text[] not null default array['char-01'],
  completed_lessons jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- Cria automaticamente uma linha em "profiles" sempre que alguém se cadastra
-- (email/senha, Google ou GitHub — todos passam por auth.users).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Mantém updated_at em dia
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ----------------------------------------------------------------------------
-- SUBSCRIPTIONS: histórico e status de pagamentos do Mercado Pago
-- Só o backend (service role, nas funções serverless) grava/atualiza aqui.
-- O usuário só pode ler as próprias linhas.
-- ----------------------------------------------------------------------------
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null check (plan_id in ('starter', 'pro', 'lifetime')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'cancelled', 'refunded')),
  currency text not null default 'BRL',
  amount numeric,
  mp_preference_id text,
  mp_payment_id text,
  external_reference text unique,
  active_until timestamptz, -- null + plan lifetime = acesso vitalício
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);

-- Nenhuma policy de insert/update para o usuário: essas linhas só são
-- criadas/alteradas pela service role key, usada dentro de /api/*.
-- Isso impede que alguém finja ter pago editando dados pelo navegador.

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute procedure public.set_updated_at();

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);

-- ----------------------------------------------------------------------------
-- View auxiliar: plano ativo "efetivo" de cada usuário (a mais recente aprovada)
-- ----------------------------------------------------------------------------
create or replace view public.active_subscription as
select distinct on (user_id)
  user_id, plan_id, status, active_until, created_at
from public.subscriptions
where status = 'approved'
order by user_id, created_at desc;
