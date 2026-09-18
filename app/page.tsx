// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

// export default function Home() {
//   return (
//     <main className="min-h-screen bg-[#F8F6EF] text-[#173F35]">
//       {/* Navigation bar */}
//       <Navbar />

//       {/* Main introduction */}
//       <section className="mx-auto max-w-6xl px-6 py-24 text-center md:py-32">
//         <p className="text-sm font-semibold uppercase tracking-widest">
//           A stay made for you
//         </p>

//         <h1 className="mt-6 text-5xl font-bold leading-tight md:text-7xl">
//           Your stay.
//           <br />
//           Your way.
//         </h1>

//         <p className="mt-6 text-xl">
//           ඔබේ නවාතැන, ඔබේ කැමැත්තට.
//         </p>

//         <p className="mx-auto mt-5 max-w-xl leading-7 text-[#173F35]/75">
//           Choose your room, add your favourite meals and activities,
//           and plan a stay that fits your budget.
//         </p>

//         <a
//           href="#how-it-works"
//           className="mt-8 inline-block rounded-lg bg-[#173F35] px-7 py-4 font-medium text-white"
//         >
//           Discover how it works
//         </a>
//       </section>

//       {/* How it works */}
//       <section
//         id="how-it-works"
//         className="mx-auto max-w-6xl scroll-mt-8 px-6 pb-20"
//       >
//         <h2 className="mb-8 text-center text-3xl font-bold">
//           A simpler way to plan your stay
//         </h2>

//         <div className="grid gap-6 md:grid-cols-3">
//           <article className="rounded-2xl border border-[#173F35]/15 bg-white p-8">
//             <span className="text-sm font-semibold">01</span>
//             <h3 className="mt-4 text-xl font-semibold">
//               Choose your room
//             </h3>
//             <p className="mt-3 leading-7 text-gray-600">
//               Find a room that suits your guests and your comfort.
//             </p>
//           </article>

//           <article className="rounded-2xl border border-[#173F35]/15 bg-white p-8">
//             <span className="text-sm font-semibold">02</span>
//             <h3 className="mt-4 text-xl font-semibold">
//               Add your favourites
//             </h3>
//             <p className="mt-3 leading-7 text-gray-600">
//               Pick your meals and activities, and check your total.
//             </p>
//           </article>

//           <article className="rounded-2xl border border-[#173F35]/15 bg-white p-8">
//             <span className="text-sm font-semibold">03</span>
//             <h3 className="mt-4 text-xl font-semibold">
//               Request your stay
//             </h3>
//             <p className="mt-3 leading-7 text-gray-600">
//               Send your package to the hotel for review and confirmation.
//             </p>
//           </article>
//         </div>
//       </section>

//       <Footer />
//     </main>
//   );
// }

import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { prisma } from "./lib/prisma";

export const dynamic = "force-dynamic";

const steps = [
  {
    number: "01",
    title: "Choose your room",
    description:
      "Find a space that suits your guests, your comfort and your pace.",
  },
  {
    number: "02",
    title: "Add your favourites",
    description:
      "Choose meals and activities, and see how your stay fits your budget.",
  },
  {
    number: "03",
    title: "Request your stay",
    description:
      "Send your selections to the hotel for availability review and confirmation.",
  },
];

