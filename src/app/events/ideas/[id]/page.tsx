import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage, type DetailLink } from "@/components/detail-page";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_STYLE } from "@/lib/constants";
import { requireMember } from "@/lib/data";

export const metadata: Metadata = { title: "Activity idea" };

export default async function IdeaPage({ params }: PageProps<"/events/ideas/[id]">) {
  const viewer = await requireMember();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const supabase = await createClient();
  const { data: i } = await supabase.from("activity_ideas").select("*")
    .eq("university_id", viewer.profile.university_id ?? "").eq("id", id).maybeSingle();
  if (!i) notFound();

  const style = CATEGORY_STYLE[i.category];
  return (
    <DetailPage
      viewer={viewer}
      current="/events"
      back={{ href: "/events#ideas", label: "During your stay" }}
      hero={
        <div className="relative h-[clamp(200px,32vw,340px)] overflow-hidden rounded-3xl bg-navy-2">
          {i.image && <img src={i.image} alt="" className="h-full w-full object-cover" />}
          <span className="chip absolute bottom-4 left-4 bg-white">{i.season_note}</span>
        </div>
      }
      chips={<>
        <span className={`chip ${style.chip}`}>{i.category === "city" ? viewer.university?.city ?? style.label : style.label}</span>
        {i.tags.map((t) => <span key={t} className="chip bg-sand">{t}</span>)}
      </>}
      title={i.title}
      summary={i.description}
      body={i.body}
      links={(i.links as DetailLink[]) ?? []}
    />
  );
}
