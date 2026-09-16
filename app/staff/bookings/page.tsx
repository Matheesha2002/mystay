import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { prisma } from "../../lib/prisma";
import { requireStaff } from "../../lib/staff";
import StaffBookingActions from "../../components/StaffBookingActions";

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    }).format(date);
}

export default async function StaffBookingsPage() {
    // Staff අවසර පරීක්ෂා කළ පසුව පමණක් bookings කියවනවා.
    await requireStaff();

    const bookings = await prisma.booking.findMany({
        where: {
            status: "PENDING",
        },
        orderBy: [
            { createdAt: "asc" },
            { id: "asc" },
        ],
        select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            roomTypeName: true,
            checkIn: true,
            checkOut: true,
            nights: true,
            guests: true,
            totalCost: true,

            roomType: {
                select: {
                    rooms: {
                        where: {
                            isActive: true,
                        },
                        select: {
                            id: true,
                            number: true,
                        },
                        orderBy: {
                            number: "asc",
                        },
                    },
                },
            },
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
                    Staff Booking Requests
                </h1>

                <p className="mt-4 text-lg">
                    Pending requests awaiting hotel review.
                </p>

                <p className="mt-2 text-sm text-gray-600">
                    {bookings.length} pending{" "}
                    {bookings.length === 1 ? "request" : "requests"}
                </p>

                {bookings.length === 0 ? (
                    <p className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
                        No pending booking requests.
                    </p>
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

                                    <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-900">
                                        Pending
                                    </span>
                                </div>

                                <p className="mt-3 break-all text-xs text-gray-500">
                                    Reference: {booking.id}
                                </p>

                                <div className="mt-6 space-y-2">
                                    <h3 className="font-semibold">
                                        Customer details
                                    </h3>

                                    <p>Name: {booking.fullName}</p>

                                    <p className="break-all">
                                        Email: {booking.email}
                                    </p>

                                    <p>Phone: {booking.phone}</p>
                                </div>

                                <div className="mt-6 space-y-2">
                                    <h3 className="font-semibold">
                                        Stay details
                                    </h3>

                                    <p>
                                        Check-in:{" "}
                                        {formatDate(booking.checkIn)}
                                    </p>

                                    <p>
                                        Check-out:{" "}
                                        {formatDate(booking.checkOut)}
                                    </p>

                                    <p>
                                        Nights: {booking.nights}
                                    </p>

                                    <p>
                                        Guests: {booking.guests}
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

                                <p className="mt-6 border-t border-gray-200 pt-4 text-xl font-bold">
                                    Total: LKR{" "}
                                    {booking.totalCost.toLocaleString("en-US")}
                                </p>

                                <StaffBookingActions
                                    bookingId={booking.id}
                                    rooms={booking.roomType.rooms}
                                />
                            </article>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}