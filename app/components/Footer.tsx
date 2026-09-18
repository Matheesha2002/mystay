// export default function Footer() {
//   return (
//     <footer className="bg-[#173F35] px-6 py-8 text-center text-white">
//       <p className="text-xl font-semibold">MyStay</p>

//       <p className="mt-2 text-sm text-white/75">
//         Your stay, your way.
//       </p>
//     </footer>
//   );
// }

import Link from "next/link";

const footerLinks = [
    { href: "/", label: "Home" },
    { href: "/rooms", label: "Rooms" },
    { href: "/plan-my-stay", label: "Plan My Stay" },
];

export default function Footer() {
    return (
        <footer className="relative isolate overflow-hidden bg-[#173F35] text-[#F8F6EF]">
            {/* Decorative botanical illustration */}
            <svg
                aria-hidden="true"
                viewBox="0 0 240 300"
                fill="none"
                className="pointer-events-none absolute -bottom-10 -right-8 -z-10 h-72 w-56 text-[#C9B98D]/15"
                stroke="currentColor"
                strokeWidth="1"
            >
                <path d="M110 300C115 220 145 120 200 20" />
                <path d="M130 225C75 220 42 180 35 130C91 141 126 174 130 225Z" />
                <path d="M151 168C108 149 92 108 99 68C142 89 158 124 151 168Z" />
                <path d="M172 118C164 76 178 42 212 15C221 60 207 95 172 118Z" />
                <path d="M140 195C192 185 223 156 234 112C182 122 151 150 140 195Z" />
                <path d="M119 268C172 263 209 239 228 198C174 200 138 224 119 268Z" />
                <path d="M130 225L35 130M151 168L99 68M172 118L212 15M140 195L234 112M119 268L228 198" />
            </svg>

            <div className="mx-auto max-w-6xl px-6 pb-6 pt-12">
                <div className="grid gap-9 md:grid-cols-[1fr_auto_1fr] md:items-center">
                    <div>
                        <Link
                            href="/"
                            aria-label="MyStay home"
                            className="hotel-heading inline-block rounded-sm text-4xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E3D2A7]"
                        >
                            MyStay
                        </Link>

                        <p className="mt-4 text-[10px] uppercase leading-6 tracking-[0.25em] text-[#E3D2A7]">
                            A little escape
                            <br />
                            in Sri Lanka
                        </p>
                    </div>

                    <nav
                        aria-label="Footer navigation"
                        className="flex flex-wrap gap-x-7 gap-y-2"
                    >
                        {footerLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="inline-flex min-h-11 items-center rounded-sm text-sm text-white/85 hover:text-white hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E3D2A7]"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="md:text-right">
                        <p className="hotel-heading text-2xl leading-snug text-[#E3D2A7]">
                            Good stays.
                            <br />
                            Brighter days.
                        </p>

                        <p className="mt-3 text-xs text-white/70">
                            Your stay, your way.
                        </p>
                    </div>
                </div>

                <div className="mt-9 flex flex-col gap-3 border-t border-white/15 pt-5 text-xs leading-6 text-white/65 sm:flex-row sm:items-center sm:justify-between">
                    <p>MyStay · Thoughtfully planned, personally yours.</p>

                    <p>Booking requests are subject to hotel approval.</p>
                </div>
            </div>
        </footer>
    );
}