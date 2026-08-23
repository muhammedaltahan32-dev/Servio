import React from "react";
import { TableHead, TableRow, TableCell, Checkbox, TableSortLabel } from "@mui/material";
import { useTableState, useTableFunctions } from "../context";

export const TableHeader = () => {
  const { columns, selected, orderBy, order } = useTableState();
  const { paginatedData, handleRequestSort, handleSelectAllClick } = useTableFunctions();

  const isAllSelected = paginatedData.length > 0 && selected.length === paginatedData.length;
  const isIndeterminate = selected.length > 0 && !isAllSelected;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={isIndeterminate}
            checked={isAllSelected}
            onChange={handleSelectAllClick}
          />
        </TableCell>

        {columns.map((col) => (
          <TableCell key={col.field} sx={{ fontWeight: 700, color: "text.secondary" }}>
            {col.sortable !== false ? (
              <TableSortLabel
                active={orderBy === col.field}
                direction={orderBy === col.field ? order : "asc"}
                onClick={() => handleRequestSort(col.field)}
              >
                {col.headerName}
              </TableSortLabel>
            ) : (
              col.headerName
            )}
          </TableCell>
        ))}

        <TableCell align="right" sx={{ fontWeight: 700, color: "text.secondary" }}>
          Actions
        </TableCell>
      </TableRow>
    </TableHead>
  );
};