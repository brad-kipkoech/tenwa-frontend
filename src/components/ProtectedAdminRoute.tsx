import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import AdminLogin from "./AdminLogin";

type ProtectedAdminRouteProps = {
    children: React.ReactNode;
};

function getAllowedAdminEmails() {
    return String(import.meta.env.VITE_ADMIN_ALLOWED_EMAILS || "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);
}

function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
    const allowedEmails = useMemo(() => getAllowedAdminEmails(), []);

    const [loading, setLoading] = useState(true);
    const [isAllowed, setIsAllowed] = useState(false);
    const [blockedEmail, setBlockedEmail] = useState("");

    useEffect(() => {
        let mounted = true;

        async function checkSession() {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            const email = session?.user?.email?.toLowerCase() || "";

            if (!mounted) return;

            if (session?.access_token) {
                localStorage.setItem("tenwaAdminToken", session.access_token);
            } else {
                localStorage.removeItem("tenwaAdminToken");
            }

            if (email && allowedEmails.includes(email)) {
                setIsAllowed(true);
            } else {
                setIsAllowed(false);
                setBlockedEmail(email);
            }

            setLoading(false);
        }

        checkSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            const email = session?.user?.email?.toLowerCase() || "";

            if (session?.access_token) {
                localStorage.setItem("tenwaAdminToken", session.access_token);
            } else {
                localStorage.removeItem("tenwaAdminToken");
            }

            if (email && allowedEmails.includes(email)) {
                setIsAllowed(true);
                setBlockedEmail("");
            } else {
                setIsAllowed(false);
                setBlockedEmail(email);
            }

            setLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [allowedEmails]);

    async function signOut() {
        await supabase.auth.signOut();
        localStorage.removeItem("tenwaAdminToken");
        setIsAllowed(false);
    }

    if (loading) {
        return (
            <main className="grid min-h-screen place-items-center bg-slate-950 text-white">
                <div className="flex items-center gap-3 font-black">
                    <Loader2 className="animate-spin text-[#E30613]" />
                    Checking admin access...
                </div>
            </main>
        );
    }

    if (!isAllowed) {
        return (
            <>
                <AdminLogin />

                {blockedEmail && (
                    <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-2xl border border-red-200 bg-white p-4 text-center font-bold text-red-700 shadow-2xl">
                        {blockedEmail} is not authorized to access Tenwa Admin.
                        <button
                            type="button"
                            onClick={signOut}
                            className="ml-3 rounded-full bg-red-50 px-4 py-2 text-sm font-black text-[#E30613]"
                        >
                            Sign out
                        </button>
                    </div>
                )}
            </>
        );
    }

    return <>{children}</>;
}

export default ProtectedAdminRoute;