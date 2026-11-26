import type { Metadata } from "next";
import Link from "next/link";
import { AppHeader, PhotoBand } from "@/components/app-header";
import { Arrow, Calendar, ChevronLeft, Chevron, External, List, Mountain } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_STYLE, interestLabel, TZ } from "@/lib/constants";
import { fmt, localDateKey, requireMember, type EventRow } from "@/lib/data";

export const metadata: Metadata = { title: "During your stay" };

type Cat = keyof typeof CATEGORY_STYLE;
const CATS: Cat[] = ["university", "city", "rockies"];

export default async function EventsPage({ searchParams }: PageProps<"/events">) {
  const viewer = await requireMember();
  const sp = await searchParams;
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k][0] : sp[k]) as string | undefined;

  const supabase = await createClient();
  const uniId = viewer.profile.university_id ?? "";
  const [{ data: all }, { data: ideas }, { data: offers }] = await Promise.all([
    supabase.from("events").select("*").eq("university_id", uniId).order("starts_at"),
    supabase.from("activity_ideas").select("*").eq("university_id", uniId).order("sort"),
    supabase.from("partner_offers").select("*").eq("university_id", uniId),
  ]);
  const events = all ?? [];

  // ── Filters (all in the URL so the page works without client JS) ──
  const hidden = new Set((one("hide") ?? "").split(",").filter(Boolean) as Cat[]);
  const freeOnly = one("free") === "1";
  const mine = one("mine") === "1";
  const view = one("view") === "list" ? "list" : "calendar";
  const myTags = [...viewer.profile.interests.map(interestLabel), ...viewer.profile.custom_interests].map((t) => t.toLowerCase());

  const filtered = events.filter((e) =>
    !hidden.has(e.category)
    && (!freeOnly || e.is_free)
    && (!mine || e.tags.some((t) => myTags.includes(t.toLowerCase()))));

  const selected = events.find((e) => e.id === one("event")) ?? null;

  // ── Which month to show ──
  const arrival = viewer.profile.arrival_date;
  const fallbackMonth = (selected && localDateKey(selected.starts_at).slice(0, 7))
    ?? (arrival && arrival.slice(0, 7))
    ?? new Date().toLocaleDateString("en-CA", { timeZone: TZ }).slice(0, 7);
  const month = /^\d{4}-\d{2}$/.test(one("month") ?? "") ? one("month")! : fallbackMonth;
  const [y, m] = month.split("-").map(Number);

  const qs = (patch: Record<string, string | null>) => {
    const p = new URLSearchParams();
    const base: Record<string, string | null> = {
      month, view, hide: [...hidden].join(",") || null, free: freeOnly ? "1" : null, mine: mine ? "1" : null, event: selected?.id ?? null,
    };
    for (const [k, v] of Object.entries({ ...base, ...patch })) if (v) p.set(k, v);
    return `/events?${p.toString()}`;
  };
  const toggleCat = (c: Cat) => {
    const next = new Set(hidden);
    if (next.has(c)) next.delete(c); else next.add(c);
    return qs({ hide: [...next].join(",") || null });
  };
  const shift = (d: number) => {
    const dt = new Date(Date.UTC(y, m - 1 + d, 1));
    return qs({ month: `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}` });
  };

  const terms = viewer.terms;
  const stay = terms.length ? `${fmt.date(terms[0].starts_on)} – ${fmt.date(terms[terms.length - 1].ends_on)}` : "";
  const city = viewer.university?.city ?? "town";
  const anyFilter = hidden.size > 0 || freeOnly || mine;

  return (
    <div className="w-full">
      <AppHeader viewer={viewer} current="/events" />

      <PhotoBand photo="/photos/louise.jpg" credit="Frozen Lake Louise, Banff · Photo: CC0 (Wikimedia Commons)">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="flex flex-col gap-2.5">
              {stay && <p className="m-0 text-[15px] text-mist">Your exchange · {stay}</p>}
              <h1 className="h text-[clamp(40px,5vw,60px)] font-bold leading-none">What&apos;s on in <span className="rounded-xl bg-teal px-[.14em] text-navy">{city}</span> &amp; the Rockies</h1>
            </div>
            <div role="group" aria-label="View" className="inline-flex gap-1 rounded-full bg-navy-2 p-1">
              <Link className="fbtn" href={qs({ view: null })} aria-current={view === "calendar" ? "page" : undefined}><Calendar size={18} />Calendar</Link>
              <Link className="fbtn" href={qs({ view: "list" })} aria-current={view === "list" ? "page" : undefined}><List size={18} />List</Link>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label="Filters">
            {CATS.map((c) => (
              <Link key={c} className="fbtn" href={toggleCat(c)} aria-pressed={!hidden.has(c)}>
                {c === "rockies" ? <Mountain size={16} /> : <span className={`h-2.5 w-2.5 ${c === "city" ? "rounded-full" : "rounded-[3px]"}`} style={{ background: CATEGORY_STYLE[c].bar }} />}
                {c === "city" ? city : CATEGORY_STYLE[c].label}
              </Link>
            ))}
            <span className="mx-1.5 h-7 w-px bg-[#2C477A]" aria-hidden="true" />
            {myTags.length > 0 && <Link className="fbtn" href={qs({ mine: mine ? null : "1" })} aria-pressed={mine}>My interests</Link>}
            <Link className="fbtn" href={qs({ free: freeOnly ? null : "1" })} aria-pressed={freeOnly}>Free only</Link>
            {anyFilter && <Link className="fbtn bg-transparent text-sun underline underline-offset-4" href={qs({ hide: null, free: null, mine: null })}>Clear filters</Link>}
          </div>
        </div>
      </PhotoBand>

      <main className="relative z-[2] mx-auto -mt-10 box-border flex max-w-[1280px] flex-col gap-12 px-4 pb-[72px] sm:px-8">
        <div className="flex flex-wrap gap-6">
          {view === "calendar" ? (
            <section className="card min-w-0 flex-[999_1_640px] overflow-hidden px-[22px] pt-[22px]" aria-label={`${monthName(y, m)} calendar`}>
              <div className="flex flex-wrap items-center justify-between gap-3 px-1 pb-4">
                <div className="flex items-center gap-2">
                  <Link href={shift(-1)} aria-label="Previous month" className="grid h-11 w-11 place-items-center rounded-full bg-sand"><ChevronLeft /></Link>
                  <h2 className="h px-2 text-[28px] font-bold">{monthName(y, m)}</h2>
                  <Link href={shift(1)} aria-label="Next month" className="grid h-11 w-11 place-items-center rounded-full bg-sand"><Chevron /></Link>
                </div>
                <span className="text-[13px] text-muted">Times in Mountain Time ({city})</span>
              </div>
              <MonthGrid y={y} m={m} events={filtered} selectedId={selected?.id} arrival={arrival} hrefFor={(id) => qs({ event: id })} />
            </section>
          ) : (
            <section className="card min-w-0 flex-[999_1_640px] p-[22px]" aria-label="Upcoming events">
              <h2 className="h mb-2 text-[28px] font-bold">All events</h2>
              {filtered.length === 0 && <p className="text-muted">No events match these filters.</p>}
              <ul className="m-0 list-none p-0">
                {filtered.map((e) => (
                  <li key={e.id} className="border-t border-line first:border-t-0">
                    <Link href={qs({ event: e.id })} className="flex items-center gap-3.5 py-3.5 no-underline">
                      <span className={`flex w-14 flex-none flex-col rounded-[14px] py-2 text-center ${CATEGORY_STYLE[e.category].chip}`}>
                        <span className="text-[11px] font-bold tracking-[.1em]">{fmt.monthShort(e.starts_at)}</span>
                        <span className="h text-[22px] font-extrabold">{fmt.day(e.starts_at)}</span>
                      </span>
                      <span className="flex flex-col gap-0.5">
                        <strong className={e.status === "canceled" ? "text-[#5A6884] line-through" : ""}>{e.status === "canceled" ? "Canceled · " : ""}{e.title}</strong>
                        <span className="text-[13px] text-muted">{fmt.eventWhen(e.starts_at)} · {e.location}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <aside className="flex min-w-0 flex-[1_1_340px] flex-col gap-[18px]">
            {selected ? <EventDetail e={selected} /> : (
              <div className="card flex flex-col gap-2 p-6">
                <h2 className="h text-2xl font-bold">Pick an event</h2>
                <p className="m-0 text-sm text-muted">Select anything on the calendar to see when, where and how to book.</p>
              </div>
            )}
            {(offers ?? []).map((o) => (
              <article key={o.id} className="card flex flex-col gap-2.5 bg-[#FFF8E3] px-[22px] py-5 shadow-[inset_0_0_0_1.5px_#F3D98A]">
                <div className="flex flex-wrap justify-between gap-2"><span className="chip bg-navy text-sun">Partner offer</span>{o.is_demo && <span className="chip bg-white">Demo content</span>}</div>
                <strong className="h text-xl">{o.partner} — {o.title}</strong>
                <p className="m-0 text-sm leading-normal text-ink-2">
                  {o.code && <>Code <strong className="rounded-md bg-white px-2 py-0.5 font-mono">{o.code}</strong> · </>}
                  {o.expires_on && <>Expires {fmt.date(o.expires_on)} · </>}{o.details}
                </p>
              </article>
            ))}
          </aside>
        </div>

        {(ideas ?? []).length > 0 && (
          <section className="flex flex-col gap-5" aria-labelledby="ideas">
            <div className="flex flex-col gap-2">
              <h2 id="ideas" className="h text-[40px] font-bold">Activity ideas <span className="rounded-[10px] bg-glacier px-[.14em]">any weekend</span></h2>
              <p className="m-0 text-base text-ink-2">Ongoing ideas with no fixed date — check the organizer and current conditions before you go.</p>
            </div>
            <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
              {(ideas ?? []).map((i) => (
                <Link key={i.id} href={`/events/ideas/${i.id}`} className="group flex flex-col gap-3 no-underline">
                  <div className="relative h-[220px] overflow-hidden rounded-3xl bg-navy-2">
                    {i.image && <img src={i.image} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />}
                    <span className="chip absolute bottom-3 left-3 bg-white">{i.season_note}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className={`chip ${CATEGORY_STYLE[i.category].chip}`}>{i.category === "city" ? city : CATEGORY_STYLE[i.category].label}</span>
                    {i.tags.map((t) => <span key={t} className="chip bg-sand">{t}</span>)}
                  </div>
                  <h3 className="h text-[22px] font-bold group-hover:underline group-hover:decoration-teal group-hover:decoration-2 group-hover:underline-offset-4">{i.title}</h3>
                  <p className="m-0 text-sm text-ink-2">{i.description}</p>
                  <span className="flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[.1em] text-navy">See details <Arrow /></span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function monthName(y: number, m: number) {
  return new Date(Date.UTC(y, m - 1, 15)).toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

function MonthGrid({ y, m, events, selectedId, arrival, hrefFor }: {
  y: number; m: number; events: EventRow[]; selectedId?: string; arrival: string | null; hrefFor: (id: string) => string;
}) {
  const first = new Date(Date.UTC(y, m - 1, 1));
  const daysIn = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const lead = first.getUTCDay();
  const prevDays = new Date(Date.UTC(y, m - 1, 0)).getUTCDate();
  const byDay = new Map<string, EventRow[]>();
  for (const e of events) {
    const k = localDateKey(e.starts_at);
    byDay.set(k, [...(byDay.get(k) ?? []), e]);
  }
  const cells: { n: number; key: string | null }[] = [];
  for (let i = lead - 1; i >= 0; i--) cells.push({ n: prevDays - i, key: null });
  for (let d = 1; d <= daysIn; d++) cells.push({ n: d, key: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}` });
  while (cells.length % 7) cells.push({ n: cells.length - lead - daysIn + 1, key: null });

  return (
    <div className="-mx-[22px] overflow-x-auto">
      <div className="grid min-w-[620px] grid-cols-7 border-r border-line">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="border-l border-line p-2 text-xs font-bold uppercase tracking-[.1em] text-muted">{d}</div>
        ))}
        {cells.map((c, i) => {
          const evs = c.key ? byDay.get(c.key) ?? [] : [];
          const hasSel = evs.some((e) => e.id === selectedId);
          return (
            <div key={i} className={`box-border flex min-h-[104px] min-w-0 flex-col gap-1 border-t border-l border-line p-2 ${!c.key ? "bg-[#FAF8F2]" : hasSel ? "bg-[#FFF8E3]" : ""}`}>
              <span className={`text-[13px] font-bold ${!c.key ? "text-faint" : hasSel ? "inline-grid h-[26px] w-[26px] place-items-center rounded-full bg-navy text-white" : ""}`}>{c.n}</span>
              {c.key && c.key === arrival && <span className="truncate rounded-lg bg-sun px-[7px] py-1 text-xs font-semibold text-navy">You arrive</span>}
              {evs.map((e) => (
                <Link key={e.id} href={hrefFor(e.id)} title={e.title}
                  className={`truncate rounded-lg px-[7px] py-1 text-xs font-semibold no-underline ${e.id === selectedId ? "bg-navy text-white" : e.status === "canceled" ? "bg-sand text-[#5A6884] line-through" : CATEGORY_STYLE[e.category].ev}`}>
                  {e.status === "canceled" ? "Canceled · " : ""}{e.title}
                </Link>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventDetail({ e }: { e: EventRow }) {
  const style = CATEGORY_STYLE[e.category];
  const photo = e.category === "rockies" ? "/photos/banff.jpg" : e.category === "city" ? "/photos/calgary.jpg" : "/photos/plaza.jpg";
  const rows: [string, string | null, string?][] = [
    ["When", fmt.eventWhen(e.starts_at)],
    ["Where", e.location],
    ["Organizer", e.organizer],
    ["Price", e.price_note ?? (e.is_free ? "Free" : null)],
    ["Transport", e.transport_note, /not included|unknown/i.test(e.transport_note ?? "") ? "text-danger" : undefined],
    ["Eligibility", e.eligibility_note],
  ];
  return (
    <article className="card overflow-hidden">
      <div className="relative h-[150px]">
        <img src={photo} alt="" className="h-full w-full object-cover" />
        {e.is_demo && <span className="chip absolute top-3.5 left-3.5 bg-navy text-white">Demo content</span>}
      </div>
      <div className="flex flex-col gap-3 px-[22px] pt-5 pb-[22px]">
        <div className="flex flex-wrap gap-2">
          <span className={`chip ${style.chip}`}>{style.label}</span>
          {e.tags.map((t) => <span key={t} className="chip bg-sand">{t}</span>)}
        </div>
        {e.status === "canceled" && <p className="err m-0">This event was canceled by the organizer.</p>}
        <h2 className="h text-[28px] font-bold leading-[1.05]">{e.title}</h2>
        {e.description && <p className="m-0 text-sm leading-normal text-ink-2">{e.description}</p>}
        <dl className="m-0">
          {rows.filter(([, v]) => v).map(([k, v, cls]) => (
            <div key={k} className="flex gap-3 border-t border-line py-2.5 text-sm">
              <dt className="w-[110px] flex-none text-muted">{k}</dt><dd className={`m-0 font-semibold ${cls ?? ""}`}>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-1 flex flex-wrap gap-2.5">
          {e.booking_url && <a className="btn flex-auto" href={e.booking_url} target="_blank" rel="noopener noreferrer">Book with organizer <Arrow /></a>}
          {e.source_url && <a className="btn btn-white" href={e.source_url} target="_blank" rel="noopener noreferrer">Source <External /></a>}
        </div>
        {e.last_reviewed && <span className="text-xs text-muted">Last reviewed {fmt.date(e.last_reviewed)} · Check current conditions before you go</span>}
      </div>
    </article>
  );
}
