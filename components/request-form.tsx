"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ClassroomSelect from "@/components/classroom-select";
import type { Classroom } from "@/lib/types";

type Props = {
  classrooms: Classroom[];
  requestId?: string;
  initial?: {
    classroomIds: string[];
    usageDate: string;
    startTime: string;
    endTime: string;
    reason: string;
  };
};

export default function RequestForm({ classrooms, requestId, initial }: Props) {
  const router = useRouter();
  const [classroomIds, setClassroomIds] = useState<string[]>(
    initial?.classroomIds ?? []
  );
  const [unavailableIds, setUnavailableIds] = useState<Set<string>>(new Set());
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [usageDate, setUsageDate] = useState(initial?.usageDate ?? "");
  const [startTime, setStartTime] = useState(initial?.startTime ?? "");
  const [endTime, setEndTime] = useState(initial?.endTime ?? "");
  const [reason, setReason] = useState(initial?.reason ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Re-check classroom availability whenever date/time changes.
  useEffect(() => {
    if (!usageDate || !startTime || !endTime || startTime >= endTime) {
      setUnavailableIds(new Set());
      return;
    }

    let cancelled = false;
    setCheckingAvailability(true);

    const supabase = createClient();
    supabase
      .rpc("available_classrooms", {
        p_usage_date: usageDate,
        p_start_time: startTime,
        p_end_time: endTime,
      })
      .then(({ data, error: rpcError }) => {
        if (cancelled) return;
        setCheckingAvailability(false);
        if (rpcError || !data) return;
        const availableIds = new Set((data as { id: string }[]).map((r) => r.id));
        const unavailable = new Set(
          classrooms.filter((c) => !availableIds.has(c.id)).map((c) => c.id)
        );
        setUnavailableIds(unavailable);
        // Drop any already-selected classroom that just became unavailable.
        setClassroomIds((prev) => prev.filter((id) => !unavailable.has(id)));
      });

    return () => {
      cancelled = true;
    };
  }, [usageDate, startTime, endTime, classrooms]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (classroomIds.length === 0) {
      setError("Select at least one classroom.");
      return;
    }
    if (!usageDate || !startTime || !endTime) {
      setError("Date, start time, and end time are required.");
      return;
    }
    if (startTime >= endTime) {
      setError("Start time must be before end time.");
      return;
    }
    if (!reason.trim()) {
      setError("Reason cannot be empty.");
      return;
    }
    if (classroomIds.some((id) => unavailableIds.has(id))) {
      setError("One of the selected classrooms just became unavailable.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error: rpcError } = requestId
      ? await supabase.rpc("update_request", {
          p_request_id: requestId,
          p_classroom_ids: classroomIds,
          p_usage_date: usageDate,
          p_start_time: startTime,
          p_end_time: endTime,
          p_reason: reason,
        })
      : await supabase.rpc("create_request", {
          p_classroom_ids: classroomIds,
          p_usage_date: usageDate,
          p_start_time: startTime,
          p_end_time: endTime,
          p_reason: reason,
        });

    setLoading(false);

    if (rpcError) {
      setError(rpcError.message);
      return;
    }

    router.push("/club-admin/requests");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Date</label>
          <input
            type="date"
            value={usageDate}
            onChange={(e) => setUsageDate(e.target.value)}
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Start time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">End time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          Classrooms
          {checkingAvailability && (
            <span className="ml-2 text-xs font-normal text-neutral-400">
              checking availability…
            </span>
          )}
        </label>
        <ClassroomSelect
          classrooms={classrooms}
          selectedIds={classroomIds}
          onChange={setClassroomIds}
          unavailableIds={unavailableIds}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Reason</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 py-2.5 text-sm font-medium disabled:opacity-50"
      >
        {loading ? "Saving..." : requestId ? "Save changes" : "Submit request"}
      </button>
    </form>
  );
}
