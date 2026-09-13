import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Box,
	Button as MuiButton,
	Card,
	CircularProgress,
	Container,
	Divider,
	Grid,
	Stack,
	Tab,
	Tabs,
	TextField,
	Typography,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
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
import { Icon, PageContainer } from "@components";

export const CustomerMenuPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { tableId } = useParams();
	const { getFieldsByLang } = useLang();

	const categories = useSelector((state) => state.categories?.items ?? []);
	const menuItems = useSelector((state) => state.menuItems?.items ?? []);
	const isLoading = useSelector((state) => state.categories?.loading || state.menuItems?.loading);
	const tables = useSelector((state) => state.tables?.items ?? []);
	const orderLoading = useSelector((state) => state.orders?.loading);
	const table = tables.find((candidate) => String(candidate.id) === String(tableId));
	const [cart, setCart] = React.useState([]);

	const [selectedCategoryId, setSelectedCategoryId] = React.useState("");

	React.useEffect(() => {
		dispatch(fetchCategories());
		dispatch(fetchMenuItems());
	}, [dispatch]);

	const safeCategories = React.useMemo(
		() => categories.filter((category) => category && category[Cat_ID] !== undefined && category[Cat_ID] !== null),
		[categories],
	);

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

	const handleTabChange = (_, nextValue) => {
		setSelectedCategoryId(nextValue);
	};

	const addToCart = (item) => {
		setCart((currentCart) => {
			const itemId = item[Menu_ID] ?? item.id;
			const existing = currentCart.find((cartItem) => String(cartItem.id) === String(itemId));
			if (existing) {
				return currentCart.map((cartItem) =>
					String(cartItem.id) === String(itemId)
						? { ...cartItem, quantity: cartItem.quantity + 1 }
						: cartItem,
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
	};

	const updateQuantity = (itemId, quantity) => {
		setCart((currentCart) =>
			quantity > 0
				? currentCart.map((item) => (item.id === itemId ? { ...item, quantity } : item))
				: currentCart.filter((item) => item.id !== itemId),
		);
	};

	const updateNotes = (itemId, notes) => {
		setCart((currentCart) =>
			currentCart.map((item) => (item.id === itemId ? { ...item, notes } : item)),
		);
	};

	const submitOrder = async () => {
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
	};

	if (!table) {
		return (
			<PageContainer sx={{ alignItems: "center", justifyContent: "center", gap: 2 }}>
				<Typography variant="h6">Select an available table from the lobby first.</Typography>
				<MuiButton variant="contained" onClick={() => navigate("/lobby")}>Back to lobby</MuiButton>
			</PageContainer>
		);
	}

	const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

	return (
		<PageContainer
			sx={(theme) => {
				const primary = (opacity = 1) =>
					`color-mix(in srgb, ${theme.palette.primary.main} ${opacity * 100}%, transparent)`;
				return {
					background: `radial-gradient(circle at top, ${primary(0.1)}, transparent 40%)`,
					position: "relative",
				};
			}}
		>
			<Container maxWidth="lg" sx={{ pb: 8 }}>
				<Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 3 }}>
					<Box>
						<Typography variant="h5" sx={{ fontWeight: 800 }}>Table {table[Table_Number]}</Typography>
						<Typography color="text.secondary">Choose your items and send the order to the kitchen.</Typography>
					</Box>
					<MuiButton variant="outlined" startIcon={<Icon name="ArrowBack" />} onClick={() => navigate("/lobby")}>
						Back
					</MuiButton>
				</Stack>
				{isLoading && !safeCategories.length && !menuItems.length ? (
					<Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
						<CircularProgress color="warning" />
					</Box>
				) : (
					<AnimatePresence mode="wait">
						<motion.div
							key="grid-view"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
						>
							{safeCategories.length > 0 && (
								<Tabs
									value={activeCategory?.[Cat_ID] ?? false}
									onChange={handleTabChange}
									variant="scrollable"
									scrollButtons="auto"
									sx={{
										mb: 4,
										borderBottom: 1,
										borderColor: "divider",

										".MuiTabs-flexContainer": { gap: 1 },
										".MuiTab-root": {
											textTransform: "none",
											fontWeight: 700,

											minHeight: 42,
											px: 3,
										},
									}}
								>
									{safeCategories.map((category) => (
										<Tab
											key={category[Cat_ID]}
											label={getFieldsByLang(category, "name") || "Category"}
											value={category[Cat_ID]}
										/>
									))}
								</Tabs>
							)}

							{!activeCategory ? (
								<Box sx={{ py: 6, textAlign: "center" }}>
									<Typography variant="h6" color="text.secondary">
										No menu categories are available right now.
									</Typography>
								</Box>
							) : categoryItems.length === 0 ? (
								<Box sx={{ py: 6, textAlign: "center" }}>
									<Typography variant="h6" color="text.secondary">
										No items available in {getFieldsByLang(activeCategory, "name")} yet.
									</Typography>
								</Box>
							) : (
								<Grid container spacing={3}>
									<Grid size={{ xs: 12, md: 8 }}>
								<Box
									sx={{
										display: "grid",
										gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
										gap: 3,
									}}
								>
									{categoryItems.map((item) => (
										<CustomerMenuCard key={item.id} item={item} onOrder={addToCart} />
									))}
								</Box>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
									<Card sx={{ p: 2.5, position: "sticky", top: 16 }}>
										<Typography variant="h6" sx={{ fontWeight: 800 }}>Your order</Typography>
										<Divider sx={{ my: 2 }} />
										{cart.length === 0 ? (
											<Typography color="text.secondary">Your order is empty.</Typography>
										) : (
											<Stack spacing={1.5}>
												{cart.map((item) => (
													<Stack key={item.id} direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between" }}>
														<Box sx={{ minWidth: 0, flex: 1 }}>
															<Typography noWrap>{item.name}</Typography>
															<Typography variant="body2" color="text.secondary">${(item.price * item.quantity).toFixed(2)}</Typography>
															<TextField
																fullWidth
																size="small"
																margin="dense"
																label="Notes"
																placeholder="e.g. no onions"
																value={item.notes}
																onChange={(event) => updateNotes(item.id, event.target.value)}
																inputProps={{ maxLength: 500 }}
															/>
														</Box>
														<Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
															<MuiButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</MuiButton>
															<Typography>{item.quantity}</Typography>
															<MuiButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</MuiButton>
														</Stack>
													</Stack>
												))}
												<Divider />
												<Stack direction="row" sx={{ justifyContent: "space-between" }}>
													<Typography sx={{ fontWeight: 700 }}>Total</Typography>
													<Typography sx={{ fontWeight: 700 }}>${cartTotal.toFixed(2)}</Typography>
												</Stack>
												<MuiButton variant="contained" fullWidth disabled={orderLoading} onClick={submitOrder}>
													{orderLoading ? "Sending..." : "Send order"}
												</MuiButton>
											</Stack>
										)}
									</Card>
								</Grid>
							</Grid>
							)}
						</motion.div>
					</AnimatePresence>
				)}
			</Container>
		</PageContainer>
	);
};

export default CustomerMenuPage;
