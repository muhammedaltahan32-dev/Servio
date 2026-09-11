import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, Container, Tab, Tabs, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { fetchCategories } from "../../features/categories/CategoriesSlice.js";
import { fetchMenuItems } from "../../features/menuItems/MenuItemsSlice.js";
import { normalizeImageUrl } from "@utils";
import { Cat_ID, Menu_CatID, Menu_IsAvailable } from "../../../../constants/FieldsName.js";
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
								<Box
									sx={{
										display: "grid",
										gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
										gap: 3,
									}}
								>
									{categoryItems.map((item) => (
										<CustomerMenuCard key={item.id} item={item} />
									))}
								</Box>
							)}
						</motion.div>
					</AnimatePresence>
				)}
			</Container>
		</PageContainer>
	);
};

export default CustomerMenuPage;
