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
			settings.presetName = "servio";
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
								backdropFilter: theme.tokens.chrome.appBar.glass
									? `blur(${theme.tokens.effect.appBarBlur}) saturate(145%)`
									: "none",
								boxShadow: theme.tokens.chrome.appBar.shadow ? theme.tokens.shadow.card : "none",
								borderBottom: theme.tokens.chrome.appBar.border ? `1px solid ${theme.palette.divider}` : "none",
							}),
						},
					},
					MuiBackdrop: {
						styleOverrides: {
							root: ({ theme }) => theme.tokens.components.acrylic
								? { backgroundColor: "rgba(10, 16, 24, 0.24)", backdropFilter: "blur(8px) saturate(130%)" }
								: {},
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
								...(theme.tokens.components.acrylic && { backdropFilter: "blur(16px) saturate(140%)" }),
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
								backgroundImage: theme.tokens.components.acrylic
									? "linear-gradient(135deg, color-mix(in srgb, var(--mui-palette-common-white) 8%, transparent), transparent 55%)"
									: "none",
								boxShadow: theme.tokens.shadow.subtle,
								...(theme.tokens.components.acrylic && {
									backdropFilter: "blur(18px) saturate(140%)",
									border: "1px solid color-mix(in srgb, var(--mui-palette-text-primary) 11%, transparent)",
								}),
							}),
						},
					},

					MuiCard: {
						styleOverrides: {
							root: ({ theme }) => ({
								backgroundImage: theme.tokens.components.acrylic
									? "linear-gradient(135deg, color-mix(in srgb, var(--mui-palette-common-white) 8%, transparent), transparent 55%)"
									: "none",
								boxShadow: theme.tokens.shadow.subtle,
								borderRadius: theme.tokens.radius.card,
								...(theme.tokens.components.acrylic && { backdropFilter: "blur(18px) saturate(140%)" }),
								transition: `box-shadow ${theme.tokens.motion.fast}`,
								"&:hover": {
									boxShadow: theme.tokens.shadow.cardHover,
								},
							}),
						},
					},

					MuiButton: {
						defaultProps: {
							variant: themeSettings.tokens.components.buttonVariant,
							...(themeSettings.tokens.components.acrylic && { size: "small" }),
						},
						styleOverrides: {
							root: ({ theme }) => ({
								boxShadow: "none",
								borderRadius: theme.tokens.radius.control,
								minHeight: theme.tokens.components.acrylic ? 30 : undefined,
								paddingInline: theme.tokens.components.acrylic ? 11 : undefined,
								fontWeight: theme.typography.button.fontWeight,
								textTransform: theme.typography.button.textTransform,
								transition: "background-color 140ms ease, box-shadow 140ms ease, transform 140ms ease",
							}),

							contained: ({ theme }) => ({
								background: theme.tokens.components.acrylic ? theme.palette.primary.main : theme.tokens.gradient.primary,
								...(theme.tokens.components.acrylic && { border: "1px solid color-mix(in srgb, var(--mui-palette-primary-main) 80%, white)" }),
								"&:hover": {
									boxShadow: theme.tokens.components.acrylic ? "0 3px 8px rgba(0, 0, 0, 0.16)" : "none",
									filter: "brightness(1.04)",
								},
							}),
						},
					},

					MuiChip: {
						styleOverrides: {
							root: ({ theme }) => ({
								borderRadius: theme.tokens.components.acrylic ? theme.tokens.radius.control : theme.tokens.radius.pill,
								fontWeight: 600,
								minHeight: theme.tokens.components.acrylic ? 26 : undefined,
							}),
						},
					},

					MuiTextField: {
						defaultProps: {
							variant: themeSettings.tokens.components.inputVariant,
							...(themeSettings.tokens.components.acrylic && { size: "small" }),
						},

						styleOverrides: {
							root: ({ theme }) => ({
								"& .MuiOutlinedInput-root": {
									borderRadius: theme.tokens.radius.control,
								},
							}),
						},
					},
					MuiInputBase: {
						styleOverrides: {
							root: ({ theme }) => theme.tokens.components.acrylic ? { fontSize: "0.8125rem", minHeight: 36 } : {},
							input: ({ theme }) => theme.tokens.components.acrylic ? { paddingBlock: 8, fontSize: "0.8125rem" } : {},
						},
					},
					MuiInputLabel: {
						styleOverrides: {
							root: ({ theme }) => theme.tokens.components.acrylic ? { fontSize: "0.8125rem" } : {},
						},
					},
					MuiIconButton: {
						defaultProps: { ...(themeSettings.tokens.components.acrylic && { size: "small" }) },
						styleOverrides: {
							root: ({ theme }) => theme.tokens.components.acrylic ? { padding: 6 } : {},
						},
					},
					MuiCheckbox: {
						defaultProps: { ...(themeSettings.tokens.components.acrylic && { size: "small" }) },
					},
					MuiRadio: {
						defaultProps: { ...(themeSettings.tokens.components.acrylic && { size: "small" }) },
					},

					MuiOutlinedInput: {
						styleOverrides: {
							root: ({ theme }) => ({
								borderRadius: theme.tokens.radius.control,
								...(theme.tokens.components.acrylic && {
									backgroundColor: "color-mix(in srgb, var(--mui-palette-background-paper) 78%, transparent)",
									"& fieldset": { borderColor: "color-mix(in srgb, var(--mui-palette-text-primary) 18%, transparent)" },
									"&:hover fieldset": { borderColor: "color-mix(in srgb, var(--mui-palette-primary-main) 65%, transparent)" },
								}),
								"& fieldset": {
									// borderColor: theme.palette.divider,
								},

								"&:hover fieldset": {
									// borderColor: theme.palette.text.secondary,
								},

								"&.Mui-focused fieldset": {
									// borderColor: theme.palette.primary.main,
								},
							}),
						},
					},
					MuiFilledInput: {
						styleOverrides: {
							root: ({ theme }) => ({
								borderTopLeftRadius: theme.tokens.radius.control,
								borderTopRightRadius: theme.tokens.radius.control,
								...(theme.tokens.components.acrylic && {
									backgroundColor: "color-mix(in srgb, var(--mui-palette-background-paper) 84%, var(--mui-palette-text-primary) 5%)",
									"&:hover": { backgroundColor: "color-mix(in srgb, var(--mui-palette-background-paper) 76%, var(--mui-palette-text-primary) 8%)" },
								}),
							}),
						},
					},
					MuiFormControl: {
						defaultProps: themeSettings.tokens.components.acrylic ? { size: "small" } : {},
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
								backgroundImage: theme.tokens.components.acrylic
									? "linear-gradient(145deg, color-mix(in srgb, var(--mui-palette-common-white) 12%, transparent), transparent 58%)"
									: "none",
								backgroundColor: theme.palette.background.paper,
								border: theme.tokens.components.acrylic
									? "1px solid color-mix(in srgb, var(--mui-palette-common-white) 24%, var(--mui-palette-divider))"
									: `1px solid ${theme.palette.divider}`,
								borderRadius: theme.tokens.radius.panel,
								backdropFilter: theme.tokens.components.acrylic ? "blur(28px) saturate(160%)" : undefined,
								boxShadow: theme.tokens.components.acrylic ? "0 20px 60px rgba(0, 0, 0, 0.25)" : theme.tokens.shadow.dialog,
								overflow: "hidden",
							}),
						},
					},
					MuiDialogTitle: {
						styleOverrides: {
							root: ({ theme }) => ({
								padding: theme.tokens.components.acrylic ? theme.spacing(2, 2.5) : theme.spacing(2.5, 3),
								borderBottom: `1px solid ${theme.palette.divider}`,
							}),
						},
					},
					MuiDialogContent: {
						styleOverrides: {
							root: ({ theme }) => ({ padding: theme.tokens.components.acrylic ? theme.spacing(2.5) : theme.spacing(3) }),
						},
					},
					MuiDialogActions: {
						styleOverrides: {
							root: ({ theme }) => ({
								padding: theme.tokens.components.acrylic ? theme.spacing(1.5, 2.5, 2) : theme.spacing(2, 3, 2.5),
								gap: theme.spacing(1),
								borderTop: `1px solid ${theme.palette.divider}`,
							}),
						},
					},

					MuiMenu: {
						styleOverrides: {
							paper: ({ theme }) => ({
								borderRadius: theme.tokens.radius.card,
								boxShadow: theme.tokens.components.acrylic ? "0 12px 32px rgba(0, 0, 0, 0.2)" : theme.tokens.shadow.card,
								...(theme.tokens.components.acrylic && {
									backgroundColor: theme.palette.background.paper,
									backgroundImage: "linear-gradient(145deg, color-mix(in srgb, var(--mui-palette-common-white) 10%, transparent), transparent 60%)",
									backdropFilter: "blur(24px) saturate(155%)",
									border: "1px solid color-mix(in srgb, var(--mui-palette-text-primary) 12%, transparent)",
								}),
							}),
						},
					},
					MuiPopover: {
						styleOverrides: {
							paper: ({ theme }) => theme.tokens.components.acrylic
								? {
									backgroundColor: theme.palette.background.paper,
									backgroundImage: "linear-gradient(145deg, color-mix(in srgb, var(--mui-palette-common-white) 10%, transparent), transparent 60%)",
									backdropFilter: "blur(24px) saturate(155%)",
									border: "1px solid color-mix(in srgb, var(--mui-palette-text-primary) 12%, transparent)",
									borderRadius: theme.tokens.radius.card,
									boxShadow: "0 12px 32px rgba(0, 0, 0, 0.2)",
								}
								: {},
						},
					},
					MuiDrawer: {
						styleOverrides: {
							paper: ({ theme }) => theme.tokens.components.acrylic
								? { backdropFilter: "blur(24px) saturate(145%)", backgroundImage: "linear-gradient(160deg, color-mix(in srgb, var(--mui-palette-primary-main) 5%, transparent), transparent 45%)" }
								: {},
						},
					},
					MuiListItemButton: {
						styleOverrides: {
							root: ({ theme }) => ({
								borderRadius: theme.tokens.radius.control,
								...(theme.tokens.components.acrylic && { minHeight: 38, transition: "background-color 140ms ease, color 140ms ease" }),
							}),
						},
					},
					MuiMenuItem: {
						styleOverrides: {
							root: ({ theme }) => ({
								minHeight: theme.tokens.components.acrylic ? 36 : undefined,
								borderRadius: theme.tokens.components.acrylic ? theme.tokens.radius.control : undefined,
								marginInline: theme.tokens.components.acrylic ? 4 : undefined,
								...(theme.tokens.components.acrylic && {
									"&.Mui-selected": { backgroundColor: "color-mix(in srgb, var(--mui-palette-primary-main) 12%, transparent)" },
									"&:hover": { backgroundColor: "color-mix(in srgb, var(--mui-palette-primary-main) 8%, transparent)" },
								}),
							}),
						},
					},
					MuiAccordion: {
						styleOverrides: {
							root: ({ theme }) => theme.tokens.components.acrylic
								? { borderRadius: `${theme.tokens.radius.card}px !important`, backgroundColor: theme.palette.background.paper, backgroundImage: "linear-gradient(135deg, color-mix(in srgb, var(--mui-palette-common-white) 8%, transparent), transparent 60%)", backdropFilter: "blur(16px) saturate(140%)", border: `1px solid ${theme.palette.divider}`, "&:before": { display: "none" } }
								: {},
						},
					},
					MuiSlider: {
						styleOverrides: {
							root: ({ theme }) => theme.tokens.components.acrylic ? { height: 4 } : {},
							thumb: ({ theme }) => theme.tokens.components.acrylic
								? { width: 16, height: 16, boxShadow: "0 1px 4px rgba(0, 0, 0, 0.2)" }
								: {},
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
