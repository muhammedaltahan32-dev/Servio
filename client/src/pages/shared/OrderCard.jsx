import React from "react";
import { Box, Card, Chip, Divider, Stack, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import { Button } from "@components";
import { formatCurrency } from "../../utils/formatCurrency.js";
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
				position: "relative",
				flexShrink: 0,
				alignSelf: "stretch",
				width: "100%",
				minWidth: 0,
				boxSizing: "border-box",
				overflow: "hidden",
				gap: { xs: 1.25, sm: 1.5 },
				p: { xs: 1.5, sm: 2 },
				borderColor: "divider",
				borderRadius: `${theme.tokens.radius.card}px`,
				backgroundColor: "background.paper",
				transition: `border-color ${theme.tokens.motion.fast}`,
				"&:hover": { borderColor: "primary.main" },
			})}
		>
			<Stack direction="row" justifyContent="space-between" alignItems="center" gap={1} sx={{ minWidth: 0, maxWidth: "100%" }}>
				<Typography variant="h6" fontWeight={800} sx={{ minWidth: 0, overflowWrap: "anywhere", fontSize: { xs: "1rem", sm: "1.25rem" } }}>
					#{order[Order_ID]}
				</Typography>
				<Chip
					size="small"
					color={statusColor}
					label={t(`orders.status.${String(status).toLowerCase()}`)}
					sx={{ maxWidth: "55%", flexShrink: 0, "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }}
				/>
			</Stack>
			<Stack direction="row" alignItems="center" useFlexGap flexWrap="wrap" columnGap={1} rowGap={0.5} color="text.secondary" sx={{ minWidth: 0, maxWidth: "100%" }}>
				<Stack direction="row" alignItems="center" gap={0.5} sx={{ minWidth: 0, maxWidth: "100%" }}>
					<TableRestaurantIcon fontSize="small" />
					<Typography variant="body2" fontWeight={700} sx={{ minWidth: 0, overflowWrap: "anywhere" }}>{order.Table?.[Table_Number] ?? "-"}</Typography>
				</Stack>
				<Stack direction="row" alignItems="center" gap={0.5}>
					<AccessTimeIcon fontSize="small" />
					<Typography variant="caption">{timeLabel}</Typography>
				</Stack>
				{order.User?.[User_Name] && <Typography variant="caption" sx={{ ml: { sm: "auto" }, minWidth: 0, maxWidth: "100%", overflowWrap: "anywhere" }}>{order.User[User_Name]}</Typography>}
			</Stack>
			<Divider />
			<Stack spacing={1} sx={{ minWidth: 0, maxWidth: "100%" }}>
				{order.OrderItems?.map((item) => {
					const name = getFieldsByLang(item.MenuItem, "name") || item.MenuItem?.[Menu_Name];
					const lineTotal = Number(item.unit_price ?? item.MenuItem?.price ?? 0) * Number(item[Item_Quantity] ?? 0);
					return (
						<Box key={item.id} sx={{ display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }}>
							<Stack direction="row" justifyContent="space-between" alignItems="baseline" gap={1}>
								<Typography variant="body2" sx={{ minWidth: 0, maxWidth: "100%", overflowWrap: "anywhere", wordBreak: "break-word" }}>
									<strong>{item[Item_Quantity]} x</strong> {name || t("orders.menuItem")}
								</Typography>
								<Typography variant="body2" fontWeight={600} sx={{ whiteSpace: "nowrap" }}>{formatCurrency(lineTotal, currentLanguage)}</Typography>
							</Stack>
							{item[Item_Notes] && (
								<Typography variant="caption" sx={{ minWidth: 0, maxWidth: "100%", bgcolor: "warning.light", color: "warning.dark", p: 0.75, borderRadius: 1, fontWeight: 600, overflowWrap: "anywhere", wordBreak: "break-word" }}>
									{item[Item_Notes]}
								</Typography>
							)}
						</Box>
					);
				})}
			</Stack>
			<Divider />
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<Typography variant="subtitle2" color="text.secondary">{t("orders.total", { defaultValue: "Total" })}</Typography>
				<Typography variant="h6" fontWeight={800}>{formatCurrency(order.total_amount ?? order.OrderItems?.reduce((sum, item) => sum + Number(item.unit_price ?? item.MenuItem?.price ?? 0) * Number(item[Item_Quantity] ?? 0), 0), currentLanguage)}</Typography>
			</Stack>
			{actions.length > 0 && (
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: "auto", minWidth: 0, maxWidth: "100%" }}>
					{actions.map(({ status: nextStatus, label, onClick, color = "primary", variant = "contained", disabled = false }) => (
						<Button key={nextStatus} fullWidth size="small" color={color} variant={variant} disabled={disabled} onClick={onClick} sx={{ minWidth: 0, maxWidth: "100%", whiteSpace: "normal", overflowWrap: "anywhere", lineHeight: 1.25 }}>
							{label}
						</Button>
					))}
				</Stack>
			)}
		</Card>
	);
};

export default React.memo(OrderCard);
