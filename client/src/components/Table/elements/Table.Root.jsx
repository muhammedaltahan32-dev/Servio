import React from "react";
import { TableContainer, Table, Box, CircularProgress } from "@mui/material";
import { useTableRefs, useTableState } from "../context";
import { TableHeader } from "./TableHeader.jsx";
import { TableBody } from "./TableBody.jsx";
import { TableFooter } from "./TableFooter.jsx";

export const TableRoot = ({ selection }) => {
	const { tableContainerRef } = useTableRefs();
	const { isLoading } = useTableState();

	return (
		<>
			<TableContainer
				ref={tableContainerRef}
				sx={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					position: "relative", // Enables absolute positioning for overlay
					pointerEvents: isLoading ? "none" : "all",
				}}
			>
				{/* Loading Overlay */}
				{isLoading && (
					<Box
						sx={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "rgba(255, 255, 255, 0.6)",
							zIndex: (theme) => theme.zIndex.modal - 1,
						}}
					>
						<CircularProgress />
					</Box>
				)}

				<Table sx={{ flex: 0 }}>
					<TableHeader selection={selection} />
					<TableBody selection={selection} />
				</Table>
			</TableContainer>
			<TableFooter />
		</>
	);
};
