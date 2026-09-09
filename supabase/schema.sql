create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  youtube_video_id text not null unique,
  youtube_url text not null,
  title text not null,
  description text not null default '',
  category text not null default 'General',
  vehicle_type text not null default 'Automotive',
  level text not null default 'Beginner',
  duration text not null default 'N/A',
  thumbnail_url text not null,
  provider text not null default 'MechMaster Academy',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.videos enable row level security;

drop policy if exists "Anyone can read published videos" on public.videos;
create policy "Anyone can read published videos"
  on public.videos for select
  using (published = true or auth.role() = 'authenticated');

drop policy if exists "Authenticated admins can insert videos" on public.videos;
create policy "Authenticated admins can insert videos"
  on public.videos for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated admins can update videos" on public.videos;
create policy "Authenticated admins can update videos"
  on public.videos for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated admins can delete videos" on public.videos;
create policy "Authenticated admins can delete videos"
  on public.videos for delete
  to authenticated
  using (true);
