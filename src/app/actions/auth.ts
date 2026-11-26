"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { COUNTRIES } from "@/lib/constants";
import { onboardingPath } from "@/lib/data";

export type FormState = { error?: string; fields?: Record<string, string> } | undefined;

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const keep = (f: FormData, keys: string[]) => Object.fromEntries(keys.map((k) => [k, str(f, k)]));

export async function logIn(_: FormState, form: FormData): Promise<FormState> {
  const email = str(form, "email");
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password.", fields: { email } };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "That email and password don't match an account.", fields: { email } };

  const { data: profile } = await supabase.from("profiles").select("onboarded_at, onboarding_step").eq("id", data.user.id).single();
  redirect(profile?.onboarded_at ? "/dashboard" : onboardingPath(profile?.onboarding_step ?? 2));
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

const ABOUT_FIELDS = ["first_name", "last_name", "email", "home_country", "major", "home_university"];

/** Onboarding step 1. Creates the account when signed out; updates the profile when signed in. */
export async function saveAbout(_: FormState, form: FormData): Promise<FormState> {
  const fields = keep(form, ABOUT_FIELDS);
  const { first_name, last_name, home_country } = fields;
  if (!first_name) return { error: "Add your first name.", fields };
  if (!last_name) return { error: "Add your last name.", fields };
  if (first_name.length > 40 || last_name.length > 40) return { error: "Keep each name under 40 characters.", fields };
  const display_name = `${first_name} ${last_name}`;
  const full_name = display_name;
  if (!COUNTRIES.includes(home_country)) return { error: "Pick the country you're travelling from.", fields };

  const supabase = await createClient();
  let { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");
    if (!/^\S+@\S+\.\S+$/.test(fields.email)) return { error: "Enter a valid email address.", fields };
    if (password.length < 8 || !/[\d\W_]/.test(password)) return { error: "Your password needs at least 8 characters, including a number or symbol.", fields };
    if (password !== confirm) return { error: "The two passwords don't match.", fields };

    const { data, error } = await supabase.auth.signUp({
      email: fields.email,
      password,
      options: { data: { full_name, display_name } },
    });
    if (error) {
      const taken = /registered|exists/i.test(error.message);
      return { error: taken ? "There's already an account with that email. Log in instead." : error.message, fields };
    }
    if (!data.session) return { error: "Your account was created but you aren't signed in yet. Try logging in.", fields };
    user = data.user;
  }

  const { data: uni } = await supabase.from("universities").select("id").eq("slug", "ucalgary").single();
  const { error } = await supabase.from("profiles").update({
    first_name,
    last_name,
    full_name,
    display_name,
    home_country,
    major: fields.major || null,
    show_major: form.get("show_major") === "on",
    home_university: fields.home_university || null,
    show_home_university: form.get("show_home_university") === "on",
    university_id: uni?.id ?? null,
  }).eq("id", user!.id);
  if (error) return { error: "Couldn't save your details. Try again.", fields };

  return next(user!.id, 2, "/onboarding/exchange");
}

/** Advances onboarding, or — once onboarded — sends the member back to their profile after an edit. */
async function next(userId: string, step: number, path: string): Promise<never> {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("onboarding_step, onboarded_at").eq("id", userId).single();
  if (data?.onboarded_at) redirect("/profile?saved=1");
  if ((data?.onboarding_step ?? 0) < step) {
    await supabase.from("profiles").update({ onboarding_step: step }).eq("id", userId);
  }
  redirect(path);
}

export async function saveExchange(_: FormState, form: FormData): Promise<FormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const termIds = form.getAll("terms").map(String);
  const housing = str(form, "housing_status");
  const arrivalUnsure = form.get("arrival_unsure") === "on";
  const arrival = str(form, "arrival_date");
  if (termIds.length === 0) return { error: "Pick at least one semester." };
  if (!arrivalUnsure && !arrival) return { error: "Add your expected arrival date, or tick “Not sure yet”." };
  if (!["on_campus", "off_campus", "looking", "unsure"].includes(housing)) return { error: "Pick your housing status." };

  const { error } = await supabase.from("profiles").update({
    participant_type: str(form, "participant_type") === "member" ? "member" : "exchange",
    arrival_date: arrivalUnsure ? null : arrival,
    arrival_unsure: arrivalUnsure,
    departure_note: str(form, "departure_note") || null,
    housing_status: housing as "on_campus" | "off_campus" | "looking" | "unsure",
  }).eq("id", user.id);
  if (error) return { error: "Couldn't save. Try again." };

  // Replace the term memberships with the selection.
  const { data: current } = await supabase.from("profile_terms").select("term_id").eq("profile_id", user.id);
  const have = new Set((current ?? []).map((r) => r.term_id));
  const want = new Set(termIds);
  const toRemove = [...have].filter((t) => !want.has(t));
  const toAdd = [...want].filter((t) => !have.has(t));
  if (toRemove.length) await supabase.from("profile_terms").delete().eq("profile_id", user.id).in("term_id", toRemove);
  if (toAdd.length) {
    const { error: e } = await supabase.from("profile_terms").insert(toAdd.map((term_id) => ({ profile_id: user.id, term_id })));
    if (e) return { error: "Couldn't join that semester. Try again." };
  }

  return next(user.id, 3, "/onboarding/interests");
}

export async function saveInterests(_: FormState, form: FormData): Promise<FormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const interests = form.getAll("interests").map(String);
  const custom = [...new Set(form.getAll("custom").map((v) => String(v).trim()).filter(Boolean))].slice(0, 12).map((v) => v.slice(0, 40));
  const { error } = await supabase.from("profiles").update({
    interests,
    custom_interests: custom,
    show_interests: form.get("show_interests") === "on",
  }).eq("id", user.id);
  if (error) return { error: "Couldn't save. Try again." };

  return next(user.id, 4, "/onboarding/visibility");
}

export async function saveVisibility(_: FormState, form: FormData): Promise<FormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const fields = keep(form, ["social_handle", "contact_email", "phone"]);
  if (fields.contact_email && !/^\S+@\S+\.\S+$/.test(fields.contact_email)) return { error: "That contact email doesn't look right.", fields };
  if (fields.phone && !/^[+\d][\d\s().-]{5,28}$/.test(fields.phone)) return { error: "That phone number doesn't look right.", fields };

  const { data: existing } = await supabase.from("profiles").select("onboarded_at").eq("id", user.id).single();
  const { error } = await supabase.from("profiles").update({
    show_interests: form.get("show_interests") === "on",
    show_home_university: form.get("show_home_university") === "on",
    social_handle: fields.social_handle || null,
    show_social: form.get("show_social") === "on",
    contact_email: fields.contact_email || null,
    show_contact_email: form.get("show_contact_email") === "on",
    phone: fields.phone || null,
    show_phone: form.get("show_phone") === "on",
    onboarding_step: 5,
    onboarded_at: existing?.onboarded_at ?? new Date().toISOString(),
  }).eq("id", user.id);
  if (error) return { error: "Couldn't save. Try again.", fields };

  redirect(existing?.onboarded_at ? "/profile?saved=1" : "/dashboard");
}
