import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "../../services/ApiService.js";
import { Api_MenuItem } from "../../../../constants/SubApi.js";
import { notify } from "../utils/notify.js";
import { translator } from "../utils/translator.js";

export const fetchMenuItems = createAsyncThunk("menuItems/fetchAll", async (_, { rejectWithValue }) => {
	try {
		const response = await ApiService.get(`${Api_MenuItem}/all`);
		console.log("fetchMenuItems response:", response);
		return response;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

export const addMenuItem = createAsyncThunk("menuItems/add", async (data, { rejectWithValue }) => {
	try {
		const response = await ApiService.post(Api_MenuItem, data);
		return response;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

export const updateMenuItem = createAsyncThunk("menuItems/update", async (menuItemData, { rejectWithValue }) => {
	try {
		const response = await ApiService.put(Api_MenuItem, menuItemData);
		return response;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

export const deleteMenuItem = createAsyncThunk("menuItems/delete", async (id, { rejectWithValue }) => {
	try {
		await ApiService.delete(`${Api_MenuItem}/${id}`);
		return id;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

const menuItemsSlice = createSlice({
	name: "menuItems",
	initialState: {
		items: [],
		loading: false,
		error: null,
	},
	reducers: {
		setMenuItems: (state, action) => {
			state.items = action.payload.data;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchMenuItems.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchMenuItems.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload.data;
				state.error = action.payload.success;
			})
			.addCase(fetchMenuItems.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.success;
				notify.snackbar.error(translator(action.payload?.message));
			})
			// add
			.addCase(addMenuItem.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addMenuItem.fulfilled, (state, action) => {
				state.items.push(action.payload.data);
				notify.snackbar.success(translator(action.payload.message));
				state.loading = false;
				state.error = action.payload.success;
			})
			.addCase(addMenuItem.rejected, (state, action) => {
				notify.snackbar.error(translator(action.payload?.message));
				state.loading = false;
				state.error = action.payload?.success;
			})
			// update
			.addCase(updateMenuItem.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateMenuItem.fulfilled, (state, action) => {
				const index = state.items.findIndex((item) => item.id === action.payload.data.id);
				if (index !== -1) {
					state.items[index] = action.payload.data;
				}
				notify.snackbar.success(translator(action.payload.message));
				state.loading = false;
				state.error = action.payload.success;
			})
			.addCase(updateMenuItem.rejected, (state, action) => {
				notify.snackbar.error(translator(action.payload?.message));
				state.loading = false;
				state.error = action.payload?.success;
			})
			// delete
			.addCase(deleteMenuItem.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteMenuItem.fulfilled, (state, action) => {
				state.items = state.items.filter((item) => item.id !== action.payload.data);
				notify.snackbar.success(translator(action.payload?.message));
				state.loading = false;
				state.error = action.payload?.success;
			})
			.addCase(deleteMenuItem.rejected, (state, action) => {
				notify.snackbar.error(translator(action.payload?.message));
				state.loading = false;
				state.error = action.payload?.success;
			});
	},
});

export const { setMenuItems } = menuItemsSlice.actions;
export default menuItemsSlice.reducer;
