import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Card, CircularProgress, Divider, Stack, Typography, useTheme } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import IcecreamIcon from "@mui/icons-material/Icecream";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import PaymentsIcon from "@mui/icons-material/Payments";
import RamenDiningIcon from "@mui/icons-material/RamenDining";
import SearchIcon from "@mui/icons-material/Search";
import SoupKitchenIcon from "@mui/icons-material/SoupKitchen";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCategories } from "../../features/categories/CategoriesSlice.js";
import { fetchMenuItems } from "../../features/menuItems/MenuItemsSlice.js";
import { createOrder } from "../../features/orders/OrdersSlice.js";
import {
	Cat_ID,
	Item_Notes,
	Menu_CatID,
	Menu_ID,
	Menu_IsAvailable,
	Menu_Price,
	Table_Number,
} from "../../../../constants/FieldsName.js";
import { useLang } from "@hooks";
import CustomerMenuCard from "./CustomerMenuCard.jsx";
import { Button, Input, PageContainer } from "@components";
import { formatCurrency as formatMoney } from "@utils";

const CATEGORY_ICONS = [FreeBreakfastIcon, LunchDiningIcon, DinnerDiningIcon, SoupKitchenIcon, IcecreamIcon, RamenDiningIcon, FastfoodIcon, LocalCafeIcon];
const EMPTY_CART_SUMMARY = { total: 0, itemCount: 0 };

const MenuCategoryTile = React.memo(({ categoryId, categoryName, icon: CategoryIcon, countLabel, selected, onSelect }) => (
	<Card
		component="button"
		onClick={() => onSelect(categoryId)}
		sx={{
			display: "flex",
			alignItems: "center",
			gap: 1.25,
			textAlign: "start",
			p: 1.25,
			minWidth: 0,
			border: "1px solid",
			borderColor: selected ? "primary.main" : "divider",
			bgcolor: selected ? "primary.main" : "background.paper",
			color: selected ? "primary.contrastText" : "text.primary",
			borderRadius: 1.5,
			cursor: "pointer",
			boxShadow: "none",
			transition: "all .18s ease",
			"&:hover": { borderColor: "primary.main", transform: "translateY(-1px)" },
		}}
	>
		<Box sx={{ display: "grid", placeItems: "center", width: 36, height: 36, flexShrink: 0, borderRadius: 1, bgcolor: selected ? "rgba(255,255,255,.18)" : "action.hover" }}>
			<CategoryIcon />
		</Box>
		<Box sx={{ minWidth: 0 }}>
			<Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>{categoryName}</Typography>
			<Typography variant="caption" sx={{ opacity: 0.75 }}>{countLabel}</Typography>
		</Box>
	</Card>
));
MenuCategoryTile.displayName = "MenuCategoryTile";

