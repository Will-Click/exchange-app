import Link from "next/link";
import { Check, Logo, Shield } from "@/components/icons";
import { BRAND } from "@/lib/brand";

const STEPS = ["About you", "Your exchange", "Interests", "Profile visibility"];

export function OnboardingShell({ step, note, title, aside, children }: {
  step: number;
  note: React.ReactNode;
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh w-full flex-wrap">
      <aside className="relative isolate flex max-w-full flex-[1_1_360px] flex-col gap-12 overflow-hidden bg-navy px-6 pt-8 pb-12 text-white sm:px-10 lg:max-w-[460px]">
        <img src="/photos/banff.jpg" alt="" aria-hidden="true" className="photo-bg" style={{ objectPosition: "60% center" }} />
        <div aria-hidden="true" className="photo-shade" style={{ background: "linear-gradient(180deg, rgba(15,31,61,.88) 0%, rgba(15,31,61,.62) 45%, rgba(15,31,61,.92) 100%)" }} />
        <Link href="/" className="flex items-center gap-2.5 text-white no-underline" aria-label={`${BRAND.displayName} home`}>
          <Logo /><span className="h text-[26px] font-extrabold">{BRAND.name}</span>
        </Link>
        <div className="flex flex-col gap-3.5">
          <h1 className="h text-[40px] font-bold leading-[1.05]">Let&apos;s build your starting point.</h1>
          <p className="m-0 text-base leading-relaxed text-[#DCE4F2]">Your answers shape your checklist, events and semester board. Change them any time from your profile.</p>
        </div>
        <ol className="m-0 flex list-none flex-col gap-5 p-0" aria-label="Onboarding steps">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const done = n < step;
            const current = n === step;
            return (
              <li key={label} className="flex items-center gap-3.5 text-[15px]" aria-current={current ? "step" : undefined}>
                <span className={`grid h-8 w-8 flex-none place-items-center rounded-full text-sm font-bold ${done ? "bg-teal text-navy" : current ? "bg-sun text-navy" : "text-[#DCE4F2] shadow-[inset_0_0_0_1.5px_#7F93B8]"}`}>
                  {done ? <Check size={16} /> : n}
                </span>
                {current ? <strong>{label}</strong> : <span className="text-[#DCE4F2]">{label}</span>}
              </li>
            );
          })}
        </ol>
        <div className="mt-auto flex items-start gap-3 rounded-[18px] bg-[rgba(29,52,96,.92)] px-5 py-[18px]">
          <Shield className="mt-0.5 flex-none text-sun" />
          <p className="m-0 text-sm leading-[1.55] text-[#DCE4F2]">{note}</p>
        </div>
      </aside>

      <main className="min-w-0 flex-[999_1_560px] px-5 pt-10 pb-14 sm:px-[clamp(20px,5vw,80px)]">
        <div className="flex max-w-[900px] flex-col gap-8">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <span className="eyebrow">Step {step} of 4</span>
              <div className="h-1.5 max-w-[220px] flex-1 rounded-full bg-[#E8E3D6]"><div className="h-full rounded-full bg-navy" style={{ width: `${step * 25}%` }} /></div>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="h text-[44px] font-bold">{title}</h2>
              {aside}
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

export function StepNav({ back, pending, label = "Continue", extra }: { back: string; pending: boolean; label?: string; extra?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t-[1.5px] border-[#E8E3D6] pt-3">
      <Link className="btn btn-ghost" href={back}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M14 8H3M7 4L3 8l4 4" /></svg>Back
      </Link>
      <div className="flex flex-wrap items-center gap-5">
        {extra}
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "Saving…" : label}
          {!pending && <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" /></svg>}
        </button>
      </div>
    </div>
  );
}
