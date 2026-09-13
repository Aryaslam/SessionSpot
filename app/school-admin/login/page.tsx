import LoginForm from "@/components/login-form";
import { getDictionary, getLocale } from "@/lib/i18n";
export const dynamic = "force-dynamic";
export const metadata = { title: "School Admin Login" };

export default async function SchoolAdminLoginPage() {
  const locale = await getLocale();
  const t = getDictionary(locale).login;
  return <LoginForm role="school_admin" t={t} />;
}
