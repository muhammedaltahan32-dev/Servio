import { Box, Card, CardActionArea, CardContent, CardMedia, Chip, DialogTitle, Stack, Typography } from "@mui/material";
import React from "react";
import { Cat_ID, Menu_BaseImage, Menu_Images, Menu_IsAvailable, Menu_Price } from "../../../../constants/FieldsName.js";
import { useLang } from "@hooks";
import { normalizeImage } from "./utils/helpers.js";
import { Button, Carousel, Icon } from "@components";
import { useSelector } from "react-redux";
import CustomerMenuDialog from "./CustomerMenuDialog.jsx";
import { AnimatePresence, motion } from "framer-motion";

export const CustomerMenuCard = React.memo(({ item, onOrder, index }) => {
	const { getFieldsByLang, t } = useLang();
	const image = normalizeImage(item[Menu_BaseImage] || item[Menu_Images]?.[0]);
	const price = Number(item[Menu_Price] ?? 0);
	const dialogRef = React.useRef(null);

	const categories = useSelector((state) => state.categories?.items ?? []);
	const safeCategories = React.useMemo(
		() => categories.filter((category) => category && category[Cat_ID] !== undefined && category[Cat_ID] !== null),
		[categories],
	);
	const { name, description, galleryImages } = React.useMemo(() => {
		const result = {
			description: getFieldsByLang(item, "description"),
			name: getFieldsByLang(item, "name"),
			galleryImages: [],
		};
		if (item) {
			const images = [item[Menu_BaseImage], ...(Array.isArray(item[Menu_Images]) ? item[Menu_Images] : [])];
			result.galleryImages = images.filter(Boolean).map(normalizeImage);
		}
		return result;
	}, [getFieldsByLang, item]);
	const carouselSlides = React.useMemo(() => {
		if (galleryImages && galleryImages.length > 0) {
			return galleryImages.map((image) => ({ image }));
		}
		return [];
	}, [galleryImages]);
	return (
		<AnimatePresence mode="wait">
			<motion.div
				key="grid-view"
				initial={{ opacity: 0, y: "10%" }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0 }}
				transition={{ duration: Math.min(1, 0.2 * (index + 1)) }}
			>
				<Card
					className={"customer-card"}
					sx={{
						height: "360px",
						borderRadius: "shape.borderRadius",
						boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
						border: "1px solid ",
						borderColor: "divider",
						transition: "transform 0.4s ease, box-shadow 0.2s ease",
						position: "relative",
						overflow: "visible",
						display: "flex",
						flexDirection: "column",
						"&:hover": {
							boxShadow: "0 24px 50px rgba(15, 23, 42, 0.2)",
							transform: "translateY(4px)",
						},
					}}
				>
					<Box
						sx={{
							height: "150px",
							width: "150px",
							borderRadius: 9999,
							boxShadow: "0 0 20px 5px #0002",
							overflow: "hidden",
							position: "absolute",
							top: "0",
							border: "2px solid ",
							borderColor: "primary.main",
							insetInline: "50%",
							transform: "translate(-50%,-25%)",
						}}
					>
						<CardMedia
							component="img"
							draggable={false}
							image={image}
							alt={name}
							sx={{
								height: "100%",
								width: "100%",
								objectFit: "cover",
								userSelect: "none",
							}}
						/>
					</Box>
					<CardContent
						sx={{
							display: "flex",
							flexDirection: "column",
							p: 2.5,
							mt: "auto",
							height: "calc(100% - 120px)",
							userSelect: "none",
						}}
					>
						<Stack
							direction="column"
							spacing={1}
							sx={{ mb: 1.5, justifyContent: "space-between", alignItems: "center" }}
						>
							<Typography
								variant="h3"
								color="text.secondary"
								sx={{
									marginInline: "auto",
									textAlign: "center",
									overflow: "hidden",
								}}
							>
								{name}
							</Typography>
							<Chip
								label={item[Menu_IsAvailable] === false ? "Unavailable" : "Available"}
								color={item[Menu_IsAvailable] === false ? "default" : "success"}
								size="small"
							/>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{
									height: 45,
									display: "-webkit-box",
									WebkitLineClamp: 2,
									WebkitBoxOrient: "vertical",
									overflow: "hidden",
								}}
							>
								{description}
							</Typography>
						</Stack>

						<Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
							<Typography variant="h6" sx={{ fontWeight: 800, color: "secondary.main" }}>
								{new Intl.NumberFormat("en-US", {
									style: "currency",
									currency: "USD",
								}).format(price)}
							</Typography>
						</Stack>
						<Stack direction={"row"} spacing={1} sx={{ mt: "auto" }}>
							<Button
								onClick={() => onOrder?.(item)}
								disabled={item[Menu_IsAvailable] === false}
								suffix={<Icon name="TakeoutDiningOutlined" size="1rem" />}
								sx={{ bgcolor: "primary" }}
							>
								{t("customerMenu.card.order")}
							</Button>
							<Button
								onClick={() => dialogRef.current.open()}
								suffix={<Icon name="InfoOutlined" size="1rem" />}
								sx={{ bgcolor: "#0006" }}
							>
								{t("customerMenu.card.showDetails")}
							</Button>
						</Stack>
					</CardContent>
				</Card>
				<CustomerMenuDialog
					ref={dialogRef}
					item={item}
					name={name}
					description={description}
					galleryImages={galleryImages}
				/>
			</motion.div>
		</AnimatePresence>
	);
});
CustomerMenuCard.displayName = "CustomerMenuCard";
export default CustomerMenuCard;
