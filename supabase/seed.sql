-- Local development seed: University of Calgary, Winter 2027 content, demo members and an admin.
-- Demo accounts (local only; see README): admin@example.com, lena@example.com — password "demo-password-2027".

-- ───────────── University & terms ─────────────
insert into public.universities (id, slug, name, short_name, city, region, country, is_active, reviewed_countries) values
  ('00000000-0000-4000-8000-000000000001', 'ucalgary', 'University of Calgary', 'UCalgary', 'Calgary', 'Alberta', 'Canada', true, '{Germany}');

insert into public.terms (id, university_id, name, starts_on, ends_on) values
  ('00000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-000000000001', 'Winter 2027', '2027-01-04', '2027-04-30'),
  ('00000000-0000-4000-8000-0000000000a2', '00000000-0000-4000-8000-000000000001', 'Spring 2027', '2027-05-03', '2027-06-25'),
  ('00000000-0000-4000-8000-0000000000a3', '00000000-0000-4000-8000-000000000001', 'Fall 2027', '2027-09-01', '2027-12-22');

-- ───────────── Required checklist (researched for a German citizen) ─────────────
insert into public.checklist_items (university_id, slug, kind, title, body, note, link_label, link_url, source, badge, warning, sort, applies_to, last_reviewed) values
  ('00000000-0000-4000-8000-000000000001', 'passport', 'required',
   'Valid passport for your whole stay', null, 'Your eTA is linked to this passport', null, null, 'IRCC', null, null, 10, '{}', '2026-11-24'),
  ('00000000-0000-4000-8000-000000000001', 'eta', 'required',
   'Get an eTA (electronic travel authorization) before you fly',
   'Germans flying to Canada need one. Apply only on the official Canada.ca site — most are approved in minutes, some take days. Airlines check it at check-in.',
   null, 'Apply on Canada.ca/eTA', 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta.html', 'IRCC', 'Do this first', null, 20,
   '{"home_countries":["Germany"]}', '2026-11-24'),
  ('00000000-0000-4000-8000-000000000001', 'acceptance-letter', 'required',
   'UCalgary exchange acceptance letter', null, 'Carry it with your enrolment letter when you land', null, null, 'UCalgary', null, null, 30, '{}', '2026-11-24'),
  ('00000000-0000-4000-8000-000000000001', 'medical-insurance', 'required',
   'Buy private medical insurance for your full stay',
   'Mandatory for exchange students. Stays under 12 months don''t qualify for Alberta Health Care, and UCalgary doesn''t sell a plan — buy one at home that covers travel, your semester and the trip back.',
   null, 'UCalgary medical insurance info', 'https://www.ucalgary.ca/international/', 'UCalgary', null, null, 40, '{}', '2026-11-24'),
  ('00000000-0000-4000-8000-000000000001', 'border-documents', 'required',
   'Pack proof of financial support and insurance for the border', null,
   'Show them with your passport and acceptance letter', null, null, 'UCalgary arrival guide', null, null, 50, '{}', '2026-11-24'),
  ('00000000-0000-4000-8000-000000000001', 'course-registration', 'required',
   'Register in at least 3 courses (9 units)',
   'Undergraduate exchange minimum; maximum is 5 courses (15 units).', null, null, null, 'UCalgary', null,
   'Registration deadline: not yet confirmed', 60, '{}', '2026-11-24'),
  ('00000000-0000-4000-8000-000000000001', 'study-permit-short', 'info',
   'Study permit: not required for your stay',
   'Courses of 6 months or less don''t need one — you enter as a visitor. You would need a permit to stay longer than 6 months, work off campus, or continue into another program.',
   null, 'Confirm with the official IRCC tool', 'https://www.canada.ca/en/immigration-refugees-citizenship/services/come-canada-tool.html', 'IRCC', null, null, 100,
   '{"stay":"short"}', '2026-11-24'),
  ('00000000-0000-4000-8000-000000000001', 'study-permit-long', 'info',
   'Study permit: you likely need one',
   'You''ve picked more than one semester, so your studies run longer than 6 months. Apply for a study permit before you travel — processing can take weeks.',
   null, 'Check with the official IRCC tool', 'https://www.canada.ca/en/immigration-refugees-citizenship/services/come-canada-tool.html', 'IRCC', null, null, 101,
   '{"stay":"long"}', '2026-11-24');

