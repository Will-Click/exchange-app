"use client";

import { useActionState, useState } from "react";
import { saveAbout } from "@/app/actions/auth";
import { Check, Lock } from "@/components/icons";
import { PasswordInput } from "@/components/password-input";
import { Switch } from "@/components/switch";
import { COUNTRIES, MAJORS } from "@/lib/constants";
import { StepNav } from "../shell";

type Initial = {
  full_name: string; display_name: string; home_country: string; major: string;
  show_major: boolean; home_university: string; show_home_university: boolean;
};

export function AboutForm({ signedIn, email, initial }: { signedIn: boolean; email: string; initial: Initial }) {
  const [state, action, pending] = useActionState(saveAbout, undefined);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const f = { ...initial, ...state?.fields };

  const longEnough = pw.length >= 8;
  const hasSymbol = /[\d\W_]/.test(pw);
  const strength = [pw.length > 0, longEnough, hasSymbol, pw.length >= 12].filter(Boolean).length;
  const matches = pw2.length > 0 && pw === pw2;

  return (
    <form action={action} className="flex max-w-[760px] flex-col gap-8" aria-label="About you">
      {state?.error && <p className="err" role="alert">{state.error}</p>}

      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        <div className="flex flex-col gap-2">
          <label className="lbl" htmlFor="nm">Full name <span className="req">Required</span><span className="priv"><Lock />Private</span></label>
          <input id="nm" name="full_name" className="inp" type="text" autoComplete="name" defaultValue={f.full_name} required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="lbl" htmlFor="dn">Display name <span className="req">Required</span><span className="pub">Shown on posts</span></label>
          <input id="dn" name="display_name" className="inp" type="text" maxLength={40} defaultValue={f.display_name} required />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="lbl" htmlFor="em">Login email {!signedIn && <span className="req">Required</span>}<span className="priv"><Lock />Never shown to members</span></label>
        {signedIn
          ? <input id="em" className="inp" type="email" value={email} readOnly />
          : <input id="em" name="email" className="inp" type="email" autoComplete="email" placeholder="you@example.com" defaultValue={state?.fields?.email} required />}
        <p className="hint">No university email needed — you might not have one yet.</p>
      </div>

      {!signedIn && (
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
          <div className="flex flex-col gap-2">
            <label className="lbl" htmlFor="pw">Create password <span className="req">Required</span></label>
            <PasswordInput id="pw" name="password" autoComplete="new-password" aria-describedby="pwrules" value={pw} onChange={(e) => setPw(e.target.value)} required />
            <div className="flex gap-1" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => <span key={i} className="h-[5px] flex-1 rounded-full" style={{ background: i < strength ? "#2EC4B6" : "#E8E3D6" }} />)}
            </div>
            <ul id="pwrules" className="m-0 flex list-none flex-col gap-1 p-0 text-[13px]">
              <Rule ok={longEnough}>At least 8 characters</Rule>
              <Rule ok={hasSymbol}>A number or symbol</Rule>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <label className="lbl" htmlFor="pw2">Confirm password <span className="req">Required</span></label>
            <PasswordInput id="pw2" name="confirm" autoComplete="new-password" aria-describedby="pwmatch" value={pw2} onChange={(e) => setPw2(e.target.value)}
              style={matches ? { borderColor: "#2EC4B6" } : undefined} required />
            <p id="pwmatch" className="m-0 flex items-center gap-1.5 text-[13px]" aria-live="polite" style={{ color: matches ? "#0F5E56" : pw2 ? "#B23A1E" : "#4A5B7A" }}>
              {matches ? <><Check size={14} />Passwords match</> : pw2 ? "Passwords don't match yet" : "Type it again to confirm"}
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        <div className="flex flex-col gap-2">
          <label className="lbl" htmlFor="res">Country you&apos;re travelling from <span className="req">Required</span><span className="priv"><Lock />Private</span></label>
          <select id="res" name="home_country" className="inp" defaultValue={f.home_country} required>
            <option value="" disabled>Choose a country</option>
            {COUNTRIES.map((c) => <option key={c} value={c}>{c === "Other" ? "Other…" : c}</option>)}
          </select>
          <p className="hint">Where you live now or are departing from. It decides which entry steps you see.</p>
        </div>
        <div className="flex flex-col gap-2">
          <label className="lbl" htmlFor="maj">Major / area of study <span className="opt">Optional</span></label>
          <input id="maj" name="major" className="inp" type="text" list="majors" placeholder="e.g. Mechanical Engineering" defaultValue={f.major} />
          <datalist id="majors">{MAJORS.map((m) => <option key={m} value={m} />)}</datalist>
          <Switch name="show_major" defaultChecked={initial.show_major}>Show on my profile</Switch>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <label className="lbl" htmlFor="hu">Home university <span className="opt">Optional</span></label>
        <input id="hu" name="home_university" className="inp" type="text" placeholder="e.g. TU Munich" defaultValue={f.home_university} />
        <Switch name="show_home_university" defaultChecked={initial.show_home_university}>Show my home university on my profile</Switch>
      </div>

      <StepNav back="/" pending={pending} label={signedIn ? "Save & continue" : "Create account & continue"} />
    </form>
  );
}

function Rule({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-1.5" style={{ color: ok ? "#0F5E56" : "#4A5B7A" }}>
      {ok ? <Check size={14} /> : <span className="inline-block h-3.5 w-3.5 rounded-full shadow-[inset_0_0_0_1.5px_#9AA6BD]" aria-hidden="true" />}
      {children}<span className="sr">{ok ? " — done" : " — not yet"}</span>
    </li>
  );
}

