-- ============================================================================
-- Visual Journal — consolidated schema migration
-- Run once against a fresh Supabase project (SQL Editor or psql).
-- Idempotent where practical; safe to re-run after partial failures.
-- ============================================================================

-- 1. Extensions ---------------------------------------------------------------
create extension if not exists pgcrypto;

-- 2. Schemas ------------------------------------------------------------------
create schema if not exists private;
-- private is NOT exposed via PostgREST; do not grant usage to anon/authenticated
revoke all on schema private from public, anon, authenticated;

-- 3. Enums --------------------------------------------------------------------
do $$ begin
  create type public.app_role as enum ('admin', 'editor');
exception when duplicate_object then null; end $$;

-- 4. Tables -------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

create table if not exists public.topics (
  slug text primary key,
  name text not null,
  description text,
  cover text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tags (
  slug text primary key,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.places (
  slug text primary key,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  slug text primary key,
  title text not null,
  date date not null default current_date,
  excerpt text,
  cover jsonb,
  topic text,
  topics text[] not null default '{}',
  tags text[] not null default '{}',
  place text,
  format text not null default 'essay',
  featured boolean not null default false,
  reading_time integer not null default 1,
  status text not null default 'draft',
  published_at timestamptz,
  related text[] not null default '{}',
  body jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_date_idx on public.posts (date desc);
create index if not exists posts_topic_idx on public.posts (topic);
create index if not exists posts_featured_idx on public.posts (featured) where featured = true;

-- 5. Functions ----------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$ begin new.updated_at = now(); return new; end; $$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end; $$;

-- has_role lives in `private` so it's not callable via PostgREST.
create or replace function private.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

revoke all on function private.has_role(uuid, public.app_role) from public;
grant execute on function private.has_role(uuid, public.app_role) to authenticated;

-- 6. Triggers -----------------------------------------------------------------

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists topics_touch on public.topics;
create trigger topics_touch before update on public.topics
  for each row execute function public.touch_updated_at();

drop trigger if exists posts_touch on public.posts;
create trigger posts_touch before update on public.posts
  for each row execute function public.touch_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 7. GRANTs -------------------------------------------------------------------
-- public reads (anon) only where RLS policies expose data publicly.

grant select on public.topics, public.tags, public.places to anon;
grant select on public.posts to anon;          -- RLS restricts anon to published rows
grant select, insert, update, delete on
  public.topics, public.tags, public.places, public.posts, public.profiles, public.user_roles
  to authenticated;
grant all on
  public.topics, public.tags, public.places, public.posts, public.profiles, public.user_roles
  to service_role;

-- 8. RLS ----------------------------------------------------------------------

alter table public.profiles    enable row level security;
alter table public.user_roles  enable row level security;
alter table public.topics      enable row level security;
alter table public.tags        enable row level security;
alter table public.places      enable row level security;
alter table public.posts       enable row level security;

-- profiles
create policy "users read own profile"   on public.profiles for select using (auth.uid() = id);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "admins read all profiles" on public.profiles for select using (private.has_role(auth.uid(), 'admin'));

-- user_roles
create policy "users read own roles"  on public.user_roles for select using (auth.uid() = user_id);
create policy "admins read all roles" on public.user_roles for select using (private.has_role(auth.uid(), 'admin'));
create policy "admins manage roles"   on public.user_roles for all
  using (private.has_role(auth.uid(), 'admin'))
  with check (private.has_role(auth.uid(), 'admin'));

-- topics / tags / places — public read, admin write
create policy "topics public read" on public.topics for select using (true);
create policy "topics admin write" on public.topics for all
  using (private.has_role(auth.uid(), 'admin'))
  with check (private.has_role(auth.uid(), 'admin'));

create policy "tags public read" on public.tags for select using (true);
create policy "tags admin write" on public.tags for all
  using (private.has_role(auth.uid(), 'admin'))
  with check (private.has_role(auth.uid(), 'admin'));

create policy "places public read" on public.places for select using (true);
create policy "places admin write" on public.places for all
  using (private.has_role(auth.uid(), 'admin'))
  with check (private.has_role(auth.uid(), 'admin'));

-- posts
create policy "posts public read published" on public.posts for select using (status = 'published');
create policy "posts admin read all"        on public.posts for select using (private.has_role(auth.uid(), 'admin'));
create policy "posts admin write"           on public.posts for all
  using (private.has_role(auth.uid(), 'admin'))
  with check (private.has_role(auth.uid(), 'admin'));

-- 9. Storage ------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', false)
on conflict (id) do nothing;

-- Public read on the media bucket; admins manage objects.
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

create policy "media admin write" on storage.objects
  for all
  using (bucket_id = 'media' and private.has_role(auth.uid(), 'admin'))
  with check (bucket_id = 'media' and private.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- Done. Next: see migration/RUNBOOK.md
-- ============================================================================
