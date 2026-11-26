import type { Json } from "@/lib/database.types";

/** Turns stored [{label, url}] into the "Label | url" lines the form edits. */
export function linksToText(links: Json): string {
  if (!Array.isArray(links)) return "";
  return links
    .map((l) => (l && typeof l === "object" && !Array.isArray(l) ? `${l.label ?? ""} | ${l.url ?? ""}` : ""))
    .filter(Boolean)
    .join("\n");
}
