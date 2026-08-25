import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

export const RestaurantTable = ({
	number = "01",
	chairsCount = 3,
	tableSize = 70,
	status = "new",
	chairColor,
	tableBgColor,
	tableBorderColor,
}) => {
	const theme = useTheme();
	const resolvedChairColor = chairColor ?? theme.palette.secondary.main ?? "#A87C4F";
	const resolvedTableBgColor = tableBgColor ?? theme.palette.tableStatus?.[status] ?? "#D9C3A9";
	const resolvedTableBorderColor = tableBorderColor ?? theme.palette.text.primary ?? "#8B5A2B";
	const dynamicRadius = tableSize / 2 + (chairsCount > 8 ? 20 : 15);
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
					bgcolor: resolvedChairColor,
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
					border: `3px solid ${resolvedTableBorderColor}`,
					borderRadius: "50%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					zIndex: 1,
				}}
			>
				<Typography variant="body2" sx={{ fontWeight: "bold" }}>
					{number}
				</Typography>
			</Box>
		</Box>
	);
};

export default RestaurantTable;
