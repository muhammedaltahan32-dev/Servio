import React from "react";
import { TablePagination } from "@mui/material";
import { useTablePagination, useTableFilteredData } from "../context";
import { useLang } from "@hooks";

const TableFooterComponent = () => {
	const { page, rowsPerPage, setPage, setRowsPerPage } = useTablePagination();
	const { filteredData } = useTableFilteredData();
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

export const TableFooter = React.memo(TableFooterComponent);
