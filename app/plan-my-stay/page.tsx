"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { rooms } from "../lib/rooms";

export default function PlanMyStayPage() {
  // Customer ඇතුළත් කරන අගයන් මතක තබාගන්නවා.
  const [budget, setBudget] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [selectedRoomSlug, setSelectedRoomSlug] = useState("");

  // දින දෙක අතර රාත්‍රී ගණන ගණනය කරනවා.
  let nights = 0;

  if (checkIn && checkOut) {
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();

    nights = (end - start) / (1000 * 60 * 60 * 24);
  }

  // Dropdown එකෙන් තෝරපු room එකේ දත්ත හොයනවා.
  const selectedRoom = rooms.find(
    (room) => room.slug === selectedRoomSlug
  );

  // Guests අගය නිවැරදි පූර්ණ සංඛ්‍යාවක්ද බලනවා.
  const guestCount = Number(guests);

  const isGuestCountValid =
    Number.isInteger(guestCount) && guestCount >= 1;

  // එක් room එකේ මුළු වියදම ගණනය කරනවා.
  let roomCost = 0;

  if (selectedRoom && nights > 0) {
    roomCost = selectedRoom.price * nights;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F6EF] text-[#173F35]">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
        <h1 className="text-4xl font-bold">
          Plan My Stay
        </h1>

        <p className="mt-4 text-lg">
          Choose your dates, guests and budget to start planning your stay.
        </p>

        {/* එන දිනය */}
        <div className="mt-8 max-w-sm">
          <label
            htmlFor="checkIn"
            className="mb-2 block font-medium"
          >
            Check-in date
          </label>

          <input
            id="checkIn"
            name="checkIn"
            type="date"
            value={checkIn}
            onChange={(event) => setCheckIn(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#173F35]"
          />
        </div>

        {/* යන දිනය */}
        <div className="mt-6 max-w-sm">
          <label
            htmlFor="checkOut"
            className="mb-2 block font-medium"
          >
            Check-out date
          </label>

          <input
            id="checkOut"
            name="checkOut"
            type="date"
            value={checkOut}
            onChange={(event) => setCheckOut(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#173F35]"
          />

          <p className="mt-4 text-sm">
            Check-in: {checkIn}
          </p>

          <p className="mt-2 text-sm">
            Check-out: {checkOut}
          </p>

          {checkIn && checkOut && (
            <p className="mt-4 font-medium">
              {nights > 0
                ? `Number of nights: ${nights}`
                : "Check-out must be after check-in."}
            </p>
          )}
        </div>

        {/* නවතින පිරිස */}
        <div className="mt-6 max-w-sm">
          <label
            htmlFor="guests"
            className="mb-2 block font-medium"
          >
            Number of guests
          </label>

          <input
            id="guests"
            name="guests"
            type="number"
            min={1}
            step={1}
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#173F35]"
          />

          {!isGuestCountValid && (
            <p className="mt-2 text-sm text-red-700">
              Enter a whole number of guests, at least 1.
            </p>
          )}

          <p className="mt-4 text-sm">
            Guests: {guests}
          </p>
        </div>

        {/* මුළු stay එකේ budget එක */}
        <div className="mt-6 max-w-sm">
          <label
            htmlFor="budget"
            className="mb-2 block font-medium"
          >
            Total budget (LKR)
          </label>

          <input
            id="budget"
            name="budget"
            type="number"
            min={1}
            step={1}
            placeholder="Example: 65000"
            aria-describedby="budget-help"
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#173F35]"
          />

          <p
            id="budget-help"
            className="mt-2 text-sm text-gray-600"
          >
            Your budget for the entire stay, including room, meals and
            activities.
          </p>

          <p className="mt-4 font-medium">
            Your budget: LKR {budget}
          </p>
        </div>

        {/* Room එක තෝරන කොටස */}
        <div className="mt-6 max-w-sm">
          <label
            htmlFor="room"
            className="mb-2 block font-medium"
          >
            Choose your room
          </label>

          <select
            id="room"
            name="room"
            value={selectedRoomSlug}
            onChange={(event) =>
              setSelectedRoomSlug(event.target.value)
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#173F35]"
          >
            <option value="">Select a room</option>

            {rooms.map((room) => (
              <option key={room.slug} value={room.slug}>
                {room.name}
              </option>
            ))}
          </select>

          {/* Room එකට පිරිස වැඩි නම් පණිවිඩයක් පෙන්වනවා. */}
          {selectedRoom &&
            isGuestCountValid &&
            guestCount > selectedRoom.capacity && (
              <p className="mt-2 text-sm text-red-700">
                This room allows up to {selectedRoom.capacity} guests.
                Please choose another room or reduce the guest count.
              </p>
            )}

          {/* Room වියදම */}
          {selectedRoom && nights > 0 && (
            <p className="mt-4 text-xl font-semibold">
              Room cost: LKR {roomCost.toLocaleString("en-US")}
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}