import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Public, unauthenticated endpoint — only exposes id + name for the
// registration form's club dropdown. No sensitive fields.
export async function GET() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("clubs")
    .select("id, name")
    .order("name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ clubs: data ?? [] });
}
