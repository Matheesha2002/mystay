"use client";

import { useActionState, useId } from "react";
import {
    reviewBooking,
    type StaffBookingState,
} from "../actions/staff-bookings";

type StaffBookingActionsProps = {
    bookingId: string;
    rooms: {
        id: string;
        number: string;
    }[];
};

const initialState: StaffBookingState = {
    status: "idle",
    message: "",
};

export default function StaffBookingActions({
    bookingId,
    rooms,
}: StaffBookingActionsProps) {
    const [state, formAction, isPending] = useActionState(
        reviewBooking,
        initialState
    );

    const id = useId();
    const isDisabled = isPending || state.status === "success";

    return (
        <form action={formAction} className="mt-6">
            <input
                type="hidden"
                name="bookingId"
                value={bookingId}
            />

            <fieldset
                disabled={isDisabled}
                aria-busy={isPending}
                className="min-w-0 space-y-4 border-t border-gray-200 pt-5"
            >
                <legend className="sr-only">
                    Review booking request
                </legend>

                <div>
                    <label
                        htmlFor={`${id}-room`}
                        className="mb-2 block font-medium"
                    >
                        Assign a room
                    </label>

                    <select
                        id={`${id}-room`}
                        name="roomId"
                        defaultValue=""
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                    >
                        <option value="">Select a room</option>

                        {rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                                Room {room.number}
                            </option>
                        ))}
                    </select>

                    <p className="mt-2 text-sm text-gray-600">
                        These are active rooms of the requested type.
                        Date conflicts are checked when you confirm.
                    </p>

                    {rooms.length === 0 && (
                        <p className="mt-2 text-sm text-red-700">
                            No active rooms of this type are available
                            for assignment.
                        </p>
                    )}
                </div>

                <label
                    htmlFor={`${id}-availability`}
                    className="flex items-start gap-3"
                >
                    <input
                        id={`${id}-availability`}
                        name="availabilityChecked"
                        type="checkbox"
                        className="mt-1 h-5 w-5 accent-[#173F35]"
                    />

                    <span className="text-sm">
                        I have checked room readiness and availability
                        of the selected meals and activities for this stay.
                    </span>
                </label>

                <button
                    type="submit"
                    name="decision"
                    value="confirm"
                    disabled={isDisabled || rooms.length === 0}
                    className="w-full rounded-lg bg-[#173F35] px-5 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isPending ? "Saving…" : "Confirm booking"}
                </button>

                <div className="border-t border-gray-200 pt-4">
                    <label
                        htmlFor={`${id}-reason`}
                        className="mb-2 block font-medium"
                    >
                        Reason for declining
                    </label>

                    <textarea
                        id={`${id}-reason`}
                        name="reason"
                        rows={3}
                        maxLength={500}
                        placeholder="Explain why the request cannot be accepted."
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                    />

                    <p className="mt-2 text-sm text-gray-600">
                        This reason will be shown to the customer.
                    </p>
                </div>

                <button
                    type="submit"
                    name="decision"
                    value="decline"
                    disabled={isDisabled}
                    className="w-full rounded-lg border border-red-700 px-5 py-3 font-medium text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isPending ? "Saving…" : "Decline request"}
                </button>
            </fieldset>

            {state.message && (
                <p
                    role={state.status === "error" ? "alert" : "status"}
                    className={`mt-4 rounded-lg p-3 text-sm ${
                        state.status === "error"
                            ? "bg-red-50 text-red-700"
                            : "bg-green-50 text-green-800"
                    }`}
                >
                    {state.message}
                </p>
            )}
        </form>
    );
}