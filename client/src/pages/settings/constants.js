export const SECTIONS = [
	{ id: "presets", label: "settings.tabs.presets" },
	{ id: "colors", label: "settings.tabs.colors" },
	{ id: "dimensions", label: "settings.tabs.dimensions" },
	{ id: "shape", label: "settings.tabs.shape" },
	{ id: "effects", label: "settings.tabs.effects" },
	{ id: "typography", label: "settings.tabs.typography" },
];

export const COLOR_GROUPS = [
	{ key: "primary", fields: ["main", "light", "dark", "contrastText"] },
	{ key: "secondary", fields: ["main", "light", "dark", "contrastText"] },
	{ key: "success", fields: ["main", "light", "dark", "contrastText"] },
	{ key: "warning", fields: ["main", "light", "dark", "contrastText"] },
	{ key: "error", fields: ["main", "light", "dark", "contrastText"] },
	{ key: "info", fields: ["main", "light", "dark", "contrastText"] },
	{ key: "text", fields: ["primary", "secondary", "disabled"] },
	{ key: "background", fields: ["default", "paper", "appBar"] },
	{ key: "interface", fields: ["divider", "tableRowBorder"] },
	{ key: "tableStatus", fields: ["ready", "Available", "delayed", "preparing", "Needs_Cleaning", "reserved", "new", "occupied", "Occupied"] },
];

export const TOKEN_GROUPS = {
	dimensions: [
		{ path: "size", title: "settings.groups.dimensions" },
	],
	shape: [
		{ path: "space", title: "settings.groups.spacing" },
		{ path: "radius", title: "settings.groups.radius" },
	],
	effects: [
		{ path: "gradient", title: "settings.groups.gradients" },
		{ path: "motion", title: "settings.groups.motion" },
		{ path: "effect", title: "settings.groups.effects" },
		{ path: "color", title: "settings.groups.miscColors" },
	],
};

export const SIZE_SLIDER_CONTROLS = {
	appBarHeight: { min: 48, max: 96, step: 1, unit: "px", preview: "height" },
	mobileAppBarHeight: { min: 44, max: 80, step: 1, unit: "px", preview: "height" },
	tooltipFontSize: { min: 0.625, max: 1.5, step: 0.025, unit: "rem", preview: "font" },
	tooltipPadding: { min: 0.2, max: 1.2, step: 0.05, unit: "rem", preview: "padding" },
	scrollbarWidth: { min: 0.25, max: 1.25, step: 0.05, unit: "rem", preview: "width" },
	tableHeaderFontSize: { min: 0.65, max: 1.25, step: 0.025, unit: "rem", preview: "font" },
	tableMinWidth: { min: 480, max: 1600, step: 10, unit: "px", preview: "width" },
	tableDefaultColumnWidth: { min: 80, max: 400, step: 4, unit: "px", preview: "width" },
	tableMinColumnWidth: { min: 48, max: 240, step: 4, unit: "px", preview: "width" },
	tableMaxColumnWidth: { min: 240, max: 1000, step: 10, unit: "px", preview: "width" },
	tableSelectionColumnWidth: { min: 32, max: 96, step: 2, unit: "px", preview: "width" },
	tableRowHeight: { min: 36, max: 100, step: 2, unit: "px", preview: "height" },
	tableHeaderHeight: { min: 36, max: 88, step: 2, unit: "px", preview: "height" },
	operationsColumnWidth: { min: 64, max: 192, step: 4, unit: "px", preview: "width" },
	tableCellPaddingY: { min: 0, max: 2, step: 0.1, unit: "sp", preview: "padding" },
	tableCellContentMaxHeight: { min: 24, max: 120, step: 2, unit: "px", preview: "height" },
	tableCardMinHeight: { min: 120, max: 400, step: 5, unit: "px", preview: "height" },
	menuCardMinHeight: { min: 64, max: 200, step: 4, unit: "px", preview: "height" },
	summaryCardMinHeight: { min: 80, max: 280, step: 4, unit: "px", preview: "height" },
	menuThumbnail: { min: 32, max: 120, step: 2, unit: "px", preview: "square" },
	categoryIcon: { min: 20, max: 96, step: 2, unit: "px", preview: "square" },
	invoicePanelWidth: { min: 240, max: 520, step: 5, unit: "px", preview: "width" },
	modalImageMinHeight: { min: 120, max: 400, step: 5, unit: "px", preview: "height" },
	modalImageMaxHeight: { min: 240, max: 800, step: 10, unit: "px", preview: "height" },
	desktopDrawerWidth: { min: 200, max: 360, step: 4, unit: "px", preview: "width" },
	mobileDrawerWidth: { min: 220, max: 380, step: 4, unit: "px", preview: "width" },
	actionsBarWidth: { min: 280, max: 480, step: 5, unit: "px", preview: "width" },
	pageMaxWidth: { min: 960, max: 1920, step: 16, unit: "px", preview: "width" },
	logo: { min: 24, max: 72, step: 2, unit: "px", preview: "square" },
	iconButton: { min: 32, max: 64, step: 2, unit: "px", preview: "square" },
	lobbyCardMinHeight: { min: 160, max: 360, step: 5, unit: "px", preview: "height" },
};

export const TYPOGRAPHY_GROUPS = [
	{ key: "global", fields: ["fontFamily"] },
	{ key: "h1", fields: ["fontSize", "fontWeight", "letterSpacing"] },
	{ key: "h2", fields: ["fontSize", "fontWeight", "letterSpacing"] },
	{ key: "h3", fields: ["fontSize", "fontWeight", "letterSpacing"] },
	{ key: "h4", fields: ["fontSize", "fontWeight", "letterSpacing"] },
	{ key: "body1", fields: ["fontSize", "fontWeight"] },
	{ key: "body2", fields: ["fontSize", "fontWeight"] },
	{ key: "button", fields: ["fontWeight", "textTransform"] },
];

export const SHADOW_CONTROLS = [
	{ key: "offsetX", min: -24, max: 24, unit: "px" },
	{ key: "offsetY", min: -24, max: 48, unit: "px" },
	{ key: "blur", min: 0, max: 80, unit: "px" },
	{ key: "spread", min: -24, max: 32, unit: "px" },
	{ key: "opacity", min: 0, max: 40, unit: "%" },
];

export const COLOR_SWATCHES = [
	"#111827", "#4B5563", "#9CA3AF", "#E5E7EB", "#FFFFFF",
	"#7F1D1D", "#DC2626", "#F97316", "#EAB308", "#15803D",
	"#0D8A68", "#14B8A6", "#0891B2", "#2563EB", "#1E3A8A",
	"#6D28D9", "#9333EA", "#C026D3", "#DB2777", "#9D174D",
];
