import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage, type DetailLink } from "@/components/detail-page";
import { guideIcon } from "@/components/guide-icons";
import { createClient } from "@/lib/supabase/server";
import { requireMember } from "@/lib/data";

export const metadata: Metadata = { title: "Guide" };

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const viewer = await requireMember();
  const { slug } = await params;
  const supabase = await createClient();
  const { data: g } = await supabase.from("guides").select("*")
    .eq("university_id", viewer.profile.university_id ?? "").eq("slug", slug).maybeSingle();
  if (!g) notFound();

  return (
    <DetailPage
      viewer={viewer}
      current="/dashboard"
      back={{ href: "/dashboard", label: "Before arrival" }}
      hero={
        <span className="grid h-16 w-16 place-items-center rounded-[20px] [&_svg]:h-7 [&_svg]:w-7" style={{ background: g.tone }} aria-hidden="true">
          {guideIcon(g.icon)}
        </span>
      }
      chips={<span className="chip bg-sand">Guide · {viewer.university?.short_name ?? viewer.university?.name}</span>}
      title={g.title}
      summary={g.summary}
      body={g.body || "More detail is coming soon. In the meantime, check the official links."}
      links={(g.links as DetailLink[]) ?? []}
    />
  );
}