export const CustomerMenuPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const theme = useTheme();
	const { tableId } = useParams();
	const { getFieldsByLang, t, currentLanguage } = useLang();

	const categories = useSelector((state) => state.categories?.items ?? []);
	const menuItems = useSelector((state) => state.menuItems?.items ?? []);
	const isLoading = useSelector((state) => state.categories?.loading || state.menuItems?.loading);
	const tables = useSelector((state) => state.tables?.items ?? []);
	const orderLoading = useSelector((state) => state.orders?.loading);
	const table = React.useMemo(() => tables.find((candidate) => String(candidate.id) === String(tableId)), [tables, tableId]);
	const [cart, setCart] = React.useState([]);
	const [search, setSearch] = React.useState("");
	const [paymentMethod, setPaymentMethod] = React.useState("card");

	const [selectedCategoryId, setSelectedCategoryId] = React.useState("");
	const formatCurrency = React.useCallback((value) => formatMoney(value, currentLanguage), [currentLanguage]);
	React.useEffect(() => {
		dispatch(fetchCategories());
		dispatch(fetchMenuItems());
	}, [dispatch]);

	const safeCategories = React.useMemo(
		() => categories.filter((category) => category && category[Cat_ID] !== undefined && category[Cat_ID] !== null),
		[categories],
	);
	const availableItemCounts = React.useMemo(() => {
		const counts = new Map();
		for (const item of menuItems) {
			if (!item || item[Menu_IsAvailable] === false) continue;
			const categoryId = String(item[Menu_CatID]);
			counts.set(categoryId, (counts.get(categoryId) ?? 0) + 1);
		}
		return counts;
	}, [menuItems]);

	const activeCategory = React.useMemo(() => {
		const found = safeCategories.find((category) => category[Cat_ID] === selectedCategoryId);
		return found || safeCategories[0] || null;
	}, [safeCategories, selectedCategoryId]);

	const categoryItems = React.useMemo(() => {
		if (!activeCategory) return [];
		return menuItems.filter((item) => {
			if (!item) return false;
			const itemCategoryId = item[Menu_CatID];
			const isAvailable = item[Menu_IsAvailable] !== false;
			return String(itemCategoryId) === String(activeCategory[Cat_ID]) && isAvailable;
		});
	}, [activeCategory, menuItems]);
	const visibleItems = React.useMemo(() => {
		const query = search.trim().toLocaleLowerCase();
		if (!query) return categoryItems;
		return categoryItems.filter((item) => {
			const name = getFieldsByLang(item, "name") || "";
			const description = getFieldsByLang(item, "description") || "";
			return `${name} ${description}`.toLocaleLowerCase().includes(query);
		});
	}, [categoryItems, getFieldsByLang, search]);

	const handleCategorySelect = React.useCallback((categoryId) => setSelectedCategoryId(categoryId), []);

	const addToCart = React.useCallback((item) => {
		setCart((currentCart) => {
			const itemId = item[Menu_ID] ?? item.id;
			const existing = currentCart.find((cartItem) => String(cartItem.id) === String(itemId));
			if (existing) {
				return currentCart.map((cartItem) =>
					String(cartItem.id) === String(itemId) ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
				);
			}
			return [
				...currentCart,
				{
					id: itemId,
					name: getFieldsByLang(item, "name"),
					price: Number(item[Menu_Price] ?? 0),
					quantity: 1,
					notes: "",
				},
			];
		});
	}, [getFieldsByLang]);

	const updateQuantity = React.useCallback((itemId, quantity) => {
		setCart((currentCart) =>
			quantity > 0
				? currentCart.map((item) => (item.id === itemId ? { ...item, quantity } : item))
				: currentCart.filter((item) => item.id !== itemId),
		);
	}, []);

	const updateNotes = React.useCallback((itemId, notes) => {
		setCart((currentCart) => currentCart.map((item) => (item.id === itemId ? { ...item, notes } : item)));
	}, []);

	const submitOrder = React.useCallback(() => {
		(async () => {
			if (!table || cart.length === 0) return;
			const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
			const result = await dispatch(
				createOrder({
					table_id: table.id,
					subtotal,
					tax_amount: 0,
					total_amount: subtotal,
					items: cart.map((item) => ({
						menu_item_id: item.id,
						quantity: item.quantity,
						unit_price: item.price,
						[Item_Notes]: item.notes.trim() || null,
					})),
				}),
			);
			if (createOrder.fulfilled.match(result)) {
				setCart([]);
				navigate("/lobby");
			}
		})();
	}, [cart, dispatch, navigate, table]);
	const cartSummary = React.useMemo(
		() => cart.reduce((summary, item) => ({
			total: summary.total + item.price * item.quantity,
			itemCount: summary.itemCount + item.quantity,
		}), EMPTY_CART_SUMMARY),
		[cart],
	);
	const cartQuantities = React.useMemo(() => new Map(cart.map((item) => [String(item.id), item.quantity])), [cart]);
	const cartTotal = cartSummary.total;

	if (!table) {
		return (
			<PageContainer sx={{ alignItems: "center", justifyContent: "center", gap: 2 }}>
				<Typography variant="h6">{t("customerMenu.selectAvailableTable")}</Typography>
				<Button onClick={() => navigate("/lobby")}>{t("customerMenu.backToLobby")}</Button>
			</PageContainer>
		);
	}

	return (
		<PageContainer
			sx={{
				height: "auto",
				minHeight: `calc(100dvh - ${theme.tokens.size.appBarHeight}px)`,
				width: "100%",
				minWidth: 0,
				overflowX: "hidden",
				// bgcolor: "background.default",
			}}
		>
			<Stack
				direction={{ xs: "column", sm: "row" }}
				sx={{
					alignItems: { xs: "stretch", sm: "center" },
					justifyContent: "space-between",
					gap: 2,
					mb: 2.5,
					minWidth: 0,
				}}
			>
				<Box sx={{ minWidth: 0 }}>
					<Typography variant="h5" sx={{ fontWeight: 800 }}>
						{t("customerMenu.pageTitle", { number: table[Table_Number] })}
					</Typography>
					<Typography color="text.secondary">{t("customerMenu.chooseItems")}</Typography>
				</Box>
				<Button
					variant="outlined"
					prefix={currentLanguage === "ar" ? <ArrowForwardIcon /> : <ArrowBackIcon />}
					onClick={() => navigate("/lobby")}
				>
					{t("customerMenu.backToLobby")}
				</Button>
			</Stack>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1fr) 300px" },
					gap: { xs: 2, md: 2.5 },
					alignItems: "start",
					minWidth: 0,
				}}
			>
				<Box sx={{ minWidth: 0 }}>
					<Input
						fullWidth
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder={t("customerMenu.searchPlaceholder")}
						sx={{ mb: 2.5, bgcolor: "background.paper" }}
						prefix={<SearchIcon sx={{ color: "text.secondary" }} />}
					/>
					{isLoading && !safeCategories.length && !menuItems.length ? (
						<Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
							<CircularProgress />
						</Box>
					) : (
						<>
							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: "repeat( auto-fit, minmax(min(100%, 145px), 1fr))",
									gap: 1.25,
									mb: 2.5,
									minWidth: 0,
								}}
							>
								{safeCategories.map((category, index) => {
									const count = availableItemCounts.get(String(category[Cat_ID])) ?? 0;
									const selected = String(category[Cat_ID]) === String(activeCategory?.[Cat_ID]);
									return <MenuCategoryTile
										key={category[Cat_ID]}
										categoryId={category[Cat_ID]}
										categoryName={getFieldsByLang(category, "name") || t("customerMenu.category")}
										icon={CATEGORY_ICONS[index % CATEGORY_ICONS.length]}
										countLabel={t("customerMenu.menuItemCount", { count })}
										selected={selected}
										onSelect={handleCategorySelect}
									/>;
								})}
							</Box>
							<Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
								{activeCategory ? getFieldsByLang(activeCategory, "name") : t("customerMenu.menu")}
							</Typography>
							{!activeCategory ? (
								<Typography color="text.secondary" sx={{ py: 4 }}>
									{t("customerMenu.noCategories")}
								</Typography>
							) : visibleItems.length === 0 ? (
								<Typography color="text.secondary" sx={{ py: 4 }}>
									{search ? t("customerMenu.noMatchingItems") : t("customerMenu.noAvailableItems")}
								</Typography>
							) : (
								<AnimatePresence mode="wait">
									<motion.div
										key={String(activeCategory[Cat_ID]) + search}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.18 }}
										style={{
											display: "grid",
											gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))",
											gap: 1.25,
											minWidth: 0,
										}}
									>
										{visibleItems.map((item, index) => (
											<CustomerMenuCard
												key={item[Menu_ID] ?? item.id}
												item={item}
												itemId={item[Menu_ID] ?? item.id}
												index={index}
												quantity={cartQuantities.get(String(item[Menu_ID] ?? item.id)) ?? 0}
												onOrder={addToCart}
												onQuantityChange={updateQuantity}
											/>
										))}
									</motion.div>
								</AnimatePresence>
							)}
						</>
					)}
				</Box>
				<Card
					sx={{
						p: 2,
						minWidth: 0,
						width: "100%",
						position: { lg: "sticky" },
						top: 16,
						border: "1px solid",
						borderColor: "divider",
						borderRadius: 1.5,
						boxShadow: theme.tokens.shadow.subtle,
					}}
				>
					<Typography variant="h6" sx={{ fontWeight: 800 }}>
						{t("customerMenu.invoice")}{" "}
						<Typography component="span" variant="body2" color="text.secondary">
							{t("customerMenu.itemsCount", { count: cartSummary.itemCount })}
						</Typography>
					</Typography>
					<Divider sx={{ my: 1.5 }} />
					{cart.length === 0 ? (
						<Typography color="text.secondary" sx={{ py: 2 }}>
							{t("customerMenu.invoiceEmpty")}
						</Typography>
					) : (
						<Stack spacing={1.5} sx={{ maxHeight: { lg: "45vh" }, overflowY: "auto", pr: 0.5 }}>
							{cart.map((item) => (
								<Stack key={item.id} direction="row" spacing={1} sx={{ alignItems: "center", minWidth: 0 }}>
									<Box sx={{ flex: 1, minWidth: 0 }}>
										<Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
											{item.name}
										</Typography>
										<Typography dir="ltr" variant="caption" color="text.secondary">
											{item.quantity} x {formatCurrency(item.price)}
										</Typography>
										<Input
											fullWidth
											placeholder={t("customerMenu.addNote")}
											value={item.notes}
											onChange={(event) => updateNotes(item.id, event.target.value)}
											inputProps={{ maxLength: 500 }}
											sx={{ mt: 0.75 }}
										/>
									</Box>
					<Stack spacing={0.5} sx={{ alignItems: "flex-end", flexShrink: 0 }}>
										<Typography dir="ltr" variant="body2" sx={{ fontWeight: 700 }}>
											{formatCurrency(item.price * item.quantity)}
										</Typography>
						<Stack direction="row" sx={{ alignItems: "center" }}>
											<Button
												aria-label={t("customerMenu.removeOne", { name: item.name })}
												size="small"
												variant="text"
												onClick={() => updateQuantity(item.id, item.quantity - 1)}
												sx={{ minWidth: 30, p: 0.25 }}
											>
												−
											</Button>
											<Typography variant="caption">{item.quantity}</Typography>
											<Button
												aria-label={t("customerMenu.addOne", { name: item.name })}
												size="small"
												variant="text"
												onClick={() => updateQuantity(item.id, item.quantity + 1)}
												sx={{ minWidth: 30, p: 0.25 }}
											>
												+
											</Button>
										</Stack>
									</Stack>
								</Stack>
							))}
						</Stack>
					)}
					<Divider sx={{ my: 1.5 }} />
					<Stack spacing={0.75}>
						<Stack direction="row" sx={{ justifyContent: "space-between" }}>
							<Typography variant="body2" color="text.secondary">
								{t("customerMenu.subtotal")}
							</Typography>
							<Typography dir="ltr" variant="body2">
								{formatCurrency(cartTotal)}
							</Typography>
						</Stack>
						<Stack direction="row" sx={{ justifyContent: "space-between" }}>
							<Typography variant="body2" color="text.secondary">
								{t("customerMenu.tax")}
							</Typography>
							<Typography dir="ltr" variant="body2">
								{formatCurrency(0)}
							</Typography>
						</Stack>
						<Divider sx={{ my: 0.5 }} />
						<Stack direction="row" sx={{ justifyContent: "space-between" }}>
							<Typography sx={{ fontWeight: 800 }}>{t("customerMenu.totalPayment")}</Typography>
							<Typography dir="ltr" sx={{ fontWeight: 800 }}>
								{formatCurrency(cartTotal)}
							</Typography>
						</Stack>
					</Stack>
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
							gap: 0.75,
							mt: 2,
							p: 0.75,
							bgcolor: "action.hover",
							borderRadius: 1.25,
						}}
					>
						{[
							["card", CreditCardIcon, t("customerMenu.paymentCard")],
							["wallet", WalletIcon, t("customerMenu.paymentWallet")],
							["cash", PaymentsIcon, t("customerMenu.paymentCash")],
						].map(([method, PaymentIcon, label]) => (
							<Button
								key={method}
								onClick={() => setPaymentMethod(method)}
								color={paymentMethod === method ? "primary" : "inherit"}
								variant={paymentMethod === method ? "contained" : "text"}
								sx={{
									minWidth: 0,
									px: 0.5,
									py: 0.75,
									display: "flex",
									flexDirection: "column",
									gap: 0.25,
									fontSize: 10,
									lineHeight: 1.2,
									boxShadow: "none",
								}}
							>
								<PaymentIcon sx={{ fontSize: "1.1rem" }} />
								{label}
							</Button>
						))}
					</Box>
					<Button
						fullWidth
						disabled={orderLoading || cart.length === 0}
						onClick={submitOrder}
						suffix={currentLanguage === "ar" ? <ArrowBackIcon /> : <ArrowForwardIcon />}
						sx={{ mt: 1.5, py: 1.25, fontWeight: 700 }}
					>
						{orderLoading ? t("customerMenu.placingOrder") : t("customerMenu.placeOrder")}
					</Button>
				</Card>
			</Box>
		</PageContainer>
	);
};

export default CustomerMenuPage;
