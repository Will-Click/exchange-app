import type { Metadata } from "next";
import { setAdmin, setSuspended } from "@/app/actions/admin";
import { createClient } from "@/lib/supabase/server";
import { fmt, getViewer } from "@/lib/data";
import { ActionButton } from "../confirm-button";

export const metadata: Metadata = { title: "Admin · Users" };

export default async function AdminUsers({ searchParams }: PageProps<"/admin/users">) {
  const viewer = (await getViewer())!;
  const { q } = await searchParams;
  const search = typeof q === "string" ? q.trim() : "";
  const supabase = await createClient();
  const uni = viewer.profile.university_id!;

  let query = supabase.from("profiles")
    .select("id, full_name, display_name, home_country, participant_type, onboarded_at, suspended_at, created_at, profile_terms(terms(name))")
    .eq("university_id", uni).order("created_at", { ascending: false }).limit(200);
  if (search) query = query.or(`full_name.ilike.%${search.replace(/[%,()]/g, "")}%,display_name.ilike.%${search.replace(/[%,()]/g, "")}%`);
  const [{ data: users }, { data: admins }] = await Promise.all([
    query,
    supabase.from("admins").select("user_id").eq("university_id", uni),
  ]);
  const adminIds = new Set((admins ?? []).map((a) => a.user_id));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="h text-[40px] font-bold">Users</h1>
          <p className="m-0 text-ink-2">{users?.length ?? 0} members at {viewer.university?.name}. Login emails stay private, even from admins.</p>
        </div>
        <form className="flex gap-2" role="search">
          <label className="sr" htmlFor="q">Search by name</label>
          <input id="q" name="q" defaultValue={search} className="inp h-11 w-64" placeholder="Search by name" />
          <button className="btn btn-sm" type="submit">Search</button>
        </form>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-[.1em] text-muted">
              <th className="px-5 py-3.5 font-bold">Member</th><th className="px-3 py-3.5 font-bold">From</th><th className="px-3 py-3.5 font-bold">Semesters</th>
              <th className="px-3 py-3.5 font-bold">Joined</th><th className="px-3 py-3.5 font-bold">Status</th><th className="px-5 py-3.5 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((u) => {
              const isMe = u.id === viewer.user.id;
              const isAdmin = adminIds.has(u.id);
              const termNames = u.profile_terms.map((pt) => pt.terms?.name).filter(Boolean).join(", ");
              return (
                <tr key={u.id} className="border-t border-line align-middle">
                  <td className="px-5 py-3">
                    <strong>{u.display_name || "—"}</strong>{isMe && <span className="text-muted"> (you)</span>}
                    <div className="text-[13px] text-muted">{u.full_name}{u.participant_type === "member" ? " · Local member" : ""}</div>
                  </td>
                  <td className="px-3 py-3">{u.home_country ?? "—"}</td>
                  <td className="px-3 py-3">{termNames || "—"}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{fmt.date(u.created_at.slice(0, 10))}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {u.suspended_at ? <span className="chip bg-[#FFE6DF] text-[#9A3418]">Suspended</span>
                        : u.onboarded_at ? <span className="chip bg-[#E3F6F4] text-teal-ink">Active</span>
                        : <span className="chip bg-sand">Onboarding</span>}
                      {isAdmin && <span className="chip bg-navy text-sun">Admin</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    {!isMe && (
                      <div className="flex justify-end gap-1">
                        {u.suspended_at
                          ? <ActionButton action={setSuspended.bind(null, u.id, false)}>Unsuspend</ActionButton>
                          : <ActionButton action={setSuspended.bind(null, u.id, true)} confirm={`Suspend ${u.display_name || "this member"}? They'll lose access to the boards and dashboard until unsuspended.`}>Suspend</ActionButton>}
                        {isAdmin
                          ? <ActionButton action={setAdmin.bind(null, u.id, false)} confirm={`Remove admin access from ${u.display_name}?`}>Remove admin</ActionButton>
                          : <ActionButton action={setAdmin.bind(null, u.id, true)} confirm={`Make ${u.display_name || "this member"} an admin? They'll be able to manage events, users and reports.`}>Make admin</ActionButton>}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {(users ?? []).length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-center text-muted">No members found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
