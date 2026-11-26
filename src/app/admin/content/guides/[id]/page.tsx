import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GuideForm } from "../../content-forms";
import { linksToText } from "../../links-text";

export const metadata: Metadata = { title: "Admin · Guide" };

export default async function EditGuide({ params }: PageProps<"/admin/content/guides/[id]">) {
  const { id } = await params;
  if (id === "new") {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="h text-[40px] font-bold">New guide</h1>
        <GuideForm initial={{ icon: "info", tone: "#E3F6F4", sort: "50" }} />
      </div>
    );
  }
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const supabase = await createClient();
  const { data: g } = await supabase.from("guides").select("*").eq("id", id).maybeSingle();
  if (!g) notFound();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="h text-[40px] font-bold">Edit guide</h1>
      <GuideForm initial={{
        id: g.id, title: g.title, summary: g.summary, icon: g.icon, tone: g.tone,
        body: g.body, links: linksToText(g.links), sort: String(g.sort),
      }} />
    </div>
  );
}
