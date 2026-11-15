import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "../../services/ApiService.js";
import { Api_User } from "../../../../constants/SubApi.js";
import { notify } from "../utils/notify.js";
import { translator } from "../utils/translator.js";

export const fetchUsers = createAsyncThunk("users/fetchAll", async (_, { rejectWithValue }) => {
	try {
		const response = await ApiService.get(`${Api_User}/all`);
		return response;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

export const addUser = createAsyncThunk("users/add", async (data, { rejectWithValue }) => {
	try {
		const response = await ApiService.post(Api_User, data);
		return response;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

export const updateUser = createAsyncThunk("users/update", async (userData, { rejectWithValue }) => {
	try {
		const response = await ApiService.put(Api_User, userData);
		return response;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

export const deleteUser = createAsyncThunk("users/delete", async (id, { rejectWithValue }) => {
	try {
		const response = await ApiService.delete(`${Api_User}/${id}`);
		return response;
	} catch (error) {
		return rejectWithValue(error?.response?.data);
	}
});

const usersSlice = createSlice({
	name: "users",
	initialState: {
		items: [],
		loading: false,
		error: null,
		connectionState: "connecting",
	},
	reducers: {
		// Socket listener will dispatch this reducer
		setUsers: (state, action) => {
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
			.addCase(fetchUsers.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchUsers.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload?.data ?? action.payload ?? [];
			})
			.addCase(fetchUsers.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message;
				notify.snackbar.error(translator(action.payload?.message));
			})

			// Add User
			.addCase(addUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addUser.fulfilled, (state, action) => {
				state.loading = false;
				if (action.payload?.data) {
					state.items.push(action.payload.data);
				}
				notify.snackbar.success(translator(action.payload?.message));
			})
			.addCase(addUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message;
				notify.snackbar.error(translator(action.payload?.message));
			})

			// Update User
			.addCase(updateUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateUser.fulfilled, (state, action) => {
				state.loading = false;
				const updatedUser = action.payload?.data ?? action.meta.arg;
				if (updatedUser?.id !== undefined) {
					const index = state.items.findIndex((item) => String(item.id) === String(updatedUser.id));
					if (index !== -1) {
						state.items[index] = { ...state.items[index], ...updatedUser };
					}
				}
				notify.snackbar.success(translator(action.payload?.message));
			})
			.addCase(updateUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message;
				notify.snackbar.error(translator(action.payload?.message));
			})

			// Delete User
			.addCase(deleteUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteUser.fulfilled, (state, action) => {
				state.loading = false;
				const deletedId = action.payload?.data ?? action.meta.arg;
				state.items = state.items.filter((item) => String(item.id) !== String(deletedId));
				notify.snackbar.success(translator(action.payload?.message));
			})
			.addCase(deleteUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message;
				notify.snackbar.error(translator(action.payload?.message));
			});
	},
});

export const { setUsers, setConnectionState } = usersSlice.actions;
export default usersSlice.reducer;
