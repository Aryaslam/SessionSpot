"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ApproveRejectForm({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<"idle" | "reject">("idle");
  const [rejectionReason, setRejectionReason] = useState("");
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function uploadSignature(): Promise<string | null> {
    if (!signatureFile) return null;
    const supabase = createClient();
    const ext = signatureFile.name.split(".").pop() ?? "png";
    const path = `${requestId}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("digital-signatures")
      .upload(path, signatureFile);

    if (uploadError) {
      throw new Error(`Signature upload failed: ${uploadError.message}`);
    }
    return path;
  }

  async function handleApprove() {
    if (!confirm("Approve this request? This creates bookings for all selected classrooms.")) {
      return;
    }
    setError("");
    setLoading(true);
    try {
      const signaturePath = await uploadSignature();
      const supabase = createClient();
      const { error: rpcError } = await supabase.rpc("approve_request", {
        p_request_id: requestId,
        p_digital_signature_path: signaturePath,
      });
      if (rpcError) throw new Error(rpcError.message);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approval failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReject(e: React.FormEvent) {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      setError("Rejection reason is required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const signaturePath = await uploadSignature();
      const supabase = createClient();
      const { error: rpcError } = await supabase.rpc("reject_request", {
        p_request_id: requestId,
        p_rejection_reason: rejectionReason,
        p_digital_signature_path: signaturePath,
      });
      if (rpcError) throw new Error(rpcError.message);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rejection failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 space-y-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          Digital signature <span className="font-normal text-neutral-400">(optional)</span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSignatureFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm"
        />
      </div>

      {mode === "idle" ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleApprove}
            disabled={loading}
            className="flex-1 rounded-md bg-green-700 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-green-800"
          >
            {loading ? "Approving..." : "Accept"}
          </button>
          <button
            type="button"
            onClick={() => setMode("reject")}
            disabled={loading}
            className="flex-1 rounded-md bg-red-700 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-red-800"
          >
            Reject
          </button>
        </div>
      ) : (
        <form onSubmit={handleReject} className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Rejection reason</label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-md bg-red-700 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-red-800"
            >
              {loading ? "Rejecting..." : "Confirm reject"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("idle");
                setError("");
              }}
              disabled={loading}
              className="flex-1 rounded-md border border-neutral-300 py-2 text-sm font-medium dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
