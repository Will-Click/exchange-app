import type { Metadata } from "next";
import Link from "next/link";
import { joinTerm } from "@/app/actions/app";
import { AppHeader, PhotoBand } from "@/components/app-header";
import { Eye, Pin } from "@/components/icons";
import { ProfileCard } from "@/components/profile-card";
import { createClient } from "@/lib/supabase/server";
import { avatarColor, CATEGORY_STYLE, interestLabel } from "@/lib/constants";
import { fmt, requireMember, type MemberProfile } from "@/lib/data";
import { Composer, PostActions, ReplyForm } from "./client";

export const metadata: Metadata = { title: "Community" };

export default async function CommunityPage({ searchParams }: PageProps<"/community">) {
  const viewer = await requireMember();
  const sp = await searchParams;
  const supabase = await createClient();

  const termId = typeof sp.term === "string" && viewer.terms.some((t) => t.id === sp.term) ? sp.term : viewer.terms[0]?.id;
  const term = viewer.terms.find((t) => t.id === termId);
  const { data: openTerms } = await supabase.from("terms").select("id, name").eq("university_id", viewer.profile.university_id ?? "").eq("is_open", true).order("starts_on");
  const joinable = (openTerms ?? []).filter((t) => !viewer.terms.some((m) => m.id === t.id));

  const { data: posts } = term
    ? await supabase.from("posts").select("*, events(id, title, starts_at, category), replies(id, body, created_at, author_id)")
        .eq("term_id", term.id).order("is_pinned", { ascending: false }).order("created_at", { ascending: false }).limit(50)
    : { data: [] };

  const authorIds = [...new Set((posts ?? []).flatMap((p) => [p.author_id, ...p.replies.map((r) => r.author_id)]).concat(viewer.user.id))];
  const { data: people } = await supabase.from("member_profiles").select("*").in("id", authorIds);
  const byId = new Map((people ?? []).map((p) => [p.id!, p]));
  const name = (id: string) => byId.get(id)?.display_name || (id === viewer.user.id ? viewer.profile.display_name : "Former member");

  const focusId = typeof sp.person === "string" ? sp.person : null;
  const focus: MemberProfile | undefined = focusId ? byId.get(focusId) : undefined;

  return (
    <div className="w-full">
      <AppHeader viewer={viewer} current="/community" />

      <PhotoBand photo="/photos/calgary.jpg" credit="Downtown Calgary · Photo: CC0 (Wikimedia Commons)">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-2.5">
            <p className="m-0 text-[15px] text-mist">{viewer.university?.name} · exchange cohort</p>
            <h1 className="h text-[clamp(40px,5vw,60px)] font-bold leading-none">{term?.name ?? "Your semester"} <span className="rounded-xl bg-glacier px-[.14em] text-navy">board</span></h1>
          </div>
          <div role="group" aria-label="Your cohorts" className="inline-flex flex-wrap gap-1 rounded-full bg-navy-2 p-1">
            {viewer.terms.map((t) => (
              <Link key={t.id} href={`/community?term=${t.id}`} aria-current={t.id === termId ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-full px-[18px] text-sm font-semibold no-underline ${t.id === termId ? "bg-white text-navy" : "text-[#DCE4F2]"}`}>{t.name}</Link>
            ))}
            {joinable.map((t) => (
              <form key={t.id} action={joinTerm.bind(null, t.id)}>
                <button type="submit" className="inline-flex min-h-11 cursor-pointer items-center rounded-full border-0 bg-transparent px-[18px] text-sm font-semibold text-[#DCE4F2]">+ Join {t.name}</button>
              </form>
            ))}
          </div>
        </div>
      </PhotoBand>

      <main className="relative z-[2] mx-auto box-border flex max-w-[1280px] flex-wrap items-start gap-6 px-4 pt-2 pb-[72px] sm:px-8">
        <section className="flex min-w-0 flex-[999_1_520px] flex-col gap-4" aria-label="All posts">
          <h2 className="h px-1 text-[26px] font-bold">All posts</h2>

          {(posts ?? []).filter((p) => p.is_pinned).map((p) => (
            <div key={p.id} className="card flex items-start gap-3.5 bg-glacier px-5 py-[18px] shadow-none">
              <Pin className="mt-0.5 flex-none" />
              <div className="flex flex-col gap-1"><strong className="text-[15px]">Pinned · Welcome to {term?.name}</strong><span className="text-sm leading-normal text-[#22324F]">{p.body}</span></div>
            </div>
          ))}

          {term ? (
            <Composer termId={term.id} termName={term.name} initial={(viewer.profile.display_name || "?").slice(0, 1).toUpperCase()} color={avatarColor(viewer.user.id)} />
          ) : (
            <div className="card p-6">Join a semester to see its board.</div>
          )}

          {(posts ?? []).filter((p) => !p.is_pinned).map((p) => {
            const mineP = p.author_id === viewer.user.id;
            const replies = [...p.replies].sort((a, b) => a.created_at.localeCompare(b.created_at));
            return (
              <article key={p.id} className="card flex flex-col gap-3 p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <Link className="av" href={`/community?term=${termId}&person=${p.author_id}#profile`} style={{ background: avatarColor(p.author_id) }} aria-label={`${name(p.author_id)}'s profile`}>
                    {name(p.author_id).slice(0, 1).toUpperCase()}
                  </Link>
                  <div className="flex flex-col gap-0.5">
                    <Link href={`/community?term=${termId}&person=${p.author_id}#profile`} className="font-bold no-underline">{name(p.author_id)}{mineP ? " (you)" : ""}</Link>
                    <span className="text-[13px] text-muted">{fmt.ago(p.created_at)}</span>
                  </div>
                </div>
                <p className="m-0 whitespace-pre-line text-base leading-[1.55]">{p.body}</p>
                {p.events && (
                  <Link href={`/events?event=${p.events.id}`} className={`flex items-center gap-3 rounded-[14px] px-3.5 py-3 no-underline ${CATEGORY_STYLE[p.events.category].chip}`}>
                    <span className="flex w-12 flex-col rounded-[10px] bg-white py-1.5 text-center text-navy">
                      <span className="text-[10px] font-bold tracking-[.1em]">{fmt.monthShort(p.events.starts_at)}</span>
                      <span className="h text-lg font-extrabold">{fmt.day(p.events.starts_at)}</span>
                    </span>
                    <span className="flex flex-col"><strong className="text-sm text-navy">{p.events.title}</strong><span className="text-[13px]">{CATEGORY_STYLE[p.events.category].label} · view event</span></span>
                  </Link>
                )}
                <PostActions postId={p.id} replyCount={replies.length} mine={mineP} />
                {replies.map((r) => (
                  <div key={r.id} className="ml-6 flex gap-3 rounded-2xl bg-paper px-4 py-3.5">
                    <span className="av h-9 w-9 text-sm" style={{ background: avatarColor(r.author_id) }} aria-hidden="true">{name(r.author_id).slice(0, 1).toUpperCase()}</span>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="text-sm"><strong>{name(r.author_id)}</strong> <span className="text-muted">· {fmt.ago(r.created_at)}</span></span>
                      <span className="whitespace-pre-line text-[15px] leading-normal">{r.body}</span>
                    </div>
                    <PostActions replyId={r.id} mine={r.author_id === viewer.user.id} compact />
                  </div>
                ))}
                <ReplyForm postId={p.id} />
              </article>
            );
          })}
          {term && (posts ?? []).filter((p) => !p.is_pinned).length === 0 && (
            <div className="card p-6 text-muted">No posts yet. Say hi and introduce yourself!</div>
          )}
        </section>

        <aside id="profile" className="flex max-w-full flex-[1_1_280px] flex-col gap-4 lg:max-w-[340px]">
          {focus && focus.id !== viewer.user.id ? (
            <ProfileCard
              person={{
                display_name: focus.display_name ?? "",
                subtitle: [focus.term_names?.join(" + "), focus.home_university, focus.major].filter(Boolean).join(" · "),
                interests: (focus.interests ?? []).map(interestLabel),
                social_handle: focus.social_handle, contact_email: focus.contact_email, phone: focus.phone,
                color: avatarColor(focus.id!),
              }}
              emptyContact={`${focus.display_name} hasn't shared contact details. Reply to their posts instead.`}
              footer={<p className="m-0 text-[13px] leading-normal text-muted">{focus.display_name} chose what to share. Arrange anything further off-site — there&apos;s no private messaging here.</p>}
            />
          ) : (
            <div className="card flex items-start gap-3 bg-navy px-5 py-[18px] text-white">
              <Eye className="mt-0.5 flex-none text-sun" />
              <div className="flex flex-col gap-2">
                <strong className="text-[15px]">See what others see</strong>
                <span className="text-[13px] leading-normal text-mist">Select anyone&apos;s name to view their profile. Your login email is never shown.</span>
                <Link href="/profile" className="inline-flex min-h-8 items-center text-[13px] font-bold uppercase tracking-[.1em] text-sun no-underline">Preview my profile</Link>
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
