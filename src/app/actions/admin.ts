"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { zonedToIso } from "@/lib/time";

/** Every admin action re-checks the role; row-level security enforces it again in the database. */
async function adminContext() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("university_id").eq("id", user.id).single();
  const uni = profile?.university_id;
  const { data: isAdmin } = uni ? await supabase.rpc("is_admin", { uni }) : { data: false };
  if (!uni || !isAdmin) redirect("/dashboard");
  return { supabase, user, uni };
}

export type AdminFormState = { error?: string; fields?: Record<string, string> } | undefined;

const s = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const url = (v: string) => (v && !/^https?:\/\//i.test(v) ? `https://${v}` : v) || null;

export async function saveEvent(_: AdminFormState, form: FormData): Promise<AdminFormState> {
  const { supabase, user, uni } = await adminContext();
  const fields = Object.fromEntries([...form.keys()].map((k) => [k, s(form, k)]));
  const id = s(form, "id");
  const category = s(form, "category");
  if (!s(form, "title")) return { error: "Add a title.", fields };
  if (!["university", "city", "rockies"].includes(category)) return { error: "Pick a category.", fields };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s(form, "date"))) return { error: "Add a date.", fields };

  const row = {
    university_id: uni,
    title: s(form, "title"),
    description: s(form, "description") || null,
    category: category as "university" | "city" | "rockies",
    status: (s(form, "status") === "canceled" ? "canceled" : "scheduled") as "scheduled" | "canceled",
    starts_at: zonedToIso(s(form, "date"), s(form, "time") || "00:00"),
    ends_at: s(form, "end_time") ? zonedToIso(s(form, "date"), s(form, "end_time")) : null,
    location: s(form, "location") || null,
    organizer: s(form, "organizer") || null,
    price_note: s(form, "price_note") || null,
    is_free: form.get("is_free") === "on",
    transport_note: s(form, "transport_note") || null,
    eligibility_note: s(form, "eligibility_note") || null,
    booking_url: url(s(form, "booking_url")),
    source_url: url(s(form, "source_url")),
    tags: s(form, "tags").split(",").map((t) => t.trim()).filter(Boolean).slice(0, 8),
    is_demo: form.get("is_demo") === "on",
    last_reviewed: new Date().toISOString().slice(0, 10),
  };

  const { error } = id
    ? await supabase.from("events").update(row).eq("id", id)
    : await supabase.from("events").insert({ ...row, created_by: user.id });
  if (error) return { error: `Couldn't save the event: ${error.message}`, fields };

  revalidatePath("/events");
  revalidatePath("/admin/events");
  redirect("/admin/events?saved=1");
}

export async function setEventStatus(id: string, status: "scheduled" | "canceled") {
  const { supabase } = await adminContext();
  await supabase.from("events").update({ status }).eq("id", id);
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

export async function deleteEvent(id: string) {
  const { supabase } = await adminContext();
  await supabase.from("events").delete().eq("id", id);
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

export async function setSuspended(userId: string, suspended: boolean) {
  const { supabase, user } = await adminContext();
  if (userId === user.id) return;
  await supabase.from("profiles").update({ suspended_at: suspended ? new Date().toISOString() : null }).eq("id", userId);
  revalidatePath("/admin/users");
  revalidatePath("/admin/reports");
}

export async function setAdmin(userId: string, makeAdmin: boolean) {
  const { supabase, user, uni } = await adminContext();
  if (userId === user.id) return;
  if (makeAdmin) await supabase.from("admins").insert({ user_id: userId, university_id: uni });
  else await supabase.from("admins").delete().eq("user_id", userId).eq("university_id", uni);
  revalidatePath("/admin/users");
}

export async function resolveReport(reportId: string, action: "dismiss" | "hide") {
  const { supabase, user } = await adminContext();
  const { data: report } = await supabase.from("reports").select("post_id, reply_id").eq("id", reportId).single();
  if (!report) return;
  if (action === "hide") {
    const now = new Date().toISOString();
    if (report.post_id) await supabase.from("posts").update({ hidden_at: now }).eq("id", report.post_id);
    if (report.reply_id) await supabase.from("replies").update({ hidden_at: now }).eq("id", report.reply_id);
  }
  // Resolve every open report about the same content.
  const q = supabase.from("reports").update({ resolved_at: new Date().toISOString(), resolved_by: user.id }).is("resolved_at", null);
  await (report.post_id ? q.eq("post_id", report.post_id) : q.eq("reply_id", report.reply_id!));
  revalidatePath("/admin/reports");
  revalidatePath("/community");
}

// ───────────── Guides & activity ideas ─────────────

/** Parses one link per line: "Label | https://url" (a bare URL uses itself as the label). */
function parseLinks(text: string): { links: { label: string; url: string }[]; bad?: string } {
  const links: { label: string; url: string }[] = [];
  for (const raw of text.split("\n").map((l) => l.trim()).filter(Boolean)) {
    const [a, b] = raw.includes("|") ? raw.split("|").map((p) => p.trim()) : [raw, raw];
    const href = url(b ?? "");
    if (!href || !/^https?:\/\/[^\s/]+\.[^\s]+$/i.test(href)) return { links, bad: raw };
    links.push({ label: a || href, url: href });
  }
  return { links: links.slice(0, 12) };
}

const slugify = (t: string) => t.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_-]+/g, "-").slice(0, 60);

