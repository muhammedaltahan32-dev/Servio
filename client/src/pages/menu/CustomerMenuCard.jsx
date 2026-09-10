import { Box, Card, CardActionArea, CardContent, CardMedia, Chip, DialogTitle, Stack, Typography } from "@mui/material";
import React from "react";
import { Cat_ID, Menu_BaseImage, Menu_Images, Menu_IsAvailable, Menu_Price } from "../../../../constants/FieldsName.js";
import { useLang } from "@hooks";
import { normalizeImage } from "./utils/helpers.js";
import { Button, Dialog, Icon, IconButton } from "@components";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

export const CustomerMenuCard = React.memo(({ item, onClick }) => {
	const { getFieldsByLang, t } = useLang();
	const image = normalizeImage(item[Menu_BaseImage] || item[Menu_Images]?.[0]);
	const price = Number(item[Menu_Price] ?? 0);
	const navigate = useNavigate();
	const [isOpened, setOpen] = React.useState(false);
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

	return (
		<>
			<Card
				className={"customer-card"}
				component={motion.div}
				layoutId={`card-${item.id}`} // Unique key matching the detail view
				sx={{
					height: "100%",
					borderRadius: 4,
					overflow: "hidden",
					boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
					border: "1px solid ",
					borderColor: "divider",
					transition: "transform 0.4s ease, box-shadow 0.2s ease",
					"&:hover": {
						// transform: "translateY(-4px)",
						boxShadow: "0 24px 50px rgba(15, 23, 42, 0.2)",
					},
				}}
			>
				<>
					<Box
						sx={{
							overflow: "hidden",
							position: "relative",
						}}
					>
						<Stack
							direction={"row"}
							spacing={1}
							sx={{
								position: "absolute",
								bottom: 5,
								insetInlineStart: 5,
								zIndex: 1,
								opacity: 0,
								transition: "opacity 0.4s ease",
								".customer-card:hover &": {
									opacity: 1,
								},
							}}
						>
							<Button suffix={<Icon name="TakeoutDiningOutlined" size="1rem" />} sx={{ bgcolor: "primary" }}>
								{t("customerMenu.card.order")}
							</Button>
							<Button
              onClick={onClick}
								// onClick={() => setOpen(true)}
								// onClick={() => navigate(`/customer-menu/${item.id}`)}
								suffix={<Icon name="InfoOutlined" size="1rem" />}
								sx={{ bgcolor: "#0006" }}
							>
								{t("customerMenu.card.showDetails")}
							</Button>
						</Stack>
						<CardMedia
							component={motion.img}
							layoutId={`image-${item.id}`}
							draggable={false}
							image={image}
							alt={name}
							sx={{
								height: 220,
								objectFit: "cover",
								userSelect: "none",
								transition: "transform 0.5s ease, filter 0.5s ease",
								".customer-card:hover &": {
									transform: "scale(1.5)",
									filter: "blur(5px)",
								},
							}}
						/>
					</Box>
					<CardContent sx={{ p: 2.5 }}>
						<Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
							<Typography variant="h6" sx={{ fontWeight: 700 }}>
								{name}
							</Typography>
							<Chip
								label={item[Menu_IsAvailable] === false ? "Unavailable" : "Available"}
								color={item[Menu_IsAvailable] === false ? "default" : "success"}
								size="small"
							/>
						</Stack>

						<Typography
							variant="body2"
							color="text.secondary"
							sx={{
								minHeight: 48,
								mb: 2,
								display: "-webkit-box",
								WebkitLineClamp: 3,
								WebkitBoxOrient: "vertical",
								overflow: "hidden",
							}}
						>
							{description}
						</Typography>

						<Stack direction="row" justifyContent="space-between" alignItems="center">
							<Typography variant="h6" sx={{ fontWeight: 800, color: "warning.main" }}>
								{new Intl.NumberFormat("en-US", {
									style: "currency",
									currency: "USD",
								}).format(price)}
							</Typography>
							<Button variant="text" color="warning" sx={{ fontWeight: 700, px: 0 }}>
								View details
							</Button>
						</Stack>
					</CardContent>
				</>
			</Card>
		</>
	);
});
CustomerMenuCard.displayName = "CustomerMenuCard";
export default CustomerMenuCard;
