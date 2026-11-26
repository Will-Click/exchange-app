import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 20, children, ...rest }: P & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

export const Arrow = (p: P) => (
  <svg width={p.size ?? 16} height={p.size ?? 16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" {...p}>
    <path d="M2 8h11M9 4l4 4-4 4" />
  </svg>
);
export const ArrowLeft = (p: P) => (
  <svg width={p.size ?? 16} height={p.size ?? 16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" {...p}>
    <path d="M14 8H3M7 4L3 8l4 4" />
  </svg>
);
export const External = (p: P) => <Base size={14} {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></Base>;
export const Check = (p: P) => <Base strokeWidth={2.6} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Base>;
export const Lock = (p: P) => <Base size={13} strokeWidth={2} {...p}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Base>;
export const Eye = (p: P) => <Base {...p}><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></Base>;
export const EyeOff = (p: P) => <Base {...p}><path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3 3.9M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a9.6 9.6 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2" /></Base>;
export const Shield = (p: P) => <Base {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M9 12l2 2 4-4" /></Base>;
export const Info = (p: P) => <Base {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5h.01" /></Base>;
export const Alert = (p: P) => <Base strokeWidth={2} {...p}><path d="M12 3l10 18H2z" /><path d="M12 10v4M12 17h.01" /></Base>;
export const Home = (p: P) => <Base {...p}><path d="M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1z" /></Base>;
export const Bus = (p: P) => <Base {...p}><rect x="5" y="4" width="14" height="13" rx="3" /><path d="M5 11h14M8 20l1.5-3M16 20l-1.5-3" /></Base>;
export const Snow = (p: P) => <Base {...p}><path d="M12 3v18M4 7.5l16 9M20 7.5l-16 9" /></Base>;
export const Phone = (p: P) => <Base {...p}><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M11 18h2" /></Base>;
export const Apps = (p: P) => <Base {...p}><rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="13" width="7" height="7" rx="2" /><rect x="13" y="13" width="7" height="7" rx="2" /></Base>;
export const Clipboard = (p: P) => <Base {...p}><rect x="5" y="3.5" width="14" height="17" rx="2.5" /><path d="M8.5 9l1.5 1.5L13 7.5M8.5 15h7" /></Base>;
export const Calendar = (p: P) => <Base {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></Base>;
export const List = (p: P) => <Base {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></Base>;
export const Mountain = (p: P) => <Base {...p}><path d="M3 19l6-10 3.5 5L15 10l6 9z" /></Base>;
export const Chat = (p: P) => <Base {...p}><path d="M4 5h16v11H9l-5 4z" /></Base>;
export const Flag = (p: P) => <Base size={16} {...p}><path d="M5 21V4M5 4h11l-2 4 2 4H5" /></Base>;
export const Pin = (p: P) => <Base {...p}><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></Base>;
export const At = (p: P) => <Base {...p}><circle cx="12" cy="12" r="4" /><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1" /></Base>;
export const Plus = (p: P) => <Base strokeWidth={2.2} {...p}><path d="M12 5v14M5 12h14" /></Base>;
export const X = (p: P) => <Base size={14} strokeWidth={2.4} {...p}><path d="M6 6l12 12M18 6L6 18" /></Base>;
export const Chevron = (p: P) => <Base size={18} strokeWidth={2.2} {...p}><path d="M9 5l7 7-7 7" /></Base>;
export const ChevronLeft = (p: P) => <Base size={18} strokeWidth={2.2} {...p}><path d="M15 5l-7 7 7 7" /></Base>;
export const Plane = (p: P) => <Base {...p}><path d="M10 14l-7-3 1.5-1.5 7 1 5-5a2 2 0 0 1 3 3l-5 5 1 7L14 22l-3-7" /></Base>;
export const Users = (p: P) => <Base {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.8-3.5 3.3-5.5 6.5-5.5s5.7 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c1.8.7 3 2.5 3.5 5.2" /></Base>;

export const INTEREST_ICONS: Record<string, string> = {
  hiking: "M3 19l6-10 3.5 5L15 10l6 9z",
  skiing: "M4 20l16-8M8 6a2 2 0 1 0 0-.1M9 10l3 3-2 4",
  sports: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  music: "M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  food: "M5 3v8a3 3 0 0 0 6 0V3M8 3v18M17 3c-2 2-2 7 0 9v9",
  nightlife: "M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10z",
  arts: "M12 3a9 9 0 1 0 0 18c1 0 1.5-1 1-2s0-2 1.5-2H17a4 4 0 0 0 4-4c0-5.5-4-10-9-10zM7.5 11h.01M10 7h.01M15 7h.01",
  volunteering: "M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z",
};

export function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden="true">
      <circle cx="17" cy="17" r="17" fill="#FFC93C" />
      <path d="M5 25 L13 13 L17 18 L21 11 L29 25 Z" fill="#0F1F3D" />
      <path d="M19.3 13.6 L21 11 L22.8 13.9 L21 14.8 Z" fill="#fff" />
    </svg>
  );
}

export function Ridge({ fill = "#FBF7EE", className = "" }: { fill?: string; className?: string }) {
  return (
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className={`absolute left-0 bottom-[-1px] w-full h-[60px] ${className}`} aria-hidden="true">
      <path d="M0 60 L0 38 L120 14 L220 34 L360 6 L480 30 L620 12 L760 36 L900 8 L1040 32 L1180 14 L1320 34 L1440 16 L1440 60Z" fill={fill} />
    </svg>
  );
}
