import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { createClient } from "../../lib/supabase/server";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");

    // Only this explicitly allowed destination can override Home.
    const isPasswordReset =
        request.nextUrl.searchParams.get("next") === "/reset-password";

    const destination = isPasswordReset ? "/reset-password" : "/";

    const headers = {
        "Cache-Control": "private, no-store",
    };

    if (!code) {
        return new Response(
            isPasswordReset
                ? "The reset link is missing, expired or invalid. Open /forgot-password and request a new link."
                : "The confirmation link is missing or invalid.",
            {
                status: 400,
                headers,
            }
        );
    }

    try {
        const supabase = await createClient();

        const { error } =
            await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            return new Response(
                isPasswordReset
                    ? "Unable to open this reset link. Request a new link from /forgot-password and open the latest email in the same browser and profile used to request it."
                    : "Unable to complete sign-in. Open the latest confirmation link in the same browser used to register. If your email is already confirmed, sign in with your password.",
                {
                    status: 400,
                    headers,
                }
            );
        }
    } catch {
        return new Response(
            "Unable to connect to the authentication service. Please try again.",
            {
                status: 503,
                headers,
            }
        );
    }

    redirect(destination);
}