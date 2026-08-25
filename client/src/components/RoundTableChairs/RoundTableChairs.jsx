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
	const radius = tableSize / 2 + 18;
	const containerSize = radius * 2 + 30;

	const chairs = Array.from({ length: chairsCount }, (_, index) => {
		const angleRad = ((360 / chairsCount) * index - 90) * (Math.PI / 180);

		const x = radius * Math.cos(angleRad);
		const y = radius * Math.sin(angleRad);

		const chairRotation = (360 / chairsCount) * index - 90;

		return (
			<Box
				key={index}
				sx={{
					position: "absolute",
					width: 12,
					height: 22,
					bgcolor: resolvedChairColor,
					borderRadius: "4px",

					top: `calc(50% - 11px)`,
					left: `calc(50% - 6px)`,
					transform: `translate(${x}px, ${y}px) rotate(${chairRotation}deg)`,
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
