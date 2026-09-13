import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/sign-out-button";
import type { ClubRequest } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Requests · School Admin" };

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  accepted: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  cancelled: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
};

type RequestWithClub = ClubRequest & { clubs: { name: string } };

export default async function SchoolAdminRequests() {
  await requireRole("school_admin");
  const supabase = await createClient();

  const { data: requests, error } = await supabase
    .from("requests")
    .select(
      "id, club_id, usage_date, start_time, end_time, reason, status, created_at, updated_at, clubs(name), request_classrooms(classroom_id, classrooms(id, class_name, grade))"
    )
    .order("created_at", { ascending: false });

  const all = (requests ?? []) as unknown as RequestWithClub[];
  const pending = all.filter((r) => r.status === "pending");
  const rest = all.filter((r) => r.status !== "pending");

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
              Requests
            </h1>
          </div>
          <SignOutButton loginPath="/school-admin/login" />
        </header>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            Failed to load requests: {error.message}
          </p>
        ) : (
          <>
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Pending ({pending.length})
              </h2>
              {pending.length === 0 ? (
                <p className="rounded-xl border border-neutral-200 p-6 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                  No pending requests.
                </p>
              ) : (
                <ul className="space-y-3">
                  {pending.map((r) => (
                    <li key={r.id}>
                      <Link
                        href={`/school-admin/requests/${r.id}`}
                        className="block rounded-xl border border-neutral-200 p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-medium">
                            {r.clubs.name}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[r.status]}`}
                          >
                            {r.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm">
                          {r.usage_date} · {r.start_time.slice(0, 5)}–
                          {r.end_time.slice(0, 5)}
                        </p>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                          {r.request_classrooms
                            .map((rc) => rc.classrooms.class_name)
                            .join(", ")}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                          {new Date(r.created_at).toLocaleString()}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                History
              </h2>
              {rest.length === 0 ? (
                <p className="rounded-xl border border-neutral-200 p-6 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                  No processed requests yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {rest.map((r) => (
                    <li key={r.id}>
                      <Link
                        href={`/school-admin/requests/${r.id}`}
                        className="block rounded-xl border border-neutral-200 p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-medium">
                            {r.clubs.name}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[r.status]}`}
                          >
                            {r.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm">
                          {r.usage_date} · {r.start_time.slice(0, 5)}–
                          {r.end_time.slice(0, 5)}
                        </p>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                          {r.request_classrooms
                            .map((rc) => rc.classrooms.class_name)
                            .join(", ")}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
