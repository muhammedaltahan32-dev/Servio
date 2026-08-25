import React from "react";
import { Card } from "@mui/material";
import { TableStateProvider } from "./providers/Table.State.Provider";
import { TableFunctionProvider } from "./providers/Table.Function.Provider";
import { TableRefProvider } from "./providers/Table.Ref.Provider";
import { TableToolbar } from "./elements/TableToolbar";
import { TableRoot } from "./elements/Table.Root";
const EMPTY_ARRAY = [];
const EMPTY_Object = {};
export const Table = ({
	columns = EMPTY_ARRAY,
	data = EMPTY_ARRAY,
	idField = "id",
	title = "Table Title",
	onEdit,
	onDelete,
	onBatchDelete,
	sx = EMPTY_Object,
	loading = false,
	selection = true,
	...props
}) => {
	return (
		<TableStateProvider loading={loading} columns={columns} data={data} idField={idField} title={title}>
			<TableFunctionProvider onEdit={onEdit} onDelete={onDelete} onBatchDelete={onBatchDelete}>
				<TableRefProvider>
					<Card
						elevation={0}
						{...props}
						sx={{
							border: "1px solid",
							borderColor: "divider",
							bgcolor: "background.paper",
							overflow: "hidden",
							display: "flex",
							flexDirection: "column",
							...sx,
						}}
					>
						<TableToolbar selection={selection} />
						<TableRoot selection={selection} />
					</Card>
				</TableRefProvider>
			</TableFunctionProvider>
		</TableStateProvider>
	);
};

export default Table;
