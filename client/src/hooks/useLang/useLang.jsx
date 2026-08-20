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

	return {
		t,
		changeLanguage: change,
		currentLanguage,
		i18n,
	};
};

export default useLang;
