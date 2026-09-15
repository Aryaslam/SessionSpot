import { Suspense } from "react";
import LoginForm from "@/components/login-form";
import { getDictionary, getLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const metadata = { title: "Club Admin Login" };

export default async function ClubAdminLoginPage() {
  const locale = await getLocale();
  const t = getDictionary(locale).login;
  return (
    <Suspense>
      <LoginForm role="club_admin" t={t} />
    </Suspense>
  );
}
