import Link from "next/link";
import { Logo } from "@/components/icons";
import { BRAND } from "@/lib/brand";

export function SimplePage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="bg-navy text-white">
        <div className="mx-auto flex max-w-[860px] items-center px-4 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5 text-white no-underline"><Logo size={30} /><span className="h text-[22px] font-extrabold">{BRAND.name}</span></Link>
        </div>
      </header>
      <main className="mx-auto flex max-w-[860px] flex-col gap-5 px-4 py-12 text-base leading-relaxed text-ink-2 sm:px-8">
        <h1 className="h text-[44px] font-bold text-navy">{title}</h1>
        {children}
      </main>
    </div>
  );
}
