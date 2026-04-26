-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
-- À exécuter dans le SQL Editor APRÈS avoir créé les buckets dans
-- l'interface Storage de Supabase, OU exécuter d'un coup ci-dessous.

-- Création des buckets (ignore si déjà créés)
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('thumbnails', 'thumbnails', true),
  ('videos', 'videos', false)
on conflict (id) do nothing;

-- ============================================================
-- POLITIQUES STORAGE
-- ============================================================

-- Avatars : lecture publique, upload par le propriétaire seulement
drop policy if exists "Avatar images are publicly accessible" on storage.objects;
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "Users can upload their avatar" on storage.objects;
create policy "Users can upload their avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users can update their avatar" on storage.objects;
create policy "Users can update their avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users can delete their avatar" on storage.objects;
create policy "Users can delete their avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Thumbnails : lecture publique, upload par utilisateur authentifié
drop policy if exists "Thumbnails are publicly accessible" on storage.objects;
create policy "Thumbnails are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'thumbnails');

drop policy if exists "Authenticated users can upload thumbnails" on storage.objects;
create policy "Authenticated users can upload thumbnails"
  on storage.objects for insert
  with check (
    bucket_id = 'thumbnails'
    and auth.role() = 'authenticated'
  );

-- Videos : accès restreint aux utilisateurs authentifiés
drop policy if exists "Videos are accessible to authenticated users" on storage.objects;
create policy "Videos are accessible to authenticated users"
  on storage.objects for select
  using (
    bucket_id = 'videos'
    and auth.role() = 'authenticated'
  );

drop policy if exists "Authenticated users can upload videos" on storage.objects;
create policy "Authenticated users can upload videos"
  on storage.objects for insert
  with check (
    bucket_id = 'videos'
    and auth.role() = 'authenticated'
  );
