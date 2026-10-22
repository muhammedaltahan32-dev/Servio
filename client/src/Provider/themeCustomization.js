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
	chrome: {
		sidebar: { tinted: false, shadow: false },
		appBar: { glass: true, shadow: false, border: true },
	},
	components: { acrylic: false, inputVariant: "outlined", selectVariant: "outlined", buttonVariant: "contained" },
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
		background: {
			default: "#ffffff",
			paper: "#f9f9f9",
			appBar: "#ffffff30",
		},
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
		background: {
			default: "#1E1E1E",
			paper: "#121212",
			appBar: "#1e1e1e30",
		},
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

const blurredPaletteSettings = {
	light: {
		primary: { main: "#0067C0", light: "#60CDFF", dark: "#005A9E", contrastText: "#FFFFFF" },
		secondary: { main: "#5C5A58", light: "#E6E6E6", dark: "#3B3A39", contrastText: "#FFFFFF" },
		success: { main: "#0F7B0F", light: "#DFF6DD", dark: "#0A5C0A", contrastText: "#FFFFFF" },
		warning: { main: "#9D5D00", light: "#FFF4CE", dark: "#7A4800", contrastText: "#FFFFFF" },
		error: { main: "#C42B1C", light: "#FDE7E9", dark: "#A4262C", contrastText: "#FFFFFF" },
		info: { main: "#0067C0", light: "#DFF6FF", dark: "#005A9E", contrastText: "#FFFFFF" },
		text: { primary: "#1A1A1A", secondary: "#616161", disabled: "#9A9A9A" },
		background: { default: "#F3F6FA", paper: "rgba(255, 255, 255, 0.5)", appBar: "rgba(248, 250, 253, 0.76)" },
		divider: "rgba(0, 0, 0, 0.09)",
		tableRowBorder: "rgba(0, 0, 0, 0.07)",
	},
	dark: {
		primary: { main: "#60CDFF", light: "#9BE4FF", dark: "#36A6D8", contrastText: "#00344F" },
		secondary: { main: "#C8C6C4", light: "#484644", dark: "#A19F9D", contrastText: "#1A1A1A" },
		success: { main: "#6CCB5F", light: "#203B20", dark: "#4FA344", contrastText: "#0A2008" },
		warning: { main: "#FCE100", light: "#433B08", dark: "#D7C200", contrastText: "#241F00" },
		error: { main: "#FF99A4", light: "#442126", dark: "#E66B78", contrastText: "#3C080D" },
		info: { main: "#60CDFF", light: "#173746", dark: "#36A6D8", contrastText: "#001D2D" },
		text: { primary: "#F3F3F3", secondary: "#C4C4C4", disabled: "#777777" },
		background: { default: "#15181D", paper: "rgba(38, 42, 48, 0.82)", appBar: "rgba(30, 34, 40, 0.78)" },
		divider: "rgba(255, 255, 255, 0.12)",
		tableRowBorder: "rgba(255, 255, 255, 0.5)",
	},
};

const blurredTokenSettings = {
	size: {
		appBarHeight: 52, mobileAppBarHeight: 48, desktopDrawerWidth: 216, mobileDrawerWidth: 232,
		actionsBarWidth: 304, tableRowHeight: 42, tableHeaderHeight: 40, tableHeaderFontSize: "0.72rem",
		tableCellPaddingY: 0.5, tableCellContentMaxHeight: 36, tableCardMinHeight: 140,
		menuCardMinHeight: 74, summaryCardMinHeight: 84, iconButton: 36, logo: 36,
	},
	space: { pageXs: 1, pageSm: 1.75, pageMd: 2, section: 1.25 },
	radius: { control: 6, card: 8, panel: 10 },
	effect: { appBarBlur: "24px" },
	chrome: { sidebar: { tinted: true }, appBar: { glass: true, border: true } },
	components: { acrylic: true, inputVariant: "filled", selectVariant: "filled", buttonVariant: "contained" },
};

const blurredTypographySettings = {
	fontFamily: '"Segoe UI Variable", "Segoe UI", Inter, Roboto, Arial, sans-serif',
	h1: { fontSize: "1.55rem" }, h2: { fontSize: "1.3rem" }, h3: { fontSize: "1.1rem" },
	h4: { fontSize: "0.98rem" }, h5: { fontSize: "0.9rem" }, h6: { fontSize: "0.84rem" },
	subtitle1: { fontSize: "0.88rem" }, subtitle2: { fontSize: "0.78rem" },
	body1: { fontSize: "0.875rem" }, body2: { fontSize: "0.75rem" }, button: { fontSize: "0.78rem" },
	caption: { fontSize: "0.68rem" }, overline: { fontSize: "0.64rem" },
};

export const DEFAULT_THEME_SETTINGS = {
	presetName: "blurred",
	colors: blurredPaletteSettings,
	tokens: mergeThemeSettings(uiTokens, blurredTokenSettings),
	typography: mergeThemeSettings(defaultTypographySettings, blurredTypographySettings),
};

export const cloneThemeSettings = (value) => JSON.parse(JSON.stringify(value));

