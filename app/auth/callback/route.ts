import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { createClient } from "../../lib/supabase/server";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");

    if (!code) {
        return new Response(
            "The confirmation link is missing or invalid.",
            {
                status: 400,
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    }

    try {
        const supabase = await createClient();

        const { error } =
            await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            return new Response(
                "Unable to complete sign-in. Open the latest confirmation link in the same browser used to register. If your email is already confirmed, sign in with your password.",
                {
                    status: 400,
                    headers: {
                        "Cache-Control": "no-store",
                    },
                }
            );
        }
    } catch {
        return new Response(
            "Unable to connect to the authentication service. Please try again.",
            {
                status: 503,
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    }

    redirect("/");
}