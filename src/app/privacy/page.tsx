import type { Metadata } from "next";
import { SimplePage } from "@/components/simple-page";

export const metadata: Metadata = { title: "Privacy" };

export default function Privacy() {
  return (
    <SimplePage title="Privacy">
      <p className="m-0">We collect only what&apos;s needed to build your checklist and connect you with your semester.</p>
      <ul className="m-0 flex flex-col gap-2 pl-5">
        <li><strong>Always private:</strong> login email, full name, country, arrival and departure dates, housing status.</li>
        <li><strong>You choose:</strong> interests, home university, major, social handle, contact email and phone number are shown only if you switch them on.</li>
        <li><strong>Never collected:</strong> passport numbers, document scans, visa files or home addresses.</li>
        <li>Moderators at your host university can see your profile to handle reports.</li>
      </ul>
      <p className="m-0 text-sm">This is a draft for development and needs review before launch.</p>
    </SimplePage>
  );
}
