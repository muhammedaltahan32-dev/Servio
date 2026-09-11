import { Dialog } from "@components";
import { Box, Card, CardMedia, Chip, Typography } from "@mui/material";
import React from "react";
import { Menu_IsAvailable, Menu_Price } from "../../../../constants/FieldsName.js";

export const CustomerMenuDialog = React.memo(
	React.forwardRef(({ item, name, description, galleryImages }, ref) => {
		const [isOpened, setOpen] = React.useState(false);
		const api = React.useMemo(
			() => ({
				open: () => setOpen(true),
				close: setOpen(false),
			}),
			[],
		);
		React.useImperativeHandle(ref, () => api);
		return (
			<Dialog maxWidth="md" open={isOpened} onClose={() => setOpen(false)} title={name}>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" },
						gap: 3,
						alignItems: "start",
					}}
				>
					<Box>
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
								gap: 2,
							}}
						>
							{galleryImages.length > 0 ? (
								galleryImages.map((image, index) => (
									<Card
										key={`${item.id}-${index}`}
										sx={{ overflow: "hidden", borderRadius: 3, border: "1px solid rgba(0,0,0,0.08)" }}
									>
										<CardMedia
											component="img"
											image={image}
											alt={`${name} ${index + 1}`}
											sx={{ height: 190, objectFit: "cover" }}
										/>
									</Card>
								))
							) : (
								<Card sx={{ borderRadius: 3, overflow: "hidden" }}>
									<CardMedia
										component="img"
										// image="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80"
										alt={name}
										sx={{ height: 190, objectFit: "cover" }}
									/>
								</Card>
							)}
						</Box>
					</Box>

					<Box>
						<Typography variant="h4" sx={{ fontWeight: 800, color: "warning.main", mb: 2 }}>
							{new Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "USD",
							}).format(Number(item[Menu_Price] ?? 0))}
						</Typography>

						<Chip
							label={item[Menu_IsAvailable] === false ? "Currently unavailable" : "Available now"}
							color={item[Menu_IsAvailable] === false ? "default" : "success"}
							sx={{ mb: 2 }}
						/>

						<Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: "pre-line" }}>
							{description ||
								"Fresh ingredients, balanced flavors, and a warm presentation make this dish a favorite choice for guests."}
						</Typography>
					</Box>
				</Box>
			</Dialog>
		);
	}),
);

export default CustomerMenuDialog;
