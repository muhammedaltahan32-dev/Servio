import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { IconButton, Button, Icon } from "@components";
import {
	Avatar,
	Box,
	Chip,
	Grid,
	LinearProgress,
	Paper,
	Stack,
	Typography,
	useColorScheme,
	useTheme,
	Tooltip as MUTooltip,
} from "@mui/material";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
	Order_CreatedAt,
	Order_ID,
	Order_Status,
	Order_Total,
	Table_Number,
	Table_Status,
} from "../../../../constants/FieldsName.js";
import { fetchOrders } from "../../features/orders/OrdersSlice.js";
import { fetchTables } from "../../features/tables/TablesSlice.js";
import { useThemeCustomization } from "../../Provider/themeCustomization.js";
import { PageContainer } from "@components";
import { useLang } from "@hooks";
import { formatCurrency } from "../../utils/formatCurrency.js";

const PRESET_COLORS = { servio: "#0D8A68", blurred: "#0067C0", rose: "#BD005E", ocean: "#2864C5", plum: "#8054B8" };

const MetricCard = ({ icon, label, value, detail, color, progress }) => (
	<Paper
		variant="outlined"
		sx={(theme) => ({
			p: { xs: 2, sm: 2.5 },
			minHeight: theme.tokens.size.summaryCardMinHeight,
			borderColor: "divider",
			borderRadius: `${theme.tokens.radius.panel}px`,
			bgcolor: "background.paper",
			transition: `transform ${theme.tokens.motion.fast}, box-shadow ${theme.tokens.motion.fast}`,
			"&:hover": { transform: "translateY(-2px)", boxShadow: theme.tokens.shadow.cardHover },
		})}
	>
		<Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }} gap={1.5}>
			<Box sx={{ minWidth: 0 }}>
				<Typography variant="body2" color="text.secondary" fontWeight={600}>
					{label}
				</Typography>
				<Typography variant="h4" sx={{ mt: 1, fontWeight: 800, letterSpacing: "-0.04em" }}>
					{value}
				</Typography>
				<Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.75 }}>
					{detail}
				</Typography>
			</Box>
			<Avatar
				variant="rounded"
				sx={{
					width: 44,
					height: 44,
					bgcolor: `color-mix(in srgb, ${color} 12%, transparent)`,
					color,
					borderRadius: "14px",
				}}
			>
				{icon}
			</Avatar>
		</Stack>
		{progress !== undefined && (
			<LinearProgress
				variant="determinate"
				value={progress}
				sx={{
					mt: 2,
					height: 5,
					borderRadius: 99,
					bgcolor: "action.hover",
					"& .MuiLinearProgress-bar": { borderRadius: 99 },
				}}
			/>
		)}
	</Paper>
);

const readableStatus = (status = "") =>
	status
		.toLowerCase()
		.replaceAll("_", " ")
		.replace(/\b\w/g, (letter) => letter.toUpperCase());

