import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import RoomPriceForm from "../../components/RoomPriceForm";
import { prisma } from "../../lib/prisma";
import { requireStaff } from "../../lib/staff";

export default async function StaffRoomsPage() {
    await requireStaff();

    const roomTypes = await prisma.roomType.findMany({
        orderBy: {
            name: "asc",
        },
        select: {
            id: true,
            name: true,
            pricePerNight: true,
            capacity: true,
            rooms: {
                orderBy: {
                    number: "asc",
                },
                select: {
                    id: true,
                    number: true,
                    isActive: true,
                },
            },
        },
    });

    return (
        <div className="flex min-h-screen flex-col bg-[#F8F6EF] text-[#173F35]">
            <Navbar />

            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
                <h1 className="text-4xl font-bold">
                    Room Management
                </h1>

                <p className="mt-4 text-lg">
                    View room types and update their nightly prices.
                </p>

                <Link
                    href="/staff/bookings"
                    className="mt-4 inline-block text-sm font-medium underline"
                >
                    Back to Staff Bookings
                </Link>

                {roomTypes.length === 0 ? (
                    <p className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
                        No room types have been added yet.
                    </p>
                ) : (
                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                        {roomTypes.map((roomType) => (
                            <article
                                key={roomType.id}
                                className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6"
                            >
                                <h2 className="text-2xl font-semibold">
                                    {roomType.name}
                                </h2>

                                <p className="mt-3 text-sm text-gray-600">
                                    Maximum guests: {roomType.capacity}
                                </p>

                                <p className="mt-3 text-xl font-bold">
                                    Current price: LKR{" "}
                                    {roomType.pricePerNight.toLocaleString(
                                        "en-US"
                                    )}
                                </p>

                                <div className="mt-5">
                                    <h3 className="font-semibold">
                                        Physical rooms
                                    </h3>

                                    {roomType.rooms.length === 0 ? (
                                        <p className="mt-2 text-sm text-gray-600">
                                            No physical rooms added.
                                        </p>
                                    ) : (
                                        <ul className="mt-2 flex flex-wrap gap-2">
                                            {roomType.rooms.map((room) => (
                                                <li
                                                    key={room.id}
                                                    className={`rounded-full px-3 py-1 text-sm ${
                                                        room.isActive
                                                            ? "bg-green-50 text-green-900"
                                                            : "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    Room {room.number}
                                                    {room.isActive
                                                        ? " · Active"
                                                        : " · Inactive"}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <RoomPriceForm
                                    roomTypeId={roomType.id}
                                    currentPrice={roomType.pricePerNight}
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