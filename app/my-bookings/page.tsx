// import Link from "next/link";
// import { redirect } from "next/navigation";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import { prisma } from "../lib/prisma";
// import { createClient } from "../lib/supabase/server";
// import CancelBookingButton from "../components/CancelBookingButton";
// import {
//     canCancelBooking,
//     todayInSriLanka,
// } from "../lib/booking-policy";

// const statusLabels = {
//     PENDING: "Pending",
//     CONFIRMED: "Confirmed",
//     DECLINED: "Declined",
//     CANCELLED: "Cancelled",
// };

// const statusColors = {
//     PENDING: "bg-amber-100 text-amber-900",
//     CONFIRMED: "bg-green-100 text-green-800",
//     DECLINED: "bg-red-100 text-red-800",
//     CANCELLED: "bg-gray-100 text-gray-700",
// };

// function formatDate(date: Date) {
//     return new Intl.DateTimeFormat("en-GB", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//         timeZone: "UTC",
//     }).format(date);
// }

// export default async function MyBookingsPage() {
//     const supabase = await createClient();

//     const {
//         data: { user },
//         error,
//     } = await supabase.auth.getUser();

//     // Login නොවූ අය Login page එකට යවනවා.
//     if (error || !user) {
//         redirect("/login");
//     }

//     const today = todayInSriLanka();

//     // මේ userගේ bookings පමණක් ලබාගන්නවා.
//     const bookings = await prisma.booking.findMany({
//         where: {
//             userId: user.id,
//         },
//         orderBy: [
//             { createdAt: "desc" },
//             { id: "desc" },
//         ],
//         select: {
//             id: true,
//             status: true,
//             roomTypeName: true,
//             checkIn: true,
//             checkOut: true,
//             nights: true,
//             guests: true,
//             breakfastIncluded: true,
//             roomCost: true,
//             mealCost: true,
//             activityCost: true,
//             totalCost: true,
//             declineReason: true,
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
//                     My Bookings
//                 </h1>

//                 <p className="mt-4 text-lg">
//                     View your booking requests and their current status.
//                 </p>

//                 {bookings.length === 0 ? (
//                     <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
//                         <h2 className="text-xl font-semibold">
//                             No booking requests yet
//                         </h2>

//                         <p className="mt-3 text-gray-600">
//                             Choose your room, meals and activities to
//                             plan your first stay.
//                         </p>

//                         <Link
//                             href="/plan-my-stay"
//                             className="mt-6 inline-block rounded-lg bg-[#173F35] px-5 py-3 font-medium text-white"
//                         >
//                             Plan My Stay
//                         </Link>
//                     </section>
//                 ) : (
//                     <div className="mt-8 grid gap-6 md:grid-cols-2">
//                         {bookings.map((booking) => (
//                             <article
//                                 key={booking.id}
//                                 className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6"
//                             >
//                                 <div className="flex flex-wrap items-center justify-between gap-3">
//                                     <h2 className="text-2xl font-semibold">
//                                         {booking.roomTypeName}
//                                     </h2>

//                                     <span
//                                         className={`rounded-full px-3 py-1 text-sm font-medium ${statusColors[booking.status]}`}
//                                     >
//                                         {statusLabels[booking.status]}
//                                     </span>
//                                 </div>

//                                 <p className="mt-3 break-all text-xs text-gray-500">
//                                     Reference: {booking.id}
//                                 </p>

//                                 <div className="mt-6 space-y-2">
//                                     <p>
//                                         Check-in:{" "}
//                                         {formatDate(booking.checkIn)}
//                                     </p>

//                                     <p>
//                                         Check-out:{" "}
//                                         {formatDate(booking.checkOut)}
//                                     </p>

//                                     <p>
//                                         {booking.nights}{" "}
//                                         {booking.nights === 1
//                                             ? "night"
//                                             : "nights"}{" "}
//                                         · {booking.guests}{" "}
//                                         {booking.guests === 1
//                                             ? "guest"
//                                             : "guests"}{" "}
//                                         · 1 room
//                                     </p>

//                                     <p>
//                                         {booking.breakfastIncluded
//                                             ? "Breakfast included"
//                                             : "Breakfast not included"}
//                                     </p>
//                                 </div>

//                                 <div className="mt-6">
//                                     <h3 className="font-semibold">
//                                         Selected extras
//                                     </h3>

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

//                                 <div className="mt-6 space-y-2 border-t border-gray-200 pt-4">
//                                     <p>
//                                         Room: LKR{" "}
//                                         {booking.roomCost.toLocaleString("en-US")}
//                                     </p>

//                                     <p>
//                                         Meals: LKR{" "}
//                                         {booking.mealCost.toLocaleString("en-US")}
//                                     </p>

//                                     <p>
//                                         Activities: LKR{" "}
//                                         {booking.activityCost.toLocaleString("en-US")}
//                                     </p>

//                                     <p className="pt-2 text-xl font-bold">
//                                         Total: LKR{" "}
//                                         {booking.totalCost.toLocaleString("en-US")}
//                                     </p>
//                                 </div>