export function mergeThemeSettings(base, updates = {}) {
	if (!base || typeof base !== "object" || Array.isArray(base)) return updates ?? base;
	const result = { ...base };
	for (const [key, value] of Object.entries(updates ?? {})) {
		result[key] =
			value && typeof value === "object" && !Array.isArray(value) ? mergeThemeSettings(base[key] ?? {}, value) : value;
	}
	return result;
}

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
	servio: mergeThemeSettings(DEFAULT_THEME_SETTINGS, {
		presetName: "servio",
		colors: defaultPaletteSettings,
		tokens: uiTokens,
		typography: defaultTypographySettings,
	}),
	blurred: mergeThemeSettings(DEFAULT_THEME_SETTINGS, {
		presetName: "blurred",
		colors: {
			light: {
				primary: { main: "#0067C0", light: "#60CDFF", dark: "#005A9E", contrastText: "#FFFFFF" },
				secondary: { main: "#5C5A58", light: "#E6E6E6", dark: "#3B3A39", contrastText: "#FFFFFF" },
				success: { main: "#0F7B0F", light: "#DFF6DD", dark: "#0A5C0A", contrastText: "#FFFFFF" },
				warning: { main: "#9D5D00", light: "#FFF4CE", dark: "#7A4800", contrastText: "#FFFFFF" },
				error: { main: "#C42B1C", light: "#FDE7E9", dark: "#A4262C", contrastText: "#FFFFFF" },
				info: { main: "#0067C0", light: "#DFF6FF", dark: "#005A9E", contrastText: "#FFFFFF" },
				text: { primary: "#1A1A1A", secondary: "#616161", disabled: "#9A9A9A" },
				background: { default: "#F3F6FA", paper: "rgba(255, 255, 255, 0.5)", appBar: "rgba(248, 250, 253, 0.76)" },
				divider: "rgba(0, 0, 0, 0.09)",
				tableRowBorder: "rgba(0, 0, 0, 0.07)",
			},
			dark: {
				primary: { main: "#60CDFF", light: "#9BE4FF", dark: "#36A6D8", contrastText: "#00344F" },
				secondary: { main: "#C8C6C4", light: "#484644", dark: "#A19F9D", contrastText: "#1A1A1A" },
				success: { main: "#6CCB5F", light: "#203B20", dark: "#4FA344", contrastText: "#0A2008" },
				warning: { main: "#FCE100", light: "#433B08", dark: "#D7C200", contrastText: "#241F00" },
				error: { main: "#FF99A4", light: "#442126", dark: "#E66B78", contrastText: "#3C080D" },
				info: { main: "#60CDFF", light: "#173746", dark: "#36A6D8", contrastText: "#001D2D" },
				text: { primary: "#F3F3F3", secondary: "#C4C4C4", disabled: "#777777" },
				background: { default: "#15181D", paper: "rgba(38, 42, 48, 0.82)", appBar: "rgba(30, 34, 40, 0.78)" },
				divider: "rgba(255, 255, 255, 0.12)",
				tableRowBorder: "rgba(255, 255, 255, 0.5)",
			},
		},
		tokens: {
			size: {
				appBarHeight: 52,
				mobileAppBarHeight: 48,
				desktopDrawerWidth: 216,
				mobileDrawerWidth: 232,
				actionsBarWidth: 304,
				tableRowHeight: 42,
				tableHeaderHeight: 40,
				tableHeaderFontSize: "0.72rem",
				tableCellPaddingY: 0.5,
				tableCellContentMaxHeight: 36,
				tableCardMinHeight: 140,
				menuCardMinHeight: 74,
				summaryCardMinHeight: 84,
				iconButton: 36,
				logo: 36,
			},
			space: { pageXs: 1, pageSm: 1.75, pageMd: 2, section: 1.25 },
			radius: { control: 6, card: 8, panel: 10 },
			effect: { appBarBlur: "24px" },
			chrome: {
				sidebar: { tinted: true },
				appBar: { glass: true, border: true },
			},
			components: { acrylic: true, inputVariant: "filled", selectVariant: "filled", buttonVariant: "contained" },
		},
		typography: {
			fontFamily: '"Segoe UI Variable", "Segoe UI", Inter, Roboto, Arial, sans-serif',
			h1: { fontSize: "1.55rem" },
			h2: { fontSize: "1.3rem" },
			h3: { fontSize: "1.1rem" },
			h4: { fontSize: "0.98rem" },
			h5: { fontSize: "0.9rem" },
			h6: { fontSize: "0.84rem" },
			subtitle1: { fontSize: "0.88rem" },
			subtitle2: { fontSize: "0.78rem" },
			body1: { fontSize: "0.875rem" },
			body2: { fontSize: "0.75rem" },
			button: { fontSize: "0.78rem" },
			caption: { fontSize: "0.68rem" },
			overline: { fontSize: "0.64rem" },
		},
	}),
	rose: makePreset("rose", {
		chrome: {
			sidebar: { tinted: true },
		},
		light: {
			primary: { main: "#BD005E", light: "#DD006D", dark: "#FF1D8D" },
			background: {
				default: "#ffffff",
				paper: "#f9f9f9",
				appBar: "#ffffff30",
			},
		},
		dark: {
			primary: { main: "#BD005E", light: "#DD006D", dark: "#FF1D8D" },
			background: {
				default: "#1E1E1E",
				paper: "#121212",
				appBar: "#1e1e1e30",
			},
		},
	}),
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

