import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "../../services/ApiService.js";
import { Api_Category } from "../../../../constants/SubApi.js";
import { enqueueSnackbar } from "notistack";
import { useLang } from "@hooks";
import { notify } from "../utils/notify.js";
import { translator } from "../utils/translator.js";

export const fetchCategories = createAsyncThunk("categories/fetchAll", async (_, { rejectWithValue }) => {
	try {
		const response = await ApiService.get(`${Api_Category}/all`);
		return response;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

export const addCategory = createAsyncThunk("categories/add", async (data, { rejectWithValue }) => {
	try {
		const response = await ApiService.post(Api_Category, data);
		return response;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

export const updateCategory = createAsyncThunk("categories/update", async (categoryData, { rejectWithValue }) => {
	try {
		const response = await ApiService.put(Api_Category, categoryData);
		return response;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

export const deleteCategory = createAsyncThunk("categories/delete", async (id, { rejectWithValue }) => {
	try {
		const response = await ApiService.delete(`${Api_Category}/${id}`);
		return response;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

const categoriesSlice = createSlice({
	name: "categories",
	initialState: {
		items: [],
		loading: false,
		error: null,
	},
	reducers: {
		setCategories: (state, action) => {
			state.items = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCategories.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchCategories.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload.data;
				state.error = action.payload.success;
			})
			.addCase(fetchCategories.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload.success;
				notify.snackbar.error(translator(action.payload.message));
			})
			// ============================== add
			.addCase(addCategory.pending, (state, action) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addCategory.fulfilled, (state, action) => {
				state.items.push(action.payload.data);
				notify.snackbar.success(translator(action.payload.message));
				state.loading = false;
				state.error = action.payload.success;
			})
			.addCase(addCategory.rejected, (state, action) => {
				notify.snackbar.error(translator(action.payload.message));
				state.loading = false;
				state.error = action.payload.success;
			})
			// ============================ update
			.addCase(updateCategory.pending, (state, action) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateCategory.fulfilled, (state, action) => {
				const index = state.items.findIndex((item) => item.id === action.payload.data.id);
				if (index !== -1) {
					state.items[index] = action.payload.data;
				}
				notify.snackbar.success(translator(action.payload.message));
				state.loading = false;
				state.error = action.payload.success;
			})
			.addCase(updateCategory.rejected, (state, action) => {
				notify.snackbar.error(translator(action.payload.message));
				state.loading = false;
				state.error = action.payload.success;
			})
			// =========================== delete
			.addCase(deleteCategory.pending, (state, action) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteCategory.fulfilled, (state, action) => {
				state.items = state.items.filter((item) => item.id != action.payload.data);
				notify.snackbar.success(translator(action.payload.message));
				state.loading = false;
				state.error = action.payload.success;
			})
			.addCase(deleteCategory.rejected, (state, action) => {
				notify.snackbar.error(translator(action.payload.message));
				state.loading = false;
				state.error = action.payload.success;
			});
	},
});
export const { setCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
