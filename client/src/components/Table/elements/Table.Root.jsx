import React from "react";
import { TableContainer, Table, Box, CircularProgress, useTheme } from "@mui/material";
import { useTableRefs, useTableLoading, useTableColumns, useTableSizing } from "../context";
import { TableHeader } from "./TableHeader.jsx";
import { TableBody } from "./TableBody.jsx";
import { TableFooter } from "./TableFooter.jsx";
import { getColumnWidth } from "../utils/tableSizing.js";

const TableRootComponent = ({ selection }) => {
	const { tableContainerRef } = useTableRefs();
	const { isLoading } = useTableLoading();
	const { columns } = useTableColumns();
	const { columnWidths } = useTableSizing();
	const theme = useTheme();

	return (
		<>
			<TableContainer
				ref={tableContainerRef}
				sx={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					position: "relative",
					minWidth: 0,
					overflow: "auto",
					pointerEvents: isLoading ? "none" : "all",
				}}
			>
				{/* Loading Overlay */}
				{isLoading && (
					<Box
						sx={{
							position: "absolute",
							top: 0,
						insetInlineStart: 0,
							right: 0,
							bottom: 0,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "color-mix(in srgb, var(--mui-palette-background-paper) 82%, transparent)",
							zIndex: (theme) => theme.zIndex.modal - 1,
						}}
					>
						<CircularProgress />
					</Box>
				)}

				<Table
					stickyHeader
					sx={{
						flex: 0,
						width: "100%",
						minWidth: theme.tokens.size.tableMinWidth,
						tableLayout: "fixed",
					}}
				>
					<colgroup>
						{selection && <col style={{ width: theme.tokens.size.tableSelectionColumnWidth }} />}
						{columns.map((column) => (
							<col key={column.field} style={{ width: getColumnWidth(column, columnWidths, theme.tokens) }} />
						))}
						<col />
						<col style={{ width: theme.tokens.size.operationsColumnWidth }} />
					</colgroup>
					<TableHeader selection={selection} />
					<TableBody selection={selection} />
				</Table>
			</TableContainer>
			<TableFooter />
		</>
	);
};

export const TableRoot = React.memo(TableRootComponent);
