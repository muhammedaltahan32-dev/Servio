// cSpell:disable
import React from "react";
import { createTheme, ThemeProvider as MUThemeProvider, CssBaseline } from "@mui/material";
import { useSelector } from "react-redux";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { prefixer } from "stylis";
import {
	cloneThemeSettings,
	DEFAULT_THEME_SETTINGS,
	buildShadowValue,
	mergePaletteSettings,
	mergeThemeSettings,
	THEME_PRESETS,
	ThemeCustomizationProvider,
} from "./themeCustomization.js";

const cacheRtl = createCache({
	key: "muirtl",
	stylisPlugins: [prefixer, rtlPlugin],
});

const cacheLtr = createCache({
	key: "mui",
});

const tableStatusColors = {
	ready: "#188A70",
	Available: "#188A70",
	delayed: "#D94F68",
	preparing: "#C8862D",
	Needs_Cleaning: "#C8862D",
	reserved: "#3E7BFA",
	new: "#3979C5",
	occupied: "#D36B50",
	Occupied: "#D36B50",
};

const tableStatusColorsDark = {
	ready: "#56C7A7",
	Available: "#56C7A7",
	delayed: "#F07D91",
	preparing: "#E6AE5C",
	Needs_Cleaning: "#E6AE5C",
	reserved: "#83A8FF",
	new: "#83A8FF",
	occupied: "#EF907B",
	Occupied: "#EF907B",
};

const THEME_SETTINGS_STORAGE_KEY = "servio-theme-settings";

const loadThemeSettings = () => {
	try {
		const stored = localStorage.getItem(THEME_SETTINGS_STORAGE_KEY);
		if (!stored) return cloneThemeSettings(DEFAULT_THEME_SETTINGS);

		const savedSettings = JSON.parse(stored);
		const settings = mergeThemeSettings(DEFAULT_THEME_SETTINGS, savedSettings);
		if (savedSettings.presetName === "default") {
			settings.tokens.shadowControls = cloneThemeSettings(DEFAULT_THEME_SETTINGS.tokens.shadowControls);
		}
		return settings;
	} catch {
		return cloneThemeSettings(DEFAULT_THEME_SETTINGS);
	}
};

