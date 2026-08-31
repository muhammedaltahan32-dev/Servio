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
		const response = await ApiService.delete(`${Api_Table}/${id}`);
		return response;
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
		connectionState: "connecting",
	},
	reducers: {
		// Socket listener will dispatch this reducer
		setTables: (state, action) => {
			state.items = action.payload;
			state.loading = false;
		},
		setConnectionState: (state, action) => {
			state.connectionState = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch All
			.addCase(fetchTables.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchTables.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload?.data ?? action.payload ?? [];
			})
			.addCase(fetchTables.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message;
				notify.snackbar.error(translator(action.payload?.message));
			})

			// Add Table
			.addCase(addTable.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addTable.fulfilled, (state, action) => {
				state.loading = false;
				notify.snackbar.success(translator(action.payload?.message));
				// Array update is omitted here — socket handles state update
			})
			.addCase(addTable.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message;
				notify.snackbar.error(translator(action.payload?.message));
			})

			// Update Table
			.addCase(updateTable.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateTable.fulfilled, (state, action) => {
				state.loading = false;
				notify.snackbar.success(translator(action.payload?.message));
				// Array update is omitted here — socket handles state update
			})
			.addCase(updateTable.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message;
				notify.snackbar.error(translator(action.payload?.message));
			})

			// Delete Table
			.addCase(deleteTable.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteTable.fulfilled, (state, action) => {
				state.loading = false;
				notify.snackbar.success(translator(action.payload?.message));
				// Array update is omitted here — socket handles state update
			})
			.addCase(deleteTable.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message;
				notify.snackbar.error(translator(action.payload?.message));
			});
	},
});

export const { setTables, setConnectionState } = tablesSlice.actions;
export default tablesSlice.reducer;
