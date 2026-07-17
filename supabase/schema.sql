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
-- Cobrança recorrente (Mercado Pago PreApproval) para Starter/Pro. O
-- Vitalício continua sendo pagamento único (Preference), então essa coluna
-- fica nula pra ele.
-- ----------------------------------------------------------------------------
alter table public.subscriptions add column if not exists mp_preapproval_id text;
create unique index if not exists subscriptions_mp_preapproval_id_idx
  on public.subscriptions(mp_preapproval_id) where mp_preapproval_id is not null;


-- ----------------------------------------------------------------------------
-- View auxiliar: plano ativo "efetivo" de cada usuário (a mais recente aprovada)
-- ----------------------------------------------------------------------------
-- "approved" sozinho não basta: starter/pro expiram em 30 dias
-- (active_until no passado) e não devem contar como plano ativo.
create or replace view public.active_subscription as
select distinct on (user_id)
  user_id, plan_id, status, active_until, created_at
from public.subscriptions
where status = 'approved'
  and (active_until is null or active_until > now())
order by user_id, created_at desc;

-- ============================================================================
-- ANTI-CHEAT: moedas, personagens e aulas concluídas só mudam via função
-- ----------------------------------------------------------------------------
-- Antes disso, qualquer usuário logado podia abrir o console do navegador e
-- rodar supabase.from('profiles').update({coins: 999999, completed_lessons: {...}})
-- porque a policy de RLS só checava "é dono da linha?", não os valores.
-- A partir daqui: ninguém (nem o anon key) tem permissão de UPDATE direto
-- nessas colunas — só passando pelas funções abaixo, que rodam como o dono
-- da tabela (security definer) e validam tudo no servidor.
-- ============================================================================

-- Controle de "farm" de moedas: zera a cada dia (fuso UTC) e limita quanto
-- pode ser ganho por dia, mesmo que alguém chame a função em loop.
alter table public.profiles add column if not exists reward_coins_today integer not null default 0;
alter table public.profiles add column if not exists reward_day date not null default current_date;

-- Nenhum update direto de coluna sensível — só display_name pode ser mudado
-- pelo próprio usuário diretamente (não afeta jogo/economia).
revoke update on public.profiles from authenticated, anon;
grant update (display_name) on public.profiles to authenticated;

-- Catálogo de personagens (preço em moedas). Espelha CHARACTER_PRICES do
-- front-end — se mudar um preço lá, atualize aqui também.
create table if not exists public.character_catalog (
  id text primary key,
  price integer not null check (price >= 0)
);

alter table public.character_catalog enable row level security;
drop policy if exists "character_catalog_read_all" on public.character_catalog;
create policy "character_catalog_read_all" on public.character_catalog for select using (true);
-- Sem policy de insert/update/delete para authenticated/anon: só o painel
-- (SQL Editor, como service role) altera o catálogo.

insert into public.character_catalog (id, price) values
  ('char-01', 0), ('char-02', 350), ('char-03', 350), ('char-04', 400), ('char-05', 450),
  ('char-06', 500), ('char-07', 550), ('char-08', 600), ('char-09', 650), ('char-10', 700),
  ('char-11', 750), ('char-12', 900), ('char-13', 950), ('char-14', 1000), ('char-15', 1050),
  ('char-16', 1100), ('char-17', 1150), ('char-18', 1200), ('char-19', 1300), ('char-20', 1400),
  ('char-21', 1500), ('char-22', 1600)
on conflict (id) do update set price = excluded.price;

-- Marca uma aula como concluída para o usuário autenticado (idempotente).
-- Observação: isso NÃO valida a ordem/pré-requisito da trilha (esse grafo
-- vive no código do front-end, não no banco) — só impede que alguém escreva
-- um JSON arbitrário de "tudo concluído" em uma única chamada. Uma trava
-- completa exigiria espelhar a estrutura dos módulos/aulas no banco.
create or replace function public.mark_lesson_complete(p_lesson_key text)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;
  if p_lesson_key is null or length(p_lesson_key) = 0 or length(p_lesson_key) > 200 then
    raise exception 'invalid_lesson_key';
  end if;
  update public.profiles
  set completed_lessons = completed_lessons || jsonb_build_object(p_lesson_key, true)
  where id = auth.uid();
