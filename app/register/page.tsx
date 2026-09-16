"use client";

import { useActionState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { register, type RegisterState } from "../actions/auth";

const initialState: RegisterState = {
    status: "idle",
    message: "",
};

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(
        register,
        initialState
    );

    const inputClassName =
        "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#173F35]";

    return (
        <div className="flex min-h-screen flex-col bg-[#F8F6EF] text-[#173F35]">
            <Navbar />

            <main className="mx-auto w-full max-w-md flex-1 px-6 py-16">
                <h1 className="text-4xl font-bold">
                    Create your account
                </h1>

                <p className="mt-4 text-gray-600">
                    Register to request a stay and manage your bookings.
                </p>

                <form action={formAction} className="mt-8 space-y-5">
                    <div>
                        <label
                            htmlFor="fullName"
                            className="mb-2 block font-medium"
                        >
                            Full name
                        </label>

                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            autoComplete="name"
                            required
                            maxLength={100}
                            className={inputClassName}
                        />
                    </div>

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
                            required
                            className={inputClassName}
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
                            autoComplete="new-password"
                            required
                            minLength={8}
                            maxLength={128}
                            aria-describedby="password-help"
                            className={inputClassName}
                        />

                        <p
                            id="password-help"
                            className="mt-2 text-sm text-gray-600"
                        >
                            Use at least 8 characters.
                        </p>
                    </div>

                    {state.message && (
                        <p
                            role={state.status === "error" ? "alert" : "status"}
                            className={
                                state.status === "error"
                                    ? "text-sm text-red-700"
                                    : "text-sm text-green-800"
                            }
                        >
                            {state.message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full rounded-lg bg-[#173F35] px-5 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isPending ? "Creating account..." : "Create Account"}
                    </button>
                </form>
            </main>

            <Footer />
        </div>
    );
}