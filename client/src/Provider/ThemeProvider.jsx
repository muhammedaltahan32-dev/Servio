import React from "react";
import { createTheme, ThemeProvider as MUThemeProvider, useColorScheme, CssBaseline } from "@mui/material";
import { useSelector } from "react-redux";

const theme = createTheme({
	colorSchemes: {
		dark: true,
	},
});

const ThemeApplier = ({ children }) => {
	const { mode: themeMode } = useSelector((state) => state.theme);
	const { mode, setMode } = useColorScheme();

	React.useEffect(() => {
		if (themeMode) {
			setMode(themeMode);
		}
	}, [themeMode, setMode]);

	return children;
};

export const ThemeProvider = ({ children }) => {
	return (
		<MUThemeProvider theme={theme}>
			<CssBaseline />
			<ThemeApplier>{children}</ThemeApplier>
		</MUThemeProvider>
	);
};

export default ThemeProvider;
