// cSpell:disable
import React from "react";
import { createTheme, ThemeProvider as MUThemeProvider, CssBaseline } from "@mui/material";
import { useSelector } from "react-redux";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { prefixer } from "stylis";

const cacheRtl = createCache({
	key: "muirtl",
	stylisPlugins: [prefixer, rtlPlugin],
});

const cacheLtr = createCache({
	key: "mui",
});

export const ThemeProvider = ({ children }) => {
	const direction = useSelector((state) => state.language?.direction || "ltr");

	React.useEffect(() => {
		document.dir = direction;
	}, [direction]);

	const theme = React.useMemo(
		() =>
			createTheme({
				direction,
				shape: {
					borderRadius: 8,
				},
				cssVariables: {
					colorSchemeSelector: "class",
				},
				colorSchemes: {
					light: true,
					dark: true,
				},
			}),
		[direction],
	);

	const currentCache = direction === "rtl" ? cacheRtl : cacheLtr;

	return (
		<CacheProvider value={currentCache}>
			<MUThemeProvider theme={theme} defaultMode="system">
				<CssBaseline />
				{children}
			</MUThemeProvider>
		</CacheProvider>
	);
};

export default React.memo(ThemeProvider);
