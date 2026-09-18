// "use client";

// import { useEffect, useId, useRef, useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { createClient } from "../lib/supabase/client";

// export default function Navbar() {
//     const pathname = usePathname();

//     // Route එක වෙනස් වුණාම mobile menu එකත් reset වෙනවා.
//     return <NavbarContent key={pathname} />;
// }

// function NavbarContent() {
//     const menuId = useId();
//     const menuButtonRef = useRef<HTMLButtonElement>(null);

//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [isStaff, setIsStaff] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isLoggingOut, setIsLoggingOut] = useState(false);
//     const [errorMessage, setErrorMessage] = useState("");

//     useEffect(() => {
//         const supabase = createClient();

//         let disposed = false;
//         let staffController: AbortController | null = null;

//         async function checkStaff(controller: AbortController) {
//             try {
//                 const response = await fetch("/api/auth/staff", {
//                     cache: "no-store",
//                     credentials: "same-origin",
//                     signal: controller.signal,
//                 });

//                 if (!response.ok) {
//                     throw new Error("Unable to check staff access.");
//                 }

//                 const data: { isStaff?: boolean } =
//                     await response.json();

//                 if (!disposed && !controller.signal.aborted) {
//                     setIsStaff(data.isStaff === true);
//                 }
//             } catch {
//                 if (!disposed && !controller.signal.aborted) {
//                     setIsStaff(false);
//                 }
//             }
//         }

//         const {
//             data: { subscription },
//         } = supabase.auth.onAuthStateChange((_event, session) => {
//             if (disposed) return;

//             staffController?.abort();

//             setIsLoggedIn(session !== null);
//             setIsLoading(false);
//             setIsStaff(false);

//             if (session) {
//                 staffController = new AbortController();
//                 void checkStaff(staffController);
//             }
//         });

//         return () => {
//             disposed = true;
//             staffController?.abort();
//             subscription.unsubscribe();
//         };
//     }, []);

//     useEffect(() => {
//         if (!isMenuOpen) return;

//         function handleEscape(event: KeyboardEvent) {
//             if (event.key === "Escape") {
//                 setIsMenuOpen(false);
//                 menuButtonRef.current?.focus();
//             }
//         }

//         document.addEventListener("keydown", handleEscape);

//         return () => {
//             document.removeEventListener("keydown", handleEscape);
//         };
//     }, [isMenuOpen]);

//     function closeMenu() {
//         setIsMenuOpen(false);
//     }

//     async function handleLogout() {
//         if (isLoggingOut) return;

//         setIsLoggingOut(true);
//         setErrorMessage("");

//         try {
//             const supabase = createClient();

//             const { error } = await supabase.auth.signOut({
//                 scope: "local",
//             });

//             if (error) {
//                 setErrorMessage("Unable to log out. Please try again.");
//                 setIsLoggingOut(false);
//                 return;
//             }

//             setIsStaff(false);
//             setIsLoggedIn(false);
//             setIsMenuOpen(false);

//             window.location.assign("/");
//         } catch {
//             setErrorMessage("Unable to connect. Please try again.");
//             setIsLoggingOut(false);
//         }
//     }

//     const linkClass =
//         "flex min-h-11 items-center rounded-lg px-3 py-2 " +
//         "font-medium hover:bg-[#173F35]/5 " +
//         "focus-visible:outline-2 focus-visible:outline-offset-2 " +
//         "focus-visible:outline-[#173F35] lg:px-0 lg:hover:underline";

//     return (
//         <header className="border-b border-[#173F35]/15 bg-[#F8F6EF] text-[#173F35]">
//             <nav
//                 aria-label="Main navigation"
//                 className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 px-6 py-4 lg:py-5"
//             >
//                 <Link
//                     href="/"
//                     onClick={closeMenu}
//                     className="rounded text-3xl font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#173F35]"
//                 >
//                     MyStay
//                 </Link>

