"use client";

import { useActionState, useState } from "react";
import { saveExchange } from "@/app/actions/auth";
import { Check, Info, Lock } from "@/components/icons";
import { HOUSING } from "@/lib/constants";
import { StepNav } from "../shell";

type Uni = { id: string; name: string; city: string; region: string | null; country: string };
type Term = { id: string; name: string };

export function ExchangeForm({ universities, terms, initial, editing }: {
  editing: boolean;
  universities: Uni[];
  terms: Term[];
  initial: { participant_type: string; terms: string[]; arrival_date: string; arrival_unsure: boolean; departure_note: string; housing_status: string };
}) {
  const [state, action, pending] = useActionState(saveExchange, undefined);
  const [unsure, setUnsure] = useState(initial.arrival_unsure);
  const [housing, setHousing] = useState(initial.housing_status);
  const [picked, setPicked] = useState<string[]>(initial.terms);

  return (
    <form action={action} className="flex max-w-[760px] flex-col gap-9" aria-label="Your exchange">
      {state?.error && <p className="err" role="alert">{state.error}</p>}

      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
        <div className="flex flex-col gap-2">
          <label className="lbl" htmlFor="city">Destination city <span className="req">Required</span></label>
          <select id="city" className="inp" defaultValue="0">
            {universities.map((u, i) => <option key={u.id} value={i}>{[u.city, u.region, u.country].filter(Boolean).join(", ")}</option>)}
            <option disabled>More cities coming soon</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="lbl" htmlFor="host">Host university <span className="req">Required</span></label>
          <select id="host" className="inp" defaultValue="0">
            {universities.map((u, i) => <option key={u.id} value={i}>{u.name}</option>)}
            <option disabled>More universities coming soon</option>
          </select>
        </div>
      </div>

      <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
        <legend className="lbl mb-3">How are you joining? <span className="req">Required</span></legend>
        <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
          {[
            ["exchange", "Incoming exchange student", "Coming to your host university on exchange"],
            ["member", "Other interested member", "Local student, buddy or supporter"],
          ].map(([v, t, d]) => (
            <label key={v} className="tile">
              <input type="radio" name="participant_type" value={v} defaultChecked={initial.participant_type === v} className="sr" />
              <span className="dot" />
              <span className="flex flex-col gap-1"><strong className="text-[15px]">{t}</strong><span className="text-[13px] leading-[1.45] text-muted">{d}</span></span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="m-0 border-0 p-0">
        <legend className="lbl mb-3">Which semester(s)? <span className="req">Required</span></legend>
        <div className="flex flex-wrap gap-2.5">
          {terms.map((t) => {
            const on = picked.includes(t.id);
            return (
              <label key={t.id} className="pill">
                <input type="checkbox" name="terms" value={t.id} checked={on} className="sr"
                  onChange={(e) => setPicked((p) => e.target.checked ? [...p, t.id] : p.filter((x) => x !== t.id))} />
                {on && <Check size={14} />}{t.name}
              </label>
            );
          })}
        </div>
        <p className="mt-2.5 mb-0 text-[13px] text-muted">Staying two semesters? Pick both — you&apos;ll join both community boards.</p>
      </fieldset>

      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        <div className="flex flex-col gap-2">
          <label className="lbl" htmlFor="arr">Expected arrival {!unsure && <span className="req">Required</span>}<span className="priv"><Lock />Private</span></label>
          <input id="arr" name="arrival_date" className="inp" type="date" defaultValue={initial.arrival_date} disabled={unsure} required={!unsure} />
          <label className="flex min-h-8 items-center gap-2.5 text-sm">
            <input type="checkbox" name="arrival_unsure" checked={unsure} onChange={(e) => setUnsure(e.target.checked)} className="h-[18px] w-[18px] accent-navy" />
            Not sure yet
          </label>
        </div>
        <div className="flex flex-col gap-2">
          <label className="lbl" htmlFor="dep">Expected departure <span className="opt">Optional</span><span className="priv"><Lock />Private</span></label>
          <input id="dep" name="departure_note" className="inp" type="text" placeholder="e.g. late April 2027" defaultValue={initial.departure_note} />
        </div>
      </div>

      <fieldset className="m-0 border-0 p-0">
        <legend className="lbl mb-3 w-full">Housing status <span className="req">Required</span><span className="priv"><Lock />Private</span></legend>
        <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
          {HOUSING.map((h) => (
            <label key={h.value} className="tile">
              <input type="radio" name="housing_status" value={h.value} checked={housing === h.value} onChange={() => setHousing(h.value)} className="sr" />
              <span className="dot" /><span className="text-sm font-semibold">{h.label}</span>
            </label>
          ))}
        </div>
        {housing === "looking" && (
          <p className="mt-3 mb-0 flex items-center gap-2 rounded-xl bg-glacier px-3.5 py-2.5 text-[13px]"><Info size={16} />We&apos;ll put Housing at the top of your dashboard.</p>
        )}
      </fieldset>

      <StepNav back={editing ? "/profile" : "/onboarding/about"} pending={pending} label={editing ? "Save changes" : undefined} />
    </form>
  );
}
