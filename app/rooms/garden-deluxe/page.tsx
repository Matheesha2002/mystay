import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { notFound } from "next/navigation";

export default async function GardenDeluxePage() {
    const room = await prisma.roomType.findUnique({
        where: {
            slug: "garden-deluxe",
        },
    });

    if (!room) {
        notFound();
    }

   
    return (
        <div className="flex min-h-screen flex-col bg-[#F8F6EF] text-[#173F35]">
            <Navbar />

            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">

                <Link
                    href="/rooms"
                    className="mb-6 inline-block font-medium hover:underline"
                >
                    ← Back to Rooms
                </Link>
                <h1 className="text-4xl font-bold">
                    {room.name}
                </h1>

                <Image
                    src={room.image}
                    alt={room.name}
                    width={1200}
                    height={800}
                    className="mt-6 aspect-3/2 w-full max-w-3xl rounded-2xl object-cover"
                />

                <p className="mt-4 text-lg">
                    {room.description}
                </p>

                <ul className="mt-6 list-disc space-y-2 pl-5">
                    <li>Up to {room.capacity} guests</li>
                    <li>
                        {room.breakfastIncluded
                            ? "Breakfast included"
                            : "Breakfast not included"}
                    </li>
                </ul>
                <h2 className="mt-8 text-2xl font-semibold">
                    Room facilities
                </h2>

                <ul className="mt-4 list-disc space-y-2 pl-5">
                    {room.amenities.map((amenity) => (
                        <li key={amenity}>{amenity}</li>
                    ))}
                </ul>

                <p className="mt-8 text-2xl font-bold">
                    LKR {room.pricePerNight.toLocaleString("en-US")} per night
                </p>
            </main>

            <Footer />
        </div>
    );
}