//                 <button
//                     ref={menuButtonRef}
//                     type="button"
//                     aria-expanded={isMenuOpen}
//                     aria-controls={menuId}
//                     aria-label={
//                         isMenuOpen
//                             ? "Close navigation menu"
//                             : "Open navigation menu"
//                     }
//                     onClick={() => setIsMenuOpen((open) => !open)}
//                     className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#173F35]/30 px-3 py-2 text-sm font-semibold hover:bg-[#173F35]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173F35] lg:hidden"
//                 >
//                     <svg
//                         width="20"
//                         height="20"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         aria-hidden="true"
//                     >
//                         {isMenuOpen ? (
//                             <>
//                                 <path d="M6 6l12 12" />
//                                 <path d="M18 6L6 18" />
//                             </>
//                         ) : (
//                             <>
//                                 <path d="M4 6h16" />
//                                 <path d="M4 12h16" />
//                                 <path d="M4 18h16" />
//                             </>
//                         )}
//                     </svg>

//                     {isMenuOpen ? "Close" : "Menu"}
//                 </button>

//                 <div
//                     id={menuId}
//                     className={`${
//                         isMenuOpen ? "flex" : "hidden"
//                     } mt-4 w-full flex-col gap-2 border-t border-[#173F35]/15 pt-4 lg:mt-0 lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-6 lg:border-0 lg:pt-0`}
//                 >
//                     <Link
//                         href="/rooms"
//                         onClick={closeMenu}
//                         className={linkClass}
//                     >
//                         Rooms
//                     </Link>

//                     {!isLoading && isLoggedIn && (
//                         <Link
//                             href="/my-bookings"
//                             onClick={closeMenu}
//                             className={linkClass}
//                         >
//                             My Bookings
//                         </Link>
//                     )}

//                     {!isLoading && isLoggedIn && isStaff && (
//                         <Link
//                             href="/staff/bookings"
//                             onClick={closeMenu}
//                             className={linkClass}
//                         >
//                             Staff Bookings
//                         </Link>
//                     )}

//                     <Link
//                         href="/plan-my-stay"
//                         onClick={closeMenu}
//                         className="flex min-h-11 items-center justify-center rounded-lg bg-[#173F35] px-5 py-3 text-sm font-medium text-white hover:bg-[#245548] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173F35]"
//                     >
//                         Plan My Stay
//                     </Link>

//                     {isLoading ? (
//                         <span
//                             role="status"
//                             className="px-3 py-2 text-sm text-gray-500"
//                         >
//                             Loading…
//                         </span>
//                     ) : isLoggedIn ? (
//                         <button
//                             type="button"
//                             onClick={handleLogout}
//                             disabled={isLoggingOut}
//                             className="min-h-11 rounded-lg border border-[#173F35] px-4 py-2 text-sm font-medium hover:bg-[#173F35]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173F35] disabled:cursor-not-allowed disabled:opacity-50"
//                         >
//                             {isLoggingOut ? "Logging out…" : "Log out"}
//                         </button>
//                     ) : (
//                         <Link
//                             href="/login"
//                             onClick={closeMenu}
//                             className={linkClass}
//                         >
//                             Log in
//                         </Link>
//                     )}
//                 </div>
//             </nav>

//             {errorMessage && (
//                 <p
//                     role="alert"
//                     className="mx-auto max-w-6xl px-6 pb-4 text-sm text-red-700"
//                 >
//                     {errorMessage}
//                 </p>
//             )}
//         </header>
//     );
// }

"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "../lib/supabase/client";

export default function Navbar() {
    const pathname = usePathname();

    // Route එක වෙනස් වුණාම mobile menu එක reset කරනවා.
    return <NavbarContent key={pathname} />;
}

