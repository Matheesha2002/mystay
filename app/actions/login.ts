"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "../lib/supabase/server";

const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Please enter a valid email address."),
    password: z
        .string()
        .min(1, "Please enter your password."),
});

export type LoginState = {
    status: "idle" | "error";
    message: string;
};

export async function login(
    _previousState: LoginState,
    formData: FormData
): Promise<LoginState> {
    const result = loginSchema.safeParse({
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

    try {
        const supabase = await createClient();

        const { data, error } =
            await supabase.auth.signInWithPassword({
                email: result.data.email,
                password: result.data.password,
            });

        if (error) {
            if (error.code === "email_not_confirmed") {
                return {
                    status: "error",
                    message:
                        "Please confirm your email before logging in.",
                };
            }

            if (error.code === "over_request_rate_limit") {
                return {
                    status: "error",
                    message:
                        "Too many attempts. Please try again later.",
                };
            }

            return {
                status: "error",
                message:
                    "Unable to log in. Check your email and password and try again.",
            };
        }

        if (!data.session) {
            return {
                status: "error",
                message: "Unable to start your session. Please try again.",
            };
        }
    } catch {
        return {
            status: "error",
            message:
                "Unable to connect to the login service. Please try again.",
        };
    }

    // redirect එක try/catch එකෙන් පිටත තබනවා.
    redirect("/");
}