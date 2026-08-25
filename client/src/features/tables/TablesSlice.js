import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "../../services/ApiService.js";
import { Api_Table } from "../../../../constants/SubApi.js";
import { notify } from "../utils/notify.js";
import { translator } from "../utils/translator.js";

export const fetchTables = createAsyncThunk("tables/fetchAll", async (_, { rejectWithValue }) => {
	try {
		const response = await ApiService.get(`${Api_Table}/all`);
		return response;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

export const addTable = createAsyncThunk("tables/add", async (data, { rejectWithValue }) => {
	try {
		const response = await ApiService.post(Api_Table, data);
		return response;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

export const updateTable = createAsyncThunk("tables/update", async (tableData, { rejectWithValue }) => {
	try {
		const response = await ApiService.put(Api_Table, tableData);
		return response;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

export const deleteTable = createAsyncThunk("tables/delete", async (id, { rejectWithValue }) => {
	try {
		await ApiService.delete(`${Api_Table}/${id}`);
		return id;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

const tablesSlice = createSlice({
	name: "tables",
	initialState: {
		items: [],
		loading: false,
		error: null,
	},
	reducers: {
		setTables: (state, action) => {
			state.items = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTables.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchTables.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload.data;
				state.error = action.payload.success;
			})
			.addCase(fetchTables.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.success;
				notify.snackbar.error(translator(action.payload?.message));
			})
			// add
			.addCase(addTable.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addTable.fulfilled, (state, action) => {
				state.items.push(action.payload.data);
				notify.snackbar.success(translator(action.payload.message));
				state.loading = false;
				state.error = action.payload.success;
			})
			.addCase(addTable.rejected, (state, action) => {
				notify.snackbar.error(translator(action.payload?.message));
				state.loading = false;
				state.error = action.payload?.success;
			})
			// update
			.addCase(updateTable.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateTable.fulfilled, (state, action) => {
				const index = state.items.findIndex((item) => item.id === action.payload.data.id);
				if (index !== -1) {
					state.items[index] = action.payload.data;
				}
				notify.snackbar.success(translator(action.payload.message));
				state.loading = false;
				state.error = action.payload.success;
			})
			.addCase(updateTable.rejected, (state, action) => {
				notify.snackbar.error(translator(action.payload?.message));
				state.loading = false;
				state.error = action.payload?.success;
			})
			// delete
			.addCase(deleteTable.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteTable.fulfilled, (state, action) => {
				state.items = state.items.filter((item) => item.id !== action.payload.data);
				notify.snackbar.success(translator(action.payload?.message));
				state.loading = false;
				state.error = action.payload?.success;
			})
			.addCase(deleteTable.rejected, (state, action) => {
				notify.snackbar.error(translator(action.payload?.message));
				state.loading = false;
				state.error = action.payload?.success;
			});
	},
});

export const { setTables } = tablesSlice.actions;
export default tablesSlice.reducer;
