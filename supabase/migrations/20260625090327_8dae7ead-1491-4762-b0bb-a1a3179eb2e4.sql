
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create type public.app_role as enum ('admin', 'editor');

create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role);
$$;

create policy "users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "admins read all profiles" on public.profiles for select using (public.has_role(auth.uid(), 'admin'));
create policy "users read own roles" on public.user_roles for select using (auth.uid() = user_id);
create policy "admins read all roles" on public.user_roles for select using (public.has_role(auth.uid(), 'admin'));
create policy "admins manage roles" on public.user_roles for all
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

create table public.topics (
  slug text primary key,
  name text not null,
  description text,
  cover text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.topics to anon;
grant select, insert, update, delete on public.topics to authenticated;
grant all on public.topics to service_role;
alter table public.topics enable row level security;
create policy "topics public read" on public.topics for select using (true);
create policy "topics admin write" on public.topics for all
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger topics_touch before update on public.topics for each row execute function public.touch_updated_at();

create table public.places (
  slug text primary key,
  name text not null,
  created_at timestamptz not null default now()
);
grant select on public.places to anon;
grant select, insert, update, delete on public.places to authenticated;
grant all on public.places to service_role;
alter table public.places enable row level security;
create policy "places public read" on public.places for select using (true);
create policy "places admin write" on public.places for all
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.tags (
  slug text primary key,
  name text not null,
  created_at timestamptz not null default now()
);
grant select on public.tags to anon;
grant select, insert, update, delete on public.tags to authenticated;
grant all on public.tags to service_role;
alter table public.tags enable row level security;
create policy "tags public read" on public.tags for select using (true);
create policy "tags admin write" on public.tags for all
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.posts (
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
  status text not null default 'draft' check (status in ('draft','published')),
  body jsonb not null default '[]'::jsonb,
  related text[] not null default '{}',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.posts to anon;
grant select, insert, update, delete on public.posts to authenticated;
grant all on public.posts to service_role;
alter table public.posts enable row level security;
create policy "posts public read published" on public.posts for select using (status = 'published');
create policy "posts admin read all" on public.posts for select using (public.has_role(auth.uid(), 'admin'));
create policy "posts admin write" on public.posts for all
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger posts_touch before update on public.posts for each row execute function public.touch_updated_at();
create index posts_date_idx on public.posts (date desc);
create index posts_topic_idx on public.posts (topic);
create index posts_featured_idx on public.posts (featured) where featured = true;
