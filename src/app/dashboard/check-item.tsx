"use client";

import { useOptimistic, useTransition } from "react";
import { toggleChecklist } from "@/app/actions/app";
import { Check, External } from "@/components/icons";

export type CheckItemData = {
  id: string; title: string; body: string | null; note: string | null; source: string | null;
  link_label: string | null; link_url: string | null; badge: string | null; warning: string | null;
};

export function CheckItem({ item, done, first }: { item: CheckItemData; done: boolean; first: boolean }) {
  const [optimistic, setOptimistic] = useOptimistic(done);
  const [, start] = useTransition();
  const flip = () => start(async () => { setOptimistic(!optimistic); await toggleChecklist(item.id, !optimistic); });

  return (
    <div className={`flex flex-wrap items-start gap-3 py-4 text-[15px] ${first ? "" : "border-t border-line"}`}>
      <button type="button" onClick={flip} aria-pressed={optimistic} aria-label={optimistic ? `Mark “${item.title}” as not done` : `Mark “${item.title}” as done`}
        className={`grid h-6 w-6 flex-none cursor-pointer place-items-center rounded-[7px] border-0 p-0 ${optimistic ? "bg-navy" : "bg-white shadow-[inset_0_0_0_2px_#9AA6BD]"}`}>
        {optimistic && <Check size={15} className="text-sun" />}
      </button>
      <div className="flex min-w-[240px] flex-1 flex-col gap-1.5">
        <strong className={optimistic ? "text-[#5A6884] line-through" : ""}>{item.title}</strong>
        {!optimistic && item.body && <span className="text-sm leading-normal text-ink-2">{item.body}</span>}
        {!optimistic && item.link_url && (
          <a className="lnk self-start" href={item.link_url} target="_blank" rel="noopener noreferrer">{item.link_label ?? "Official source"} <External /></a>
        )}
        {(item.note || item.source) && (
          <span className="text-xs text-muted">{[item.note, item.source && `Source: ${item.source}`].filter(Boolean).join(" · ")}</span>
        )}
        {!optimistic && item.warning && <span className="text-xs font-semibold text-[#9A3418]">{item.warning}</span>}
      </div>
      {optimistic
        ? <button type="button" onClick={flip} className="ml-auto min-h-8 cursor-pointer rounded-full border-0 bg-sand px-3 text-xs font-semibold text-navy">Undo</button>
        : item.badge && <span className="chip bg-[#FFE6DF] text-[#9A3418]">{item.badge}</span>}
    </div>
  );
}
