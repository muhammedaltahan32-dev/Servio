import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Stack } from "@mui/material";
import { Button, PageContainer, Table } from "@components";
import { useLang } from "@hooks";
import { deleteUser, fetchUsers } from "../../features/users/UsersSlice.js";
import { User_Kind, User_Name } from "../../../../constants/FieldsName.js";
import { KINDS_VALUES } from "../../../../constants/enumOptions.js";
import UserDialog from "./UserDialog.jsx";

export const UsersPage = () => {
	const dispatch = useDispatch();
	const { t } = useLang();
	const { items: users, loading } = useSelector((state) => state.users || { items: [], loading: false });
	console.log("users", users);
	const dialogRef = React.useRef(null);
	const columns = React.useMemo(
		() => [
			{ field: User_Name, headerName: t("users.username") },
			{
				field: User_Kind,
				headerName: t("users.kind"),
				render: (value) => {
					const kind = Object.keys(KINDS_VALUES).find((key) => KINDS_VALUES[key] === value) ?? value;
					return t(`users.roles.${kind}`);
				},
			},
		],
		[t],
	);
	const inLoadRef = React.useRef(null);
	React.useEffect(() => {
		if (inLoadRef.current || loading || users.length > 0) return;
		inLoadRef.current = true;
		dispatch(fetchUsers());
	}, [dispatch, loading, users]);
	const handleDelete = React.useCallback((user) => dispatch(deleteUser(user.id)), [dispatch]);

	return (
		<PageContainer>
			<Stack direction="row" sx={{ mb: 3, justifyContent: "flex-end" }}>
				<Button loading={loading} variant="contained" onClick={() => dialogRef.current.open()}>
					{t("users.addNew")}
				</Button>
			</Stack>
			<UserDialog ref={dialogRef} />
			<Table
				selection={false}
				title={t("users.title")}
				columns={columns}
				data={users}
				loading={loading}
				idField="id"
				onEdit={(user) => dialogRef.current.open(user)}
				onDelete={handleDelete}
			/>
		</PageContainer>
	);
};

export default UsersPage;
