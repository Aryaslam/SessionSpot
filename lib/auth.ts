import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type UserRole = "school_admin" | "club_admin";

export type Profile = {
  id: string;
  display_name: string;
  role: UserRole;
  club_id: string | null;
};

const loginPathByRole: Record<UserRole, string> = {
  school_admin: "/school-admin/login",
  club_admin: "/club-admin/login",
};

/**
 * Loads the current authenticated user's profile and enforces the expected
 * role. Unauthenticated users are sent to that role's login page; signed-in
 * users with the wrong role (or no profile) are signed out and sent there too.
 *
 * This is server-side only. Database RLS remains the real authorization layer.
 */
export async function requireRole(role: UserRole): Promise<Profile> {
  const supabase = await createClient();
  const loginPath = loginPathByRole[role];

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(loginPath);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, role, club_id")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== role) {
    await supabase.auth.signOut();
    redirect(loginPath);
  }

  return profile;
}
