import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import RequestForm from "@/components/request-form";
import type { ClubRequest } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit request · Club Admin" };

export default async function EditRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("club_admin");
  const { id } = await params;
  const supabase = await createClient();

  const { data: request } = await supabase
    .from("requests")
    .select(
      "id, usage_date, start_time, end_time, reason, status, request_classrooms(classroom_id)"
    )
    .eq("id", id)
    .single();

  if (!request || (request as unknown as ClubRequest).status !== "pending") {
    notFound();
  }

  const { data: classrooms } = await supabase
    .from("classrooms")
    .select("id, class_name, grade, description, active, created_at")
    .eq("active", true)
    .order("grade")
    .order("class_name");

  const req = request as unknown as ClubRequest;

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
            Edit request
          </h1>
        </div>
        <RequestForm
          classrooms={classrooms ?? []}
          requestId={req.id}
          initial={{
            classroomIds: req.request_classrooms.map((rc) => rc.classroom_id),
            usageDate: req.usage_date,
            startTime: req.start_time.slice(0, 5),
            endTime: req.end_time.slice(0, 5),
            reason: req.reason,
          }}
        />
      </div>
    </main>
  );
}
