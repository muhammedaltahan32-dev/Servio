import { Box, Container, Chip, Avatar, Stack, Typography } from "@mui/material";
import { Button, Dialog, Input, Table } from "@components";

import React from "react";

const columns = [
	{
		field: "name",
		headerName: "User",
		render: (value, row) => (
			<Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
				<Avatar src={row.avatar} alt={value} sx={{ width: 32, height: 32 }} />
				<Box>
					<Typography variant="body2" fontWeight={600}>
						{value}
					</Typography>
					<Typography variant="caption" color="text.secondary">
						{row.email}
					</Typography>
				</Box>
			</Stack>
		),
	},
	{
		field: "role",
		headerName: "Role",
	},
	{
		field: "status",
		headerName: "Status",
		render: (value) => {
			const isCompleted = value === "Active";
			const isPending = value === "Pending";
			return (
				<Chip
					label={value}
					size="small"
					color={isCompleted ? "success" : isPending ? "warning" : "error"}
					variant="soft"
					sx={{ fontWeight: 600 }}
				/>
			);
		},
	},
	{
		field: "amount",
		headerName: "Spent",
		render: (value) => `$${value.toLocaleString()}`,
	},
	{
		field: "createdAt",
		headerName: "Joined Date",
	},
];

const data = [
	{
		id: "usr_101",
		name: "Ahmad Al-Mansoor",
		email: "ahmad.m@example.com",
		avatar: "https://i.pravatar.cc/150?img=11",
		role: "Senior Developer",
		status: "Active",
		amount: 1420,
		createdAt: "2024-01-15",
	},
	{
		id: "usr_102",
		name: "Sarah Jenkins",
		email: "s.jenkins@example.com",
		avatar: "https://i.pravatar.cc/150?img=5",
		role: "Product Manager",
		status: "Active",
		amount: 3850,
		createdAt: "2024-02-01",
	},
	{
		id: "usr_103",
		name: "Tariq Mahmoud",
		email: "tariq.tech@example.com",
		avatar: "https://i.pravatar.cc/150?img=13",
		role: "UI/UX Designer",
		status: "Pending",
		amount: 920,
		createdAt: "2024-03-10",
	},
	{
		id: "usr_104",
		name: "Elena Rostova",
		email: "elena.r@example.com",
		avatar: "https://i.pravatar.cc/150?img=9",
		role: "QA Lead",
		status: "Inactive",
		amount: 450,
		createdAt: "2023-11-20",
	},
	{
		id: "usr_105",
		name: "Khaled Benali",
		email: "khaled.b@example.com",
		avatar: "https://i.pravatar.cc/150?img=12",
		role: "DevOps Engineer",
		status: "Active",
		amount: 2750,
		createdAt: "2024-04-05",
	},
	{
		id: "usr_106",
		name: "Maria Garcia",
		email: "m.garcia@example.com",
		avatar: "https://i.pravatar.cc/150?img=20",
		role: "Backend Engineer",
		status: "Pending",
		amount: 1100,
		createdAt: "2024-05-18",
	},
];

export function Test() {
	const [open, setOpen] = React.useState(false);
	return (
		<Container maxWidth="xl" sx={{ py: 5 }}>
			<>
				<Button variant="contained" onClick={() => setOpen(true)}>
					Open Modal
				</Button>

				<Dialog
					open={open}
					onClose={() => setOpen(false)}
					title="Update Profile"
					subtitle="Modify your public display information below."
					actions={
						<>
							<Button color="none" variant="text" onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button variant="text" onClick={() => setOpen(false)}>
								Save Changes
							</Button>
						</>
					}
				>
					<Stack spacing={2} sx={{pt:"10px"}}>
						<Input label="Username" fullWidth defaultValue="Ahmad" />
						<Input label="Email" fullWidth defaultValue="ahmad@example.com" />
					</Stack>
				</Dialog>
			</>
			<Table
				title="System Users"
				columns={columns}
				data={data}
				idField="id"
				onEdit={(user) => console.log("Edit:", user)}
				onDelete={(user) => console.log("Delete:", user)}
				onBatchDelete={(ids) => console.log("Delete Batch IDs:", ids)}
			/>
		</Container>
	);
}
