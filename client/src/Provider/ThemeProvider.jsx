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
const tableStatusColors = {
	ready: "#10B981", // جاهز
	delayed: "#EF4444", // متأخر
	preparing: "#F59E0B", // التحضير
	reserved: "#8B5CF6", // محجوز
	new: "#3B82F6", // جديد
};
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
					borderRadius: 20,
				},
				cssVariables: {
					colorSchemeSelector: "class",
				},
				colorSchemes: {
					light: {
						palette: {
							primary: { main: "#FFCC00" }, // أساسي (Fixed OCR typo: SES03S -> 5E503F)
							secondary: { main: "#5E503F" }, // ثانوي
							text: {
								primary: "#1F2937", // نص رئيسي
								secondary: "#6B7280", // نص ثانوي
							},
							background: {
								default: "#fbfbfb", // خلفية
								paper: "#FFFFFF", // خلفية أساسية
							},
							tableStatus: tableStatusColors,
						},
					},
					dark: {
						palette: {
							primary: { main: "#FFCC00" },
							secondary: { main: "#5E503F" },
							text: {
								primary: "#FFFFFF",
								secondary: "#9CA3AF",
							},
							background: {
								default: "#17181a",
								paper: "#262628",
							},
							tableStatus: tableStatusColors,
						},
					},
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