//                                 {booking.status === "PENDING" && (
//                                     <p className="mt-4 text-sm text-amber-900">
//                                         Your request is awaiting hotel
//                                         staff review. Your booking is
//                                         not confirmed yet.
//                                     </p>
//                                 )}

//                                 {booking.status === "CONFIRMED" && (
//                                     <p className="mt-4 text-sm text-green-800">
//                                         Your booking has been confirmed
//                                         by the hotel.
//                                     </p>
//                                 )}

//                                 {booking.status === "DECLINED" && (
//                                     <p className="mt-4 text-sm text-red-800">
//                                         {booking.declineReason
//                                             ? `Reason: ${booking.declineReason}`
//                                             : "The hotel could not accept this request."}
//                                     </p>
//                                 )}

//                                 {booking.status === "CANCELLED" && (
//                                     <p className="mt-4 text-sm text-gray-600">
//                                         This booking has been cancelled.
//                                     </p>
//                                 )}

//                                 {canCancelBooking(
//                                     booking.status,
//                                     booking.checkIn,
//                                     today
//                                 ) && (
//                                         <CancelBookingButton bookingId={booking.id} />
//                                     )}

//                                 {(booking.status === "PENDING" ||
//                                     booking.status === "CONFIRMED") &&
//                                     !canCancelBooking(
//                                         booking.status,
//                                         booking.checkIn,
//                                         today
//                                     ) && (
//                                         <p className="mt-4 text-sm text-gray-600">
//                                             Online cancellation closes when the check-in date
//                                             begins in Sri Lanka. Please contact the hotel for help.
//                                         </p>
//                                     )}
//                             </article>
//                         ))}
//                     </div>
//                 )}
//             </main>

//             <Footer />
//         </div>
//     );
// }

