"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { createPost, createReply, deletePost, deleteReply, reportContent } from "@/app/actions/app";
import { Chat, Flag } from "@/components/icons";

export function Composer({ termId, termName, initial, color }: { termId: string; termName: string; initial: string; color: string }) {
  const [state, action, pending] = useActionState(createPost, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state?.ok) ref.current?.reset(); }, [state?.ok]);
  return (
    <form ref={ref} action={action} className="card flex flex-col gap-3 px-5 py-[18px]" aria-label="New post">
      <input type="hidden" name="term_id" value={termId} />
      <div className="flex items-start gap-3.5">
        <span className="av" style={{ background: color }} aria-hidden="true">{initial}</span>
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="sr">Write a post</span>
          <textarea name="body" rows={2} maxLength={4000} required className="txt" placeholder="Introduce yourself, ask a question, or suggest a plan…" />
        </label>
      </div>
      {state?.error && <p className="err" role="alert">{state.error}</p>}
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:pl-[58px]">
        <span className="text-[13px] text-muted">Posting to {termName}</span>
        <button className="btn btn-sm" type="submit" disabled={pending}>{pending ? "Posting…" : "Post"}</button>
      </div>
    </form>
  );
}

export function PostActions({ postId, replyId, replyCount, mine, compact }: {
  postId?: string; replyId?: string; replyCount?: number; mine: boolean; compact?: boolean;
}) {
  const [reported, setReported] = useState(false);
  const [, start] = useTransition();
  const report = () => {
    const reason = window.prompt("What's wrong with this? (optional)") ;
    if (reason === null) return;
    start(async () => { const r = await reportContent({ postId: replyId ? undefined : postId, replyId }, reason); setReported(r.ok); });
  };
  const remove = () => {
    if (!window.confirm("Delete this for everyone? This can't be undone.")) return;
    start(async () => { if (replyId) await deleteReply(replyId); else if (postId) await deletePost(postId); });
  };
  return (
    <div className={compact ? "flex items-start" : "flex flex-wrap gap-1 border-t border-line pt-2"}>
      {!compact && <span className="act cursor-default"><Chat size={16} />{replyCount} {replyCount === 1 ? "reply" : "replies"}</span>}
      <span className={compact ? "" : "ml-auto"}>
        {mine
          ? <button type="button" className="act" onClick={remove}>Delete</button>
          : reported
            ? <span className="act cursor-default">Reported — thanks</span>
            : <button type="button" className="act" onClick={report} aria-label={replyId ? "Report reply" : "Report post"}><Flag />{compact ? "" : "Report"}</button>}
      </span>
    </div>
  );
}

export function ReplyForm({ postId }: { postId: string }) {
  const [state, action, pending] = useActionState(createReply, undefined);
  // Open while the last "Reply" click is newer than the last successful send.
  const [openedAt, setOpenedAt] = useState(0);
  const open = openedAt > (state?.ok ?? 0);
  if (!open) return <button type="button" className="act self-start" onClick={() => setOpenedAt(Date.now())}>Reply</button>;
  return (
    <form action={action} className="ml-6 flex flex-col gap-2">
      <input type="hidden" name="post_id" value={postId} />
      <label><span className="sr">Write a reply</span><textarea name="body" rows={2} maxLength={2000} required autoFocus className="txt" placeholder="Write a reply…" /></label>
      {state?.error && <p className="err" role="alert">{state.error}</p>}
      <div className="flex gap-2">
        <button className="btn btn-sm" type="submit" disabled={pending}>{pending ? "Sending…" : "Reply"}</button>
        <button className="btn btn-sm btn-ghost" type="button" onClick={() => setOpenedAt(0)}>Cancel</button>
      </div>
    </form>
  );
}
