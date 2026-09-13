"use client";

import { useState } from "react";

export default function ViewSignatureButton({ responseId }: { responseId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleView() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/signature-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responseId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load signature");
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load signature.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleView}
        disabled={loading}
        className="text-xs font-medium text-neutral-600 underline disabled:opacity-50 dark:text-neutral-300"
      >
        {loading ? "Loading..." : "View signature"}
      </button>
      {error && <p className="mt-1 text-xs text-red-700 dark:text-red-400">{error}</p>}
    </div>
  );
}
