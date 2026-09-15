import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ clubId: string }> }
) {
  const { clubId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (callerProfile?.role !== "school_admin") {
    return NextResponse.json(
      { error: "Only school admins can view accounts" },
      { status: 403 }
    );
  }

  const admin = createAdminClient();
  const { data: profiles, error } = await admin
    .from("profiles")
    .select("id, display_name")
    .eq("club_id", clubId)
    .eq("role", "club_admin");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const accounts = await Promise.all(
    (profiles ?? []).map(async (p) => {
      const { data } = await admin.auth.admin.getUserById(p.id);
      return {
        id: p.id,
        display_name: p.display_name,
        email: data.user?.email ?? "unknown",
      };
    })
  );

  return NextResponse.json({ accounts });
}
