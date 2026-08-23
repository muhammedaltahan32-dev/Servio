import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import i18n from "../../i18n.js";
import ApiService from "../../services/ApiService.js";
import { LANG_CODE } from "../../../../constants/localStorage.js";

export const changeLanguage = createAsyncThunk("language/changeLanguage", async (lang, { rejectWithValue }) => {
	try {
		if (!i18n.services.resourceStore.data[lang]) {
			const translations = await ApiService.getLanguage(lang);

			i18n.addResourceBundle(lang, "translation", translations, true, true);
		}
		i18n.languages = lang;
		await i18n.changeLanguage(lang);
		localStorage.setItem(LANG_CODE, lang);
		document.dir = lang === "ar" ? "rtl" : "ltr";

		return lang;
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
