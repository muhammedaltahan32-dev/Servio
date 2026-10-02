import React from "react";
import { Box, TableHead, TableRow, TableCell, Checkbox, TableSortLabel, useTheme } from "@mui/material";
import { useTableColumns, useTableSizing, useTableSelection, useTableSort, useTablePageData, useTableHeaderActions } from "../context";
import { useLang } from "@hooks";
import { getColumnBounds, getColumnWidth } from "../utils/tableSizing.js";

const TableHeaderComponent = ({ selection }) => {
	const { columns } = useTableColumns();
	const { columnWidths, setColumnWidths } = useTableSizing();
	const { selected } = useTableSelection();
	const { orderBy, order } = useTableSort();
	const { paginatedData } = useTablePageData();
	const { handleRequestSort, handleSelectAllClick } = useTableHeaderActions();
	const { t } = useLang();
	const theme = useTheme();
	const resizeRef = React.useRef(null);
	const isAllSelected = paginatedData.length > 0 && selected.length === paginatedData.length;
	const isIndeterminate = selected.length > 0 && !isAllSelected;
	const widthFor = (column) => getColumnWidth(column, columnWidths, theme.tokens);
	const boundsFor = (column) => getColumnBounds(column, theme.tokens);
	const startResize = (event, column) => {
		event.preventDefault();
		event.stopPropagation();
		resizeRef.current = { field: column.field, startX: event.clientX, startWidth: widthFor(column) };
		event.currentTarget.setPointerCapture(event.pointerId);
	};
	const moveResize = (event, column) => {
		const resize = resizeRef.current;
		if (!resize || resize.field !== column.field) return;
		const { min, max } = boundsFor(column);
		const delta = theme.direction === "rtl" ? resize.startX - event.clientX : event.clientX - resize.startX;
		const width = Math.max(min, Math.min(max, resize.startWidth + delta));
		setColumnWidths((current) => ({ ...current, [column.field]: width }));
	};
	const stopResize = (event) => {
		resizeRef.current = null;
		if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
	};
	const resizeByKeyboard = (event, column) => {
		if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
		event.preventDefault();
		const direction = event.key === "ArrowRight" ? 1 : -1;
		const delta = theme.direction === "rtl" ? -direction : direction;
		const { min, max } = boundsFor(column);
		const width = Math.max(min, Math.min(max, widthFor(column) + delta * 12));
		setColumnWidths((current) => ({ ...current, [column.field]: width }));
	};

	return (
		<TableHead
			sx={{
				position: "sticky",
				top: 0,
				zIndex: 3,
				bgcolor: "background.paper",
				"& .MuiTableCell-root": { borderBottom: 0 },
			}}
		>
			<TableRow>
				{selection && (
					<TableCell padding="checkbox" sx={(theme) => ({ width: theme.tokens.size.tableSelectionColumnWidth, minWidth: theme.tokens.size.tableSelectionColumnWidth, maxWidth: theme.tokens.size.tableSelectionColumnWidth, height: theme.tokens.size.tableHeaderHeight })}>
						<Checkbox
							color="primary"
							indeterminate={isIndeterminate}
							checked={isAllSelected}
							onChange={handleSelectAllClick}
						/>
					</TableCell>
				)}

				{columns.map((col) => (
					<TableCell
						key={col.field}
						sx={(theme) => ({
							position: "relative",
							height: theme.tokens.size.tableHeaderHeight,
							width: widthFor(col),
							minWidth: widthFor(col),
							maxWidth: widthFor(col),
							fontWeight: 700,
							color: "text.secondary",
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
							"& .MuiTableSortLabel-root": { maxWidth: "100%", overflow: "hidden" },
							"& .MuiTableSortLabel-label": { overflow: "hidden", textOverflow: "ellipsis" },
						})}
					>
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
						<Box
							component="span"
							role="separator"
							aria-orientation="vertical"
							aria-label={`Resize ${col.headerName} column`}
							aria-valuemin={boundsFor(col).min}
							aria-valuemax={boundsFor(col).max}
							aria-valuenow={widthFor(col)}
							tabIndex={0}
							onPointerDown={(event) => startResize(event, col)}
							onPointerMove={(event) => moveResize(event, col)}
							onPointerUp={stopResize}
							onPointerCancel={stopResize}
							onKeyDown={(event) => resizeByKeyboard(event, col)}
							sx={{
								position: "absolute",
								insetBlock: 0,
							insetInlineEnd: 0,
								zIndex: 2,
								width: 9,
								cursor: "col-resize",
								touchAction: "none",
								userSelect: "none",
								"&::after": {
									content: '""',
									position: "absolute",
									insetBlock: "25%",
									insetInlineStart: 3,
									width: 2,
									borderRadius: 2,
									bgcolor: "divider",
									opacity: 0.75,
								},
								"&:hover::after, &:focus-visible::after": { bgcolor: "primary.main", opacity: 1 },
								"&:focus-visible": { outline: "none" },
							}}
						/>
					</TableCell>
				))}
				<TableCell aria-hidden sx={{ width: "auto", minWidth: 0, maxWidth: "none", p: 0, border: 0 }} />

				<TableCell
					align="right"
					sx={(theme) => ({
						position: "sticky",
						insetInlineEnd: 0,
						top: 0,
						zIndex: 4,
						width: theme.tokens.size.operationsColumnWidth,
						minWidth: theme.tokens.size.operationsColumnWidth,
						height: theme.tokens.size.tableHeaderHeight,
						whiteSpace: "nowrap",
						fontWeight: 700,
						color: "text.secondary",
						bgcolor: "background.paper",
						borderInlineStart: "1px solid",
						borderColor: "divider",
					})}
				>
					{t("components.table.actions")}
				</TableCell>
			</TableRow>
		</TableHead>
	);
};

export const TableHeader = React.memo(TableHeaderComponent);
