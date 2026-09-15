import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type UserRole = "school_admin" | "club_admin";

export type Profile = {
  id: string;
  display_name: string;
  role: UserRole;
  club_id: string | null;
  status: string;
  removal_reason: string | null;
};

const loginPathByRole: Record<UserRole, string> = {
  school_admin: "/school-admin/login",
  club_admin: "/club-admin/login",
};

/**
 * Loads the current authenticated user's profile and enforces the expected
 * role and account status. Unauthenticated users are sent to that role's
 * login page; signed-in users with the wrong role, a pending registration,
 * or a removed account are signed out and redirected with an explanatory
 * status in the query string.
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
    .select("id, display_name, role, club_id, status, removal_reason")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== role) {
    await supabase.auth.signOut();
    redirect(loginPath);
  }

  if (profile.status === "pending") {
    await supabase.auth.signOut();
    redirect(`${loginPath}?status=pending`);
  }

  if (profile.status === "removed") {
    await supabase.auth.signOut();
    const reason = encodeURIComponent(profile.removal_reason ?? "No reason given");
    redirect(`${loginPath}?status=removed&reason=${reason}`);
  }

  return profile;
}
