import React from "react";
import { LANG_CODE } from "../../../constants/localStorage.js";
import { useLang } from "@hooks";
import ApiService from "../services/ApiService.js";
const savedLanguage = localStorage.getItem(LANG_CODE) || "en";
const language = ApiService.getLanguage(savedLanguage);
export const LanguagesProvider = ({ children }) => {
	const { currentLanguage, changeLanguage } = useLang();
	const lang = React.use(language);
	React.useEffect(() => {
		changeLanguage(savedLanguage);
	}, [changeLanguage]);
	return children;
};

export default LanguagesProvider;
