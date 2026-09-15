import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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
      { error: "Only school admins can reject accounts" },
      { status: 403 }
    );
  }

  const admin = createAdminClient();
  await admin.from("profiles").delete().eq("id", id);
  await admin.auth.admin.deleteUser(id);

  return NextResponse.json({ ok: true });
}
