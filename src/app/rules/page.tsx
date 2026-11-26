import type { Metadata } from "next";
import { SimplePage } from "@/components/simple-page";

export const metadata: Metadata = { title: "Community rules" };

export default function Rules() {
  return (
    <SimplePage title="Community rules">
      <p className="m-0">Semester boards are for incoming exchange students and the people helping them settle in. Keep them useful and kind.</p>
      <ul className="m-0 flex flex-col gap-2 pl-5">
        <li><strong>Be kind.</strong> No harassment, hate or personal attacks.</li>
        <li><strong>No spam or scams.</strong> No ads, referral links, or rental listings asking for deposits.</li>
        <li><strong>Protect privacy.</strong> Never post someone else&apos;s contact details, address or documents.</li>
        <li><strong>Membership is self-declared.</strong> Nobody here is verified by the university — be careful with money and meet-ups.</li>
        <li><strong>Report problems.</strong> Use Report on any post or reply. Moderators can hide content and suspend accounts.</li>
      </ul>
    </SimplePage>
  );
}
