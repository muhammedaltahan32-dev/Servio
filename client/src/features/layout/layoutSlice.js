import { createSlice } from "@reduxjs/toolkit";

const layoutSlice = createSlice({
	name: "layout",
	initialState: {
		mobileOpen: false,
		actionsBarContent: null,
		isActionsBarOpened: false,
	},
	reducers: {
		setActionsBarContent: (state, action) => {
			state.actionsBarContent = action.payload;
		},
		openActionsBar: (state, action) => {
			state.isActionsBarOpened = action.payload;
		},
		drawerToggle: (state) => {
			state.mobileOpen = !state.mobileOpen;
		},
		closeDrawer: (state) => {
			state.mobileOpen = false;
		},
	},
});

export const { drawerToggle, closeDrawer, setActionsBarContent, openActionsBar } = layoutSlice.actions;
export default layoutSlice.reducer;
