import {
    Car,
    ClipboardList,
    HeartPulse,
    Package,
    PlaneTakeoff,
    ShieldAlert,
    Skull,
    Truck,
    PawPrint,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const products = [
    {
        key: "productsHandled.items.humanRemains",
        icon: Skull,
    },
    {
        key: "productsHandled.items.liveAnimals",
        icon: PawPrint,
    },
    {
        key: "productsHandled.items.dangerousGoods",
        icon: ShieldAlert,
    },
    {
        key: "productsHandled.items.generalCargo",
        icon: Package,
    },
    {
        key: "productsHandled.items.oversizedCargo",
        icon: Truck,
    },
    {
        key: "productsHandled.items.diplomaticCargo",
        icon: ClipboardList,
    },
    {
        key: "productsHandled.items.automobiles",
        icon: Car,
    },
    {
        key: "productsHandled.items.expressCourier",
        icon: PlaneTakeoff,
    },
    {
        key: "productsHandled.items.liveHumanOrgans",
        icon: HeartPulse,
    },
];

function ProductsHandled() {
    const { t } = useTranslation();

    return (
        <section id="products" className="bg-white px-5 py-24 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-14 max-w-3xl">
                    <p className="text-sm font-black uppercase tracking-[0.25em] text-[#E30613]">
                        {t("productsHandled.eyebrow")}
                    </p>

                    <h2 className="mt-4 text-4xl font-black tracking-tight text-[#061846] sm:text-5xl">
                        {t("productsHandled.title")}
                    </h2>

                    <p className="mt-5 text-lg leading-8 text-slate-600">
                        {t("productsHandled.description")}
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => {
                        const Icon = product.icon;

                        return (
                            <article
                                key={product.key}
                                className="group rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#E30613]/30 hover:bg-white hover:shadow-xl"
                            >
                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-[#E30613] transition group-hover:bg-[#E30613] group-hover:text-white">
                                    <Icon size={26} />
                                </div>

                                <h3 className="text-xl font-black text-[#061846]">
                                    {t(product.key)}
                                </h3>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default ProductsHandled;