"use client";

import { useActionState } from "react";
import {
    updateRoomPrice,
    type RoomPriceState,
} from "../actions/room-management";

const initialState: RoomPriceState = {
    status: "idle",
    message: "",
};

type Props = {
    roomTypeId: string;
    currentPrice: number;
};

export default function RoomPriceForm({
    roomTypeId,
    currentPrice,
}: Props) {
    const [state, formAction, isPending] = useActionState(
        updateRoomPrice,
        initialState
    );

    const inputId = `price-${roomTypeId}`;

    return (
        <form
            action={formAction}
            className="mt-6 space-y-4"
            aria-busy={isPending}
        >
            <input
                type="hidden"
                name="roomTypeId"
                value={roomTypeId}
            />

            <input
                type="hidden"
                name="currentPrice"
                value={currentPrice}
            />

            <div>
                <label
                    htmlFor={inputId}
                    className="mb-2 block font-medium"
                >
                    Price per night (LKR)
                </label>

                <input
                    id={inputId}
                    name="pricePerNight"
                    type="number"
                    min={1}
                    max={2147483647}
                    step={1}
                    defaultValue={currentPrice}
                    required
                    disabled={isPending}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#173F35]"
                />
            </div>

            <p className="text-sm text-gray-600">
                Applies to new booking requests. Existing bookings
                keep their saved prices.
            </p>

            {state.message && (
                <p
                    role={state.status === "error" ? "alert" : "status"}
                    className={`rounded-lg p-3 text-sm ${
                        state.status === "error"
                            ? "bg-red-50 text-red-800"
                            : "bg-green-50 text-green-900"
                    }`}
                >
                    {state.message}
                </p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-[#173F35] px-5 py-3 text-sm font-semibold text-white hover:bg-[#245548] disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isPending ? "Saving…" : "Save price"}
            </button>
        </form>
    );
}