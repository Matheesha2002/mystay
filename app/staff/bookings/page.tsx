// import Link from "next/link";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
// import { prisma } from "../../lib/prisma";
// import { requireStaff } from "../../lib/staff";
// import StaffBookingActions from "../../components/StaffBookingActions";

// const statusOptions = [
//     {
//         value: "PENDING",
//         label: "Pending",
//         badgeClass: "bg-amber-100 text-amber-900",
//         description: "Booking requests awaiting hotel review.",
//         emptyMessage: "No pending booking requests.",
//     },
//     {
//         value: "CONFIRMED",
//         label: "Confirmed",
//         badgeClass: "bg-green-100 text-green-900",
//         description: "Bookings confirmed by the hotel.",
//         emptyMessage: "No confirmed bookings yet.",
//     },
//     {
//         value: "DECLINED",
//         label: "Declined",
//         badgeClass: "bg-red-100 text-red-900",
//         description: "Booking requests declined by the hotel.",
//         emptyMessage: "No declined bookings.",
//     },
//     {
//         value: "CANCELLED",
//         label: "Cancelled",
//         badgeClass: "bg-gray-100 text-gray-700",
//         description: "Bookings cancelled by customers.",
//         emptyMessage: "No cancelled bookings.",
//     },
// ] as const;

// type PageProps = {
//     searchParams: Promise<{
//         status?: string | string[];
//     }>;
// };

// function formatDate(date: Date) {
//     return new Intl.DateTimeFormat("en-GB", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//         timeZone: "UTC",
//     }).format(date);
// }

// export default async function StaffBookingsPage({
//     searchParams,
// }: PageProps) {
//     // අවසර පරීක්ෂා කළ පසුව පමණක් bookings කියවනවා.
//     await requireStaff();

//     const params = await searchParams;

//     // නොගැළපෙන status එකක් ආවොත් Pending පෙන්වනවා.
//     const selectedOption =
//         statusOptions.find((option) => option.value === params.status) ??
//         statusOptions[0];

//     const selectedStatus = selectedOption.value;

//     const bookings = await prisma.booking.findMany({
//         where: {
//             status: selectedStatus,
//         },
//         orderBy: [
//             {
//                 createdAt:
//                     selectedStatus === "PENDING" ? "asc" : "desc",
//             },
//             { id: "asc" },
//         ],
//         select: {
//             id: true,
//             status: true,
//             createdAt: true,
//             fullName: true,
//             email: true,
//             phone: true,
//             roomTypeName: true,
//             checkIn: true,
//             checkOut: true,
//             nights: true,
//             guests: true,
//             totalCost: true,
//             declineReason: true,
//             room: {
//                 select: {
//                     number: true,
//                 },
//             },
//             roomType: {
//                 select: {
//                     rooms: {
//                         where: {
//                             isActive: true,
//                         },
//                         select: {
//                             id: true,
//                             number: true,
//                         },
//                         orderBy: {
//                             number: "asc",
//                         },
//                     },
//                 },
//             },
//             meals: {
//                 select: {
//                     id: true,
//                     name: true,
//                 },
//             },
//             activities: {
//                 select: {
//                     id: true,
//                     name: true,
//                     sessions: true,
//                 },
//             },
//         },
//     });

//     return (
//         <div className="flex min-h-screen flex-col bg-[#F8F6EF] text-[#173F35]">
//             <Navbar />

//             <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
//                 <h1 className="text-4xl font-bold">
//                     Staff Bookings
//                 </h1>

//                 <Link
//                     href="/staff/rooms"
//                     className="mt-4 inline-block rounded-lg border border-[#173F35] px-4 py-2 text-sm font-semibold hover:bg-[#173F35]/5"
//                 >
//                     Manage rooms
//                 </Link>

//                 <Link
//                     href="/staff/extras"
//                     className="mt-4 ml-3 inline-block rounded-lg border border-[#173F35] px-4 py-2 text-sm font-semibold hover:bg-[#173F35]/5"
//                 >
//                     Manage extras
//                 </Link>

//                 <p className="mt-4 text-lg">
//                     Review new requests and view booking history.
//                 </p>

//                 <nav
//                     aria-label="Booking status filters"
//                     className="mt-8 flex flex-wrap gap-3"
//                 >
//                     {statusOptions.map((option) => {
//                         const isSelected =
//                             option.value === selectedStatus;

