"use client";

import { useActionState, useState } from "react";
import { saveInterests } from "@/app/actions/auth";
import { Check, INTEREST_ICONS, Plus, X } from "@/components/icons";
import { Switch } from "@/components/switch";
import { INTERESTS } from "@/lib/constants";
import { StepNav } from "../shell";

export function InterestsForm({ initial }: { initial: { interests: string[]; custom: string[]; show: boolean } }) {
  const [state, action, pending] = useActionState(saveInterests, undefined);
  const [picked, setPicked] = useState<string[]>(initial.interests);
  const [custom, setCustom] = useState<string[]>(initial.custom);
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim().slice(0, 40);
    if (!v || custom.some((c) => c.toLowerCase() === v.toLowerCase())) return;
    setCustom([...custom, v]);
    setDraft("");
  };

  return (
    <form action={action} className="flex max-w-[820px] flex-col gap-9" aria-label="Interests">
      {state?.error && <p className="err" role="alert">{state.error}</p>}
      {picked.map((id) => <input key={id} type="hidden" name="interests" value={id} />)}
      {custom.map((c) => <input key={c} type="hidden" name="custom" value={c} />)}

      <fieldset className="m-0 flex flex-col gap-3.5 border-0 p-0">
        <legend className="lbl mb-3.5 w-full">What are you into? <span className="opt">Optional · pick any</span>
          <span className="ml-auto text-[13px] font-semibold text-muted" aria-live="polite">{picked.length + custom.length} selected</span>
        </legend>
        <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(170px,1fr))]">
          {INTERESTS.map((it) => {
            const on = picked.includes(it.id);
            return (
              <button key={it.id} type="button" aria-pressed={on}
                onClick={() => setPicked((p) => on ? p.filter((x) => x !== it.id) : [...p, it.id])}
                className={`flex min-h-11 cursor-pointer flex-col items-start gap-2.5 rounded-[18px] border-0 p-4 text-left font-[inherit] ${on ? "bg-navy text-white" : "bg-white text-navy shadow-[inset_0_0_0_1.5px_#E2DDCF]"}`}>
                <span className={`grid h-10 w-10 place-items-center rounded-xl text-navy ${on ? "bg-sun" : "bg-sand"}`} aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={INTEREST_ICONS[it.id]} /></svg>
                </span>
                <span className="flex w-full items-center justify-between"><strong className="text-[15px]">{it.label}</strong>{on && <Check size={18} className="text-sun" />}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <section className="flex flex-col gap-3" aria-labelledby="own">
        <label id="own" className="lbl" htmlFor="addint">Something else you&apos;re into? <span className="opt">Optional</span></label>
        <div className="flex flex-wrap gap-2.5">
          <input id="addint" type="text" value={draft} maxLength={40} onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
            placeholder="e.g. Board games, Photography, Climbing" className="inp flex-[1_1_280px]" />
          <button type="button" className="btn btn-ghost" onClick={add}><Plus size={16} />Add</button>
        </div>
        {custom.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {custom.map((c) => (
              <span key={c} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-navy pr-1.5 pl-4 text-sm font-semibold text-white">
                {c}
                <button type="button" onClick={() => setCustom(custom.filter((x) => x !== c))} aria-label={`Remove ${c}`}
                  className="grid h-[30px] w-[30px] cursor-pointer place-items-center rounded-full border-0 bg-navy-2 text-white"><X /></button>
              </span>
            ))}
          </div>
        )}
        <p className="hint">Your own interests show on your profile and help classmates find you. They&apos;re matched as tags, so they won&apos;t filter events.</p>
      </section>

      <Switch name="show_interests" defaultChecked={initial.show}>Show my interests on my profile, so classmates can find shared plans</Switch>

      <StepNav back="/onboarding/exchange" pending={pending} />
    </form>
  );
}
