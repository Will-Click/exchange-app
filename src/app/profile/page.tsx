import type { Metadata } from "next";
import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { Check } from "@/components/icons";
import { ProfileCard } from "@/components/profile-card";
import { avatarColor, interestLabel } from "@/lib/constants";
import { requireMember } from "@/lib/data";

export const metadata: Metadata = { title: "Your profile" };

export default async function ProfilePage({ searchParams }: PageProps<"/profile">) {
  const viewer = await requireMember();
  const { saved } = await searchParams;
  const p = viewer.profile;
  return (
    <div className="w-full">
      <AppHeader viewer={viewer} current="/profile" />
      <main className="mx-auto flex max-w-[1080px] flex-wrap items-start gap-8 px-4 py-12 sm:px-8">
        <div className="flex min-w-0 flex-[999_1_420px] flex-col gap-6">
          <h1 className="h text-[44px] font-bold">Your profile</h1>
          {saved && <p className="m-0 flex items-center gap-2 rounded-xl bg-[#E3F6F4] px-4 py-3 text-sm font-semibold text-teal-ink"><Check size={16} />Saved.</p>}
          <p className="m-0 text-base leading-relaxed text-ink-2">This is exactly what other members of your semester see. Your login email, country, dates and housing status are never shown.</p>
          <div className="card flex flex-col p-2">
            {[
              ["/onboarding/about", "About you", "Name, country, major, home university"],
              ["/onboarding/exchange", "Your exchange", "Semesters, arrival, housing"],
              ["/onboarding/interests", "Interests", "What you're into"],
              ["/onboarding/visibility", "Profile visibility", "What's shared and contact details"],
            ].map(([href, t, d]) => (
              <Link key={href} href={href} className="flex items-center justify-between gap-4 rounded-2xl px-4 py-4 no-underline hover:bg-sand">
                <span className="flex flex-col gap-0.5"><strong>{t}</strong><span className="text-[13px] text-muted">{d}</span></span>
                <span className="text-[13px] font-bold uppercase tracking-[.1em]">Edit</span>
              </Link>
            ))}
          </div>
        </div>
        <aside className="flex min-w-0 flex-[1_1_300px] flex-col gap-2.5">
          <span className="tag">What other members see</span>
          <ProfileCard person={{
            display_name: p.display_name,
            subtitle: [viewer.terms.map((t) => t.name).join(" + "), p.show_home_university && p.home_university, p.show_major && p.major].filter(Boolean).join(" · "),
            interests: p.show_interests ? [...p.interests.map(interestLabel), ...p.custom_interests] : [],
            social_handle: p.show_social ? p.social_handle : null,
            contact_email: p.show_contact_email ? p.contact_email : null,
            phone: p.show_phone ? p.phone : null,
            color: avatarColor(viewer.user.id),
          }} />
        </aside>
      </main>
    </div>
  );
}
