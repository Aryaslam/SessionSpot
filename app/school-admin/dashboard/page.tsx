import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getDictionary, getLocale } from "@/lib/i18n";
import SignOutButton from "@/components/sign-out-button";

export const dynamic = "force-dynamic";
export const metadata = { title: "School Admin Dashboard" };

export default async function SchoolAdminDashboard() {
  const profile = await requireRole("school_admin");
  const locale = await getLocale();
  const t = getDictionary(locale).dashboard;

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {t.schoolAdminLabel}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              {profile.display_name}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/school-admin/settings"
              className="text-sm text-neutral-500 hover:underline dark:text-neutral-400"
            >
              {t.settingsLabel}
            </Link>
            <SignOutButton loginPath="/school-admin/login" label={t.signOut} />
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/school-admin/requests"
            className="rounded-xl border border-neutral-200/70 bg-white p-5 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800/70 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          >
            <h2 className="font-medium">{t.pendingTitle}</h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {t.pendingDesc}
            </p>
          </Link>
          <Link
            href="/school-admin/classrooms"
            className="rounded-xl border border-neutral-200/70 bg-white p-5 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800/70 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          >
            <h2 className="font-medium">{t.classroomsTitle}</h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {t.classroomsDescSchool}
            </p>
          </Link>
          <Link
            href="/school-admin/clubs"
            className="rounded-xl border border-neutral-200/70 bg-white p-5 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800/70 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          >
            <h2 className="font-medium">{t.clubsTitle}</h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {t.clubsDesc}
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}
