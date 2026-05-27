import { useState } from "react";
import { Boxes, Plane, Ship, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";

import cargoImage from "../assets/cargo.png";
import planeImage from "../assets/plane.png";
import roadFreightImage from "../assets/road-freight.png";

type TabKey = "sea" | "road" | "air" | "import";

const tabConfig = [
    {
        key: "sea" as TabKey,
        labelKey: "freightTabs.tabs.sea",
        contentKey: "freightTabs.content.sea",
        icon: Ship,
        image: cargoImage,
        imageAlt: "Sea freight cargo containers",
    },
    {
        key: "road" as TabKey,
        labelKey: "freightTabs.tabs.road",
        contentKey: "freightTabs.content.road",
        icon: Truck,
        image: roadFreightImage,
        imageAlt: "Truck transporting a shipping container by road",
    },
    {
        key: "air" as TabKey,
        labelKey: "freightTabs.tabs.air",
        contentKey: "freightTabs.content.air",
        icon: Plane,
        image: planeImage,
        imageAlt: "Air freight cargo plane",
    },
    {
        key: "import" as TabKey,
        labelKey: "freightTabs.tabs.import",
        contentKey: "freightTabs.content.import",
        icon: Boxes,
        image: cargoImage,
        imageAlt: "Import cargo containers and customs clearing",
    },
];

const highlights = [
    {
        titleKey: "freightTabs.highlights.speed.title",
        textKey: "freightTabs.highlights.speed.text",
    },
    {
        titleKey: "freightTabs.highlights.coverage.title",
        textKey: "freightTabs.highlights.coverage.text",
    },
    {
        titleKey: "freightTabs.highlights.support.title",
        textKey: "freightTabs.highlights.support.text",
    },
    {
        titleKey: "freightTabs.highlights.updates.title",
        textKey: "freightTabs.highlights.updates.text",
    },
];

function FreightTabs() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<TabKey>("sea");

    const activeContent =
        tabConfig.find((tab) => tab.key === activeTab) ?? tabConfig[0];

    const ActiveIcon = activeContent.icon;

    return (
        <section id="freight" className="bg-slate-50 px-5 py-24 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 max-w-3xl">
                    <p className="text-sm font-black uppercase tracking-[0.25em] text-[#E30613]">
                        {t("freightTabs.eyebrow")}
                    </p>

                    <h2 className="mt-4 text-4xl font-black tracking-tight text-[#061846] sm:text-5xl">
                        {t("freightTabs.title")}
                    </h2>

                    <p className="mt-5 text-lg leading-8 text-slate-600">
                        {t("freightTabs.description")}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    {tabConfig.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;

                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black transition ${isActive
                                        ? "bg-[#E30613] text-white shadow-lg shadow-red-500/20"
                                        : "border border-slate-200 bg-white text-slate-700 hover:border-[#E30613] hover:text-[#E30613]"
                                    }`}
                            >
                                <Icon size={18} />
                                {t(tab.labelKey)}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                    <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
                        <div className="relative min-h-[360px] overflow-hidden bg-[#061846]">
                            <img
                                src={activeContent.image}
                                alt={activeContent.imageAlt}
                                className="absolute inset-0 h-full w-full object-cover"
                            />

                            <div className="absolute inset-0 bg-gradient-to-br from-[#061846]/95 via-[#061846]/75 to-[#061846]/30" />

                            <div className="relative z-10 flex h-full min-h-[360px] flex-col justify-end p-8 text-white">
                                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-[#E30613] shadow-xl">
                                    <ActiveIcon size={32} />
                                </div>

                                <h3 className="mt-8 text-3xl font-black">
                                    {t(activeContent.labelKey)}
                                </h3>

                                <p className="mt-4 max-w-xl leading-8 text-slate-200">
                                    {t(activeContent.contentKey)}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 p-8 sm:grid-cols-2">
                            {highlights.map((item) => (
                                <div
                                    key={item.titleKey}
                                    className="rounded-3xl bg-slate-50 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                                >
                                    <p className="text-sm font-black uppercase tracking-[0.2em] text-[#E30613]">
                                        {t(item.titleKey)}
                                    </p>

                                    <p className="mt-3 text-lg font-black text-[#061846]">
                                        {t(item.textKey)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FreightTabs;