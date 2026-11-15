import React from "react";
import { Box, Card, Chip, Divider, Stack, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
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
import { OrderStatus_CANCELLED, OrderStatus_PAID } from "../../../../constants/enumOptions.js";

const OrderCard = ({ order, t, getFieldsByLang, currentLanguage, actions = [], statusColor = "default" }) => {
	const status = order[Order_Status];
	const isFinished = status === OrderStatus_PAID || status === OrderStatus_CANCELLED;
	const createdAt = new Date(order[Order_CreatedAt]);
	const timeLabel = Number.isNaN(createdAt.getTime())
		? t("orders.unknownTime")
		: new Intl.DateTimeFormat(currentLanguage, { hour: "2-digit", minute: "2-digit" }).format(createdAt);

	const elapsedMinutes = Number.isNaN(createdAt.getTime())
		? null
		: Math.max(0, Math.floor((Date.now() - createdAt.getTime()) / 60000));

	const elapsedLabel =
		!isFinished && elapsedMinutes !== null
			? elapsedMinutes < 1
				? t("orders.justNow", { defaultValue: "Just now" })
				: elapsedMinutes < 60
					? `${elapsedMinutes}m`
					: `${Math.floor(elapsedMinutes / 60)}h ${elapsedMinutes % 60}m`
			: null;

	const totalItemsCount = React.useMemo(
		() => (order.OrderItems || []).reduce((sum, item) => sum + Number(item[Item_Quantity] ?? 0), 0),
		[order.OrderItems],
	);

	const orderTotal =
		order.total_amount ??
		order.OrderItems?.reduce(
			(sum, item) => sum + Number(item.unit_price ?? item.MenuItem?.price ?? 0) * Number(item[Item_Quantity] ?? 0),
			0,
		) ??
		0;

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
				transition: `border-color ${theme.tokens.motion.fast}, box-shadow ${theme.tokens.motion.fast}`,
				"&:hover": { borderColor: "primary.main", boxShadow: theme.tokens.shadow.subtle },
			})}
		>
			<Stack direction="row" justifyContent="space-between" alignItems="center" gap={1} sx={{ minWidth: 0, maxWidth: "100%" }}>
				<Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 0 }}>
					<Typography variant="h6" fontWeight={800} sx={{ minWidth: 0, overflowWrap: "anywhere", fontSize: { xs: "1rem", sm: "1.15rem" } }}>
						#{order[Order_ID]}
					</Typography>
					<Chip
						size="small"
						icon={<TableRestaurantIcon fontSize="small" />}
						label={t("orders.table", { number: order.Table?.[Table_Number] ?? "-" })}
						variant="outlined"
						sx={{ fontWeight: 700 }}
					/>
				</Stack>
				<Chip
					size="small"
					color={statusColor}
					label={t(`orders.status.${String(status).toLowerCase()}`)}
					sx={{ maxWidth: "48%", flexShrink: 0, fontWeight: 700, "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }}
				/>
			</Stack>
			<Stack direction="row" alignItems="center" useFlexGap flexWrap="wrap" columnGap={1.25} rowGap={0.5} color="text.secondary" sx={{ minWidth: 0, maxWidth: "100%" }}>
				<Stack direction="row" alignItems="center" gap={0.5}>
					<AccessTimeIcon sx={{ fontSize: 15 }} />
					<Typography variant="caption" fontWeight={600}>
						{timeLabel}
						{elapsedLabel ? ` · ${elapsedLabel}` : ""}
					</Typography>
				</Stack>
				{totalItemsCount > 0 && (
					<Typography variant="caption" fontWeight={600}>
						· {t("customerMenu.itemsCount", { count: totalItemsCount })}
					</Typography>
				)}
				{order.User?.[User_Name] && (
					<Stack direction="row" alignItems="center" gap={0.35} sx={{ ml: { sm: "auto" }, minWidth: 0, maxWidth: "100%" }}>
						<PersonOutlineIcon sx={{ fontSize: 15 }} />
						<Typography variant="caption" sx={{ minWidth: 0, maxWidth: "100%", overflowWrap: "anywhere" }}>
							{order.User[User_Name]}
						</Typography>
					</Stack>
				)}
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
									<strong>{item[Item_Quantity]} ×</strong> {name || t("orders.menuItem")}
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
				<Typography variant="h6" fontWeight={800}>{formatCurrency(orderTotal, currentLanguage)}</Typography>
			</Stack>
			{actions.length > 0 && (
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: "auto", minWidth: 0, maxWidth: "100%" }}>
					{actions.map(({ key, status: nextStatus, label, onClick, color = "primary", variant = "contained", disabled = false }) => (
						<Button key={key || nextStatus} fullWidth size="small" color={color} variant={variant} disabled={disabled} onClick={onClick} sx={{ flex: 1, minWidth: 110, maxWidth: "100%", whiteSpace: "normal", overflowWrap: "anywhere", lineHeight: 1.25 }}>
							{label}
						</Button>
					))}
				</Stack>
			)}
		</Card>
	);
};

export default React.memo(OrderCard);
