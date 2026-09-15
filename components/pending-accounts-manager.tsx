"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type PendingAccount = {
  id: string;
  display_name: string;
  clubs: { name: string } | null;
};

export default function PendingAccountsManager({
  pending,
}: {
  pending: PendingAccount[];
}) {
  const router = useRouter();

  async function handleAccept(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ status: "active" })
      .eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    router.refresh();
  }

  async function handleReject(id: string) {
    if (!confirm("Reject and delete this registration request?")) return;
    const res = await fetch(`/api/accounts/${id}/reject`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error ?? "Failed to reject.");
      return;
    }
    router.refresh();
  }

  if (pending.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        Pending account requests ({pending.length})
      </h2>
      <ul className="space-y-2">
        {pending.map((p) => (
          <li
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950"
          >
            <div>
              <p className="text-sm font-medium">{p.display_name}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {p.clubs?.name ?? "Unknown club"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleAccept(p.id)}
                className="rounded-md bg-green-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-800"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => handleReject(p.id)}
                className="rounded-md bg-red-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-800"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