export const Dashboard = () => {
	const dispatch = useDispatch();

	const theme = useTheme();
	const { colorScheme, setMode } = useColorScheme();
	const { t, currentLanguage } = useLang();
	const { themeSettings, saveThemeSettings, themePresets } = useThemeCustomization();
	const orders = useSelector((state) => state.orders.items);
	const ordersFetching = useSelector((state) => state.orders.fetching);
	const tables = useSelector((state) => state.tables.items);
	const tablesLoading = useSelector((state) => state.tables.loading);
	const connectionState = useSelector((state) => state.tables.connectionState);

	React.useEffect(() => {
		dispatch(fetchOrders());
		dispatch(fetchTables());
	}, [dispatch]);

	const todayOrders = React.useMemo(() => {
		const today = new Date();
		return orders.filter((order) => {
			const created = new Date(order[Order_CreatedAt]);
			return !Number.isNaN(created.getTime()) && created.toDateString() === today.toDateString();
		});
	}, [orders]);
	const revenue = todayOrders.reduce((sum, order) => sum + (Number(order[Order_Total]) || 0), 0);
	const activeOrders = orders.filter(
		(order) => !["PAID", "CANCELLED"].includes(String(order[Order_Status]).toUpperCase()),
	);
	const occupiedTables = tables.filter((table) => String(table[Table_Status]).toLowerCase() === "occupied").length;
	const occupancy = tables.length ? Math.round((occupiedTables / tables.length) * 100) : 0;
	const latestOrders = [...orders]
		.sort((a, b) => new Date(b[Order_CreatedAt]) - new Date(a[Order_CreatedAt]))
		.slice(0, 5);
	const locale = currentLanguage === "ar" ? "ar" : "en-US";
	const numberFormat = React.useMemo(() => new Intl.NumberFormat(locale), [locale]);
	const dateFormat = React.useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "short" }), [locale]);
	const revenueTrend = React.useMemo(() => {
		const days = [];
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		for (let offset = 6; offset >= 0; offset -= 1) {
			const day = new Date(today);
			day.setDate(today.getDate() - offset);
			const key = day.toDateString();
			const total = orders.reduce((sum, order) => {
				const created = new Date(order[Order_CreatedAt]);
				return created.toDateString() === key ? sum + (Number(order[Order_Total]) || 0) : sum;
			}, 0);
			days.push({ label: dateFormat.format(day), revenue: total });
		}
		return days;
	}, [orders, dateFormat]);
	const refresh = () => {
		dispatch(fetchOrders());
		dispatch(fetchTables());
	};
	const dateLabel = new Intl.DateTimeFormat(locale, { weekday: "long", month: "long", day: "numeric" }).format(
		new Date(),
	);
	const presetNames = {
		servio: t("settings.presets.servio"),
		blurred: t("settings.presets.blurred"),
		rose: t("settings.presets.rose"),
		ocean: t("settings.presets.ocean"),
		plum: t("settings.presets.plum"),
		custom: t("settings.presets.custom"),
	};
	const presetLabel = presetNames[themeSettings.presetName] || presetNames.custom;
	const weekRevenue = revenueTrend.reduce((total, day) => total + day.revenue, 0);
	return (
		<PageContainer
			sx={(currentTheme) => ({
				height: "auto",
				minHeight: `calc(100dvh - ${currentTheme.tokens.size.appBarHeight}px)`,
				gap: currentTheme.tokens.space.section,
				overflowX: "hidden",
			})}
		>
			<Stack
				direction={{ xs: "column", sm: "row" }}
				gap={2}
				sx={(currentTheme) => ({
					justifyContent: "space-between",
					alignItems: { xs: "stretch", sm: "center" },
					position: "relative",
					overflow: "hidden",
					p: { xs: 2, sm: 2.5 },
					border: "1px solid",
					borderColor: "divider",
					borderRadius: `${currentTheme.tokens.radius.panel}px`,
					background:
						"linear-gradient(115deg, color-mix(in srgb, var(--mui-palette-primary-main) 12%, var(--mui-palette-background-paper)), var(--mui-palette-background-paper) 72%)",
				})}
			>
				<Box sx={{ position: "relative", zIndex: 1 }}>
					<Typography
						variant="overline"
						color="primary.main"
						sx={{ fontWeight: 800, letterSpacing: currentLanguage === "ar" ? "normal" : "0.12em" }}
					>
						SERVIO · {dateLabel}
					</Typography>
					<Typography
						variant="h4"
						sx={{ fontWeight: 800, letterSpacing: currentLanguage === "ar" ? "normal" : "-0.04em", mt: 0.25 }}
					>
						{t("dashboard.greeting")}
					</Typography>
					<Typography color="text.secondary" sx={{ mt: 0.5 }}>
						{t("dashboard.intro")}
					</Typography>
				</Box>
				<Stack direction="row" gap={1} sx={{ position: "relative", zIndex: 1, alignItems: "center" }}>
					<Chip
						size="small"
						variant="outlined"
						color={connectionState === "live" ? "success" : "default"}
						label={
							connectionState === "live"
								? t("dashboard.live")
								: connectionState === "offline"
									? t("dashboard.offline")
									: t("dashboard.connecting")
						}
					/>
					<IconButton
						aria-label={t("dashboard.refresh")}
						onClick={refresh}
						disabled={ordersFetching || tablesLoading}
						sx={{ border: "1px solid", borderColor: "divider", borderRadius: `${theme.tokens.radius.control}px` }}
						name="RefreshRounded"
					/>
				</Stack>
			</Stack>

			<Grid container spacing={1.5}>
				<Grid size={{ xs: 12, sm: 6, xl: 3 }}>
					<MetricCard
						icon={<Icon name="AttachMoneyRounded" />}
						label={t("dashboard.revenue")}
						value={formatCurrency(revenue, currentLanguage)}
						detail={t("dashboard.ordersReceived", { count: numberFormat.format(todayOrders.length) })}
						color={theme.palette.success.main}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, xl: 3 }}>
					<MetricCard
						icon={<Icon name="RoomServiceRounded" />}
						label={t("dashboard.activeOrders")}
						value={numberFormat.format(activeOrders.length)}
						detail={t("dashboard.activeOrdersDetail")}
						color={theme.palette.info.main}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, xl: 3 }}>
					<MetricCard
						icon={<Icon name="TableRestaurantRounded" />}
						label={t("dashboard.occupancy")}
						value={`${numberFormat.format(occupancy)}٪`}
						detail={t("dashboard.occupiedOf", {
							occupied: numberFormat.format(occupiedTables),
							total: numberFormat.format(tables.length),
						})}
						color={theme.palette.warning.main}
						progress={occupancy}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, xl: 3 }}>
					<MetricCard
						icon={<Icon name="LunchDiningRounded" />}
						label={t("dashboard.ordersToday")}
						value={numberFormat.format(todayOrders.length)}
						detail={t("dashboard.ordersTodayDetail")}
						color={theme.palette.primary.main}
					/>
				</Grid>
			</Grid>

			<Grid container spacing={1.5} sx={{ flex: 1, alignContent: "start" }}>
				<Grid size={{ xs: 12 }}>
					<Paper
						variant="outlined"
						sx={(currentTheme) => ({
							p: { xs: 2, sm: 2.5 },
							borderColor: "divider",
							borderRadius: `${currentTheme.tokens.radius.panel}px`,
							bgcolor: "background.paper",
							overflow: "hidden",
						})}
					>
						<Stack
							direction={{
								xs: "column",
								sm: "row",
							}}
							gap={1}
							sx={{ mb: 1, alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between" }}
						>
							<Box>
								<Typography variant="h6" fontWeight={800}>
									{t("dashboard.revenueTrend")}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{t("dashboard.revenueTrendDetail")}
								</Typography>
							</Box>
							<Stack direction="row" sx={{ alignItems: "center" }} gap={1}>
								<Typography variant="subtitle1" fontWeight={800} color="primary.main">
									{formatCurrency(weekRevenue, currentLanguage)}
								</Typography>
								<Chip
									size="small"
									icon={<Icon name="TrendingUpRounded" />}
									label={t("dashboard.today")}
									variant="outlined"
									color="primary"
								/>
							</Stack>
						</Stack>
						<Box sx={{ width: "100%", height: { xs: 220, sm: 250 }, mt: 1 }}>
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart
									data={revenueTrend}
									margin={{
										top: 12,
										right: currentLanguage === "ar" ? 12 : 8,
										left: currentLanguage === "ar" ? 8 : 0,
										bottom: 0,
									}}
								>
									<defs>
										<linearGradient id="dashboardRevenueFill" x1="0" y1="0" x2="0" y2="1">
											<stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity={0.25} />
											<stop offset="100%" stopColor={theme.palette.primary.main} stopOpacity={0.015} />
										</linearGradient>
									</defs>
									<CartesianGrid stroke={theme.palette.divider} strokeDasharray="4 6" vertical={false} />
									<XAxis
										dataKey="label"
										axisLine={false}
										tickLine={false}
										tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
										tickMargin={12}
									/>
									<YAxis
										orientation={currentLanguage === "ar" ? "right" : "left"}
										axisLine={false}
										tickLine={false}
										tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
										tickFormatter={(value) => numberFormat.format(value)}
										width={64}
									/>
									<Tooltip
										contentStyle={{
											direction: currentLanguage === "ar" ? "rtl" : "ltr",
											background: theme.palette.background.paper,
											borderColor: theme.palette.divider,
											borderRadius: `${theme.tokens.radius.card}px`,
											boxShadow: theme.tokens.shadow.card,
										}}
										labelStyle={{ color: theme.palette.text.secondary }}
										formatter={(value) => [formatCurrency(value, currentLanguage), t("dashboard.revenue")]}
									/>
									<Area
										type="monotone"
										dataKey="revenue"
										stroke={theme.palette.primary.main}
										strokeWidth={3}
										fill="url(#dashboardRevenueFill)"
										activeDot={{ r: 5, strokeWidth: 2, stroke: theme.palette.background.paper }}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</Box>
					</Paper>
				</Grid>
				<Grid size={{ xs: 12, lg: 8 }}>
					<Paper
						variant="outlined"
						sx={(currentTheme) => ({
							height: "100%",
							minHeight: 340,
							p: { xs: 2, sm: 2.5 },
							borderColor: "divider",
							borderRadius: `${currentTheme.tokens.radius.panel}px`,
							bgcolor: "background.paper",
						})}
					>
						<Stack direction="row" gap={1} sx={{ mb: 2, justifyContent: "space-between", alignItems: "center" }}>
							<Box>
								<Typography variant="h6" fontWeight={800}>
									{t("dashboard.recentOrders")}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{t("dashboard.recentOrdersDetail")}
								</Typography>
							</Box>
							<Button component={RouterLink} to="/orders" suffix={<Icon name="ArrowForwardRounded" />} size="small">
								{t("dashboard.allOrders")}
							</Button>
						</Stack>
						{latestOrders.length ? (
							<Stack divider={<Box sx={{ borderBottom: "1px solid", borderColor: "divider" }} />}>
								{latestOrders.map((order) => {
									const status = String(order[Order_Status] || "PENDING");
									const statusColor =
										status.toUpperCase() === "READY" || status.toUpperCase() === "SERVED"
											? "success"
											: status.toUpperCase() === "CANCELLED"
												? "error"
												: status.toUpperCase() === "PREPARING"
													? "info"
													: "warning";
									return (
										<Stack key={order[Order_ID]} direction="row" gap={1.5} sx={{ py: 1.6, alignItems: "center" }}>
											<Avatar
												variant="rounded"
												sx={{
													width: 42,
													height: 42,
													bgcolor: "action.hover",
													color: "primary.main",
													borderRadius: `${theme.tokens.radius.control}px`,
												}}
											>
												<Icon name="RoomServiceRounded" fontSize="small" />
											</Avatar>
											<Box sx={{ flex: 1, minWidth: 0 }}>
												<Typography fontWeight={700}>{t("dashboard.orderNumber", { id: order[Order_ID] })}</Typography>
												<Typography variant="body2" color="text.secondary">
													{t("dashboard.table", { number: order.Table?.[Table_Number] ?? order.table_number ?? "—" })} ·{" "}
													{new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(
														new Date(order[Order_CreatedAt]),
													)}
												</Typography>
											</Box>
											<Typography fontWeight={700} sx={{ display: { xs: "none", sm: "block" } }}>
												{formatCurrency(Number(order[Order_Total]) || 0, currentLanguage)}
											</Typography>
											<Chip
												size="small"
												variant="outlined"
												color={statusColor}
												label={t(`orders.status.${status.toLowerCase()}`, { defaultValue: readableStatus(status) })}
											/>
										</Stack>
									);
								})}
							</Stack>
						) : (
							<Box sx={{ minHeight: 210, display: "grid", placeItems: "center", textAlign: "center" }}>
								<Box>
									<Avatar sx={{ mx: "auto", mb: 1.5, bgcolor: "action.hover", color: "text.secondary" }}>
										<Icon name="RoomServiceRounded" />
									</Avatar>
									<Typography fontWeight={700}>{t("dashboard.noOrders")}</Typography>
									<Typography variant="body2" color="text.secondary">
										{t("dashboard.noOrdersDetail")}
									</Typography>
								</Box>
							</Box>
						)}
					</Paper>
				</Grid>
				<Grid size={{ xs: 12, lg: 4 }}>
					<Stack gap={1.5}>
						<Paper
							variant="outlined"
							sx={(currentTheme) => ({
								p: { xs: 2, sm: 2.5 },
								borderColor: "divider",
								borderRadius: `${currentTheme.tokens.radius.panel}px`,
								bgcolor: "background.paper",
							})}
						>
							<Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
								<Box>
									<Typography variant="h6" fontWeight={800}>
										{t("dashboard.atAGlance")}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{t("dashboard.floorNow")}
									</Typography>
								</Box>
								<Icon name="TrendingUpRounded" color="primary" />
							</Stack>
							<Stack gap={2.25} sx={{ mt: 2.5 }}>
								{[
									{ label: t("dashboard.occupied"), value: occupiedTables, color: theme.palette.warning.main },
									{
										label: t("dashboard.available"),
										value: tables.filter((table) => String(table[Table_Status]).toLowerCase() === "available").length,
										color: theme.palette.success.main,
									},
									{
										label: t("dashboard.needsCleaning"),
										value: tables.filter((table) => String(table[Table_Status]).toLowerCase() === "needs_cleaning")
											.length,
										color: theme.palette.info.main,
									},
								].map((item) => (
									<Stack key={item.label} direction="row" sx={{ alignItems: "center" }} gap={1.25}>
										<Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: item.color }} />
										<Typography sx={{ flex: 1 }} variant="body2" color="text.secondary">
											{item.label}
										</Typography>
										<Typography fontWeight={800}>{numberFormat.format(item.value)}</Typography>
									</Stack>
								))}
							</Stack>
							<Button
								component={RouterLink}
								to="/lobby"
								fullWidth
								variant="outlined"
								suffix={<Icon name="ArrowForwardRounded" />}
								sx={{ mt: 2.5 }}
							>
								{t("dashboard.openFloor")}
							</Button>
						</Paper>
						<Paper
							variant="outlined"
							sx={(currentTheme) => ({
								p: { xs: 2, sm: 2.5 },
								borderColor: "divider",
								borderRadius: `${currentTheme.tokens.radius.panel}px`,
								bgcolor: "background.paper",
							})}
						>
							<Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}>
								<Box>
									<Typography variant="subtitle1" fontWeight={800}>
										{t("dashboard.appearance")}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{t("dashboard.appearanceDetail")}
									</Typography>
								</Box>
								<MUTooltip title={t("dashboard.openAppearance")}>
									<IconButton
										aria-label={t("dashboard.openAppearance")}
										component={RouterLink}
										to="/settings"
										size="medium"
										name="MoreHorizRounded"
									/>
								</MUTooltip>
							</Stack>
							<Stack direction="row" sx={{ alignItems: "center", mt: 2 }} gap={1}>
								{Object.keys(themePresets).map((preset) => (
									<MUTooltip
										key={preset}
										title={t("dashboard.theme", { preset: presetNames[preset] })}
										arrow
										placement="top"
									>
										<IconButton
											aria-label={t("dashboard.theme", { preset: presetNames[preset] })}
											onClick={() => saveThemeSettings(themePresets[preset])}
											sx={{
												width: 32,
												height: 32,
												border: "2px solid",
												borderColor: themeSettings.presetName === preset ? "text.primary" : "divider",
												bgcolor: PRESET_COLORS[preset],
												"&:hover": { bgcolor: PRESET_COLORS[preset], opacity: 0.85 },
											}}
										/>
									</MUTooltip>
								))}
								<Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
									{t("dashboard.presetTheme", { preset: presetLabel })}
								</Typography>
							</Stack>
							<Button
								fullWidth
								variant="text"
								onClick={() => setMode(colorScheme === "dark" ? "light" : "dark")}
								sx={{ mt: 0.75, justifyContent: "space-between", px: 1 }}
							>
								{t("dashboard.colorMode")}{" "}
								<Chip size="small" label={colorScheme === "dark" ? t("dashboard.dark") : t("dashboard.light")} />
							</Button>
						</Paper>
					</Stack>
				</Grid>
			</Grid>
		</PageContainer>
	);
};
export default Dashboard;

