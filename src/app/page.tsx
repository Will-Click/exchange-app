import Link from "next/link";
import { Arrow, Check, Clipboard, Logo, Shield, Users, Lock, Chat } from "@/components/icons";
import { BRAND } from "@/lib/brand";
import { getViewer } from "@/lib/data";

export default async function Landing() {
  const viewer = await getViewer();

  return (
    <div className="w-full overflow-hidden">
      {/* NAV + HERO */}
      <section className="relative overflow-hidden bg-navy text-white isolate">
        <img src="/photos/moraine.jpg" alt="" aria-hidden="true" className="photo-bg" style={{ objectPosition: "center 35%" }} />
        <div aria-hidden="true" className="photo-shade" style={{ background: "linear-gradient(90deg, rgba(15,31,61,.94) 0%, rgba(15,31,61,.78) 42%, rgba(15,31,61,.28) 100%)" }} />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[140px] -z-[1]" style={{ background: "linear-gradient(rgba(15,31,61,.75), rgba(15,31,61,0))" }} />

        <header className="relative mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-6 px-4 py-6 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5 text-white no-underline" aria-label={`${BRAND.displayName} home`}>
            <Logo />
            <span className="h text-[26px] font-extrabold">{BRAND.name}</span>
          </Link>
          <div className="flex items-center gap-5">
            {viewer ? (
              <Link className="btn btn-sm" href="/dashboard">Open dashboard <Arrow /></Link>
            ) : (
              <>
                <Link href="/login" className="text-[13px] font-bold uppercase tracking-[.12em] text-white no-underline hover:text-sun">Log in</Link>
                <Link className="btn btn-sm" href="/onboarding/about">Sign up <Arrow /></Link>
              </>
            )}
          </div>
        </header>

        <div className="relative mx-auto flex max-w-[1240px] flex-wrap items-center gap-14 px-4 pt-14 pb-[150px] sm:px-8">
          <div className="flex min-w-0 max-w-[780px] flex-[1_1_520px] flex-col gap-7 py-10">
            <h1 className="h text-[clamp(44px,6vw,84px)] font-bold leading-none">
              Your exchange, <span className="mark-y">sorted</span> before you land.
            </h1>
            <p className="m-0 max-w-[560px] text-[21px] leading-normal text-[#E3EAF5]">
              Prep checklists, weekend adventures and your semester crew — one starting point for incoming exchange students, built around your host university.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <Link className="btn" href={viewer ? "/dashboard" : "/onboarding/about"}>Start my checklist <Arrow /></Link>
            </div>
            <p className="m-0 text-[13px] text-mist">Free to join · Student-built · Not affiliated with any university</p>
          </div>
        </div>
        <span className="absolute right-4 bottom-[92px] text-[11px] text-white/75">Moraine Lake, Banff National Park · Photo: public domain (Wikimedia Commons)</span>
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="absolute bottom-[-1px] left-0 h-[90px] w-full" aria-hidden="true">
          <path d="M0 90 L0 60 L160 22 L280 52 L420 10 L560 50 L700 24 L840 58 L980 18 L1120 54 L1260 26 L1440 56 L1440 90Z" fill="#FBF7EE" />
        </svg>
      </section>

      {/* THREE QUESTIONS */}
      <section className="mx-auto max-w-[1240px] px-4 pt-[72px] pb-6 sm:px-8">
        <p className="eyebrow mb-5 text-center">Built around three questions</p>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
          {[
            ["01", "#2EC4B6", "What should I prepare before coming?"],
            ["02", "#FF6A4D", "What can I do once I arrive?"],
            ["03", "#3C5BD6", "Who else is here for my exchange?"],
          ].map(([n, c, q]) => (
            <div key={n} className="flex items-center gap-4 rounded-[20px] bg-white p-6 shadow-[inset_0_0_0_1.5px_#E7E2D4]">
              <span className="h text-[44px] font-extrabold" style={{ color: c }}>{n}</span>
              <span className="h text-[22px] font-semibold leading-tight">{q}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative px-4 pt-20 pb-[220px] sm:px-8" style={{ background: "linear-gradient(#FBF7EE 0%, #E3F1FA 100%)" }}>
        <h2 className="h mb-14 text-center text-[clamp(36px,4vw,52px)] font-bold">How <span className="mark">{BRAND.name}</span> works</h2>
        <div className="relative z-[1] mx-auto grid max-w-[1100px] gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          {[
            ["#FFC93C", <Users key="u" size={36} />, "Tell us your plans.", "Semester, arrival date, housing status and what you're into. Two minutes, and you can skip anything optional."],
            ["#2EC4B6", <Clipboard key="c" size={36} />, "Work through your checklist.", "Official entry and study steps, housing, transit and weather packing — each linked to the source that's responsible for it."],
            ["#FF8A70", <Chat key="h" size={36} />, "Land with a crew.", "Find campus events, city plans and nearby day trips, then say hi to people on the same semester — before you even fly."],
          ].map(([bg, icon, title, body]) => (
            <div key={title as string} className="card flex flex-col items-center gap-3.5 px-7 py-8 text-center">
              <span className="grid h-[84px] w-[84px] place-items-center rounded-full text-navy" style={{ background: bg as string }} aria-hidden="true">{icon}</span>
              <h3 className="h text-2xl font-bold">{title}</h3>
              <p className="m-0 text-[15px] leading-[1.55] text-ink-2">{body}</p>
            </div>
          ))}
        </div>
        <svg viewBox="0 0 1440 240" preserveAspectRatio="none" className="absolute bottom-0 left-0 block h-[240px] w-full" aria-hidden="true">
          <path d="M0 240 L0 150 L140 70 L240 130 L380 30 L520 120 L640 60 L760 140 L900 40 L1040 120 L1160 70 L1300 130 L1440 60 L1440 240Z" fill="#B9D7EA" />
          <path d="M360 48 L380 30 L402 50 L384 44Z M880 58 L900 40 L922 60 L904 54Z M1420 76 L1440 60 L1440 80Z" fill="#fff" />
          <path d="M0 240 L0 190 L200 120 L340 180 L520 110 L700 190 L880 130 L1060 190 L1240 120 L1440 180 L1440 240Z" fill="#6E93B8" />
          <path d="M0 240 L0 215 Q360 185 720 214 T1440 208 L1440 240Z" fill="#0F1F3D" />
        </svg>
      </section>

      {/* FEATURE ROWS */}
      <section className="bg-navy px-4 py-24 text-white sm:px-8">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-[110px]">
          <div className="flex flex-wrap items-center gap-14">
            <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-5">
              <span className="chip self-start bg-teal text-navy">Before arrival</span>
              <h2 className="h text-[clamp(34px,3.6vw,48px)] font-bold leading-[1.05]">A checklist built for your trip, not a generic list.</h2>
              <p className="m-0 text-lg leading-relaxed text-mist">Only the steps you actually need to enter the country and start at your host university, based on where you&apos;re coming from and how long you&apos;re staying. You tick things off yourself — opening a link never marks anything done.</p>
            </div>
            <div className="grid min-w-0 flex-[1_1_460px] grid-cols-2 gap-4">
              <div className="col-span-2 flex flex-col gap-2.5 rounded-[22px] bg-sun p-[22px] text-navy">
                <div className="flex items-center justify-between"><span className="h text-[22px] font-bold">Required steps</span><span className="chip bg-navy text-sun">2 of 6 done</span></div>
                <p className="m-0 text-sm leading-normal">Travel authorization, insurance, course registration — each with the official source.</p>
                <div className="flex flex-wrap gap-2"><span className="chip bg-navy/10">Do this first: eTA</span></div>
              </div>
              <div className="flex flex-col gap-2 rounded-[22px] bg-navy-2 p-5"><span className="h text-[19px] font-bold">Housing guide</span><span className="text-[13px] leading-normal text-mist">Residence, rentals and scam tips</span></div>
              <div className="flex flex-col gap-2 rounded-[22px] bg-navy-2 p-5"><span className="h text-[19px] font-bold">Weather &amp; packing</span><span className="text-[13px] leading-normal text-mist">Seasonal guidance for your arrival month</span></div>
            </div>
          </div>

          <div className="flex flex-wrap-reverse items-center gap-14">
            <div className="flex min-w-0 flex-[1_1_460px] items-end justify-center gap-4">
              <div className="h-[220px] w-[44%] overflow-hidden rounded-[22px] opacity-65"><img src="/photos/louise.jpg" alt="" className="h-full w-full object-cover" /></div>
              <div className="flex w-[52%] flex-col items-center">
                <div className="h-[280px] w-full overflow-hidden rounded-[22px]"><img src="/photos/banff.jpg" alt="" className="h-full w-full object-cover" /></div>
                <span className="h -mt-[22px] rounded-full bg-coral px-[18px] py-2 text-navy"><span className="text-2xl font-extrabold">Free</span></span>
                <span className="mt-2.5 text-[13px] text-mist">( transport <strong className="text-white">not included</strong> · check organizer )</span>
                <span className="h mt-1 text-xl font-bold">Weekend day trip</span>
              </div>
            </div>
            <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-5">
              <span className="chip self-start bg-coral text-navy">During your stay</span>
              <h2 className="h text-[clamp(34px,3.6vw,48px)] font-bold leading-[1.05]">Campus, city and weekend trips on <span className="mark-y">one</span> calendar.</h2>
              <p className="m-0 text-lg leading-relaxed text-mist">Campus events, local happenings and nearby day trips. Every event links to the organizer to book — and undated adventures live in their own Activity Ideas list, never on a made-up date.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-14">
            <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-5">
              <span className="chip self-start bg-glacier text-navy">Semester community</span>
              <h2 className="h text-[clamp(34px,3.6vw,48px)] font-bold leading-[1.05]">Meet your semester before your flight boards.</h2>
              <p className="m-0 text-lg leading-relaxed text-mist">A moderated board for your cohort only. Introduce yourself, ask housing questions, or float a weekend trip. Share contact details only if you choose to.</p>
            </div>
            <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-3.5">
              <div className="card flex -rotate-[1.5deg] flex-col gap-2.5 p-5 text-navy">
                <div className="flex items-center gap-3"><span className="av h-10 w-10 bg-sun">L</span><div className="flex flex-col"><strong className="text-[15px]">Lena</strong><span className="text-xs text-[#5A6884]">Introductions · Demo post</span></div></div>
                <p className="m-0 text-[15px] leading-normal">Hi! Coming from Germany next semester. Into hiking and board games — anyone up for a day trip the first weekend?</p>
                <div className="flex gap-2"><span className="chip bg-[#E3F6F4]">Hiking</span><span className="chip bg-[#FFF1D0]">Games</span></div>
              </div>
              <div className="card ml-12 flex rotate-1 flex-col gap-2.5 p-5 text-navy">
                <div className="flex items-center gap-3"><span className="av h-10 w-10 bg-teal">K</span><div className="flex flex-col"><strong className="text-[15px]">Kenji</strong><span className="text-xs text-[#5A6884]">Reply · Demo post</span></div></div>
                <p className="m-0 text-[15px] leading-normal">I&apos;m in! Happy to help figure out transport.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="px-4 py-24 sm:px-8">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-10 rounded-[32px] bg-glacier px-6 py-14 sm:px-12">
          <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-4">
            <h2 className="h text-[clamp(32px,3.4vw,44px)] font-bold leading-[1.05]">We point you to the source. You confirm.</h2>
            <p className="m-0 text-[17px] leading-relaxed text-[#22324F]">Entry and study requirements depend on your situation. We never guess — where a rule isn&apos;t reviewed for you, you&apos;ll see <strong>&ldquo;Requirements need confirmation&rdquo;</strong> and the official next step.</p>
          </div>
          <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-3">
            {[
              [<Check key="a" className="text-teal-ink" />, "Every resource shows its source and last-reviewed date"],
              [<Lock key="b" size={20} className="text-teal-ink" />, "Your email, dates and housing stay private"],
              [<Shield key="c" className="text-teal-ink" />, "Community boards are moderated, with clear rules"],
            ].map(([icon, text]) => (
              <div key={text as string} className="flex items-center gap-3.5 rounded-2xl bg-white px-[18px] py-4">{icon}<span className="text-[15px]">{text}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24 sm:px-8">
        <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-6 text-center">
          <h2 className="h text-[clamp(40px,5vw,68px)] font-bold leading-none">Your host city is waiting. <br /><span className="mark">Let&apos;s get you ready.</span></h2>
          <Link className="btn btn-navy" href={viewer ? "/dashboard" : "/onboarding/about"}>Create a free account <Arrow /></Link>
        </div>
      </section>

      <footer className="bg-navy px-4 pt-14 pb-10 text-white sm:px-8">
        <div className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-12">
          <div className="flex max-w-[320px] flex-col gap-3">
            <span className="h text-[26px] font-extrabold">{BRAND.name}</span>
            <p className="m-0 text-sm leading-relaxed text-[#AEBBD3]">A student project for incoming exchange students. Not an official university service.</p>
          </div>
          <nav aria-label="Trust" className="flex flex-col gap-2.5">
            <strong className="text-[13px] uppercase tracking-[.12em] text-sun">Trust</strong>
            <Link className="text-sm text-mist no-underline hover:text-sun" href="/rules">Community rules</Link>
            <Link className="text-sm text-mist no-underline hover:text-sun" href="/privacy">Privacy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
