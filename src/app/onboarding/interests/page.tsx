import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getViewer } from "@/lib/data";
import { OnboardingShell } from "../shell";
import { InterestsForm } from "./interests-form";

export const metadata: Metadata = { title: "Interests" };

export default async function InterestsPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  const p = viewer.profile;
  return (
    <OnboardingShell step={3} editing={Boolean(viewer.profile.onboarded_at)} title="Interests"
      note="Interests help classmates find shared plans. You decide whether they show on your profile.">
      <InterestsForm editing={Boolean(p.onboarded_at)} initial={{ interests: p.interests, custom: p.custom_interests, show: p.show_interests }} />
    </OnboardingShell>
  );
}
