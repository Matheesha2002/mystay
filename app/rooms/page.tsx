// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import { prisma } from "../lib/prisma";
// import RoomCard from "../components/RoomCard";

// export default async function RoomsPage() {

//     const roomTypes = await prisma.roomType.findMany({
//         where: {
//             rooms: {
//                 some: {
//                     isActive: true,
//                 },
//             },
//         },
//         orderBy: {
//             pricePerNight: "asc",
//         },
//     });

//     const rooms = roomTypes.map((roomType) => ({
//         ...roomType,
//         price: roomType.pricePerNight,
//     }));
//     return (
//         <div className="flex min-h-screen flex-col bg-[#F8F6EF] text-[#173F35]">
//             <Navbar />

//             <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
//                 <h1 className="text-4xl font-bold">Our Rooms</h1>

//                 <p className="mt-4 text-lg">
//                     Find a comfortable room for your stay.
//                 </p>
//                 <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
//                     {rooms.map((room) => (
//                         <RoomCard key={room.slug} room={room} />
//                     ))}
//                 </div>

//             </main>

//             <Footer />
//         </div>
//     );
// }

import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { prisma } from "../lib/prisma";
import RoomCard from "../components/RoomCard";

export default async function RoomsPage() {
    const roomTypes = await prisma.roomType.findMany({
        where: {
            rooms: {
                some: {
                    isActive: true,
                },
            },
        },
        orderBy: {
            pricePerNight: "asc",
        },
    });

    const rooms = roomTypes.map((roomType) => ({
        ...roomType,
        price: roomType.pricePerNight,
    }));

    return (
        <div className="flex min-h-screen flex-col bg-[#F8F6EF] text-[#173F35]">
            <Navbar />

            <main className="flex-1">
                {/* Photo banner */}
                <section
                    aria-labelledby="rooms-title"
                    className="relative isolate flex min-h-70 items-center justify-center overflow-hidden md:min-h-90"
                >
                    <Image
                        src="/images/home-hero.png"
                        alt=""
                        fill
                        preload
                        sizes="100vw"
                        className="object-cover object-[center_42%]"
                    />

                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-black/45"
                    />

                    <div className="relative mx-auto max-w-3xl px-6 py-16 text-center text-white">
                        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/85">
                            Rest. Unwind. Feel at home.
                        </p>

                        <h1
                            id="rooms-title"
                            className="hotel-heading mt-4 text-5xl leading-tight md:text-6xl"
                        >
                            Find your quiet escape
                        </h1>

                        <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/90 md:text-base">
                            A little comfort, a slower pace, and a
                            space to make your own.
                        </p>
                    </div>
                </section>

                {/* Room collection */}
                <section
                    aria-labelledby="room-collection-title"
                    className="mx-auto max-w-6xl px-6 py-14 md:py-20"
                >
                    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-xl">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#817253]">
                                Stay a little longer
                            </p>

                            <h2
                                id="room-collection-title"
                                className="hotel-heading mt-3 text-4xl md:text-5xl"
                            >
                                Our rooms
                            </h2>

                            <p className="mt-4 text-sm leading-7 text-[#66716A] md:text-base">
                                Explore our room types and choose
                                the space that suits your stay.
                            </p>
                        </div>

                        <p className="text-xs leading-6 text-[#66716A]">
                            Prices in LKR, per room per night.
                            <br />
                            Availability confirmed by hotel staff.
                        </p>
                    </div>

                    {rooms.length > 0 ? (
                        <div className="mt-9 grid grid-cols-1 gap-7 md:grid-cols-2">
                            {rooms.map((room) => (
                                <RoomCard
                                    key={room.slug}
                                    room={room}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-9 rounded-xl border border-[#173F35]/15 bg-[#FFFEFA] px-6 py-12 text-center">
                            <h3 className="hotel-heading text-2xl">
                                No rooms are currently listed
                            </h3>

                            <p className="mt-3 text-sm leading-7 text-[#66716A]">
                                Please check back soon.
                            </p>
                        </div>
                    )}
                </section>

                {/* Planner invitation */}
                {rooms.length > 0 && (
                    <section className="mx-auto max-w-6xl px-6 pb-16 md:pb-20">
                        <div className="flex flex-col gap-6 rounded-xl border border-[#173F35]/10 bg-[#EDEFE5] p-6 md:flex-row md:items-center md:justify-between md:p-9">
                            <div className="max-w-xl">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#66716A]">
                                    Make it your own
                                </p>

                                <h2 className="hotel-heading mt-3 text-3xl">
                                    Your room is just the beginning.
                                </h2>

                                <p className="mt-3 text-sm leading-7 text-[#66716A]">
                                    Add your favourite meals and
                                    activities, then see how your
                                    selections fit your budget.
                                </p>
                            </div>

                            <Link
                                href="/plan-my-stay"
                                className="hotel-button shrink-0"
                            >
                                Plan My Stay
                                <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}