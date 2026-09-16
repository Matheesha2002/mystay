import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { createClient } from "../../lib/supabase/server";

export async function GET(request: NextRequest) {
    const tokenHash = request.nextUrl.searchParams.get("token_hash");
    const type = request.nextUrl.searchParams.get("type");

    if (!tokenHash || type !== "email") {
        return new Response("Invalid confirmation link.", {
            status: 400,
            headers: {
                "Cache-Control": "no-store",
            },
        });
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: "email",
    });

    if (error) {
        return new Response(
            "This confirmation link is invalid or expired. It may already have been used.",
            {
                status: 400,
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    }

    redirect("/");
}