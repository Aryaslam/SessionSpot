import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/sign-out-button";
import ViewSignatureButton from "@/components/view-signature-button";

export const dynamic = "force-dynamic";
export const metadata = { title: "Responses · Club Admin" };

type ResponseRow = {
  id: string;
  status: "accepted" | "rejected";
  rejection_reason: string | null;
  digital_signature_path: string | null;
  created_at: string;
  responder_id: string;
  profiles: { display_name: string } | null;
  requests: {
    id: string;
    usage_date: string;
    start_time: string;
    end_time: string;
    reason: string;
    request_classrooms: {
      classrooms: { class_name: string };
    }[];
  };
};

const STATUS_STYLES: Record<string, string> = {
  accepted: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

export default async function ClubAdminResponses() {
  await requireRole("club_admin");
  const supabase = await createClient();

  // RLS restricts this to responses for requests belonging to the caller's club.
  const { data: responses, error } = await supabase
    .from("responses")
    .select(
      "id, status, rejection_reason, digital_signature_path, created_at, responder_id, profiles(display_name), requests(id, usage_date, start_time, end_time, reason, request_classrooms(classrooms(class_name)))"
    )
    .order("created_at", { ascending: false });

  const rows = (responses ?? []) as unknown as ResponseRow[];

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
              Responses
            </h1>
          </div>
          <SignOutButton loginPath="/club-admin/login" />
        </header>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            Failed to load responses: {error.message}
          </p>
        ) : rows.length === 0 ? (
          <p className="rounded-xl border border-neutral-200 p-6 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            No responses yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {rows.map((res) => (
              <li
                key={res.id}
                className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[res.status]}`}
                  >
                    {res.status}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {new Date(res.created_at).toLocaleString()}
                  </span>
                </div>

                <p className="mt-2 text-sm font-medium">
                  {res.requests.usage_date} ·{" "}
                  {res.requests.start_time.slice(0, 5)}–
                  {res.requests.end_time.slice(0, 5)}
                </p>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                  {res.requests.request_classrooms
                    .map((rc) => rc.classrooms.class_name)
                    .join(", ")}
                </p>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  Reason: {res.requests.reason}
                </p>

                {res.status === "rejected" && res.rejection_reason && (
                  <p className="mt-2 text-sm text-red-700 dark:text-red-400">
                    Rejection reason: {res.rejection_reason}
                  </p>
                )}

                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                  By {res.profiles?.display_name ?? "Unknown"}
                </p>

                  {res.status === "accepted" && res.digital_signature_path && (
                    <div className="mt-2">
                      <ViewSignatureButton responseId={res.id} />
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
