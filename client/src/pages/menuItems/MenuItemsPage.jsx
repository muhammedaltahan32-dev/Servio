import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Stack } from "@mui/material";
import { Button, Dialog, Input, Table, Select, PhotoAlbumGallery } from "@components";
import { MenuItem } from "@mui/material";
import { useLang } from "@hooks";
import {
	fetchMenuItems,
	addMenuItem,
	updateMenuItem,
	deleteMenuItem,
} from "../../features/menuItems/MenuItemsSlice.js";
import { fetchCategories } from "../../features/categories/CategoriesSlice.js";
import {
	Menu_ID,
	Menu_CatID,
	Menu_Name,
	Menu_Price,
	Menu_IsAvailable,
	Menu_BaseImage,
	Menu_Images,
	Menu_Descriptions,
} from "../../../../constants/FieldsName.js";
import { useSnackbar } from "notistack";
import ApiService, { normalizeImageUrl } from "../../services/ApiService.js";
import { Api_Upload } from "../../../../constants/SubApi.js";

const initialFormState = {
	[Menu_CatID]: null,
	[Menu_Name]: "",
	[Menu_Price]: 0,
	[Menu_IsAvailable]: true,
	[Menu_BaseImage]: null,
	[Menu_Images]: [],
};

export const MenuItemsPage = () => {
	const dispatch = useDispatch();
	const { t } = useLang();
	const { enqueueSnackbar } = useSnackbar();
	const { items: menuItems, loading } = useSelector((state) => state.menuItems || { items: [], loading: false });
	const { items: categories } = useSelector((state) => state.categories || { items: [] });
	const [open, setOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);
	const [formData, setFormData] = useState(initialFormState);

	const columns = React.useMemo(
		() => [
			{
				field: Menu_BaseImage,
				headerName: t("menuItems.baseImage"),
				render: (value, row) => {
					const imageUrl = normalizeImageUrl(value || row[Menu_Images]?.[0]);
					if (!imageUrl) return "-";
					return (
						<img
							src={imageUrl}
							alt="menu item"
							style={{
								width: 52,
								height: 52,
								objectFit: "cover",
								borderRadius: 8,
								display: "block",
							}}
						/>
					);
				},
			},
			{ field: Menu_Name, headerName: t("menuItems.name") },
			{ field: Menu_Price, headerName: t("menuItems.price") },
			{ field: Menu_CatID, headerName: t("menuItems.category") },
			{ field: Menu_IsAvailable, headerName: t("menuItems.available") },
			{ field: Menu_Descriptions, headerName: t("menuItems.descriptions") },
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

	const handleOpen = (item = null) => {
		console.log("item", item);
		if (item) {
			setSelectedItem(item);
			setFormData({
				[Menu_CatID]: item[Menu_CatID] ?? null,
				[Menu_Name]: item[Menu_Name] ?? "",
				[Menu_Price]: item[Menu_Price] ?? 0,
				[Menu_IsAvailable]: !!item[Menu_IsAvailable],
				[Menu_Descriptions]: item[Menu_Descriptions] ?? "",
				[Menu_BaseImage]: normalizeImageUrl(item[Menu_BaseImage] || item[Menu_Images]?.[0] || null),
				[Menu_Images]: Array.isArray(item[Menu_Images]) ? item[Menu_Images].map((img) => normalizeImageUrl(img)) : [],
			});
		} else {
			setSelectedItem(null);
			setFormData(initialFormState);
		}
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setSelectedItem(null);
		setFormData(initialFormState);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === Menu_Price ? Number(value) : value,
		}));
	};

	const handleSave = async () => {
		const payload = { ...formData };
		// ensure boolean
		payload[Menu_IsAvailable] = !!payload[Menu_IsAvailable];
		if (selectedItem) {
			await dispatch(updateMenuItem({ ...payload, id: selectedItem.id }));
		} else {
			await dispatch(addMenuItem(payload));
		}
		handleClose();
	};

	const handleDelete = (item) => {
		dispatch(deleteMenuItem(item.id));
	};

	return (
		<Container maxWidth="xl" sx={{ py: 5 }}>
			<Stack direction="row" justifyContent="flex-end" sx={{ mb: 3 }}>
				<Button loading={loading} variant="contained" onClick={() => handleOpen()}>
					{t("menuItems.addNew")}
				</Button>
			</Stack>

			<Dialog
				open={open}
				onClose={handleClose}
				title={selectedItem ? t("menuItems.editTitle") : t("menuItems.addTitle")}
				subtitle={t("menuItems.dialogSubtitle")}
				disabled={loading}
				actions={
					<>
						<Button disabled={loading} color="none" variant="text" onClick={handleClose}>
							{t("menuItems.cancel")}
						</Button>
						<Button loading={loading} variant="text" onClick={handleSave}>
							{t("menuItems.save")}
						</Button>
					</>
				}
			>
				<Stack spacing={2} sx={{ pt: "10px" }}>
					<PhotoAlbumGallery
						images={Array.isArray(formData[Menu_Images]) ? formData[Menu_Images] : []}
						baseImage={formData[Menu_BaseImage] || null}
						loading={loading}
						onUpload={async (files) => {
							if (files.length === 0) return;
							const form = new FormData();
							files.forEach((file) => form.append("images", file));

							try {
								const res = await ApiService.post(Api_Upload, form, {
									headers: { "Content-Type": "multipart/form-data" },
								});

								if (res && res.success && Array.isArray(res.files)) {
									const urls = res.files.map((file) => normalizeImageUrl(file.url));
									setFormData((prev) => {
										const currentImages = Array.isArray(prev[Menu_Images]) ? prev[Menu_Images] : [];
										const mergedImages = [...currentImages, ...urls];
										const nextBaseImage = prev[Menu_BaseImage] || urls[0] || null;

										return {
											...prev,
											[Menu_BaseImage]: nextBaseImage,
											[Menu_Images]: mergedImages,
										};
									});
									enqueueSnackbar(t("upload.success.completed"), { variant: "success" });
								} else {
									enqueueSnackbar(t("upload.error.failed"), { variant: "error" });
								}
							} catch (err) {
								enqueueSnackbar(t("upload.error.failed"), { variant: "error" });
							}
						}}
						onBaseImageChange={(url) => {
							setFormData((prev) => ({ ...prev, [Menu_BaseImage]: normalizeImageUrl(url) }));
						}}
					/>
					<Select
						label={t("menuItems.category")}
						name={Menu_CatID}
						fullWidth
						value={formData[Menu_CatID] || ""}
						onChange={handleChange}
					>
						<MenuItem value="">{t("menuItems.selectCategory")}</MenuItem>
						{categories.map((c) => (
							<MenuItem key={c.id} value={c.id}>
								{c.name}
							</MenuItem>
						))}
					</Select>
					<Input
						label={t("menuItems.name")}
						name={Menu_Name}
						fullWidth
						value={formData[Menu_Name]}
						onChange={handleChange}
						required
					/>
					<Input
						label={t("menuItems.price")}
						name={Menu_Price}
						type="number"
						fullWidth
						value={formData[Menu_Price]}
						onChange={handleChange}
					/>
					<Input
						label={t("menuItems.descriptions")}
						name={Menu_Descriptions}
						fullWidth
						value={formData[Menu_Descriptions]}
						onChange={handleChange}
					/>
					<Select
						label={t("menuItems.available")}
						name={Menu_IsAvailable}
						fullWidth
						value={String(formData[Menu_IsAvailable])}
						onChange={(e) => setFormData((p) => ({ ...p, [Menu_IsAvailable]: e.target.value === "true" }))}
					>
						<MenuItem value={"true"}>{t("menuItems.availableTrue")}</MenuItem>
						<MenuItem value={"false"}>{t("menuItems.availableFalse")}</MenuItem>
					</Select>
				</Stack>
			</Dialog>

			<Table
				selection={false}
				title={t("menuItems.title")}
				columns={columns}
				data={menuItems}
				loading={loading}
				idField="id"
				onEdit={(item) => handleOpen(item)}
				onDelete={handleDelete}
			/>
		</Container>
	);
};

export default MenuItemsPage;
