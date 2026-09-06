import { Stack, Typography } from "@mui/material";
import React from "react";

export const LobbySummeryCard = ({ type, label, number }) => {
	return (
		<Stack
			direction={"row"}
			sx={(theme) => ({
				height: 130,
				flex: 1,
				p: 1.5,
				justifyContent: "space-between",
				alignItems: "center",
				bgcolor: "background.paper",
				borderRadius: theme.shape.borderRadius + "px",
			})}
		>
			<Typography variant="p" sx={{ fontWeight: 500 }}>
				{label}
			</Typography>
			<Typography variant="h3" sx={{ fontWeight: 600, color: `tableStatus.${type}` }}>
				{number}
			</Typography>
		</Stack>
	);
};

export default LobbySummeryCard;
