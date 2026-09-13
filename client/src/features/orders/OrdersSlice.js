import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "../../services/ApiService.js";
import { Api_Order } from "../../../../constants/SubApi.js";
import { notify } from "../utils/notify.js";
import { translator } from "../utils/translator.js";

export const createOrder = createAsyncThunk("orders/create", async (data, { rejectWithValue }) => {
	try {
		return await ApiService.post(Api_Order, data);
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

const ordersSlice = createSlice({
	name: "orders",
	initialState: { items: [], loading: false, error: null },
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(createOrder.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createOrder.fulfilled, (state, action) => {
				state.loading = false;
				state.items.unshift(action.payload.data);
				notify.snackbar.success(translator(action.payload.message));
			})
			.addCase(createOrder.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message;
				notify.snackbar.error(translator(action.payload?.message));
			});
	},
});

export default ordersSlice.reducer;
