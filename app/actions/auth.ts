"use server";

import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";
import { registerSchema } from "../lib/validation/auth";

export type RegisterState = {
    status: "idle" | "error" | "success";
    message: string;
};

export async function register(
    _previousState: RegisterState,
    formData: FormData
): Promise<RegisterState> {
    const result = registerSchema.safeParse({
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!result.success) {
        return {
            status: "error",
            message:
                result.error.issues[0]?.message ??
                "Please check your details.",
        };
    }

    const { fullName, email, password } = result.data;

    let hasSession = false;

    try {
        const siteUrl = process.env.SITE_URL;

        if (!siteUrl) {
            return {
                status: "error",
                message: "The site URL has not been configured.",
            };
        }

        const supabase = await createClient();

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: new URL(
                    "/auth/callback",
                    siteUrl
                ).toString(),
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) {
            const isRateLimited =
                error.code === "over_email_send_rate_limit" ||
                error.code === "over_request_rate_limit";

            return {
                status: "error",
                message: isRateLimited
                    ? "Too many attempts. Please try again later."
                    : "Unable to register. Check your details or try logging in if you already have an account.",
            };
        }

        hasSession = data.session !== null;
    } catch {
        return {
            status: "error",
            message:
                "Unable to connect to the sign-up service. Please try again.",
        };
    }

    if (hasSession) {
        redirect("/");
    }

    return {
        status: "success",
        message:
            "Check your inbox and spam folder for a confirmation email. Open the link in the same browser you used to register. If you already have an account, try logging in.",
    };
}