end;
$$;

grant execute on function public.mark_lesson_complete(text) to authenticated;

-- Credita moedas ganhas em jogos (arcade/laboratório). Sempre roda no
-- servidor: valida um teto por chamada e um teto diário por usuário, então
-- nem chamando a função em loop pelo console dá pra gerar moedas infinitas.
create or replace function public.claim_reward(p_amount integer, p_source text default 'unknown')
returns integer
language plpgsql
security definer set search_path = public
as $$
declare
  v_max_per_call constant integer := 60;   -- maior recompensa única possível hoje no app
  v_daily_cap constant integer := 400;     -- teto de moedas "ganhas em jogo" por dia
  v_today_earned integer;
  v_reward_day date;
  v_awarded integer;
  v_new_coins integer;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;
  if p_amount is null or p_amount <= 0 or p_amount > v_max_per_call then
    raise exception 'invalid_amount';
  end if;

  select reward_coins_today, reward_day into v_today_earned, v_reward_day
  from public.profiles where id = auth.uid() for update;

  if v_reward_day is distinct from current_date then
    v_today_earned := 0;
  end if;

  v_awarded := least(p_amount, greatest(v_daily_cap - v_today_earned, 0));

  update public.profiles
  set coins = coins + v_awarded,
      reward_coins_today = v_today_earned + v_awarded,
      reward_day = current_date
  where id = auth.uid()
  returning coins into v_new_coins;

  return v_new_coins;
end;
$$;

grant execute on function public.claim_reward(integer, text) to authenticated;

-- Compra um personagem: valida preço (catálogo do servidor, não confia no
-- preço que vem do navegador), saldo e se já não é dono — tudo em uma
-- transação atômica (com lock de linha) pra não dar pra comprar 2x no
-- mesmo instante em duas abas.
create or replace function public.buy_character(p_character_id text)
returns public.profiles
language plpgsql
security definer set search_path = public
as $$
declare
  v_price integer;
  v_profile public.profiles;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  select price into v_price from public.character_catalog where id = p_character_id;
  if v_price is null then
    raise exception 'unknown_character';
  end if;

  select * into v_profile from public.profiles where id = auth.uid() for update;

  if p_character_id = any(v_profile.owned_characters) then
    raise exception 'already_owned';
  end if;
  if v_profile.coins < v_price then
    raise exception 'insufficient_coins';
  end if;

  update public.profiles
  set coins = coins - v_price,
      owned_characters = array_append(owned_characters, p_character_id),
      equipped_character = p_character_id
  where id = auth.uid()
  returning * into v_profile;

  return v_profile;
end;
$$;

grant execute on function public.buy_character(text) to authenticated;

-- Equipa um personagem que o usuário já possui.
create or replace function public.equip_character(p_character_id text)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;
  if not exists (
    select 1 from public.profiles
    where id = auth.uid() and p_character_id = any(owned_characters)
  ) then
    raise exception 'not_owned';
  end if;
  update public.profiles set equipped_character = p_character_id where id = auth.uid();
end;
$$;

grant execute on function public.equip_character(text) to authenticated;

-- ----------------------------------------------------------------------------
-- Progresso fino por módulo (respostas de exercício, checklist marcado,
-- solução do projeto digitada). Antes só a conclusão da aula era salva —
-- atualizar a página perdia tudo isso. Fica num JSON por módulo, escrito só
-- pelo próprio usuário via RPC (mesma lógica de proteção das outras colunas).
-- ----------------------------------------------------------------------------
alter table public.profiles add column if not exists lesson_progress jsonb not null default '{}'::jsonb;

create or replace function public.save_module_progress(p_module_id text, p_progress jsonb)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;
  if p_module_id is null or length(p_module_id) = 0 or length(p_module_id) > 100 then
    raise exception 'invalid_module_id';
  end if;
  -- Teto de tamanho generoso (evita alguém tentar mandar payloads gigantes).
  if p_progress is null or pg_column_size(p_progress) > 20000 then
    raise exception 'invalid_progress_payload';
  end if;
  update public.profiles
  set lesson_progress = jsonb_set(lesson_progress, array[p_module_id], p_progress, true)
  where id = auth.uid();
end;
$$;

grant execute on function public.save_module_progress(text, jsonb) to authenticated;
