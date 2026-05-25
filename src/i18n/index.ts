import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./translations";

i18n.use(initReactI18next).init({
    resources,
    lng: localStorage.getItem("tenwa-language") || "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

const currentLanguage = i18n.language;
document.documentElement.lang = currentLanguage;
document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";

i18n.on("languageChanged", (language) => {
    localStorage.setItem("tenwa-language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
});

export default i18n;