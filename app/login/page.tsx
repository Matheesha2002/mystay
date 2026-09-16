"use client";

import { useActionState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { login, type LoginState } from "../actions/login";

const initialState: LoginState = {
    status: "idle",
    message: "",
};

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(
        login,
        initialState
    );

    return (
        <div className="flex min-h-screen flex-col bg-[#F8F6EF] text-[#173F35]">
            <Navbar />

            <main className="mx-auto w-full max-w-md flex-1 px-6 py-16">
                <h1 className="text-4xl font-bold">
                    Welcome back
                </h1>

                <p className="mt-4 text-gray-600">
                    Log in to your MyStay account.
                </p>

                <form
                    action={formAction}
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
                            placeholder="you@example.com"
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#173F35]"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block font-medium"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#173F35]"
                        />
                    </div>

                    {state.status === "error" && (
                        <p
                            role="alert"
                            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                        >
                            {state.message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full rounded-lg bg-[#173F35] px-5 py-3 font-medium text-white hover:bg-[#245548] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isPending ? "Logging in..." : "Log in"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="font-medium text-[#173F35] underline"
                    >
                        Create an account
                    </Link>
                </p>
            </main>

            <Footer />
        </div>
    );
}