import type { Metadata } from "next";
import Link from "next/link";
import { deleteEvent, setEventStatus } from "@/app/actions/admin";
import { Check, Plus } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_STYLE } from "@/lib/constants";
import { fmt, getViewer } from "@/lib/data";
import { ActionButton } from "../confirm-button";

export const metadata: Metadata = { title: "Admin · Events" };

export default async function AdminEvents({ searchParams }: PageProps<"/admin/events">) {
  const viewer = (await getViewer())!;
  const { saved, show } = await searchParams;
  const supabase = await createClient();
  const now = new Date().toISOString();
  let q = supabase.from("events").select("*").eq("university_id", viewer.profile.university_id!);
  q = show === "past" ? q.lt("starts_at", now).order("starts_at", { ascending: false }) : q.gte("starts_at", now).order("starts_at");
  const { data: events } = await q;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="h text-[40px] font-bold">Events</h1>
          <p className="m-0 text-ink-2">Everything here shows on the students&apos; calendar. Times are in Mountain Time.</p>
        </div>
        <Link className="btn" href="/admin/events/new"><Plus size={16} />New event</Link>
      </div>
      {saved && <p className="m-0 flex items-center gap-2 rounded-xl bg-[#E3F6F4] px-4 py-3 text-sm font-semibold text-teal-ink"><Check size={16} />Event saved.</p>}
      <div className="flex gap-2">
        <Link href="/admin/events" className={`chip h-10 px-4 text-sm no-underline ${show !== "past" ? "bg-navy text-white" : "bg-white shadow-[inset_0_0_0_1.5px_#E2DDCF]"}`}>Upcoming</Link>
        <Link href="/admin/events?show=past" className={`chip h-10 px-4 text-sm no-underline ${show === "past" ? "bg-navy text-white" : "bg-white shadow-[inset_0_0_0_1.5px_#E2DDCF]"}`}>Past</Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-[.1em] text-muted">
              <th className="px-5 py-3.5 font-bold">When</th><th className="px-3 py-3.5 font-bold">Event</th><th className="px-3 py-3.5 font-bold">Category</th>
              <th className="px-3 py-3.5 font-bold">Status</th><th className="px-5 py-3.5 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(events ?? []).map((e) => (
              <tr key={e.id} className="border-t border-line align-middle">
                <td className="px-5 py-3 whitespace-nowrap">{fmt.eventWhen(e.starts_at)}</td>
                <td className="px-3 py-3"><strong>{e.title}</strong>{e.is_demo && <span className="chip ml-2 bg-sand">Demo</span>}<div className="text-[13px] text-muted">{e.location}</div></td>
                <td className="px-3 py-3"><span className={`chip ${CATEGORY_STYLE[e.category].chip}`}>{CATEGORY_STYLE[e.category].label}</span></td>
                <td className="px-3 py-3">{e.status === "canceled" ? <span className="chip bg-[#FFE6DF] text-[#9A3418]">Canceled</span> : <span className="chip bg-[#E3F6F4] text-teal-ink">Scheduled</span>}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    <Link className="act no-underline" href={`/admin/events/${e.id}`}>Edit</Link>
                    {e.status === "canceled"
                      ? <ActionButton action={setEventStatus.bind(null, e.id, "scheduled")}>Restore</ActionButton>
                      : <ActionButton action={setEventStatus.bind(null, e.id, "canceled")} confirm={`Mark “${e.title}” as canceled? Students will see it crossed out.`}>Cancel</ActionButton>}
                    <ActionButton action={deleteEvent.bind(null, e.id)} confirm={`Delete “${e.title}” permanently? This can't be undone. Use Cancel instead if students should see it was called off.`}>Delete</ActionButton>
                  </div>
                </td>
              </tr>
            ))}
            {(events ?? []).length === 0 && <tr><td colSpan={5} className="px-5 py-8 text-center text-muted">No {show === "past" ? "past" : "upcoming"} events.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
