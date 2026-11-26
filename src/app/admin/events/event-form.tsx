"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveEvent } from "@/app/actions/admin";

export type EventFormValues = Record<string, string> & { is_free?: string; is_demo?: string };

export function EventForm({ initial }: { initial: EventFormValues }) {
  const [state, action, pending] = useActionState(saveEvent, undefined);
  const v = { ...initial, ...state?.fields };
  const field = (name: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, hint?: string) => (
    <div className="flex flex-col gap-2">
      <label className="lbl" htmlFor={name}>{label}{props.required && <span className="req">Required</span>}</label>
      <input id={name} name={name} className="inp" defaultValue={v[name] ?? ""} {...props} />
      {hint && <p className="hint">{hint}</p>}
    </div>
  );

  return (
    <form action={action} className="card flex max-w-[860px] flex-col gap-6 p-6 sm:p-8">
      {v.id && <input type="hidden" name="id" value={v.id} />}
      {state?.error && <p className="err" role="alert">{state.error}</p>}
      {field("title", "Title", { required: true, maxLength: 120 })}
      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
        <div className="flex flex-col gap-2">
          <label className="lbl" htmlFor="category">Category <span className="req">Required</span></label>
          <select id="category" name="category" className="inp" defaultValue={v.category ?? ""} required>
            <option value="" disabled>Choose…</option>
            <option value="university">University</option>
            <option value="city">City</option>
            <option value="rockies">Rocky Mountains</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="lbl" htmlFor="status">Status</label>
          <select id="status" name="status" className="inp" defaultValue={v.status ?? "scheduled"}>
            <option value="scheduled">Scheduled</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>
      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
        {field("date", "Date", { type: "date", required: true })}
        {field("time", "Start time", { type: "time" }, "Mountain Time")}
        {field("end_time", "End time", { type: "time" }, "Optional")}
      </div>
      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
        {field("location", "Location")}
        {field("organizer", "Organizer")}
      </div>
      <div className="flex flex-col gap-2">
        <label className="lbl" htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={3} className="txt bg-white" defaultValue={v.description ?? ""} />
      </div>
      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
        {field("price_note", "Price", { placeholder: "e.g. $25 · Check organizer" })}
        {field("transport_note", "Transport", { placeholder: "e.g. Not included" })}
        {field("eligibility_note", "Eligibility", { placeholder: "e.g. Students · 18+" })}
        {field("tags", "Tags", { placeholder: "Hiking, Outdoors" }, "Comma-separated. Matching interests lets students filter by them.")}
      </div>
      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
        {field("booking_url", "Booking link", { type: "text", inputMode: "url", placeholder: "https://…" })}
        {field("source_url", "Source link", { type: "text", inputMode: "url", placeholder: "https://…" })}
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2.5 text-sm"><input type="checkbox" name="is_free" defaultChecked={v.is_free === "on" || v.is_free === "true"} className="h-[18px] w-[18px] accent-navy" />Free event</label>
        <label className="flex items-center gap-2.5 text-sm"><input type="checkbox" name="is_demo" defaultChecked={v.is_demo === "on" || v.is_demo === "true"} className="h-[18px] w-[18px] accent-navy" />Mark as demo content</label>
      </div>
      <div className="flex flex-wrap justify-between gap-3 border-t-[1.5px] border-[#E8E3D6] pt-4">
        <Link className="btn btn-ghost" href="/admin/events">Cancel</Link>
        <button className="btn" type="submit" disabled={pending}>{pending ? "Saving…" : v.id ? "Save changes" : "Add to calendar"}</button>
      </div>
    </form>
  );
}
