"use client";

import { useActionState } from "react";
import {
    toggleExtraAvailability,
    type ExtraAvailabilityState,
} from "../actions/extra-availability";

const initialState: ExtraAvailabilityState = {
    status: "idle",
    message: "",
};

type Props = {
    kind: "meal" | "activity";
    extraId: string;
    isActive: boolean;
};

export default function ExtraAvailabilityForm({
    kind,
    extraId,
    isActive,
}: Props) {
    const [state, formAction, isPending] = useActionState(
        toggleExtraAvailability,
        initialState
    );

    return (
        <form
            action={formAction}
            className="mt-6 space-y-3 border-t border-gray-200 pt-5"
            aria-busy={isPending}
        >
            <input type="hidden" name="kind" value={kind} />

            <input
                type="hidden"
                name="extraId"
                value={extraId}
            />

            <input
                type="hidden"
                name="currentActive"
                value={String(isActive)}
            />

            <h3 className="font-semibold">
                Availability
            </h3>

            <p className="text-sm text-gray-600">
                {isActive
                    ? "Deactivate this item to stop offering it for new booking requests."
                    : "Activate this item to offer it in the stay planner again."}
            </p>

            <p className="text-sm text-gray-600">
                Existing booking selections will be kept.
            </p>

            <button
                type="submit"
                disabled={isPending}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
                    isActive
                        ? "border-red-700 text-red-700 hover:bg-red-50"
                        : "border-[#173F35] text-[#173F35] hover:bg-[#173F35]/5"
                }`}
            >
                {isPending
                    ? "Updating…"
                    : isActive
                      ? "Make inactive"
                      : "Make active"}
            </button>

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
        </form>
    );
}