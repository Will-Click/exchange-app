"use client";

import { useTransition } from "react";

/** Runs a server action after an optional confirm() prompt. */
export function ActionButton({ action, confirm, children, className = "act" }: {
  action: () => Promise<unknown>;
  confirm?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [pending, start] = useTransition();
  return (
    <button type="button" className={className} disabled={pending}
      onClick={() => { if (confirm && !window.confirm(confirm)) return; start(async () => { await action(); }); }}>
      {pending ? "Working…" : children}
    </button>
  );
}
