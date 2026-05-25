import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import cargoImage from "../assets/cargo.png";

const valueKeys = [
    "about.values.integrity",
    "about.values.efficiency",
    "about.values.customerFocus",
    "about.values.communication",
];

function About() {
    const { t } = useTranslation();

    return (
        <section id="about" className="bg-white px-5 py-24 lg:px-8">
            <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="relative">
                    <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-red-100 blur-2xl" />
                    <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-blue-100 blur-2xl" />

                    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-2xl">
                        <img
                            src={cargoImage}
                            alt={t("about.eyebrow")}
                            className="h-[520px] w-full object-cover"
                        />
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 rounded-3xl bg-white/90 p-5 shadow-xl backdrop-blur">
                        <p className="text-sm font-bold text-slate-500">
                            {t("about.establishedLabel")}
                        </p>

                        <p className="text-3xl font-black text-[#061846]">
                            {t("about.establishedYear")}
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                            {t("about.establishedText")}
                        </p>
                    </div>
                </div>

                <div>
                    <p className="text-sm font-black uppercase tracking-[0.25em] text-[#E30613]">
                        {t("about.eyebrow")}
                    </p>

                    <h2 className="mt-4 text-4xl font-black tracking-tight text-[#061846] sm:text-5xl">
                        {t("about.title")}
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        {t("about.paragraph1")}
                    </p>

                    <p className="mt-4 text-lg leading-8 text-slate-600">
                        {t("about.paragraph2")}
                    </p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        {valueKeys.map((key) => (
                            <div
                                key={key}
                                className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4"
                            >
                                <CheckCircle2 className="shrink-0 text-[#E30613]" />
                                <span className="font-bold text-slate-700">{t(key)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;