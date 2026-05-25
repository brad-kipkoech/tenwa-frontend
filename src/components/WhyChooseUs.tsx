import { Clock, Globe2, ShieldCheck, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import heroImage from "../assets/hero.png";

const reasons = [
    {
        titleKey: "whyChooseUs.reasons.reliable.title",
        textKey: "whyChooseUs.reasons.reliable.text",
        icon: ShieldCheck,
    },
    {
        titleKey: "whyChooseUs.reasons.updates.title",
        textKey: "whyChooseUs.reasons.updates.text",
        icon: Clock,
    },
    {
        titleKey: "whyChooseUs.reasons.coverage.title",
        textKey: "whyChooseUs.reasons.coverage.text",
        icon: Globe2,
    },
    {
        titleKey: "whyChooseUs.reasons.business.title",
        textKey: "whyChooseUs.reasons.business.text",
        icon: TrendingUp,
    },
];

function WhyChooseUs() {
    const { t } = useTranslation();

    return (
        <section className="relative overflow-hidden bg-[#061846] px-5 py-24 text-white lg:px-8">
            <div className="absolute inset-0 opacity-20">
                <img
                    src={heroImage}
                    alt=""
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-[#061846] via-[#061846]/95 to-[#020817]" />

            <div className="relative mx-auto max-w-7xl">
                <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.25em] text-red-300">
                            {t("whyChooseUs.eyebrow")}
                        </p>

                        <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                            {t("whyChooseUs.title")}
                        </h2>

                        <p className="mt-6 text-lg leading-8 text-slate-200">
                            {t("whyChooseUs.description")}
                        </p>

                        <a
                            href="#quote"
                            className="mt-8 inline-flex rounded-full bg-[#E30613] px-7 py-4 font-black text-white shadow-xl shadow-red-500/20 transition hover:-translate-y-1 hover:bg-red-700"
                        >
                            {t("whyChooseUs.cta")}
                        </a>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        {reasons.map((reason) => {
                            const Icon = reason.icon;

                            return (
                                <div
                                    key={reason.titleKey}
                                    className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
                                >
                                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#E30613]">
                                        <Icon />
                                    </div>

                                    <h3 className="text-xl font-black">
                                        {t(reason.titleKey)}
                                    </h3>

                                    <p className="mt-3 leading-7 text-slate-200">
                                        {t(reason.textKey)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WhyChooseUs;