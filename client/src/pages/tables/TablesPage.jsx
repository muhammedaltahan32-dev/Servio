import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Chip, Container, Stack } from "@mui/material";
import { Button, Dialog, Input, Table, Select, PageContainer } from "@components";
import { MenuItem } from "@mui/material";
import { useLang } from "@hooks";
import { fetchTables, addTable, updateTable, deleteTable } from "../../features/tables/TablesSlice.js";
import { Table_Number, Table_Capacity, Table_Status } from "../../../../constants/FieldsName.js";
import { ST_AVAILABLE, ST_OCCUPIED, ST_NEEDS_CLEANING, TABLE_STATUS } from "../../../../constants/enumOptions.js";
import { useSnackbar } from "notistack";

const initialFormState = {
	[Table_Number]: "",
	[Table_Capacity]: 4,
	[Table_Status]: ST_AVAILABLE,
};

export const TablesPage = () => {
	const dispatch = useDispatch();
	const { t } = useLang();
	const { enqueueSnackbar } = useSnackbar();
	const { items: tables, loading } = useSelector((state) => state.tables || { items: [], loading: false });

	const [open, setOpen] = useState(false);
	const [selectedTable, setSelectedTable] = useState(null);
	const [formData, setFormData] = useState(initialFormState);

	const columns = React.useMemo(
		() => [
			{ field: Table_Number, headerName: t("tables.number") },
			{ field: Table_Capacity, headerName: t("tables.capacity") },
			{
				field: Table_Status,
				headerName: t("tables.status"),
				render: (_, instance) => {
					return (
						<Chip
							label={t(`lobby.${instance[Table_Status]}`)}
							sx={(theme) => ({
								bgcolor: `color-mix(in srgb ,${theme.palette.tableStatus[instance[Table_Status]]} 20%,transparent )`,
								color: `tableStatus.${instance[Table_Status]}`,
							})}
							size="small"
						/>
					);
				},
			},
		],
		[t],
	);
	const inLoadRef = React.useRef(null);

	React.useEffect(() => {
		if (inLoadRef.current || loading || (tables && tables.length > 0)) return;
		inLoadRef.current = (() => {
			dispatch(fetchTables());
			return true;
		})();
	}, [dispatch, loading, tables]);

	const handleOpen = (table = null) => {
		if (table) {
			setSelectedTable(table);
			setFormData({
				[Table_Number]: table[Table_Number] ?? "",
				[Table_Capacity]: table[Table_Capacity] ?? 4,
				[Table_Status]: table[Table_Status] || ST_AVAILABLE,
			});
		} else {
			setSelectedTable(null);
			setFormData(initialFormState);
		}
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setSelectedTable(null);
		setFormData(initialFormState);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === Table_Capacity || name === Table_Number ? Number(value) : value,
		}));
	};

	const handleSave = async () => {
		if (selectedTable) {
			await dispatch(updateTable({ ...formData, id: selectedTable.id }));
		} else {
			await dispatch(addTable(formData));
		}
		handleClose();
	};

	const handleDelete = (table) => {
		dispatch(deleteTable(table.id));
	};

	return (
		<PageContainer>
			<Stack direction="row" sx={{ mb: 3, justifyContent: "flex-end" }}>
				<Button loading={loading} variant="contained" onClick={() => handleOpen()}>
					{t("tables.addNew")}
				</Button>
			</Stack>

			<Dialog
				open={open}
				onClose={handleClose}
				title={selectedTable ? t("tables.editTitle") : t("tables.addTitle")}
				subtitle={t("tables.dialogSubtitle")}
				disabled={loading}
				actions={
					<>
						<Button disabled={loading} color="none" variant="text" onClick={handleClose}>
							{t("tables.cancel")}
						</Button>
						<Button loading={loading} variant="text" onClick={handleSave}>
							{t("tables.save")}
						</Button>
					</>
				}
			>
				<Stack spacing={2} sx={{ pt: "10px" }}>
					<Input
						label={t("tables.number")}
						name={Table_Number}
						type="number"
						fullWidth
						value={formData[Table_Number]}
						onChange={handleChange}
						required
					/>
					<Input
						label={t("tables.capacity")}
						name={Table_Capacity}
						type="number"
						fullWidth
						value={formData[Table_Capacity]}
						onChange={handleChange}
					/>
					<Select
						label={t("tables.status")}
						name={Table_Status}
						fullWidth
						value={formData[Table_Status]}
						onChange={handleChange}
					>
						{TABLE_STATUS?.map((st) => (
							<MenuItem key={st} value={st}>
								{t(`lobby.${st}`)}
							</MenuItem>
						))}
					</Select>
				</Stack>
			</Dialog>

			<Table
				selection={false}
				title={t("tables.title")}
				columns={columns}
				data={tables}
				loading={loading}
				idField="id"
				onEdit={(table) => handleOpen(table)}
				onDelete={handleDelete}
			/>
		</PageContainer>
	);
};

export default TablesPage;
