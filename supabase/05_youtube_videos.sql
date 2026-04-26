-- ============================================================
-- AJOUTE DES VRAIES URLs YOUTUBE AUX VIDÉOS DE DÉMO
-- ============================================================
-- À exécuter APRÈS 04_seed.sql.
--
-- COMMENT REMPLACER UNE URL :
--   1. Ouvre la vidéo YouTube de ton choix.
--   2. Copie l'URL complète (ex: https://www.youtube.com/watch?v=abc123)
--   3. Remplace l'ID dans video_url ET dans thumbnail_url.
--
-- IMPORTANT : on utilise hqdefault.jpg (480x360) qui existe TOUJOURS pour les
-- vidéos YouTube valides. maxresdefault.jpg n'est pas garantie.
-- ============================================================


-- ============================================================
-- ÉPISODES DE LA SÉRIE "L'Art d'Être Parent"
-- ============================================================

-- Épisode 1
update public.videos
set
  video_url = 'https://www.youtube.com/watch?v=yhxSHCHRZFE',
  thumbnail_url = 'https://i.ytimg.com/vi/yhxSHCHRZFE/hqdefault.jpg'
where series_id = '11111111-1111-1111-1111-111111111111'::uuid
  and episode_number = 1;

-- Épisode 2
update public.videos
set
  video_url = 'https://www.youtube.com/watch?v=qWFGDgoPHJ4',
  thumbnail_url = 'https://i.ytimg.com/vi/qWFGDgoPHJ4/hqdefault.jpg'
where series_id = '11111111-1111-1111-1111-111111111111'::uuid
  and episode_number = 2;

-- Épisode 3
update public.videos
set
  video_url = 'https://www.youtube.com/watch?v=H7eeyTtP3dU',
  thumbnail_url = 'https://i.ytimg.com/vi/H7eeyTtP3dU/hqdefault.jpg'
where series_id = '11111111-1111-1111-1111-111111111111'::uuid
  and episode_number = 3;


-- ============================================================
-- VIDÉOS ONE-SHOT (recommandées)
-- ============================================================

update public.videos
set
  video_url = 'https://www.youtube.com/watch?v=R0p1jnu_Z48',
  thumbnail_url = 'https://i.ytimg.com/vi/R0p1jnu_Z48/hqdefault.jpg'
where title = 'Parentalité +' and series_id is null;

update public.videos
set
  video_url = 'https://www.youtube.com/watch?v=Ee0YCmBgoBI',
  thumbnail_url = 'https://i.ytimg.com/vi/Ee0YCmBgoBI/hqdefault.jpg'
where title = 'Éveil 0-3 ans' and series_id is null;

update public.videos
set
  video_url = 'https://www.youtube.com/watch?v=gedoSfZvBgE',
  thumbnail_url = 'https://i.ytimg.com/vi/gedoSfZvBgE/hqdefault.jpg'
where title = 'Sommeil bébé' and series_id is null;

update public.videos
set
  video_url = 'https://www.youtube.com/watch?v=ZzfHjytDceU',
  thumbnail_url = 'https://i.ytimg.com/vi/ZzfHjytDceU/hqdefault.jpg'
where title = 'Discipline +' and series_id is null;

update public.videos
set
  video_url = 'https://www.youtube.com/watch?v=l81DwAt5pTk',
  thumbnail_url = 'https://i.ytimg.com/vi/l81DwAt5pTk/hqdefault.jpg'
where title = 'Questions Ados' and series_id is null;

update public.videos
set
  video_url = 'https://www.youtube.com/watch?v=1TMZsoEvcoE',
  thumbnail_url = 'https://i.ytimg.com/vi/1TMZsoEvcoE/hqdefault.jpg'
where title = 'Bio & Repas' and series_id is null;

update public.videos
set
  video_url = 'https://www.youtube.com/watch?v=H7eeyTtP3dU',
  thumbnail_url = 'https://i.ytimg.com/vi/H7eeyTtP3dU/hqdefault.jpg'
where title = 'Disc. Positive' and series_id is null;


-- ============================================================
-- VÉRIFICATION
-- ============================================================
-- Liste les vidéos qui n'ont toujours pas d'URL :
-- select id, title from public.videos where video_url is null;
