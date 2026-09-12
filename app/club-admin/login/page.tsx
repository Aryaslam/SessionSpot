import LoginForm from "@/components/login-form";

export const metadata = { title: "Club Admin Login" };

export default function ClubAdminLoginPage() {
  return <LoginForm role="club_admin" />;
}
