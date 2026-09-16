import { Carousel, Dialog } from "@components";
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
		const carouselSlides = React.useMemo(() => {
			if (galleryImages && galleryImages.length > 0) {
				return galleryImages.map((image) => ({ image }));
			}
			return [];
		}, [galleryImages]);
		React.useImperativeHandle(ref, () => api);
		return (
			<Dialog maxWidth="md" open={isOpened} onClose={() => setOpen(false)} title={name}>
				<Box>
					<Box>
						<Box
							sx={{
								display: "grid",
								gap: 2,
							}}
						>
							<Carousel sx={{ width: "50%", height: 400, marginInline: "auto" }} items={carouselSlides} />
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
