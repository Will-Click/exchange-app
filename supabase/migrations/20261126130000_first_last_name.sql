-- Split the public name into first + last name. display_name stays as the
-- public "First Last" (what members_profiles exposes) and is kept in sync by the app.
alter table public.profiles
  add column first_name text not null default '',
  add column last_name text not null default '';

update public.profiles set
  first_name = split_part(full_name, ' ', 1),
  last_name = trim(substr(full_name, length(split_part(full_name, ' ', 1)) + 1));

alter table public.profiles drop constraint display_name_length;
alter table public.profiles
  add constraint display_name_length check (char_length(display_name) <= 81),
  add constraint first_name_length check (char_length(first_name) <= 40),
  add constraint last_name_length check (char_length(last_name) <= 40);
