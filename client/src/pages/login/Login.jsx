import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	Alert,
	Box,
	Card,
	CardContent,
	Stack,
	Typography,
	useTheme,
} from "@mui/material";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { User_Name, User_Password } from "../../../../constants/FieldsName.js";
import { Input, Button, IconButton } from "@components";
import { useLang } from "@hooks";
import { loginUser, setCredentials } from "../../features/auth/authSlice.js";

const LoginArtwork = React.memo(() => (
	<Box
		aria-hidden="true"
		className="login-brand-artwork"
		sx={{
			position: { xs: "absolute", md: "relative" },
			insetInlineStart: { xs: "-12%", md: "auto" },
			top: { xs: "18%", md: "auto" },
			bottom: { xs: "16%", md: "auto" },
			width: { xs: "124%", md: "100%" },
			maxWidth: { xs: "none", md: 470 },
			alignSelf: "center",
			my: { xs: 0, md: 1 },
			transform: "none",
			aspectRatio: "1.38",
			opacity: { xs: 0.28, md: 1 },
			pointerEvents: "none",
			"&::before": {
				content: '""',
				position: "absolute",
				width: "58%",
				aspectRatio: 1,
				border: "1px solid rgba(255,255,255,0.18)",
				borderRadius: "50%",
				insetInlineStart: "21%",
				top: "10%",
			},
			"&::after": {
				content: '""',
				position: "absolute",
				width: "44%",
				aspectRatio: 1,
				border: "1px solid rgba(255,255,255,0.12)",
				borderRadius: "50%",
				insetInlineStart: "28%",
				top: "17%",
			},
		}}
	>
		<Box
			sx={{
				position: "absolute",
				inset: "15% 8% 13%",
				border: "1px solid rgba(255,255,255,0.22)",
				borderRadius: 4,
				backgroundColor: "rgba(7, 35, 30, 0.28)",
				backdropFilter: "blur(8px)",
				transform: "rotate(-4deg)",
			}}
		/>
		<Box
			sx={{
				position: "absolute",
				inset: "9% 11% 18%",
				p: { xs: 1.5, sm: 2 },
				border: "1px solid rgba(255,255,255,0.3)",
				borderRadius: 4,
				background: "linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))",
				boxShadow: "0 12px 28px rgba(0, 0, 0, 0.12)",
				backdropFilter: "blur(14px)",
			}}
		>
			<Stack direction="row" spacing={0.65} sx={{ alignItems: "center", pb: 1.5, borderBottom: "1px solid rgba(255,255,255,0.16)" }}>
				{[0, 1, 2].map((item) => <Box key={item} sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.68)" }} />)}
				<Box sx={{ flex: 1 }} />
				<Box sx={{ width: "22%", height: 5, borderRadius: 10, bgcolor: "rgba(255,255,255,0.3)" }} />
			</Stack>
			<Box sx={{ height: "72%", display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: 1.25, pt: 1.5 }}>
				<Stack spacing={1}>
					{["62%", "82%", "70%", "55%"].map((width, index) => (
						<Box key={index} sx={{ height: 25, px: 0.75, display: "flex", alignItems: "center", gap: 0.6, borderRadius: 1.25, bgcolor: index === 1 ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.08)" }}>
							<Box sx={{ width: 7, height: 7, borderRadius: 1, bgcolor: index === 1 ? "#B4F2D5" : "rgba(255,255,255,0.5)" }} />
							<Box sx={{ width, height: 4, borderRadius: 10, bgcolor: "rgba(255,255,255,0.55)" }} />
						</Box>
					))}
				</Stack>
				<Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridTemplateRows: "repeat(2, 1fr)", gap: 1 }}>
					{[0, 1, 2, 3].map((item) => (
						<Box key={item} sx={{ border: "1px solid rgba(255,255,255,0.2)", borderRadius: 1.5, bgcolor: item === 2 ? "rgba(199,255,225,0.18)" : "rgba(255,255,255,0.08)", display: "grid", placeItems: "center" }}>
							<Box sx={{ width: "45%", aspectRatio: 1, border: "1px solid rgba(255,255,255,0.65)", borderRadius: item === 2 ? "50%" : 1.25, position: "relative", "&::after": { content: '""', position: "absolute", width: 5, height: 5, borderRadius: "50%", bgcolor: "#B4F2D5", top: -2, insetInlineEnd: -2 } }} />
						</Box>
					))}
				</Box>
			</Box>
		</Box>
		<Box sx={{ position: "absolute", top: "4%", insetInlineEnd: "9%", width: 42, height: 42, border: "1px solid rgba(255,255,255,0.24)", borderRadius: 2, bgcolor: "rgba(255,255,255,0.15)", display: "grid", placeItems: "center", transform: "rotate(10deg)" }}>
			<CheckCircleOutlineRoundedIcon sx={{ fontSize: 23 }} />
		</Box>
		<Box sx={{ position: "absolute", bottom: "4%", insetInlineStart: "5%", width: 50, height: 50, border: "1px solid rgba(255,255,255,0.24)", borderRadius: "50%", bgcolor: "rgba(255,255,255,0.15)", display: "grid", placeItems: "center" }}>
			<RestaurantMenuRoundedIcon sx={{ fontSize: 25 }} />
		</Box>
	</Box>
));

