import { createSlice } from "@reduxjs/toolkit";

const layoutSlice = createSlice({
	name: "layout",
	initialState: {
		mobileOpen: false,
	},
	reducers: {
		drawerToggle: (state) => (state.mobileOpen = !state.mobileOpen),
	},
});

export const { drawerToggle } = layoutSlice.actions;
export default layoutSlice.reducer;
