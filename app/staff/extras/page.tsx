import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ExtraPriceForm from "../../components/ExtraPriceForm";
import { prisma } from "../../lib/prisma";
import { requireStaff } from "../../lib/staff";
import ExtraAvailabilityForm from "../../components/ExtraAvailabilityForm";

export default async function StaffExtrasPage() {
    await requireStaff();


    const [dinner, natureWalk] = await Promise.all([
        prisma.meal.findUnique({
            where: {
                slug: "dinner",
            },
            select: {
                id: true,
                name: true,
                description: true,
                pricePerGuestPerNight: true,
                isActive: true,
            },
        }),

        prisma.activity.findUnique({
            where: {
                slug: "guided-nature-walk",
            },
            select: {
                id: true,
                name: true,
                description: true,
                pricePerGuestPerSession: true,
                isActive: true,
            },
        }),
    ]);

    const extras = [
        ...(dinner
            ? [
                {
                    id: dinner.id,
                    kind: "meal" as const,
                    name: dinner.name,
                    description: dinner.description,
                    price: dinner.pricePerGuestPerNight,
                    unit: "per guest per night",
                    isActive: dinner.isActive,
                },
            ]
            : []),
        ...(natureWalk
            ? [
                {
                    id: natureWalk.id,
                    kind: "activity" as const,
                    name: natureWalk.name,
                    description: natureWalk.description,
                    price: natureWalk.pricePerGuestPerSession,
                    unit: "per guest per session",
                    isActive: natureWalk.isActive,
                },
            ]
            : []),
    ];

    return (
        <div className="flex min-h-screen flex-col bg-[#F8F6EF] text-[#173F35]">
            <Navbar />

            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
                <h1 className="text-4xl font-bold">
                    Extras Management
                </h1>

                <p className="mt-4 text-lg">
                    Update Dinner and Guided Nature Walk prices.
                </p>

                <nav
                    aria-label="Staff navigation"
                    className="mt-5 flex flex-wrap gap-4 text-sm font-medium"
                >
                    <Link href="/staff/bookings" className="underline">
                        Staff Bookings
                    </Link>

                    <Link href="/staff/rooms" className="underline">
                        Room Management
                    </Link>
                </nav>

                {(!dinner || !natureWalk) && (
                    <p className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
                        {!dinner && !natureWalk
                            ? "Dinner and Guided Nature Walk are missing."
                            : !dinner
                                ? "Dinner is missing."
                                : "Guided Nature Walk is missing."}{" "}
                        The missing item must be added before its price
                        can be managed.
                    </p>
                )}

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    {extras.map((extra) => (
                        <article
                            key={`${extra.kind}-${extra.id}`}
                            className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h2 className="text-2xl font-semibold">
                                    {extra.name}
                                </h2>

                                <span
                                    className={`rounded-full px-3 py-1 text-sm ${extra.isActive
                                            ? "bg-green-50 text-green-900"
                                            : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {extra.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>

                            <p className="mt-3 text-gray-600">
                                {extra.description}
                            </p>

                            <p className="mt-5 text-xl font-bold">
                                LKR {extra.price.toLocaleString("en-US")}
                            </p>

                            <p className="mt-1 text-sm text-gray-600">
                                {extra.unit}
                            </p>

                            {!extra.isActive && (
                                <p className="mt-3 text-sm text-amber-900">
                                    This item is currently hidden from
                                    the stay planner.
                                </p>
                            )}

                            <ExtraPriceForm
                                kind={extra.kind}
                                extraId={extra.id}
                                currentPrice={extra.price}
                            />

                            <ExtraAvailabilityForm
                                kind={extra.kind}
                                extraId={extra.id}
                                isActive={extra.isActive}
                            />
                        </article>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}