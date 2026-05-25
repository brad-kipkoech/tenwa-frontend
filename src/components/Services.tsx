import { ArrowRight, Boxes, Plane, Ship, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";

import planeImage from "../assets/plane.png";
import cargoImage from "../assets/cargo.png";
import heroImage from "../assets/hero.png";

const services = [
    {
        titleKey: "services.items.airFreight.title",
        descriptionKey: "services.items.airFreight.description",
        icon: Plane,
        image: planeImage,
    },
    {
        titleKey: "services.items.seaFreight.title",
        descriptionKey: "services.items.seaFreight.description",
        icon: Ship,
        image: cargoImage,
    },
    {
        titleKey: "services.items.roadFreight.title",
        descriptionKey: "services.items.roadFreight.description",
        icon: Truck,
        image: cargoImage,
    },
    {
        titleKey: "services.items.clearing.title",
        descriptionKey: "services.items.clearing.description",
        icon: Boxes,
        image: heroImage,
    },
];

function Services() {
    const { t } = useTranslation();

    return (
        <section id="services" className="bg-slate-50 px-5 py-24 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-14 max-w-3xl">
                    <p className="text-sm font-black uppercase tracking-[0.25em] text-[#E30613]">
                        {t("services.eyebrow")}
                    </p>

                    <h2 className="mt-4 text-4xl font-black tracking-tight text-[#061846] sm:text-5xl">
                        {t("services.title")}
                    </h2>

                    <p className="mt-5 text-lg leading-8 text-slate-600">
                        {t("services.description")}
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {services.map((service) => {
                        const Icon = service.icon;
                        const title = t(service.titleKey);

                        return (
                            <article
                                key={service.titleKey}
                                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                            >
                                <div className="relative h-56 overflow-hidden bg-slate-100">
                                    <img
                                        src={service.image}
                                        alt={title}
                                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-[#061846]/35 via-transparent to-transparent" />
                                </div>

                                <div className="p-6">
                                    <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-red-50 text-[#E30613]">
                                        <Icon size={28} />
                                    </div>

                                    <h3 className="text-2xl font-black text-[#061846]">
                                        {title}
                                    </h3>

                                    <p className="mt-3 leading-7 text-slate-600">
                                        {t(service.descriptionKey)}
                                    </p>

                                    <a
                                        href="#quote"
                                        className="mt-6 inline-flex items-center gap-2 font-black text-[#E30613]"
                                    >
                                        {t("services.requestQuote")} <ArrowRight size={18} />
                                    </a>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default Services;