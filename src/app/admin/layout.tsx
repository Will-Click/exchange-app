import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { requireMember } from "@/lib/data";
import { AdminNav } from "./nav";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const viewer = await requireMember();
  if (!viewer.isAdmin) redirect("/dashboard");
  return (
    <div className="w-full">
      <AppHeader viewer={viewer} current="/admin" />
      <div className="bg-navy-2 text-white">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-8">
          <span className="text-[13px] font-bold uppercase tracking-[.12em] text-sun">Admin · {viewer.university?.short_name}</span>
          <AdminNav />
        </div>
      </div>
      <main className="mx-auto box-border max-w-[1280px] px-4 py-10 sm:px-8">{children}</main>
    </div>
  );
}
