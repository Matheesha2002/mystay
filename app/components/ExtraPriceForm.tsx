"use client";

import { useActionState } from "react";
import {
    updateExtraPrice,
    type ExtraPriceState,
} from "../actions/extra-management";

const initialState: ExtraPriceState = {
    status: "idle",
    message: "",
};

type Props = {
    kind: "meal" | "activity";
    extraId: string;
    currentPrice: number;
};

export default function ExtraPriceForm({
    kind,
    extraId,
    currentPrice,
}: Props) {
    const [state, formAction, isPending] = useActionState(
        updateExtraPrice,
        initialState
    );

    const inputId = `${kind}-price-${extraId}`;

    const priceLabel =
        kind === "meal"
            ? "Price per guest per night (LKR)"
            : "Price per guest per session (LKR)";

    return (
        <form
            action={formAction}
            className="mt-6 space-y-4"
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
                name="currentPrice"
                value={currentPrice}
            />

            <div>
                <label
                    htmlFor={inputId}
                    className="mb-2 block font-medium"
                >
                    {priceLabel}
                </label>

                <input
                    id={inputId}
                    name="newPrice"
                    type="number"
                    min={0}
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