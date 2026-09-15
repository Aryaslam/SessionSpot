import Link from "next/link";
import { cookies } from "next/headers";
import { requireRole } from "@/lib/auth";
import { getDictionary, type Locale } from "@/lib/i18n";
import SignOutButton from "@/components/sign-out-button";
import SettingsForm from "@/components/settings-form";
import ChangePasswordButton from "@/components/change-password-button";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings · Club Admin" };

export default async function ClubAdminSettings() {
  await requireRole("club_admin");
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value === "dark" ? "dark" : "light";
  const locale: Locale = cookieStore.get("locale")?.value === "id" ? "id" : "en";
  const t = getDictionary(locale).settings;

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-md space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              href="/club-admin/dashboard"
              className="text-sm text-neutral-500 hover:underline dark:text-neutral-400"
            >
              {t.back}
            </Link>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              {t.title}
            </h1>
          </div>
          <SignOutButton loginPath="/club-admin/login" />
        </header>
        <SettingsForm theme={theme} locale={locale} t={t} />
        <ChangePasswordButton />
      </div>
    </main>
  );
}
