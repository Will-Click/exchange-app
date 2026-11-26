"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function userOrRedirect() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function toggleChecklist(itemId: string, done: boolean) {
  const { supabase, user } = await userOrRedirect();
  if (done) {
    await supabase.from("checklist_progress").upsert({ user_id: user.id, item_id: itemId });
  } else {
    await supabase.from("checklist_progress").delete().eq("user_id", user.id).eq("item_id", itemId);
  }
  revalidatePath("/dashboard");
}

export async function setArrived(arrived: boolean) {
  const { supabase, user } = await userOrRedirect();
  await supabase.from("profiles").update({ has_arrived: arrived }).eq("id", user.id);
  redirect(arrived ? "/events" : "/dashboard");
}

export type PostState = { error?: string; ok?: number } | undefined;

export async function createPost(_: PostState, form: FormData): Promise<PostState> {
  const { supabase, user } = await userOrRedirect();
  const body = String(form.get("body") ?? "").trim();
  const termId = String(form.get("term_id") ?? "");
  if (!body) return { error: "Write something first." };
  if (body.length > 4000) return { error: "Posts can be up to 4,000 characters." };
  const { error } = await supabase.from("posts").insert({ term_id: termId, author_id: user.id, body });
  if (error) return { error: "Couldn't post. You can only post to semesters you've joined." };
  revalidatePath("/community");
  return { ok: Date.now() };
}

export async function createReply(_: PostState, form: FormData): Promise<PostState> {
  const { supabase, user } = await userOrRedirect();
  const body = String(form.get("body") ?? "").trim();
  const postId = String(form.get("post_id") ?? "");
  if (!body) return { error: "Write a reply first." };
  if (body.length > 2000) return { error: "Replies can be up to 2,000 characters." };
  const { error } = await supabase.from("replies").insert({ post_id: postId, author_id: user.id, body });
  if (error) return { error: "Couldn't reply. Try again." };
  revalidatePath("/community");
  return { ok: Date.now() };
}

export async function deletePost(postId: string) {
  const { supabase } = await userOrRedirect();
  await supabase.from("posts").delete().eq("id", postId);
  revalidatePath("/community");
}

export async function deleteReply(replyId: string) {
  const { supabase } = await userOrRedirect();
  await supabase.from("replies").delete().eq("id", replyId);
  revalidatePath("/community");
}

export async function reportContent(target: { postId?: string; replyId?: string }, reason: string) {
  const { supabase, user } = await userOrRedirect();
  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    post_id: target.postId ?? null,
    reply_id: target.replyId ?? null,
    reason: reason.slice(0, 500),
  });
  return { ok: !error };
}

export async function joinTerm(termId: string) {
  const { supabase, user } = await userOrRedirect();
  await supabase.from("profile_terms").insert({ profile_id: user.id, term_id: termId });
  redirect(`/community?term=${termId}`);
}
