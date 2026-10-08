import React from "react";

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

const uiTokens = Object.freeze({
	size: {
		appBarHeight: 64,
		mobileAppBarHeight: 56,
		tooltipFontSize: "0.75rem",
		tooltipPadding: "0.4rem",
		scrollbarWidth: "0.5rem",
		tableHeaderFontSize: "0.8rem",
		tableMinWidth: 720,
		tableDefaultColumnWidth: 180,
		tableMinColumnWidth: 100,
		tableMaxColumnWidth: 600,
		tableSelectionColumnWidth: 52,
		tableRowHeight: 56,
		tableHeaderHeight: 52,
		operationsColumnWidth: 96,
		tableCellPaddingY: 0.75,
		tableCellContentMaxHeight: 44,
		tableCardMinHeight: 178,
		menuCardMinHeight: 94,
		summaryCardMinHeight: 112,
		menuThumbnail: 58,
		categoryIcon: 36,
		invoicePanelWidth: 300,
		modalImageMinHeight: 200,
		modalImageMaxHeight: 460,
		desktopDrawerWidth: 248,
		mobileDrawerWidth: 260,
		actionsBarWidth: 340,
		pageMaxWidth: 1536,
		logo: 40,
		iconButton: 40,
		lobbyCardMinHeight: 230,
	},
	space: { pageXs: 1.5, pageSm: 2.5, pageMd: 3, section: 2 },
	radius: { control: 8, card: 12, panel: 16, pill: 999 },
	shadow: {
		subtle: "0 1px 4px color-mix(in srgb, var(--mui-palette-text-primary) 3%, transparent)",
		card: "0 2px 10px color-mix(in srgb, var(--mui-palette-text-primary) 4%, transparent)",
		cardHover: "0 4px 12px color-mix(in srgb, var(--mui-palette-text-primary) 6%, transparent)",
		dialog: "0 8px 24px color-mix(in srgb, var(--mui-palette-text-primary) 10%, transparent)",
	},
	shadowControls: {
		subtle: { offsetX: 0, offsetY: 1, blur: 4, spread: 0, opacity: 3, color: "#000000", useThemeTextColor: true },
		card: { offsetX: 0, offsetY: 2, blur: 10, spread: 0, opacity: 4, color: "#000000", useThemeTextColor: true },
		cardHover: { offsetX: 0, offsetY: 4, blur: 12, spread: 0, opacity: 6, color: "#000000", useThemeTextColor: true },
		dialog: { offsetX: 0, offsetY: 8, blur: 24, spread: 0, opacity: 10, color: "#000000", useThemeTextColor: true },
	},
	gradient: { primary: "linear-gradient(90deg, var(--mui-palette-primary-main), var(--mui-palette-primary-light))" },
	motion: { fast: "160ms ease", standard: "240ms ease" },
	effect: { appBarBlur: "18px" },
	color: { sidebarMuted: "#90c38a", sidebarDivider: "rgba(226, 232, 241, 0.12)" },
});

const defaultPaletteSettings = {
	light: {
		primary: { main: "#0D8A68", light: "#35B88F", dark: "#086A50", contrastText: "#FFFFFF" },
		secondary: { main: "#DD8060", light: "#FCEEE8", dark: "#BB6547", contrastText: "#342B2A" },
		success: { main: "#188A70", light: "#E6F5F0", dark: "#116A56", contrastText: "#FFFFFF" },
		warning: { main: "#C8862D", light: "#FBF2E4", dark: "#A86716", contrastText: "#171717" },
		error: { main: "#D94F5C", light: "#FBEAEC", dark: "#B93644", contrastText: "#FFFFFF" },
		info: { main: "#3E7BFA", light: "#EAF1FF", dark: "#245ED6", contrastText: "#FFFFFF" },
		text: { primary: "#2E3033", secondary: "#6B6E71", disabled: "#B4B8BF" },
		background: { default: "#F3F6FB", paper: "#FFFFFF", appBar: "rgba(255, 255, 255, 0.88)" },
		divider: "#E2E8F1",
		tableRowBorder: "#E7ECEF",
		tableStatus: tableStatusColors,
	},
	dark: {
		primary: { main: "#55C99A", light: "#83E0B7", dark: "#31A879", contrastText: "#FFFFFF" },
		secondary: { main: "#E99A78", light: "#3A2B2A", dark: "#C7795B", contrastText: "#171717" },
		success: { main: "#45B58A", light: "#18372D", dark: "#258D69", contrastText: "#FFFFFF" },
		warning: { main: "#E99A78", light: "#3A2B2A", dark: "#C7795B", contrastText: "#171717" },
		error: { main: "#F0717D", light: "#3C2025", dark: "#D94F5C", contrastText: "#FFFFFF" },
		info: { main: "#8DAEFF", light: "#1D2B47", dark: "#5D86E0", contrastText: "#FFFFFF" },
		text: { primary: "#F0F0F0", secondary: "#B3B3B3", disabled: "#777777" },
		background: { default: "#121212", paper: "#1E1E1E", appBar: "rgba(18, 18, 18, 0.94)" },
		divider: "#383838",
		tableRowBorder: "#454545",
		tableStatus: tableStatusColorsDark,
	},
};

