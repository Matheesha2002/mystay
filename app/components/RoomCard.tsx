import Image from "next/image";
import Link from "next/link";
import type { Room } from "../lib/rooms";

type RoomCardProps = {
    room: Room;
};

export default function RoomCard({ room }: RoomCardProps) {
    return (
        <article className="rounded-2xl border border-gray-200 bg-white p-6">
            <Image
                src={room.image}
                alt={room.name}
                width={600}
                height={400}
                className="mb-5 h-48 w-full rounded-xl object-cover"
            />
            <h2 className="text-2xl font-semibold">
                {room.name}
            </h2>

            <p className="mt-3 text-gray-600">
                {room.description}
            </p>

            <p className="mt-4">
                Up to {room.capacity} guests
            </p>

            <p className="mt-2">
                {room.breakfastIncluded
                    ? "Breakfast included"
                    : "Breakfast not included"}
            </p>

            <p className="mt-6 text-xl font-bold">
                LKR {room.price.toLocaleString("en-US")}
                <span className="text-sm font-normal text-gray-600">
                    {" "}per night
                </span>
            </p>
            <Link
                href={`/rooms/${room.slug}`}
                className="mt-6 inline-block rounded-lg bg-[#173F35] px-5 py-3 font-medium text-white"
            >
                View Details
            </Link>
        </article>
    );
}