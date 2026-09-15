import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/sign-out-button";
import ClubManager from "@/components/club-manager";
import PendingAccountsManager from "@/components/pending-accounts-manager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Clubs · School Admin" };

export default async function SchoolAdminClubs() {
  await requireRole("school_admin");
  const supabase = await createClient();

  const { data: clubs, error } = await supabase
    .from("clubs")
    .select(
      "id, name, description, president_name, president_phone, vice_president_name, vice_president_phone, logo_path, created_at"
    )
    .order("name");

  const { data: pending } = await supabase
    .from("profiles")
    .select("id, display_name, clubs(name)")
    .eq("role", "club_admin")
    .eq("status", "pending");

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              href="/school-admin/dashboard"
              className="text-sm text-neutral-500 hover:underline dark:text-neutral-400"
            >
              ← Dashboard
            </Link>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Clubs
            </h1>
          </div>
          <SignOutButton loginPath="/school-admin/login" />
        </header>

        <PendingAccountsManager
          pending={(pending ?? []) as unknown as {
            id: string;
            display_name: string;
            clubs: { name: string } | null;
          }[]}
        />

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            Failed to load clubs: {error.message}
          </p>
        ) : (
          <ClubManager clubs={clubs ?? []} />
        )}
      </div>
    </main>
  );
}
