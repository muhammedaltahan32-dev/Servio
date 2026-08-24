import React from "react";
import { IconButton, Input, Icon } from "../../index.js";
import { Stack, Box, Typography, Tooltip, TextField, InputAdornment, alpha } from "@mui/material";
import { Search as SearchIcon, DeleteTwoTone as DeleteIcon } from "@mui/icons-material";
import { useTableState, useTableFunctions } from "../context";

export const TableToolbar = () => {
	const { title, selected, searchTerm, setSearchTerm } = useTableState();
	const { onBatchDelete } = useTableFunctions();

	return (
		<Stack
			direction={{ xs: "column", sm: "row" }}
			spacing={2}
			sx={{
				p: 2.5,
				borderBottom: "1px solid",
				borderColor: "divider",
				justifyContent: "space-between",
				alignItems: { xs: "stretch", sm: "center" },
			}}
		>
			<Box>
				<Typography variant="h6" fontWeight={700}>
					{title}
				</Typography>
				{selected.length > 0 && (
					<Typography variant="caption" color="primary" fontWeight={600}>
						{selected.length} row(s) selected
					</Typography>
				)}
			</Box>

			<Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
				{selected.length > 0 ? (
					<Tooltip title="Delete Selected">
						<IconButton
							color="error"
							onClick={() => onBatchDelete?.(selected)}
							sx={{ bgcolor: (theme) => alpha(theme.palette.error.main, 0.1) }}
							name="Delete"
						/>
					</Tooltip>
				) : (
					<Input
						placeholder="Search..."
						size="small"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						prefix={<Icon name="Search" fontSize="small" />}
						sx={{ minWidth: 240, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
					/>
				)}
			</Stack>
		</Stack>
	);
};
