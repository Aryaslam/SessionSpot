"use client";

import type { Classroom } from "@/lib/types";

const GRADE_ORDER = ["X", "XI", "XII"];

export default function ClassroomSelect({
  classrooms,
  selectedIds,
  onChange,
  unavailableIds,
}: {
  classrooms: Classroom[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  unavailableIds?: Set<string>;
}) {
  function toggle(id: string) {
    if (unavailableIds?.has(id)) return;
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id]
    );
  }

  const byGrade = new Map<string, Classroom[]>();
  for (const c of classrooms) {
    const list = byGrade.get(c.grade) ?? [];
    list.push(c);
    byGrade.set(c.grade, list);
  }
  const grades = [...byGrade.keys()].sort(
    (a, b) => GRADE_ORDER.indexOf(a) - GRADE_ORDER.indexOf(b)
  );

  return (
    <div className="space-y-5">
      {grades.map((grade) => (
        <div key={grade} className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Grade {grade}
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {byGrade
              .get(grade)!
              .sort((a, b) => a.class_name.localeCompare(b.class_name))
              .map((c) => {
                const checked = selectedIds.includes(c.id);
                const unavailable = unavailableIds?.has(c.id) ?? false;
                return (
                  <button
                    key={c.id}
                    type="button"
                    disabled={unavailable}
                    onClick={() => toggle(c.id)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      unavailable
                        ? "cursor-not-allowed border-neutral-200 text-neutral-400 line-through dark:border-neutral-800 dark:text-neutral-600"
                        : checked
                        ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                        : "border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    }`}
                  >
                    {c.class_name}
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
