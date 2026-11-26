import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isoToZoned } from "@/lib/time";
import { EventForm } from "../event-form";

export const metadata: Metadata = { title: "Admin · Edit event" };

export default async function EditEvent({ params }: PageProps<"/admin/events/[id]">) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: e } = await supabase.from("events").select("*").eq("id", id).single();
  if (!e) notFound();
  const start = isoToZoned(e.starts_at);
  return (
    <div className="flex flex-col gap-6">
      <h1 className="h text-[40px] font-bold">Edit event</h1>
      <EventForm initial={{
        id: e.id, title: e.title, category: e.category, status: e.status,
        date: start.date, time: start.time, end_time: e.ends_at ? isoToZoned(e.ends_at).time : "",
        location: e.location ?? "", organizer: e.organizer ?? "", description: e.description ?? "",
        price_note: e.price_note ?? "", transport_note: e.transport_note ?? "", eligibility_note: e.eligibility_note ?? "",
        tags: e.tags.join(", "), booking_url: e.booking_url ?? "", source_url: e.source_url ?? "",
        is_free: e.is_free ? "on" : "", is_demo: e.is_demo ? "on" : "",
      }} />
    </div>
  );
}
