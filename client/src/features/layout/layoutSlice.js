import { createSlice } from "@reduxjs/toolkit";

const layoutSlice = createSlice({
	name: "layout",
	initialState: {
		mobileOpen: false,
	},
	reducers: {
		drawerToggle: (state) => {
			state.mobileOpen = !state.mobileOpen;
		},
		closeDrawer: (state) => {
			state.mobileOpen = false;
		},
	},
});

export const { drawerToggle,closeDrawer } = layoutSlice.actions;
export default layoutSlice.reducer;