export async function saveGuide(_: AdminFormState, form: FormData): Promise<AdminFormState> {
  const { supabase, uni } = await adminContext();
  const fields = Object.fromEntries([...form.keys()].map((k) => [k, s(form, k)]));
  const id = s(form, "id");
  const title = s(form, "title");
  if (!title) return { error: "Add a title.", fields };
  if (!s(form, "summary")) return { error: "Add a one-line summary for the card.", fields };
  const { links, bad } = parseLinks(s(form, "links"));
  if (bad) return { error: `This link line isn't a valid web address: “${bad}”. Use “Label | https://…”.`, fields };

  const row = {
    title,
    summary: s(form, "summary"),
    icon: s(form, "icon") || "info",
    tone: /^#[0-9a-f]{6}$/i.test(s(form, "tone")) ? s(form, "tone") : "#E3F6F4",
    body: s(form, "body"),
    links,
    sort: Number.parseInt(s(form, "sort"), 10) || 0,
  };
  let error;
  if (id) {
    ({ error } = await supabase.from("guides").update(row).eq("id", id));
  } else {
    const base = slugify(title) || "guide";
    const { data: taken } = await supabase.from("guides").select("slug").eq("university_id", uni).like("slug", `${base}%`);
    const used = new Set((taken ?? []).map((g) => g.slug));
    let slug = base;
    for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;
    ({ error } = await supabase.from("guides").insert({ ...row, university_id: uni, slug, category: "general" }));
  }
  if (error) return { error: `Couldn't save the guide: ${error.message}`, fields };

  revalidatePath("/dashboard");
  revalidatePath("/admin/content");
  redirect("/admin/content?saved=guide");
}

export async function deleteGuide(id: string) {
  const { supabase } = await adminContext();
  await supabase.from("guides").delete().eq("id", id).neq("category", "housing");
  revalidatePath("/admin/content");
  revalidatePath("/dashboard");
}

export async function saveIdea(_: AdminFormState, form: FormData): Promise<AdminFormState> {
  const { supabase, uni } = await adminContext();
  const fields = Object.fromEntries([...form.keys()].map((k) => [k, s(form, k)]));
  const id = s(form, "id");
  const category = s(form, "category");
  if (!s(form, "title")) return { error: "Add a title.", fields };
  if (!s(form, "description")) return { error: "Add a one-line description for the card.", fields };
  if (!["university", "city", "rockies"].includes(category)) return { error: "Pick a category.", fields };
  const { links, bad } = parseLinks(s(form, "links"));
  if (bad) return { error: `This link line isn't a valid web address: “${bad}”. Use “Label | https://…”.`, fields };
  const image = s(form, "image");

  const row = {
    university_id: uni,
    title: s(form, "title"),
    description: s(form, "description"),
    season_note: s(form, "season_note") || "Any time",
    category: category as "university" | "city" | "rockies",
    tags: s(form, "tags").split(",").map((t) => t.trim()).filter(Boolean).slice(0, 4),
    image: /^\/photos\/[\w-]+\.jpg$/.test(image) ? image : null,
    body: s(form, "body"),
    links,
    sort: Number.parseInt(s(form, "sort"), 10) || 0,
  };
  const { error } = id
    ? await supabase.from("activity_ideas").update(row).eq("id", id)
    : await supabase.from("activity_ideas").insert(row);
  if (error) return { error: `Couldn't save the idea: ${error.message}`, fields };

  revalidatePath("/events");
  revalidatePath("/admin/content");
  redirect("/admin/content?saved=idea");
}

export async function deleteIdea(id: string) {
  const { supabase } = await adminContext();
  await supabase.from("activity_ideas").delete().eq("id", id);
  revalidatePath("/admin/content");
  revalidatePath("/events");
}
