import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// One-time/reusable admin utility: streams the raw request body straight
// into the private `reference-assets` bucket using the service-role key
// that Supabase auto-injects into every Edge Function's runtime. The
// caller never needs to know or handle that key.
Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const bytes = new Uint8Array(await req.arrayBuffer());
  const contentType = req.headers.get("content-type") ?? "image/jpeg";

  const { error } = await supabase.storage
    .from("reference-assets")
    .upload("testimonial-reference.png", bytes, {
      contentType,
      upsert: true,
    });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true, bytes: bytes.length }), {
    headers: { "Content-Type": "application/json" },
  });
});
