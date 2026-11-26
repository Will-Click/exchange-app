"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin/events", label: "Events" },
  { href: "/admin/content", label: "Guides & ideas" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/reports", label: "Reports" },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav aria-label="Admin" className="flex flex-wrap gap-1">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className="tab" aria-current={path.startsWith(l.href) ? "page" : undefined}>{l.label}</Link>
      ))}
    </nav>
  );
}
