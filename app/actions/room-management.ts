"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireStaff } from "../lib/staff";

export type RoomPriceState = {
    status: "idle" | "error" | "success";
    message: string;
};

const integerSchema = z
    .string()
    .trim()
    .regex(/^\d+$/)
    .transform(Number)
    .pipe(z.number().int().min(0).max(2147483647));

const priceSchema = z.object({
    roomTypeId: z.string().min(1).max(100),
    currentPrice: integerSchema,
    pricePerNight: integerSchema.refine(
        (price) => price > 0,
        "Price must be greater than zero."
    ),
});

export async function updateRoomPrice(
    _previousState: RoomPriceState,
    formData: FormData
): Promise<RoomPriceState> {
    await requireStaff();

    const parsed = priceSchema.safeParse({
        roomTypeId: formData.get("roomTypeId"),
        currentPrice: formData.get("currentPrice"),
        pricePerNight: formData.get("pricePerNight"),
    });

    if (!parsed.success) {
        return {
            status: "error",
            message:
                "Enter a whole-number price between LKR 1 and 2,147,483,647.",
        };
    }

    const values = parsed.data;

    try {
        // Save only if the price still matches the value displayed.
        const result = await prisma.roomType.updateMany({
            where: {
                id: values.roomTypeId,
                pricePerNight: values.currentPrice,
            },
            data: {
                pricePerNight: values.pricePerNight,
            },
        });

        if (result.count === 0) {
            return {
                status: "error",
                message:
                    "The room type is unavailable or its price has changed. Refresh the page and review the latest price.",
            };
        }
    } catch (error) {
        console.error("Room price update failed:", error);

        return {
            status: "error",
            message:
                "Unable to confirm the price update. Refresh the page to check the saved price before retrying.",
        };
    }

    revalidatePath("/staff/rooms");
    revalidatePath("/rooms");
    revalidatePath("/rooms/garden-deluxe");
    revalidatePath("/rooms/mountain-suite");
    revalidatePath("/plan-my-stay");
    revalidatePath("/");

    return {
        status: "success",
        message: `Price saved: LKR ${values.pricePerNight.toLocaleString("en-US")} per night.`,
    };
}
