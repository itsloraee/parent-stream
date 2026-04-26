-- ============================================================
-- DONNÉES DE DÉMO (optionnel, pour tester rapidement)
-- ============================================================

-- Catégories
insert into public.categories (slug, name, short_label, color, sort_order) values
  ('famille',    'Famille',    'Famille',    '#DC2626', 1),
  ('education',  'Éducation',  'Éduc.',      '#7C3AED', 2),
  ('sante',      'Santé',      'Santé',      '#10B981', 3),
  ('ados',       'Ados',       'Ados',       '#F59E0B', 4),
  ('sommeil',    'Sommeil',    'Sommeil',    '#3B82F6', 5),
  ('alimentation','Alimentation','Aliment.', '#EC4899', 6),
  ('eveil',      'Éveil',      'Éveil',      '#8B5CF6', 7)
on conflict (slug) do nothing;

-- Série principale
insert into public.series (id, title, description, category_id, rating, season, is_new)
select
  '11111111-1111-1111-1111-111111111111'::uuid,
  'L''Art d''Être Parent',
  'Une série dédiée à la parentalité moderne, offrant des conseils pratiques aux parents.',
  c.id,
  4.8,
  1,
  true
from public.categories c where c.slug = 'famille'
on conflict (id) do nothing;

-- Épisodes de "L'Art d'Être Parent"
insert into public.videos (series_id, title, subtitle, description, category_id, episode_number, duration_seconds, rating, satisfaction, views_count, is_published, published_at)
select
  '11111111-1111-1111-1111-111111111111'::uuid,
  'Épisode 1', 'Introduction',
  'Posons les bases d''une parentalité épanouie.',
  c.id, 1, 1320, 4.7, 96, 1800, true, now() - interval '30 days'
from public.categories c where c.slug = 'famille'
on conflict do nothing;

insert into public.videos (series_id, title, subtitle, description, category_id, episode_number, duration_seconds, rating, satisfaction, views_count, is_published, published_at)
select
  '11111111-1111-1111-1111-111111111111'::uuid,
  'Épisode 2', 'L''Écoute active',
  'Comment écouter vraiment son enfant.',
  c.id, 2, 1500, 4.8, 97, 2100, true, now() - interval '20 days'
from public.categories c where c.slug = 'famille'
on conflict do nothing;

insert into public.videos (series_id, title, subtitle, description, category_id, episode_number, duration_seconds, rating, satisfaction, views_count, is_published, published_at)
select
  '11111111-1111-1111-1111-111111111111'::uuid,
  'Épisode 3', 'La Communication Parent-Enfant',
  'Une série dédiée à la parentalité moderne, offrant des conseils pratiques aux parents.',
  c.id, 3, 1727, 4.8, 98, 2400, true, now() - interval '7 days'
from public.categories c where c.slug = 'famille'
on conflict do nothing;

-- Vidéos one-shot suggérées
insert into public.videos (title, subtitle, description, category_id, duration_seconds, rating, satisfaction, views_count, is_published, published_at)
select 'Parentalité +', 'Famille', 'Approfondir la relation parent-enfant.', c.id, 754, 4.6, 92, 3500, true, now() - interval '12 days'
from public.categories c where c.slug = 'famille'
on conflict do nothing;

insert into public.videos (title, subtitle, description, category_id, duration_seconds, rating, satisfaction, views_count, is_published, published_at)
select 'Éveil 0-3 ans', 'Éducation', 'Stimuler l''éveil de bébé.', c.id, 754, 4.5, 94, 4200, true, now() - interval '8 days'
from public.categories c where c.slug = 'education'
on conflict do nothing;

insert into public.videos (title, subtitle, description, category_id, duration_seconds, rating, satisfaction, views_count, is_published, published_at)
select 'Sommeil bébé', 'Santé', 'Tout savoir sur le sommeil du nourrisson.', c.id, 754, 4.7, 95, 5100, true, now() - interval '5 days'
from public.categories c where c.slug = 'sante'
on conflict do nothing;

insert into public.videos (title, subtitle, description, category_id, duration_seconds, rating, satisfaction, views_count, is_published, published_at)
select 'Discipline +', 'Éducation', 'Discipline positive au quotidien.', c.id, 754, 4.4, 91, 2800, true, now() - interval '15 days'
from public.categories c where c.slug = 'education'
on conflict do nothing;

insert into public.videos (title, subtitle, description, category_id, duration_seconds, rating, satisfaction, views_count, is_published, published_at)
select 'Questions Ados', 'Famille', 'Comprendre les ados.', c.id, 754, 4.6, 93, 3300, true, now() - interval '10 days'
from public.categories c where c.slug = 'ados'
on conflict do nothing;

insert into public.videos (title, subtitle, description, category_id, duration_seconds, rating, satisfaction, views_count, is_published, published_at)
select 'Bio & Repas', 'Santé', 'Alimentation saine pour toute la famille.', c.id, 754, 4.5, 90, 2600, true, now() - interval '18 days'
from public.categories c where c.slug = 'alimentation'
on conflict do nothing;

insert into public.videos (title, subtitle, description, category_id, duration_seconds, rating, satisfaction, views_count, is_published, published_at)
select 'Disc. Positive', 'Éducation', 'Pratiquer la discipline positive.', c.id, 754, 4.7, 95, 4100, true, now() - interval '22 days'
from public.categories c where c.slug = 'education'
on conflict do nothing;