-- ───────────── Guides ─────────────
insert into public.guides (university_id, slug, title, summary, category, icon, tone, links, sort) values
  ('00000000-0000-4000-8000-000000000001', 'housing', 'Housing', 'We don''t host listings or contact landlords — these links go to the services that do.', 'housing', 'home', '#FFC93C',
   '[{"label":"UCalgary Residence Services","url":"https://www.ucalgary.ca/residence"},{"label":"Off-campus housing resources","url":"https://www.ucalgary.ca/student-services/"},{"label":"Avoiding rental scams","url":"https://www.canada.ca/en/financial-consumer-agency.html"}]', 0),
  ('00000000-0000-4000-8000-000000000001', 'transport', 'Transportation', 'Airport to campus, transit and the U-PASS.', 'general', 'bus', '#E3F6F4', '[]', 10),
  ('00000000-0000-4000-8000-000000000001', 'weather', 'Winter weather', 'Seasonal packing for January. Not a live forecast.', 'general', 'snow', '#FFF1D0', '[]', 20),
  ('00000000-0000-4000-8000-000000000001', 'esim', 'eSIM & phone', 'Check compatibility and plan terms with the provider.', 'general', 'phone', '#FFE6DF', '[]', 30),
  ('00000000-0000-4000-8000-000000000001', 'apps', 'Useful apps', 'Transit, campus, navigation and weather.', 'general', 'apps', '#E8ECFF', '[]', 40);

-- ───────────── Events (demo) ─────────────
insert into public.events (id, university_id, title, description, category, status, starts_at, location, organizer, price_note, is_free, transport_note, eligibility_note, tags, is_demo, last_reviewed) values
  ('00000000-0000-4000-8000-0000000000e1', '00000000-0000-4000-8000-000000000001', 'Exchange welcome mixer', 'Meet other incoming exchange students and the international office team.', 'university', 'scheduled', '2027-01-07 18:00-07', 'MacEwan Hall', 'UCalgary International', 'Free', true, 'On campus', 'Exchange students', '{Social}', true, '2026-11-24'),
  ('00000000-0000-4000-8000-0000000000e2', '00000000-0000-4000-8000-000000000001', 'Downtown skating night', 'Free public skating downtown — rentals available on site.', 'city', 'scheduled', '2027-01-11 19:00-07', 'Olympic Plaza', 'City of Calgary', 'Free', true, 'CTrain to City Hall', 'Everyone', '{Outdoors}', true, '2026-11-24'),
  ('00000000-0000-4000-8000-0000000000e3', '00000000-0000-4000-8000-000000000001', 'Climbing wall intro', 'A beginner session at the campus climbing centre.', 'university', 'scheduled', '2027-01-14 17:00-07', 'Outdoor Centre', 'Active Living', 'Check organizer', false, 'On campus', 'Students', '{Sports}', true, '2026-11-24'),
  ('00000000-0000-4000-8000-0000000000e4', '00000000-0000-4000-8000-000000000001', 'Indie music night', 'Local bands at a small venue.', 'city', 'scheduled', '2027-01-16 20:00-07', 'Inglewood', '[Venue]', 'Check organizer', false, 'Bus', '18+', '{Music,Nightlife}', true, '2026-11-24'),
  ('00000000-0000-4000-8000-0000000000e5', '00000000-0000-4000-8000-000000000001', 'Banff snowshoe trip', 'A guided snowshoe day in Banff National Park.', 'rockies', 'scheduled', '2027-01-18 07:30-07', 'Banff National Park', '[Organizer name]', 'Check organizer', false, 'Unknown — not included', 'Unknown', '{Hiking,Outdoors}', true, '2026-11-24'),
  ('00000000-0000-4000-8000-0000000000e6', '00000000-0000-4000-8000-000000000001', 'Clubs fair', 'Find clubs and teams for the semester.', 'university', 'scheduled', '2027-01-21 11:00-07', 'MacHall', 'Students'' Union', 'Free', true, 'On campus', 'Students', '{Social}', true, '2026-11-24'),
  ('00000000-0000-4000-8000-0000000000e7', '00000000-0000-4000-8000-000000000001', 'Trivia at the pub', 'Team trivia night.', 'city', 'scheduled', '2027-01-21 19:30-07', 'Kensington', '[Pub]', 'Free', true, 'CTrain', '18+', '{Nightlife}', true, '2026-11-24'),
  ('00000000-0000-4000-8000-0000000000e8', '00000000-0000-4000-8000-000000000001', 'Lake skating day', 'Skating on a frozen mountain lake — check ice conditions first.', 'rockies', 'scheduled', '2027-01-23 09:00-07', 'Lake Louise', '[Organizer name]', 'Check organizer', false, 'Not included', 'Unknown', '{Outdoors}', true, '2026-11-24'),
  ('00000000-0000-4000-8000-0000000000e9', '00000000-0000-4000-8000-000000000001', 'Film screening', 'An evening screening downtown.', 'city', 'scheduled', '2027-01-28 19:00-07', 'Globe Cinema', '[Cinema]', 'Check organizer', false, 'CTrain', 'Everyone', '{Arts & culture}', true, '2026-11-24'),
  ('00000000-0000-4000-8000-0000000000ea', '00000000-0000-4000-8000-000000000001', 'Canmore trip', 'Day trip to Canmore.', 'rockies', 'canceled', '2027-01-30 08:00-07', 'Canmore', '[Organizer name]', 'Check organizer', false, 'Not included', 'Unknown', '{Hiking}', true, '2026-11-24'),
  ('00000000-0000-4000-8000-0000000000eb', '00000000-0000-4000-8000-000000000001', 'Sunshine Village ski day', 'Group ski day — rentals and lessons booked with the resort.', 'rockies', 'scheduled', '2027-02-13 07:00-07', 'Sunshine Village', '[Organizer name]', 'Check organizer', false, 'Shuttle — check organizer', 'Unknown', '{Skiing}', true, '2026-11-24');

