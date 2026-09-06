import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Stack } from "@mui/material";
import { Button, Dialog, Input, Table, PageContainer } from "@components";
import { useLang } from "@hooks";
import {
	fetchCategories,
	addCategory,
	updateCategory,
	deleteCategory,
} from "../../features/categories/CategoriesSlice.js";
import { Cat_Name_AR, Cat_Name_EN, Cat_Sort } from "../../../../constants/FieldsName.js";
const initialFormState = {
	[Cat_Name_AR]: "",
	[Cat_Name_EN]: "",
	[Cat_Sort]: 0,
};
export const CategoriesDialog = React.memo(
	React.forwardRef((props, ref) => {
		const dispatch = useDispatch();
		const { t } = useLang();
		const { items: categories, loading } = useSelector((state) => state.categories);

		const [open, setOpen] = useState(false);
		const [selectedCategory, setSelectedCategory] = useState(null);
		const [formData, setFormData] = useState(initialFormState);
		const handleOpen = React.useCallback((category = null) => {
			if (category) {
				setSelectedCategory(category);
				setFormData({
					[Cat_Name_AR]: category[Cat_Name_AR] || "",
					[Cat_Name_EN]: category[Cat_Name_EN] || "",
					[Cat_Sort]: category[Cat_Sort] ?? 0,
				});
			} else {
				setSelectedCategory(null);
				setFormData(initialFormState);
			}
			setOpen(true);
		}, []);

		const handleClose = React.useCallback(() => {
			setOpen(false);
			setSelectedCategory(null);
			setFormData(initialFormState);
		}, []);

		const handleChange = React.useCallback((e) => {
			const { name, value } = e.target;
			setFormData((prev) => ({
				...prev,
				[name]: name === Cat_Sort ? Number(value) : value,
			}));
		}, []);

		const handleSave = async () => {
			if (selectedCategory) {
				await dispatch(updateCategory({ ...formData, id: selectedCategory.id }));
			} else {
				await dispatch(addCategory(formData));
			}
			handleClose();
		};

		const api = React.useMemo(
			() => ({
				open: handleOpen,
				close: handleClose,
			}),
			[handleOpen, handleClose],
		);
		React.useImperativeHandle(ref, () => api);
		return (
			<Dialog
				open={open}
				onClose={handleClose}
				title={selectedCategory ? t("categories.editTitle") : t("categories.addTitle")}
				subtitle={t("categories.dialogSubtitle")}
				disabled={loading}
				actions={
					<>
						<Button disabled={loading} color="none" variant="text" onClick={handleClose}>
							{t("categories.cancel")}
						</Button>
						<Button loading={loading} variant="text" onClick={handleSave}>
							{t("categories.save")}
						</Button>
					</>
				}
			>
				<Stack spacing={2} sx={{ pt: "10px" }}>
					<Input
						label={t("categories.nameAr")}
						name={Cat_Name_AR}
						fullWidth
						value={formData[Cat_Name_AR]}
						onChange={handleChange}
						required
					/>
					<Input
						label={t("categories.nameEn")}
						name={Cat_Name_EN}
						fullWidth
						value={formData[Cat_Name_EN]}
						onChange={handleChange}
						required
					/>
					<Input
						label={t("categories.sortOrder")}
						name={Cat_Sort}
						type="number"
						fullWidth
						value={formData[Cat_Sort]}
						onChange={handleChange}
					/>
				</Stack>
			</Dialog>
		);
	}),
);
CategoriesDialog.displayName = "CategoriesDialog";
export default CategoriesDialog;
