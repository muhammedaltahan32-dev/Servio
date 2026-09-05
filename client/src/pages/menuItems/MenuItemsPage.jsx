import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Container, Grid, Stack } from "@mui/material";
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
import ApiService from "../../services/ApiService.js";
import { Api_Upload } from "../../../../constants/SubApi.js";
import { getPathName } from "@utils";
import { normalizeImage } from "./utils/helpers.js";

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
					const imageUrl = value || row[Menu_Images]?.[0] || null;
					if (!imageUrl) return "---";
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
	const resolvedImages = React.useMemo(
		() => (Array.isArray(formData[Menu_Images]) ? formData[Menu_Images].map((image) => normalizeImage(image)) : []),
		[formData],
	);
	const resolvedBaseImage = React.useMemo(() => normalizeImage(formData[Menu_BaseImage]), [formData]);
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
		if (item) {
			setSelectedItem(item);
			setFormData({
				[Menu_CatID]: item[Menu_CatID] ?? null,
				[Menu_Name]: item[Menu_Name] ?? "",
				[Menu_Price]: item[Menu_Price] ?? 0,
				[Menu_IsAvailable]: !!item[Menu_IsAvailable],
				[Menu_Descriptions]: item[Menu_Descriptions] ?? "",

				[Menu_BaseImage]: item[Menu_Images]?.[0] || null,
				[Menu_Images]: item[Menu_Images] || [],
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
		const data = { ...payload, [Menu_BaseImage]: resolvedBaseImage };

		const newImages = formData[Menu_Images].filter((f) => typeof f === "object" && f);
		const oldImages = formData[Menu_Images].filter((f) => typeof f === "string");
		const images = [];
		if (newImages?.length > 0) {
			const result = await dispatch(uploadImage(newImages));
			if (result) {
				result.payload.files.forEach(({ url, filename }) => {
					images.push(url);
					if (filename === resolvedBaseImage) data[Menu_BaseImage] = url;
				});
			}
		}
		if (oldImages?.length > 0) {
			oldImages.forEach((path) => {
				try {
					const pathName = getPathName(path);
					images.push(pathName);
				} catch (er) {
					images.push(path);
				}
			});
		}
		try {
			data[Menu_BaseImage] = getPathName(resolvedBaseImage);
		} catch (err) {
			data[Menu_BaseImage] = resolvedBaseImage;
		}
		data[Menu_Images] = images;
		if (selectedItem) {
			await dispatch(updateMenuItem({ ...data, id: selectedItem.id }));
		} else {
			await dispatch(addMenuItem(data));
		}
		handleClose();
	};

	const handleDelete = React.useCallback(
		(item) => {
			dispatch(deleteMenuItem(item.id));
		},
		[dispatch],
	);
	const handleDeleteAnImage = React.useCallback(
		(imageKey) => {
			let images = Array.isArray(formData[Menu_Images]) ? [...formData[Menu_Images]] : [];
			const result = [];
			let shouldChangeBase = false;
			let index = 0;
			for (const img of images) {
				const baseImage = formData[Menu_BaseImage]?.name || formData[Menu_BaseImage];
				const targetImage = img?.name || img;
				if (targetImage === imageKey) {
					if (imageKey === baseImage) shouldChangeBase = true;
					continue;
				}
				result.push(img);
				index++;
			}
			const newBaseIndex = Math.max(Math.min(result.length - 1, index), 0);
			setFormData((prev) => ({
				...prev,
				[Menu_Images]: result,
				[Menu_BaseImage]: shouldChangeBase ? result[newBaseIndex] || null : prev[Menu_BaseImage],
			}));
		},
		[formData],
	);
	const handleUploadImages = React.useCallback(
		(files) => {
			if (files.length === 0) return;
			setFormData((prev) => {
				const prevImages = [...resolvedImages];
				const set = new Map();
				prevImages.push(...files.map(({ file }) => file));
				prevImages.forEach((p) => set.set(normalizeImage(p), p));
				return { ...prev, [Menu_Images]: [...set.values()] };
			});
		},
		[resolvedImages],
	);
	const handleChangeBaseImage = React.useCallback((imageName) => {
		setFormData((prev) => ({ ...prev, [Menu_BaseImage]: imageName }));
	}, []);
	const table = React.useMemo(
		() => (
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
		),
		[t, columns, menuItems, loading, handleDelete],
	);
	return (
		<PageContainer>
			<Stack direction="row" sx={{ mb: 3, justifyContent: "flex-end" }}>
				<Button loading={loading} variant="contained" onClick={() => handleOpen()}>
					{t("menuItems.addNew")}
				</Button>
			</Stack>

			<Dialog
				maxWidth="md"
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
				<Grid container spacing={2} sx={{ pt: 1 }}>
					<Grid size={12}>
						<PhotoAlbumGallery
							images={resolvedImages}
							baseImage={resolvedBaseImage}
							loading={loading}
							onDeleteImage={handleDeleteAnImage}
							onUpload={handleUploadImages}
							onBaseImageChange={handleChangeBaseImage}
						/>
					</Grid>

					<Grid size={12}>
						<Grid container spacing={2}>
							<Grid size={12}>
								<Input
									label={t("menuItems.name")}
									name={Menu_Name}
									fullWidth
									value={formData[Menu_Name]}
									onChange={handleChange}
									required
								/>
							</Grid>

							<Grid size={{ xs: 12, sm: 6 }}>
								<Select
									label={t("menuItems.category")}
									name={Menu_CatID}
									fullWidth
									value={formData[Menu_CatID] || ""}
									onChange={handleChange}
								>
									{categories.map((c) => (
										<MenuItem key={c.id} value={c.id}>
											{c.name}
										</MenuItem>
									))}
								</Select>
							</Grid>

							<Grid size={{ xs: 12, sm: 6 }}>
								<Input
									label={t("menuItems.price")}
									name={Menu_Price}
									type="number"
									fullWidth
									value={formData[Menu_Price]}
									onChange={handleChange}
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid size={12}>
						<Input
							label={t("menuItems.descriptions")}
							name={Menu_Descriptions}
							fullWidth
							multiline
							rows={3}
							value={formData[Menu_Descriptions]}
							onChange={handleChange}
						/>
					</Grid>

					<Grid size={{ xs: 12, sm: 6 }}>
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
					</Grid>
				</Grid>
			</Dialog>

			{table}
		</PageContainer>
	);
};

export default MenuItemsPage;