insert into public.activity_ideas (university_id, title, description, season_note, category, tags, image, sort) values
  ('00000000-0000-4000-8000-000000000001', 'First ski day at a Banff resort', 'Beginner lessons, rentals and shuttle info — booked with the resort.', 'Ongoing · Dec–Apr', 'rockies', '{Skiing}', '/photos/moraine.jpg', 10),
  ('00000000-0000-4000-8000-000000000001', 'Frozen canyon icewalk', 'Guided or self-guided — ice cleats needed. Transport not included.', 'Ongoing · winter', 'rockies', '{Hiking}', '/photos/louise.jpg', 20),
  ('00000000-0000-4000-8000-000000000001', 'Downtown + river pathway loop', 'A first-week walk to get your bearings. Reachable by CTrain.', 'Any time', 'city', '{Free}', '/photos/calgary.jpg', 30);

insert into public.partner_offers (university_id, partner, title, code, details, expires_on, is_demo) values
  ('00000000-0000-4000-8000-000000000001', '[Partner business]', 'gear rental discount', '[CODE]', 'Restrictions apply. Redeem on the partner''s site.', '2027-04-30', true);

-- ───────────── Demo accounts ─────────────
do $$
declare
  u record;
begin
  for u in select * from (values
    ('00000000-0000-4000-8000-0000000000b0'::uuid, 'admin@example.com', 'Site Admin', 'Admin'),
    ('00000000-0000-4000-8000-0000000000b1'::uuid, 'lena@example.com', 'Lena Weber', 'Lena'),
    ('00000000-0000-4000-8000-0000000000b2'::uuid, 'kenji@example.com', 'Kenji Sato', 'Kenji'),
    ('00000000-0000-4000-8000-0000000000b3'::uuid, 'mateo@example.com', 'Mateo Silva', 'Mateo'),
    ('00000000-0000-4000-8000-0000000000b4'::uuid, 'priya@example.com', 'Priya Nair', 'Priya')
  ) as t(id, email, full_name, display_name)
  loop
    insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
                            raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
                            confirmation_token, recovery_token, email_change_token_new, email_change)
    values ('00000000-0000-0000-0000-000000000000', u.id, 'authenticated', 'authenticated', u.email,
            extensions.crypt('demo-password-2027', extensions.gen_salt('bf')), now(),
            '{"provider":"email","providers":["email"]}',
            jsonb_build_object('full_name', u.full_name, 'display_name', u.display_name),
            now(), now(), '', '', '', '');
    insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    values (u.id::text, u.id, jsonb_build_object('sub', u.id::text, 'email', u.email), 'email', now(), now(), now());
  end loop;
