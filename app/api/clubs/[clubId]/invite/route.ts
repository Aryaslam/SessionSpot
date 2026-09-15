import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_ACCOUNTS_PER_CLUB = 5;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ clubId: string }> }
) {
  const { clubId } = await params;
  const { email, displayName } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

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
      { error: "Only school admins can invite accounts" },
      { status: 403 }
    );
  }

  const admin = createAdminClient();

  const { count, error: countError } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("club_id", clubId);

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }
  if ((count ?? 0) >= MAX_ACCOUNTS_PER_CLUB) {
    return NextResponse.json(
      { error: `This club already has the maximum of ${MAX_ACCOUNTS_PER_CLUB} accounts.` },
      { status: 400 }
    );
  }

  const redirectTo = `${new URL(req.url).origin}/club-admin/set-password`;
  const { data: inviteData, error: inviteError } =
    await admin.auth.admin.inviteUserByEmail(email, { redirectTo });

  if (inviteError || !inviteData.user) {
    return NextResponse.json(
      { error: inviteError?.message ?? "Failed to send invite" },
      { status: 400 }
    );
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: inviteData.user.id,
    display_name: displayName?.trim() || email,
    role: "club_admin",
    club_id: clubId,
  });

  if (profileError) {
    // Don't leave an orphaned auth user with no profile if this fails.
    await admin.auth.admin.deleteUser(inviteData.user.id);
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, email });
}
