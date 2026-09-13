import type { Classroom } from "@/lib/types";

const GRADE_ORDER = ["X", "XI", "XII"];

/**
 * Groups classrooms by grade and renders them as cards.
 * Shared by the School Admin and Club Admin classroom pages.
 */
export default function ClassroomGrid({
  classrooms,
  showInactive = false,
}: {
  classrooms: Classroom[];
  /** School Admin sees inactive rooms + descriptions; Club Admin sees active rooms only. */
  showInactive?: boolean;
}) {
  const visible = showInactive
    ? classrooms
    : classrooms.filter((c) => c.active);

  if (visible.length === 0) {
    return (
      <p className="rounded-xl border border-neutral-200 p-6 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        No classrooms yet.
      </p>
    );
  }

  const byGrade = new Map<string, Classroom[]>();
  for (const c of visible) {
    const list = byGrade.get(c.grade) ?? [];
    list.push(c);
    byGrade.set(c.grade, list);
  }

  const grades = [...byGrade.keys()].sort(
    (a, b) =>
      GRADE_ORDER.indexOf(a) - GRADE_ORDER.indexOf(b) || a.localeCompare(b)
  );

  return (
    <div className="space-y-8">
      {grades.map((grade) => (
        <section key={grade} className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Grade {grade}
            <span className="ml-2 font-normal normal-case">
              {byGrade.get(grade)!.length} rooms
            </span>
          </h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {byGrade
              .get(grade)!
              .sort((a, b) => a.class_name.localeCompare(b.class_name))
              .map((c) => (
                <li
                  key={c.id}
                  className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{c.class_name}</p>
                    {showInactive && !c.active && (
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                        inactive
                      </span>
                    )}
                  </div>
                  {showInactive && c.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">
                      {c.description}
                    </p>
                  )}
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
