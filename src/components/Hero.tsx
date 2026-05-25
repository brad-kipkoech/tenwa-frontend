import { ArrowRight, Plane, Ship, ShieldCheck, Truck } from "lucide-react";
import Skeleton from "./Skeleton";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import heroImage from "../assets/hero.png";

function Hero() {
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 900);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section
            id="home"
            className="relative min-h-screen overflow-hidden bg-[#061846] px-5 pt-32 text-white lg:px-8"
        >
            <div className="absolute inset-0 opacity-30">
                <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-red-600 blur-3xl" />
                <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-blue-500 blur-3xl" />
            </div>

            <div className="relative mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl items-center gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr]">
                <div>
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
                        <ShieldCheck size={17} />
                        {t("hero.badge")}
                    </div>

                    <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                        {t("hero.title")}
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                        {t("hero.description")}
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                        <a
                            href="#quote"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E30613] px-7 py-4 font-black text-white shadow-xl shadow-red-500/20 transition hover:-translate-y-1 hover:bg-red-700"
                        >
                            {t("hero.requestQuote")} <ArrowRight size={19} />
                        </a>

                        <a
                            href="#tracking"
                            className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 py-4 font-black text-white backdrop-blur transition hover:bg-white/20"
                        >
                            {t("hero.trackShipment")}
                        </a>
                    </div>

                    <div className="mt-10 grid gap-3 sm:grid-cols-3">
                        {[
                            { icon: Plane, text: t("hero.airFreight") },
                            { icon: Ship, text: t("hero.seaFreight") },
                            { icon: Truck, text: t("hero.doorDelivery") },
                        ].map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.text}
                                    className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur"
                                >
                                    <Icon className="shrink-0 text-red-400" />
                                    <span className="font-bold">{item.text}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="relative">
                    {loading ? (
                        <div className="rounded-[2rem] bg-white p-4">
                            <Skeleton className="h-[420px] w-full rounded-[1.5rem]" />
                        </div>
                    ) : (
                        <div className="rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur">
                            <div
                                className="min-h-[420px] rounded-[1.5rem] bg-cover bg-center"
                                style={{ backgroundImage: `url(${heroImage})` }}
                            />
                        </div>
                    )}

                    <div className="absolute -bottom-6 left-6 right-6 rounded-3xl bg-white p-5 text-slate-950 shadow-2xl">
                        <p className="text-sm font-bold text-slate-500">
                            {t("hero.fastQuotes")}
                        </p>
                        <p className="mt-1 text-2xl font-black">{t("hero.noAccount")}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;