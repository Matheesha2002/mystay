import "server-only";

import { notFound, redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export async function requireStaff() {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        redirect("/login");
    }

    const staffUserIds = (process.env.STAFF_USER_IDS ?? "")
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);

    if (
        !user.email_confirmed_at ||
        !staffUserIds.includes(user.id)
    ) {
        notFound();
    }

    return user;
}