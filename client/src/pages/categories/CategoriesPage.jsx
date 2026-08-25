import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Stack } from "@mui/material";
import { Button, Dialog, Input, Table } from "@components";
import { useLang } from "@hooks";
import {
	fetchCategories,
	addCategory,
	updateCategory,
	deleteCategory,
} from "../../features/categories/CategoriesSlice.js";
import { Cat_Name, Cat_Sort } from "../../../../constants/FieldsName.js";
import { useSnackbar } from "notistack";
const initialFormState = {
	[Cat_Name]: "",
	[Cat_Sort]: 0,
};

export const CategoriesPage = () => {
	const dispatch = useDispatch();
	const { t } = useLang();
	const { enqueueSnackbar } = useSnackbar();
	const { items: categories, loading } = useSelector((state) => state.categories);

	const [open, setOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [formData, setFormData] = useState(initialFormState);

	const columns = React.useMemo(
		() => [
			{ field: Cat_Name, headerName: t("categories.name") },
			{ field: Cat_Sort, headerName: t("categories.sortOrder") },
		],
		[t],
	);
	const inLoadRef = React.useRef(null);

	React.useEffect(() => {
		if (inLoadRef.current || loading || categories.length > 0) return;
		inLoadRef.current = (() => {
			dispatch(fetchCategories());
			return true;
		})();
	}, [dispatch, loading, categories]);

	const handleOpen = (category = null) => {
		if (category) {
			setSelectedCategory(category);
			setFormData({
				[Cat_Name]: category[Cat_Name] || "",
				[Cat_Sort]: category[Cat_Sort] ?? 0,
			});
		} else {
			setSelectedCategory(null);
			setFormData(initialFormState);
		}
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setSelectedCategory(null);
		setFormData(initialFormState);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === Cat_Sort ? Number(value) : value,
		}));
	};

	const handleSave = async () => {
		if (selectedCategory) {
			await dispatch(updateCategory({ ...formData, id: selectedCategory.id }));
		} else {
			await dispatch(addCategory(formData));
		}
		handleClose();
	};

	const handleDelete = (category) => {
		dispatch(deleteCategory(category.id));
	};

	return (
		<Container maxWidth="xl" sx={{ py: 5 }}>
			<Stack direction="row" justifyContent="flex-end" sx={{ mb: 3 }}>
				<Button loading={loading} variant="contained" onClick={() => handleOpen()}>
					{t("categories.addNew")}
				</Button>
			</Stack>

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
						label={t("categories.name")}
						name={Cat_Name}
						fullWidth
						value={formData[Cat_Name]}
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

			<Table
				selection={false}
				title={t("categories.title")}
				columns={columns}
				data={categories}
				loading={loading}
				idField="id"
				onEdit={(category) => handleOpen(category)}
				onDelete={handleDelete}
			/>
		</Container>
	);
};

export default CategoriesPage;
