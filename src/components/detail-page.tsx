import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { ArrowLeft, External, Info } from "@/components/icons";
import type { Viewer } from "@/lib/data";

export type DetailLink = { label: string; url: string };

/** Shared layout for guide and activity-idea detail pages. */
export function DetailPage({ viewer, current, back, hero, chips, title, summary, body, links }: {
  viewer: Viewer;
  current: string;
  back: { href: string; label: string };
  hero: React.ReactNode;
  chips?: React.ReactNode;
  title: string;
  summary: string;
  body: string;
  links: DetailLink[];
}) {
  return (
    <div className="w-full">
      <AppHeader viewer={viewer} current={current} />
      <main className="mx-auto box-border flex max-w-[1080px] flex-col gap-6 px-4 pt-8 pb-16 sm:px-8">
        <Link href={back.href} className="lnk self-start no-underline"><ArrowLeft size={16} />{back.label}</Link>
        {hero}
        <div className="flex flex-wrap items-start gap-8">
          <article className="flex min-w-0 flex-[999_1_480px] flex-col gap-4">
            {chips && <div className="flex flex-wrap gap-2">{chips}</div>}
            <h1 className="h text-[clamp(34px,5vw,48px)] font-bold leading-[1.05]">{title}</h1>
            <p className="m-0 text-lg leading-relaxed text-ink-2">{summary}</p>
            <RichText text={body} />
          </article>
          <aside className="flex min-w-0 flex-[1_1_280px] flex-col gap-4 lg:max-w-[340px]">
            {links.length > 0 && (
              <div className="card flex flex-col gap-1 p-5">
                <h2 className="h mb-1 text-lg font-bold">Official links</h2>
                {links.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                    className="flex min-h-11 items-center justify-between gap-3 rounded-xl px-2 text-[15px] font-semibold no-underline hover:bg-sand">
                    {l.label}<External className="flex-none text-muted" />
                  </a>
                ))}
              </div>
            )}
            <div className="flex items-start gap-3 rounded-[18px] bg-glacier px-5 py-4 text-sm leading-normal text-[#22324F]">
              <Info className="mt-0.5 flex-none" />
              <span>Fares, schedules and conditions change. Check the official links before you go.</span>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

/** Renders plain text: blank line = new block, "## " = heading, "- " = bullet, **bold**. */
function RichText({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\s*\n/).filter(Boolean);
  if (blocks.length === 0) return null;
  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        return (
          <div key={i} className="flex flex-col gap-2.5">
            {lines.map((l, j) => {
              if (l.startsWith("## ")) return <h2 key={j} className="h mt-3 text-2xl font-bold">{l.slice(3)}</h2>;
              if (l.startsWith("- ")) return (
                <p key={j} className="m-0 flex gap-3 text-base leading-relaxed text-ink-2">
                  <span className="mt-[11px] h-1.5 w-1.5 flex-none rounded-full bg-teal" aria-hidden="true" /><span>{bold(l.slice(2))}</span>
                </p>
              );
              return <p key={j} className="m-0 text-base leading-relaxed text-ink-2">{bold(l)}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}

function bold(s: string) {
  return s.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i} className="text-navy">{part}</strong> : part));
}
