import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Chip,
	CircularProgress,
	Container,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	Tab,
	Tabs,
	Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { fetchCategories } from "../../features/categories/CategoriesSlice.js";
import { fetchMenuItems } from "../../features/menuItems/MenuItemsSlice.js";
import { normalizeImageUrl } from "@utils";
import {
	Cat_ID,
	Cat_Name_AR,
	Cat_Name_EN,
	Menu_BaseImage,
	Menu_CatID,
	Menu_Description_AR,
	Menu_Description_EN,
	Menu_Images,
	Menu_IsAvailable,
	Menu_Name_AR,
	Menu_Name_EN,
	Menu_Price,
} from "../../../../constants/FieldsName.js";
import { useLang } from "@hooks";
const normalizeImage = (value) => {
	const image = value || "";
	if (!image) return "";
	return normalizeImageUrl(image);
};

export const CustomerMenuPage = () => {
	const dispatch = useDispatch();
	const categories = useSelector((state) => state.categories?.items ?? []);
	const menuItems = useSelector((state) => state.menuItems?.items ?? []);
	const isLoading = useSelector((state) => state.categories?.loading || state.menuItems?.loading);
	const [selectedCategoryId, setSelectedCategoryId] = React.useState("");
	const [selectedItem, setSelectedItem] = React.useState(null);
	const { getFieldsByLang } = useLang();
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

	const galleryImages = React.useMemo(() => {
		if (!selectedItem) return [];
		const images = [
			selectedItem[Menu_BaseImage],
			...(Array.isArray(selectedItem[Menu_Images]) ? selectedItem[Menu_Images] : []),
		];
		return images.filter(Boolean).map(normalizeImage);
	}, [selectedItem]);

	return (
		<Box
			sx={{
				minHeight: "100vh",
				background: "linear-gradient(180deg, #fff8f0 0%, #fff 30%, #fffaf5 100%)",
				color: "#1f2937",
			}}
		>
			<Box
				sx={{
					py: { xs: 4, md: 6 },
					background: "radial-gradient(circle at top, rgba(255, 153, 0, 0.18), transparent 45%)",
				}}
			>
				<Container maxWidth="lg">
					<Stack
						direction={{ xs: "column", sm: "row" }}
						spacing={2}
						justifyContent="space-between"
						alignItems={{ xs: "flex-start", sm: "center" }}
					>
						<Box>
							<Typography variant="overline" sx={{ letterSpacing: 2, color: "warning.main", fontWeight: 700 }}>
								Bistro menu
							</Typography>
							<Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: -0.8 }}>
								Choose your favorites
							</Typography>
						</Box>
						<Button
							variant="contained"
							color="warning"
							onClick={() => setSelectedCategoryId(safeCategories[0]?.[Cat_ID] || "")}
						>
							View menu
						</Button>
					</Stack>
				</Container>
			</Box>

			<Container maxWidth="lg" sx={{ pb: 8 }}>
				{isLoading && !safeCategories.length && !menuItems.length ? (
					<Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
						<CircularProgress color="warning" />
					</Box>
				) : (
					<>
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
									gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" },
									gap: 3,
								}}
							>
								{categoryItems.map((item) => {
									const image = normalizeImage(item[Menu_BaseImage] || item[Menu_Images]?.[0]);
									const price = Number(item[Menu_Price] ?? 0);

									return (
										<Card
											key={item.id}
											sx={{
												height: "100%",
												borderRadius: 4,
												overflow: "hidden",
												boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
												border: "1px solid rgba(15, 23, 42, 0.08)",
												transition: "transform 0.2s ease, box-shadow 0.2s ease",
												"&:hover": {
													transform: "translateY(-4px)",
													boxShadow: "0 24px 50px rgba(15, 23, 42, 0.12)",
												},
											}}
										>
											<CardActionArea onClick={() => setSelectedItem(item)} sx={{ height: "100%" }}>
												<CardMedia
													component="img"
													image={
														image ||
														"https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80"
													}
													alt={getFieldsByLang(item, "name")}
													sx={{ height: 220, objectFit: "cover" }}
												/>
												<CardContent sx={{ p: 2.5 }}>
													<Stack
														direction="row"
														justifyContent="space-between"
														alignItems="center"
														spacing={1}
														sx={{ mb: 1.5 }}
													>
														<Typography variant="h6" sx={{ fontWeight: 700 }}>
															{getFieldsByLang(item, "name")}
														</Typography>
														<Chip
															label={item[Menu_IsAvailable] === false ? "Unavailable" : "Available"}
															color={item[Menu_IsAvailable] === false ? "default" : "success"}
															size="small"
														/>
													</Stack>

													<Typography variant="body2" color="text.secondary" sx={{ minHeight: 48, mb: 2 }}>
														{getFieldsByLang(item, "description") ||
															"Fresh ingredients and authentic taste in every bite."}
													</Typography>

													<Stack direction="row" justifyContent="space-between" alignItems="center">
														<Typography variant="h6" sx={{ fontWeight: 800, color: "warning.main" }}>
															{new Intl.NumberFormat("en-US", {
																style: "currency",
																currency: "USD",
															}).format(price)}
														</Typography>
														<Button variant="text" color="warning" sx={{ fontWeight: 700, px: 0 }}>
															View details
														</Button>
													</Stack>
												</CardContent>
											</CardActionArea>
										</Card>
									);
								})}
							</Box>
						)}
					</>
				)}
			</Container>

			<Dialog open={Boolean(selectedItem)} onClose={() => setSelectedItem(null)} maxWidth="md" fullWidth>
				{selectedItem && (
					<>
						<DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
							<Box>
								<Typography variant="h5" sx={{ fontWeight: 800 }}>
									{getFieldsByLang(selectedItem, "name")}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{getFieldsByLang(
										safeCategories.find((category) => category[Cat_ID] === selectedItem[Menu_CatID]),
										"name",
									) || "Menu item"}
								</Typography>
							</Box>
							<IconButton edge="end" color="inherit" onClick={() => setSelectedItem(null)} aria-label="close">
								<CloseIcon />
							</IconButton>
						</DialogTitle>

						<DialogContent dividers sx={{ p: { xs: 2, md: 3 } }}>
							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" },
									gap: 3,
									alignItems: "start",
								}}
							>
								<Box>
									<Box
										sx={{
											display: "grid",
											gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
											gap: 2,
										}}
									>
										{galleryImages.length > 0 ? (
											galleryImages.map((image, index) => (
												<Card
													key={`${selectedItem.id}-${index}`}
													sx={{ overflow: "hidden", borderRadius: 3, border: "1px solid rgba(0,0,0,0.08)" }}
												>
													<CardMedia
														component="img"
														image={image}
														alt={`${getFieldsByLang(selectedItem, "name")} ${index + 1}`}
														sx={{ height: 190, objectFit: "cover" }}
													/>
												</Card>
											))
										) : (
											<Card sx={{ borderRadius: 3, overflow: "hidden" }}>
												<CardMedia
													component="img"
													image="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80"
													alt={getFieldsByLang(selectedItem, "name")}
													sx={{ height: 190, objectFit: "cover" }}
												/>
											</Card>
										)}
									</Box>
								</Box>

								<Box>
									<Typography variant="h4" sx={{ fontWeight: 800, color: "warning.main", mb: 2 }}>
										{new Intl.NumberFormat("en-US", {
											style: "currency",
											currency: "USD",
										}).format(Number(selectedItem[Menu_Price] ?? 0))}
									</Typography>

									<Chip
										label={selectedItem[Menu_IsAvailable] === false ? "Currently unavailable" : "Available now"}
										color={selectedItem[Menu_IsAvailable] === false ? "default" : "success"}
										sx={{ mb: 2 }}
									/>

									<Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: "pre-line" }}>
										{getFieldsByLang(selectedItem, "description") ||
											"Fresh ingredients, balanced flavors, and a warm presentation make this dish a favorite choice for guests."}
									</Typography>
								</Box>
							</Box>
						</DialogContent>
					</>
				)}
			</Dialog>
		</Box>
	);
};

export default CustomerMenuPage;
