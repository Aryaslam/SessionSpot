"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type Booking = {
  usage_date: string;
  classroom_name: string;
  start_time: string;
  end_time: string;
  reason: string;
};

function pad(n: number) {
  return n.toString().padStart(2, "0");
}
function toDateString(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

export default function ClubCalendar({ clubId }: { clubId: string }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setSelectedDate(null);

    const start = toDateString(year, month, 1);
    const lastDay = new Date(year, month + 1, 0).getDate();
    const end = toDateString(year, month, lastDay);

    const supabase = createClient();
    supabase
      .rpc("club_booked_dates", {
        p_club_id: clubId,
        p_start_date: start,
        p_end_date: end,
      })
      .then(({ data, error }) => {
        if (cancelled) return;
        setLoading(false);
        if (error || !data) return;
        setBookings(data as Booking[]);
      });

    return () => {
      cancelled = true;
    };
  }, [clubId, year, month]);

  function changeMonth(delta: number) {
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

  const bookedDates = new Set(bookings.map((b) => b.usage_date));
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const selectedBookings = selectedDate
    ? bookings.filter((b) => b.usage_date === selectedDate)
    : [];

  return (
    <div>
      <div className="flex items-center justify-between">
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
              onClick={() => booked && setSelectedDate(dateStr)}
              disabled={!booked}
              className={`flex aspect-square items-center justify-center rounded-full text-xs font-medium ${
                booked
                  ? "cursor-pointer bg-green-100 text-green-700 hover:opacity-80 dark:bg-green-950 dark:text-green-300"
                  : "text-neutral-400 dark:text-neutral-600"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {loading && (
        <p className="mt-3 text-center text-xs text-neutral-400">Loading…</p>
      )}

      {selectedDate && selectedBookings.length > 0 && (
        <div className="mt-4 space-y-2 rounded-lg border border-neutral-200/70 bg-neutral-50 p-3 dark:border-neutral-800/70 dark:bg-neutral-800">
          <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            {selectedDate}
          </p>
          {selectedBookings.map((b, i) => (
            <div key={i} className="text-sm">
              <p className="font-medium">
                {b.classroom_name} · {b.start_time.slice(0, 5)}–
                {b.end_time.slice(0, 5)}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {b.reason}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
