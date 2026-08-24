import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "../../services/ApiService.js";
import { Api_Category } from "../../../../constants/SubApi.js";

export const fetchCategories = createAsyncThunk("categories/fetchAll", async (_, { rejectWithValue }) => {
	try {
		const response = await ApiService.get(`${Api_Category}/all`);
		return response.data || response;
	} catch (error) {
		return rejectWithValue(error.response?.data?.message || "Failed to fetch categories");
	}
});

export const addCategory = createAsyncThunk("categories/add", async (data, { rejectWithValue }) => {
	try {
		const response = await ApiService.post(Api_Category, data);
		return response.data || response;
	} catch (error) {
		return rejectWithValue(error.response?.data?.message || "Failed to add category");
	}
});

export const updateCategory = createAsyncThunk("categories/update", async (categoryData, { rejectWithValue }) => {
	try {
		const response = await ApiService.put(Api_Category, categoryData);
		return response.data || response;
	} catch (error) {
		return rejectWithValue(error.response?.data?.message || "Failed to update category");
	}
});

export const deleteCategory = createAsyncThunk("categories/delete", async (id, { rejectWithValue }) => {
	try {
		await ApiService.delete(`${Api_Category}/${id}`);
		return id;
	} catch (error) {
		return rejectWithValue(error.response?.data?.message || "Failed to delete category");
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
				state.items = action.payload;
			})
			.addCase(fetchCategories.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(addCategory.fulfilled, (state, action) => {
				state.items.push(action.payload);
			})
			.addCase(updateCategory.fulfilled, (state, action) => {
				const index = state.items.findIndex((item) => item.id === action.payload.id);

				if (index !== -1) {
					state.items[index] = action.payload;
				}
			})
			.addCase(deleteCategory.fulfilled, (state, action) => {
				state.items = state.items.filter((item) => item.id !== action.payload);
			});
	},
});
export const { setCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
