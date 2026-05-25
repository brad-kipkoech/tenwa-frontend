import { Globe2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const languages = [
    { code: "en", label: "English", short: "EN" },
    { code: "sw", label: "Kiswahili", short: "SW" },
    { code: "fr", label: "Français", short: "FR" },
    { code: "zh", label: "中文", short: "ZH" },
    { code: "ar", label: "العربية", short: "AR" },
    { code: "es", label: "Español", short: "ES" },
    { code: "de", label: "Deutsch", short: "DE" },
];

function LanguageSwitcher() {
    const { i18n, t } = useTranslation();

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        i18n.changeLanguage(e.target.value);
    }

    return (
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-[#E30613]">
            <Globe2 size={17} className="text-[#E30613]" />

            <label htmlFor="language" className="sr-only">
                {t("language.label")}
            </label>

            <select
                id="language"
                value={i18n.language}
                onChange={handleChange}
                className="bg-transparent text-sm font-black outline-none"
            >
                {languages.map((language) => (
                    <option key={language.code} value={language.code}>
                        {language.short}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default LanguageSwitcher;