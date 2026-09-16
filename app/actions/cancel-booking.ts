"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { createClient } from "../lib/supabase/server";
import {
    canCancelBooking,
    todayInSriLanka,
} from "../lib/booking-policy";

export type CancelBookingState = {
    status: "idle" | "error" | "success";
    message: string;
};

const cancelSchema = z.object({
    bookingId: z.string().trim().min(1).max(100),
    confirmation: z.literal("on"),
});

function failure(message: string): CancelBookingState {
    return { status: "error", message };
}

export async function cancelBooking(
    _previousState: CancelBookingState,
    formData: FormData
): Promise<CancelBookingState> {
    const parsed = cancelSchema.safeParse({
        bookingId: formData.get("bookingId"),
        confirmation: formData.get("confirmation"),
    });

    if (!parsed.success) {
        return failure("Please confirm that you want to cancel.");
    }

    let result: CancelBookingState;

    try {
        const supabase = await createClient();

        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (error || !user) {
            return failure("Please log in to cancel your booking.");
        }

        if (!user.email_confirmed_at) {
            return failure("Please confirm your email address first.");
        }

        const { bookingId } = parsed.data;

        result = await prisma.$transaction(
            async (tx): Promise<CancelBookingState> => {
                // Staff review uses this same booking row lock.
                // Only the authenticated customer's booking is locked.
                await tx.$queryRaw`
                    SELECT "id"
                    FROM "public"."Booking"
                    WHERE "id" = ${bookingId}
                      AND "userId" = CAST(${user.id} AS uuid)
                    FOR UPDATE
                `;

                const booking = await tx.booking.findFirst({
                    where: {
                        id: bookingId,
                        userId: user.id,
                    },
                    select: {
                        id: true,
                        status: true,
                        checkIn: true,
                    },
                });

                if (!booking) {
                    return failure(
                        "Booking not found for your account."
                    );
                }

                // Retrying a completed cancellation is safe.
                if (booking.status === "CANCELLED") {
                    return {
                        status: "success",
                        message: "This booking is already cancelled.",
                    };
                }

                if (booking.status === "DECLINED") {
                    return failure(
                        "A declined booking cannot be cancelled."
                    );
                }

                // Check again on the server after acquiring the lock.
                if (
                    !canCancelBooking(
                        booking.status,
                        booking.checkIn,
                        todayInSriLanka()
                    )
                ) {
                    return failure(
                        "Online cancellation is available only before the check-in date. Please contact the hotel."
                    );
                }

                await tx.booking.update({
                    where: { id: booking.id },
                    data: {
                        status: "CANCELLED",
                        cancelledAt: new Date(),
                    },
                });

                return {
                    status: "success",
                    message: "Your booking has been cancelled.",
                };
            },
            {
                isolationLevel: "ReadCommitted",
                maxWait: 5000,
                timeout: 15000,
            }
        );
    } catch (error) {
        console.error("Booking cancellation failed:", error);

        return failure(
            "Unable to confirm cancellation. Refresh the page to check the latest status before retrying."
        );
    }

    if (result.status === "success") {
        revalidatePath("/my-bookings");
        revalidatePath("/staff/bookings");
    }

    return result;
}