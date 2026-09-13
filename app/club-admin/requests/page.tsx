import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/sign-out-button";
import CancelRequestButton from "@/components/cancel-request-button";
import type { ClubRequest } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "My requests · Club Admin" };

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  accepted: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  cancelled: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
};

export default async function ClubAdminRequests() {
  await requireRole("club_admin");
  const supabase = await createClient();

  const { data: requests, error } = await supabase
    .from("requests")
    .select(
      "id, club_id, usage_date, start_time, end_time, reason, status, created_at, updated_at, request_classrooms(classroom_id, classrooms(id, class_name, grade))"
    )
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              href="/club-admin/dashboard"
              className="text-sm text-neutral-500 hover:underline dark:text-neutral-400"
            >
              ← Dashboard
            </Link>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              My requests
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/club-admin/requests/new"
              className="rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-3 py-1.5 text-sm font-medium hover:opacity-90"
            >
              New request
            </Link>
            <SignOutButton loginPath="/club-admin/login" />
          </div>
        </header>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            Failed to load requests: {error.message}
          </p>
        ) : !requests || requests.length === 0 ? (
          <p className="rounded-xl border border-neutral-200 p-6 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            No requests yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {(requests as unknown as ClubRequest[]).map((r) => (
              <li
                key={r.id}
                className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[r.status]}`}
                  >
                    {r.status}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {new Date(r.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium">
                  {r.usage_date} · {r.start_time.slice(0, 5)}–
                  {r.end_time.slice(0, 5)}
                </p>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                  {r.request_classrooms
                    .map((rc) => rc.classrooms.class_name)
                    .join(", ")}
                </p>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  {r.reason}
                </p>
                {r.status === "pending" && (
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/club-admin/requests/${r.id}/edit`}
                      className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    >
                      Edit
                    </Link>
                    <CancelRequestButton requestId={r.id} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
