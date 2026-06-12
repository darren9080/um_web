create extension if not exists vector;

create type cms_role as enum (
  'super_admin',
  'publisher',
  'desk_editor',
  'reporter',
  'ad_manager',
  'event_manager',
  'analyst',
  'viewer'
);

create type article_status as enum (
  'draft',
  'copyediting',
  'desk_review',
  'scheduled',
  'published',
  'archived'
);

create type desk_type as enum ('online', 'print', 'video');

create table cms_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role cms_role not null default 'viewer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null default '',
  body text not null default '',
  section text not null,
  status article_status not null default 'draft',
  desk desk_type not null default 'online',
  author_id uuid references cms_profiles(id),
  editor_id uuid references cms_profiles(id),
  seo_title text,
  meta_description text,
  seo_keywords text[] not null default '{}',
  canonical_url text,
  hero_image_url text,
  hero_image_alt text,
  published_at timestamptz,
  scheduled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table article_versions (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references articles(id) on delete cascade,
  snapshot jsonb not null,
  created_by uuid references cms_profiles(id),
  created_at timestamptz not null default now()
);

create table press_releases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  source text,
  uploaded_by uuid references cms_profiles(id),
  embedding vector(1536),
  created_at timestamptz not null default now()
);

create table article_similarity_checks (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references articles(id) on delete cascade,
  press_release_id uuid not null references press_releases(id) on delete cascade,
  cosine_similarity numeric(5, 4) not null,
  created_at timestamptz not null default now()
);

create table banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  placement text not null,
  image_url text not null,
  link_url text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_active boolean not null default false,
  sort_order integer not null default 0,
  created_by uuid references cms_profiles(id),
  updated_at timestamptz not null default now()
);

create table editorial_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_at timestamptz not null,
  location text,
  description text,
  is_published boolean not null default false,
  google_event_id text,
  created_by uuid references cms_profiles(id),
  updated_at timestamptz not null default now()
);

create table homepage_slots (
  id uuid primary key default gen_random_uuid(),
  section_key text not null,
  article_id uuid references articles(id) on delete set null,
  position integer not null,
  is_visible boolean not null default true,
  updated_by uuid references cms_profiles(id),
  updated_at timestamptz not null default now(),
  unique (section_key, position)
);

create table desk_queue (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references articles(id) on delete cascade,
  desk desk_type not null,
  assignee_id uuid references cms_profiles(id),
  priority text not null default 'normal',
  deadline_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table editorial_calendar_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  owner_id uuid references cms_profiles(id),
  item_type text not null,
  google_event_id text,
  created_at timestamptz not null default now()
);

create table article_analytics_daily (
  article_id uuid references articles(id) on delete cascade,
  metric_date date not null,
  views integer not null default 0,
  likes integer not null default 0,
  read_depth numeric(5, 2) not null default 0,
  primary key (article_id, metric_date)
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references cms_profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table cms_profiles enable row level security;
alter table articles enable row level security;
alter table article_versions enable row level security;
alter table press_releases enable row level security;
alter table article_similarity_checks enable row level security;
alter table banners enable row level security;
alter table editorial_events enable row level security;
alter table homepage_slots enable row level security;
alter table desk_queue enable row level security;
alter table editorial_calendar_items enable row level security;
alter table article_analytics_daily enable row level security;
alter table audit_logs enable row level security;

create or replace function current_cms_role()
returns cms_role
language sql
security definer
set search_path = public
stable
as $$
  select role from cms_profiles where id = auth.uid()
$$;

create policy "published articles are public"
on articles for select
using (status = 'published' or auth.uid() is not null);

create policy "cms users can manage articles"
on articles for all
to authenticated
using (current_cms_role() in ('super_admin', 'publisher', 'desk_editor', 'reporter'))
with check (current_cms_role() in ('super_admin', 'publisher', 'desk_editor', 'reporter'));

create policy "ad managers can manage banners"
on banners for all
to authenticated
using (current_cms_role() in ('super_admin', 'publisher', 'ad_manager'))
with check (current_cms_role() in ('super_admin', 'publisher', 'ad_manager'));

create policy "event managers can manage events"
on editorial_events for all
to authenticated
using (current_cms_role() in ('super_admin', 'publisher', 'event_manager', 'desk_editor'))
with check (current_cms_role() in ('super_admin', 'publisher', 'event_manager', 'desk_editor'));

create policy "analytics visible to allowed roles"
on article_analytics_daily for select
to authenticated
using (current_cms_role() in ('super_admin', 'publisher', 'desk_editor', 'analyst', 'ad_manager'));
