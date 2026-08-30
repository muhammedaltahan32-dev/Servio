import React, { useState } from "react";
import { TableBody as MuiTableBody, TableRow, TableCell, Checkbox, Typography, Stack } from "@mui/material";
import { IconButton, Menu, Icon } from "../../index.js";
import { useTableState, useTableFunctions } from "../context";
import { useLang } from "@hooks";

export const TableBody = ({ selection }) => {
	const { columns, idField, selected } = useTableState();
	const { paginatedData, handleSelectRow, onEdit, onDelete } = useTableFunctions();
	const { t } = useLang();
	const [activeRow, setActiveRow] = useState(null);

	const handleOpenMenu = (row) => {
		setActiveRow(row);
	};

	if (paginatedData.length === 0) {
		return (
			<MuiTableBody sx={{ flex: 1 }}>
				<TableRow>
					<TableCell colSpan={columns.length + 2} align="center" sx={{ py: 5 }}>
						<Typography variant="body2" color="text.secondary">
							{t("components.table.noData")}
						</Typography>
					</TableCell>
				</TableRow>
			</MuiTableBody>
		);
	}

	return (
		<MuiTableBody>
			{paginatedData.map((row) => {
				const isSelected = selected.includes(row[idField]);

				return (
					<TableRow key={row[idField]} hover selected={isSelected}>
						{selection && <TableCell padding="checkbox">
							<Checkbox color="primary" checked={isSelected} onChange={() => handleSelectRow(row[idField])} />
						</TableCell>}

						{columns.map((col) => (
							<TableCell key={col.field}>
								{col.render ? col.render(row[col.field], row) : (row[col.field] ?? "-")}
							</TableCell>
						))}

						<TableCell align="right">
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
