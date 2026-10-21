import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Box, Chip, Stack, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { IconButton, PageContainer } from "@components";
import { useLang } from "@hooks";
import { Order_ID, Order_Status } from "../../../../constants/FieldsName.js";
import {
	OrderStatus_CANCELLED,
	OrderStatus_PAID,
	OrderStatus_PENDING,
	OrderStatus_PREPARING,
	OrderStatus_READY,
	OrderStatus_SERVED,
} from "../../../../constants/enumOptions.js";
import { fetchOrders, updateOrderStatus } from "../../features/orders/OrdersSlice.js";
import OrderCard from "../shared/OrderCard.jsx";

const KANBAN_COLUMNS = [
	{ status: OrderStatus_PENDING, color: "warning" },
	{ status: OrderStatus_PREPARING, color: "info" },
	{ status: OrderStatus_READY, color: "success" },
	{ status: OrderStatus_SERVED, color: "info" },
	{ status: OrderStatus_PAID, color: "default" },
	{ status: OrderStatus_CANCELLED, color: "error" },
];

const NEXT_STATUS = {
	[OrderStatus_PENDING]: OrderStatus_PREPARING,
	[OrderStatus_PREPARING]: OrderStatus_READY,
};

export const OrdersPage = () => {
	const dispatch = useDispatch();
	const { t, getFieldsByLang, currentLanguage } = useLang();
	const { items: orders, fetching, updatingIds, error } = useSelector((state) => state.orders);
	const [activeStatus, setActiveStatus] = React.useState(OrderStatus_PENDING);
	const updatingSet = React.useMemo(() => new Set(updatingIds.map(String)), [updatingIds]);

	React.useEffect(() => {
		dispatch(fetchOrders());
	}, [dispatch]);

	const handleStatusChange = React.useCallback((id, status) => dispatch(updateOrderStatus({ id, status })), [dispatch]);

	return (
		<PageContainer sx={{ minHeight: 0 }}>
			<Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} sx={{ mb: { xs: 1.5, sm: 2.5 } }}>
				<Box sx={{ minWidth: 0 }}>
					<Typography variant="h5" fontWeight={800}>{t("orders.title")}</Typography>
					<Typography color="text.secondary" variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>{t("orders.subtitle")}</Typography>
				</Box>
				<IconButton aria-label={t("orders.refresh")} disabled={fetching} onClick={() => dispatch(fetchOrders())}>
					<RefreshIcon />
				</IconButton>
			</Stack>
			{error && <Alert severity="error" sx={{ mb: 2 }}>{t(error)}</Alert>}
			<Stack direction="row" spacing={1} sx={{ display: { xs: "flex", md: "none" }, overflowX: "auto", flexWrap: "nowrap", pb: 1, mb: 1, "& > *": { flexShrink: 0 } }}>
				{KANBAN_COLUMNS.map(({ status, color }) => {
					const count = orders.filter((order) => order[Order_Status] === status).length;
					return <Chip key={status} clickable color={color} variant={activeStatus === status ? "filled" : "outlined"} label={`${t(`orders.status.${status.toLowerCase()}`)} ${count}`} onClick={() => setActiveStatus(status)} />;
				})}
			</Stack>
			<Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))", xl: "repeat(3, minmax(0, 1fr))" }, gap: { xs: 1.25, sm: 2 }, alignItems: "start", overflowY: "auto", minHeight: 0, flex: 1, pb: 2 }}>
				{KANBAN_COLUMNS.map(({ status, color }) => {
					const columnOrders = orders.filter((order) => order[Order_Status] === status);
					return (
						<Box
							key={status}
							sx={(theme) => ({
								display: { xs: activeStatus === status ? "flex" : "none", md: "flex" },
								minWidth: 0,
								bgcolor: "background.default",
								p: { xs: 1.25, sm: 2 },
								border: "1px solid",
								borderColor: "divider",
								borderRadius: `${theme.tokens.radius.panel}px`,
								minHeight: { xs: 0, md: 270 },
								flexDirection: "column",
								gap: { xs: 1.25, sm: 2 },
							})}
						>
							<Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
								<Typography variant="subtitle1" fontWeight={700} sx={{ minWidth: 0, overflowWrap: "anywhere" }}>{t(`orders.status.${status.toLowerCase()}`)}</Typography>
								<Chip size="small" color={color} label={columnOrders.length} sx={{ fontWeight: 700 }} />
							</Stack>
							<Stack spacing={{ xs: 1.25, sm: 2 }}>
								{columnOrders.map((order) => {
									const nextStatus = NEXT_STATUS[status];
									const isUpdating = updatingSet.has(String(order[Order_ID]));
									return (
										<OrderCard
											key={order[Order_ID]}
											order={order}
											t={t}
											getFieldsByLang={getFieldsByLang}
											currentLanguage={currentLanguage}
											statusColor={color}
											actions={nextStatus ? [{ status: nextStatus, label: t(`orders.action.${nextStatus.toLowerCase()}`), disabled: isUpdating, onClick: () => handleStatusChange(order[Order_ID], nextStatus) }] : []}
										/>
									);
								})}
								{columnOrders.length === 0 && <Box sx={{ display: "grid", placeItems: "center", py: { xs: 4, sm: 8 }, color: "text.disabled" }}><Typography variant="body2">{t("orders.emptyColumn")}</Typography></Box>}
							</Stack>
						</Box>
					);
				})}
			</Box>
		</PageContainer>
	);
};

export default OrdersPage;
