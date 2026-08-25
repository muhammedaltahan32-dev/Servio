import React from "react";
import { TableHead, TableRow, TableCell, Checkbox, TableSortLabel } from "@mui/material";
import { useTableState, useTableFunctions } from "../context";
import { useLang } from "@hooks";

export const TableHeader = ({ selection }) => {
	const { columns, selected, orderBy, order } = useTableState();
	const { paginatedData, handleRequestSort, handleSelectAllClick } = useTableFunctions();
	const { t } = useLang();
	const isAllSelected = paginatedData.length > 0 && selected.length === paginatedData.length;
	const isIndeterminate = selected.length > 0 && !isAllSelected;

	return (
		<TableHead sx={{ position: "sticky", top: "0", insetInline: "0", bgcolor: "background.paper", zIndex: "10" }}>
			<TableRow>
				{selection && (
					<TableCell padding="checkbox">
						<Checkbox
							color="primary"
							indeterminate={isIndeterminate}
							checked={isAllSelected}
							onChange={handleSelectAllClick}
						/>
					</TableCell>
				)}

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
					{t("components.table.actions")}
				</TableCell>
			</TableRow>
		</TableHead>
	);
};
