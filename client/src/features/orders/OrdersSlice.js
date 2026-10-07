import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "../../services/ApiService.js";
import { Api_Order } from "../../../../constants/SubApi.js";
import { notify } from "../utils/notify.js";
import { translator } from "../utils/translator.js";

export const createOrder = createAsyncThunk("orders/create", async (data, { rejectWithValue }) => {
	try {
		return await ApiService.post(Api_Order, data);
	} catch (error) {
		return rejectWithValue(error?.response?.data || { message: error.message });
	}
});

export const fetchOrders = createAsyncThunk("orders/fetchAll", async (_, { rejectWithValue }) => {
	try {
		return await ApiService.get(`${Api_Order}/all`);
	} catch (error) {
		return rejectWithValue(error?.response?.data || { message: error.message });
	}
});

export const updateOrderStatus = createAsyncThunk("orders/updateStatus", async (data, { rejectWithValue }) => {
	try {
		return await ApiService.patch(Api_Order, data);
	} catch (error) {
		return rejectWithValue(error?.response?.data || { message: error.message });
	}
});

const ordersSlice = createSlice({
	name: "orders",
	initialState: { items: [], loading: false, fetching: false, updatingIds: [], error: null },
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(createOrder.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createOrder.fulfilled, (state, action) => {
				state.loading = false;
				if (action.payload?.data) state.items.unshift(action.payload.data);
				notify.snackbar.success(translator(action.payload.message));
			})
			.addCase(createOrder.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message || action.error.message;
				notify.snackbar.error(translator(state.error));
			})
			.addCase(fetchOrders.pending, (state) => {
				state.fetching = true;
				state.error = null;
			})
			.addCase(fetchOrders.fulfilled, (state, action) => {
				state.fetching = false;
				state.items = action.payload.data;
			})
			.addCase(fetchOrders.rejected, (state, action) => {
				state.fetching = false;
				state.error = action.payload?.message || action.error.message;
				notify.snackbar.error(translator(state.error));
			})
			.addCase(updateOrderStatus.pending, (state, action) => {
				state.error = null;
				const id = action.meta.arg.id;
				if (!state.updatingIds.some((updatingId) => String(updatingId) === String(id))) {
					state.updatingIds.push(id);
				}
			})
			.addCase(updateOrderStatus.fulfilled, (state, action) => {
				const id = action.meta.arg.id;
				state.updatingIds = state.updatingIds.filter((updatingId) => String(updatingId) !== String(id));
				const updatedOrder = action.payload?.data;
				const index = state.items.findIndex((order) => String(order.id) === String(updatedOrder?.id ?? id));
				if (index !== -1 && updatedOrder) state.items[index] = { ...state.items[index], ...updatedOrder };
				notify.snackbar.success(translator(action.payload?.message || "orders.statusUpdated"));
			})
			.addCase(updateOrderStatus.rejected, (state, action) => {
				const id = action.meta.arg.id;
				state.updatingIds = state.updatingIds.filter((updatingId) => String(updatingId) !== String(id));
				state.error = action.payload?.message || action.error.message;
				notify.snackbar.error(translator(state.error));
			});
	},
});

export default ordersSlice.reducer;
