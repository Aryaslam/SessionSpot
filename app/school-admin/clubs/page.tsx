import { requireRole } from "@/lib/auth";
import SignOutButton from "@/components/sign-out-button";

export const dynamic = "force-dynamic";
export const metadata = { title: "Clubs · School Admin" };

export default async function SchoolAdminClubs() {
  await requireRole("school_admin");

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Clubs</h1>
          <SignOutButton loginPath="/school-admin/login" />
        </header>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Club list and management will be built here next.
        </p>
      </div>
    </main>
  );
}
