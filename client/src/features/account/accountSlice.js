import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "../../services/ApiService.js";

export const registerUser = createAsyncThunk("account/registerUser", async (credentials, { rejectWithValue }) => {
	try {
		const response = await ApiService.post("user", credentials);
		return response;
	} catch (error) {
		return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Registration failed");
	}
});

const accountSlice = createSlice({
	name: "account",
	initialState: {
		user: null,
		loading: false,
		error: null,
		success: false,
	},
	reducers: {
		resetAccountState: (state) => {
			state.loading = false;
			state.error = null;
			state.success = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(registerUser.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.success = false;
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.data || action.payload;
				state.success = true;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				state.success = false;
			});
	},
});

export const { resetAccountState } = accountSlice.actions;
export default accountSlice.reducer;
