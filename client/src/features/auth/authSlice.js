import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "../../services/ApiService.js";
import { TOKEN, USER_INFO } from "../../../../constants/localStorage.js";
import { User_Name } from "../../../../constants/FieldsName.js";
import { Api_Signin } from "../../../../constants/SubApi.js";
const getStoredUser = () => {
	try {
		const user = localStorage.getItem(USER_INFO);
		return user ? JSON.parse(user) : null;
	} catch (error) {
		return null;
	}
};

export const loginUser = createAsyncThunk("signin", async (credentials, { rejectWithValue }) => {
	try {
		const response = await ApiService.post(Api_Signin, credentials);
		return response;
	} catch (error) {
		return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Login failed");
	}
});

const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: getStoredUser(),
		token: localStorage.getItem(TOKEN) || null,
		isAuthenticated: !!localStorage.getItem(TOKEN),
		loading: false,
		error: false,
	},
	reducers: {
		setCredentials: (state, action) => {
			const { token, ...data } = action.payload;
			const userInfo = {
				[User_Name]: data[User_Name],
			};
			state.user = userInfo;
			state.token = token;
			state.isAuthenticated = true;
			localStorage.setItem(TOKEN, token);
			localStorage.setItem(USER_INFO, JSON.stringify(userInfo));
		},
		logout: (state) => {
			state.user = null;
			state.token = null;
			state.isAuthenticated = false;
			localStorage.removeItem(TOKEN);
			localStorage.removeItem(USER_INFO);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.pending, (state) => {
				state.loading = true;
				state.error = false;
			})
			.addCase(loginUser.fulfilled, (state) => {
				state.loading = false;
				state.error = false;
			})
			.addCase(loginUser.rejected, (state) => {
				state.loading = false;
				state.error = true;
			});
	},
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
