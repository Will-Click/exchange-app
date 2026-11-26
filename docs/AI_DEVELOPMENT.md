# How we built chinook with AI

This project was built for ENTI 333 to learn **AI-assisted software development**. Nearly all of the code was written by an AI coding agent. The people on the team set the direction, made the product calls, tested the app and pushed back when something was wrong.

## Tools

| Stage | Tool | What it did |
|---|---|---|
| Ideation and requirements | **Claude** (claude.ai) | Pressure-tested the idea, helped frame the problem, and drafted the [PRD](PRD.md): scope, privacy rules, acceptance criteria and what to leave out of the MVP |
| Design | **Claude** (design artifacts) | Produced clickable mockups. Their colours, fonts and components became the app's design tokens. |
| Main development | **Claude Code** | An agentic coding tool that works directly in the project folder: it reads and writes files, runs terminal commands, drives a browser to test pages, and commits to GitHub |
| Database | **Supabase CLI**, driven by Claude Code | Created the free hosted project, applied migrations and seed data, pushed auth settings, generated TypeScript types |
| Documentation | **Claude Code** | Wrote the README and these docs from the code and git history |

## The development loop

Every feature followed the same loop:

1. **We describe the outcome in plain language**, often with a screenshot of what's wrong.
2. **Claude Code reads the relevant code first**: schema, existing pages, how similar features were built.
3. It **makes the change**, including a database migration if needed, and **applies it** to the hosted database.
4. It **type-checks and lints** the code, then **tests the flow in a real browser**: logging in, clicking through and checking the result.
5. It **commits and pushes** to GitHub with a descriptive message.
6. We **review it in the app** and send the next request.

## Example prompts

These are real prompts from the build, in order, lightly edited for spelling.

> "Okay, I think we are ready to code it. What is the architecture you recommend?"

Claude Code proposed Next.js + Supabase with row-level security. It explained the trade-offs and then scaffolded the app, schema and seed data.

> "We don't need emailing right now. Can you just use the style of the existing mockup we just made?"

This was a scoping decision: no email verification or password reset in the MVP. It also tied the UI to the mockup design tokens.

> "Do we also need an admin console to upload events to the calendar and manage users?"

This added the `/admin` area: events, users (suspend, make admin) and the reports queue.

> "Can you create a new GitHub repo? Also the localhost is just showing a white screen."

Claude Code created the repo with the GitHub CLI. It found that the white screen was a dev server that wasn't running, not a code bug.

> "I don't want to use Docker. Can you use my existing Supabase account as a free account and create a new project database and then connect it? … Make sure you spend no money."

It moved the database from local Docker to a free hosted Supabase project, in the right organization, with the spend cap on.

> "Can you make the profile show my first name as well so it's not just my last name? Get rid of community guidelines. Make Winter 2027 the only option for now. In the top right, when I click on the letter, I should be able to view my profile and change anything I want."

Four changes in one message. Claude Code split them up:
- a migration adding first and last names;
- removing the rules checkbox and page;
- closing the other semesters;
- an "edit mode" so profile edits save and return to the profile instead of re-running the whole sign-up.

> "When I click on these nothing happens." (with a screenshot of the guide and activity cards)

The cards had no detail content. Claude Code added detail pages, researched official links and **checked that every URL loaded** before using it.

> "Yes, add it." (to "Add guide and activity-idea editing to the admin console?")

This added the **Guides & ideas** admin tab, with create, edit and delete, simple formatting for page text, and link validation.

## Where the AI got stuck, and how we got unstuck

| Problem | What happened | Fix |
|---|---|---|
| Framework version drift | Next.js 16 had changed conventions: middleware was renamed to `proxy`, and a new caching mode threw "runtime data during prerendering" errors. | The agent read the docs bundled with the installed version instead of relying on memory, and turned off `cacheComponents`. |
| Invisible active-tab text | A global `a { color: inherit }` rule beat Tailwind's layered classes, so the highlighted tab text disappeared. | Moved the rule into `@layer base`. The fix only came from looking at the page, not the code. |
| Email confirmation on the hosted database | The new hosted project required email confirmation by default, which blocked sign-up because the app sends no email. | Pushed `supabase/config.toml` to the hosted project. |
| Confusing name fields | Onboarding asked for a private "Full name" and a public "Display name". Our own tester typed only a last name as the display name. | Replaced them with First and Last name, both shown. This was real user feedback from testing. |
| Stale dev server | After new Server Actions were added, the running dev server still served the old list and the new admin page crashed. | Restarted the dev server. Typecheck had passed, so the code was correct. |
| Cards that looked clickable | The guide and idea cards had hover styles but no destination. | Added the detail pages and the admin editor. |

## Guardrails we gave the AI

- **Spend no money.** Only free-plan resources, with the spend cap on.
- **No secrets in git.** `.env*` files are gitignored, and the history was scanned before making the repo public.
- **Don't guess immigration rules.** Unreviewed countries get "Requirements need confirmation" and a link to the official tool.
- **Link to official sources** for fares, schedules and conditions instead of hard-coding them.
- **Test in the browser** before saying a feature is done.

## Lessons learned

1. **Describe outcomes, not implementations.** "When I click the letter I should be able to change anything" worked better than prescribing routes or components.
2. **Screenshots are the best bug reports.** Most UI fixes started from a screenshot.
3. **AI is fast at breadth, but people own the product calls.** Scope (no email, Winter 2027 only, no community rules), privacy defaults and naming were all human decisions.
4. **Verify what AI writes about the real world.** Facts like fares, distances and visa rules need official sources. The agent was told to check links and avoid unverified specifics.
5. **Keep the database the source of truth for security.** Row-level security meant AI-generated UI code couldn't accidentally expose private data.
6. **Commit small and often.** Each request ended in its own commit, which makes the history easy to follow (`git log`).
