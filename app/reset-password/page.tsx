import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ResetPasswordForm from "../components/ResetPasswordForm";
import { createClient } from "../lib/supabase/server";

export default async function ResetPasswordPage() {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user || !user.email) {
        redirect("/forgot-password");
    }

    return (
        <div className="flex min-h-screen flex-col bg-[#F8F6EF] text-[#173F35]">
            <Navbar />

            <main className="mx-auto w-full max-w-md flex-1 px-6 py-16">
                <h1 className="text-4xl font-bold">
                    Reset password
                </h1>

                <p className="mt-4 text-gray-600">
                    Choose a new password for your MyStay account.
                </p>

                <ResetPasswordForm
                    userId={user.id}
                    email={user.email}
                />
            </main>

            <Footer />
        </div>
    );
}