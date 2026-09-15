"use client";

import { useEffect, useState } from "react";

type Account = { id: string; display_name: string; email: string };

const MAX_ACCOUNTS = 5;

export default function ClubAccountsManager({ clubId }: { clubId: string }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [inviting, setInviting] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/clubs/${clubId}/accounts`);
    const data = await res.json();
    setLoading(false);
    if (res.ok) setAccounts(data.accounts);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubId]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    setInviting(true);
    const res = await fetch(`/api/clubs/${clubId}/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), displayName: displayName.trim() }),
    });
    const data = await res.json();
    setInviting(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to send invite.");
      return;
    }
    setSuccess(`Invite sent to ${email.trim()}.`);
    setEmail("");
    setDisplayName("");
    load();
  }

  async function handleRemove(id: string) {
    const reason = prompt("Reason for removing this account:");
    if (!reason || !reason.trim()) return;
    const res = await fetch(`/api/accounts/${id}/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: reason.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error ?? "Failed to remove account.");
      return;
    }
    load();
  }

  return (
    <div className="space-y-3 rounded-xl border border-neutral-200/70 bg-white p-4 shadow-sm dark:border-neutral-800/70 dark:bg-neutral-900">
      <p className="text-sm font-medium">
        Connected accounts
        <span className="ml-2 font-normal text-neutral-400">
          {accounts.length}/{MAX_ACCOUNTS}
        </span>
      </p>

      {loading ? (
        <p className="text-sm text-neutral-400">Loading…</p>
      ) : accounts.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          No accounts connected yet.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {accounts.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between gap-2 rounded-md border border-neutral-200/70 px-3 py-1.5 text-sm dark:border-neutral-800/70"
            >
              <div>
                <p className="font-medium">{a.display_name}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{a.email}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(a.id)}
                className="rounded-md border border-red-300 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400">
          {success}
        </div>
      )}

      {accounts.length < MAX_ACCOUNTS && (
        <form
          onSubmit={handleInvite}
          className="space-y-2 border-t border-neutral-200 pt-3 dark:border-neutral-800"
        >
          <p className="text-xs text-neutral-400">
            Email invites require SMTP to be configured — self-registration via the
            login page&apos;s Register link works without it.
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@email.com"
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            />
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Name (optional)"
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            />
          </div>
          <button
            type="submit"
            disabled={inviting}
            className="w-full rounded-md bg-neutral-900 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
          >
            {inviting ? "Sending invite..." : "Invite by email"}
          </button>
        </form>
      )}
    </div>
  );
}
