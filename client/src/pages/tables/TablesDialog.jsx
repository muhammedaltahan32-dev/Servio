import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Stack } from "@mui/material";
import { Button, Select, Dialog, Input, Table } from "@components";
import { MenuItem } from "@mui/material";
import { useLang } from "@hooks";
import { addTable, updateTable } from "../../features/tables/TablesSlice.js";
import { Table_Number, Table_Capacity, Table_Status } from "../../../../constants/FieldsName.js";
import { ST_AVAILABLE, ST_OCCUPIED, ST_NEEDS_CLEANING, TABLE_STATUS } from "../../../../constants/enumOptions.js";

const initialFormState = {
	[Table_Number]: "",
	[Table_Capacity]: 4,
	[Table_Status]: ST_AVAILABLE,
};

export const TablesDialog = React.memo(
	React.forwardRef((props, ref) => {
		const dispatch = useDispatch();
		const { t } = useLang();
		const { items: tables, loading } = useSelector((state) => state.tables || { items: [], loading: false });

		const [open, setOpen] = React.useState(false);
		const [selectedTable, setSelectedTable] = React.useState(null);
		const [formData, setFormData] = React.useState(initialFormState);
		const handleOpen = React.useCallback((table = null) => {
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
		}, []);

		const handleClose = React.useCallback(() => {
			setOpen(false);
			setSelectedTable(null);
			setFormData(initialFormState);
		}, []);

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
		const api = React.useMemo(
			() => ({
				open: handleOpen,
				close: handleClose,
			}),
			[handleOpen, handleClose],
		);
		React.useImperativeHandle(ref, () => api);
		return (
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
		);
	}),
);
TablesDialog.displayName = "TablesDialog";
export default TablesDialog;
