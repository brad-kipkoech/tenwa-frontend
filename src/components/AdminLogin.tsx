import { useState } from "react";
import { Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

function AdminLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function loginWithGoogle() {
        setLoading(true);
        setError("");

        const redirectTo = `${window.location.origin}/admin`;

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 px-5 py-10 text-white">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
                <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="relative hidden bg-[#061846] p-10 lg:block">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#E30613_0,transparent_35%),radial-gradient(circle_at_bottom_right,#2563eb_0,transparent_35%)] opacity-60" />

                        <div className="relative z-10 flex h-full flex-col justify-between">
                            <div>
                                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-[#E30613]">
                                    <ShieldCheck size={34} />
                                </div>

                                <h1 className="mt-8 text-4xl font-black leading-tight">
                                    Tenwa Admin Control Center
                                </h1>

                                <p className="mt-5 max-w-md text-lg leading-8 text-slate-200">
                                    Secure access for authorized company leadership only.
                                    Quotes, shipments, tracking and analytics stay behind a
                                    verified Google login.
                                </p>
                            </div>

                            <p className="text-sm font-bold text-slate-300">
                                Tenwa Trading and Logistics Limited
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-8 text-slate-950 sm:p-12">
                        <div className="mx-auto max-w-md">
                            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-[#E30613]">
                                <LockKeyhole size={34} />
                            </div>

                            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#E30613]">
                                Admin Login
                            </p>

                            <h2 className="mt-4 text-4xl font-black text-[#061846]">
                                Sign in to continue.
                            </h2>

                            <p className="mt-4 leading-7 text-slate-600">
                                Use the approved Google account.
                                Unauthorized emails will be blocked.
                            </p>

                            <button
                                type="button"
                                onClick={loginWithGoogle}
                                disabled={loading}
                                className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#E30613] px-6 py-4 font-black text-white shadow-xl shadow-red-500/20 transition hover:-translate-y-0.5 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Redirecting...
                                    </>
                                ) : (
                                    "Continue with Google"
                                )}
                            </button>

                            {error && (
                                <div className="mt-5 rounded-2xl bg-red-50 p-4 font-bold text-red-700">
                                    {error}
                                </div>
                            )}

                            <a
                                href="/"
                                className="mt-6 inline-flex font-black text-[#061846] hover:text-[#E30613]"
                            >
                                Back to website
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default AdminLogin;