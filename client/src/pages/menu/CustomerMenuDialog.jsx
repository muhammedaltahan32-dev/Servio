import { Carousel, Dialog } from "@components";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";
import { Box, Chip, Stack, Typography } from "@mui/material";
import React from "react";
import { Menu_IsAvailable, Menu_Price } from "../../../../constants/FieldsName.js";
import { useLang } from "@hooks";
import { formatCurrency } from "@utils";

export const CustomerMenuDialog = React.memo(
	React.forwardRef(({ item, name, description, galleryImages }, ref) => {
		const { t, currentLanguage } = useLang();
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
			<Dialog
				fullWidth
				open={isOpened}
				onClose={() => setOpen(false)}
				title={name}
				bottomSheetProps={{ height: "85vh", maxHeight: "85vh" }}
			>
				<Box>
					<Box>
					<Stack spacing={2} sx={{ minWidth: 0 }}>
						{carouselSlides.length ? <Carousel
							disableItemCaption
							autoPlay={false}
							sx={{ width: "100%", height: { xs: "34vh", sm: "48vh" }, minHeight: 200, maxHeight: 460, marginInline: "auto", borderRadius: 2 }}
							caption={name}
							items={carouselSlides}
						/> : <Box sx={{ height: 200, display: "grid", placeItems: "center", borderRadius: 2, bgcolor: "action.hover", color: "text.secondary" }}><ImageNotSupportedOutlinedIcon sx={{ fontSize: "2rem" }} /></Box>}
						<Box sx={{ minWidth: 0 }}>
						<Typography variant="h4" sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}>
						{formatCurrency(item[Menu_Price], currentLanguage)}
						</Typography>

						<Chip
							label={item[Menu_IsAvailable] === false ? t("customerMenu.unavailableNow") : t("customerMenu.availableNow")}
							color={item[Menu_IsAvailable] === false ? "default" : "success"}
							sx={{ mb: 2 }}
						/>

						<Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: "pre-line", overflowWrap: "anywhere" }}>
							{description}
						</Typography>
						</Box>
					</Stack>
					</Box>
				</Box>
			</Dialog>
		);
	}),
);

export default CustomerMenuDialog;
