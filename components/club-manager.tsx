"use client";

import { useState } from "react";
import type { Club } from "@/lib/types";
import ClubDetailModal from "@/components/club-detail-modal";
import ClubForm from "@/components/club-form";
import ClubAccountsManager from "@/components/club-accounts-manager";

function logoUrl(path: string | null) {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/club-logos/${path}`;
}

export default function ClubManager({ clubs }: { clubs: Club[] }) {
  const [selected, setSelected] = useState<Club | null>(null);
  const [editing, setEditing] = useState<Club | null | "new">(null);

  if (editing !== null) {
    return (
      <div className="space-y-4">
        <ClubForm
          club={editing === "new" ? null : editing}
          onDone={() => setEditing(null)}
        />
        {editing !== "new" && <ClubAccountsManager clubId={editing.id} />}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          Register club
        </button>
      </div>

      {clubs.length === 0 ? (
        <p className="rounded-xl border border-neutral-200/70 bg-white p-6 text-center text-sm text-neutral-500 shadow-sm dark:border-neutral-800/70 dark:bg-neutral-900 dark:text-neutral-400">
          No clubs yet.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((c) => {
            const logo = logoUrl(c.logo_path);
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setSelected(c)}
                  className="group relative w-full rounded-xl border border-neutral-200/70 bg-white p-4 text-left shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800/70 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                >
                  <div className="flex items-center gap-3">
                    {logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={logo}
                        alt={c.name}
                        className="h-12 w-12 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <p className="font-medium">{c.name}</p>
                  </div>
                  {c.description && (
                    <p className="mt-3 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">
                      {c.description}
                    </p>
                  )}
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-neutral-900/0 text-xs font-medium text-transparent transition-colors group-hover:bg-neutral-900/70 group-hover:text-white dark:group-hover:bg-neutral-100/80 dark:group-hover:text-neutral-900">
                    View club details
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {selected && (
        <ClubDetailModal
          club={selected}
          onClose={() => setSelected(null)}
          onEdit={() => {
            setEditing(selected);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}
