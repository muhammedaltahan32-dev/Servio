import React from "react";
import { TableContainer, Table } from "@mui/material";
import { useTableRefs } from "../context";
import { TableHeader } from "./TableHeader.jsx";
import { TableBody } from "./TableBody.jsx";
import { TableFooter } from "./TableFooter.jsx";

export const TableRoot = () => {
	const { tableContainerRef } = useTableRefs();

	return (
		<>
			<TableContainer ref={tableContainerRef} sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
				<Table sx={{ flex: 0 }}>
					<TableHeader />
					<TableBody />
				</Table>
			</TableContainer>
			<TableFooter />
		</>
	);
};
