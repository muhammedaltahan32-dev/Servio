import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MenuItem, Stack } from "@mui/material";
import { Button, Dialog, Input, Select } from "@components";
import { useLang } from "@hooks";
import { addUser, updateUser } from "../../features/users/UsersSlice.js";
import { User_Name, User_Password, User_Kind, User_IsActive } from "../../../../constants/FieldsName.js";
import { Kind_KITCHEN, Kind_WAITER, KINDS_VALUES } from "../../../../constants/enumOptions.js";

const KINDS = [Kind_WAITER, Kind_KITCHEN];

const initialFormState = {
	[User_Name]: "",
	[User_Password]: "",
	[User_Kind]: "",
	[User_IsActive]: true,
};

export const UserDialog = React.memo(
	React.forwardRef((props, ref) => {
		const dispatch = useDispatch();
		const { t } = useLang();
		const { loading } = useSelector((state) => state.users || { loading: false });
		const [open, setOpen] = React.useState(false);
		const [selectedUser, setSelectedUser] = React.useState(null);
		const [formData, setFormData] = React.useState(initialFormState);

		const handleOpen = React.useCallback((user = null) => {
			setSelectedUser(user);
			setFormData(
				user
					? {
							[User_Name]: user[User_Name] ?? "",
							[User_Password]: "",
							[User_Kind]: KINDS_VALUES[user[User_Kind]] ?? user[User_Kind] ?? "",
							[User_IsActive]: user[User_IsActive] ?? true,
						}
					: initialFormState,
			);
			setOpen(true);
		}, []);

		const handleClose = React.useCallback(() => {
			setOpen(false);
			setSelectedUser(null);
			setFormData(initialFormState);
		}, []);

		const handleSave = async () => {
			const data = selectedUser ? { ...formData, id: selectedUser.id } : formData;
			await dispatch(selectedUser ? updateUser(data) : addUser(data));
			handleClose();
		};

		React.useImperativeHandle(ref, () => ({ open: handleOpen, close: handleClose }), [handleOpen, handleClose]);

		return (
			<Dialog
				open={open}
				onClose={handleClose}
				title={selectedUser ? t("users.titleEdit") : t("users.addTitle")}
				subtitle={t("users.dialogSubtitle")}
				disabled={loading}
				actions={
					<>
						<Button disabled={loading} color="none" variant="text" onClick={handleClose}>
							{t("users.cancel")}
						</Button>
						<Button loading={loading} variant="text" onClick={handleSave}>
							{t("users.save")}
						</Button>
					</>
				}
			>
				<Stack spacing={2} sx={{ pt: "10px" }}>
					<Input
						label={t("users.username")}
						name={User_Name}
						fullWidth
						value={formData[User_Name]}
						onChange={(e) => setFormData((p) => ({ ...p, [User_Name]: e.target.value }))}
						required
					/>
					<Input
						label={t("users.password")}
						name={User_Password}
						type="password"
						fullWidth
						value={formData[User_Password]}
						onChange={(e) => setFormData((p) => ({ ...p, [User_Password]: e.target.value }))}
						required={!selectedUser}
					/>
					<Select
						label={t("users.kind")}
						name={User_Kind}
						fullWidth
						value={formData[User_Kind]}
						onChange={(e) => setFormData((p) => ({ ...p, [User_Kind]: e.target.value }))}
						required
					>
						{KINDS.map((kind) => (
							<MenuItem key={kind} value={KINDS_VALUES[kind]}>
								{t(`users.roles.${kind}`)}
							</MenuItem>
						))}
					</Select>

					<Select
						label={t("users.isActive")}
						name={User_IsActive}
						fullWidth
						value={formData[User_IsActive]}
						onChange={(e) => setFormData((p) => ({ ...p, [User_IsActive]: e.target.value }))}
						required
					>
						<MenuItem value={true}>{t("users.activate.yes")}</MenuItem>
						<MenuItem value={false}>{t("users.activate.no")}</MenuItem>
					</Select>
				</Stack>
			</Dialog>
		);
	}),
);

UserDialog.displayName = "UserDialog";
export default UserDialog;
