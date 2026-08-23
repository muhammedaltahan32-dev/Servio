import React from "react";
import { CrudPage } from "../../components/CrudPage/CrudPage.jsx";
import { TextField } from "@mui/material";
import { Api_Category } from "../../../../constants/SubApi.js";
export const CategoriesPage = () => {
	return (
		<CrudPage
			subApi={Api_Category}
			pageTitle="إدارة الأصناف"
			allowEdit={true}
			allowDelete={true}
			fields={[
				{ name: "name", label: "اسم التصنيف", type: "text", required: true },
				{ name: "sort_order", label: "ترتيب العرض", type: "number", defaultValue: 0 },
			]}
			columns={[
				{ key: "name", label: "اسم التصنيف", render: (value) => value || "-" },
				{ key: "sort_order", label: "ترتيب العرض", render: (value) => Number(value ?? 0) },
			]}
			renderFormFields={({ form, handleChange }) => (
				<>
					<TextField
						label="اسم التصنيف"
						name="name"
						value={form.name || ""}
						onChange={handleChange}
						fullWidth
						required
					/>
					<TextField
						label="ترتيب العرض"
						name="sort_order"
						type="number"
						value={form.sort_order ?? 0}
						onChange={handleChange}
						fullWidth
					/>
				</>
			)}
		/>
	);
};

export default CategoriesPage;
