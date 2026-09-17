"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireStaff } from "../lib/staff";

export type ExtraPriceState = {
    status: "idle" | "error" | "success";
    message: string;
};

const priceValue = z
    .string()
    .trim()
    .regex(/^\d+$/)
    .transform(Number)
    .pipe(z.number().int().min(0).max(2147483647));

const priceSchema = z.object({
    kind: z.enum(["meal", "activity"]),
    extraId: z.string().min(1).max(100),
    currentPrice: priceValue,
    newPrice: priceValue,
});

export async function updateExtraPrice(
    _previousState: ExtraPriceState,
    formData: FormData
): Promise<ExtraPriceState> {
    await requireStaff();

    const parsed = priceSchema.safeParse({
        kind: formData.get("kind"),
        extraId: formData.get("extraId"),
        currentPrice: formData.get("currentPrice"),
        newPrice: formData.get("newPrice"),
    });

    if (!parsed.success) {
        return {
            status: "error",
            message:
                "Enter a whole-number price between LKR 0 and 2,147,483,647.",
        };
    }

    const values = parsed.data;

    try {
        const result =
            values.kind === "meal"
                ? await prisma.meal.updateMany({
                      where: {
                          id: values.extraId,
                          slug: "dinner",
                          pricePerGuestPerNight: values.currentPrice,
                      },
                      data: {
                          pricePerGuestPerNight: values.newPrice,
                      },
                  })
                : await prisma.activity.updateMany({
                      where: {
                          id: values.extraId,
                          slug: "guided-nature-walk",
                          pricePerGuestPerSession: values.currentPrice,
                      },
                      data: {
                          pricePerGuestPerSession: values.newPrice,
                      },
                  });

        if (result.count === 0) {
            return {
                status: "error",
                message:
                    "This item is unavailable or its price has changed. Refresh the page and review the latest price.",
            };
        }
    } catch (error) {
        console.error("Extra price update failed:", error);

        return {
            status: "error",
            message:
                "Unable to confirm the update. Refresh the page to check the saved price before retrying.",
        };
    }

    revalidatePath("/staff/extras");
    revalidatePath("/plan-my-stay");

    return {
        status: "success",
        message: `Price saved: LKR ${values.newPrice.toLocaleString("en-US")}.`,
    };
}