"use client";

import Link from "next/link";
import { useActionState } from "react";
import { logIn } from "@/app/actions/auth";
import { Arrow } from "@/components/icons";
import { PasswordInput } from "@/components/password-input";

export function LoginForm() {
  const [state, action, pending] = useActionState(logIn, undefined);
  return (
    <form action={action} className="flex w-full max-w-[440px] flex-col gap-[22px]" aria-labelledby="lt">
      <h2 id="lt" className="h text-[40px] font-bold">Log in</h2>
      {state?.error && <p className="err" role="alert">{state.error}</p>}
      <div className="flex flex-col gap-2">
        <label className="lbl" htmlFor="le">Email</label>
        <input id="le" name="email" className="inp h-[52px]" type="email" autoComplete="email" placeholder="you@example.com" defaultValue={state?.fields?.email} required />
      </div>
      <div className="flex flex-col gap-2">
        <label className="lbl" htmlFor="lp">Password</label>
        <PasswordInput id="lp" name="password" autoComplete="current-password" placeholder="Your password" required />
      </div>
      <button className="btn min-h-[52px]" type="submit" disabled={pending}>{pending ? "Logging in…" : <>Log in <Arrow /></>}</button>
      <div className="flex items-center gap-3 text-[13px] text-[#8A95AA]" aria-hidden="true"><span className="h-px flex-1 bg-edge" />or<span className="h-px flex-1 bg-edge" /></div>
      <p className="m-0 text-center text-[15px]">New here? <Link href="/onboarding/about" className="font-bold">Create an account</Link></p>
    </form>
  );
}
