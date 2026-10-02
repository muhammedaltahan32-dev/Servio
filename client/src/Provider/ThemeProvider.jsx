// cSpell:disable
import React from "react";
import { createTheme, ThemeProvider as MUThemeProvider, CssBaseline, backdropClasses } from "@mui/material";
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
	space: {
		pageXs: 1.5,
		pageSm: 2.5,
		pageMd: 3,
		section: 2,
	},
	radius: {
		control: 8,
		card: 12,
		panel: 16,
		pill: 999,
	},
	shadow: {
		subtle: "0 2px 8px color-mix(in srgb, var(--mui-palette-text-primary) 5%, transparent)",
		card: "0 4px 18px color-mix(in srgb, var(--mui-palette-text-primary) 7%, transparent)",
		cardHover: "0 10px 24px color-mix(in srgb, var(--mui-palette-text-primary) 12%, transparent)",
		dialog: "0 20px 60px color-mix(in srgb, var(--mui-palette-text-primary) 18%, transparent)",
	},
	gradient: {
		primary: "linear-gradient(90deg, var(--mui-palette-primary-main), var(--mui-palette-primary-light))",
	},
	motion: {
		fast: "160ms ease",
		standard: "240ms ease",
	},
	effect: {
		appBarBlur: "18px",
	},
	color: {
		sidebarMuted: "#90c38a",
		sidebarDivider: "rgba(226, 232, 241, 0.12)",
	},
});

export const ThemeProvider = ({ children }) => {
	const direction = useSelector((state) => state.language?.direction || "ltr");

	React.useEffect(() => {
		document.documentElement.dir = direction;
		document.documentElement.lang = direction === "rtl" ? "ar" : "en";
		document.body.dir = direction;
	}, [direction]);

	const theme = React.useMemo(
		() =>
			createTheme({
				direction,
				tokens: uiTokens,
				layout: {
					"desktop-appbar-height": uiTokens.size.appBarHeight,
					"desktop-drawer-width": uiTokens.size.desktopDrawerWidth,
					"mobile-drawer-width": uiTokens.size.mobileDrawerWidth,
					"desktop-actions-bar-width": uiTokens.size.actionsBarWidth,
				},
				shape: {
					borderRadius: uiTokens.radius.control,
				},

				cssVariables: {
					colorSchemeSelector: "class",
				},

				colorSchemes: {
					light: {
						palette: {
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
						},
					},

					dark: {
						palette: {
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
						},
					},
				},

				typography: {
					fontFamily: ["Inter", "Roboto", "Arial", "sans-serif"].join(","),

					h1: {
						fontSize: "2rem",
						fontWeight: 700,
						letterSpacing: "-0.02em",
					},

					h2: {
						fontSize: "1.6rem",
						fontWeight: 700,
						letterSpacing: "-0.02em",
					},

					h3: {
						fontSize: "1.35rem",
						fontWeight: 600,
					},

					h4: {
						fontSize: "1.15rem",
						fontWeight: 600,
					},

					button: {
						fontWeight: 600,
						textTransform: "none",
					},
				},

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
								fontWeight: 700,
								textTransform: "none",
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
