import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { IdeaForm } from "../../content-forms";
import { linksToText } from "../../links-text";

export const metadata: Metadata = { title: "Admin · Activity idea" };

export default async function EditIdea({ params }: PageProps<"/admin/content/ideas/[id]">) {
  const { id } = await params;
  if (id === "new") {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="h text-[40px] font-bold">New activity idea</h1>
        <IdeaForm initial={{ season_note: "Any time", sort: "50" }} />
      </div>
    );
  }
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const supabase = await createClient();
  const { data: i } = await supabase.from("activity_ideas").select("*").eq("id", id).maybeSingle();
  if (!i) notFound();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="h text-[40px] font-bold">Edit activity idea</h1>
      <IdeaForm initial={{
        id: i.id, title: i.title, description: i.description, category: i.category, season_note: i.season_note,
        tags: i.tags.join(", "), image: i.image ?? "", body: i.body, links: linksToText(i.links), sort: String(i.sort),
      }} />
    </div>
  );
}
