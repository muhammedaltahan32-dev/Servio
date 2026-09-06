import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Chip, Stack } from "@mui/material";
import { Button, Table, PageContainer } from "@components";
import { useLang } from "@hooks";
import { fetchTables, deleteTable } from "../../features/tables/TablesSlice.js";
import { Table_Number, Table_Capacity, Table_Status } from "../../../../constants/FieldsName.js";
import TablesDialog from "./TablesDialog.jsx";

export const TablesPage = () => {
	const dispatch = useDispatch();
	const { t } = useLang();
	const { items: tables, loading } = useSelector((state) => state.tables || { items: [], loading: false });

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

	const handleDelete = React.useCallback(
		(table) => {
			dispatch(deleteTable(table.id));
		},
		[dispatch],
	);
	const dialogRef = React.useRef(null);
	const table = React.useMemo(
		() => (
			<Table
				selection={false}
				title={t("tables.title")}
				columns={columns}
				data={tables}
				loading={loading}
				idField="id"
				onEdit={(table) => dialogRef.current.open(table)}
				onDelete={handleDelete}
			/>
		),
		[t, loading, handleDelete, tables, columns],
	);
	return (
		<PageContainer>
			<Stack direction="row" sx={{ mb: 3, justifyContent: "flex-end" }}>
				<Button loading={loading} variant="contained" onClick={() => dialogRef.current.open()}>
					{t("tables.addNew")}
				</Button>
			</Stack>

			<TablesDialog ref={dialogRef} />
			{table}
		</PageContainer>
	);
};

export default TablesPage;
