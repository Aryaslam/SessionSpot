"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ChangePasswordButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleClick() {
    setError("");
    setMessage("");
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) {
      setLoading(false);
      setError("No email found on this account.");
      return;
    }
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      user.email,
      { redirectTo: `${window.location.origin}/club-admin/set-password` }
    );
    setLoading(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setMessage(`Verification email sent to ${user.email}.`);
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full rounded-md border border-neutral-300 py-2 text-sm font-medium disabled:opacity-50 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        {loading ? "Sending..." : "Change password"}
      </button>
      {message && <p className="text-xs text-green-700 dark:text-green-400">{message}</p>}
      {error && <p className="text-xs text-red-700 dark:text-red-400">{error}</p>}
    </div>
  );
}
