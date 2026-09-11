import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { rooms } from "../lib/rooms";
import RoomCard from "../components/RoomCard";

export default function RoomsPage() {
    return (
        <div className="flex min-h-screen flex-col bg-[#F8F6EF] text-[#173F35]">
            <Navbar />

            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
                <h1 className="text-4xl font-bold">Our Rooms</h1>

                <p className="mt-4 text-lg">
                    Find a comfortable room for your stay.
                </p>
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {rooms.map((room) => (
                        <RoomCard key={room.slug} room={room} />
                    ))}
                </div>

            </main>

            <Footer />
        </div>
    );
}