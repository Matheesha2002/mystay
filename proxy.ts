import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!url || !key) {
        throw new Error("Supabase URL or publishable key is missing.");
    }

    let response = NextResponse.next({
        request,
    });

    const supabase = createServerClient(url, key, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },

            setAll(cookiesToSet) {
                // Server එකට යන request එක යාවත්කාලීන කරනවා.
                cookiesToSet.forEach(({ name, value }) => {
                    request.cookies.set(name, value);
                });

                response = NextResponse.next({
                    request,
                });

                // Browser එකට යවන cookies යාවත්කාලීන කරනවා.
                cookiesToSet.forEach(({ name, value, options }) => {
                    response.cookies.set(name, value, options);
                });

                response.headers.set("Cache-Control", "private, no-store");
            },
        },
    });

    // Login token එක පරීක්ෂා කර අවශ්‍ය නම් refresh කරනවා.
    await supabase.auth.getClaims();

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};