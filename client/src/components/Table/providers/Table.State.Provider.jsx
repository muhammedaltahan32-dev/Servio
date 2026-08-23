import React, { useState, useMemo } from "react";
import { TableStateContext } from "../context";

export const TableStateProvider = ({ children, data = [], columns = [], idField = "id", title = "Table" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
    }),
    [data, columns, idField, title, searchTerm, orderBy, order, selected, page, rowsPerPage]
  );

  return <TableStateContext.Provider value={value}>{children}</TableStateContext.Provider>;
};