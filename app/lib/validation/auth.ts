import { z } from "zod";

export const registerSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(1, "Please enter your full name.")
        .max(100, "Your name must be 100 characters or fewer."),

    email: z
        .string()
        .trim()
        .email("Please enter a valid email address."),

    password: z
        .string()
        .min(8, "Use at least 8 characters for your password.")
        .max(128, "Your password must be 128 characters or fewer."),
});