"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireStaff } from "../lib/staff";

export type RoomAvailabilityState = {
    status: "idle" | "error" | "success";
    message: string;
};

const schema = z.object({
    roomId: z.string().trim().min(1).max(100),
    currentActive: z.enum(["true", "false"]),
});

function failure(message: string): RoomAvailabilityState {
    return { status: "error", message };
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

    return new Date(
        `${value("year")}-${value("month")}-${value("day")}T00:00:00.000Z`
    );
}

export async function updateRoomAvailability(
    _previousState: RoomAvailabilityState,
    formData: FormData
): Promise<RoomAvailabilityState> {
    await requireStaff();

    const parsed = schema.safeParse({
        roomId: formData.get("roomId"),
        currentActive: formData.get("currentActive"),
    });

    if (!parsed.success) {
        return failure("Invalid request. Refresh the page and try again.");
    }

    const { roomId, currentActive } = parsed.data;
    const expectedActive = currentActive === "true";

    let result: RoomAvailabilityState;

    try {
        result = await prisma.$transaction(
            async (tx): Promise<RoomAvailabilityState> => {
                // Serialize changes with room assignment during confirmation.
                const lockedRooms = await tx.$queryRaw<{ id: string }[]>`
                    SELECT "id"
                    FROM "Room"
                    WHERE "id" = ${roomId}
                    FOR UPDATE
                `;

                if (lockedRooms.length === 0) {
                    return failure("This room no longer exists.");
                }

                const room = await tx.room.findUnique({
                    where: { id: roomId },
                    select: {
                        id: true,
                        number: true,
                        isActive: true,
                    },
                });

                if (!room) {
                    return failure("This room no longer exists.");
                }

                if (room.isActive !== expectedActive) {
                    return failure(
                        "Room availability has already changed. Refresh the page."
                    );
                }

                if (room.isActive) {
                    const confirmedBooking = await tx.booking.findFirst({
                        where: {
                            roomId: room.id,
                            status: "CONFIRMED",
                            checkOut: {
                                gt: todayInSriLanka(),
                            },
                        },
                        select: { id: true },
                    });

                    if (confirmedBooking) {
                        return failure(
                            `Room ${room.number} has a current or upcoming confirmed booking and cannot be made inactive.`
                        );
                    }
                }

                const nextActive = !room.isActive;

                await tx.room.update({
                    where: { id: room.id },
                    data: { isActive: nextActive },
                });

                return {
                    status: "success",
                    message: `Room ${room.number} is now ${
                        nextActive ? "active" : "inactive"
                    }.`,
                };
            },
            {
                isolationLevel: "ReadCommitted",
                maxWait: 5000,
                timeout: 15000,
            }
        );
    } catch (error) {
        console.error("Room availability update failed:", error);

        return failure(
            "Unable to update availability. Refresh the page before retrying."
        );
    }

    if (result.status === "success") {
        revalidatePath("/staff/rooms");
        revalidatePath("/staff/bookings");
        revalidatePath("/rooms");
        revalidatePath("/rooms/garden-deluxe");
        revalidatePath("/rooms/mountain-suite");
        revalidatePath("/plan-my-stay");
        revalidatePath("/");
    }

    return result;
}