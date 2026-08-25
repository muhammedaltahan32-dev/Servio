import React, { useState, useMemo } from "react";
import { TableStateContext } from "../context";

export const TableStateProvider = ({ children, data = [], columns = [], idField = "id", title = "Table", loading }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [orderBy, setOrderBy] = useState("");
	const [order, setOrder] = useState("asc");
	const [selected, setSelected] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [internalLoading, setLoading] = useState(loading);
	const isLoading = React.useMemo(
		() => (loading === undefined ? internalLoading : Boolean(loading)),
		[loading, internalLoading],
	);

	const value = useMemo(
		() => ({
			data,
			columns,
			idField,
			title,
			searchTerm,
			setSearchTerm,
			orderBy,
			setOrderBy,
			order,
			setOrder,
			selected,
			setSelected,
			page,
			setPage,
			rowsPerPage,
			setRowsPerPage,
			isLoading,
			setLoading,
		}),
		[data, columns, idField, title, searchTerm, orderBy, order, selected, page, rowsPerPage, isLoading, setLoading],
	);

	return <TableStateContext.Provider value={value}>{children}</TableStateContext.Provider>;
};
