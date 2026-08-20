import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {LANG_CODE} from "../../constants/localStorage.js"
i18n.use(initReactI18next).init({
	lng: localStorage.getItem(LANG_CODE) || "en",
	fallbackLng: "en",
	interpolation: {
		escapeValue: false,
	},
	resources: {},
});

export default i18n;
