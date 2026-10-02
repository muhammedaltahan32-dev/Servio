import React from "react";
import { Box, TableBody as MuiTableBody, TableRow, TableCell, Checkbox, Typography, Stack, useTheme, IconButton } from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import MoreVert from "@mui/icons-material/MoreVert";
import { Menu } from "../../Menu/Menu.jsx";
import { useTableData, useTableColumns, useTableSizing, useTableSelection, useTablePageData, useTableRowActions } from "../context";
import { useLang } from "@hooks";
import { getColumnWidth } from "../utils/tableSizing.js";

const TableDataRow = React.memo(({ row, columns, idField, selected, columnWidths, onSelect, onEdit, onDelete, selection, modifyLabel, deleteLabel }) => {
	const theme = useTheme();
	return (
		<TableRow
			 hover
			 selected={selected}
			 sx={(theme) => ({ height: theme.tokens.size.tableRowHeight, maxHeight: theme.tokens.size.tableRowHeight })}
		>
			{selection && (
				<TableCell padding="checkbox" sx={(theme) => ({ width: theme.tokens.size.tableSelectionColumnWidth, minWidth: theme.tokens.size.tableSelectionColumnWidth, maxWidth: theme.tokens.size.tableSelectionColumnWidth, height: theme.tokens.size.tableRowHeight, overflow: "hidden" })}>
					<Checkbox color="primary" checked={selected} onChange={() => onSelect(row[idField])} />
				</TableCell>
			)}

			{columns.map((column) => {
				const value = column.render ? column.render(row[column.field], row) : (row[column.field] ?? "-");
				const plainText = typeof value === "string" || typeof value === "number" ? String(value) : undefined;
				const width = getColumnWidth(column, columnWidths, theme.tokens);
				return (
					<TableCell
						key={column.field}
						sx={(theme) => ({
							width,
							minWidth: width,
							maxWidth: width,
							height: theme.tokens.size.tableRowHeight,
							maxHeight: theme.tokens.size.tableRowHeight,
							overflow: "hidden",
						})}
					>
						<Box
							title={plainText}
							sx={(theme) => ({
								width: "100%",
								minWidth: 0,
								maxHeight: `${theme.tokens.size.tableCellContentMaxHeight}px`,
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
								"& > *": { maxWidth: "100%", minWidth: 0 },
								"& .MuiTypography-root": { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
							})}
						>
							{value}
						</Box>
					</TableCell>
				);
			})}

			<TableCell aria-hidden sx={{ width: "auto", minWidth: 0, maxWidth: "none", p: 0, border: 0 }} />
			<TableCell
				align="right"
				sx={(theme) => ({
					position: "sticky",
					insetInlineEnd: 0,
					zIndex: 1,
					width: theme.tokens.size.operationsColumnWidth,
					minWidth: theme.tokens.size.operationsColumnWidth,
					maxWidth: theme.tokens.size.operationsColumnWidth,
					height: theme.tokens.size.tableRowHeight,
					maxHeight: theme.tokens.size.tableRowHeight,
					overflow: "hidden",
					bgcolor: "background.paper",
					borderInlineStart: "1px solid",
					borderColor: "divider",
					"tr:hover &": { bgcolor: "action.hover" },
					"tr.Mui-selected &": { bgcolor: "action.selected" },
					"tr.Mui-selected:hover &": { bgcolor: "action.selected" },
				})}
			>
				<Menu>
					<Menu.Trigger>
						<IconButton size="small"><MoreVert fontSize="small" /></IconButton>
					</Menu.Trigger>
					<Menu.Content>
						<Menu.Item onClick={() => onEdit?.(row)}>
							<Stack spacing={1} direction="row" sx={{ alignItems: "center" }}>
								<Edit fontSize="small" sx={{ color: "primary.main" }} />
								<Typography>{modifyLabel}</Typography>
							</Stack>
						</Menu.Item>
						<Menu.Item onClick={() => onDelete?.(row)}>
							<Stack spacing={1} direction="row" sx={{ alignItems: "center" }}>
								<Delete fontSize="small" sx={{ color: "error.main" }} />
								<Typography>{deleteLabel}</Typography>
							</Stack>
						</Menu.Item>
					</Menu.Content>
				</Menu>
			</TableCell>
		</TableRow>
	);
});
TableDataRow.displayName = "TableDataRow";

const TableBodyComponent = ({ selection }) => {
	const { idField } = useTableData();
	const { columns } = useTableColumns();
	const { columnWidths } = useTableSizing();
	const { selected } = useTableSelection();
	const { paginatedData } = useTablePageData();
	const { handleSelectRow, onEdit, onDelete } = useTableRowActions();
	const { t } = useLang();
	const selectedIds = React.useMemo(() => new Set(selected), [selected]);

	if (paginatedData.length === 0) {
		return (
			<MuiTableBody sx={{ flex: 1, "& .MuiTableCell-root": { borderBottom: 0 } }}>
				<TableRow>
					<TableCell colSpan={columns.length + (selection ? 3 : 2)} align="center" sx={{ py: 5 }}>
						<Typography variant="body2" color="text.secondary">{t("components.table.noData")}</Typography>
					</TableCell>
				</TableRow>
			</MuiTableBody>
		);
	}

	return (
		<MuiTableBody sx={{ "& .MuiTableCell-root": { borderBottom: 0 } }}>
			{paginatedData.map((row) => (
				<TableDataRow
					key={row[idField]}
					row={row}
					columns={columns}
					idField={idField}
					selected={selectedIds.has(row[idField])}
					columnWidths={columnWidths}
					onSelect={handleSelectRow}
					onEdit={onEdit}
					onDelete={onDelete}
					selection={selection}
					modifyLabel={t("actions.modify")}
					deleteLabel={t("actions.delete")}
				/>
			))}
		</MuiTableBody>
	);
};

export const TableBody = React.memo(TableBodyComponent);
