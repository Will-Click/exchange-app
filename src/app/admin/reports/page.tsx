import type { Metadata } from "next";
import { resolveReport, setSuspended } from "@/app/actions/admin";
import { createClient } from "@/lib/supabase/server";
import { fmt } from "@/lib/data";
import { ActionButton } from "../confirm-button";

export const metadata: Metadata = { title: "Admin · Reports" };

export default async function AdminReports({ searchParams }: PageProps<"/admin/reports">) {
  const { show } = await searchParams;
  const resolved = show === "resolved";
  const supabase = await createClient();
  let q = supabase.from("reports")
    .select("id, reason, created_at, resolved_at, post_id, reply_id, posts(id, body, author_id, hidden_at), replies(id, body, author_id, hidden_at)")
    .order("created_at", { ascending: false }).limit(100);
  q = resolved ? q.not("resolved_at", "is", null) : q.is("resolved_at", null);
  const { data: reports } = await q;

  const authorIds = [...new Set((reports ?? []).map((r) => r.posts?.author_id ?? r.replies?.author_id).filter(Boolean) as string[])];
  const { data: authors } = authorIds.length
    ? await supabase.from("profiles").select("id, display_name, suspended_at").in("id", authorIds)
    : { data: [] };
  const byId = new Map((authors ?? []).map((a) => [a.id, a]));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="h text-[40px] font-bold">Reports</h1>
        <p className="m-0 text-ink-2">Posts and replies members flagged. Hiding removes it from the board for everyone.</p>
      </div>
      <div className="flex gap-2">
        <a href="/admin/reports" className={`chip h-10 px-4 text-sm no-underline ${!resolved ? "bg-navy text-white" : "bg-white shadow-[inset_0_0_0_1.5px_#E2DDCF]"}`}>Open</a>
        <a href="/admin/reports?show=resolved" className={`chip h-10 px-4 text-sm no-underline ${resolved ? "bg-navy text-white" : "bg-white shadow-[inset_0_0_0_1.5px_#E2DDCF]"}`}>Resolved</a>
      </div>

      {(reports ?? []).length === 0 && <div className="card p-8 text-center text-muted">{resolved ? "No resolved reports yet." : "Nothing to review. Nice."}</div>}

      {(reports ?? []).map((r) => {
        const target = r.posts ?? r.replies;
        const author = target ? byId.get(target.author_id) : undefined;
        return (
          <article key={r.id} className="card flex flex-col gap-3 p-5">
            <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
              <span className="chip bg-sand">{r.post_id ? "Post" : "Reply"}</span>
              <span>by <strong className="text-navy">{author?.display_name ?? "Unknown"}</strong></span>
              {author?.suspended_at && <span className="chip bg-[#FFE6DF] text-[#9A3418]">Author suspended</span>}
              {target?.hidden_at && <span className="chip bg-[#FFE6DF] text-[#9A3418]">Hidden</span>}
              <span className="ml-auto">Reported {fmt.ago(r.created_at)}</span>
            </div>
            <blockquote className="m-0 whitespace-pre-line rounded-2xl bg-paper px-4 py-3 text-[15px] leading-normal">{target?.body ?? "(deleted by its author)"}</blockquote>
            <p className="m-0 text-sm"><span className="text-muted">Reason: </span>{r.reason || "None given"}</p>
            {!resolved && (
              <div className="flex flex-wrap gap-1 border-t border-line pt-2">
                <ActionButton action={resolveReport.bind(null, r.id, "hide")} confirm="Hide this from the board and resolve the report?">Hide &amp; resolve</ActionButton>
                <ActionButton action={resolveReport.bind(null, r.id, "dismiss")}>Dismiss</ActionButton>
                {author && !author.suspended_at && (
                  <ActionButton action={setSuspended.bind(null, author.id, true)} confirm={`Suspend ${author.display_name}? They'll lose access until unsuspended.`}>Suspend author</ActionButton>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
