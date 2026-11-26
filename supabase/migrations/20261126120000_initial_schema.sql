-- Initial schema for the exchange-student app.
-- Everything content-related is scoped to a university so more schools can be added later.

-- ───────────────────────────── Places & terms ─────────────────────────────

create table public.universities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_name text not null,
  city text not null,
  region text,
  country text not null,
  timezone text not null default 'America/Edmonton',
  is_active boolean not null default false,
  -- Home countries whose entry requirements have been reviewed for this university.
  reviewed_countries text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.terms (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references public.universities on delete cascade,
  name text not null,
  starts_on date not null,
  ends_on date not null,
  is_open boolean not null default true,
  created_at timestamptz not null default now(),
  unique (university_id, name)
);

-- ───────────────────────────── People ─────────────────────────────

create type public.housing_status as enum ('on_campus', 'off_campus', 'looking', 'unsure');
create type public.participant_type as enum ('exchange', 'member');

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null default '',
  display_name text not null default '',
  home_country text,
  major text,
  show_major boolean not null default true,
  home_university text,
  show_home_university boolean not null default false,
  university_id uuid references public.universities,
  participant_type public.participant_type not null default 'exchange',
  arrival_date date,
  arrival_unsure boolean not null default false,
  departure_note text,
  housing_status public.housing_status,
  interests text[] not null default '{}',
  custom_interests text[] not null default '{}',
  show_interests boolean not null default true,
  social_handle text,
  show_social boolean not null default false,
  contact_email text,
  show_contact_email boolean not null default false,
  phone text,
  show_phone boolean not null default false,
  accepted_rules_at timestamptz,
  onboarding_step int not null default 2,
  onboarded_at timestamptz,
  has_arrived boolean not null default false,
  suspended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint display_name_length check (char_length(display_name) <= 40),
  constraint phone_length check (phone is null or char_length(phone) <= 30)
);

create table public.profile_terms (
  profile_id uuid not null references public.profiles on delete cascade,
  term_id uuid not null references public.terms on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (profile_id, term_id)
);

-- Admins are scoped to one university.
create table public.admins (
  user_id uuid not null references auth.users on delete cascade,
  university_id uuid not null references public.universities on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, university_id)
);

-- ───────────────────────────── Before arrival ─────────────────────────────

create type public.checklist_kind as enum ('required', 'info');

create table public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references public.universities on delete cascade,
  slug text not null,
  kind public.checklist_kind not null default 'required',
  title text not null,
  body text,
  note text,
  link_label text,
  link_url text,
  source text,
  badge text,
  warning text,
  sort int not null default 0,
  -- Who sees the item, e.g. {"home_countries":["Germany"]} or {"stay":"short"}.
  applies_to jsonb not null default '{}',
  last_reviewed date,
  created_at timestamptz not null default now(),
  unique (university_id, slug)
);

create table public.checklist_progress (
  user_id uuid not null references auth.users on delete cascade,
  item_id uuid not null references public.checklist_items on delete cascade,
  done_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create table public.guides (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references public.universities on delete cascade,
  slug text not null,
  title text not null,
  summary text not null,
  category text not null default 'general', -- 'housing' or 'general'
  icon text not null default 'info',
  tone text not null default '#E3F6F4',
  links jsonb not null default '[]', -- [{label, url}]
  sort int not null default 0,
  unique (university_id, slug)
);

-- ───────────────────────────── During your stay ─────────────────────────────

create type public.event_category as enum ('university', 'city', 'rockies');
create type public.event_status as enum ('scheduled', 'canceled');

create table public.events (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references public.universities on delete cascade,
  title text not null,
  description text,
  category public.event_category not null,
  status public.event_status not null default 'scheduled',
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  organizer text,
  price_note text,
  is_free boolean not null default false,
  transport_note text,
  eligibility_note text,
  booking_url text,
  source_url text,
  tags text[] not null default '{}',
  is_demo boolean not null default false,
  last_reviewed date,
  created_by uuid references auth.users on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index events_university_starts_idx on public.events (university_id, starts_at);

create table public.activity_ideas (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references public.universities on delete cascade,
  title text not null,
  description text not null,
  season_note text not null,
  category public.event_category not null,
  tags text[] not null default '{}',
  image text,
  sort int not null default 0
);

create table public.partner_offers (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references public.universities on delete cascade,
  partner text not null,
  title text not null,
  code text,
  details text,
  expires_on date,
  is_demo boolean not null default false
);

-- ───────────────────────────── Community ─────────────────────────────

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  term_id uuid not null references public.terms on delete cascade,
  author_id uuid not null default auth.uid() references public.profiles on delete cascade,
  body text not null,
  event_id uuid references public.events on delete set null,
  is_pinned boolean not null default false,
  hidden_at timestamptz,
  created_at timestamptz not null default now(),
  constraint post_body_length check (char_length(body) between 1 and 4000)
);
create index posts_term_created_idx on public.posts (term_id, created_at desc);

create table public.replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts on delete cascade,
  author_id uuid not null default auth.uid() references public.profiles on delete cascade,
  body text not null,
  hidden_at timestamptz,
  created_at timestamptz not null default now(),
  constraint reply_body_length check (char_length(body) between 1 and 2000)
);
create index replies_post_idx on public.replies (post_id, created_at);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null default auth.uid() references auth.users on delete cascade,
  post_id uuid references public.posts on delete cascade,
  reply_id uuid references public.replies on delete cascade,
  reason text not null default '',
  resolved_at timestamptz,
  resolved_by uuid references auth.users on delete set null,
  created_at timestamptz not null default now(),
  constraint report_target check (num_nonnulls(post_id, reply_id) = 1)
);

