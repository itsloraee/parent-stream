-- ============================================================
-- PARENT STREAM - SCHEMA SUPABASE
-- À exécuter dans le SQL Editor de Supabase, dans l'ordre :
--   1. 01_schema.sql       (tables + index + triggers)
--   2. 02_policies.sql     (Row Level Security)
--   3. 03_storage.sql      (buckets + politiques storage)
--   4. 04_seed.sql         (données de démo, optionnel)
-- ============================================================

-- Activer l'extension UUID
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. PROFILES (lié à auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text,
  avatar_url text,
  bio text,
  notifications_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_username_idx on public.profiles(username);

-- ============================================================
-- 2. CATEGORIES (Famille, Éducation, Santé, Ados...)
-- ============================================================
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  short_label text not null,
  color text not null default '#DC2626',
  sort_order int not null default 0
);

-- ============================================================
-- 3. SERIES (ex: "L'Art d'Être Parent")
-- ============================================================
create table if not exists public.series (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  cover_url text,
  banner_url text,
  rating numeric(3, 1) not null default 0,
  season int not null default 1,
  is_new boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists series_category_idx on public.series(category_id);

-- ============================================================
-- 4. VIDEOS (épisodes individuels OU vidéos one-shot)
-- ============================================================
create table if not exists public.videos (
  id uuid primary key default uuid_generate_v4(),
  series_id uuid references public.series(id) on delete cascade,
  title text not null,
  subtitle text,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  episode_number int,
  duration_seconds int not null default 0,
  video_url text,
  thumbnail_url text,
  rating numeric(3, 1) not null default 0,
  satisfaction int not null default 0 check (satisfaction between 0 and 100),
  views_count bigint not null default 0,
  published_at timestamptz,
  uploader_id uuid references auth.users(id) on delete set null,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists videos_series_idx on public.videos(series_id);
create index if not exists videos_category_idx on public.videos(category_id);
create index if not exists videos_published_idx on public.videos(is_published, published_at desc);

-- Recherche full-text simple
create index if not exists videos_search_idx on public.videos
  using gin (to_tsvector('french', coalesce(title, '') || ' ' || coalesce(description, '')));

-- ============================================================
-- 5. LIKES
-- ============================================================
create table if not exists public.likes (
  user_id uuid not null references auth.users(id) on delete cascade,
  video_id uuid not null references public.videos(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, video_id)
);

create index if not exists likes_video_idx on public.likes(video_id);

-- ============================================================
-- 6. FAVORITES (Ma Liste)
-- ============================================================
create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  video_id uuid not null references public.videos(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, video_id)
);

create index if not exists favorites_user_idx on public.favorites(user_id, created_at desc);

-- ============================================================
-- 7. WATCH HISTORY ("Continuer à regarder")
-- ============================================================
create table if not exists public.watch_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  video_id uuid not null references public.videos(id) on delete cascade,
  progress_seconds int not null default 0,
  completed boolean not null default false,
  last_watched_at timestamptz not null default now(),
  unique (user_id, video_id)
);

create index if not exists watch_history_user_idx on public.watch_history(user_id, last_watched_at desc);

-- ============================================================
-- 8. COMMENTS
-- ============================================================
create table if not exists public.comments (
  id uuid primary key default uuid_generate_v4(),
  video_id uuid not null references public.videos(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 2000),
  parent_id uuid references public.comments(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists comments_video_idx on public.comments(video_id, created_at desc);

-- ============================================================
-- 9. NOTIFICATIONS (temps réel)
-- ============================================================
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  link_url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx on public.notifications(user_id, created_at desc);

-- ============================================================
-- 10. MESSAGES (chat temps réel)
-- ============================================================
create table if not exists public.conversations (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now()
);

create table if not exists public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 4000),
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_idx on public.messages(conversation_id, created_at desc);

-- ============================================================
-- TRIGGERS & FONCTIONS
-- ============================================================

-- Auto-update updated_at sur profiles
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Auto-créer profile à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'username',
      split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 6)
    ),
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Activer le temps réel
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.comments;
