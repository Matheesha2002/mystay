"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabase/client";

export default function ResetPasswordForm({
    userId,
    email,
}: {
    userId: string;
    email: string;
}) {
    const [isPending, setIsPending] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isPending || isComplete) return;

        const form = event.currentTarget;
        const formData = new FormData(form);

        const password = String(formData.get("password") ?? "");
        const confirmPassword = String(
            formData.get("confirmPassword") ?? ""
        );

        setErrorMessage("");

        if (password.length < 8) {
            setErrorMessage("Use at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("The passwords do not match.");
            return;
        }

        setIsPending(true);

        try {
            const supabase = createClient();

            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser();

            if (authError || !user || user.id !== userId) {
                setErrorMessage(
                    "Your session has expired or changed. Please request a new reset link."
                );
                return;
            }

            const { error } = await supabase.auth.updateUser({
                password,
            });

            if (error) {
                setErrorMessage(error.message);
                return;
            }

            form.reset();
            setIsComplete(true);
        } catch {
            setErrorMessage(
                "Unable to confirm the password change. Try logging in with the new password before requesting another reset."
            );
        } finally {
            setIsPending(false);
        }
    }

    if (isComplete) {
        return (
            <div
                role="status"
                className="mt-8 rounded-xl bg-green-50 p-5 text-green-900"
            >
                <p className="font-semibold">
                    Password updated successfully
                </p>

                <p className="mt-2 text-sm">
                    Use your new password the next time you log in.
                </p>

                <Link
                    href="/"
                    className="mt-4 inline-block font-medium underline"
                >
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
            aria-busy={isPending}
        >
            <p className="break-all text-sm text-gray-600">
                Account: {email}
            </p>

            <div>
                <label
                    htmlFor="password"
                    className="mb-2 block font-medium"
                >
                    New password
                </label>

                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    disabled={isPending}
                    aria-describedby="password-help"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                />

                <p
                    id="password-help"
                    className="mt-2 text-sm text-gray-600"
                >
                    Use at least 8 characters.
                </p>
            </div>

            <div>
                <label
                    htmlFor="confirmPassword"
                    className="mb-2 block font-medium"
                >
                    Confirm new password
                </label>

                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
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
                {isPending ? "Saving…" : "Save new password"}
            </button>

            <Link
                href="/forgot-password"
                className="block text-center text-sm underline"
            >
                Request a new reset link
            </Link>
        </form>
    );
}