import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { prisma } from "../lib/prisma";
import { createClient } from "../lib/supabase/server";
import CancelBookingButton from "../components/CancelBookingButton";
import { canCancelBooking, todayInSriLanka } from "../lib/booking-policy";

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

  const today = todayInSriLanka();

  // මේ userගේ bookings පමණක් ලබාගන්නවා.
  const bookings = await prisma.booking.findMany({
    where: {
      userId: user.id,
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
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
      <main className="flex-1">
        <section
          aria-labelledby="bookings-title"
          className="relative isolate flex min-h-60 items-center justify-center overflow-hidden md:min-h-72"
        >
          <Image
            src="/images/home-hero.png"
            alt=""
            fill
            preload
            sizes="100vw"
            className="-z-20 object-cover object-[center_42%]"
          />
          <div className="absolute inset-0 -z-10 bg-black/50" />
          <div className="mx-auto max-w-3xl px-6 py-14 text-center text-white">
            <p className="text-xs font-medium uppercase tracking-[0.25em]">
              Your next little escape
            </p>
            <h1
              id="bookings-title"
              className="hotel-heading mt-4 text-5xl md:text-6xl"
            >
              My Bookings
            </h1>
            <p className="mt-5 text-sm leading-7 text-white/90 sm:text-base">
              Your stays, your selections, and every update in one place.
            </p>
          </div>
        </section>

        <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 md:py-14">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#8A7855]">
                A stay to look forward to
              </p>
              <h2 className="hotel-heading mt-3 text-3xl sm:text-4xl">
                Your booking requests
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#66716A]">
                {bookings.length}{" "}
                {bookings.length === 1 ? "request" : "requests"} · Latest first
              </p>
            </div>
            <Link href="/plan-my-stay" className="hotel-button">
              Plan another stay <span aria-hidden="true">→</span>
            </Link>
          </div>

          {bookings.length === 0 ? (
            <section className="mt-8 rounded-xl border border-[#173F35]/15 bg-[#FFFEFA] px-6 py-14 text-center sm:px-10">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8A7855]">
                Make a little time for you
              </p>
              <h2 className="hotel-heading mt-4 text-3xl sm:text-4xl">
                Your first stay starts here.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#66716A]">
                You haven’t sent a booking request yet. Choose a room, add your
                favourite meals and activities, and plan a stay around your
                budget.
              </p>
              <Link
                href="/rooms"
                className="mt-6 inline-flex min-h-11 items-center font-medium underline underline-offset-4"
              >
                Explore our rooms{" "}
                <span aria-hidden="true" className="ml-3">
                  →
                </span>
              </Link>
            </section>
          ) : (
            <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
              {bookings.map((booking) => (
                <article
                  key={booking.id}
                  className="min-w-0 overflow-hidden rounded-xl border border-[#173F35]/15 bg-[#FFFEFA]"
                >
                  <div className="border-b border-[#173F35]/10 bg-[#F0F1E9] p-5 sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-[#66716A]">
                        Your stay
                      </p>
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${statusColors[booking.status]}`}
                      >
                        {statusLabels[booking.status]}
                      </span>
                    </div>
                    <h2 className="hotel-heading mt-3 wrap-break-word text-3xl sm:text-4xl">
                      {booking.roomTypeName}
                    </h2>
                    <p className="mt-3 break-all text-xs leading-5 text-[#66716A]">
                      Reference: {booking.id}
                    </p>
                  </div>

                  <div className="p-5 sm:p-7">
                    <dl className="grid grid-cols-2 gap-4 border-b border-[#173F35]/10 pb-5">
                      <div className="min-w-0">
                        <dt className="text-xs uppercase tracking-wider text-[#66716A]">
                          Check-in
                        </dt>
                        <dd className="mt-2 text-sm font-medium sm:text-base">
                          {formatDate(booking.checkIn)}
                        </dd>
                      </div>
                      <div className="min-w-0 border-l border-[#173F35]/15 pl-4">
                        <dt className="text-xs uppercase tracking-wider text-[#66716A]">
                          Check-out
                        </dt>
                        <dd className="mt-2 text-sm font-medium sm:text-base">
                          {formatDate(booking.checkOut)}
                        </dd>
                      </div>
                    </dl>
                    <p className="mt-4 text-sm leading-6">
                      {booking.nights}{" "}
                      {booking.nights === 1 ? "night" : "nights"} ·{" "}
                      {booking.guests}{" "}
                      {booking.guests === 1 ? "guest" : "guests"} · 1 room
                    </p>
                    <p className="mt-2 text-sm text-[#66716A]">
                      {booking.breakfastIncluded
                        ? "Breakfast included"
                        : "Breakfast not included"}
                    </p>

                    <div className="mt-6">
                      <h3 className="hotel-heading text-2xl">
                        Selected extras
                      </h3>
                      {booking.meals.length === 0 &&
                      booking.activities.length === 0 ? (
                        <p className="mt-2 text-sm text-[#66716A]">
                          No extras selected.
                        </p>
                      ) : (
                        <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                          {booking.meals.map((meal) => (
                            <li
                              key={meal.id}
                              className="max-w-full wrap-break-word rounded-md border border-[#173F35]/10 bg-[#F8F6EF] px-3 py-2"
                            >
                              {meal.name}
                            </li>
                          ))}
                          {booking.activities.map((activity) => (
                            <li
                              key={activity.id}
                              className="max-w-full wrap-break-word rounded-md border border-[#173F35]/10 bg-[#F8F6EF] px-3 py-2"
                            >
                              {activity.name} · {activity.sessions}{" "}
                              {activity.sessions === 1 ? "session" : "sessions"}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="mt-6 rounded-lg border border-[#173F35]/10 bg-[#F8F6EF] p-4 sm:p-5">
                      <h3 className="hotel-heading text-2xl">
                        Price breakdown
                      </h3>
                      <dl className="mt-4 space-y-3 text-sm">
                        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                          <dt className="text-[#66716A]">Room</dt>
                          <dd className="wrap-break-word font-medium">
                            LKR {booking.roomCost.toLocaleString("en-US")}
                          </dd>
                        </div>
                        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                          <dt className="text-[#66716A]">Meals</dt>
                          <dd className="wrap-break-word font-medium">
                            LKR {booking.mealCost.toLocaleString("en-US")}
                          </dd>
                        </div>
                        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                          <dt className="text-[#66716A]">Activities</dt>
                          <dd className="wrap-break-word font-medium">
                            LKR {booking.activityCost.toLocaleString("en-US")}
                          </dd>
                        </div>
                        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-[#173F35]/15 pt-4 text-lg font-semibold">
                          <dt>Total</dt>
                          <dd className="wrap-break-word">
                            LKR {booking.totalCost.toLocaleString("en-US")}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {booking.status === "PENDING" && (
                      <p className="mt-5 rounded-lg border border-amber-200/70 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                        Your request is awaiting hotel staff review. Your
                        booking is not confirmed yet.
                      </p>
                    )}
                    {booking.status === "CONFIRMED" && (
                      <p className="mt-5 rounded-lg border border-green-200/70 bg-green-50 p-4 text-sm leading-6 text-green-800">
                        Your booking has been confirmed by the hotel.
                      </p>
                    )}
                    {booking.status === "DECLINED" && (
                      <p className="mt-5 wrap-break-word rounded-lg border border-red-200/70 bg-red-50 p-4 text-sm leading-6 text-red-800">
                        {booking.declineReason
                          ? `Reason: ${booking.declineReason}`
                          : "The hotel could not accept this request."}
                      </p>
                    )}
                    {booking.status === "CANCELLED" && (
                      <p className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                        This booking has been cancelled.
                      </p>
                    )}

                    {canCancelBooking(
                      booking.status,
                      booking.checkIn,
                      today,
                    ) && <CancelBookingButton bookingId={booking.id} />}
                    {(booking.status === "PENDING" ||
                      booking.status === "CONFIRMED") &&
                      !canCancelBooking(
                        booking.status,
                        booking.checkIn,
                        today,
                      ) && (
                        <p className="mt-5 border-t border-[#173F35]/10 pt-4 text-xs leading-6 text-[#66716A]">
                          Online cancellation closes when the check-in date
                          begins in Sri Lanka. Please contact the hotel for
                          help.
                        </p>
                      )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
