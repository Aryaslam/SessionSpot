import Link from "next/link";
import { getDictionary, getLocale } from "@/lib/i18n";
export const dynamic = "force-dynamic";
export default async function Home() {
  const locale = await getLocale();
  const t = getDictionary(locale).home;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">{t.title}</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t.subtitle}
          </p>
        </div>

        <div className="grid gap-3">
          <Link
            href="/school-admin/login"
            className="rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
          >
            {t.schoolAdmin}
          </Link>
          <Link
            href="/club-admin/login"
            className="rounded-md border border-neutral-300 dark:border-neutral-700 py-2.5 text-sm font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            {t.clubAdmin}
          </Link>
        </div>
      </div>
    </main>
  );
}