//                         return (
//                             <Link
//                                 key={option.value}
//                                 href={`/staff/bookings?status=${option.value}`}
//                                 aria-current={
//                                     isSelected ? "page" : undefined
//                                 }
//                                 className={`rounded-lg border px-5 py-3 text-sm font-semibold transition-colors ${isSelected
//                                     ? "border-[#173F35] bg-[#173F35] text-white"
//                                     : "border-[#173F35]/20 bg-white text-[#173F35] hover:bg-[#173F35]/5"
//                                     }`}
//                             >
//                                 {option.label}
//                             </Link>
//                         );
//                     })}
//                 </nav>

//                 <div className="mt-6">
//                     <h2 className="text-2xl font-semibold">
//                         {selectedOption.label} bookings
//                     </h2>

//                     <p className="mt-2 text-sm text-gray-600">
//                         {selectedOption.description}
//                     </p>

//                     <p
//                         aria-live="polite"
//                         className="mt-2 text-sm font-medium"
//                     >
//                         {bookings.length}{" "}
//                         {bookings.length === 1 ? "booking" : "bookings"}
//                     </p>
//                 </div>

//                 {bookings.length === 0 ? (
//                     <p className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
//                         {selectedOption.emptyMessage}
//                     </p>
//                 ) : (
//                     <div className="mt-8 grid gap-6 md:grid-cols-2">
//                         {bookings.map((booking) => (
//                             <article
//                                 key={booking.id}
//                                 className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6"
//                             >
//                                 <div className="flex flex-wrap items-center justify-between gap-3">
//                                     <h3 className="text-2xl font-semibold">
//                                         {booking.roomTypeName}
//                                     </h3>

//                                     <span
//                                         className={`rounded-full px-3 py-1 text-sm font-medium ${selectedOption.badgeClass}`}
//                                     >
//                                         {selectedOption.label}
//                                     </span>
//                                 </div>

//                                 <p className="mt-3 break-all text-xs text-gray-500">
//                                     Reference: {booking.id}
//                                 </p>

//                                 <p className="mt-2 text-xs text-gray-500">
//                                     Requested on:{" "}
//                                     {formatDate(booking.createdAt)}
//                                 </p>

//                                 <div className="mt-6 space-y-2">
//                                     <h4 className="font-semibold">
//                                         Customer details
//                                     </h4>

//                                     <p>Name: {booking.fullName}</p>

//                                     <p className="break-all">
//                                         Email: {booking.email}
//                                     </p>

//                                     <p>Phone: {booking.phone}</p>
//                                 </div>

//                                 <div className="mt-6 space-y-2">
//                                     <h4 className="font-semibold">
//                                         Stay details
//                                     </h4>

//                                     <p>
//                                         Check-in:{" "}
//                                         {formatDate(booking.checkIn)}
//                                     </p>

//                                     <p>
//                                         Check-out:{" "}
//                                         {formatDate(booking.checkOut)}
//                                     </p>

//                                     <p>Nights: {booking.nights}</p>
//                                     <p>Guests: {booking.guests}</p>

//                                     {booking.status === "CONFIRMED" && (
//                                         <div className="mt-4 rounded-lg bg-green-50 p-4 text-green-900">
//                                             <p className="font-semibold">
//                                                 Assigned room
//                                             </p>

//                                             <p className="mt-1">
//                                                 {booking.room
//                                                     ? `Room ${booking.room.number}`
//                                                     : "No room assigned"}
//                                             </p>
//                                         </div>
//                                     )}

//                                     {booking.status === "DECLINED" && (
//                                         <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-900">
//                                             <p className="font-semibold">
//                                                 Reason for declining
//                                             </p>

//                                             <p className="mt-1 whitespace-pre-wrap wrap-break-word">
//                                                 {booking.declineReason?.trim() ||
//                                                     "No reason recorded."}
//                                             </p>
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="mt-6">
//                                     <h4 className="font-semibold">
//                                         Selected extras
//                                     </h4>

//                                     {booking.meals.length === 0 &&
//                                         booking.activities.length === 0 ? (
//                                         <p className="mt-2 text-sm text-gray-600">
//                                             No extras selected.
//                                         </p>
//                                     ) : (
//                                         <ul className="mt-2 list-disc space-y-1 pl-5">
//                                             {booking.meals.map((meal) => (
//                                                 <li key={meal.id}>
//                                                     {meal.name}
//                                                 </li>
//                                             ))}

