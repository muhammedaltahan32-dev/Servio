import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, setCredentials } from "../../features/auth/authSlice.js";
import { useNavigate } from "react-router-dom";

import {
	Box,
	Card,
	CardContent,
	Typography,
	Alert,
	CircularProgress,
	InputAdornment,
	Avatar,
	Container,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { User_Name, User_Password } from "../../../../constants/FieldsName.js";
import { Icon, Input, IconButton, Button } from "@components";
import { useTheme } from "@emotion/react";
import { useLang } from "@hooks";
export const Login = () => {
	const dispatch = useDispatch();
	const theme = useTheme();
	const { loading, error, user } = useSelector((state) => state.auth);
	const [formData, setFormData] = React.useState({
		[User_Name]: user?.[User_Name],
		[User_Password]: "",
	});
	const { t } = useLang();
	const [showPassword, setShowPassword] = useState(false);
	const [message, setMessage] = React.useState(null);
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
		} else {
			setMessage(t(result.payload));
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
				backgroundColor: "background.default",
				position: "relative",
				overflow: "hidden",
				p: 2,
			}}
		>
			{/* Background Decorative Ambient Glows */}
			<Box
				sx={{
					position: "absolute",
					top: "-10%",
					left: "-5%",
					width: "450px",
					height: "450px",
					borderRadius: "50%",
					background: `radial-gradient(circle, ${theme.palette.primary.main} 0%, transparent 70%)`,
					opacity: 0.15,
					filter: "blur(60px)",
					pointerEvents: "none",
				}}
			/>
			<Box
				sx={{
					position: "absolute",
					bottom: "-10%",
					right: "-5%",
					width: "500px",
					height: "500px",
					borderRadius: "50%",
					background: `radial-gradient(circle, ${theme.palette.secondary.main} 0%, transparent 70%)`,
					opacity: 0.12,
					filter: "blur(70px)",
					pointerEvents: "none",
				}}
			/>

			<Card
				elevation={0}
				sx={{
					maxWidth: 420,
					width: "100%",
					p: { xs: 3, sm: 4 },
					backdropFilter: "blur(16px)",

					border: "1px solid",
					borderColor: theme.palette.mode === "dark" ? "#ffffff14" : "#0000000f",
					boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.08)",
				}}
			>
				{/* Header */}
				<Box sx={{ mb: 4, textAlign: "left" }}>
					<Box
						sx={{
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							width: 44,
							height: 44,
							backgroundColor: "primary.main",
							color: "#FFFFFF",
							fontWeight: 800,
							fontSize: "1.2rem",
							borderRadius: 0.5,
							mb: 2,
							boxShadow: `0 8px 16px ${theme.palette.primary.main}40`,
						}}
					>
						S
					</Box>
					<Typography variant="h4" fontWeight="800" color="text.primary" letterSpacing="-0.5px">
						Welcome back
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
						Please sign in to continue to your dashboard
					</Typography>
				</Box>

				{/* Form Inputs */}
				<Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
					<Box>
						<Typography variant="p" fontWeight="600" color="text.primary" sx={{ mb: 0.8, display: "block" }}>
							{t("login.username")}
						</Typography>
						<Input
							error={error}
							disabled={loading}
							fullWidth
							name="name"
							type="text"
							placeholder={t("login.username")}
							value={formData[User_Name]}
							onChange={(e) => setFormData((prev) => ({ ...prev, [User_Name]: e.target.value }))}
							required
							variant="outlined"
							sx={{
								"& .MuiOutlinedInput-root": {
									backgroundColor: "background.default",
								},
							}}
							prefix={<Icon name="AccountCircleOutlined" sx={{ fontSize: 20, color: "text.secondary" }} />}
						/>
					</Box>

					<Box>
						<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.8 }}>
							<Typography variant="p" fontWeight="600" color="text.primary">
								{t("login.password")}
							</Typography>
						</Box>
						<Input
							disabled={loading}
							fullWidth
							error={error}
							name="password"
							type={showPassword ? "text" : "password"}
							placeholder="••••••••"
							value={formData[User_Password]}
							onChange={(e) => setFormData((prev) => ({ ...prev, [User_Password]: e.target.value }))}
							required
							sx={{
								"& .MuiOutlinedInput-root": {
									backgroundColor: "background.default",
								},
							}}
							prefix={<Icon name="LockOutlined" sx={{ fontSize: 20, color: "text.secondary" }} />}
							suffix={
								<IconButton
									onClick={() => setShowPassword(!showPassword)}
									edge="end"
									size="small"
									sx={{ fontSize: 18 }}
									name={showPassword ? "VisibilityOff" : "Visibility"}
								/>
							}
						/>
					</Box>
					{error && message && <Alert severity={"error"}>{message}</Alert>}

					<Button
						type="submit"
						variant="contained"
						size="large"
						disableElevation
						loading={loading}
						sx={{
							py: 1.5,
							mt: 1,
							fontWeight: 700,
							textTransform: "none",
							fontSize: "0.95rem",
							boxShadow: `0 8px 20px ${theme.palette.primary.main}40`,
							transition: "transform 0.2s ease, box-shadow 0.2s ease",
							"&:hover": {
								transform: "translateY(-1px)",
							},
						}}
					>
						{t("login.login")}
					</Button>
				</Box>
			</Card>
		</Box>
	);
};

export default Login;
