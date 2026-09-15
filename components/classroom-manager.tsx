"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ClassroomCalendarModal from "@/components/classroom-calendar-modal";
import type { Classroom } from "@/lib/types";

const GRADES = ["X", "XI", "XII"] as const;

type FormState = {
  id: string | null;
  className: string;
  grade: (typeof GRADES)[number];
  description: string;
};

const emptyForm: FormState = { id: null, className: "", grade: "X", description: "" };

export default function ClassroomManager({ classrooms }: { classrooms: Classroom[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState | null>(null);
  const [calendarClassroom, setCalendarClassroom] = useState<Classroom | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const byGrade = new Map<string, Classroom[]>();
  for (const c of classrooms) {
    const list = byGrade.get(c.grade) ?? [];
    list.push(c);
    byGrade.set(c.grade, list);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    if (!form.className.trim()) {
      setError("Class name cannot be empty.");
      return;
    }
    setError("");
    setLoading(true);
    const supabase = createClient();

    const { error: dbError } = form.id
      ? await supabase
          .from("classrooms")
          .update({
            class_name: form.className.trim(),
            grade: form.grade,
            description: form.description.trim() || null,
          })
          .eq("id", form.id)
      : await supabase.from("classrooms").insert({
          class_name: form.className.trim(),
          grade: form.grade,
          description: form.description.trim() || null,
        });

    setLoading(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    setForm(null);
    router.refresh();
  }

  async function toggleActive(c: Classroom) {
    setLoading(true);
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("classrooms")
      .update({ active: !c.active })
      .eq("id", c.id);
    setLoading(false);
    if (dbError) {
      alert(dbError.message);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setForm({ ...emptyForm })}
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          Add classroom
        </button>
      </div>

      {form && (
        <form
          onSubmit={handleSave}
          className="space-y-3 rounded-xl border border-neutral-200/70 bg-white p-4 shadow-sm dark:border-neutral-800/70 dark:bg-neutral-900"
        >
          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Class name</label>
              <input
                value={form.className}
                onChange={(e) => setForm({ ...form, className: e.target.value })}
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                placeholder="X-13"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Grade</label>
              <select
                value={form.grade}
                onChange={(e) =>
                  setForm({ ...form, grade: e.target.value as FormState["grade"] })
                }
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Description <span className="font-normal text-neutral-400">(optional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-md bg-neutral-900 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
            >
              {loading ? "Saving..." : form.id ? "Save changes" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm(null);
                setError("");
              }}
              className="flex-1 rounded-md border border-neutral-300 py-2 text-sm font-medium dark:border-neutral-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {GRADES.map((grade) => {
        const list = byGrade.get(grade) ?? [];
        if (list.length === 0) return null;
        return (
          <section key={grade} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Grade {grade}
              <span className="ml-2 font-normal normal-case">{list.length} rooms</span>
            </h2>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list
                .sort((a, b) => a.class_name.localeCompare(b.class_name))
                .map((c) => (
                  <li
                    key={c.id}
                    className="rounded-xl border border-neutral-200/70 bg-white p-4 shadow-sm dark:border-neutral-800/70 dark:bg-neutral-900"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setCalendarClassroom(c)}
                        className="font-medium hover:underline"
                      >
                        {c.class_name}
                      </button>
                      {!c.active && (
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                          inactive
                        </span>
                      )}
                    </div>
                    {c.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">
                        {c.description}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            id: c.id,
                            className: c.class_name,
                            grade: c.grade as FormState["grade"],
                            description: c.description ?? "",
                          })
                        }
                        className="rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleActive(c)}
                        disabled={loading}
                        className="rounded-md border border-red-300 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                      >
                        {c.active ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </section>
        );
      })}

      {calendarClassroom && (
        <ClassroomCalendarModal
          classroom={calendarClassroom}
          canRequest={false}
          onClose={() => setCalendarClassroom(null)}
        />
      )}
    </div>
  );
}
