import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "../../services/ApiService.js";

export const loginUser = createAsyncThunk("signin", async (credentials, { rejectWithValue }) => {
	try {
		const response = await ApiService.post("signin", credentials);
		return response;
	} catch (error) {
		return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Login failed");
	}
});

const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: null,
		token: localStorage.getItem("token") || null,
		isAuthenticated: !!localStorage.getItem("token"),
	},
	reducers: {
		setCredentials: (state, action) => {
			const { user, token } = action.payload;
			state.user = user;
			state.token = token;
			state.isAuthenticated = true;
			localStorage.setItem("token", token);
		},
		logout: (state) => {
			state.user = null;
			state.token = null;
			state.isAuthenticated = false;
			localStorage.removeItem("token");
		},
	},
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
