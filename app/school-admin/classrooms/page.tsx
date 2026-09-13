import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/sign-out-button";
import ClassroomGrid from "@/components/classroom-grid";

export const dynamic = "force-dynamic";
export const metadata = { title: "Classrooms · School Admin" };

export default async function SchoolAdminClassrooms() {
  await requireRole("school_admin");

  const supabase = await createClient();
  const { data: classrooms, error } = await supabase
    .from("classrooms")
    .select("id, class_name, grade, description, active, created_at")
    .order("grade")
    .order("class_name");

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              href="/school-admin/dashboard"
              className="text-sm text-neutral-500 hover:underline dark:text-neutral-400"
            >
              ← Dashboard
            </Link>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Classrooms
            </h1>
          </div>
          <SignOutButton loginPath="/school-admin/login" />
        </header>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            Failed to load classrooms: {error.message}
          </p>
        ) : (
          <ClassroomGrid classrooms={classrooms ?? []} showInactive />
        )}
      </div>
    </main>
  );
}
