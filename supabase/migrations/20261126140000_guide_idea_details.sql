-- Detail pages for guides and activity ideas.
-- body: plain text. Blank line = new block, "## " = heading, "- " = bullet.
alter table public.guides add column body text not null default '';
alter table public.activity_ideas
  add column body text not null default '',
  add column links jsonb not null default '[]'; -- [{label, url}]
