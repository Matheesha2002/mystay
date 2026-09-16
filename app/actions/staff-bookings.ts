"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireStaff } from "../lib/staff";

export type StaffBookingState = {
    status: "idle" | "error" | "success";
    message: string;
};

const decisionSchema = z.discriminatedUnion("decision", [
    z.object({
        decision: z.literal("confirm"),
        bookingId: z.string().min(1).max(100),
        roomId: z.string().min(1, "Please select a room.").max(100),
        availabilityChecked: z.literal("on"),
    }),
    z.object({
        decision: z.literal("decline"),
        bookingId: z.string().min(1).max(100),
        reason: z
            .string()
            .trim()
            .min(1, "Please enter a reason for declining.")
            .max(500, "Use 500 characters or fewer."),
    }),
]);

function failure(message: string): StaffBookingState {
    return {
        status: "error",
        message,
    };
}

function todayInSriLanka() {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Colombo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());

    const value = (type: string) =>
        parts.find((part) => part.type === type)?.value;

    return `${value("year")}-${value("month")}-${value("day")}`;
}

export async function reviewBooking(
    _previousState: StaffBookingState,
    formData: FormData
): Promise<StaffBookingState> {
    // Every action checks staff permission on the server.
    await requireStaff();

    const parsed = decisionSchema.safeParse({
        decision: formData.get("decision"),
        bookingId: formData.get("bookingId"),
        roomId: formData.get("roomId"),
        availabilityChecked: formData.get("availabilityChecked"),
        reason: formData.get("reason"),
    });

    if (!parsed.success) {
        return failure(
            "To confirm, select a room and check availability. To decline, enter a reason of 1–500 characters."
        );
    }

    const values = parsed.data;
    let result: StaffBookingState;

    try {
        result = await prisma.$transaction(
            async (tx): Promise<StaffBookingState> => {
                // Only one staff action can change this booking at a time.
                await tx.$queryRaw`
                    SELECT "id"
                    FROM "public"."Booking"
                    WHERE "id" = ${values.bookingId}
                    FOR UPDATE
                `;

                const booking = await tx.booking.findUnique({
                    where: {
                        id: values.bookingId,
                    },
                });

                if (!booking) {
                    return failure("Booking request not found.");
                }

                if (booking.status !== "PENDING") {
                    return failure(
                        "This request has already been reviewed. Refresh the page."
                    );
                }

                if (values.decision === "decline") {
                    await tx.booking.update({
                        where: {
                            id: booking.id,
                        },
                        data: {
                            status: "DECLINED",
                            declineReason: values.reason,
                            declinedAt: new Date(),
                        },
                    });

                    return {
                        status: "success",
                        message: "Booking request declined.",
                    };
                }

                if (
                    booking.checkIn.toISOString().slice(0, 10) <
                    todayInSriLanka()
                ) {
                    return failure(
                        "The check-in date is in the past. This request cannot be confirmed."
                    );
                }

                if (booking.checkOut <= booking.checkIn) {
                    return failure("This request has invalid dates.");
                }

                // Serialize confirmations that use the same room.
                await tx.$queryRaw`
                    SELECT "id"
                    FROM "public"."Room"
                    WHERE "id" = ${values.roomId}
                    FOR UPDATE
                `;

                const room = await tx.room.findUnique({
                    where: {
                        id: values.roomId,
                    },
                    include: {
                        roomType: {
                            select: {
                                capacity: true,
                            },
                        },
                    },
                });

                if (
                    !room ||
                    !room.isActive ||
                    room.roomTypeId !== booking.roomTypeId
                ) {
                    return failure(
                        "Please select an active room of the requested room type."
                    );
                }

                if (booking.guests > room.roomType.capacity) {
                    return failure(
                        "The guest count exceeds this room's capacity."
                    );
                }

                // Checkout day may be another booking's check-in day.
                const overlappingBooking =
                    await tx.booking.findFirst({
                        where: {
                            roomId: room.id,
                            status: "CONFIRMED",
                            checkIn: {
                                lt: booking.checkOut,
                            },
                            checkOut: {
                                gt: booking.checkIn,
                            },
                        },
                        select: {
                            id: true,
                        },
                    });

                if (overlappingBooking) {
                    return failure(
                        `Room ${room.number} is already booked for overlapping dates. Please select another room.`
                    );
                }

                await tx.booking.update({
                    where: {
                        id: booking.id,
                    },
                    data: {
                        status: "CONFIRMED",
                        roomId: room.id,
                        confirmedAt: new Date(),
                        declineReason: null,
                        declinedAt: null,
                    },
                });

                return {
                    status: "success",
                    message: `Booking confirmed in room ${room.number}.`,
                };
            },
            {
                isolationLevel: "ReadCommitted",
                maxWait: 5000,
                timeout: 15000,
            }
        );
    } catch (error) {
        console.error("Staff booking review failed:", error);

        return failure(
            "Unable to complete the review. Refresh the page to check the latest status before retrying."
        );
    }

    if (result.status === "success") {
        revalidatePath("/staff/bookings");
        revalidatePath("/my-bookings");
    }

    return result;
}