export default async function Home() {
  const roomTypes = await prisma.roomType.findMany({
    where: {
      rooms: {
        some: {
          isActive: true,
        },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      image: true,
      capacity: true,
      breakfastIncluded: true,
      pricePerNight: true,
    },
    orderBy: {
      pricePerNight: "asc",
    },
    take: 2,
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F6EF] text-[#173F35]">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section
          aria-labelledby="hero-title"
          className="relative isolate flex min-h-[560px] items-center overflow-hidden md:min-h-[680px]"
        >
          <Image
            src="/images/home-hero.png"
            alt="Infinity pool and hillside retreat overlooking green mountains at sunset"
            fill
            preload
            sizes="100vw"
            className="object-cover object-[58%_center]"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/30"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#102D25]/70 via-transparent to-black/10"
          />

          <div className="relative mx-auto w-full max-w-6xl px-6 pb-28 pt-20 md:pb-36 md:pt-28">
            <div className="max-w-xl text-white md:ml-auto md:text-right">
              <p className="text-xs font-medium uppercase tracking-[0.28em]">
                A little escape in Sri Lanka
              </p>

              <h1
                id="hero-title"
                className="hotel-heading mt-6 text-5xl leading-[1.1] sm:text-6xl lg:text-7xl"
              >
                Your stay.
                <br />
                Your way.
              </h1>

              <p className="mt-5 text-lg text-white/90">
                A little escape, made for you.
              </p>

              <p lang="si" className="mt-3 text-base text-white/90">
                ඔබේ නවාතැන, ඔබේ කැමැත්තට.
              </p>

              <Link
                href="/plan-my-stay"
                className="hotel-button mt-8 border border-white/40"
              >
                Plan My Stay
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Floating introduction */}
        <div className="relative z-10 mx-auto -mt-12 max-w-5xl px-6">
          <div className="grid gap-6 rounded-xl border border-[#173F35]/10 bg-[#FFFEFA] p-6 shadow-[0_12px_35px_rgba(23,63,53,0.12)] md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#817253]">
                Thoughtfully planned, personally yours
              </p>

              <h2 className="hotel-heading mt-2 text-2xl sm:text-3xl">
                A stay that feels like you.
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#66716A]">
                Choose your dates, find your room and add the little
                extras—all with your budget in view.
              </p>
            </div>

            <Link href="/plan-my-stay" className="hotel-button">
              Start planning
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Rooms */}
        <section
          aria-labelledby="rooms-heading"
          className="mx-auto max-w-6xl px-6 py-20 md:py-24"
        >
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#817253]">
              Rest a little longer
            </p>

            <h2
              id="rooms-heading"
              className="hotel-heading mt-4 text-4xl leading-tight md:text-5xl"
            >
              Make room for a slower pace
            </h2>

            <p className="mx-auto mt-4 max-w-lg leading-7 text-[#66716A]">
              A comfortable space to unwind, with room for the
              experiences that make your stay your own.
            </p>
          </div>

          {roomTypes.length > 0 ? (
            <div className="mt-10 grid gap-7 md:grid-cols-2">
              {roomTypes.map((room) => (
                <article
                  key={room.id}
                  className="overflow-hidden rounded-xl border border-[#173F35]/12 bg-[#FFFEFA]"
                >
                  <div className="relative aspect-[4/3] sm:aspect-[16/10]">
                    <Image
                      src={room.image}
                      alt={room.name}
                      fill
                      sizes="(max-width: 767px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-6 md:p-7">
                    <h3 className="hotel-heading text-3xl">
                      {room.name}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-[#66716A]">
                      {room.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#66716A]">
                      <span>Up to {room.capacity} guests</span>

                      {room.breakfastIncluded && (
                        <span>Breakfast included</span>
                      )}
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#173F35]/10 pt-5">
                      <p>
                        <span className="font-semibold">
                          LKR{" "}
                          {room.pricePerNight.toLocaleString("en-US")}
                        </span>
                        <span className="ml-1 text-xs text-[#66716A]">
                          / night
                        </span>
                      </p>

                      <Link
                        href={`/rooms/${room.slug}`}
                        aria-label={`Explore ${room.name}`}
                        className="inline-flex min-h-11 items-center gap-3 rounded-md px-2 text-sm font-medium hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#173F35]"
                      >
                        Explore room
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-10 rounded-xl border border-[#173F35]/10 bg-white p-8 text-center text-[#66716A]">
              No rooms are currently listed. Please check back soon.
            </p>
          )}

          <div className="mt-9 text-center">
            <Link
              href="/rooms"
              className="inline-flex min-h-11 items-center gap-3 text-sm font-medium underline underline-offset-4"
            >
              View all rooms
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          aria-labelledby="planning-heading"
          className="mx-auto max-w-6xl scroll-mt-8 px-6 pb-20"
        >
          <div className="rounded-xl border border-[#173F35]/12 bg-[#FFFEFA] px-6 py-10 md:px-10 md:py-12">
            <h2
              id="planning-heading"
              className="hotel-heading text-center text-3xl md:text-4xl"
            >
              A simpler way to plan your stay
            </h2>

            <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-0">
              {steps.map((step) => (
                <article
                  key={step.number}
                  className="md:px-6 md:not-first:border-l md:not-first:border-[#173F35]/12"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#EEE5D2] text-xs font-medium">
                    {step.number}
                  </span>

                  <h3 className="hotel-heading mt-4 text-2xl">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#66716A]">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="/plan-my-stay" className="hotel-button">
                Create your stay
                <span aria-hidden="true">→</span>
              </Link>

              <p className="mt-4 text-xs leading-6 text-[#66716A]">
                Every booking request is confirmed only after hotel
                approval.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}