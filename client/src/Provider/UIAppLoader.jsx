import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

export function AppLoader({ label = "Loading..." }) {
	const theme = useTheme();

	return (
		<Box
			sx={{
				position: "fixed",
				inset: 0,
				zIndex: 9999,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "background.default",
				overflow: "hidden",
			}}
		>
			{/* Subtle Background Glow */}
			<Box
				sx={{
					position: "absolute",
					width: "300px",
					height: "300px",
					borderRadius: "50%",
					background: `radial-gradient(circle, ${theme.palette.primary.main} 0%, transparent 70%)`,
					opacity: 0.1,
					filter: "blur(60px)",
					pointerEvents: "none",
				}}
			/>

			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 3,
					zIndex: 1,
				}}
			>
				{/* Animated Ring Loader */}
				<Box
					sx={{
						position: "relative",
						width: 64,
						height: 64,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					{/* Outer Static Track */}
					<Box
						sx={{
							position: "absolute",
							inset: 0,
							borderRadius: "50%",
							border: "3px solid",
							borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
						}}
					/>

					{/* Outer Rotating Accent Ring */}
					<Box
						sx={{
							position: "absolute",
							inset: 0,
							borderRadius: "50%",
							border: "3px solid transparent",
							borderTopColor: "primary.main",
							animation: "spin 1s linear infinite",
							"@keyframes spin": {
								"0%": { transform: "rotate(0deg)" },
								"100%": { transform: "rotate(360deg)" },
							},
						}}
					/>

					{/* Center Brand Badge */}
					<Box
						sx={{
							width: 32,
							height: 32,
							borderRadius: 2,
							backgroundColor: "primary.main",
							color: "#FFFFFF",
							fontWeight: 800,
							fontSize: "0.9rem",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
						}}
					>
						N
					</Box>
				</Box>

				{/* Loading Text */}
				<Typography
					variant="body2"
					fontWeight="600"
					color="text.secondary"
					sx={{
						letterSpacing: "0.5px",
						animation: "fadePulse 1.5s ease-in-out infinite",
						"@keyframes fadePulse": {
							"0%, 100%": { opacity: 0.4 },
							"50%": { opacity: 1 },
						},
					}}
				>
					{label}
				</Typography>
			</Box>
		</Box>
	);
}

const Content = ({ resourcePromise, children }) => {
	React.use(resourcePromise.current);

	React.useEffect(() => {
		const loader = document.getElementById("appLoader");
		if (loader) {
			setTimeout(() => {
				loader.classList.add("loaded");
			}, 200);
		}
	}, []);
	return children;
};

export const UIAppLoader = ({ children }) => {
	const [resolve, setResolved] = React.useState(null);

	const resourcePromise = React.useRef(
		new Promise((resolve) => {
			setResolved(resolve);
		}),
	);

	React.useEffect(() => {
		const handleComplete = () => {
			if (resolve) {
				setResolved(true);
			}
		};

		if (document.readyState === "complete") {
			handleComplete();
		} else {
			window.addEventListener("load", handleComplete);
			return () => window.removeEventListener("load", handleComplete);
		}
	}, [resolve]);
	const appLoaderContainer = document.getElementById("appLoader").render;
	return (
		<React.Suspense>
			<Content resourcePromise={resourcePromise}>{children}</Content>
		</React.Suspense>
	);
};

export default UIAppLoader;
