import React from "react";
import { Box, Card, Chip, Divider, Stack, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import { Button } from "@components";
import {
	Item_Notes,
	Item_Quantity,
	Menu_Name,
	Order_CreatedAt,
	Order_ID,
	Order_Status,
	Table_Number,
	User_Name,
} from "../../../../constants/FieldsName.js";

const OrderCard = ({ order, t, getFieldsByLang, currentLanguage, actions = [], statusColor = "default" }) => {
	const status = order[Order_Status];
	const createdAt = new Date(order[Order_CreatedAt]);
	const timeLabel = Number.isNaN(createdAt.getTime())
		? t("orders.unknownTime")
		: new Intl.DateTimeFormat(currentLanguage, { hour: "2-digit", minute: "2-digit" }).format(createdAt);

	return (
		<Card
			component="article"
			variant="outlined"
			sx={(theme) => ({
				display: "flex",
				flexDirection: "column",
				gap: { xs: 1.25, sm: 1.5 },
				p: { xs: 1.5, sm: 2 },
				borderColor: "divider",
				borderRadius: `${theme.tokens.radius.card}px`,
				bgcolor: "background.paper",
				transition: `border-color ${theme.tokens.motion.fast}`,
				"&:hover": { borderColor: "primary.main" },
			})}
		>
			<Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
				<Typography variant="h6" fontWeight={800} sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
					#{order[Order_ID]}
				</Typography>
				<Chip size="small" color={statusColor} label={t(`orders.status.${String(status).toLowerCase()}`)} />
			</Stack>
			<Stack direction="row" alignItems="center" useFlexGap flexWrap="wrap" columnGap={1} rowGap={0.5} color="text.secondary">
				<Stack direction="row" alignItems="center" gap={0.5}>
					<TableRestaurantIcon fontSize="small" />
					<Typography variant="body2" fontWeight={700}>{order.Table?.[Table_Number] ?? "-"}</Typography>
				</Stack>
				<Stack direction="row" alignItems="center" gap={0.5}>
					<AccessTimeIcon fontSize="small" />
					<Typography variant="caption">{timeLabel}</Typography>
				</Stack>
				{order.User?.[User_Name] && <Typography variant="caption" sx={{ ml: { sm: "auto" } }}>{order.User[User_Name]}</Typography>}
			</Stack>
			<Divider />
			<Stack spacing={1}>
				{order.OrderItems?.map((item) => {
					const name = getFieldsByLang(item.MenuItem, "name") || item.MenuItem?.[Menu_Name];
					return (
						<Box key={item.id} sx={{ display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }}>
							<Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
								<strong>{item[Item_Quantity]} x</strong> {name || t("orders.menuItem")}
							</Typography>
							{item[Item_Notes] && (
								<Typography variant="caption" sx={{ bgcolor: "warning.light", color: "warning.dark", p: 0.75, borderRadius: 1, fontWeight: 600, overflowWrap: "anywhere" }}>
									{item[Item_Notes]}
								</Typography>
							)}
						</Box>
					);
				})}
			</Stack>
			{actions.length > 0 && (
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: "auto" }}>
					{actions.map(({ status: nextStatus, label, onClick, color = "primary", variant = "contained", disabled = false }) => (
						<Button key={nextStatus} fullWidth size="small" color={color} variant={variant} disabled={disabled} onClick={onClick}>
							{label}
						</Button>
					))}
				</Stack>
			)}
		</Card>
	);
};

export default React.memo(OrderCard);
