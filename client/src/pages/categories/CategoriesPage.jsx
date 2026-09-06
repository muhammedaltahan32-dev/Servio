import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Stack } from "@mui/material";
import { Button, Table, PageContainer } from "@components";
import { useLang } from "@hooks";
import {
	fetchCategories,
	addCategory,
	updateCategory,
	deleteCategory,
} from "../../features/categories/CategoriesSlice.js";
import { Cat_Name_AR, Cat_Name_EN, Cat_Sort } from "../../../../constants/FieldsName.js";
import CategoriesDialog from "./CategoriesDialog.jsx";
const initialFormState = {
	[Cat_Name_AR]: "",
	[Cat_Name_EN]: "",
	[Cat_Sort]: 0,
};

export const CategoriesPage = () => {
	const dispatch = useDispatch();
	const { t } = useLang();
	const { items: categories, loading } = useSelector((state) => state.categories);

	const columns = React.useMemo(
		() => [
			{ field: Cat_Name_AR, headerName: t("categories.nameAr") },
			{ field: Cat_Name_EN, headerName: t("categories.nameEn") },
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

	const handleDelete = React.useCallback(
		(category) => {
			dispatch(deleteCategory(category.id));
		},
		[dispatch],
	);
	const dialogRef = React.useRef(null);
	const table = React.useMemo(
		() => (
			<Table
				selection={false}
				title={t("categories.title")}
				columns={columns}
				data={categories}
				loading={loading}
				idField="id"
				onEdit={(category) => dialogRef.current.open(category)}
				onDelete={handleDelete}
			/>
		),
		[handleDelete, categories, columns, t, loading],
	);
	return (
		<PageContainer>
			<Stack direction="row" sx={{ mb: 3, justifyContent: "flex-end" }}>
				<Button loading={loading} variant="contained" onClick={() => dialogRef.current.open()}>
					{t("categories.addNew")}
				</Button>
			</Stack>

			<CategoriesDialog ref={dialogRef} />

			{table}
		</PageContainer>
	);
};

export default CategoriesPage;
