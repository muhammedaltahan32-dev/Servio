import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

export const RestaurantTable = React.memo(
	({ number = "01", chairsCount = 3, tableSize = 70, chairColor, tableBgColor, tableBorderColor }) => {
		const theme = useTheme();
		const isDark = theme.palette.mode === "dark";
		const resolvedChairColor = chairColor ?? theme.palette.primary.main;
		const resolvedTableBgColor = tableBgColor ?? `rgba(${theme.palette.primary.mainChannel}/30%)`;
		const resolvedTableBorderColor = tableBorderColor ?? theme.palette.primary.main;
		const dynamicRadius = tableSize / 2.2 + (chairsCount > 8 ? 20 : 15);
		const containerSize = dynamicRadius * 2 + 24;
		const chairWidth = chairsCount > 10 ? 10 : 14;
		const chairHeight = chairsCount > 10 ? 6 : 9;
		const angleStep = 360 / chairsCount;
		const chairs = Array.from({ length: chairsCount }, (_, index) => {
			const angle = index * angleStep;
			return (
				<Box
					key={index}
					sx={{
						position: "absolute",
						width: chairWidth,
						height: chairHeight,
						bgcolor: resolvedTableBgColor,
						border: `1px solid ${resolvedChairColor}`,
						borderRadius: "3px",
						top: `calc(50% - ${chairHeight / 2}px)`,
						left: `calc(50% - ${chairWidth / 2}px)`,
						transform: `rotate(${angle}deg) translateY(-${dynamicRadius}px)`,
						transformOrigin: "center center",
						transition: "all 0.3s ease",
					}}
				/>
			);
		});

		return (
			<Box
				sx={{
					position: "relative",
					width: containerSize,
					height: containerSize,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{chairs}

				<Box
					sx={{
						width: tableSize,
						height: tableSize,
						bgcolor: resolvedTableBgColor,
						border: `1px solid ${resolvedTableBorderColor}`,
						borderRadius: "50%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 1,
					}}
				>
					<Typography variant="body2" sx={{ fontWeight: "bold" }}>
						T-{String(number).padStart(1, number)}
					</Typography>
				</Box>
			</Box>
		);
	},
);
RestaurantTable.displayName = "RestaurantTable";
export default RestaurantTable;
