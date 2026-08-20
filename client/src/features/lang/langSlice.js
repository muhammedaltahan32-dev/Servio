import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import i18n from "../../i18n.js";
import ApiService from "../../services/ApiService.js";
import { LANG_CODE } from "../../../../constants/localStorage.js";

export const changeLanguage = createAsyncThunk("language/changeLanguage", async (lang, { rejectWithValue }) => {
	try {
		const langFile = lang.endsWith(".json") ? lang : `${lang}.json`;
		const langCode = lang.replace(".json", "");
		if (!i18n.services.resourceStore.data[langCode]) {
			const translations = await ApiService.getLanguage(langFile);

			i18n.addResourceBundle(langCode, "translation", translations, true, true);
		}
		i18n.languages = langCode;
		await i18n.changeLanguage(langCode);
		localStorage.setItem(LANG_CODE, langCode);
		document.dir = langCode === "ar" ? "rtl" : "ltr";

		return langCode;
	} catch (error) {
		return rejectWithValue("Failed to load language resources");
	}
});

const initialLang = localStorage.getItem(LANG_CODE) || "en";
document.dir = initialLang === "ar" ? "rtl" : "ltr";

const languageSlice = createSlice({
	name: "language",
	initialState: {
		currentLanguage: initialLang,
		direction: initialLang === "ar" ? "rtl" : "ltr",
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(changeLanguage.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(changeLanguage.fulfilled, (state, action) => {
				state.loading = false;
				state.currentLanguage = action.payload;
				state.direction = action.payload === "ar" ? "rtl" : "ltr";
				localStorage.setItem(LANG_CODE, action.payload);
			})
			.addCase(changeLanguage.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export default languageSlice.reducer;
