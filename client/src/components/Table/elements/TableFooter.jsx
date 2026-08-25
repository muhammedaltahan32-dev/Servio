import React from "react";
import { TablePagination } from "@mui/material";
import { useTableState, useTableFunctions } from "../context";
import { useLang } from "@hooks";

export const TableFooter = () => {
	const { page, rowsPerPage, setPage, setRowsPerPage } = useTableState();
	const { filteredData } = useTableFunctions();
	const { t } = useLang();
	const handleChangePage = (_, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<TablePagination
			labelRowsPerPage={t("components.table.pagination")}
			rowsPerPageOptions={[5, 10, 25]}
			component="div"
			count={filteredData.length}
			rowsPerPage={rowsPerPage}
			page={page}
			onPageChange={handleChangePage}
			onRowsPerPageChange={handleChangeRowsPerPage}
		/>
	);
};
