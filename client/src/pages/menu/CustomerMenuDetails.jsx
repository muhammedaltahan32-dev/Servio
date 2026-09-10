import React from "react";
import { useNavigate, useOutlet, useLocation } from "react-router-dom";
import { Box, Typography, Card, CardContent, CardActionArea, Grid } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

const items = [
	{ id: "1", name: "Classic Cheeseburger", price: "$10.99" },
	{ id: "2", name: "Margherita Pizza", price: "$12.50" },
];

export default function CustomerMenuDetails() {
	const navigate = useNavigate();
	const location = useLocation();
	const outlet = useOutlet();

	const handleBackdropClick = () => {
		navigate("/customer-menu"); // Close modal when clicking outside
	};

	return (
		<Box sx={{ position: "relative", minHeight: "100%" }}>
			{/* Background Menu Items Grid */}
			<Typography variant="h4" gutterBottom>
				Menu Items
			</Typography>

			<Grid container spacing={3}>
				{items.map((item) => (
					<Grid item xs={12} sm={6} md={4} key={item.id}>
						<Card elevation={2} sx={{ borderRadius: 2 }}>
							<CardActionArea onClick={() => navigate(`/menu-items/${item.id}`)}>
								<CardContent>
									<Typography variant="h6">{item.name}</Typography>
									<Typography variant="body1" color="primary" fontWeight="bold">
										{item.price}
									</Typography>
								</CardContent>
							</CardActionArea>
						</Card>
					</Grid>
				))}
			</Grid>

			{/* Animated Center Pop-up Modal Container */}
			<AnimatePresence mode="wait">
				{outlet && (
					<motion.div
						key={location.pathname}
						onClick={handleBackdropClick} // Close modal on backdrop click
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						style={{
							position: "fixed",
							top: 0,
							left: 0,
							width: "100vw",
							height: "100vh",
							backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark semi-transparent backdrop
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							zIndex: 1300,
							padding: "16px",
						}}
					>
						{/* Inner Pop-Up Card with Scale Motion */}
						<motion.div
							onClick={(e) => e.stopPropagation()} // Stop click propagation inside modal
							initial={{ opacity: 0, scale: 0.85, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.85, y: 20 }}
							transition={{ type: "spring", stiffness: 350, damping: 25 }}
							style={{ width: "100%", maxWidth: "500px" }}
						>
							{outlet}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</Box>
	);
}
