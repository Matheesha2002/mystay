"use client";

import { useActionState, useState } from "react";
import {
    cancelBooking,
    type CancelBookingState,
} from "../actions/cancel-booking";

const initialState: CancelBookingState = {
    status: "idle",
    message: "",
};

export default function CancelBookingButton({
    bookingId,
}: {
    bookingId: string;
}) {
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [state, formAction, isPending] = useActionState(
        cancelBooking,
        initialState
    );

    if (state.status === "success") {
        return (
            <p role="status" className="mt-4 text-sm text-green-800">
                {state.message}
            </p>
        );
    }

    return (
        <div className="mt-5 border-t border-gray-200 pt-4">
            {!showConfirmation ? (
                <button
                    type="button"
                    onClick={() => setShowConfirmation(true)}
                    className="rounded-lg border border-red-700 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                >
                    Cancel booking
                </button>
            ) : (
                <form
                    action={formAction}
                    className="rounded-lg bg-red-50 p-4"
                >
                    <input
                        type="hidden"
                        name="bookingId"
                        value={bookingId}
                    />

                    <p className="font-semibold text-red-900">
                        Cancel this booking?
                    </p>

                    <p className="mt-2 text-sm text-red-900">
                        This cannot be undone. You would need to submit
                        a new request to book again.
                    </p>

                    <label className="mt-4 flex items-start gap-2 text-sm text-red-900">
                        <input
                            type="checkbox"
                            name="confirmation"
                            value="on"
                            required
                            disabled={isPending}
                            className="mt-1"
                        />

                        <span>
                            I want to cancel this booking.
                        </span>
                    </label>

                    <div className="mt-4 flex flex-wrap gap-3">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isPending
                                ? "Cancelling…"
                                : "Yes, cancel booking"}
                        </button>

                        <button
                            type="button"
                            disabled={isPending}
                            onClick={() => setShowConfirmation(false)}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 disabled:opacity-50"
                        >
                            Keep booking
                        </button>
                    </div>

                    {state.status === "error" && (
                        <p
                            role="alert"
                            className="mt-3 text-sm text-red-800"
                        >
                            {state.message}
                        </p>
                    )}
                </form>
            )}
        </div>
    );
}