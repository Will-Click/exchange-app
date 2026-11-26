"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveVisibility } from "@/app/actions/auth";
import { Eye, Lock } from "@/components/icons";
import { ProfileCard } from "@/components/profile-card";
import { Switch } from "@/components/switch";
import { StepNav } from "../shell";

type Initial = {
  show_interests: boolean; show_home_university: boolean;
  social_handle: string; show_social: boolean;
  contact_email: string; show_contact_email: boolean;
  phone: string; show_phone: boolean; accepted: boolean;
};

export function VisibilityForm({ person, initial, editing }: {
  person: { display_name: string; home_university: string; interests: string[]; terms: string };
  initial: Initial;
  editing: boolean;
}) {
  const [state, action, pending] = useActionState(saveVisibility, undefined);
  const [v, setV] = useState(initial);
  const set = <K extends keyof Initial>(k: K, val: Initial[K]) => setV((s) => ({ ...s, [k]: val }));

  const subtitle = [person.terms, v.show_home_university && person.home_university].filter(Boolean).join(" · ");

  return (
    <form action={action} className="flex flex-col gap-8">
      {state?.error && <p className="err" role="alert">{state.error}</p>}
      <div className="flex flex-wrap items-start gap-7">
        <div className="flex min-w-0 flex-[999_1_400px] flex-col gap-7">
          <section aria-labelledby="pf">
            <h3 id="pf" className="h mb-1.5 text-[22px] font-bold">On your profile</h3>
            <Row title="Display name" desc="Always visible to members — it's how you appear on posts.">
              <span className="chip bg-[#E3F6F4] text-teal-ink">Always on</span>
            </Row>
            <Row title="Interests" desc={person.interests.join(", ") || "None picked yet"}>
              <Switch name="show_interests" checked={v.show_interests} onChange={(on) => set("show_interests", on)}><span className="sr">Show interests</span></Switch>
            </Row>
            <Row title="Home university" desc={person.home_university || "Not added"}>
              <Switch name="show_home_university" checked={v.show_home_university} onChange={(on) => set("show_home_university", on)}><span className="sr">Show home university</span></Switch>
            </Row>
          </section>

          <section aria-labelledby="ct" className="flex flex-col">
            <h3 id="ct" className="h mb-1 text-[22px] font-bold">Contact details <span className="opt align-middle font-sans">Optional</span></h3>
            <p className="mt-0 mb-2 text-sm leading-normal text-muted">There&apos;s no private messaging here, so this is how classmates can reach you. Hidden until you choose to share. Remove any time.</p>
            <ContactRow label="Social handle" name="social_handle" type="text" placeholder="@yourname" value={v.social_handle}
              onValue={(x) => set("social_handle", x)} show={v.show_social} onShow={(on) => set("show_social", on)} showName="show_social" />
            <ContactRow label="Contact email" name="contact_email" type="email" placeholder="A separate address you're happy to share" value={v.contact_email}
              onValue={(x) => set("contact_email", x)} show={v.show_contact_email} onShow={(on) => set("show_contact_email", on)} showName="show_contact_email" />
            <ContactRow label="Phone number" name="phone" type="tel" placeholder="+49 151 2345 6789" value={v.phone} optional
              onValue={(x) => set("phone", x)} show={v.show_phone} onShow={(on) => set("show_phone", on)} showName="show_phone" />
            <p className="mt-2 mb-0 flex items-center gap-2 text-[13px] text-muted"><Lock />Your login email is never copied here automatically.</p>
          </section>

          <label className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3.5 text-sm leading-normal shadow-[inset_0_0_0_1.5px_#E2DDCF]">
            <input type="checkbox" name="accept_rules" defaultChecked={initial.accepted} className="mt-px h-5 w-5 flex-none accent-navy" required />
            <span>I&apos;ve read the <Link href="/rules" target="_blank">community rules</Link> — no harassment, spam, scams, or sharing other people&apos;s personal info.</span>
          </label>
        </div>

        <aside className="sticky top-6 flex min-w-0 flex-[1_1_300px] flex-col gap-2.5" aria-label="Profile preview">
          <span className="tag flex items-center gap-2"><Eye size={16} />What other members see</span>
          <ProfileCard person={{
            display_name: person.display_name,
            subtitle,
            interests: v.show_interests ? person.interests : [],
            social_handle: v.show_social ? v.social_handle : null,
            contact_email: v.show_contact_email ? v.contact_email : null,
            phone: v.show_phone ? v.phone : null,
            color: "#2EC4B6",
          }} />
        </aside>
      </div>

      <StepNav back="/onboarding/interests" pending={pending} label={editing ? "Save profile" : "Finish & see my dashboard"} />
    </form>
  );
}

function Row({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-4 border-t border-line py-4">
      <div className="flex min-w-[200px] flex-1 flex-col gap-[3px]"><strong className="text-[15px]">{title}</strong><span className="text-[13px] leading-[1.45] text-muted">{desc}</span></div>
      {children}
    </div>
  );
}

function ContactRow({ label, name, type, placeholder, value, onValue, show, onShow, showName, optional }: {
  label: string; name: string; type: string; placeholder: string; value: string; onValue: (v: string) => void;
  show: boolean; onShow: (on: boolean) => void; showName: string; optional?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-end gap-4 border-t border-line py-4">
      <label className="flex min-w-[220px] flex-1 flex-col gap-1.5 text-sm font-semibold">
        <span>{label} {optional && <span className="opt">Optional</span>}</span>
        <input className="inp" name={name} type={type} placeholder={placeholder} value={value} onChange={(e) => onValue(e.target.value)}
          autoComplete={type === "tel" ? "tel" : "off"} />
      </label>
      <Switch name={showName} checked={show} onChange={onShow} className="mb-1.5"><span className="sr">Share {label.toLowerCase()}</span></Switch>
    </div>
  );
}
