import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { prisma } from "../lib/prisma";
import { createClient } from "../lib/supabase/server";

const statusLabels = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    DECLINED: "Declined",
    CANCELLED: "Cancelled",
};

const statusColors = {
    PENDING: "bg-amber-100 text-amber-900",
    CONFIRMED: "bg-green-100 text-green-800",
    DECLINED: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-700",
};

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    }).format(date);
}

export default async function MyBookingsPage() {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    // Login නොවූ අය Login page එකට යවනවා.
    if (error || !user) {
        redirect("/login");
    }

    // මේ userගේ bookings පමණක් ලබාගන්නවා.
    const bookings = await prisma.booking.findMany({
        where: {
            userId: user.id,
        },
        orderBy: [
            { createdAt: "desc" },
            { id: "desc" },
        ],
        select: {
            id: true,
            status: true,
            roomTypeName: true,
            checkIn: true,
            checkOut: true,
            nights: true,
            guests: true,
            breakfastIncluded: true,
            roomCost: true,
            mealCost: true,
            activityCost: true,
            totalCost: true,
            declineReason: true,
            meals: {
                select: {
                    id: true,
                    name: true,
                },
            },
            activities: {
                select: {
                    id: true,
                    name: true,
                    sessions: true,
                },
            },
        },
    });

    return (
        <div className="flex min-h-screen flex-col bg-[#F8F6EF] text-[#173F35]">
            <Navbar />

            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
                <h1 className="text-4xl font-bold">
                    My Bookings
                </h1>

                <p className="mt-4 text-lg">
                    View your booking requests and their current status.
                </p>

                {bookings.length === 0 ? (
                    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
                        <h2 className="text-xl font-semibold">
                            No booking requests yet
                        </h2>

                        <p className="mt-3 text-gray-600">
                            Choose your room, meals and activities to
                            plan your first stay.
                        </p>

                        <Link
                            href="/plan-my-stay"
                            className="mt-6 inline-block rounded-lg bg-[#173F35] px-5 py-3 font-medium text-white"
                        >
                            Plan My Stay
                        </Link>
                    </section>
                ) : (
                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                        {bookings.map((booking) => (
                            <article
                                key={booking.id}
                                className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <h2 className="text-2xl font-semibold">
                                        {booking.roomTypeName}
                                    </h2>

                                    <span
                                        className={`rounded-full px-3 py-1 text-sm font-medium ${statusColors[booking.status]}`}
                                    >
                                        {statusLabels[booking.status]}
                                    </span>
                                </div>

                                <p className="mt-3 break-all text-xs text-gray-500">
                                    Reference: {booking.id}
                                </p>

                                <div className="mt-6 space-y-2">
                                    <p>
                                        Check-in:{" "}
                                        {formatDate(booking.checkIn)}
                                    </p>

                                    <p>
                                        Check-out:{" "}
                                        {formatDate(booking.checkOut)}
                                    </p>

                                    <p>
                                        {booking.nights}{" "}
                                        {booking.nights === 1
                                            ? "night"
                                            : "nights"}{" "}
                                        · {booking.guests}{" "}
                                        {booking.guests === 1
                                            ? "guest"
                                            : "guests"}{" "}
                                        · 1 room
                                    </p>

                                    <p>
                                        {booking.breakfastIncluded
                                            ? "Breakfast included"
                                            : "Breakfast not included"}
                                    </p>
                                </div>

                                <div className="mt-6">
                                    <h3 className="font-semibold">
                                        Selected extras
                                    </h3>

                                    {booking.meals.length === 0 &&
                                    booking.activities.length === 0 ? (
                                        <p className="mt-2 text-sm text-gray-600">
                                            No extras selected.
                                        </p>
                                    ) : (
                                        <ul className="mt-2 list-disc space-y-1 pl-5">
                                            {booking.meals.map((meal) => (
                                                <li key={meal.id}>
                                                    {meal.name}
                                                </li>
                                            ))}

                                            {booking.activities.map(
                                                (activity) => (
                                                    <li key={activity.id}>
                                                        {activity.name}
                                                        {" · "}
                                                        {activity.sessions}{" "}
                                                        {activity.sessions === 1
                                                            ? "session"
                                                            : "sessions"}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </div>

                                <div className="mt-6 space-y-2 border-t border-gray-200 pt-4">
                                    <p>
                                        Room: LKR{" "}
                                        {booking.roomCost.toLocaleString("en-US")}
                                    </p>

                                    <p>
                                        Meals: LKR{" "}
                                        {booking.mealCost.toLocaleString("en-US")}
                                    </p>

                                    <p>
                                        Activities: LKR{" "}
                                        {booking.activityCost.toLocaleString("en-US")}
                                    </p>

                                    <p className="pt-2 text-xl font-bold">
                                        Total: LKR{" "}
                                        {booking.totalCost.toLocaleString("en-US")}
                                    </p>
                                </div>

                                {booking.status === "PENDING" && (
                                    <p className="mt-4 text-sm text-amber-900">
                                        Your request is awaiting hotel
                                        staff review. Your booking is
                                        not confirmed yet.
                                    </p>
                                )}

                                {booking.status === "CONFIRMED" && (
                                    <p className="mt-4 text-sm text-green-800">
                                        Your booking has been confirmed
                                        by the hotel.
                                    </p>
                                )}

                                {booking.status === "DECLINED" && (
                                    <p className="mt-4 text-sm text-red-800">
                                        {booking.declineReason
                                            ? `Reason: ${booking.declineReason}`
                                            : "The hotel could not accept this request."}
                                    </p>
                                )}

                                {booking.status === "CANCELLED" && (
                                    <p className="mt-4 text-sm text-gray-600">
                                        This booking has been cancelled.
                                    </p>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}