end $$;

update public.profiles set
  university_id = '00000000-0000-4000-8000-000000000001',
  onboarded_at = now(), onboarding_step = 5, accepted_rules_at = now(), arrival_date = '2027-01-03'
where id in ('00000000-0000-4000-8000-0000000000b0', '00000000-0000-4000-8000-0000000000b1', '00000000-0000-4000-8000-0000000000b2',
             '00000000-0000-4000-8000-0000000000b3', '00000000-0000-4000-8000-0000000000b4');

update public.profiles set participant_type = 'member', home_country = 'Canada' where id = '00000000-0000-4000-8000-0000000000b0';
update public.profiles set home_country = 'Germany', home_university = 'TU Munich', show_home_university = true, major = 'Engineering',
  interests = '{skiing,food}', custom_interests = '{Board games}', social_handle = '@lena.in.yyc', show_social = true, housing_status = 'on_campus'
where id = '00000000-0000-4000-8000-0000000000b1';
update public.profiles set home_country = 'Japan', interests = '{skiing,music}', housing_status = 'on_campus' where id = '00000000-0000-4000-8000-0000000000b2';
update public.profiles set home_country = 'Portugal', interests = '{food,sports}', housing_status = 'looking' where id = '00000000-0000-4000-8000-0000000000b3';
update public.profiles set home_country = 'India', interests = '{hiking}', housing_status = 'off_campus' where id = '00000000-0000-4000-8000-0000000000b4';

insert into public.admins (user_id, university_id) values
  ('00000000-0000-4000-8000-0000000000b0', '00000000-0000-4000-8000-000000000001');

insert into public.profile_terms (profile_id, term_id)
select id, '00000000-0000-4000-8000-0000000000a1' from public.profiles
where id in ('00000000-0000-4000-8000-0000000000b0', '00000000-0000-4000-8000-0000000000b1', '00000000-0000-4000-8000-0000000000b2',
             '00000000-0000-4000-8000-0000000000b3', '00000000-0000-4000-8000-0000000000b4');

-- ───────────── Demo posts ─────────────
insert into public.posts (id, term_id, author_id, body, is_pinned, created_at, event_id) values
  ('00000000-0000-4000-8000-0000000000c0', '00000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-0000000000b0',
   'Be kind, no spam or scams, and never post someone else''s personal info. Membership is self-declared — nobody here is verified by the university.', true, now() - interval '3 days', null),
  ('00000000-0000-4000-8000-0000000000c1', '00000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-0000000000b1',
   'Hallo! Coming from Germany for Winter 2027, studying engineering. Into skiing, board games and finding good ramen. Anyone planning a ski day in February? Happy to coordinate.', false, now() - interval '2 hours', null),
  ('00000000-0000-4000-8000-0000000000c2', '00000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-0000000000b3',
   'Still looking for a room for January. Has anyone used the off-campus resources in the Housing card? Also — what areas are easy for getting to campus by train?', false, now() - interval '5 hours', null),
  ('00000000-0000-4000-8000-0000000000c3', '00000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-0000000000b4',
   'Saw the Banff snowshoe trip on Jan 18 in the calendar — anyone want to go together? I''ll book through the organizer''s site.', false, now() - interval '1 day', '00000000-0000-4000-8000-0000000000e5');

insert into public.replies (post_id, author_id, body, created_at) values
  ('00000000-0000-4000-8000-0000000000c1', '00000000-0000-4000-8000-0000000000b2',
   'I''m in! Never skied before though — does anyone know if the resorts do beginner packages?', now() - interval '1 hour');
