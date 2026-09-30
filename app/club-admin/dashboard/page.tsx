import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getDictionary, getLocale } from "@/lib/i18n";
import SignOutButton from "@/components/sign-out-button";

export const dynamic = "force-dynamic";
export const metadata = { title: "Club Admin Dashboard" };

export default async function ClubAdminDashboard() {
  const profile = await requireRole("club_admin");
  const locale = await getLocale();
  const t = getDictionary(locale).dashboard;

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {t.clubAdminLabel}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              {profile.display_name}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/club-admin/settings"
              className="text-sm text-neutral-500 hover:underline dark:text-neutral-400"
            >
              {t.settingsLabel}
            </Link>
            <SignOutButton loginPath="/club-admin/login" label={t.signOut} />
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/club-admin/classrooms"
            className="rounded-xl border border-neutral-200/70 bg-[#86BCBD] p-5 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800/70 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          >
            <h2 className="font-bold">{t.classroomsTitle}</h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 text-white" >
              {t.classroomsDescClub}
            </p>
          </Link>
          <Link
            href="/club-admin/requests"
            className="rounded-xl border border-neutral-200/70 bg-[#F7E49B] p-5 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800/70 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          >
            <h2 className="font-bold">{t.myRequestsTitle}</h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {t.myRequestsDesc}
            </p>
          </Link>
          <Link
            href="/club-admin/responses"
            className="rounded-xl border border-neutral-200/70 bg-[#A4CE8B] p-5 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800/70 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          >
            <h2 className="font-bold">{t.responsesTitle}</h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {t.responsesDesc}
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}
