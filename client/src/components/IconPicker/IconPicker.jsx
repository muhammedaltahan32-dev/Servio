import React, { useState, useMemo } from "react";
import { Icon, Input, Button, IconButton } from "../index.js";
import {
	Box,
	Typography,
	Grid,
	Card,
	Tooltip,
	Paper,
	Tabs,
	Tab,
	Stack,
	Pagination,
	Chip,
	Popover,
} from "@mui/material";

import { CATEGORIES, ICON_DATASET, VARIANTS } from "./constant.js";
import { useLang } from "@hooks";

export function IconPicker({
	value = "",
	onChange,
	iconSize = 24,
	color = "primary",
	placeholder = "components.iconPicker.placeholder",
	disabled = false,
	fullWidth = false,
}) {
	const [anchorEl, setAnchorEl] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [page, setPage] = useState(1);
	const ITEMS_PER_PAGE = 75;
	const { t } = useLang();
	const selectedIconObj = useMemo(() => {
		return ICON_DATASET.find((item) => item.name === value) || ICON_DATASET[0];
	}, [value]);

	const SelectedIconComponent = selectedIconObj.name;

	const handleOpen = (event) => {
		if (disabled) return;
		setAnchorEl(event.currentTarget);
		setDialogOpen(true);
	};

	const handleClose = () => {
		setAnchorEl(null);
		setDialogOpen(false);
	};

	const handleSelectIcon = (event,icon) => {
		if (onChange) {
			onChange(event,{ name: icon.name, category: icon.category });
		}
		handleClose();
	};

	const filteredIcons = useMemo(() => {
		return ICON_DATASET.filter((icon) => {
			const matchesCategory = selectedCategory === "All" || icon.category === selectedCategory;
			const q = searchQuery.toLowerCase().trim();
			const matchesSearch =
				!q ||
				icon.name.toLowerCase().includes(q) ||
				icon.tags.some((t) => t.toLowerCase().includes(q)) ||
				icon.category.toLowerCase().includes(q);

			return matchesCategory && matchesSearch;
		});
	}, [searchQuery, selectedCategory]);

	const totalPages = Math.ceil(filteredIcons.length / ITEMS_PER_PAGE);
	const paginatedIcons = useMemo(() => {
		const start = (page - 1) * ITEMS_PER_PAGE;
		return filteredIcons.slice(start, start + ITEMS_PER_PAGE);
	}, [filteredIcons, page]);

	const isOpen = Boolean(anchorEl) || dialogOpen;

	const renderPickerBody = () => (
		<Box sx={{ width: 480, maxWidth: "100%", p: 2, pt: 1.5 }}>
			{/* Search Input */}
			<Input
				fullWidth
				size="small"
				placeholder={t("components.iconPicker.searchPlaceholder")}
				value={searchQuery}
				variant="standard"
				onChange={(e) => {
					setSearchQuery(e.target.value);
					setPage(1);
				}}
				prefix={<Icon name="Search" size={16} />}
				suffix={(searchQuery && <IconButton name="Close" size={14} onClick={() => setSearchQuery("")} />) || null}
				sx={{ mb: 1.5 }}
			/>

			{/* Category Tabs */}
			<Tabs
				value={selectedCategory}
				onChange={(e, val) => {
					setSelectedCategory(val);
					setPage(1);
				}}
				variant="scrollable"
				scrollButtons="auto"
				sx={{
					mb: 2,
					minHeight: 36,
					"& .MuiTab-root": { minHeight: 36, py: 0.5, px: 1.5, fontSize: "0.8rem" },
				}}
			>
				{Object.keys(CATEGORIES).map((cat) => (
					<Tab key={cat} label={t(CATEGORIES[cat].label)} value={CATEGORIES[cat].value} />
				))}
			</Tabs>

			{/* Style / Variant Switcher (Optional) */}
			{/* {onVariantChange && (
				<Stack direction="row" spacing={1} sx={{ mb: 2, overflowX: "auto", pb: 0.5 }}>
					<Typography variant="caption" sx={{ alignSelf: "center", mr: 1, fontWeight: 600, color: "text.secondary" }}>
						Variant:
					</Typography>
					{VARIANTS.map((v) => (
						<Chip
							key={v}
							label={v}
							size="small"
							clickable
							color={variant === v ? "primary" : "default"}
							variant={variant === v ? "filled" : "outlined"}
							onClick={() => onVariantChange(v)}
							sx={{ fontSize: "0.75rem" }}
						/>
					))}
				</Stack>
			)} */}

			{/* Grid of Icons */}
			{filteredIcons.length === 0 ? (
				<Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
					<Typography variant="body2">{t("components.iconPicker.noIcons")}</Typography>
				</Box>
			) : (
				<Grid container spacing={1} sx={{ maxHeight: 260, overflowY: "auto", pr: 0.5 }}>
					{paginatedIcons.map((icon) => {
						const isSelected = value === icon.name;

						return (
							<Grid item xs={3} sm={2} key={icon.name}>
								<Tooltip title={icon.name} arrow placement="top">
									<Paper
										elevation={isSelected ? 2 : 0}
										onClick={(event) => handleSelectIcon(event,icon)}
										sx={{
											p: 1,
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											justifyContent: "center",
											cursor: "pointer",
											border: "1px solid",
											borderColor: isSelected ? "primary.main" : "divider",
											bgcolor: isSelected ? "action.selected" : "background.paper",
											"&:hover": {
												borderColor: "primary.main",
												bgcolor: "action.hover",
											},
										}}
									>
										<Box sx={{ color: isSelected ? "primary.main" : "text.primary", display: "flex" }}>
											<Icon name={icon.name} size={20} />
										</Box>
									</Paper>
								</Tooltip>
							</Grid>
						);
					})}
				</Grid>
			)}

			{/* Pagination Footer */}
			{totalPages > 1 && (
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						pt: 1.5,
						mt: 1,
						borderTop: "1px solid",
						borderColor: "divider",
					}}
				>
					<Pagination size="small" count={totalPages} page={page} onChange={(e, val) => setPage(val)} color="primary" />
				</Box>
			)}
		</Box>
	);

	return (
		<Box sx={{ display: "inline-block", width: fullWidth ? "100%" : "auto" }}>
			{/* Trigger Button Field */}
			<Button
				variant="outlined"
				onClick={handleOpen}
				disabled={disabled}
				fullWidth={fullWidth}
				prefix={
					<Box sx={{ display: "flex", alignItems: "center", color: color !== "custom" ? `${color}.main` : "inherit" }}>
						<Icon name={SelectedIconComponent} size={iconSize} />
					</Box>
				}
				endIcon={<icon name="ChevronDown" size={16} />}
				sx={{
					justifyContent: "space-between",
					textTransform: "none",
					px: 2,
					py: 1,
					borderRadius: 2,
				}}
			>
				<Typography variant="body2" sx={{ fontWeight: 600, mx: 1 }}>
					{value ? `${value}Icon` : t(placeholder)}
				</Typography>
			</Button>
			<Popover
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{ vertical: "center", horizontal: "center" }}
				transformOrigin={{ vertical: "center", horizontal: "center" }}
				sx={{ "& .MuiPaper-root": { boxShadow: "0 0px 2px rgba(0,0,0,0.2)" } }}
			>
				{renderPickerBody()}
			</Popover>
			{/* <Dialog open={dialogOpen} onClose={handleClose} title="Select Icon">
				{renderPickerBody()}
			</Dialog> */}
		</Box>
	);
}

