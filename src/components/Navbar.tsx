import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import logo from "../assets/logo.png";

const navLinks = [
    { key: "nav.home", href: "#home" },
    { key: "nav.about", href: "#about" },
    { key: "nav.services", href: "#services" },
    { key: "nav.quote", href: "#quote" },
    { key: "nav.tracking", href: "#tracking" },
    { key: "nav.contact", href: "#contact" },
];

function Navbar() {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    return (
        <header className="fixed left-0 top-0 z-50 w-full border-b border-white/20 bg-white/85 backdrop-blur-xl">
            <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-5 lg:px-8">
                <a href="#home" className="flex items-center gap-3">
                    <img
                        src={logo}
                        alt="Tenwa Trading and Logistics logo"
                        className="h-14 w-auto object-contain"
                    />

                    <div className="leading-none">
                        <p className="text-xl font-black tracking-tight text-[#E30613]">
                            {t("common.companyName")}
                        </p>
                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                            {t("common.logistics")}
                        </p>
                    </div>
                </a>

                <nav className="hidden items-center gap-8 lg:flex">
                    {navLinks.map((link) => (
                        <a
                            key={link.key}
                            href={link.href}
                            className="text-sm font-bold text-slate-700 transition hover:text-[#E30613]"
                        >
                            {t(link.key)}
                        </a>
                    ))}
                </nav>

                <div className="hidden items-center gap-3 lg:flex">
                    <LanguageSwitcher />

                    <a
                        href="#quote"
                        className="rounded-full bg-[#E30613] px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-500/20 transition hover:-translate-y-0.5 hover:bg-red-700"
                    >
                        {t("nav.getQuote")}
                    </a>
                </div>

                <button
                    type="button"
                    aria-label="Toggle navigation menu"
                    onClick={() => setOpen((prev) => !prev)}
                    className="rounded-2xl border border-slate-200 p-3 text-slate-800 lg:hidden"
                >
                    {open ? <X /> : <Menu />}
                </button>
            </div>

            {open && (
                <div className="border-t border-slate-100 bg-white px-5 py-5 shadow-xl lg:hidden">
                    <div className="mb-4">
                        <LanguageSwitcher />
                    </div>

                    <nav className="grid gap-3">
                        {navLinks.map((link) => (
                            <a
                                key={link.key}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="rounded-2xl bg-slate-50 px-4 py-3 font-bold text-slate-700"
                            >
                                {t(link.key)}
                            </a>
                        ))}

                        <a
                            href="#quote"
                            onClick={() => setOpen(false)}
                            className="rounded-2xl bg-[#E30613] px-4 py-3 text-center font-black text-white"
                        >
                            {t("nav.getQuote")}
                        </a>
                    </nav>
                </div>
            )}
        </header>
    );
}

export default Navbar;