import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Box, Container, Grid, Stack } from "@mui/material";
import { Button, Dialog, Input, Table, Select, PhotoAlbumGallery, PageContainer } from "@components";
import { MenuItem } from "@mui/material";
import { useLang } from "@hooks";
import {
	fetchMenuItems,
	addMenuItem,
	updateMenuItem,
	deleteMenuItem,
	uploadImage,
} from "../../features/menuItems/MenuItemsSlice.js";
import { fetchCategories } from "../../features/categories/CategoriesSlice.js";

import {
	Menu_CatID,
	Menu_Price,
	Menu_IsAvailable,
	Menu_BaseImage,
	Menu_Images,
	Menu_Description_AR,
	Menu_Description_EN,
	Menu_Name_AR,
	Menu_Name_EN,
} from "../../../../constants/FieldsName.js";
import MenuItemsDialog from "./MenuItemsDialog.jsx";

export const MenuItemsPage = () => {
	const dispatch = useDispatch();
	const { t } = useLang();
	const { items: menuItems, loading } = useSelector((state) => state.menuItems || { items: [], loading: false });
	const { items: categories } = useSelector((state) => state.categories || { items: [] });
	const columns = React.useMemo(
		() => [
			{
				field: Menu_BaseImage,
				headerName: t("menuItems.baseImage"),
				render: (value, row) => {
					const imageUrl = value || row[Menu_Images]?.[0] || null;
					if (!imageUrl) return "---";
					return (
						<Avatar
							src={imageUrl}
							alt="menu item"
							sx={(theme) => ({
								width: 52,
								height: 52,
								objectFit: "cover",
								borderRadius: theme.shape.borderRadius + "px",
								display: "block",
							})}
						/>
					);
				},
			},
			{ field: Menu_Name_AR, headerName: t("menuItems.nameAr") },
			{ field: Menu_Name_EN, headerName: t("menuItems.nameEN") },
			{ field: Menu_Price, headerName: t("menuItems.price") },
			{ field: Menu_CatID, headerName: t("menuItems.category") },
			{ field: Menu_IsAvailable, headerName: t("menuItems.available") },
			{ field: Menu_Description_AR, headerName: t("menuItems.descriptionAr") },
			{ field: Menu_Description_EN, headerName: t("menuItems.descriptionEn") },
		],
		[t],
	);

	const inLoadRef = React.useRef(null);
	const inLoadCatsRef = React.useRef(null);
	React.useEffect(() => {
		if (inLoadRef.current || loading || (menuItems && menuItems.length > 0)) return;
		inLoadRef.current = (() => {
			dispatch(fetchMenuItems());
			return true;
		})();
	}, [dispatch, loading, menuItems]);

	React.useEffect(() => {
		if (inLoadCatsRef.current || (categories && categories.length > 0)) return;
		inLoadCatsRef.current = (() => {
			dispatch(fetchCategories());
			return true;
		})();
	}, [dispatch, categories]);
	const handleDelete = React.useCallback(
		(item) => {
			dispatch(deleteMenuItem(item.id));
		},
		[dispatch],
	);
	const dialogRef = React.useRef(null);
	const table = React.useMemo(
		() => (
			<Table
				selection={false}
				title={t("menuItems.title")}
				columns={columns}
				data={menuItems}
				loading={loading}
				idField="id"
				onEdit={(item) => dialogRef.current.open(item)}
				onDelete={handleDelete}
			/>
		),
		[t, columns, menuItems, loading, handleDelete],
	);
	return (
		<PageContainer>
			<Stack direction="row" sx={{ mb: 3, justifyContent: "flex-end" }}>
				<Button loading={loading} variant="contained" onClick={() => dialogRef.current.open()}>
					{t("menuItems.addNew")}
				</Button>
			</Stack>

			<MenuItemsDialog ref={dialogRef} />

			{table}
		</PageContainer>
	);
};

export default MenuItemsPage;
