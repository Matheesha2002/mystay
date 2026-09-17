"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireStaff } from "../lib/staff";

export type ExtraAvailabilityState = {
    status: "idle" | "error" | "success";
    message: string;
};

const availabilitySchema = z.object({
    kind: z.enum(["meal", "activity"]),
    extraId: z.string().min(1).max(100),
    currentActive: z.enum(["true", "false"]),
});

export async function toggleExtraAvailability(
    _previousState: ExtraAvailabilityState,
    formData: FormData
): Promise<ExtraAvailabilityState> {
    await requireStaff();

    const parsed = availabilitySchema.safeParse({
        kind: formData.get("kind"),
        extraId: formData.get("extraId"),
        currentActive: formData.get("currentActive"),
    });

    if (!parsed.success) {
        return {
            status: "error",
            message: "Invalid request. Refresh the page and try again.",
        };
    }

    const values = parsed.data;
    const currentActive = values.currentActive === "true";
    const nextActive = !currentActive;

    try {
        const result =
            values.kind === "meal"
                ? await prisma.meal.updateMany({
                      where: {
                          id: values.extraId,
                          slug: "dinner",
                          isActive: currentActive,
                      },
                      data: {
                          isActive: nextActive,
                      },
                  })
                : await prisma.activity.updateMany({
                      where: {
                          id: values.extraId,
                          slug: "guided-nature-walk",
                          isActive: currentActive,
                      },
                      data: {
                          isActive: nextActive,
                      },
                  });

        if (result.count === 0) {
            return {
                status: "error",
                message:
                    "This item is unavailable or its status has changed. Refresh the page before trying again.",
            };
        }
    } catch (error) {
        console.error("Extra availability update failed:", error);

        return {
            status: "error",
            message:
                "Unable to confirm the update. Refresh the page to check the current status before retrying.",
        };
    }

    revalidatePath("/staff/extras");
    revalidatePath("/plan-my-stay");

    return {
        status: "success",
        message: nextActive
            ? "Item activated. Customers can select it again."
            : "Item deactivated. It is unavailable for new requests.",
    };
}