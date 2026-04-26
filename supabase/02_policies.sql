-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================
-- Activer RLS sur toutes les tables
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.series enable row level security;
alter table public.videos enable row level security;
alter table public.likes enable row level security;
alter table public.favorites enable row level security;
alter table public.watch_history enable row level security;
alter table public.comments enable row level security;
alter table public.notifications enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;

-- ============================================================
-- PROFILES
-- ============================================================
drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- ============================================================
-- CATEGORIES (lecture publique)
-- ============================================================
drop policy if exists "Categories are public" on public.categories;
create policy "Categories are public"
  on public.categories for select using (true);

-- ============================================================
-- SERIES & VIDEOS (lecture publique pour vidéos publiées)
-- ============================================================
drop policy if exists "Series are public" on public.series;
create policy "Series are public"
  on public.series for select using (true);

drop policy if exists "Published videos are public" on public.videos;
create policy "Published videos are public"
  on public.videos for select using (is_published = true);

drop policy if exists "Uploaders can manage their videos" on public.videos;
create policy "Uploaders can manage their videos"
  on public.videos for all using (auth.uid() = uploader_id)
  with check (auth.uid() = uploader_id);

-- ============================================================
-- LIKES
-- ============================================================
drop policy if exists "Likes are viewable by everyone" on public.likes;
create policy "Likes are viewable by everyone"
  on public.likes for select using (true);

drop policy if exists "Users can like" on public.likes;
create policy "Users can like"
  on public.likes for insert with check (auth.uid() = user_id);

drop policy if exists "Users can unlike" on public.likes;
create policy "Users can unlike"
  on public.likes for delete using (auth.uid() = user_id);

-- ============================================================
-- FAVORITES
-- ============================================================
drop policy if exists "Users see their favorites" on public.favorites;
create policy "Users see their favorites"
  on public.favorites for select using (auth.uid() = user_id);

drop policy if exists "Users add favorites" on public.favorites;
create policy "Users add favorites"
  on public.favorites for insert with check (auth.uid() = user_id);

drop policy if exists "Users remove favorites" on public.favorites;
create policy "Users remove favorites"
  on public.favorites for delete using (auth.uid() = user_id);

-- ============================================================
-- WATCH HISTORY
-- ============================================================
drop policy if exists "Users see their history" on public.watch_history;
create policy "Users see their history"
  on public.watch_history for select using (auth.uid() = user_id);

drop policy if exists "Users insert their history" on public.watch_history;
create policy "Users insert their history"
  on public.watch_history for insert with check (auth.uid() = user_id);

drop policy if exists "Users update their history" on public.watch_history;
create policy "Users update their history"
  on public.watch_history for update using (auth.uid() = user_id);

-- ============================================================
-- COMMENTS
-- ============================================================
drop policy if exists "Comments are public" on public.comments;
create policy "Comments are public"
  on public.comments for select using (true);

drop policy if exists "Users can comment" on public.comments;
create policy "Users can comment"
  on public.comments for insert with check (auth.uid() = user_id);

drop policy if exists "Users can edit their comments" on public.comments;
create policy "Users can edit their comments"
  on public.comments for update using (auth.uid() = user_id);

drop policy if exists "Users can delete their comments" on public.comments;
create policy "Users can delete their comments"
  on public.comments for delete using (auth.uid() = user_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
drop policy if exists "Users see their notifications" on public.notifications;
create policy "Users see their notifications"
  on public.notifications for select using (auth.uid() = user_id);

drop policy if exists "Users update their notifications" on public.notifications;
create policy "Users update their notifications"
  on public.notifications for update using (auth.uid() = user_id);

-- ============================================================
-- CONVERSATIONS / MESSAGES
-- ============================================================
drop policy if exists "Participants see conversations" on public.conversations;
create policy "Participants see conversations"
  on public.conversations for select using (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = conversations.id and user_id = auth.uid()
    )
  );

drop policy if exists "Users can create conversations" on public.conversations;
create policy "Users can create conversations"
  on public.conversations for insert with check (true);

drop policy if exists "Participants see participants" on public.conversation_participants;
create policy "Participants see participants"
  on public.conversation_participants for select using (
    user_id = auth.uid()
    or exists (
      select 1 from public.conversation_participants p
      where p.conversation_id = conversation_participants.conversation_id
        and p.user_id = auth.uid()
    )
  );

drop policy if exists "Users join conversations" on public.conversation_participants;
create policy "Users join conversations"
  on public.conversation_participants for insert with check (auth.uid() = user_id);

drop policy if exists "Participants read messages" on public.messages;
create policy "Participants read messages"
  on public.messages for select using (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = messages.conversation_id and user_id = auth.uid()
    )
  );

drop policy if exists "Participants send messages" on public.messages;
create policy "Participants send messages"
  on public.messages for insert with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.conversation_participants
      where conversation_id = messages.conversation_id and user_id = auth.uid()
    )
  );
