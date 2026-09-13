import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const { responseId } = await req.json();

  if (!responseId) {
    return NextResponse.json({ error: "responseId is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // RLS enforces that this row is only visible to the school admin
  // or the requesting club's admin — no manual authorization needed here.
  const { data: response, error } = await supabase
    .from("responses")
    .select("digital_signature_path")
    .eq("id", responseId)
    .single();

  if (error || !response) {
    return NextResponse.json({ error: "Response not found" }, { status: 404 });
  }

  if (!response.digital_signature_path) {
    return NextResponse.json({ error: "No signature on file" }, { status: 404 });
  }

  const admin = createAdminClient();
  const { data: signed, error: signError } = await admin.storage
    .from("digital-signatures")
    .createSignedUrl(response.digital_signature_path, 60);

  if (signError || !signed) {
    return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 });
  }

  return NextResponse.json({ url: signed.signedUrl });
}