function NavbarContent() {
    const pathname = usePathname();
    const menuId = useId();
    const menuButtonRef = useRef<HTMLButtonElement>(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    }, []);

    useEffect(() => {
        if (!isMenuOpen) return;

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsMenuOpen(false);
                menuButtonRef.current?.focus();
            }
        }

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isMenuOpen]);

    function closeMenu() {
        setIsMenuOpen(false);
    }

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
            setIsMenuOpen(false);

            window.location.assign("/");
        } catch {
            setErrorMessage("Unable to connect. Please try again.");
            setIsLoggingOut(false);
        }
    }

    const linkClass =
        "flex min-h-11 items-center rounded-md px-3 py-2 " +
        "text-sm font-medium transition-colors hover:bg-[#173F35]/5 " +
        "focus-visible:outline-2 focus-visible:outline-offset-4 " +
        "focus-visible:outline-[#173F35] lg:px-0 lg:hover:bg-transparent";

    function isActive(href: string) {
        return href === "/"
            ? pathname === "/"
            : pathname === href || pathname.startsWith(`${href}/`);
    }

    const navigationLinks = [
        { href: "/", label: "Home" },
        { href: "/rooms", label: "Rooms" },
        ...(isLoggedIn && !isLoading
            ? [{ href: "/my-bookings", label: "My Bookings" }]
            : []),
        ...(isLoggedIn && isStaff && !isLoading
            ? [{ href: "/staff/bookings", label: "Staff Bookings" }]
            : []),
    ];

    return (
        <header className="relative z-30 border-b border-[#173F35]/10 bg-[#FFFEFA] text-[#173F35]">
            <nav
                aria-label="Main navigation"
                className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 px-6 py-3 lg:py-4"
            >
                <Link
                    href="/"
                    onClick={closeMenu}
                    aria-label="MyStay home"
                    className="hotel-heading rounded-sm text-4xl leading-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#173F35]"
                >
                    MyStay
                </Link>

                <button
                    ref={menuButtonRef}
                    type="button"
                    aria-expanded={isMenuOpen}
                    aria-controls={menuId}
                    aria-label={
                        isMenuOpen
                            ? "Close navigation menu"
                            : "Open navigation menu"
                    }
                    onClick={() => setIsMenuOpen((open) => !open)}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#173F35]/20 px-3 py-2 text-sm hover:bg-[#173F35]/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#173F35] lg:hidden"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        aria-hidden="true"
                    >
                        {isMenuOpen ? (
                            <>
                                <path d="M6 6l12 12" />
                                <path d="M18 6L6 18" />
                            </>
                        ) : (
                            <>
                                <path d="M4 7h16" />
                                <path d="M4 12h16" />
                                <path d="M4 17h16" />
                            </>
                        )}
                    </svg>

                    {isMenuOpen ? "Close" : "Menu"}
                </button>

                <div
                    id={menuId}
                    className={`${
                        isMenuOpen ? "flex" : "hidden"
                    } mt-3 w-full flex-col gap-2 border-t border-[#173F35]/10 pb-2 pt-3 lg:mt-0 lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-7 lg:border-0 lg:p-0`}
                >
                    {navigationLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={closeMenu}
                            aria-current={
                                isActive(link.href) ? "page" : undefined
                            }
                            className={linkClass}
                        >
                            <span
                                className={`border-b pb-1 ${
                                    isActive(link.href)
                                        ? "border-[#9A8358]"
                                        : "border-transparent"
                                }`}
                            >
                                {link.label}
                            </span>
                        </Link>
                    ))}

                    {isLoading ? (
                        <span
                            role="status"
                            className="px-3 py-2 text-xs text-[#66716A] lg:px-0"
                        >
                            Loading…
                        </span>
                    ) : isLoggedIn ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className={`${linkClass} disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                            {isLoggingOut ? "Logging out…" : "Log out"}
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            onClick={closeMenu}
                            aria-current={
                                pathname === "/login" ? "page" : undefined
                            }
                            className={linkClass}
                        >
                            Log in
                        </Link>
                    )}

                    <Link
                        href="/plan-my-stay"
                        onClick={closeMenu}
                        aria-current={
                            pathname === "/plan-my-stay"
                                ? "page"
                                : undefined
                        }
                        className="hotel-button mt-2 lg:mt-0"
                    >
                        Plan My Stay
                        <span aria-hidden="true">→</span>
                    </Link>
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