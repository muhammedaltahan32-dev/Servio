import React from "react";
import { Card } from "@mui/material";
import { TableStateProvider } from "./providers/Table.State.Provider";
import { TableFunctionProvider } from "./providers/Table.Function.Provider";
import { TableRefProvider } from "./providers/Table.Ref.Provider";
import { TableToolbar } from "./elements/TableToolbar";
import { TableRoot } from "./elements/Table.Root";
const EMPTY_ARRAY = [];
export const Table = ({
	columns = EMPTY_ARRAY,
	data = EMPTY_ARRAY,
	idField = "id",
	title = "Table Title",
	onEdit,
	onDelete,
	onBatchDelete,
}) => {
	return (
		<TableStateProvider columns={columns} data={data} idField={idField} title={title}>
			<TableFunctionProvider onEdit={onEdit} onDelete={onDelete} onBatchDelete={onBatchDelete}>
				<TableRefProvider>
					<Card
						elevation={0}
						sx={{
							border: "1px solid",
							borderColor: "divider",
							bgcolor: "background.paper",
							overflow: "hidden",
						}}
					>
						<TableToolbar />
						<TableRoot />
					</Card>
				</TableRefProvider>
			</TableFunctionProvider>
		</TableStateProvider>
	);
};

export default Table;
