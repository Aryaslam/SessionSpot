import LoginForm from "@/components/login-form";

export const metadata = { title: "School Admin Login" };

export default function SchoolAdminLoginPage() {
  return <LoginForm role="school_admin" />;
}
