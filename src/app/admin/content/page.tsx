import type { Metadata } from "next";
import Link from "next/link";
import { deleteGuide, deleteIdea } from "@/app/actions/admin";
import { guideIcon } from "@/components/guide-icons";
import { Check, Plus } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_STYLE } from "@/lib/constants";
import { getViewer } from "@/lib/data";
import { ActionButton } from "../confirm-button";

export const metadata: Metadata = { title: "Admin · Guides & ideas" };

export default async function AdminContent({ searchParams }: PageProps<"/admin/content">) {
  const viewer = (await getViewer())!;
  const { saved } = await searchParams;
  const supabase = await createClient();
  const uni = viewer.profile.university_id!;
  const [{ data: guides }, { data: ideas }] = await Promise.all([
    supabase.from("guides").select("id, slug, title, summary, icon, tone, category, body, sort").eq("university_id", uni).order("sort"),
    supabase.from("activity_ideas").select("id, title, description, season_note, category, image, body, sort").eq("university_id", uni).order("sort"),
  ]);

  return (
    <div className="flex flex-col gap-10">
      {saved && <p className="m-0 flex items-center gap-2 rounded-xl bg-[#E3F6F4] px-4 py-3 text-sm font-semibold text-teal-ink"><Check size={16} />{saved === "idea" ? "Activity idea" : "Guide"} saved.</p>}

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="h text-[40px] font-bold">Guides</h1>
            <p className="m-0 text-ink-2">Shown under “Helpful guides” on the Before arrival page. Housing is its own card and can be edited but not deleted.</p>
          </div>
          <Link className="btn" href="/admin/content/guides/new"><Plus size={16} />New guide</Link>
        </div>
        <div className="card flex flex-col p-2">
          {(guides ?? []).map((g) => (
            <div key={g.id} className="flex flex-wrap items-center gap-4 rounded-2xl px-4 py-3.5 [&+&]:border-t [&+&]:border-line">
              <span className="grid h-11 w-11 flex-none place-items-center rounded-[14px]" style={{ background: g.tone }} aria-hidden="true">{guideIcon(g.icon)}</span>
              <div className="flex min-w-[200px] flex-1 flex-col gap-0.5">
                <strong>{g.title}{g.category === "housing" && <span className="chip ml-2 bg-sun text-navy">Housing card</span>}</strong>
                <span className="text-[13px] text-muted">{g.summary}</span>
              </div>
              {!g.body && g.category !== "housing" && <span className="chip bg-[#FFE6DF] text-[#9A3418]">No page content</span>}
              <div className="flex gap-1">
                {g.category !== "housing" && <Link className="act no-underline" href={`/guides/${g.slug}`} target="_blank">View</Link>}
                <Link className="act no-underline" href={`/admin/content/guides/${g.id}`}>Edit</Link>
                {g.category !== "housing" && <ActionButton action={deleteGuide.bind(null, g.id)} confirm={`Delete the “${g.title}” guide permanently? This can't be undone.`}>Delete</ActionButton>}
              </div>
            </div>
          ))}
          {(guides ?? []).length === 0 && <p className="m-0 px-4 py-6 text-center text-muted">No guides yet.</p>}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="h text-[40px] font-bold">Activity ideas</h2>
            <p className="m-0 text-ink-2">Shown under “Activity ideas any weekend” on the During your stay page. They have no fixed date.</p>
          </div>
          <Link className="btn" href="/admin/content/ideas/new"><Plus size={16} />New idea</Link>
        </div>
        <div className="card flex flex-col p-2">
          {(ideas ?? []).map((i) => (
            <div key={i.id} className="flex flex-wrap items-center gap-4 rounded-2xl px-4 py-3.5 [&+&]:border-t [&+&]:border-line">
              {i.image ? <img src={i.image} alt="" className="h-11 w-16 flex-none rounded-xl object-cover" /> : <span className="h-11 w-16 flex-none rounded-xl bg-navy-2" />}
              <div className="flex min-w-[200px] flex-1 flex-col gap-0.5">
                <strong>{i.title}</strong>
                <span className="text-[13px] text-muted">{i.season_note} · {i.description}</span>
              </div>
              <span className={`chip ${CATEGORY_STYLE[i.category].chip}`}>{CATEGORY_STYLE[i.category].label}</span>
              {!i.body && <span className="chip bg-[#FFE6DF] text-[#9A3418]">No page content</span>}
              <div className="flex gap-1">
                <Link className="act no-underline" href={`/events/ideas/${i.id}`} target="_blank">View</Link>
                <Link className="act no-underline" href={`/admin/content/ideas/${i.id}`}>Edit</Link>
                <ActionButton action={deleteIdea.bind(null, i.id)} confirm={`Delete “${i.title}” permanently? This can't be undone.`}>Delete</ActionButton>
              </div>
            </div>
          ))}
          {(ideas ?? []).length === 0 && <p className="m-0 px-4 py-6 text-center text-muted">No activity ideas yet.</p>}
        </div>
      </section>
    </div>
  );
}
