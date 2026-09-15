"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type ClubOption = { id: string; name: string };

export default function RegisterForm() {
  const [clubs, setClubs] = useState<ClubOption[]>([]);
  const [clubId, setClubId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/clubs/public-list")
      .then((res) => res.json())
      .then((data) => setClubs(data.clubs ?? []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!displayName.trim() || !email.trim() || !clubId) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (signUpError || !signUpData.user) {
      setLoading(false);
      setError(signUpError?.message ?? "Registration failed.");
      return;
    }

    if (!signUpData.session) {
      setLoading(false);
      setError(
        "Registration succeeded but no session was returned. Email confirmation may still be enabled — contact the school admin."
      );
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: signUpData.user.id,
      display_name: displayName.trim(),
      role: "club_admin",
      club_id: clubId,
      status: "pending",
    });

    if (profileError) {
      setLoading(false);
      setError(profileError.message);
      return;
    }

    await supabase.auth.signOut();
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-xl border border-neutral-200/70 bg-white p-6 text-center shadow-sm dark:border-neutral-800/70 dark:bg-neutral-900">
          <h1 className="text-lg font-semibold">Registration submitted</h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Your account is waiting for school admin approval. You&apos;ll be
            able to log in once it&apos;s accepted.
          </p>
          <Link
            href="/club-admin/login"
            className="mt-4 inline-block text-sm text-neutral-600 hover:underline dark:text-neutral-300"
          >
            Back to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link
          href="/club-admin/login"
          className="mb-4 inline-block text-sm text-neutral-500 hover:underline dark:text-neutral-400"
        >
          ← Back to login
        </Link>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Register Club Admin Account
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-neutral-200/70 bg-white p-6 shadow-sm dark:border-neutral-800/70 dark:bg-neutral-900"
        >
          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Club</label>
            <select
              value={clubId}
              onChange={(e) => setClubId(e.target.value)}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            >
              <option value="">Select a club</option>
              {clubs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Username</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-neutral-900 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
          >
            {loading ? "Submitting..." : "Register"}
          </button>
        </form>
      </div>
    </main>
  );
}
