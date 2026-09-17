"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createClient } from "../lib/supabase/client";

export default function ForgotPasswordPage() {
    const [isPending, setIsPending] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isPending || isSent) return;

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") ?? "").trim();

        if (!email) {
            setErrorMessage("Please enter your email address.");
            return;
        }

        setIsPending(true);
        setErrorMessage("");

        try {
            const supabase = createClient();

            const { error } = await supabase.auth.resetPasswordForEmail(
                email,
                {
                    redirectTo:
                        `${window.location.origin}/auth/callback` +
                        "?next=/reset-password",
                }
            );

            if (error) {
                setErrorMessage(
                    error.status === 429
                        ? "Too many requests. Please wait before trying again."
                        : "Unable to request a reset email. Please try again later."
                );
                return;
            }

            setIsSent(true);
        } catch {
            setErrorMessage(
                "Unable to connect. Please check your connection and try again."
            );
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-[#F8F6EF] text-[#173F35]">
            <Navbar />

            <main className="mx-auto w-full max-w-md flex-1 px-6 py-16">
                <h1 className="text-4xl font-bold">
                    Forgot password?
                </h1>

                <p className="mt-4 text-gray-600">
                    Enter your account email to request a password reset link.
                </p>

                {isSent ? (
                    <div
                        role="status"
                        className="mt-8 rounded-xl bg-green-50 p-5 text-green-900"
                    >
                        <p className="font-semibold">
                            Check your email
                        </p>

                        <p className="mt-2 text-sm">
                            If an eligible account exists for this address,
                            you will receive a password reset link.
                        </p>

                        <p className="mt-3 text-sm">
                            Check your inbox and spam folder. Open the latest
                            link in this same browser and browser profile.
                        </p>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-6"
                        aria-busy={isPending}
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block font-medium"
                            >
                                Email address
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                maxLength={254}
                                required
                                disabled={isPending}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                            />
                        </div>

                        {errorMessage && (
                            <p
                                role="alert"
                                className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                            >
                                {errorMessage}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full rounded-lg bg-[#173F35] px-5 py-3 font-medium text-white hover:bg-[#245548] disabled:opacity-50"
                        >
                            {isPending ? "Sending…" : "Send reset link"}
                        </button>
                    </form>
                )}

                <Link
                    href="/login"
                    className="mt-6 inline-block text-sm font-medium underline"
                >
                    Back to login
                </Link>
            </main>

            <Footer />
        </div>
    );
}