-- ───────────────────────────── Helper functions ─────────────────────────────

create function public.is_admin(uni uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid() and a.university_id = uni);
$$;

create function public.is_any_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

create function public.is_term_member(t uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profile_terms pt
    join public.profiles p on p.id = pt.profile_id
    where pt.profile_id = auth.uid() and pt.term_id = t and p.suspended_at is null
  );
$$;

create function public.my_university() returns uuid
language sql stable security definer set search_path = '' as $$
  select university_id from public.profiles where id = auth.uid();
$$;

create function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
create trigger events_touch before update on public.events for each row execute function public.touch_updated_at();

-- Create an empty profile for each new sign-up.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, display_name)
  values (new.id,
          coalesce(new.raw_user_meta_data->>'full_name', ''),
          coalesce(new.raw_user_meta_data->>'display_name', ''));
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Stop members from granting themselves moderation-only fields.
create function public.guard_profile_update() returns trigger
language plpgsql set search_path = '' as $$
begin
  if not public.is_any_admin() then
    new.suspended_at = old.suspended_at;
  end if;
  return new;
end;
$$;
create trigger profiles_guard before update on public.profiles for each row execute function public.guard_profile_update();

-- ───────────────────────────── Public profile view ─────────────────────────────
-- Other members only ever read profiles through this view, which drops any field
-- the owner hasn't chosen to share. Runs as the view owner, so it bypasses the
-- owner-only policy on profiles; the WHERE clause limits it to the same university.

create view public.member_profiles with (security_invoker = false) as
select
  p.id,
  p.display_name,
  p.university_id,
  case when p.show_interests then p.interests || p.custom_interests else '{}'::text[] end as interests,
  case when p.show_home_university then p.home_university end as home_university,
  case when p.show_major then p.major end as major,
  case when p.show_social then p.social_handle end as social_handle,
  case when p.show_contact_email then p.contact_email end as contact_email,
  case when p.show_phone then p.phone end as phone,
  (select array_agg(t.name order by t.starts_on) from public.profile_terms pt join public.terms t on t.id = pt.term_id where pt.profile_id = p.id) as term_names
from public.profiles p
where p.suspended_at is null
  and p.onboarded_at is not null
  and p.university_id = public.my_university();

revoke all on public.member_profiles from anon;
grant select on public.member_profiles to authenticated;

-- ───────────────────────────── Row-level security ─────────────────────────────

alter table public.universities enable row level security;
alter table public.terms enable row level security;
alter table public.profiles enable row level security;
alter table public.profile_terms enable row level security;
alter table public.admins enable row level security;
alter table public.checklist_items enable row level security;
alter table public.checklist_progress enable row level security;
alter table public.guides enable row level security;
alter table public.events enable row level security;
alter table public.activity_ideas enable row level security;
alter table public.partner_offers enable row level security;
alter table public.posts enable row level security;
alter table public.replies enable row level security;
alter table public.reports enable row level security;

-- Universities & terms: readable by everyone (needed during sign-up).
create policy "read universities" on public.universities for select using (true);
create policy "read terms" on public.terms for select using (true);
create policy "admins manage terms" on public.terms for all to authenticated
  using (public.is_admin(university_id)) with check (public.is_admin(university_id));

