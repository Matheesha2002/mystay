import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { prisma } from "../../lib/prisma";
import { requireStaff } from "../../lib/staff";
import StaffBookingActions from "../../components/StaffBookingActions";

const statusOptions = [
    {
        value: "PENDING",
        label: "Pending",
        badgeClass: "bg-amber-100 text-amber-900",
        description: "Booking requests awaiting hotel review.",
        emptyMessage: "No pending booking requests.",
    },
    {
        value: "CONFIRMED",
        label: "Confirmed",
        badgeClass: "bg-green-100 text-green-900",
        description: "Bookings confirmed by the hotel.",
        emptyMessage: "No confirmed bookings yet.",
    },
    {
        value: "DECLINED",
        label: "Declined",
        badgeClass: "bg-red-100 text-red-900",
        description: "Booking requests declined by the hotel.",
        emptyMessage: "No declined bookings.",
    },
    {
        value: "CANCELLED",
        label: "Cancelled",
        badgeClass: "bg-gray-100 text-gray-700",
        description: "Bookings cancelled by customers.",
        emptyMessage: "No cancelled bookings.",
    },
] as const;

type PageProps = {
    searchParams: Promise<{
        status?: string | string[];
    }>;
};

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    }).format(date);
}

export default async function StaffBookingsPage({
    searchParams,
}: PageProps) {
    // අවසර පරීක්ෂා කළ පසුව පමණක් bookings කියවනවා.
    await requireStaff();

    const params = await searchParams;

    // නොගැළපෙන status එකක් ආවොත් Pending පෙන්වනවා.
    const selectedOption =
        statusOptions.find((option) => option.value === params.status) ??
        statusOptions[0];

    const selectedStatus = selectedOption.value;

    const bookings = await prisma.booking.findMany({
        where: {
            status: selectedStatus,
        },
        orderBy: [
            {
                createdAt:
                    selectedStatus === "PENDING" ? "asc" : "desc",
            },
            { id: "asc" },
        ],
        select: {
            id: true,
            status: true,
            createdAt: true,
            fullName: true,
            email: true,
            phone: true,
            roomTypeName: true,
            checkIn: true,
            checkOut: true,
            nights: true,
            guests: true,
            totalCost: true,
            declineReason: true,
            room: {
                select: {
                    number: true,
                },
            },
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
                    Staff Bookings
                </h1>

                <Link
                    href="/staff/rooms"
                    className="mt-4 inline-block rounded-lg border border-[#173F35] px-4 py-2 text-sm font-semibold hover:bg-[#173F35]/5"
                >
                    Manage rooms
                </Link>

                <Link
                    href="/staff/extras"
                    className="mt-4 ml-3 inline-block rounded-lg border border-[#173F35] px-4 py-2 text-sm font-semibold hover:bg-[#173F35]/5"
                >
                    Manage extras
                </Link>

                <p className="mt-4 text-lg">
                    Review new requests and view booking history.
                </p>

                <nav
                    aria-label="Booking status filters"
                    className="mt-8 flex flex-wrap gap-3"
                >
                    {statusOptions.map((option) => {
                        const isSelected =
                            option.value === selectedStatus;

                        return (
                            <Link
                                key={option.value}
                                href={`/staff/bookings?status=${option.value}`}
                                aria-current={
                                    isSelected ? "page" : undefined
                                }
                                className={`rounded-lg border px-5 py-3 text-sm font-semibold transition-colors ${isSelected
                                    ? "border-[#173F35] bg-[#173F35] text-white"
                                    : "border-[#173F35]/20 bg-white text-[#173F35] hover:bg-[#173F35]/5"
                                    }`}
                            >
                                {option.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-6">
                    <h2 className="text-2xl font-semibold">
                        {selectedOption.label} bookings
                    </h2>

                    <p className="mt-2 text-sm text-gray-600">
                        {selectedOption.description}
                    </p>

                    <p
                        aria-live="polite"
                        className="mt-2 text-sm font-medium"
                    >
                        {bookings.length}{" "}
                        {bookings.length === 1 ? "booking" : "bookings"}
                    </p>
                </div>

                {bookings.length === 0 ? (
                    <p className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
                        {selectedOption.emptyMessage}
                    </p>
                ) : (
                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                        {bookings.map((booking) => (
                            <article
                                key={booking.id}
                                className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <h3 className="text-2xl font-semibold">
                                        {booking.roomTypeName}
                                    </h3>

                                    <span
                                        className={`rounded-full px-3 py-1 text-sm font-medium ${selectedOption.badgeClass}`}
                                    >
                                        {selectedOption.label}
                                    </span>
                                </div>

                                <p className="mt-3 break-all text-xs text-gray-500">
                                    Reference: {booking.id}
                                </p>

                                <p className="mt-2 text-xs text-gray-500">
                                    Requested on:{" "}
                                    {formatDate(booking.createdAt)}
                                </p>

                                <div className="mt-6 space-y-2">
                                    <h4 className="font-semibold">
                                        Customer details
                                    </h4>

                                    <p>Name: {booking.fullName}</p>

                                    <p className="break-all">
                                        Email: {booking.email}
                                    </p>

                                    <p>Phone: {booking.phone}</p>
                                </div>

                                <div className="mt-6 space-y-2">
                                    <h4 className="font-semibold">
                                        Stay details
                                    </h4>

                                    <p>
                                        Check-in:{" "}
                                        {formatDate(booking.checkIn)}
                                    </p>

                                    <p>
                                        Check-out:{" "}
                                        {formatDate(booking.checkOut)}
                                    </p>

                                    <p>Nights: {booking.nights}</p>
                                    <p>Guests: {booking.guests}</p>

                                    {booking.status === "CONFIRMED" && (
                                        <div className="mt-4 rounded-lg bg-green-50 p-4 text-green-900">
                                            <p className="font-semibold">
                                                Assigned room
                                            </p>

                                            <p className="mt-1">
                                                {booking.room
                                                    ? `Room ${booking.room.number}`
                                                    : "No room assigned"}
                                            </p>
                                        </div>
                                    )}

                                    {booking.status === "DECLINED" && (
                                        <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-900">
                                            <p className="font-semibold">
                                                Reason for declining
                                            </p>

                                            <p className="mt-1 whitespace-pre-wrap wrap-break-word">
                                                {booking.declineReason?.trim() ||
                                                    "No reason recorded."}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6">
                                    <h4 className="font-semibold">
                                        Selected extras
                                    </h4>

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

                                {booking.status === "PENDING" && (
                                    <StaffBookingActions
                                        bookingId={booking.id}
                                        rooms={booking.roomType.rooms}
                                    />
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