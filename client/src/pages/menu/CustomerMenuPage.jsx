import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Box,
	CircularProgress,
	Container,
	Tab,
	Tabs,
	Typography,
	IconButton,
	Button,
	Chip,
	Stack,
	Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TakeoutDiningOutlinedIcon from "@mui/icons-material/TakeoutDiningOutlined";
import { AnimatePresence, motion } from "framer-motion";
import { fetchCategories } from "../../features/categories/CategoriesSlice.js";
import { fetchMenuItems } from "../../features/menuItems/MenuItemsSlice.js";
import { normalizeImageUrl } from "@utils";
import {
	Cat_ID,
	Menu_CatID,
	Menu_IsAvailable,
	Menu_BaseImage,
	Menu_Images,
	Menu_Price,
} from "../../../../constants/FieldsName.js";
import { useLang } from "@hooks";
import CustomerMenuCard from "./CustomerMenuCard.jsx";
import { PageContainer } from "@components";

export const CustomerMenuPage = () => {
	const dispatch = useDispatch();
	const { getFieldsByLang, t } = useLang();

	const categories = useSelector((state) => state.categories?.items ?? []);
	const menuItems = useSelector((state) => state.menuItems?.items ?? []);
	const isLoading = useSelector((state) => state.categories?.loading || state.menuItems?.loading);

	const [selectedCategoryId, setSelectedCategoryId] = React.useState("");
	const [selectedItem, setSelectedItem] = React.useState(null);

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

	return (
		<PageContainer
			sx={(theme) => {
				const primary = (opacity = 1) =>
					`color-mix(in srgb, ${theme.palette.primary.main} ${opacity * 100}%, transparent)`;
				return {
					minHeight: "100vh",
					background: `radial-gradient(circle at top, ${primary(0.1)}, transparent 40%)`,
					position: "relative",
				};
			}}
		>
			<Container maxWidth="lg" sx={{ pb: 8 }}>
				{isLoading && !safeCategories.length && !menuItems.length ? (
					<Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
						<CircularProgress color="warning" />
					</Box>
				) : (
					<AnimatePresence mode="wait">
						{!selectedItem ? (
							/* --- GRID VIEW (All Cards) --- */
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
												borderRadius: "999px",
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
									<Box
										sx={{
											display: "grid",
											gridTemplateColumns: {
												xs: "1fr",
												sm: "repeat(2, minmax(0, 1fr))",
												lg: "repeat(3, minmax(0, 1fr))",
											},
											gap: 3,
										}}
									>
										{categoryItems.map((item) => (
											<CustomerMenuCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
										))}
									</Box>
								)}
							</motion.div>
						) : (
							/* --- EXPANDED FULL-PAGE CARD VIEW --- */
							<motion.div
								key="detail-view"
								layoutId={`card-${selectedItem.id}`} // Matches the clicked card's layoutId
								style={{
									width: "100%",
									minHeight: "75vh",
									borderRadius: "24px",
									backgroundColor: "var(--mui-palette-background-paper, #fff)",
									overflow: "hidden",
									boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
									position: "relative",
								}}
							>
								{/* Back / Close Action */}
								<IconButton
									onClick={() => setSelectedItem(null)}
									sx={{
										position: "absolute",
										top: 16,
										right: 16,
										zIndex: 2,
										bgcolor: "rgba(0,0,0,0.5)",
										color: "#fff",
										"&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
									}}
								>
									<CloseIcon />
								</IconButton>

								{/* Shared Image Transition */}
								{normalizeImageUrl(selectedItem[Menu_BaseImage] || selectedItem[Menu_Images]?.[0]) && (
									<motion.img
										layoutId={`image-${selectedItem.id}`}
										src={normalizeImageUrl(selectedItem[Menu_BaseImage] || selectedItem[Menu_Images]?.[0])}
										alt={getFieldsByLang(selectedItem, "name")}
										style={{
											width: "100%",
											height: "380px",
											objectFit: "cover",
										}}
									/>
								)}

								{/* Detailed Information */}
								<Box sx={{ p: { xs: 3, md: 5 } }}>
									<Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
										<Typography variant="h3" sx={{ fontWeight: 800 }}>
											{getFieldsByLang(selectedItem, "name")}
										</Typography>
										<Chip
											label={selectedItem[Menu_IsAvailable] === false ? "Unavailable" : "Available"}
											color={selectedItem[Menu_IsAvailable] === false ? "default" : "success"}
											size="medium"
										/>
									</Stack>

									<Typography variant="h4" sx={{ fontWeight: 800, color: "warning.main", my: 2 }}>
										${Number(selectedItem[Menu_Price] ?? 0).toFixed(2)}
									</Typography>

									<Divider sx={{ my: 3 }} />

									<Typography variant="h6" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
										{getFieldsByLang(selectedItem, "description") || "No detailed description available."}
									</Typography>

									<Stack direction="row" spacing={2} sx={{ mt: 5 }}>
										<Button variant="outlined" size="large" onClick={() => setSelectedItem(null)}>
											{t("common.back") || "Back to Menu"}
										</Button>
										<Button
											variant="contained"
											size="large"
											startIcon={<TakeoutDiningOutlinedIcon />}
											sx={{ bgcolor: "primary.main", color: "#fff", px: 4 }}
										>
											{t("customerMenu.card.order") || "Order Now"}
										</Button>
									</Stack>
								</Box>
							</motion.div>
						)}
					</AnimatePresence>
				)}
			</Container>
		</PageContainer>
	);
};

export default CustomerMenuPage;
