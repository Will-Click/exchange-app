"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveGuide, saveIdea, type AdminFormState } from "@/app/actions/admin";
import { guideIcon } from "@/components/guide-icons";

type Values = Record<string, string>;

const ICONS = [["bus", "Transit"], ["snow", "Weather"], ["phone", "Phone"], ["apps", "Apps"], ["home", "Home"], ["info", "Info"]];
const TONES = [["#E3F6F4", "Teal"], ["#FFF1D0", "Yellow"], ["#FFE6DF", "Coral"], ["#E8ECFF", "Blue"], ["#CDEBFF", "Glacier"], ["#F2EFE6", "Sand"]];
const PHOTOS = [["/photos/moraine.jpg", "Moraine Lake"], ["/photos/louise.jpg", "Lake Louise (winter)"], ["/photos/banff.jpg", "Banff"], ["/photos/calgary.jpg", "Downtown Calgary"], ["/photos/plaza.jpg", "UCalgary campus"]];

function useForm(save: (s: AdminFormState, f: FormData) => Promise<AdminFormState>, initial: Values) {
  const [state, action, pending] = useActionState(save, undefined);
  return { state, action, pending, v: { ...initial, ...state?.fields } as Values };
}

function Field({ name, label, v, required, hint, ...props }: { name: string; label: string; v: Values; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <label className="lbl" htmlFor={name}>{label}{required && <span className="req">Required</span>}</label>
      <input id={name} name={name} className="inp" defaultValue={v[name] ?? ""} required={required} {...props} />
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

function BodyAndLinks({ v }: { v: Values }) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <label className="lbl" htmlFor="body">Page content</label>
        <textarea id="body" name="body" rows={14} className="txt bg-white font-mono text-sm leading-relaxed" defaultValue={v.body ?? ""} />
        <p className="hint">Start a line with <code>## </code> for a heading and <code>- </code> for a bullet. Wrap words in <code>**double stars**</code> for bold. Leave a blank line between sections.</p>
      </div>
      <div className="flex flex-col gap-2">
        <label className="lbl" htmlFor="links">Official links</label>
        <textarea id="links" name="links" rows={4} className="txt bg-white font-mono text-sm" defaultValue={v.links ?? ""}
          placeholder={"Calgary Transit | https://www.calgarytransit.com/\nParks Canada | https://parks.canada.ca/"} />
        <p className="hint">One per line: <code>Label | https://…</code></p>
      </div>
    </>
  );
}

function Actions({ pending, isNew, label }: { pending: boolean; isNew: boolean; label: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-3 border-t-[1.5px] border-[#E8E3D6] pt-4">
      <Link className="btn btn-ghost" href="/admin/content">Cancel</Link>
      <button className="btn" type="submit" disabled={pending}>{pending ? "Saving…" : isNew ? `Add ${label}` : "Save changes"}</button>
    </div>
  );
}

export function GuideForm({ initial }: { initial: Values }) {
  const { state, action, pending, v } = useForm(saveGuide, initial);
  const [icon, setIcon] = useState(v.icon || "info");
  const [tone, setTone] = useState(v.tone || "#E3F6F4");
  return (
    <form action={action} className="card flex max-w-[860px] flex-col gap-6 p-6 sm:p-8">
      {v.id && <input type="hidden" name="id" value={v.id} />}
      {state?.error && <p className="err" role="alert">{state.error}</p>}
      <Field name="title" label="Title" v={v} required maxLength={60} />
      <Field name="summary" label="Card summary" v={v} required maxLength={140} hint="One line shown on the Before arrival card." />
      <div className="flex flex-wrap items-end gap-5">
        <span className="grid h-[50px] w-[50px] flex-none place-items-center rounded-[14px]" style={{ background: tone }} aria-hidden="true">{guideIcon(icon)}</span>
        <div className="flex min-w-[160px] flex-1 flex-col gap-2">
          <label className="lbl" htmlFor="icon">Icon</label>
          <select id="icon" name="icon" className="inp" value={icon} onChange={(e) => setIcon(e.target.value)}>
            {ICONS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </div>
        <div className="flex min-w-[160px] flex-1 flex-col gap-2">
          <label className="lbl" htmlFor="tone">Colour</label>
          <select id="tone" name="tone" className="inp" value={tone} onChange={(e) => setTone(e.target.value)}>
            {TONES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            {!TONES.some(([k]) => k === tone) && <option value={tone}>Current</option>}
          </select>
        </div>
        <div className="flex w-[120px] flex-col gap-2">
          <label className="lbl" htmlFor="sort">Order</label>
          <input id="sort" name="sort" type="number" className="inp" defaultValue={v.sort ?? "50"} />
        </div>
      </div>
      <BodyAndLinks v={v} />
      <Actions pending={pending} isNew={!v.id} label="guide" />
    </form>
  );
}

export function IdeaForm({ initial }: { initial: Values }) {
  const { state, action, pending, v } = useForm(saveIdea, initial);
  const [image, setImage] = useState(v.image || PHOTOS[0][0]);
  return (
    <form action={action} className="card flex max-w-[860px] flex-col gap-6 p-6 sm:p-8">
      {v.id && <input type="hidden" name="id" value={v.id} />}
      {state?.error && <p className="err" role="alert">{state.error}</p>}
      <Field name="title" label="Title" v={v} required maxLength={80} />
      <Field name="description" label="Card description" v={v} required maxLength={160} hint="One or two lines shown under the photo." />
      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
        <div className="flex flex-col gap-2">
          <label className="lbl" htmlFor="category">Category <span className="req">Required</span></label>
          <select id="category" name="category" className="inp" defaultValue={v.category ?? ""} required>
            <option value="" disabled>Choose…</option>
            <option value="university">University</option>
            <option value="city">City</option>
            <option value="rockies">Rocky Mountains</option>
          </select>
        </div>
        <Field name="season_note" label="When" v={v} placeholder="e.g. Ongoing · winter" />
        <Field name="tags" label="Tags" v={v} placeholder="Hiking, Free" hint="Comma-separated, up to 4." />
        <div className="flex flex-col gap-2">
          <label className="lbl" htmlFor="sort">Order</label>
          <input id="sort" name="sort" type="number" className="inp" defaultValue={v.sort ?? "50"} />
        </div>
      </div>
      <div className="flex flex-wrap items-end gap-5">
        <img src={image} alt="" className="h-[84px] w-[140px] flex-none rounded-2xl object-cover" />
        <div className="flex min-w-[220px] flex-1 flex-col gap-2">
          <label className="lbl" htmlFor="image">Photo</label>
          <select id="image" name="image" className="inp" value={image} onChange={(e) => setImage(e.target.value)}>
            {PHOTOS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </div>
      </div>
      <BodyAndLinks v={v} />
      <Actions pending={pending} isNew={!v.id} label="idea" />
    </form>
  );
}
