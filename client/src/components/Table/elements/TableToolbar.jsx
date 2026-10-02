import React from "react";
import { Input } from "../../index.js";
import { Stack, Box, Typography, Tooltip, TextField, InputAdornment, alpha, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { useTableTitle, useTableSelection, useTableSearch, useTableBatchAction } from "../context";
import { useLang } from "@hooks";

const TableToolbarComponent = ({ selection }) => {
	const { title } = useTableTitle();
	const { selected } = useTableSelection();
	const { searchTerm, setSearchTerm } = useTableSearch();
	const { onBatchDelete } = useTableBatchAction();
	const { t } = useLang();
	return (
		<Stack
			direction={{ xs: "column", sm: "row" }}
			spacing={2}
			sx={{
				p: (theme) => theme.tokens.space.pageSm,
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
						{selected.length} - {t("components.table.selectedRows")}
					</Typography>
				)}
			</Box>

			<Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
				{selected.length > 0 && selection ? (
					<Tooltip title={t("components.table.tooltips.deleteSelected")}>
						<IconButton
							color="error"
							onClick={() => onBatchDelete?.(selected)}
							sx={{ bgcolor: (theme) => alpha(theme.palette.error.main, 0.1) }}
						>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				) : (
					<Input
						placeholder={t("components.table.search")}
						size="small"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						prefix={<SearchIcon fontSize="small" />}
						sx={(theme) => ({ minWidth: 240, "& .MuiOutlinedInput-root": { borderRadius: `${theme.tokens.radius.control}px` } })}
					/>
				)}
			</Stack>
		</Stack>
	);
};

export const TableToolbar = React.memo(TableToolbarComponent);
