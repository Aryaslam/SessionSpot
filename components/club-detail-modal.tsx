"use client";

import { useEffect } from "react";
import type { Club } from "@/lib/types";
import ClubCalendar from "@/components/club-calendar";

function logoUrl(path: string | null) {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/club-logos/${path}`;
}

export default function ClubDetailModal({
  club,
  onClose,
  onEdit,
}: {
  club: Club;
  onClose: () => void;
  onEdit: () => void;
}) {
  const logo = logoUrl(club.logo_path);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
      <div className="flex max-h-full w-full max-w-md flex-col rounded-xl border border-neutral-200/70 bg-white shadow-lg dark:border-neutral-800/70 dark:bg-neutral-900">
        <div className="flex shrink-0 items-start justify-between border-b border-neutral-200/70 p-5 dark:border-neutral-800/70">
          <div className="flex items-center gap-3">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt={club.name}
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-lg font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                {club.name.charAt(0).toUpperCase()}
              </div>
            )}
            <h2 className="text-lg font-semibold tracking-tight">{club.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          {club.description && (
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              {club.description}
            </p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">President</p>
              <p className="font-medium">{club.president_name ?? "—"}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {club.president_phone ?? ""}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Vice President</p>
              <p className="font-medium">{club.vice_president_name ?? "—"}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {club.vice_president_phone ?? ""}
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-neutral-200 pt-4 dark:border-neutral-800">
            <p className="mb-2 text-sm font-medium">Bookings</p>
            <ClubCalendar clubId={club.id} />
          </div>
        </div>

        <div className="shrink-0 border-t border-neutral-200/70 p-5 dark:border-neutral-800/70">
          <button
            type="button"
            onClick={onEdit}
            className="w-full rounded-md border border-neutral-300 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Edit club
          </button>
        </div>
      </div>
    </div>
  );
}
