import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";
import { TZ } from "@/lib/constants";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Term = Database["public"]["Tables"]["terms"]["Row"];
export type University = Database["public"]["Tables"]["universities"]["Row"];
export type ChecklistItem = Database["public"]["Tables"]["checklist_items"]["Row"];
export type EventRow = Database["public"]["Tables"]["events"]["Row"];
export type MemberProfile = Database["public"]["Views"]["member_profiles"]["Row"];

/** The signed-in user and their profile, or null. Cached per request. */
export const getViewer = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const [{ data: profile }, { data: terms }, { data: admin }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("profile_terms").select("term_id, terms(*)").eq("profile_id", user.id),
    supabase.from("admins").select("university_id").eq("user_id", user.id),
  ]);
  if (!profile) return null;
  const myTerms = (terms ?? []).map((t) => t.terms).filter(Boolean)
    .sort((a, b) => a!.starts_on.localeCompare(b!.starts_on)) as Term[];
  let university: University | null = null;
  if (profile.university_id) {
    const { data } = await supabase.from("universities").select("*").eq("id", profile.university_id).single();
    university = data;
  }
  return {
    user,
    profile,
    terms: myTerms,
    university,
    isAdmin: (admin ?? []).some((a) => a.university_id === profile.university_id),
  };
});

export type Viewer = NonNullable<Awaited<ReturnType<typeof getViewer>>>;

/** For pages inside the app: requires a finished onboarding. */
export async function requireMember() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  if (viewer.profile.suspended_at) redirect("/suspended");
  if (!viewer.profile.onboarded_at) redirect(onboardingPath(viewer.profile.onboarding_step));
  return viewer;
}

export function onboardingPath(step: number) {
  return ["/onboarding/about", "/onboarding/about", "/onboarding/exchange", "/onboarding/interests", "/onboarding/visibility"][Math.min(Math.max(step, 1), 4)] ?? "/onboarding/exchange";
}

// ───────────── Checklist rules ─────────────

export function stayLength(terms: Term[]): "short" | "long" {
  if (terms.length === 0) return "short";
  const start = new Date(terms[0].starts_on).getTime();
  const end = new Date(terms[terms.length - 1].ends_on).getTime();
  return end - start > 183 * 24 * 3600 * 1000 ? "long" : "short";
}

type Rule = { home_countries?: string[]; stay?: "short" | "long" };

export function itemApplies(item: ChecklistItem, profile: Profile, terms: Term[]) {
  const rule = (item.applies_to ?? {}) as Rule;
  if (rule.home_countries && !rule.home_countries.includes(profile.home_country ?? "")) return false;
  if (rule.stay && rule.stay !== stayLength(terms)) return false;
  return true;
}

// ───────────── Dates ─────────────

export function daysUntil(date: string | null) {
  if (!date) return null;
  const today = new Date(new Date().toLocaleDateString("en-CA", { timeZone: TZ }));
  const target = new Date(date);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export const fmt = {
  date: (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  eventWhen: (iso: string) =>
    new Date(iso).toLocaleString("en-US", { timeZone: TZ, weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) + " MT",
  monthShort: (iso: string) => new Date(iso).toLocaleString("en-US", { timeZone: TZ, month: "short" }).toUpperCase(),
  day: (iso: string) => new Date(iso).toLocaleString("en-US", { timeZone: TZ, day: "2-digit" }),
  ago: (iso: string) => {
    const s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)} min ago`;
    if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
    if (s < 172800) return "yesterday";
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  },
};

/** Calendar-date key (YYYY-MM-DD) for an instant, in the university's timezone. */
export function localDateKey(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: TZ });
}
