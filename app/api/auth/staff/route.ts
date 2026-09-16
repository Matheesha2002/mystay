import { createClient } from "../../../lib/supabase/server";

export async function GET() {
    const headers = {
        "Cache-Control": "private, no-store",
    };

    try {
        const supabase = await createClient();

        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (error || !user) {
            return Response.json(
                { isStaff: false },
                { headers }
            );
        }

        const staffUserIds = (process.env.STAFF_USER_IDS ?? "")
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean);

        const isStaff =
            Boolean(user.email_confirmed_at) &&
            staffUserIds.includes(user.id);

        return Response.json({ isStaff }, { headers });
    } catch {
        return Response.json(
            { isStaff: false },
            { status: 503, headers }
        );
    }
}