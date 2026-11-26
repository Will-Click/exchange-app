import type { Metadata } from "next";
import Link from "next/link";
import { setArrived } from "@/app/actions/app";
import { AppHeader, PhotoBand } from "@/components/app-header";
import { Alert, Arrow, Check, Clipboard, External, Home, Info, Plane } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";
import { daysUntil, fmt, itemApplies, requireMember, stayLength } from "@/lib/data";
import { CATEGORY_STYLE } from "@/lib/constants";
import { CheckItem } from "./check-item";
import { guideIcon } from "@/components/guide-icons";

export const metadata: Metadata = { title: "Before arrival" };


export default async function Dashboard() {
  const viewer = await requireMember();
  const { profile, university, terms } = viewer;
  const supabase = await createClient();
  const uniId = profile.university_id ?? "";

  const [{ data: items }, { data: progress }, { data: guides }, { data: events }, { data: posts }] = await Promise.all([
    supabase.from("checklist_items").select("*").eq("university_id", uniId).order("sort"),
    supabase.from("checklist_progress").select("item_id").eq("user_id", viewer.user.id),
    supabase.from("guides").select("*").eq("university_id", uniId).order("sort"),
    supabase.from("events").select("id, title, starts_at, category, is_demo").eq("university_id", uniId).eq("status", "scheduled")
      .gte("starts_at", profile.arrival_date ?? new Date().toISOString()).order("starts_at").limit(3),
    terms[0]
      ? supabase.from("posts").select("id, body, created_at").eq("term_id", terms[0].id).eq("is_pinned", false).order("created_at", { ascending: false }).limit(2)
      : Promise.resolve({ data: [] as { id: string; body: string; created_at: string }[] }),
  ]);

  const reviewed = Boolean(university?.reviewed_countries.includes(profile.home_country ?? ""));
  const applicable = (items ?? []).filter((i) => itemApplies(i, profile, terms));
  const required = applicable.filter((i) => i.kind === "required");
  const info = applicable.filter((i) => i.kind === "info");
  const doneIds = new Set((progress ?? []).map((p) => p.item_id));
  const doneCount = required.filter((i) => doneIds.has(i.id)).length;
  const days = daysUntil(profile.arrival_date);
  const housing = (guides ?? []).find((g) => g.category === "housing");
  const general = (guides ?? []).filter((g) => g.category !== "housing");
  const housingLinks = (housing?.links ?? []) as { label: string; url: string }[];
  const city = university?.city ?? "your host city";
  const lastReviewed = applicable.map((i) => i.last_reviewed).filter(Boolean).sort().at(-1);
  const stay = stayLength(terms);

  const housingCard = housing && (
    <article className="card flex flex-col gap-3.5 bg-sun p-6 shadow-[0_20px_40px_-24px_rgba(15,31,61,.5)]">
      <div className="flex flex-wrap items-center gap-3.5">
        <span className="grid h-[52px] w-[52px] place-items-center rounded-2xl bg-navy text-sun" aria-hidden="true"><Home size={26} /></span>
        <div className="flex flex-col gap-0.5">
          <h2 className="h text-2xl font-bold">Housing</h2>
          <span className="text-sm">{profile.housing_status === "looking" ? "You're still looking — start here" : profile.housing_status === "unsure" ? "Not sure yet — here's where to look" : "Sorted? Keep these handy"}</span>
        </div>
        <span className="chip ml-auto bg-navy text-sun">Guide</span>
      </div>
      <p className="m-0 max-w-[640px] text-[15px] leading-[1.55]">{housing.summary}</p>
      <div className="flex flex-wrap items-center gap-[22px]">
        {housingLinks.map((l) => (
          <a key={l.url} className="lnk decoration-navy" href={l.url} target="_blank" rel="noopener noreferrer">{l.label} <External /></a>
        ))}
      </div>
    </article>
  );

  return (
    <div className="w-full">
      <AppHeader viewer={viewer} current="/dashboard" />

      <PhotoBand photo="/photos/plaza.jpg" position="center 30%" credit="Olympic Plaza & Calgary Tower · Photo: CC0 (Wikimedia Commons)" className="pb-[104px]">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-3.5">
            <p className="m-0 text-[15px] text-mist">
              Hi {profile.display_name}
              {profile.home_country && profile.home_country !== "Other" && profile.home_country !== university?.country ? ` — flying in from ${profile.home_country}` : ""}
              {profile.arrival_date ? ` on ${fmt.date(profile.arrival_date)}` : ""}
            </p>
            <h1 className="h text-[clamp(40px,5vw,64px)] font-bold leading-none">
              {days === null ? <>Getting ready for <span className="text-sun">{city}.</span></>
                : days > 0 ? <><span className="text-sun">{days} {days === 1 ? "day" : "days"}</span> until {city}.</>
                : <>Welcome to <span className="text-sun">{city}.</span></>}
            </h1>
            <div className="mt-2 flex flex-wrap gap-2.5">
              <div role="group" aria-label="Dashboard section" className="inline-flex gap-1 rounded-full bg-navy-2 p-1">
                <Link href="/dashboard" aria-current="page" className="inline-flex min-h-12 items-center rounded-full bg-sun px-[22px] text-[13px] font-bold uppercase tracking-[.1em] text-navy no-underline">Before arrival</Link>
                <Link href="/events" className="inline-flex min-h-12 items-center rounded-full px-[22px] text-[13px] font-bold uppercase tracking-[.1em] text-[#DCE4F2] no-underline">During your stay</Link>
              </div>
              {!profile.has_arrived && (
                <form action={setArrived.bind(null, true)}>
                  <button type="submit" className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border-0 bg-transparent px-[22px] text-[13px] font-bold uppercase tracking-[.1em] text-white shadow-[inset_0_0_0_1.5px_rgba(255,255,255,.5)]">
                    <Plane size={18} />I have arrived
                  </button>
                </form>
              )}
            </div>
          </div>
          <div className="flex items-center gap-5 rounded-3xl bg-navy-2 px-[26px] py-5">
            <Ring done={doneCount} total={required.length} />
            <div className="flex flex-col gap-1"><strong className="h text-[22px]">Required steps</strong><span className="text-sm text-mist">To enter {university?.country ?? "the country"} &amp;<br />attend {university?.short_name ?? "university"}</span></div>
          </div>
        </div>
      </PhotoBand>

      <main className="relative z-[2] mx-auto -mt-8 box-border flex max-w-[1280px] flex-wrap gap-7 px-4 pb-[72px] sm:px-8">
        <div className="flex min-w-0 flex-[999_1_620px] flex-col gap-[22px]">
          {profile.housing_status === "looking" && housingCard}

          <article className="card flex flex-col gap-4 p-6">
            <div className="flex flex-wrap items-center gap-3.5">
              <span className="grid h-[52px] w-[52px] place-items-center rounded-2xl bg-navy text-sun" aria-hidden="true"><Clipboard size={26} /></span>
              <div className="flex min-w-[240px] flex-1 flex-col gap-0.5">
                <h2 className="h text-[28px] font-bold">Required before you arrive</h2>
                <span className="text-sm text-ink-2">To enter {university?.country} and attend the {university?.name}</span>
              </div>
              <span className="chip bg-sun text-navy">{doneCount} of {required.length} done</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[13px] text-ink-2">Based on:
              {profile.home_country && <span className="chip bg-sand">Travelling from {profile.home_country}</span>}
              <span className="chip bg-sand">Flying to {city}</span>
              <span className="chip bg-sand">{terms.map((t) => t.name).join(" + ")} · {stay === "short" ? "under 6 months" : "over 6 months"}</span>
              <Link href="/onboarding/about" className="text-[13px] font-semibold">Not right? Update</Link>
            </div>

            {!reviewed && (
              <div className="flex items-start gap-3.5 rounded-2xl bg-[#FFF1EC] px-[18px] py-4">
                <Alert className="mt-0.5 flex-none text-danger" />
                <div className="flex flex-col gap-1.5">
                  <strong className="text-[15px]">Requirements need confirmation</strong>
                  <span className="text-sm leading-[1.55] text-[#5A2A1C]">We haven&apos;t reviewed entry rules for travellers from {profile.home_country === "Other" || !profile.home_country ? "your country" : profile.home_country} yet. The steps below apply to everyone — check the official tool for anything else you need, such as a visa or eTA.</span>
                  <a className="lnk self-start decoration-danger" href="https://www.canada.ca/en/immigration-refugees-citizenship/services/come-canada-tool.html" target="_blank" rel="noopener noreferrer">Find out what you need on Canada.ca <External /></a>
                </div>
              </div>
            )}

            <div className="rounded-[18px] px-[18px] py-1 shadow-[inset_0_0_0_1.5px_#EFEBE0]">
              {required.map((i, n) => <CheckItem key={i.id} item={i} done={doneIds.has(i.id)} first={n === 0} />)}
            </div>

            {info.map((i) => (
              <div key={i.id} className="flex items-start gap-3.5 rounded-2xl bg-glacier px-[18px] py-4">
                <Info className="mt-0.5 flex-none" />
                <div className="flex flex-col gap-1.5">
                  <strong className="text-[15px]">{i.title}</strong>
                  {i.body && <span className="text-sm leading-[1.55] text-[#22324F]">{i.body}</span>}
                  {i.link_url && <a className="lnk self-start decoration-navy" href={i.link_url} target="_blank" rel="noopener noreferrer">{i.link_label} <External /></a>}
                </div>
              </div>
            ))}
            <span className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
              <Check size={14} />Summarized from official sources{lastReviewed ? ` · Last reviewed ${fmt.date(lastReviewed)}` : ""} · Ticking a box never completes an official application
            </span>
          </article>

          {profile.housing_status !== "looking" && housingCard}

          {general.length > 0 && (
            <>
              <h2 className="h mt-2 text-[22px] font-bold">Helpful guides <span className="tag align-middle font-sans">Optional</span></h2>
              <div className="grid gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                {general.map((g) => (
                  <Link key={g.id} href={`/guides/${g.slug}`} className="card group flex flex-col gap-2.5 p-6 no-underline transition-transform hover:-translate-y-0.5">
                    <span className="grid h-11 w-11 place-items-center rounded-[14px]" style={{ background: g.tone }} aria-hidden="true">{guideIcon(g.icon)}</span>
                    <h3 className="h text-xl font-bold">{g.title}</h3>
                    <p className="m-0 text-sm leading-normal text-ink-2">{g.summary}</p>
                    <span className="mt-auto flex items-center gap-1.5 pt-1 text-[13px] font-bold uppercase tracking-[.1em] text-navy">Read guide <Arrow /></span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="flex min-w-0 flex-[1_1_300px] flex-col gap-[22px]">
          <div className="card flex flex-col gap-3.5 bg-navy p-6 text-white">
            <h2 className="h text-[22px] font-bold">Your cohort</h2>
            <p className="m-0 text-sm text-mist">{terms.map((t) => t.name).join(" + ")} · {university?.name}</p>
            <div className="flex flex-col gap-2.5">
              {(posts ?? []).map((p) => (
                <Link key={p.id} href="/community" className="flex flex-col gap-1 rounded-[14px] bg-navy-2 px-3.5 py-3 text-white no-underline">
                  <span className="text-xs font-semibold text-[#9FE7DF]">{fmt.ago(p.created_at)}</span>
                  <span className="line-clamp-2 text-sm leading-[1.4]">{p.body}</span>
                </Link>
              ))}
              {(posts ?? []).length === 0 && <p className="m-0 text-sm text-mist">No posts yet — be the first to say hi.</p>}
            </div>
            <Link href="/community" className="flex min-h-11 items-center gap-2 self-start text-[13px] font-bold uppercase tracking-[.12em] text-sun no-underline">Open board <Arrow /></Link>
          </div>

          <div className="card flex flex-col gap-3.5 p-6">
            <div className="flex items-center justify-between"><h2 className="h text-[22px] font-bold">First weeks</h2><Link href="/events" className="text-[13px] font-semibold">All events</Link></div>
            {(events ?? []).map((e) => (
              <Link key={e.id} href={`/events?event=${e.id}`} className="flex items-center gap-3.5 no-underline">
                <span className={`flex w-14 flex-none flex-col rounded-[14px] py-2 text-center ${CATEGORY_STYLE[e.category].chip}`}>
                  <span className="text-[11px] font-bold tracking-[.1em]">{fmt.monthShort(e.starts_at)}</span>
                  <span className="h text-[22px] font-extrabold">{fmt.day(e.starts_at)}</span>
                </span>
                <div className="flex flex-col gap-0.5"><strong className="text-[15px]">{e.title}</strong><span className="text-[13px] text-muted">{CATEGORY_STYLE[e.category].label}{e.is_demo ? " · Demo event" : ""}</span></div>
              </Link>
            ))}
            {(events ?? []).length === 0 && <p className="m-0 text-sm text-muted">Nothing scheduled yet.</p>}
          </div>
        </aside>
      </main>
    </div>
  );
}

function Ring({ done, total }: { done: number; total: number }) {
  const r = 34, c = 2 * Math.PI * r;
  const pct = total ? done / total : 0;
  return (
    <svg width="84" height="84" viewBox="0 0 84 84" role="img" aria-label={`${done} of ${total} required steps done`}>
      <circle cx="42" cy="42" r={r} fill="none" stroke="#2C477A" strokeWidth="9" />
      <circle cx="42" cy="42" r={r} fill="none" stroke="#FFC93C" strokeWidth="9" strokeLinecap="round"
        strokeDasharray={`${c * pct} ${c}`} transform="rotate(-90 42 42)" />
      <text x="42" y="48" textAnchor="middle" fill="#fff" style={{ font: "800 19px var(--font-bricolage)" }}>{done}/{total}</text>
    </svg>
  );
}
