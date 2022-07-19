import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-xhr-backend';
let lang;
if (localStorage.lang == "en" || localStorage.lang == "fr") {
    lang = localStorage.lang;
} else {
    lang = "fr"
}
i18n
    // learn more: https://github.com/i18next/i18next-xhr-backend
    .use(Backend)
    // connect with React
    .use(initReactI18next)
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        debug: true,
        lng: lang,
        backend: {
            loadPath: "/translate/{{lng}}.json"
        },
        keySeparator: false,
        // whitelist: ['en', 'fr'],
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default,
            formatSeparator: ","
        },
        react: {
            wait: true,
            useSuspense: true
        }
    });
export default i18n;
