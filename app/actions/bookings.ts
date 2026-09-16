"use server";

import { z } from "zod";
import { prisma } from "../lib/prisma";
import { createClient } from "../lib/supabase/server";

const MAX_INT = 2147483647;
const DAY_MS = 86400000;

const dateSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please select valid dates.")
    .refine((value) => {
        const date = new Date(`${value}T00:00:00.000Z`);

        return (
            Number.isFinite(date.getTime()) &&
            date.toISOString().slice(0, 10) === value
        );
    }, "Please select valid dates.");

const bookingSchema = z.object({
    requestId: z.string().uuid(),
    roomSlug: z.string().min(1).max(100),
    checkIn: dateSchema,
    checkOut: dateSchema,
    guests: z.number().int().min(1).max(MAX_INT),
    budget: z.number().int().min(1).max(MAX_INT),
    fullName: z.string().trim().min(1).max(100),
    phone: z
        .string()
        .max(40)
        .transform((value) => value.replace(/[\s()-]/g, ""))
        .pipe(z.string().regex(/^\+?[0-9]{7,15}$/)),
    includeDinner: z.boolean(),
    includeNatureWalk: z.boolean(),
    expectedTotal: z.number().int().min(0).max(MAX_INT),
});

export type BookingResult =
    | {
          status: "success";
          bookingId: string;
          totalCost: number;
      }
    | {
          status: "error";
          message: string;
      };

function failure(message: string): BookingResult {
    return { status: "error", message };
}

export async function submitBooking(
    input: unknown
): Promise<BookingResult> {
    const parsed = bookingSchema.safeParse(input);

    if (!parsed.success) {
        return failure(
            "Please check your dates, guests, budget, name and phone number."
        );
    }

    const values = parsed.data;

    try {
        const supabase = await createClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return failure(
                "Please log in before submitting your booking request."
            );
        }

        const email = user.email;

        if (!email || !user.email_confirmed_at) {
            return failure(
                "Please use an account with a confirmed email address."
            );
        }

        // Repeating the same request returns the existing booking.
        const existing = await prisma.booking.findUnique({
            where: { id: values.requestId },
            select: {
                id: true,
                userId: true,
                totalCost: true,
            },
        });

        if (existing) {
            if (existing.userId !== user.id) {
                return failure("Invalid request. Please reload the page.");
            }

            return {
                status: "success",
                bookingId: existing.id,
                totalCost: existing.totalCost,
            };
        }

        const checkIn = new Date(
            `${values.checkIn}T00:00:00.000Z`
        );
        const checkOut = new Date(
            `${values.checkOut}T00:00:00.000Z`
        );

        const nights =
            (checkOut.getTime() - checkIn.getTime()) / DAY_MS;

        // Current calendar date in Sri Lanka.
        const dateParts = new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Colombo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).formatToParts(new Date());

        const part = (type: string) =>
            dateParts.find((item) => item.type === type)?.value;

        const today =
            `${part("year")}-${part("month")}-${part("day")}`;

        if (values.checkIn < today) {
            return failure("Check-in cannot be in the past.");
        }

        if (!Number.isInteger(nights) || nights <= 0) {
            return failure("Check-out must be after check-in.");
        }

        return await prisma.$transaction(
            async (tx): Promise<BookingResult> => {
                const roomType = await tx.roomType.findFirst({
                    where: {
                        slug: values.roomSlug,
                        rooms: {
                            some: { isActive: true },
                        },
                    },
                });

                if (!roomType) {
                    return failure(
                        "This room type is no longer offered. Please reload the page."
                    );
                }

                if (values.guests > roomType.capacity) {
                    return failure(
                        `This room allows up to ${roomType.capacity} guests.`
                    );
                }

                const meal = values.includeDinner
                    ? await tx.meal.findFirst({
                          where: {
                              slug: "dinner",
                              isActive: true,
                          },
                      })
                    : null;

                const activity = values.includeNatureWalk
                    ? await tx.activity.findFirst({
                          where: {
                              slug: "guided-nature-walk",
                              isActive: true,
                          },
                      })
                    : null;

                if (values.includeDinner && !meal) {
                    return failure(
                        "Dinner is no longer offered. Please reload the page."
                    );
                }

                if (values.includeNatureWalk && !activity) {
                    return failure(
                        "Nature walk is no longer offered. Please reload the page."
                    );
                }

                const prices = [
                    roomType.pricePerNight,
                    meal?.pricePerGuestPerNight ?? 0,
                    activity?.pricePerGuestPerSession ?? 0,
                ];

                if (
                    prices.some(
                        (price) =>
                            !Number.isInteger(price) || price < 0
                    )
                ) {
                    return failure(
                        "Pricing is unavailable. Please contact the hotel."
                    );
                }

                const roomCost = roomType.pricePerNight * nights;
                const mealCost = meal
                    ? meal.pricePerGuestPerNight * values.guests * nights
                    : 0;
                const activityCost = activity
                    ? activity.pricePerGuestPerSession * values.guests
                    : 0;
                const totalCost = roomCost + mealCost + activityCost;

                if (
                    !Number.isSafeInteger(totalCost) ||
                    totalCost > MAX_INT
                ) {
                    return failure(
                        "This request is too large. Please contact the hotel."
                    );
                }

                // Never silently save a different price.
                if (totalCost !== values.expectedTotal) {
                    return failure(
                        "Prices have changed. Reload the page and review the updated total."
                    );
                }

                // Using the same ID prevents duplicate saves on retry.
                const booking = await tx.booking.upsert({
                    where: { id: values.requestId },
                    update: {},
                    create: {
                        id: values.requestId,
                        status: "PENDING",
                        userId: user.id,
                        email,
                        fullName: values.fullName,
                        phone: values.phone,
                        checkIn,
                        checkOut,
                        nights,
                        guests: values.guests,
                        budget: values.budget,
                        roomTypeId: roomType.id,
                        roomTypeName: roomType.name,
                        roomPricePerNight: roomType.pricePerNight,
                        breakfastIncluded: roomType.breakfastIncluded,
                        roomCost,
                        mealCost,
                        activityCost,
                        totalCost,

                        meals: {
                            create: meal
                                ? [
                                      {
                                          mealId: meal.id,
                                          name: meal.name,
                                          pricePerGuestPerNight:
                                              meal.pricePerGuestPerNight,
                                          guests: values.guests,
                                          nights,
                                          totalCost: mealCost,
                                      },
                                  ]
                                : [],
                        },

                        activities: {
                            create: activity
                                ? [
                                      {
                                          activityId: activity.id,
                                          name: activity.name,
                                          pricePerGuestPerSession:
                                              activity.pricePerGuestPerSession,
                                          guests: values.guests,
                                          sessions: 1,
                                          totalCost: activityCost,
                                      },
                                  ]
                                : [],
                        },
                    },
                    select: {
                        id: true,
                        userId: true,
                        totalCost: true,
                    },
                });

                if (booking.userId !== user.id) {
                    throw new Error("Booking ownership mismatch.");
                }

                return {
                    status: "success",
                    bookingId: booking.id,
                    totalCost: booking.totalCost,
                };
            }
        );
    }      catch (error) {
        console.error("Booking submission failed:", error);

        return failure(
            "We could not confirm that your request was saved. Please retry without changing your selections."
        );
    }
}

