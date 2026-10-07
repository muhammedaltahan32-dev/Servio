import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Box, Card, Chip, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RefreshIcon from "@mui/icons-material/Refresh";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import { Button, IconButton, PageContainer } from "@components";
import { useLang } from "@hooks";
import { formatCurrency } from "@utils";
import {
	Item_Notes,
	Item_Quantity,
	Menu_Name,
	Order_CreatedAt,
	Order_ID,
	Order_Status,
	Order_Total,
	Table_Number,
	User_Name,
} from "../../../../constants/FieldsName.js";
import {
	OrderStatus_PENDING,
	OrderStatus_PREPARING,
	OrderStatus_READY,
	OrderStatus_SERVED,
} from "../../../../constants/enumOptions.js";
import { fetchOrders, updateOrderStatus } from "../../features/orders/OrdersSlice.js";

const KANBAN_COLUMNS = [
	{ status: OrderStatus_PENDING, color: "warning" },
	{ status: OrderStatus_PREPARING, color: "info" },
	{ status: OrderStatus_READY, color: "success" },
	{ status: OrderStatus_SERVED, color: "default" },
];

const NEXT_STATUS = {
	[OrderStatus_PENDING]: OrderStatus_PREPARING,
	[OrderStatus_PREPARING]: OrderStatus_READY,
	[OrderStatus_READY]: OrderStatus_SERVED,
};

const OrderCard = React.memo(({ order, isUpdating, onStatusChange, t, getFieldsByLang, currentLanguage }) => {
	const status = order[Order_Status];
	const nextStatus = NEXT_STATUS[status];
	const createdAt = new Date(order[Order_CreatedAt]);
	const timeLabel = Number.isNaN(createdAt.getTime())
		? t("orders.unknownTime")
		: new Intl.DateTimeFormat(currentLanguage, { hour: "2-digit", minute: "2-digit" }).format(createdAt);

	return (
		<Card
			component="article"
			variant="outlined"
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: 1.5,
				p: 2,
				borderColor: "divider",
				borderRadius: 2,
				bgcolor: "background.paper",
				transition: "border-color .15s ease",
				"&:hover": { borderColor: "primary.main" },
			}}
		>
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<Typography variant="h6" fontWeight={800}>
					#{order[Order_ID]}
				</Typography>
				<Stack direction="row" alignItems="center" gap={0.5} color="text.secondary">
					<TableRestaurantIcon fontSize="small" />
					<Typography variant="body2" fontWeight={700}>
						{order.Table?.[Table_Number] ?? "—"}
					</Typography>
				</Stack>
			</Stack>

			<Stack direction="row" alignItems="center" gap={0.5} color="text.secondary">
				<AccessTimeIcon fontSize="small" />
				<Typography variant="caption">{timeLabel}</Typography>
				{order.User?.[User_Name] && (
					<Typography variant="caption" sx={{ ml: "auto" }}>
						{order.User[User_Name]}
					</Typography>
				)}
			</Stack>

			<Divider />

			<Stack spacing={1}>
				{order.OrderItems?.map((item) => {
					const itemName = getFieldsByLang(item.MenuItem, "name") || item.MenuItem?.[Menu_Name];
					return (
						<Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
							<Typography variant="body2">
								<strong>{item[Item_Quantity]}×</strong> {itemName || t("orders.menuItem")}
							</Typography>
							<Typography variant="body2" fontWeight={600}>
								{formatCurrency(Number(item.unit_price) * Number(item[Item_Quantity]), currentLanguage)}
							</Typography>
						</Box>
					);
				})}
			</Stack>

			<Divider />

			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<Typography variant="body2" color="text.secondary">
					{t("orders.total")}
				</Typography>
				<Typography variant="subtitle1" fontWeight={800}>
					{formatCurrency(Number(order[Order_Total] ?? 0), currentLanguage)}
				</Typography>
			</Stack>

			{nextStatus && (
				<Button
					variant="contained"
					size="small"
					disabled={isUpdating}
					onClick={() => onStatusChange(order[Order_ID], nextStatus)}
				>
					{isUpdating ? <CircularProgress size={16} color="inherit" /> : t(`orders.action.${nextStatus.toLowerCase()}`)}
				</Button>
			)}
		</Card>
	);
});
OrderCard.displayName = "OrderCard";

export const OrdersPage = () => {
	const dispatch = useDispatch();
	const { t, getFieldsByLang, currentLanguage } = useLang();
	const { items: orders, fetching, updatingIds, error } = useSelector((state) => state.orders);

	// تحسين الأداء: تحويل مصفوفة المعرفات الجارية إلى Set لتقليل تعقيد البحث إلى O(1)
	const updatingSet = React.useMemo(() => new Set(updatingIds.map(String)), [updatingIds]);

	React.useEffect(() => {
		dispatch(fetchOrders());
	}, [dispatch]);

	const handleStatusChange = React.useCallback((id, status) => dispatch(updateOrderStatus({ id, status })), [dispatch]);

	return (
		<PageContainer>
			<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
				<Box>
					<Typography variant="h5" fontWeight={800}>
						{t("orders.title")}
					</Typography>
					<Typography color="text.secondary">{t("orders.subtitle")}</Typography>
				</Box>
				<IconButton aria-label={t("orders.refresh")} disabled={fetching} onClick={() => dispatch(fetchOrders())}>
					<RefreshIcon />
				</IconButton>
			</Stack>

			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{t(error)}
				</Alert>
			)}

			{/* لوحة الأعمدة المتوازية (Kanban Layout) */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", md: "repeat(4, minmax(280px, 1fr))" },
					gap: 2,
					alignItems: "start",
					overflowX: "auto",
					pb: 2,
				}}
			>
				{KANBAN_COLUMNS.map(({ status, color }) => {
					const columnOrders = orders.filter((o) => o[Order_Status] === status);
					return (
						<Box
							key={status}
							sx={{
								bgcolor: "background.default",
								p: 2,
								borderRadius: 2,
								border: "1px solid",
								borderColor: "divider",
								minHeight: 500,
								display: "flex",
								flexDirection: "column",
								gap: 2,
							}}
						>
							<Stack direction="row" justifyContent="space-between" alignItems="center">
								<Typography variant="subtitle1" fontWeight={700}>
									{t(`orders.status.${status.toLowerCase()}`)}
								</Typography>
								<Chip size="small" color={color} label={columnOrders.length} sx={{ fontWeight: 700 }} />
							</Stack>

							<Stack spacing={2} sx={{ flex: 1 }}>
								{columnOrders.map((order) => (
									<OrderCard
										key={order[Order_ID]}
										order={order}
										isUpdating={updatingSet.has(String(order[Order_ID]))}
										onStatusChange={handleStatusChange}
										t={t}
										getFieldsByLang={getFieldsByLang}
										currentLanguage={currentLanguage}
									/>
								))}
								{columnOrders.length === 0 && (
									<Box sx={{ display: "grid", placeItems: "center", py: 8, color: "text.disabled" }}>
										<Typography variant="body2">{t("orders.emptyColumn")}</Typography>
									</Box>
								)}
							</Stack>
						</Box>
					);
				})}
			</Box>
		</PageContainer>
	);
};

export default OrdersPage;
