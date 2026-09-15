"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ClubAccountsManager from "@/components/club-accounts-manager";
import type { Club } from "@/lib/types";

type Props = {
  club: Club | null;
  onDone: () => void;
};

export default function ClubForm({ club, onDone }: Props) {
  const router = useRouter();
  const [name, setName] = useState(club?.name ?? "");
  const [description, setDescription] = useState(club?.description ?? "");
  const [presidentName, setPresidentName] = useState(club?.president_name ?? "");
  const [presidentPhone, setPresidentPhone] = useState(club?.president_phone ?? "");
  const [vicePresidentName, setVicePresidentName] = useState(
    club?.vice_president_name ?? ""
  );
  const [vicePresidentPhone, setVicePresidentPhone] = useState(
    club?.vice_president_phone ?? ""
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminDisplayName, setAdminDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdClubId, setCreatedClubId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Club name cannot be empty.");
      return;
    }
    if (!club && !adminEmail.trim()) {
      setError("At least one account email is required when registering a club.");
      return;
    }
    setError("");
    setLoading(true);
    const supabase = createClient();

    try {
      let logoPath = club?.logo_path ?? null;
      if (logoFile) {
        const ext = logoFile.name.split(".").pop() ?? "png";
        const path = `${name.trim().toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("club-logos")
          .upload(path, logoFile);
        if (uploadError) throw new Error(`Logo upload failed: ${uploadError.message}`);
        logoPath = path;
      }

      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        president_name: presidentName.trim() || null,
        president_phone: presidentPhone.trim() || null,
        vice_president_name: vicePresidentName.trim() || null,
        vice_president_phone: vicePresidentPhone.trim() || null,
        logo_path: logoPath,
      };

      if (club) {
        const { error: dbError } = await supabase
          .from("clubs")
          .update(payload)
          .eq("id", club.id);
        if (dbError) throw new Error(dbError.message);
        router.refresh();
        onDone();
        return;
      }

      const { data: newClub, error: dbError } = await supabase
        .from("clubs")
        .insert(payload)
        .select("id")
        .single();
      if (dbError) throw new Error(dbError.message);

      const res = await fetch(`/api/clubs/${newClub.id}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminEmail.trim(),
          displayName: adminDisplayName.trim(),
        }),
      });
      const inviteResult = await res.json();

      router.refresh();

      if (!res.ok) {
        // Club row is already saved — let them retry the invite here
        // instead of losing everything they just filled in.
        setError(`Club created, but the invite failed: ${inviteResult.error}`);
        setCreatedClubId(newClub.id);
        return;
      }

      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setLoading(false);
    }
  }

  if (createdClubId) {
    return (
      <div className="space-y-3">
        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}
        <ClubAccountsManager clubId={createdClubId} />
        <button
          type="button"
          onClick={onDone}
          className="w-full rounded-md border border-neutral-300 py-2 text-sm font-medium dark:border-neutral-700"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-xl border border-neutral-200/70 bg-white p-4 shadow-sm dark:border-neutral-800/70 dark:bg-neutral-900"
    >
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Club name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          Description <span className="font-normal text-neutral-400">(optional)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">President name</label>
          <input
            value={presidentName}
            onChange={(e) => setPresidentName(e.target.value)}
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">President phone</label>
          <input
            value={presidentPhone}
            onChange={(e) => setPresidentPhone(e.target.value)}
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Vice president name</label>
          <input
            value={vicePresidentName}
            onChange={(e) => setVicePresidentName(e.target.value)}
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Vice president phone</label>
          <input
            value={vicePresidentPhone}
            onChange={(e) => setVicePresidentPhone(e.target.value)}
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          Logo <span className="font-normal text-neutral-400">(optional)</span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm"
        />
      </div>

      {!club && (
        <div className="space-y-2 border-t border-neutral-200 pt-3 dark:border-neutral-800">
          <p className="text-sm font-medium">Account to log in with</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@email.com"
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            />
            <input
              value={adminDisplayName}
              onChange={(e) => setAdminDisplayName(e.target.value)}
              placeholder="Name (optional)"
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            />
          </div>
          <p className="text-xs text-neutral-400">
            A verification email is sent to set up their own password — you never see or set it.
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-md bg-neutral-900 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
        >
          {loading ? "Saving..." : club ? "Save changes" : "Register club"}
        </button>
        <button
          type="button"
          onClick={onDone}
          disabled={loading}
          className="flex-1 rounded-md border border-neutral-300 py-2 text-sm font-medium dark:border-neutral-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
