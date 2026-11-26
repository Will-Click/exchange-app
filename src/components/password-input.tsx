"use client";

import { useState } from "react";
import { Eye, EyeOff } from "@/components/icons";

export function PasswordInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={show ? "text" : "password"} className={`inp pr-[60px] ${props.className ?? ""}`} />
      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} aria-pressed={show}
        className="absolute top-[3px] right-1 grid h-11 w-11 cursor-pointer place-items-center border-0 bg-transparent text-muted">
        {show ? <EyeOff /> : <Eye />}
      </button>
    </div>
  );
}