const defaultTypographySettings = {
	fontFamily: "Inter,Roboto,Arial,sans-serif",
	h1: { fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em" },
	h2: { fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em" },
	h3: { fontSize: "1.35rem", fontWeight: 600, letterSpacing: "normal" },
	h4: { fontSize: "1.15rem", fontWeight: 600, letterSpacing: "normal" },
	body1: { fontSize: "1rem", fontWeight: 400 },
	body2: { fontSize: "0.875rem", fontWeight: 400 },
	button: { fontWeight: 600, textTransform: "none" },
};

export const DEFAULT_THEME_SETTINGS = {
	presetName: "default",
	colors: defaultPaletteSettings,
	tokens: uiTokens,
	typography: defaultTypographySettings,
};

export const cloneThemeSettings = (value) => JSON.parse(JSON.stringify(value));

export const mergeThemeSettings = (base, updates = {}) => {
	if (!base || typeof base !== "object" || Array.isArray(base)) return updates ?? base;
	const result = { ...base };
	for (const [key, value] of Object.entries(updates ?? {})) {
		result[key] =
			value && typeof value === "object" && !Array.isArray(value) ? mergeThemeSettings(base[key] ?? {}, value) : value;
	}
	return result;
};

export const mergePaletteSettings = (base, updates) => {
	const result = { ...base };
	for (const [key, value] of Object.entries(updates ?? {})) {
		result[key] = value && typeof value === "object" && !Array.isArray(value) ? { ...base[key], ...value } : value;
	}
	return result;
};

export const buildShadowValue = ({
	offsetX = 0,
	offsetY = 0,
	blur = 0,
	spread = 0,
	opacity = 0,
	color = "#000000",
	useThemeTextColor = false,
}) => {
	const shadowColor = useThemeTextColor ? "var(--mui-palette-text-primary)" : color;
	return `${offsetX}px ${offsetY}px ${blur}px ${spread}px color-mix(in srgb, ${shadowColor} ${opacity}%, transparent)`;
};

const makePreset = (presetName, colors) => mergeThemeSettings(DEFAULT_THEME_SETTINGS, { presetName, colors });

export const THEME_PRESETS = {
	default: makePreset("default", defaultPaletteSettings),
	ocean: makePreset("ocean", {
		light: { primary: { main: "#2864C5", light: "#5B8DE0", dark: "#194B9E" } },
		dark: { primary: { main: "#78A9FF", light: "#A1C2FF", dark: "#4D7FE8" } },
	}),
	plum: makePreset("plum", {
		light: { primary: { main: "#8054B8", light: "#A77DD4", dark: "#623A96" } },
		dark: { primary: { main: "#C09AEF", light: "#D7BEF5", dark: "#9D72D2" } },
	}),
};

const ThemeCustomizationContext = React.createContext(null);

export const useThemeCustomization = () => {
	const context = React.useContext(ThemeCustomizationContext);
	if (!context) throw new Error("useThemeCustomization must be used inside ThemeProvider");
	return context;
};

export const ThemeCustomizationProvider = ThemeCustomizationContext.Provider;

