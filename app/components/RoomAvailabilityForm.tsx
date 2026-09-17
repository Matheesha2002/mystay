"use client";

import { useActionState } from "react";
import {
    updateRoomAvailability,
    type RoomAvailabilityState,
} from "../actions/room-availability";

const initialState: RoomAvailabilityState = {
    status: "idle",
    message: "",
};

type Props = {
    roomId: string;
    roomNumber: string;
    isActive: boolean;
};

export default function RoomAvailabilityForm({
    roomId,
    roomNumber,
    isActive,
}: Props) {
    const [state, formAction, isPending] = useActionState(
        updateRoomAvailability,
        initialState
    );

    return (
        <form
            action={formAction}
            aria-busy={isPending}
            className="mt-3 space-y-3"
        >
            <input type="hidden" name="roomId" value={roomId} />

            <input
                type="hidden"
                name="currentActive"
                value={String(isActive)}
            />

            <button
                type="submit"
                disabled={isPending}
                aria-label={`${
                    isActive ? "Deactivate" : "Activate"
                } room ${roomNumber}`}
                className={`min-h-11 rounded-lg border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
                    isActive
                        ? "border-red-600 text-red-700 hover:bg-red-50"
                        : "border-[#173F35] bg-[#173F35] text-white hover:bg-[#245548]"
                }`}
            >
                {isPending
                    ? "Saving..."
                    : isActive
                      ? "Make inactive"
                      : "Make active"}
            </button>

            {state.status !== "idle" && (
                <p
                    role={state.status === "error" ? "alert" : "status"}
                    className={`rounded-lg p-3 text-sm ${
                        state.status === "error"
                            ? "bg-red-50 text-red-700"
                            : "bg-green-50 text-green-900"
                    }`}
                >
                    {state.message}
                </p>
            )}
        </form>
    );
}