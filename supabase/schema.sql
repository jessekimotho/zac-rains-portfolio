create table if not exists public.site_settings (
  id boolean primary key default true check (id),
  accent_color text not null default '#ff5b1a',
  background_color text not null default '#080b0c',
  paper_color text not null default '#f1eee7',
  body_font text not null default 'Space Grotesk',
  mono_font text not null default 'DM Mono',
  image_treatment text not null default 'natural',
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null default 'Selected work',
  cover_image text not null default '',
  full_resolution_link text not null default '',
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  image_url text not null,
  alt_text text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;

create policy "public can read settings" on public.site_settings for select using (true);
create policy "public can read published projects" on public.projects for select using (published = true);
create policy "public can read project images" on public.project_images for select using (true);
create policy "authenticated users manage settings" on public.site_settings for all to authenticated using (true) with check (true);
create policy "authenticated users manage projects" on public.projects for all to authenticated using (true) with check (true);
create policy "authenticated users manage project images" on public.project_images for all to authenticated using (true) with check (true);

insert into public.site_settings default values on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

create policy "public can view portfolio images" on storage.objects for select using (bucket_id = 'portfolio-images');
create policy "authenticated users upload portfolio images" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio-images');
create policy "authenticated users manage portfolio images" on storage.objects for update to authenticated using (bucket_id = 'portfolio-images');
create policy "authenticated users delete portfolio images" on storage.objects for delete to authenticated using (bucket_id = 'portfolio-images');
