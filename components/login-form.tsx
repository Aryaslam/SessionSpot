"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { dictionaries } from "@/lib/i18n";

type Role = "school_admin" | "club_admin";
type LoginDict = (typeof dictionaries)["en"]["login"];

const roleMeta: Record<Role, { dashboard: string; crossPortalHref: string }> = {
  school_admin: {
    dashboard: "/school-admin/dashboard",
    crossPortalHref: "/club-admin/login",
  },
  club_admin: {
    dashboard: "/club-admin/dashboard",
    crossPortalHref: "/school-admin/login",
  },
};

export default function LoginForm({ role, t }: { role: Role; t: LoginDict }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const meta = roleMeta[role];
  const title = role === "school_admin" ? t.schoolTitle : t.clubTitle;
  const subtitle = role === "school_admin" ? t.schoolSubtitle : t.clubSubtitle;
  const crossPortalLabel = role === "school_admin" ? t.tryClub : t.trySchool;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      const userId = signInData.user?.id;
      if (!userId) {
        setError("Signed in, but no user was returned. Please try again.");
        return;
      }

      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .limit(1);

      if (profileError) {
        setError(
          `Could not verify your account role (${profileError.code ?? "unknown error"}): ${profileError.message}`
        );
        return;
      }

      const profileRole = profiles?.[0]?.role;
      if (!profileRole) {
        setError(
          "No profile is linked to this account. Ask the school administrator to create your profile row in Supabase."
        );
        return;
      }

      if (profileRole !== role) {
        await supabase.auth.signOut();
        setError(
          `This account is a ${profileRole === "school_admin" ? "school admin" : "club admin"} account. Please use the ${profileRole === "school_admin" ? "School Admin" : "Club Admin"} login.`
        );
        return;
      }

      router.replace(meta.dashboard);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Check the Supabase environment configuration."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-4 inline-block text-sm text-neutral-500 hover:underline dark:text-neutral-400"
        >
          {t.back}
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {subtitle}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-neutral-200/70 bg-white shadow-sm dark:border-neutral-800/70 dark:bg-neutral-900 p-6 space-y-4"
        >
          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              {t.email}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
              placeholder="admin@school.edu"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              {t.password}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 pr-16 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                {showPassword ? t.hide : t.show}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 py-2 text-sm font-medium disabled:opacity-50"
          >
            {loading ? t.signingIn : t.signIn}
          </button>
        </form>

        <Link
          href={meta.crossPortalHref}
          className="mt-4 block text-center text-sm text-neutral-500 hover:underline dark:text-neutral-400"
        >
          {crossPortalLabel}
        </Link>
      </div>
    </main>
  );
}
