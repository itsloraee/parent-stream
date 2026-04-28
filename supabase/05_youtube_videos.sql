-- ============================================================
-- AJOUTE DES VRAIES URLs YOUTUBE AUX VIDÉOS DE DÉMO
-- ============================================================
-- À exécuter APRÈS 04_seed.sql.
--
-- Vidéos sélectionnées par @itsloraee — toutes pertinentes
-- avec les sujets de la plateforme (sommeil, éveil, discipline, ados, etc.)
--
-- Thumbnails : on utilise hqdefault.jpg (480x360) qui existe TOUJOURS pour les
-- vidéos YouTube valides. maxresdefault.jpg n'est pas garantie.
-- ============================================================


-- ============================================================
-- ÉPISODES DE LA SÉRIE "L'Art d'Être Parent"
-- ============================================================

-- Épisode 1
update public.videos
set
  video_url = 'https://www.youtube.com/watch?v=MrTAY7a2ZOE',
  thumbnail_url = 'https://i.ytimg.com/vi/MrTAY7a2ZOE/hqdefault.jpg'
where series_id = '11111111-1111-1111-1111-111111111111'::uuid
  and episode_number = 1;

-- Épisode 2
update public.videos
set
  video_url = 'https://www.youtube.com/watch?v=VpmAb1SAfIY',
  thumbnail_url = 'https://i.ytimg.com/vi/VpmAb1SAfIY/hqdefault.jpg'
where series_id = '11111111-1111-1111-1111-111111111111'::uuid
  and episode_number = 2;

-- Épisode 3
update public.videos
set
  video_url = 'https://www.youtube.com/watch?v=tibC8X3WV-s',
  thumbnail_url = 'https://i.ytimg.com/vi/tibC8X3WV-s/hqdefault.jpg'
where series_id = '11111111-1111-1111-1111-111111111111'::uuid
  and episode_number = 3;


-- ============================================================
-- VIDÉOS ONE-SHOT (recommandées)
-- ============================================================

update public.videos
set
  video_url = 'https://www.youtube.com/watch?v=xYp_3d62inw',
  thumbnail_url = 'https://i.ytimg.com/vi/xYp_3d62inw/hqdefault.jpg'
where title = 'Parentalité +' and series_id is null;

update public.videos
set
  video_url = 'https://www.youtube.com/watch?v=9jWs2gcs_yw',
  thumbnail_url = 'https://i.ytimg.com/vi/9jWs2gcs_yw/hqdefault.jpg'
where title = 'Éveil 0-3 ans' and series_id is null;

update public.videos
set
  video_url = 'https://www.youtube.com/watch?v=yv25eQLF_vs',
  thumbnail_url = 'https://i.ytimg.com/vi/yv25eQLF_vs/hqdefault.jpg'
where title = 'Sommeil bébé' and series_id is null;

update public.videos
set
  video_url = 'https://www.youtube.com/watch?v=HPgvOB9QeFI',
  thumbnail_url = 'https://i.ytimg.com/vi/HPgvOB9QeFI/hqdefault.jpg'
where title = 'Discipline +' and series_id is null;

update public.videos
set
  video_url = 'https://www.youtube.com/watch?v=NbuyTrjPnkI',
  thumbnail_url = 'https://i.ytimg.com/vi/NbuyTrjPnkI/hqdefault.jpg'
where title = 'Questions Ados' and series_id is null;

update public.videos
set
  video_url = 'https://www.youtube.com/watch?v=5EeLJJRRqAM',
  thumbnail_url = 'https://i.ytimg.com/vi/5EeLJJRRqAM/hqdefault.jpg'
where title = 'Bio & Repas' and series_id is null;

update public.videos
set
  video_url = 'https://www.youtube.com/watch?v=-GW15_yqxqw',
  thumbnail_url = 'https://i.ytimg.com/vi/-GW15_yqxqw/hqdefault.jpg'
where title = 'Disc. Positive' and series_id is null;


-- ============================================================
-- VÉRIFICATION
-- ============================================================
-- Liste les vidéos qui n'ont toujours pas d'URL :
-- select id, title from public.videos where video_url is null;
