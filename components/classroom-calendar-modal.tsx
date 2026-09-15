"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Classroom } from "@/lib/types";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}
function toDateString(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

export default function ClassroomCalendarModal({
  classroom,
  canRequest,
  onClose,
}: {
  classroom: Classroom;
  canRequest: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [pickedDate, setPickedDate] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const start = toDateString(year, month, 1);
    const lastDay = new Date(year, month + 1, 0).getDate();
    const end = toDateString(year, month, lastDay);

    const supabase = createClient();
    supabase
      .rpc("classroom_booked_dates", {
        p_classroom_id: classroom.id,
        p_start_date: start,
        p_end_date: end,
      })
      .then(({ data, error }) => {
        if (cancelled) return;
        setLoading(false);
        if (error || !data) return;
        setBookedDates(
          new Set((data as { usage_date: string }[]).map((r) => r.usage_date))
        );
      });

    return () => {
      cancelled = true;
    };
  }, [classroom.id, year, month]);

  function changeMonth(delta: number) {
    setPickedDate(null);
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setMonth(newMonth);
    setYear(newYear);
  }

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-neutral-200/70 bg-white p-5 shadow-lg dark:border-neutral-800/70 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">
            {classroom.class_name}
            <span className="ml-2 font-normal text-neutral-400">
              (Grade {classroom.grade})
            </span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            className="rounded-md px-2 py-1 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            ←
          </button>
          <p className="text-sm font-medium">
            {MONTH_NAMES[month]} {year}
          </p>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            className="rounded-md px-2 py-1 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            →
          </button>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-neutral-400">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) return <div key={i} />;
            const dateStr = toDateString(year, month, day);
            const booked = bookedDates.has(dateStr);
            return (
              <button
                key={i}
                type="button"
                onClick={() => canRequest && setPickedDate(dateStr)}
                disabled={!canRequest}
                className={`flex aspect-square items-center justify-center rounded-full text-xs font-medium ${
                  booked
                    ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                    : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                } ${canRequest ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
              >
                {day}
              </button>
            );
          })}
        </div>

        {loading && (
          <p className="mt-3 text-center text-xs text-neutral-400">
            Loading availability…
          </p>
        )}

        <div className="mt-4 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-green-100 dark:bg-green-950" />
            Available
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-red-100 dark:bg-red-950" />
            Booked
          </span>
        </div>
      </div>

      {pickedDate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-xs rounded-xl border border-neutral-200/70 bg-white p-5 text-center shadow-lg dark:border-neutral-800/70 dark:bg-neutral-900">
            <p className="text-sm font-medium">
              Create a request on {pickedDate}?
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/club-admin/requests/new?date=${pickedDate}&classroom=${classroom.id}`
                  )
                }
                className="flex-1 rounded-md bg-neutral-900 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setPickedDate(null)}
                className="flex-1 rounded-md border border-neutral-300 py-2 text-sm font-medium dark:border-neutral-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
