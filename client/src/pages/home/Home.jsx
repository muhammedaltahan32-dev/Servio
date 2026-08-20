import { Button, Icon, IconButton, Input, MenuItem, Select } from "@components";

import React from "react";

import { User_Name, User_Password, User_Kind } from "../../../../constants/FieldsName.js";
import { Kind_WAITER, Kind_KITCHEN, KINDS_VALUES } from "../../../../constants/enumOptions.js";
import {
	Avatar,
	Box,
	Card,
	CardContent,
	CircularProgress,
	Container,
	FormControl,
	Stack,
	Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, resetAccountState } from "../../features/account/accountSlice.js";
import ApiService from "../../services/ApiService.js";
import { useLang } from "@hooks";
const KINDS = [Kind_WAITER, Kind_KITCHEN];

export const Home = () => {
	const dispatch = useDispatch();
	const { loading, error, success } = useSelector((state) => state.account);
	const trans = useLang();
	const [formData, setFormData] = React.useState({
		[User_Name]: "",
		[User_Password]: "",
		[User_Kind]: "",
	});

	const [showPassword, setShowPassword] = React.useState(false);
	const test = () => {
		trans.changeLanguage(trans.currentLanguage === "ar" ? "en" : "ar");
	};
	const handleSubmit = async (e) => {
		e.preventDefault();

		const result = dispatch(registerUser(formData));
		if (result) {
			console.log(result);
		}
	};
	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				// bgcolor: "grey.100",
				px: 2,
			}}
		>
			<Container maxWidth="xs">
				<Button onClick={test}>change language </Button>
				<Typography variant="h5">language test : {trans.t("auth.validation.nameRequired")}</Typography>
				<Card elevation={4} sx={{ borderRadius: 3, p: 2 }}>
					<CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
						<Avatar sx={{ m: 1, bgcolor: "primary.main", width: 56, height: 56 }}>
							<Icon name="PersonAddRounded" fontSize="large" />
						</Avatar>
						<Typography component="h1" variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
							Account Registration
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
							create a new account
						</Typography>

						{/* {error && (
							<Alert severity="error" sx={{ width: "100%", mb: 2 }}>
								{error}
							</Alert>
						)} */}

						<Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
							<Input
								error={error}
								fullWidth
								margin="normal"
								label={"Username"}
								value={formData[User_Name]}
								onChange={(e) => setFormData((data) => ({ ...data, [User_Name]: e.target.value }))}
								suffix={<IconButton name={"PersonOutlineOutlined"} />}
							/>
							<Input
								error={error}
								fullWidth
								margin="normal"
								label={"Password"}
								value={formData[User_Password]}
								onChange={(e) => setFormData((data) => ({ ...data, [User_Password]: e.target.value }))}
								type={showPassword ? "text" : "password"}
								suffix={
									<IconButton
										onClick={() => setShowPassword((p) => !p)}
										name={showPassword ? "VisibilityOffOutlined" : "RemoveRedEyeOutlined"}
									/>
								}
							/>
							<Select
								error={error}
								fullWidth
								margin="normal"
								label={"Account Kind"}
								value={formData[User_Kind]}
								onChange={(e) => setFormData((data) => ({ ...data, [User_Kind]: e.target.value }))}
							>
								{KINDS.map((kind) => (
									<MenuItem key={kind} value={KINDS_VALUES[kind] ?? ""}>
										{kind}
									</MenuItem>
								))}
							</Select>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								size="large"
								sx={{ mt: 3, mb: 1, py: 1.2, fontWeight: "bold" }}
								disabled={!formData[User_Password] || !formData[User_Name] || formData[User_Kind] === "" || loading}
							>
								{loading ? <CircularProgress size={24} color="inherit" /> : "Create An Account"}
							</Button>
						</Box>
					</CardContent>
				</Card>
			</Container>
		</Box>
	);
};

export default Home;
