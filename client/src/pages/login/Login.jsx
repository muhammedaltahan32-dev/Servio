import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, setCredentials } from "../../features/auth/authSlice.js";
import { useNavigate } from "react-router-dom";

import {
	Box,
	Card,
	CardContent,
	TextField,
	Button,
	Typography,
	Alert,
	CircularProgress,
	InputAdornment,
	IconButton,
	Avatar,
	Container,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { User_Name, User_Password } from "../../../../constants/FieldsName.js";

export const Login = () => {
	const dispatch = useDispatch();
	const { loading, error, user } = useSelector((state) => state.auth);
	const [formData, setFormData] = React.useState({
		[User_Name]: user?.[User_Name],
		[User_Password]: "",
	});
	const [showPassword, setShowPassword] = useState(false);

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const result = await dispatch(loginUser(formData));

		if (loginUser.fulfilled.match(result)) {
			const { token } = result.payload;

			dispatch(
				setCredentials({
					token,
					...formData,
				}),
			);
			navigate("/");
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				bgcolor: "grey.100",
				px: 2,
			}}
		>
			<Container maxWidth="xs">
				<Card elevation={4} sx={{ borderRadius: 3, p: 2 }}>
					<CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
						{/* Header Avatar & Title */}
						<Avatar sx={{ m: 1, bgcolor: "primary.main", width: 56, height: 56 }}>
							<LockOutlinedIcon fontSize="large" />
						</Avatar>
						<Typography component="h1" variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
							Restaurant Admin
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
							Sign in to manage orders and menu
						</Typography>

						{/* Error Alert */}
						{error && (
							<Alert severity="error" sx={{ width: "100%", mb: 2 }}>
								{error}
							</Alert>
						)}

						{/* Form */}
						<Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
							<TextField
								margin="normal"
								required
								fullWidth
								id="username"
								label="Username"
								name="username"
								autoComplete="username"
								autoFocus
								value={formData[User_Name]}
								onChange={(e) => setFormData((data) => ({ ...data, [User_Name]: e.target.value }))}
								disabled={loading}
							/>

							<TextField
								margin="normal"
								required
								fullWidth
								name="password"
								label="Password"
								type={showPassword ? "text" : "password"}
								id="password"
								autoComplete="current-password"
								value={formData[User_Password]}
								onChange={(e) => setFormData((data) => ({ ...data, [User_Password]: e.target.value }))}
								disabled={loading}
								slotProps={{
									input: {
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													aria-label="toggle password visibility"
													onClick={togglePasswordVisibility}
													edge="end"
												>
													{showPassword ? <VisibilityOff /> : <Visibility />}
												</IconButton>
											</InputAdornment>
										),
									},
								}}
							/>

							<Button
								type="submit"
								fullWidth
								variant="contained"
								size="large"
								disabled={loading}
								sx={{ mt: 3, mb: 1, py: 1.2, fontWeight: "bold" }}
							>
								{loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
							</Button>
						</Box>
					</CardContent>
				</Card>
			</Container>
		</Box>
	);
};

export default Login;