-- Profiles: you read and edit your own row; admins read profiles at their university.
create policy "own profile read" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin(university_id));
create policy "own profile update" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
create policy "admins update profiles" on public.profiles for update to authenticated
  using (public.is_admin(university_id)) with check (public.is_admin(university_id));

create policy "own terms read" on public.profile_terms for select to authenticated
  using (profile_id = auth.uid() or public.is_admin((select university_id from public.terms t where t.id = term_id)));
create policy "own terms insert" on public.profile_terms for insert to authenticated
  with check (profile_id = auth.uid() and (select university_id from public.terms t where t.id = term_id) = public.my_university());
create policy "own terms delete" on public.profile_terms for delete to authenticated
  using (profile_id = auth.uid());

create policy "admins read admins" on public.admins for select to authenticated
  using (user_id = auth.uid() or public.is_admin(university_id));
create policy "admins add admins" on public.admins for insert to authenticated
  with check (public.is_admin(university_id));
create policy "admins remove admins" on public.admins for delete to authenticated
  using (public.is_admin(university_id) and user_id <> auth.uid());

-- Content: any signed-in user reads; admins of that university write.
create policy "read checklist" on public.checklist_items for select to authenticated using (true);
create policy "admins manage checklist" on public.checklist_items for all to authenticated
  using (public.is_admin(university_id)) with check (public.is_admin(university_id));

create policy "own progress" on public.checklist_progress for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "read guides" on public.guides for select to authenticated using (true);
create policy "admins manage guides" on public.guides for all to authenticated
  using (public.is_admin(university_id)) with check (public.is_admin(university_id));

create policy "read events" on public.events for select to authenticated using (true);
create policy "admins manage events" on public.events for all to authenticated
  using (public.is_admin(university_id)) with check (public.is_admin(university_id));

create policy "read ideas" on public.activity_ideas for select to authenticated using (true);
create policy "admins manage ideas" on public.activity_ideas for all to authenticated
  using (public.is_admin(university_id)) with check (public.is_admin(university_id));

create policy "read offers" on public.partner_offers for select to authenticated using (true);
create policy "admins manage offers" on public.partner_offers for all to authenticated
  using (public.is_admin(university_id)) with check (public.is_admin(university_id));

-- Community: only members of a term see and post on its board.
create policy "members read posts" on public.posts for select to authenticated
  using ((hidden_at is null and public.is_term_member(term_id))
         or public.is_admin((select university_id from public.terms t where t.id = term_id)));
create policy "members write posts" on public.posts for insert to authenticated
  with check (author_id = auth.uid() and public.is_term_member(term_id) and is_pinned = false and hidden_at is null);
create policy "authors delete posts" on public.posts for delete to authenticated
  using (author_id = auth.uid());
create policy "admins moderate posts" on public.posts for update to authenticated
  using (public.is_admin((select university_id from public.terms t where t.id = term_id)));

create policy "members read replies" on public.replies for select to authenticated
  using (exists (select 1 from public.posts p where p.id = post_id
                 and ((p.hidden_at is null and replies.hidden_at is null and public.is_term_member(p.term_id))
                      or public.is_admin((select university_id from public.terms t where t.id = p.term_id)))));
create policy "members write replies" on public.replies for insert to authenticated
  with check (author_id = auth.uid() and hidden_at is null
              and exists (select 1 from public.posts p where p.id = post_id and p.hidden_at is null and public.is_term_member(p.term_id)));
create policy "authors delete replies" on public.replies for delete to authenticated
  using (author_id = auth.uid());
create policy "admins moderate replies" on public.replies for update to authenticated
  using (exists (select 1 from public.posts p join public.terms t on t.id = p.term_id where p.id = post_id and public.is_admin(t.university_id)));

create policy "file reports" on public.reports for insert to authenticated
  with check (reporter_id = auth.uid());
create function public.report_university(post uuid, reply uuid) returns uuid
language sql stable security definer set search_path = '' as $$
  select t.university_id from public.posts p join public.terms t on t.id = p.term_id
  where p.id = coalesce(post, (select r.post_id from public.replies r where r.id = reply));
$$;
create policy "admins read reports" on public.reports for select to authenticated
  using (public.is_admin(public.report_university(post_id, reply_id)));
create policy "admins resolve reports" on public.reports for update to authenticated
  using (public.is_admin(public.report_university(post_id, reply_id)));