export const ThemeProvider = ({ children }) => {
	const direction = useSelector((state) => state.language?.direction || "ltr");
	const [themeSettings, setThemeSettings] = React.useState(loadThemeSettings);
	const saveThemeSettings = React.useCallback((settings) => {
		const normalized = mergeThemeSettings(DEFAULT_THEME_SETTINGS, settings);
		localStorage.setItem(THEME_SETTINGS_STORAGE_KEY, JSON.stringify(normalized));
		setThemeSettings(normalized);
	}, []);
	const resetThemeSettings = React.useCallback(() => {
		const defaults = cloneThemeSettings(DEFAULT_THEME_SETTINGS);
		localStorage.removeItem(THEME_SETTINGS_STORAGE_KEY);
		setThemeSettings(defaults);
		return defaults;
	}, []);

	React.useEffect(() => {
		document.documentElement.dir = direction;
		document.documentElement.lang = direction === "rtl" ? "ar" : "en";
		document.body.dir = direction;
	}, [direction]);

	const theme = React.useMemo(
		() =>
			createTheme({
				direction,
				tokens: {
					...themeSettings.tokens,
					shadow: Object.fromEntries(
						Object.entries(themeSettings.tokens.shadowControls).map(([name, settings]) => [name, buildShadowValue(settings)]),
					),
				},
				layout: {
					"desktop-appbar-height": themeSettings.tokens.size.appBarHeight,
					"desktop-drawer-width": themeSettings.tokens.size.desktopDrawerWidth,
					"mobile-drawer-width": themeSettings.tokens.size.mobileDrawerWidth,
					"desktop-actions-bar-width": themeSettings.tokens.size.actionsBarWidth,
				},
				shape: {
					borderRadius: themeSettings.tokens.radius.control,
				},

				cssVariables: {
					colorSchemeSelector: "class",
				},

				colorSchemes: {
					light: {
						palette: mergePaletteSettings({
							primary: {
								main: "#0D8A68",
								light: "#35B88F",
								dark: "#086A50",
								gradient: (theme) => `linear-gradient(
  0deg,
  ${theme.palette.primary.main} 0%,
  ${theme.palette.primary.light} 100%
)`,
								contrastText: "#FFFFFF",
							},

							secondary: {
								contrastText: "#342B2A",
								dark: "#BB6547",
								light: "#FCEEE8",
								main: "#DD8060",
							},

							success: {
								main: "#188A70",
								light: "#E6F5F0",
								dark: "#116A56",
								contrastText: "#FFFFFF",
							},

							warning: {
								main: "#C8862D",
								light: "#FBF2E4",
								dark: "#A86716",
								contrastText: "#171717",
							},

							error: {
								main: "#D94F5C",
								light: "#FBEAEC",
								dark: "#B93644",
								contrastText: "#FFFFFF",
							},

							info: {
								main: "#3E7BFA",
								light: "#EAF1FF",
								dark: "#245ED6",
								contrastText: "#FFFFFF",
							},

							text: {
								primary: "#2e3033",
								secondary: "#6b6e71",
								disabled: "#b4b8bf",
							},

							background: {
								default: "#F3F6FB",
								paper: "#FFFFFF",
								appBar: "rgba(255, 255, 255, 0.88)",
							},

							divider: "#E2E8F1",
							tableRowBorder: "#E7ECEF",

							tableStatus: tableStatusColors,
						}, themeSettings.colors.light),
					},

					dark: {
						palette: mergePaletteSettings({
							primary: {
								main: "#55C99A",
								light: "#83E0B7",
								dark: "#31A879",
								gradient: (theme) => `linear-gradient(
  0deg,
  ${theme.palette.primary.dark} 0%,
  ${theme.palette.primary.main} 100%
)`,
								contrastText: "#FFFFFF",
							},

							secondary: {
								main: "#E99A78",
								light: "#3A2B2A",
								dark: "#C7795B",
								contrastText: "#171717",
							},

							success: {
								main: "#45B58A",
								light: "#18372D",
								dark: "#258D69",
								contrastText: "#FFFFFF",
							},

							warning: {
								main: "#E99A78",
								light: "#3A2B2A",
								dark: "#C7795B",
								contrastText: "#171717",
							},

							error: {
								main: "#F0717D",
								light: "#3C2025",
								dark: "#D94F5C",
								contrastText: "#FFFFFF",
							},

							info: {
								main: "#8DAEFF",
								light: "#1D2B47",
								dark: "#5D86E0",
								contrastText: "#FFFFFF",
							},

							text: {
								primary: "#F0F0F0",
								secondary: "#B3B3B3",
								disabled: "#777777",
							},

							background: {
								default: "#121212",
								paper: "#1E1E1E",
								appBar: "rgba(18, 18, 18, 0.94)",
							},

							divider: "#383838",
							tableRowBorder: "#454545",

							tableStatus: tableStatusColorsDark,
						}, themeSettings.colors.dark),
					},
				},

				typography: themeSettings.typography,

				components: {
					MuiAppBar: {
						styleOverrides: {
							root: ({ theme }) => ({
								backgroundColor: theme.palette.background.appBar,
								backdropFilter: `blur(${theme.tokens.effect.appBarBlur})`,
								boxShadow: "none",
							}),
						},
					},
					MuiCssBaseline: {
						styleOverrides: (theme) => ({
							body: {},

							"*": {
								boxSizing: "border-box",
							},
							"::-webkit-scrollbar": {
								width: theme.tokens.size.scrollbarWidth,
								height: theme.tokens.size.scrollbarWidth,
							},
							"::-webkit-scrollbar-track": {
								background: "transparent",
								borderRadius: theme.tokens.radius.control,
							},
							"::-webkit-scrollbar-thumb": {
								background: theme.palette.divider,
								borderRadius: theme.tokens.radius.control,
								"&:hover": {
									background: theme.palette.text.secondary,
								},
							},
						}),
					},
					MuiTooltip: {
						styleOverrides: {
							tooltip: ({ theme }) => ({
								backgroundColor: theme.palette.text.primary,
								color: theme.palette.background.paper,
								fontSize: theme.tokens.size.tooltipFontSize,
								fontWeight: 500,
								borderRadius: theme.tokens.radius.control,
								padding: theme.tokens.size.tooltipPadding,
								boxShadow: theme.tokens.shadow.card,
							}),

							arrow: ({ theme }) => ({ color: theme.palette.text.primary }),
						},
					},
					MuiPaper: {
						styleOverrides: {
							root: ({ theme }) => ({
								backgroundImage: "none",
								boxShadow: theme.tokens.shadow.subtle,
							}),
						},
					},

					MuiCard: {
						styleOverrides: {
							root: ({ theme }) => ({
								backgroundImage: "none",
								boxShadow: theme.tokens.shadow.subtle,
								transition: `box-shadow ${theme.tokens.motion.fast}`,
								"&:hover": {
									boxShadow: theme.tokens.shadow.cardHover,
								},
							}),
						},
					},

					MuiButton: {
						styleOverrides: {
							root: ({ theme }) => ({
								boxShadow: "none",
								borderRadius: theme.tokens.radius.control,
								fontWeight: theme.typography.button.fontWeight,
								textTransform: theme.typography.button.textTransform,
							}),

							contained: ({ theme }) => ({
								background: theme.tokens.gradient.primary,
								"&:hover": {
									boxShadow: "none",
								},
							}),
						},
					},

					MuiChip: {
						styleOverrides: {
							root: ({ theme }) => ({
								borderRadius: theme.tokens.radius.pill,
								fontWeight: 600,
							}),
						},
					},

					MuiTextField: {
						defaultProps: {
							variant: "outlined",
						},

						styleOverrides: {
							root: ({ theme }) => ({
								"& .MuiOutlinedInput-root": {
									borderRadius: theme.tokens.radius.control,
								},
							}),
						},
					},

					MuiOutlinedInput: {
						styleOverrides: {
							root: ({ theme }) => ({
								"& fieldset": {
									borderColor: theme.palette.divider,
								},

								"&:hover fieldset": {
									borderColor: theme.palette.text.secondary,
								},

								"&.Mui-focused fieldset": {
									borderColor: theme.palette.primary.main,
								},
							}),
						},
					},

					MuiTableContainer: {
						styleOverrides: {
							root: ({ theme }) => ({
								borderRadius: theme.tokens.radius.card,
								boxShadow: "none",
							}),
						},
					},

					MuiTableHead: {
						styleOverrides: {
							root: ({ theme }) => ({ backgroundColor: theme.palette.background.paper }),
						},
					},
					MuiTableRow: {
						styleOverrides: {
							root: ({ theme }) => ({
								transition: `background-color ${theme.tokens.motion.fast}`,
							}),
						},
					},

					MuiTableCell: {
						styleOverrides: {
							head: ({ theme }) => ({
								color: theme.palette.text.secondary,
								fontWeight: 600,
								fontSize: theme.tokens.size.tableHeaderFontSize,
							}),

							root: ({ theme }) => ({
								borderColor: theme.palette.tableRowBorder,
								paddingBlock: theme.spacing(theme.tokens.size.tableCellPaddingY),
							}),
						},
					},

					MuiDialog: {
						styleOverrides: {
							paper: ({ theme }) => ({
								backgroundImage: "none",
								backgroundColor: theme.palette.background.paper,
								border: `1px solid ${theme.palette.divider}`,
								boxShadow: theme.tokens.shadow.dialog,
								borderRadius: theme.tokens.radius.panel,
								overflow: "hidden",
							}),
						},
					},
					MuiDialogTitle: {
						styleOverrides: {
							root: ({ theme }) => ({
								padding: theme.spacing(2.5, 3),
								borderBottom: `1px solid ${theme.palette.divider}`,
							}),
						},
					},
					MuiDialogContent: {
						styleOverrides: {
							root: ({ theme }) => ({ padding: theme.spacing(3) }),
						},
					},
					MuiDialogActions: {
						styleOverrides: {
							root: ({ theme }) => ({
								padding: theme.spacing(2, 3, 2.5),
								gap: theme.spacing(1),
								borderTop: `1px solid ${theme.palette.divider}`,
							}),
						},
					},

					MuiMenu: {
						styleOverrides: {
							paper: ({ theme }) => ({ borderRadius: theme.tokens.radius.card, boxShadow: theme.tokens.shadow.card }),
						},
					},
				},
			}),
		[direction, themeSettings],
	);
	const currentCache = direction === "rtl" ? cacheRtl : cacheLtr;
	const customizationContext = React.useMemo(
		() => ({ themeSettings, saveThemeSettings, resetThemeSettings, defaultThemeSettings: DEFAULT_THEME_SETTINGS, themePresets: THEME_PRESETS }),
		[themeSettings, saveThemeSettings, resetThemeSettings],
	);
	return (
		<CacheProvider value={currentCache}>
			<ThemeCustomizationProvider value={customizationContext}>
				<MUThemeProvider theme={theme} defaultMode="system">
					<CssBaseline />
					{children}
				</MUThemeProvider>
			</ThemeCustomizationProvider>
		</CacheProvider>
	);
};

export default React.memo(ThemeProvider);
