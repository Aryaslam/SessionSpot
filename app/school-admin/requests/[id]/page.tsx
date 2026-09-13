import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ClubRequest } from "@/lib/types";
import ApproveRejectForm from "@/components/approve-reject-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Request detail · School Admin" };

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  accepted: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  cancelled: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
};

type RequestWithClub = ClubRequest & { clubs: { name: string } };

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("school_admin");
  const { id } = await params;
  const supabase = await createClient();

  const { data: request } = await supabase
    .from("requests")
    .select(
      "id, club_id, usage_date, start_time, end_time, reason, status, created_at, updated_at, clubs(name), request_classrooms(classroom_id, classrooms(id, class_name, grade))"
    )
    .eq("id", id)
    .single();

  if (!request) notFound();

  const r = request as unknown as RequestWithClub;

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div>
          <Link
            href="/school-admin/requests"
            className="text-sm text-neutral-500 hover:underline dark:text-neutral-400"
          >
            ← Requests
          </Link>
        </div>

        <div className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-xl font-semibold tracking-tight">
              {r.clubs.name}
            </h1>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[r.status]}`}
            >
              {r.status}
            </span>
          </div>

          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-neutral-500 dark:text-neutral-400">Date</dt>
              <dd className="font-medium">{r.usage_date}</dd>
            </div>
            <div>
              <dt className="text-neutral-500 dark:text-neutral-400">Time</dt>
              <dd className="font-medium">
                {r.start_time.slice(0, 5)}–{r.end_time.slice(0, 5)}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500 dark:text-neutral-400">
                Classrooms
              </dt>
              <dd className="font-medium">
                {r.request_classrooms
                  .map((rc) => rc.classrooms.class_name)
                  .join(", ")}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500 dark:text-neutral-400">
                Reason
              </dt>
              <dd className="font-medium">{r.reason}</dd>
            </div>
            <div>
              <dt className="text-neutral-500 dark:text-neutral-400">
                Requested
              </dt>
              <dd className="font-medium">
                {new Date(r.created_at).toLocaleString()}
              </dd>
            </div>
                      {r.status === "pending" && <ApproveRejectForm requestId={r.id} />}
          </dl>
        </div>
      </div>
    </main>
  );
}
