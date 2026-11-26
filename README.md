# Exchange app (working name: chinook)

A starting point for incoming exchange students: a required-steps checklist, an events calendar and a semester community board, plus an admin console. It launches with the University of Calgary, and the data model already supports adding more universities.

**Stack:** Next.js 16 (App Router, server actions) + Tailwind 4 + Supabase (Postgres, Auth, row-level security). No email sending yet. Email confirmation is off, and there's no password reset.

## Run it locally

The database is a hosted Supabase project on the **free plan**: project `exchange-app`, ref `baalpigrjwdfelfuccaf`, region ca-central-1. No Docker is needed.

```bash
npm install
cp .env.example .env.local   # set the URL and the anon/publishable key (Supabase dashboard → Project Settings → API)
npm run dev                  # http://localhost:3000
```

`.env.local` and `.env.db` (the DB password) stay on your machine and are gitignored.

### Changing the schema

Add a new file in `supabase/migrations`, then push it to the hosted project:

```bash
supabase link --project-ref baalpigrjwdfelfuccaf
supabase db push              # add --include-seed only on an empty database
supabase config push          # after editing supabase/config.toml (auth settings)
```

Free-plan projects pause after a week with no activity. To resume one, open it in the Supabase dashboard and click Restore.

### Demo accounts (seeded into the hosted project)

Every demo account uses the password `demo-password-2027`.

| Email | Role |
|---|---|
| admin@example.com | Admin for UCalgary (sees the **Admin** tab) |
| lena@example.com | Student, Winter 2027 |

To try the full sign-up flow, create a new account from **Sign up**.

## Where things are

| Path | What |
|---|---|
| `src/app/page.tsx` | Landing page |
| `src/app/login`, `src/app/onboarding/*` | Log in and the 4-step sign-up (step 1 creates the account) |
| `src/app/dashboard` | Before arrival: rule-based required checklist, housing and guides |
| `src/app/events` | Calendar and list, filters, event details, activity ideas |
| `src/app/community` | Semester board: posts, replies, reports, member profiles |
| `src/app/admin/*` | Admin console: events (add/edit/cancel/delete), users (suspend, make admin), reports (hide/dismiss) |
| `src/app/actions/*` | Server actions (all writes) |
| `src/lib/brand.ts` | Product name. Change it here. |
| `supabase/migrations` | Schema and row-level security policies |
| `supabase/seed.sql` | UCalgary, Winter/Spring/Fall 2027, checklist, events, demo members |

## How privacy works

- Members can read only their own row in `profiles`.
- Everyone else is read through the `member_profiles` view. It drops every field the owner hasn't switched on, and it only shows members of the same university.
- Login email, country, dates and housing status never reach the view.
- Admins are scoped per university in the `admins` table. Every content table allows writes only for that university's admins.

## Checklist rules

Each `checklist_items` row has an `applies_to` rule, for example:

- `{"home_countries": ["Germany"]}`
- `{"stay": "short"}`, where "short" means the student's selected semesters span 6 months or less

If a student's home country isn't in `universities.reviewed_countries`, the dashboard shows "Requirements need confirmation" and links to the official IRCC tool. It doesn't guess.
