import Link from "next/link";
import { logOut } from "@/app/actions/auth";
import { Logo } from "@/components/icons";
import { BRAND } from "@/lib/brand";
import { avatarColor } from "@/lib/constants";
import type { Viewer } from "@/lib/data";

const TABS = [
  { href: "/dashboard", label: "Before arrival" },
  { href: "/events", label: "During your stay" },
  { href: "/community", label: "Community" },
] as const;

export function AppHeader({ viewer, current }: { viewer: Viewer; current: string }) {
  const tabs = viewer.isAdmin ? [...TABS, { href: "/admin", label: "Admin" }] : TABS;
  return (
    <header className="bg-navy text-white">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4 sm:px-8">
        <Link href="/dashboard" className="flex items-center gap-2.5 text-white no-underline" aria-label={`${BRAND.displayName} home`}>
          <Logo size={32} /><span className="h text-[23px] font-extrabold">{BRAND.name}</span>
        </Link>
        <nav aria-label="App" className="order-3 flex w-full flex-wrap gap-1 md:order-none md:w-auto">
          {tabs.map((t) => (
            <Link key={t.href} className="tab" href={t.href} aria-current={current === t.href ? "page" : undefined}>{t.label}</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {viewer.terms[0] && <span className="chip hidden bg-navy-2 text-glacier sm:inline-flex">{viewer.terms.map((t) => t.name).join(" + ")}</span>}
          <Link href="/profile" aria-label="Your profile" className="grid h-10 w-10 place-items-center rounded-full font-bold text-navy no-underline"
            style={{ background: avatarColor(viewer.user.id) }}>
            {(viewer.profile.display_name || "?").slice(0, 1).toUpperCase()}
          </Link>
          <form action={logOut}>
            <button type="submit" className="min-h-11 cursor-pointer border-0 bg-transparent px-2 text-[13px] font-semibold text-mist hover:text-white">Log out</button>
          </form>
        </div>
      </div>
    </header>
  );
}

export function PhotoBand({ photo, position = "center 40%", credit, children, className = "pb-28" }: {
  photo: string; position?: string; credit: string; children: React.ReactNode; className?: string;
}) {
  return (
    <section className={`relative isolate overflow-hidden bg-navy px-4 pt-14 text-white sm:px-8 ${className}`}>
      <img src={photo} alt="" aria-hidden="true" className="photo-bg" style={{ objectPosition: position }} />
      <div aria-hidden="true" className="photo-shade" style={{ background: "linear-gradient(90deg, rgba(15,31,61,.94) 0%, rgba(15,31,61,.72) 52%, rgba(15,31,61,.4) 100%)" }} />
      <span className="absolute right-4 bottom-[52px] z-[1] hidden text-[11px] text-white/75 sm:block">{credit}</span>
      <div className="relative z-[1] mx-auto max-w-[1280px]">{children}</div>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute bottom-[-1px] left-0 h-[60px] w-full" aria-hidden="true">
        <path d="M0 60 L0 38 L120 14 L220 34 L360 6 L480 30 L620 12 L760 36 L900 8 L1040 32 L1180 14 L1320 34 L1440 16 L1440 60Z" fill="#FBF7EE" />
      </svg>
    </section>
  );
}
