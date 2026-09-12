import { requireRole } from "@/lib/auth";
import SignOutButton from "@/components/sign-out-button";

export const dynamic = "force-dynamic";
export const metadata = { title: "Classrooms · Club Admin" };

export default async function ClubAdminClassrooms() {
  await requireRole("club_admin");

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Classrooms</h1>
          <SignOutButton loginPath="/club-admin/login" />
        </header>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Availability picker and request creation will be built here next.
        </p>
      </div>
    </main>
  );
}
