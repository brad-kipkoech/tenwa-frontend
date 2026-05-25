import { Mail, MapPin, Phone, WalletCards } from "lucide-react";
import { useTranslation } from "react-i18next";

function Footer() {
    const { t } = useTranslation();

    return (
        <footer id="contact" className="bg-[#020817] px-5 pt-20 text-white lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-10 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-4">
                <div>
                    <div className="flex items-center gap-3">
                        <img
                            src="/src/assets/logo.png"
                            alt="Tenwa logo"
                            className="h-14 w-14 rounded-full object-contain"
                        />

                        <div>
                            <h3 className="text-2xl font-black text-white">
                                {t("common.companyName")}
                            </h3>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                {t("common.logistics")}
                            </p>
                        </div>
                    </div>

                    <p className="mt-5 leading-7 text-slate-400">
                        {t("footer.description")}
                    </p>
                </div>

                <div>
                    <h4 className="mb-5 text-lg font-black">{t("footer.contact")}</h4>

                    <div className="grid gap-4 text-slate-400">
                        <p className="flex gap-3">
                            <Phone className="shrink-0 text-[#E30613]" size={20} />
                            +254 712 395 451
                        </p>

                        <p className="flex gap-3">
                            <Phone className="shrink-0 text-[#E30613]" size={20} />
                            +254 796 844 994
                        </p>

                        <p className="flex gap-3 break-all">
                            <Mail className="shrink-0 text-[#E30613]" size={20} />
                            tenwalogea.quoteske@outlook.com
                        </p>
                    </div>
                </div>

                <div>
                    <h4 className="mb-5 text-lg font-black">{t("footer.office")}</h4>

                    <p className="flex gap-3 leading-7 text-slate-400">
                        <MapPin className="shrink-0 text-[#E30613]" size={20} />
                        {t("footer.officeLocation")}
                    </p>

                    <div className="mt-6">
                        <h5 className="font-black text-white">{t("footer.leadership")}</h5>
                        <p className="mt-2 text-slate-400">{t("footer.ceo")}</p>
                        <p className="text-slate-400">{t("footer.coo")}</p>
                    </div>
                </div>

                <div>
                    <h4 className="mb-5 text-lg font-black">
                        {t("footer.paymentDetails")}
                    </h4>

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#E30613]">
                            <WalletCards />
                        </div>

                        <p className="text-sm font-bold text-slate-400">
                            {t("footer.bank")}
                        </p>
                        <p className="font-black text-white">{t("footer.bankName")}</p>

                        <p className="mt-4 text-sm font-bold text-slate-400">
                            {t("footer.accountNumber")}
                        </p>
                        <p className="font-black text-white">7718050858</p>

                        <p className="mt-4 text-sm font-bold text-slate-400">
                            {t("footer.accountName")}
                        </p>
                        <p className="font-black text-white">
                            {t("footer.accountNameValue")}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mx-auto flex max-w-7xl flex-col gap-3 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
                <p>
                    © {new Date().getFullYear()} {t("common.companyFullName")}.{" "}
                    {t("footer.rights")}
                </p>
                <p>{t("footer.slogan")}</p>
            </div>
        </footer>
    );
}

export default Footer;