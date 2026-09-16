// import Link from "next/link";

// export default function Navbar() {
//     return (
//         <header className="border-b border-[#173F35]/15">
//             <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
//                 <Link href="/" className="text-3xl font-bold">
//                     MyStay
//                 </Link>

//                 <Link
//                     href="/rooms"
//                     className="font-medium hover:underline"
//                 >
//                     Rooms
//                 </Link>

//                 <Link
//                     href="/plan-my-stay"
//                     className="rounded-lg bg-[#173F35] px-5 py-3 text-sm font-medium text-white"
//                 >
//                     Plan My Stay
//                 </Link>
//             </nav>
//         </header>
//     );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "../lib/supabase/client";

export default function Navbar() {
    const pathname = usePathname();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isStaff, setIsStaff] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const supabase = createClient();

        let disposed = false;
        let staffController: AbortController | null = null;

        async function checkStaff(controller: AbortController) {
            try {
                const response = await fetch("/api/auth/staff", {
                    cache: "no-store",
                    credentials: "same-origin",
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error("Unable to check staff access.");
                }

                const data: { isStaff?: boolean } =
                    await response.json();

                if (!disposed && !controller.signal.aborted) {
                    setIsStaff(data.isStaff === true);
                }
            } catch {
                if (!disposed && !controller.signal.aborted) {
                    setIsStaff(false);
                }
            }
        }

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (disposed) return;

            // කලින් account එක සඳහා කළ request එක නවත්වනවා.
            staffController?.abort();

            setIsLoggedIn(session !== null);
            setIsLoading(false);
            setIsStaff(false);

            if (session) {
                staffController = new AbortController();
                void checkStaff(staffController);
            }
        });

        return () => {
            disposed = true;
            staffController?.abort();
            subscription.unsubscribe();
        };
    }, [pathname]);

    async function handleLogout() {
        if (isLoggingOut) return;

        setIsLoggingOut(true);
        setErrorMessage("");

        try {
            const supabase = createClient();

            const { error } = await supabase.auth.signOut({
                scope: "local",
            });

            if (error) {
                setErrorMessage("Unable to log out. Please try again.");
                setIsLoggingOut(false);
                return;
            }

            setIsStaff(false);
            setIsLoggedIn(false);

            window.location.assign("/");
        } catch {
            setErrorMessage("Unable to connect. Please try again.");
            setIsLoggingOut(false);
        }
    }

    return (
        <header className="border-b border-[#173F35]/15 text-[#173F35]">
            <nav
                aria-label="Main navigation"
                className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5"
            >
                <Link href="/" className="text-3xl font-bold">
                    MyStay
                </Link>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <Link
                        href="/rooms"
                        className="font-medium hover:underline"
                    >
                        Rooms
                    </Link>

                    {!isLoading && isLoggedIn && (
                        <Link
                            href="/my-bookings"
                            className="font-medium hover:underline"
                        >
                            My Bookings
                        </Link>
                    )}

                    {!isLoading && isLoggedIn && isStaff && (
                        <Link
                            href="/staff/bookings"
                            className="font-medium hover:underline"
                        >
                            Staff Bookings
                        </Link>
                    )}

                    <Link
                        href="/plan-my-stay"
                        className="rounded-lg bg-[#173F35] px-5 py-3 text-sm font-medium text-white hover:bg-[#245548]"
                    >
                        Plan My Stay
                    </Link>

                    {isLoading ? (
                        <span
                            role="status"
                            className="text-sm text-gray-500"
                        >
                            Loading…
                        </span>
                    ) : isLoggedIn ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="rounded-lg border border-[#173F35] px-4 py-2 text-sm font-medium hover:bg-[#173F35]/5 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isLoggingOut ? "Logging out…" : "Log out"}
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="font-medium hover:underline"
                        >
                            Log in
                        </Link>
                    )}
                </div>
            </nav>

            {errorMessage && (
                <p
                    role="alert"
                    className="mx-auto max-w-6xl px-6 pb-4 text-sm text-red-700"
                >
                    {errorMessage}
                </p>
            )}
        </header>
    );
}