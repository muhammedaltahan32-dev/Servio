import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { getCapacity, getTableNumber, normalizeStatus, getTableSizeType } from "./utils/normalize.js";
import { RestaurantTable } from "@components";
import { useLang } from "@hooks";

export const TableCard = React.memo(({ item }) => {
	const tableNumber = getTableNumber(item);
	const status = normalizeStatus(item?.status);
	const capacity = getCapacity(item);
	const { t } = useLang();
	const tableSizeType = getTableSizeType(capacity);
	return (
		<Paper
			elevation={3}
			sx={{
				p: 2,
				minWidth: 250,
				height: 170,
				// border: "1px solid",
				// borderColor: "divider",
				userSelect: "none",
				backgroundColor: "background.paper",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Stack direction={"row"} sx={{ alignItems: "start", flex: 1 }}>
				<RestaurantTable number={String(tableNumber)} chairsCount={Math.max(2, capacity)} tableSize={60} />
				<Box sx={{ marginInlineStart: "auto" }}>
					<Chip
						label={t(`lobby.${item?.status}`)}
						sx={(theme) => ({
							bgcolor: `color-mix(in srgb ,${theme.palette.tableStatus[status]} 20%,transparent )`,
							color: `tableStatus.${status}`,
						})}
						size="small"
					/>
				</Box>
			</Stack>
			<Stack direction={"row"} sx={{ justifyContent: "space-between", alignItems: "center" }}>
				<Chip variant="outlined" label={t(`lobby.${tableSizeType}`)} size="small" />
				{/* <Typography component="p" sx={{ fontSize: "0.8rem" }}>
					{t(`lobby.${tableSizeType}`)}
				</Typography> */}
				<Typography component="p" sx={{ fontSize: "0.8rem" }}>
					{capacity} {t("lobby.persons")}
				</Typography>
			</Stack>
		</Paper>
	);
});
TableCard.displayName = "TableCard";
export default TableCard;
