// import Image from "next/image";
// import Link from "next/link";
// import type { Room } from "../lib/rooms";

// type RoomCardProps = {
//     room: Room;
// };

// export default function RoomCard({ room }: RoomCardProps) {
//     return (
//         <article className="rounded-2xl border border-gray-200 bg-white p-6">
//             <Image
//                 src={room.image}
//                 alt={room.name}
//                 width={600}
//                 height={400}
//                 className="mb-5 h-48 w-full rounded-xl object-cover"
//             />
//             <h2 className="text-2xl font-semibold">
//                 {room.name}
//             </h2>

//             <p className="mt-3 text-gray-600">
//                 {room.description}
//             </p>

//             <p className="mt-4">
//                 Up to {room.capacity} guests
//             </p>

//             <p className="mt-2">
//                 {room.breakfastIncluded
//                     ? "Breakfast included"
//                     : "Breakfast not included"}
//             </p>

//             <p className="mt-6 text-xl font-bold">
//                 LKR {room.price.toLocaleString("en-US")}
//                 <span className="text-sm font-normal text-gray-600">
//                     {" "}per night
//                 </span>
//             </p>
//             <Link
//                 href={`/rooms/${room.slug}`}
//                 className="mt-6 inline-block rounded-lg bg-[#173F35] px-5 py-3 font-medium text-white"
//             >
//                 View Details
//             </Link>
//         </article>
//     );
// }

import Image from "next/image";
import Link from "next/link";
import type { Room } from "../lib/rooms";

type RoomCardProps = {
    room: Room;
};

export default function RoomCard({ room }: RoomCardProps) {
    return (
        <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#173F35]/12 bg-[#FFFEFA]">
            {/* Room photograph */}
            <div className="relative aspect-4/3 overflow-hidden sm:aspect-16/10">
                <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1152px) 50vw, 550px"
                    className="object-cover"
                />

                {room.breakfastIncluded && (
                    <span className="absolute bottom-4 left-4 rounded-full bg-[#FFFEFA]/95 px-4 py-2 text-xs font-medium text-[#173F35] shadow-sm">
                        Breakfast included
                    </span>
                )}
            </div>

            {/* Room information */}
            <div className="flex flex-1 flex-col p-6 md:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.23em] text-[#817253]">
                    A space to unwind
                </p>

                <h2 className="hotel-heading mt-3 text-3xl md:text-4xl">
                    {room.name}
                </h2>

                <p className="mt-4 text-sm leading-7 text-[#66716A]">
                    {room.description}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-[#66716A]">
                    <span className="inline-flex items-center gap-2">
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <circle cx="9" cy="7" r="3" />
                            <path d="M3 21v-3a6 6 0 0 1 12 0v3" />
                            <path d="M16 4a3 3 0 0 1 0 6" />
                            <path d="M21 21v-3a6 6 0 0 0-4-5.65" />
                        </svg>

                        Up to {room.capacity} guests
                    </span>

                    <span>
                        {room.breakfastIncluded
                            ? "Breakfast included"
                            : "Breakfast not included"}
                    </span>
                </div>

                {/* Price and details link */}
                <div className="mt-auto pt-7">
                    <div className="flex flex-wrap items-center justify-between gap-5 border-t border-[#173F35]/12 pt-5">
                        <div>
                            <p className="text-xs text-[#66716A]">
                                Per room, per night
                            </p>

                            <p className="mt-1 text-xl font-semibold">
                                LKR{" "}
                                {room.price.toLocaleString("en-US")}
                            </p>
                        </div>

                        <Link
                            href={`/rooms/${room.slug}`}
                            aria-label={`View details for ${room.name}`}
                            className="hotel-button"
                        >
                            View Details
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}