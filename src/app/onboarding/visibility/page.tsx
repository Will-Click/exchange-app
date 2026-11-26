import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getViewer } from "@/lib/data";
import { interestLabel } from "@/lib/constants";
import { OnboardingShell } from "../shell";
import { VisibilityForm } from "./visibility-form";

export const metadata: Metadata = { title: "Profile visibility" };

export default async function VisibilityPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  const p = viewer.profile;
  return (
    <OnboardingShell step={4} editing={Boolean(p.onboarded_at)} title="Profile visibility"
      note={<>Always private: login email · country · arrival &amp; departure dates · housing status.</>}>
      <VisibilityForm
        editing={Boolean(p.onboarded_at)}
        person={{
          display_name: p.display_name,
          home_university: p.home_university ?? "",
          interests: [...p.interests.map(interestLabel), ...p.custom_interests],
          terms: viewer.terms.map((t) => t.name).join(" + "),
        }}
        initial={{
          show_interests: p.show_interests,
          show_home_university: p.show_home_university,
          social_handle: p.social_handle ?? "",
          show_social: p.show_social,
          contact_email: p.contact_email ?? "",
          show_contact_email: p.show_contact_email,
          phone: p.phone ?? "",
          show_phone: p.show_phone,
        }}
      />
    </OnboardingShell>
  );
}
