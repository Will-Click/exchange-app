import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/data";
import { OnboardingShell } from "../shell";
import { ExchangeForm } from "./exchange-form";

export const metadata: Metadata = { title: "Your exchange" };

export default async function ExchangePage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  const supabase = await createClient();
  const [{ data: universities }, { data: terms }] = await Promise.all([
    supabase.from("universities").select("id, name, short_name, city, region, country").eq("is_active", true),
    supabase.from("terms").select("id, name, starts_on, ends_on").eq("is_open", true)
      .eq("university_id", viewer.profile.university_id ?? "").order("starts_on"),
  ]);
  const p = viewer.profile;
  return (
    <OnboardingShell step={2} title="Your exchange"
      note="Only your display name and the details you choose are visible to other members. We never ask for passport numbers or documents.">
      <ExchangeForm
        universities={universities ?? []}
        terms={terms ?? []}
        initial={{
          participant_type: p.participant_type,
          terms: viewer.terms.map((t) => t.id),
          arrival_date: p.arrival_date ?? "",
          arrival_unsure: p.arrival_unsure,
          departure_note: p.departure_note ?? "",
          housing_status: p.housing_status ?? "",
        }}
      />
    </OnboardingShell>
  );
}
