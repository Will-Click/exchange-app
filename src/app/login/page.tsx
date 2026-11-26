import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/icons";
import { BRAND } from "@/lib/brand";
import { getViewer } from "@/lib/data";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage() {
  if (await getViewer()) redirect("/dashboard");
  return (
    <div className="flex min-h-dvh w-full flex-wrap">
      <aside className="relative isolate flex min-h-[320px] flex-[1_1_420px] flex-col justify-between gap-12 overflow-hidden bg-navy px-6 pt-8 pb-10 text-white sm:px-12">
        <img src="/photos/moraine.jpg" alt="" aria-hidden="true" className="photo-bg" style={{ objectPosition: "center 40%" }} />
        <div aria-hidden="true" className="photo-shade" style={{ background: "linear-gradient(180deg, rgba(15,31,61,.82) 0%, rgba(15,31,61,.35) 45%, rgba(15,31,61,.9) 100%)" }} />
        <Link href="/" className="flex items-center gap-2.5 text-white no-underline" aria-label={`${BRAND.displayName} home`}>
          <Logo /><span className="h text-[26px] font-extrabold">{BRAND.name}</span>
        </Link>
        <div className="flex max-w-[460px] flex-col gap-3.5">
          <h1 className="h text-[clamp(40px,4.5vw,60px)] font-bold leading-none">Welcome <span className="rounded-xl bg-sun px-[.14em] text-navy">back.</span></h1>
          <p className="m-0 text-lg leading-[1.55] text-[#E3EAF5]">Pick up your checklist, see what&apos;s on, and catch up with your semester.</p>
        </div>
      </aside>
      <main className="flex min-w-0 flex-[1_1_480px] items-center justify-center px-5 py-12 sm:px-[clamp(20px,6vw,96px)]">
        <LoginForm />
      </main>
    </div>
  );
}
