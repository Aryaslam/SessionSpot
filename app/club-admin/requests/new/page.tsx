import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import RequestForm from "@/components/request-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "New request · Club Admin" };

export default async function NewRequestPage() {
  await requireRole("club_admin");
  const supabase = await createClient();

  const { data: classrooms } = await supabase
    .from("classrooms")
    .select("id, class_name, grade, description, active, created_at")
    .eq("active", true)
    .order("grade")
    .order("class_name");

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div>
          <Link
            href="/club-admin/requests"
            className="text-sm text-neutral-500 hover:underline dark:text-neutral-400"
          >
            ← My requests
          </Link>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            New request
          </h1>
        </div>
        <RequestForm classrooms={classrooms ?? []} />
      </div>
    </main>
  );
}