LoginArtwork.displayName = "LoginArtwork";

export const Login = () => {
	const dispatch = useDispatch();
	const theme = useTheme();
	const loading = useSelector((state) => state.auth.loading);
	const error = useSelector((state) => state.auth.error);
	const user = useSelector((state) => state.auth.user);
	const [formData, setFormData] = React.useState({
		[User_Name]: user?.[User_Name] ?? "",
		[User_Password]: "",
	});
	const { t } = useLang();
	const [showPassword, setShowPassword] = useState(false);
	const [message, setMessage] = React.useState(null);
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();
		const result = await dispatch(loginUser(formData));

		if (loginUser.fulfilled.match(result)) {
			const { token, refreshToken } = result.payload.data;

			dispatch(
				setCredentials({
					token,
					refreshToken,
					...formData,
				}),
			);
			navigate("/");
		} else {
			setMessage(t(result.payload));
		}
	};

	return (
		<Box
			sx={{
				height: "100dvh",
				minHeight: 0,
				p: { xs: 0, sm: 2, md: 3 },
				display: "grid",
				placeItems: "center",
				position: "relative",
				isolation: "isolate",
				overflow: "hidden",
				bgcolor: "background.default",
				"&::before": {
					content: '""',
					position: "fixed",
					width: { xs: 240, md: 420 },
					height: { xs: 240, md: 420 },
					borderRadius: "50%",
					background: `radial-gradient(circle, color-mix(in srgb, ${theme.palette.primary.main} 9%, transparent) 0%, transparent 72%)`,
					top: { xs: -120, md: -180 },
					insetInlineStart: { xs: -100, md: -150 },
					zIndex: -1,
					pointerEvents: "none",
				},
				"&::after": {
					content: '""',
					position: "fixed",
					width: { xs: 260, md: 460 },
					height: { xs: 260, md: 460 },
					borderRadius: "50%",
					background: `radial-gradient(circle, color-mix(in srgb, ${theme.palette.secondary.main} 7%, transparent) 0%, transparent 72%)`,
					bottom: { xs: -160, md: -210 },
					insetInlineEnd: { xs: -120, md: -170 },
					zIndex: -1,
					pointerEvents: "none",
				},
			}}
		>
			<Card
				component="main"
				elevation={0}
				sx={(currentTheme) => ({
					width: { xs: "100%", sm: "min(100%, 580px)", md: "min(100%, 1120px)" },
					height: { xs: "100%", sm: "min(760px, calc(100dvh - 32px))", md: "min(760px, calc(100dvh - 48px))" },
					minHeight: 0,
					display: "grid",
					gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(390px, 0.88fr)" },
					alignItems: { xs: "center", md: "stretch" },
					border: 0,
					borderRadius: { xs: 0, sm: `${currentTheme.tokens.radius.panel}px` },
					bgcolor: { xs: "transparent", md: "background.paper" },
					boxShadow: { xs: "none", md: currentTheme.tokens.shadow.card },
					overflow: "hidden",
					position: "relative",
					zIndex: 1,
					"@media (max-height: 680px) and (min-width: 900px)": {
						"& .login-brand-artwork": { display: "none" },
						"& .login-brand-panel": { px: 4, py: 3 },
					},
					"@media (max-height: 520px)": {
						"& .login-form-content": { py: 1.5, px: { xs: 2, sm: 3, md: 4 } },
						"& .login-mobile-brand": { mb: 1.5 },
						"& .login-form-heading": { mb: 1.5 },
						"& .login-form": { gap: 1.25 },
						"& .login-form-note": { display: "none" },
						"& .login-input .MuiOutlinedInput-root": { minHeight: 46 },
						"& .login-submit": { minHeight: 44 },
					},
				})}
			>
				<Box
					component="section"
					className="login-brand-panel"
					aria-label={t("login.brand")}
					sx={(currentTheme) => ({
						position: { xs: "absolute", md: "relative" },
						inset: { xs: 0, md: "auto" },
						height: { xs: "100%", md: "auto" },
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						minHeight: 0,
						p: { xs: 0, md: 4.5, lg: 5.5 },
						color: currentTheme.palette.primary.contrastText,
						background: `linear-gradient(145deg, ${currentTheme.palette.primary.dark} 0%, ${currentTheme.palette.primary.main} 58%, ${currentTheme.palette.primary.light} 100%)`,
						isolation: "isolate",
						overflow: "hidden",
						zIndex: 0,
						"&::before": {
							content: '""',
							position: "absolute",
							inset: 0,
							background: "radial-gradient(ellipse at 85% 8%, rgba(255,255,255,.18), transparent 40%)",
							zIndex: -1,
						},
					})}
				>
					<Stack direction="row" spacing={1.25} sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", position: "relative", zIndex: 1 }}>
						<Box sx={{ width: 44, height: 44, borderRadius: 2, display: "grid", placeItems: "center", bgcolor: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.25)" }}>
							<RestaurantMenuRoundedIcon sx={{ fontSize: 25 }} />
						</Box>
						<Typography variant="h6" fontWeight={800} letterSpacing="-0.03em">{t("login.brand")}</Typography>
					</Stack>

					<Box className="login-brand-copy" sx={{ display: { xs: "none", md: "block" }, position: "relative", zIndex: 1 }}>
						<Typography variant="overline" sx={(currentTheme) => ({ display: "block", fontWeight: 700, letterSpacing: currentTheme.direction === "rtl" ? "normal" : "0.14em", opacity: 0.78, mb: 1 })}>
							{t("login.brandEyebrow")}
						</Typography>
						<Typography component="h1" sx={{ maxWidth: 460, fontSize: { xs: "1.65rem", sm: "2rem", md: "2.55rem" }, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.035em" }}>
							{t("login.brandHeadline")}
						</Typography>
						<Typography variant="body1" sx={{ maxWidth: 430, mt: 1.5, lineHeight: 1.8, opacity: 0.82 }}>
							{t("login.brandDescription")}
						</Typography>
					</Box>

					<LoginArtwork />

					<Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", position: "relative", zIndex: 1 }}>
						<CheckCircleOutlineRoundedIcon sx={{ fontSize: 18, opacity: 0.85 }} />
						<Typography variant="body2" sx={{ opacity: 0.85 }}>{t("login.secureNote")}</Typography>
					</Stack>
				</Box>

				<CardContent
					component="section"
					className="login-form-content"
					sx={{
						position: { xs: "relative", md: "static" },
						zIndex: 1,
						width: { xs: "calc(100% - 24px)", sm: "min(440px, calc(100% - 40px))", md: "auto" },
						maxHeight: { xs: "calc(100dvh - 24px)", md: "100%" },
						justifySelf: { xs: "center", md: "stretch" },
						alignSelf: { xs: "center", md: "stretch" },
						px: { xs: 2.5, sm: 4, md: 6 },
						py: { xs: 3, sm: 4, md: 5 },
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						minWidth: 0,
						minHeight: 0,
						my: { xs: 1.5, md: 0 },
						border: { xs: "1px solid", md: 0 },
						borderColor: "divider",
						borderRadius: { xs: `${theme.tokens.radius.panel}px`, md: 0 },
						bgcolor: { xs: "color-mix(in srgb, var(--mui-palette-background-paper) 86%, transparent)", md: "transparent" },
						backdropFilter: { xs: "blur(24px)", md: "none" },
						boxShadow: { xs: theme.tokens.shadow.dialog, md: "none" },
					}}
				>
					<Stack className="login-mobile-brand" direction="row" spacing={1} sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", mb: 2.5 }}>
						<Box sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: "primary.main", color: "primary.contrastText", display: "grid", placeItems: "center" }}>
							<RestaurantMenuRoundedIcon sx={{ fontSize: 21 }} />
						</Box>
						<Typography fontWeight={800} color="text.primary">{t("login.brand")}</Typography>
					</Stack>

					<Box className="login-form-heading" sx={{ mb: 2.5 }}>
						<Typography variant="overline" color="primary.main" sx={(currentTheme) => ({ fontWeight: 800, letterSpacing: currentTheme.direction === "rtl" ? "normal" : "0.12em" })}>
							{t("login.formEyebrow")}
						</Typography>
						<Typography component="h2" variant="h4" fontWeight={800} color="text.primary" sx={{ mt: 0.5, letterSpacing: "-0.035em" }}>
							{t("login.welcome")}
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>
							{t("login.signInHint")}
						</Typography>
					</Box>

					<Box className="login-form" component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
						<Input
							className="login-input"
							label={t("login.username")}
							error={Boolean(error)}
							disabled={loading}
							fullWidth
							autoComplete="username"
							name={User_Name}
							type="text"
							value={formData[User_Name]}
							onChange={(event) => setFormData((previous) => ({ ...previous, [User_Name]: event.target.value }))}
							required
							prefix={<AccountCircleOutlinedIcon sx={{ fontSize: 20, color: "text.secondary" }} />}
							sx={{ "& .MuiOutlinedInput-root": { minHeight: 54, bgcolor: "background.default" } }}
						/>
						<Input
							className="login-input"
							label={t("login.password")}
							error={Boolean(error)}
							disabled={loading}
							fullWidth
							autoComplete="current-password"
							name={User_Password}
							type={showPassword ? "text" : "password"}
							value={formData[User_Password]}
							onChange={(event) => setFormData((previous) => ({ ...previous, [User_Password]: event.target.value }))}
							required
							prefix={<LockOutlinedIcon sx={{ fontSize: 20, color: "text.secondary" }} />}
							suffix={(
								<IconButton
									aria-label={t(showPassword ? "login.hidePassword" : "login.showPassword")}
									onClick={() => setShowPassword((previous) => !previous)}
									edge="end"
									size="small"
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							)}
							sx={{ "& .MuiOutlinedInput-root": { minHeight: 54, bgcolor: "background.default" } }}
						/>
						{error && message && <Alert severity="error" role="alert">{message}</Alert>}
						<Button
							className="login-submit"
							type="submit"
							fullWidth
							loading={loading}
							size="large"
							sx={{ minHeight: 52, mt: 0.5, fontSize: "0.95rem", boxShadow: "none", "&:hover": { boxShadow: theme.tokens.shadow.subtle, transform: "translateY(-1px)" } }}
						>
							{t("login.login")}
						</Button>
					</Box>

					<Typography className="login-form-note" variant="caption" color="text.secondary" sx={{ display: { xs: "block", md: "none" }, mt: 2, textAlign: "center", lineHeight: 1.6 }}>
						{t("login.secureNote")}
					</Typography>
				</CardContent>
			</Card>
		</Box>
	);
};

export default Login;