//                                             {booking.activities.map(
//                                                 (activity) => (
//                                                     <li key={activity.id}>
//                                                         {activity.name}
//                                                         {" · "}
//                                                         {activity.sessions}{" "}
//                                                         {activity.sessions === 1
//                                                             ? "session"
//                                                             : "sessions"}
//                                                     </li>
//                                                 )
//                                             )}
//                                         </ul>
//                                     )}
//                                 </div>

//                                 <p className="mt-6 border-t border-gray-200 pt-4 text-xl font-bold">
//                                     Total: LKR{" "}
//                                     {booking.totalCost.toLocaleString("en-US")}
//                                 </p>

//                                 {booking.status === "PENDING" && (
//                                     <StaffBookingActions
//                                         bookingId={booking.id}
//                                         rooms={booking.roomType.rooms}
//                                     />
//                                 )}
//                             </article>
//                         ))}
//                     </div>
//                 )}
//             </main>

//             <Footer />
//         </div>
//     );
// }

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
        badgeClass: "bg-[#FFF4D6] text-[#8A6218]",
        description: "Booking requests awaiting hotel review.",
        emptyMessage: "No pending booking requests.",
    },
    {
        value: "CONFIRMED",
        label: "Confirmed",
        badgeClass: "bg-[#E5F1E8] text-[#24583F]",
        description: "Bookings confirmed by the hotel.",
        emptyMessage: "No confirmed bookings yet.",
    },
    {
        value: "DECLINED",
        label: "Declined",
        badgeClass: "bg-[#FBE9E7] text-[#963B32]",
        description: "Booking requests declined by the hotel.",
        emptyMessage: "No declined bookings.",
    },
    {
        value: "CANCELLED",
        label: "Cancelled",
        badgeClass: "bg-[#ECEBE7] text-[#66645F]",
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
    await requireStaff();

    const params = await searchParams;

    const requestedStatus =
        typeof params.status === "string" ? params.status : undefined;

    const selectedOption =
        statusOptions.find(
            (option) => option.value === requestedStatus
        ) ?? statusOptions[0];

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
            {
                id: "asc",
            },
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

            {/* HERO SECTION */}
            <section className="relative h-85 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('/images/home-hero.png')",
                    }}
                />

                <div className="absolute inset-0 bg-[#102F27]/65" />

                <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-6 text-white">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-[#E8D9AF]">
                        MyStay · Staff Workspace
                    </p>

                    <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
                        Staff Bookings
                    </h1>

                    <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                        Thoughtful stays begin with thoughtful
                        planning. Review guest requests, confirm
                        rooms and manage every stay with care.
                    </p>
                </div>
            </section>

            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 sm:py-20">
                {/* INTRO SECTION */}
                <section className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9B8055]">
                            A little care in every detail
                        </p>

                        <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
                            Manage your guests&apos; stays
                        </h2>

                        <p className="mt-5 max-w-2xl leading-7 text-[#5F6D68]">
                            Review new booking requests, confirm
                            suitable rooms and keep track of each
                            guest&apos;s stay from one place.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/staff/rooms"
                            className="rounded-full border border-[#173F35] px-6 py-3 text-sm font-semibold transition duration-300 hover:bg-[#173F35] hover:text-white"
                        >
                            Manage rooms
                        </Link>

                        <Link
                            href="/staff/extras"
                            className="rounded-full bg-[#173F35] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-[#235448]"
                        >
                            Manage extras
                        </Link>
                    </div>
                </section>

                {/* STATUS FILTERS */}
                <nav
                    aria-label="Booking status filters"
                    className="mt-14 grid grid-cols-2 gap-3 rounded-[28px] border border-[#DED9CC] bg-white p-3 shadow-sm md:grid-cols-4"
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
                                className={`rounded-[20px] px-4 py-4 text-center text-sm font-semibold transition-all duration-300 ${
                                    isSelected
                                        ? "bg-[#173F35] text-white shadow-md"
                                        : "text-[#173F35] hover:bg-[#F3F0E7]"
                                }`}
                            >
                                {option.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* SECTION HEADER */}
                <section className="mt-14 flex flex-col gap-4 border-b border-[#DDD7C8] pb-7 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9B8055]">
                            Booking Management
                        </p>

                        <h2 className="mt-3 text-3xl font-semibold">
                            {selectedOption.label} bookings
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-[#6B7772]">
                            {selectedOption.description}
                        </p>
                    </div>

                    <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#EDE9DE] px-5 py-2.5 text-sm font-semibold">
                        <span className="h-2 w-2 rounded-full bg-[#173F35]" />

                        <span aria-live="polite">
                            {bookings.length}{" "}
                            {bookings.length === 1
                                ? "booking"
                                : "bookings"}
                        </span>
                    </div>
                </section>

                {/* EMPTY STATE */}
                {bookings.length === 0 ? (
                    <section className="mt-10 rounded-[30px] border border-[#DDD7C8] bg-white px-8 py-16 text-center shadow-sm">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1EEE5]">
                            <span className="text-2xl">✓</span>
                        </div>

                        <h3 className="mt-5 text-xl font-semibold">
                            Nothing here right now
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6B7772]">
                            {selectedOption.emptyMessage}
                        </p>
                    </section>
                ) : (
                    /* BOOKING CARDS */
                    <div className="mt-10 grid gap-7 lg:grid-cols-2">
                        {bookings.map((booking) => (
                            <article
                                key={booking.id}
                                className="group min-w-0 overflow-hidden rounded-[30px] border border-[#DDD7C8] bg-white shadow-[0_12px_35px_rgba(23,63,53,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(23,63,53,0.1)]"
                            >
                                {/* CARD HEADER */}
                                <div className="border-b border-[#E8E3D8] bg-[#FCFBF7] px-7 py-6">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9B8055]">
                                                Booking Request
                                            </p>

                                            <h3 className="mt-2 text-2xl font-semibold leading-tight">
                                                {booking.roomTypeName}
                                            </h3>
                                        </div>

                                        <span
                                            className={`rounded-full px-4 py-2 text-xs font-semibold ${selectedOption.badgeClass}`}
                                        >
                                            {selectedOption.label}
                                        </span>
                                    </div>

                                    <div className="mt-5 grid gap-1 text-xs text-[#7B8581]">
                                        <p className="break-all">
                                            Reference: {booking.id}
                                        </p>

                                        <p>
                                            Requested on{" "}
                                            {formatDate(
                                                booking.createdAt
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-7">
                                    {/* CUSTOMER DETAILS */}
                                    <section>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9B8055]">
                                            Guest
                                        </p>

                                        <h4 className="mt-2 text-lg font-semibold">
                                            Customer details
                                        </h4>

                                        <div className="mt-4 space-y-3 rounded-2xl bg-[#F8F6EF] p-5">
                                            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                                                <span className="text-sm text-[#78827E]">
                                                    Name
                                                </span>

                                                <span className="text-sm font-semibold">
                                                    {booking.fullName}
                                                </span>
                                            </div>

                                            <div className="border-t border-[#E5E0D4]" />

                                            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-6">
                                                <span className="text-sm text-[#78827E]">
                                                    Email
                                                </span>

                                                <span className="break-all text-sm font-medium sm:text-right">
                                                    {booking.email}
                                                </span>
                                            </div>

                                            <div className="border-t border-[#E5E0D4]" />

                                            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                                                <span className="text-sm text-[#78827E]">
                                                    Phone
                                                </span>

                                                <span className="text-sm font-medium">
                                                    {booking.phone}
                                                </span>
                                            </div>
                                        </div>
                                    </section>

                                    {/* STAY DETAILS */}
                                    <section className="mt-8">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9B8055]">
                                            Stay
                                        </p>

                                        <h4 className="mt-2 text-lg font-semibold">
                                            Stay details
                                        </h4>

                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            <div className="rounded-2xl border border-[#E5E0D4] p-4">
                                                <p className="text-xs text-[#7B8581]">
                                                    Check-in
                                                </p>

                                                <p className="mt-1 text-sm font-semibold">
                                                    {formatDate(
                                                        booking.checkIn
                                                    )}
                                                </p>
                                            </div>

                                            <div className="rounded-2xl border border-[#E5E0D4] p-4">
                                                <p className="text-xs text-[#7B8581]">
                                                    Check-out
                                                </p>

                                                <p className="mt-1 text-sm font-semibold">
                                                    {formatDate(
                                                        booking.checkOut
                                                    )}
                                                </p>
                                            </div>

                                            <div className="rounded-2xl border border-[#E5E0D4] p-4">
                                                <p className="text-xs text-[#7B8581]">
                                                    Nights
                                                </p>

                                                <p className="mt-1 text-lg font-semibold">
                                                    {booking.nights}
                                                </p>
                                            </div>

                                            <div className="rounded-2xl border border-[#E5E0D4] p-4">
                                                <p className="text-xs text-[#7B8581]">
                                                    Guests
                                                </p>

                                                <p className="mt-1 text-lg font-semibold">
                                                    {booking.guests}
                                                </p>
                                            </div>
                                        </div>

                                        {/* CONFIRMED ROOM */}
                                        {booking.status ===
                                            "CONFIRMED" && (
                                            <div className="mt-4 rounded-2xl border border-[#C9DFCF] bg-[#EDF6EF] p-5 text-[#24583F]">
                                                <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                                                    Assigned Room
                                                </p>

                                                <p className="mt-2 text-xl font-semibold">
                                                    {booking.room
                                                        ? `Room ${booking.room.number}`
                                                        : "No room assigned"}
                                                </p>
                                            </div>
                                        )}

                                        {/* DECLINE REASON */}
                                        {booking.status ===
                                            "DECLINED" && (
                                            <div className="mt-4 rounded-2xl border border-[#F0CCC7] bg-[#FFF4F2] p-5 text-[#873C34]">
                                                <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                                                    Decline Reason
                                                </p>

                                                <p className="mt-2 whitespace-pre-wrap wrap-break-word text-sm leading-6">
                                                    {booking.declineReason?.trim() ||
                                                        "No reason recorded."}
                                                </p>
                                            </div>
                                        )}
                                    </section>

                                    {/* EXTRAS */}
                                    <section className="mt-8">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9B8055]">
                                            Personal touches
                                        </p>

                                        <h4 className="mt-2 text-lg font-semibold">
                                            Selected extras
                                        </h4>

                                        {booking.meals.length === 0 &&
                                        booking.activities.length ===
                                            0 ? (
                                            <div className="mt-4 rounded-2xl bg-[#F8F6EF] p-5 text-sm text-[#6B7772]">
                                                No extras selected for
                                                this stay.
                                            </div>
                                        ) : (
                                            <div className="mt-4 space-y-3">
                                                {booking.meals.map(
                                                    (meal) => (
                                                        <div
                                                            key={
                                                                meal.id
                                                            }
                                                            className="flex items-center justify-between rounded-2xl border border-[#E5E0D4] px-5 py-4"
                                                        >
                                                            <span className="text-sm font-medium">
                                                                {
                                                                    meal.name
                                                                }
                                                            </span>

                                                            <span className="rounded-full bg-[#F2EDE1] px-3 py-1 text-xs font-semibold text-[#806D4C]">
                                                                Meal
                                                            </span>
                                                        </div>
                                                    )
                                                )}

                                                {booking.activities.map(
                                                    (activity) => (
                                                        <div
                                                            key={
                                                                activity.id
                                                            }
                                                            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E5E0D4] px-5 py-4"
                                                        >
                                                            <span className="text-sm font-medium">
                                                                {
                                                                    activity.name
                                                                }
                                                            </span>

                                                            <span className="rounded-full bg-[#E8F0EC] px-3 py-1 text-xs font-semibold text-[#365E4F]">
                                                                {
                                                                    activity.sessions
                                                                }{" "}
                                                                {activity.sessions ===
                                                                1
                                                                    ? "session"
                                                                    : "sessions"}
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </section>

                                    {/* TOTAL */}
                                    <div className="mt-8 rounded-[22px] bg-[#173F35] px-6 py-5 text-white">
                                        <div className="flex flex-wrap items-end justify-between gap-3">
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                                                    Total Stay Cost
                                                </p>

                                                <p className="mt-1 text-sm text-white/75">
                                                    Room and selected
                                                    extras
                                                </p>
                                            </div>

                                            <p className="text-2xl font-semibold">
                                                LKR{" "}
                                                {booking.totalCost.toLocaleString(
                                                    "en-US"
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* STAFF ACTIONS */}
                                    {booking.status ===
                                        "PENDING" && (
                                        <div className="mt-7 border-t border-[#E5E0D4] pt-7">
                                            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#9B8055]">
                                                Staff Action
                                            </p>

                                            <StaffBookingActions
                                                bookingId={
                                                    booking.id
                                                }
                                                rooms={
                                                    booking.roomType
                                                        .rooms
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}