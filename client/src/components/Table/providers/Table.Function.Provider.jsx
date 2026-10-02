import React, { useMemo, useCallback } from "react";
import {
	TableFilteredDataContext,
	TablePageDataContext,
	TableHeaderActionsContext,
	TableRowActionsContext,
	TableBatchActionContext,
	useTableData,
	useTableColumns,
	useTableSearch,
	useTableSort,
	useTableSelectionActions,
	useTablePagination,
} from "../context";

const TableFunctionProviderComponent = ({ children, onEdit, onDelete, onBatchDelete }) => {
	const { data, idField } = useTableData();
	const { columns } = useTableColumns();
	const { searchTerm } = useTableSearch();
	const { orderBy, order, setOrderBy, setOrder } = useTableSort();
	const { setSelected } = useTableSelectionActions();
	const { page, rowsPerPage } = useTablePagination();

	const handleRequestSort = useCallback((property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	}, [orderBy, order, setOrder, setOrderBy]);

	const filteredData = useMemo(() => {
		let result = [...data];

		if (searchTerm) {
			const normalizedSearch = searchTerm.toLowerCase();
			result = result.filter((row) =>
				columns.some((column) => {
					const value = row[column.field];
					return value != null && String(value).toLowerCase().includes(normalizedSearch);
				}),
			);
		}

		if (orderBy) {
			result.sort((a, b) => {
				const valueA = a[orderBy] ?? "";
				const valueB = b[orderBy] ?? "";
				if (valueB < valueA) return order === "asc" ? 1 : -1;
				if (valueB > valueA) return order === "asc" ? -1 : 1;
				return 0;
			});
		}

		return result;
	}, [data, searchTerm, orderBy, order, columns]);

	const paginatedData = useMemo(
		() => filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
		[filteredData, page, rowsPerPage],
	);

	const handleSelectAllClick = useCallback((event) => {
		setSelected(event.target.checked ? paginatedData.map((row) => row[idField]) : []);
	}, [paginatedData, idField, setSelected]);

	const handleSelectRow = useCallback((id) => {
		setSelected((previous) =>
			previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id],
		);
	}, [setSelected]);

	const filteredDataValue = useMemo(() => ({ filteredData }), [filteredData]);
	const pageDataValue = useMemo(() => ({ paginatedData }), [paginatedData]);
	const headerActionsValue = useMemo(
		() => ({ handleRequestSort, handleSelectAllClick }),
		[handleRequestSort, handleSelectAllClick],
	);
	const rowActionsValue = useMemo(
		() => ({ handleSelectRow, onEdit, onDelete }),
		[handleSelectRow, onEdit, onDelete],
	);
	const batchActionValue = useMemo(() => ({ onBatchDelete }), [onBatchDelete]);

	return (
		<TableFilteredDataContext.Provider value={filteredDataValue}>
			<TablePageDataContext.Provider value={pageDataValue}>
			<TableHeaderActionsContext.Provider value={headerActionsValue}>
				<TableRowActionsContext.Provider value={rowActionsValue}>
					<TableBatchActionContext.Provider value={batchActionValue}>
						{children}
					</TableBatchActionContext.Provider>
				</TableRowActionsContext.Provider>
			</TableHeaderActionsContext.Provider>
			</TablePageDataContext.Provider>
		</TableFilteredDataContext.Provider>
	);
};

export const TableFunctionProvider = React.memo(TableFunctionProviderComponent);
