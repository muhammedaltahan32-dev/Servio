import React, { useMemo, useCallback } from "react";
import { TableFunctionContext, useTableState } from "../context";

export const TableFunctionProvider = ({ children, onEdit, onDelete, onBatchDelete }) => {
  const {
    data,
    columns,
    idField,
    searchTerm,
    orderBy,
    order,
    selected,
    setSelected,
    page,
    rowsPerPage,
    setOrderBy,
    setOrder,
  } = useTableState();

  const handleRequestSort = useCallback(
    (property) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    },
    [orderBy, order, setOrder, setOrderBy]
  );

  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchTerm) {
      result = result.filter((row) =>
        columns.some((col) => {
          const val = row[col.field];
          return val && String(val).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    if (orderBy) {
      result.sort((a, b) => {
        const valA = a[orderBy] ?? "";
        const valB = b[orderBy] ?? "";
        if (valB < valA) return order === "asc" ? 1 : -1;
        if (valB > valA) return order === "asc" ? -1 : 1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, orderBy, order, columns]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const handleSelectAllClick = useCallback(
    (event) => {
      if (event.target.checked) {
        setSelected(paginatedData.map((n) => n[idField]));
        return;
      }
      setSelected([]);
    },
    [paginatedData, idField, setSelected]
  );

  const handleSelectRow = useCallback(
    (id) => {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    },
    [setSelected]
  );

  const value = useMemo(
    () => ({
      filteredData,
      paginatedData,
      handleRequestSort,
      handleSelectAllClick,
      handleSelectRow,
      onEdit,
      onDelete,
      onBatchDelete,
    }),
    [
      filteredData,
      paginatedData,
      handleRequestSort,
      handleSelectAllClick,
      handleSelectRow,
      onEdit,
      onDelete,
      onBatchDelete,
    ]
  );

  return <TableFunctionContext.Provider value={value}>{children}</TableFunctionContext.Provider>;
};