import React, { useState } from "react";
import { Box, TableBody as MuiTableBody, TableRow, TableCell, Checkbox, Typography, Stack, useTheme } from "@mui/material";
import { IconButton, Menu, Icon } from "../../index.js";
import { useTableState, useTableFunctions } from "../context";
import { useLang } from "@hooks";
import { getColumnWidth } from "../utils/tableSizing.js";

export const TableBody = ({ selection }) => {
	const { columns, idField, selected, columnWidths } = useTableState();
	const { paginatedData, handleSelectRow, onEdit, onDelete } = useTableFunctions();
	const { t } = useLang();
	const theme = useTheme();
	const [activeRow, setActiveRow] = useState(null);

	const handleOpenMenu = (row) => {
		setActiveRow(row);
	};

	if (paginatedData.length === 0) {
		return (
			<MuiTableBody sx={{ flex: 1, "& .MuiTableCell-root": { borderBottom: 0 } }}>
				<TableRow>
				<TableCell colSpan={columns.length + (selection ? 3 : 2)} align="center" sx={{ py: 5 }}>
						<Typography variant="body2" color="text.secondary">
							{t("components.table.noData")}
						</Typography>
					</TableCell>
				</TableRow>
			</MuiTableBody>
		);
	}

	return (
		<MuiTableBody sx={{ "& .MuiTableCell-root": { borderBottom: 0 } }}>
			{paginatedData.map((row) => {
				const isSelected = selected.includes(row[idField]);

				return (
					<TableRow key={row[idField]} hover selected={isSelected} sx={(theme) => ({ height: theme.tokens.size.tableRowHeight, maxHeight: theme.tokens.size.tableRowHeight })}>
						{selection && <TableCell padding="checkbox" sx={(theme) => ({ width: theme.tokens.size.tableSelectionColumnWidth, minWidth: theme.tokens.size.tableSelectionColumnWidth, maxWidth: theme.tokens.size.tableSelectionColumnWidth, height: theme.tokens.size.tableRowHeight, overflow: "hidden" })}>
							<Checkbox color="primary" checked={isSelected} onChange={() => handleSelectRow(row[idField])} />
						</TableCell>}

						{columns.map((col) => {
							const value = col.render ? col.render(row[col.field], row) : (row[col.field] ?? "-");
							const plainText = typeof value === "string" || typeof value === "number" ? String(value) : undefined;
							const width = getColumnWidth(col, columnWidths, theme.tokens);
							return (
							<TableCell
								key={col.field}
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
									<IconButton name="MoreVert" size="small" onClick={() => handleOpenMenu(row)} />
								</Menu.Trigger>
								<Menu.Content>
									<Menu.Item onClick={() => onEdit?.(activeRow)}>
										<Stack spacing={1} direction="row" sx={{ alignItems: "center" }}>
											<Icon name="Edit" fontSize="small" sx={{ color: "primary.main" }} color="#59f" />
											<Typography>{t("actions.modify")}</Typography>
										</Stack>
									</Menu.Item>

									<Menu.Item onClick={() => onDelete?.(activeRow)}>
										<Stack spacing={1} direction="row" sx={{ alignItems: "center" }}>
											<Icon name="Delete" fontSize="small" sx={{ color: "error.main" }} color="#f55" />
											<Typography>{t("actions.delete")}</Typography>
										</Stack>
									</Menu.Item>
								</Menu.Content>
							</Menu>
						</TableCell>
					</TableRow>
				);
			})}
		</MuiTableBody>
	);
};
