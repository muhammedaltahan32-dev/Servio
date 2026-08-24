import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { changeLanguage } from "../../features/lang/langSlice.js";
import { LANG_CODE } from "../../../../constants/localStorage.js";

export const useLang = () => {
	const { t, i18n } = useTranslation();
	const { currentLanguage } = useSelector((state) => state.language);
	const dispatch = useDispatch();
	const change = (lang) => {
		dispatch(changeLanguage(lang));
	};
	// cSpell:disable-next-line
	const supportedLanguages = i18n.options.supportedLngs.filter((lang) => lang !== "cimode" && lang !== false);
	return {
		t,
		changeLanguage: change,
		currentLanguage,
		i18n,
		supportedLanguages,
	};
};

export default useLang;
