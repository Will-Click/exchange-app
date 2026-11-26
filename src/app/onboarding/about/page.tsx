import type { Metadata } from "next";
import Link from "next/link";
import { getViewer } from "@/lib/data";
import { OnboardingShell } from "../shell";
import { AboutForm } from "./about-form";

export const metadata: Metadata = { title: "About you" };

export default async function AboutPage() {
  const viewer = await getViewer();
  const p = viewer?.profile;
  return (
    <OnboardingShell
      step={1}
      title="About you"
      note="We never ask for passport numbers, document scans, visa files or home addresses."
      aside={!viewer && <span className="text-sm text-muted">Already have an account? <Link href="/login" className="font-bold">Log in</Link></span>}
    >
      <AboutForm
        signedIn={Boolean(viewer)}
        email={viewer?.user.email ?? ""}
        initial={{
          full_name: p?.full_name ?? "",
          display_name: p?.display_name ?? "",
          home_country: p?.home_country ?? "",
          major: p?.major ?? "",
          show_major: p?.show_major ?? true,
          home_university: p?.home_university ?? "",
          show_home_university: p?.show_home_university ?? false,
        }}
      />
    </OnboardingShell>
  );
}
