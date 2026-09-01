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
	ready: "#22A06B",
	Available: "#22A06B",
	delayed: "#EF5B5B",
	preparing: "#F59E0B",
	Needs_Cleaning: "#F59E0B",
	reserved: "#4F6FED",
	new: "#3B82F6",
	occupied: "#FF6547",
	Occupied: "#FF6547",
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
					borderRadius: 12,
				},

				cssVariables: {
					colorSchemeSelector: "class",
				},

				colorSchemes: {
					light: {
						palette: {
							primary: {
								main: "#FF6547",
								light: "#FF8A73",
								dark: "#E85438",
								gradient: (theme) => `linear-gradient(
  0deg,
  ${theme.palette.primary.main} 0%,
  ${theme.palette.primary.light} 100%
)`,
								contrastText: "#FFFFFF",
							},

							secondary: {
								main: "#171717",
								light: "#404040",
								dark: "#0A0A0A",
								contrastText: "#FFFFFF",
							},

							success: {
								main: "#22A06B",
								light: "#E8F7F0",
								dark: "#168257",
								contrastText: "#FFFFFF",
							},

							warning: {
								main: "#F59E0B",
								light: "#FFF7E6",
								dark: "#D97706",
								contrastText: "#171717",
							},

							error: {
								main: "#EF5B5B",
								light: "#FDECEC",
								dark: "#D94343",
								contrastText: "#FFFFFF",
							},

							info: {
								main: "#4F6FED",
								light: "#EEF1FF",
								dark: "#3B5BD6",
								contrastText: "#FFFFFF",
							},

							text: {
								primary: "#171717",
								secondary: "#737373",
								disabled: "#A3A3A3",
							},

							background: {
								default: "#F5F5F4",
								paper: "#FFFFFF",
							},

							divider: "#E7E5E4",

							tableStatus: tableStatusColors,
						},
					},

					dark: {
						palette: {
							primary: {
								main: "#FF6547",
								light: "#FF8068",
								dark: "#E85438",
								gradient: (theme) => `linear-gradient(
  0deg,
  ${theme.palette.primary.dark} 0%,
  ${theme.palette.primary.main} 100%
)`,
								contrastText: "#FFFFFF",
							},

							secondary: {
								main: "#FFFFFF",
								light: "#F5F5F5",
								dark: "#D4D4D4",
								contrastText: "#171717",
							},

							success: {
								main: "#35C98A",
								light: "#123A2A",
								dark: "#22A06B",
								contrastText: "#FFFFFF",
							},

							warning: {
								main: "#FBBF24",
								light: "#3A2C0D",
								dark: "#F59E0B",
								contrastText: "#171717",
							},

							error: {
								main: "#FF6B6B",
								light: "#3A1818",
								dark: "#EF5B5B",
								contrastText: "#FFFFFF",
							},

							info: {
								main: "#7188FF",
								light: "#1B2448",
								dark: "#4F6FED",
								contrastText: "#FFFFFF",
							},

							text: {
								primary: "#F5F5F5",
								secondary: "#A3A3A3",
								disabled: "#666666",
							},

							background: {
								default: "#171717",
								paper: "#242424",
							},

							divider: "#363636",

							tableStatus: tableStatusColors,
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
					MuiCssBaseline: {
						styleOverrides: {
							body: {},

							"*": {
								boxSizing: "border-box",
							},
						},
					},
					MuiTooltip: {
						styleOverrides: {
							tooltip: {
								backgroundColor: "#1E1E1E",
								color: "#fff",
								fontSize: "12px",
								fontWeight: 500,
								borderRadius: "0.4rem",
								padding: " 0.4rem",
								boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
							},

							arrow: {
								color: "#1E1E1E",
							},
						},
					},
					MuiPaper: {
						styleOverrides: {
							root: {
								backgroundImage: "none",
								boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
							},
						},
					},

					MuiCard: {
						styleOverrides: {
							root: {
								borderRadius: 12,
								backgroundImage: "none",
								boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",

								transition: "transform 150ms ease, box-shadow 150ms ease",

								"&:hover": {
									// transform: "translateY(-2px)",
									boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
								},
							},
						},
					},

					MuiButton: {
						styleOverrides: {
							root: {
								boxShadow: "none",
							},

							contained: {
								background: (theme) => theme.palette.primary.gradient,
								"&:hover": {
									boxShadow: "none",
									// backgroundColor: "#E85438",
								},
							},
						},
					},

					MuiChip: {
						styleOverrides: {
							root: {
								borderRadius: 999,
								fontWeight: 600,
							},
						},
					},

					MuiTextField: {
						defaultProps: {
							variant: "outlined",
						},

						styleOverrides: {
							root: {
								"& .MuiOutlinedInput-root": {
									borderRadius: 10,
								},
							},
						},
					},

					MuiOutlinedInput: {
						styleOverrides: {
							root: {
								// backgroundColor: "#151515",

								"& fieldset": {
									borderColor: "#e7e5e486",
								},

								"&:hover fieldset": {
									borderColor: "#D4D4D4",
								},

								"&.Mui-focused fieldset": {
									borderColor: "#FF6547",
								},
							},
						},
					},

					MuiTableContainer: {
						styleOverrides: {
							root: {
								borderRadius: 12,
								boxShadow: "none",
							},
						},
					},

					MuiTableHead: {
						styleOverrides: {
							root: {
								backgroundColor: "#FAFAF9",
							},
						},
					},

					MuiTableCell: {
						styleOverrides: {
							head: {
								color: "#737373",
								fontWeight: 600,
								fontSize: "0.8rem",
							},

							root: {
								borderColor: "#e7e5e41e",
							},
						},
					},

					MuiDialog: {
						styleOverrides: {
							paper: {
								borderRadius: 16,
								boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
							},
						},
					},

					MuiMenu: {
						styleOverrides: {
							paper: {
								borderRadius: 10,
								boxShadow: "0 10px 30px rgba(0, 0, 0, 0.10)",
							},
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
