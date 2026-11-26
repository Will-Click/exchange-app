import type { Metadata } from "next";
import { EventForm } from "../event-form";

export const metadata: Metadata = { title: "Admin · New event" };

export default function NewEvent() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="h text-[40px] font-bold">New event</h1>
      <EventForm initial={{ status: "scheduled" }} />
    </div>
  );
}
