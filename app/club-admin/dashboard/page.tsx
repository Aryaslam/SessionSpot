import Link from "next/link";
import { requireRole } from "@/lib/auth";
import SignOutButton from "@/components/sign-out-button";

export const dynamic = "force-dynamic";
export const metadata = { title: "Club Admin Dashboard" };

export default async function ClubAdminDashboard() {
  const profile = await requireRole("club_admin");

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Club Admin
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              {profile.display_name}
            </h1>
          </div>
          <SignOutButton loginPath="/club-admin/login" />
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/club-admin/classrooms"
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
          >
            <h2 className="font-medium">Classrooms</h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Check availability and pick rooms
            </p>
          </Link>
          <Link
            href="/club-admin/requests"
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
          >
            <h2 className="font-medium">My requests</h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Create, edit, or cancel requests
            </p>
          </Link>
          <Link
            href="/club-admin/responses"
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
          >
            <h2 className="font-medium">Responses</h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              View accepted or rejected requests
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}
