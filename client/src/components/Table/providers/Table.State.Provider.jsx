import React, { useMemo, useState } from "react";
import {
	TableDataContext,
	TableColumnsContext,
	TableTitleContext,
	TableLoadingContext,
	TableSearchContext,
	TableSortContext,
	TableSelectionContext,
	TableSelectionActionsContext,
	TableSizingContext,
	TablePaginationContext,
} from "../context";

export const TableStateProvider = ({ children, data = [], columns = [], idField = "id", title = "Table", loading = false }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [orderBy, setOrderBy] = useState("");
	const [order, setOrder] = useState("asc");
	const [selected, setSelected] = useState([]);
	const [columnWidths, setColumnWidths] = useState({});
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const dataValue = useMemo(() => ({ data, idField }), [data, idField]);
	const columnsValue = useMemo(() => ({ columns }), [columns]);
	const titleValue = useMemo(() => ({ title }), [title]);
	const loadingValue = useMemo(() => ({ isLoading: Boolean(loading) }), [loading]);
	const searchValue = useMemo(() => ({ searchTerm, setSearchTerm }), [searchTerm]);
	const sortValue = useMemo(() => ({ orderBy, order, setOrderBy, setOrder }), [orderBy, order]);
	const selectionValue = useMemo(() => ({ selected }), [selected]);
	const selectionActionsValue = useMemo(() => ({ setSelected }), [setSelected]);
	const sizingValue = useMemo(() => ({ columnWidths, setColumnWidths }), [columnWidths]);
	const paginationValue = useMemo(() => ({ page, setPage, rowsPerPage, setRowsPerPage }), [page, rowsPerPage]);

	return (
		<TableDataContext.Provider value={dataValue}>
			<TableColumnsContext.Provider value={columnsValue}>
				<TableTitleContext.Provider value={titleValue}>
					<TableLoadingContext.Provider value={loadingValue}>
						<TableSearchContext.Provider value={searchValue}>
							<TableSortContext.Provider value={sortValue}>
								<TableSelectionContext.Provider value={selectionValue}>
									<TableSelectionActionsContext.Provider value={selectionActionsValue}>
										<TableSizingContext.Provider value={sizingValue}>
											<TablePaginationContext.Provider value={paginationValue}>
												{children}
											</TablePaginationContext.Provider>
										</TableSizingContext.Provider>
									</TableSelectionActionsContext.Provider>
								</TableSelectionContext.Provider>
							</TableSortContext.Provider>
						</TableSearchContext.Provider>
					</TableLoadingContext.Provider>
				</TableTitleContext.Provider>
			</TableColumnsContext.Provider>
		</TableDataContext.Provider>
	);
};
