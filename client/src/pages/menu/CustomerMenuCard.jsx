import React from "react";
import { Box, Card, CardMedia, Stack, Typography, useTheme } from "@mui/material";
import Add from "@mui/icons-material/Add";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import Remove from "@mui/icons-material/Remove";
import { Menu_BaseImage, Menu_Images, Menu_IsAvailable, Menu_Price } from "../../../../constants/FieldsName.js";
import { useLang } from "@hooks";
import { normalizeImage } from "./utils/helpers.js";
import CustomerMenuDialog from "./CustomerMenuDialog.jsx";
import { AnimatePresence, motion } from "framer-motion";
import { formatCurrency } from "@utils";
import { IconButton } from "@components";

export const CustomerMenuCard = React.memo(({ item, itemId, onOrder, onQuantityChange, quantity = 0, index = 0 }) => {
	const { getFieldsByLang, t, currentLanguage } = useLang();
	const theme = useTheme();
	const dialogRef = React.useRef(null);
	const name = getFieldsByLang(item, "name") || t("customerMenu.menuItem");
	const description = getFieldsByLang(item, "description") || "";
	const image = normalizeImage(item[Menu_BaseImage] || item[Menu_Images]?.[0]);
	const price = Number(item[Menu_Price] ?? 0);
	const galleryImages = React.useMemo(() => {
		const images = [item[Menu_BaseImage], ...(Array.isArray(item[Menu_Images]) ? item[Menu_Images] : [])];
		return images.filter(Boolean).map(normalizeImage);
	}, [item]);
	const available = item[Menu_IsAvailable] !== false;

	return (
		<AnimatePresence mode="wait">
			<motion.div
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.18, delay: Math.min(index * 0.025, 0.2) }}
				style={{ minWidth: 0, width: "100%" }}
			>
				<Card sx={{ display: "flex", alignItems: "center", gap: 1, p: 1, minWidth: 0, minHeight: theme.tokens.size.menuCardMinHeight, border: "1px solid", borderColor: "divider", borderRadius: `${theme.tokens.radius.card}px`, boxShadow: theme.tokens.shadow.subtle, transition: `box-shadow ${theme.tokens.motion.fast}, transform ${theme.tokens.motion.fast}`, "&:hover": { boxShadow: theme.tokens.shadow.cardHover, transform: "translateY(-1px)" } }}>
					<CardMedia component="img" image={image} alt={name} draggable={false} sx={{ width: theme.tokens.size.menuThumbnail, height: theme.tokens.size.menuThumbnail, flexShrink: 0, borderRadius: `${theme.tokens.radius.control}px`, objectFit: "cover", bgcolor: "action.hover" }} />
					<Box sx={{ flex: 1, minWidth: 0, alignSelf: "stretch", display: "flex", flexDirection: "column", justifyContent: "center" }}>
						<Stack direction="row" spacing={.5} sx={{ minWidth: 0, alignItems: "center" }}>
							<Typography variant="body2" sx={{ fontWeight: 800, minWidth: 0, flex: 1 }} noWrap>{name}</Typography>
							<IconButton aria-label={t("customerMenu.detailsFor", { name })} size="small" onClick={() => dialogRef.current?.open()} sx={{ p: .25, flexShrink: 0 }}><InfoOutlined sx={{ fontSize: 16 }} /></IconButton>
						</Stack>
						<Typography variant="caption" color="text.secondary" sx={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", lineHeight: 1.35 }}>{description}</Typography>
						<Stack direction="row" spacing={.5} sx={{ mt: .5, minWidth: 0, alignItems: "center", justifyContent: "space-between" }}>
							<Typography variant="body1" sx={{ fontWeight: 800, whiteSpace: "nowrap" }}>{formatCurrency(price, currentLanguage)}</Typography>
							{quantity > 0 ? <Stack direction="row" spacing={.25} sx={{ flexShrink: 0, alignItems: "center" }}>
							<IconButton aria-label={t("customerMenu.removeOne", { name })} size="small" onClick={() => onQuantityChange?.(itemId, quantity - 1)} sx={{ width: 27, height: 27, bgcolor: "action.hover" }}><Remove sx={{ fontSize: 16 }} /></IconButton>
								<Typography variant="caption" sx={{ minWidth: 16, textAlign: "center", fontWeight: 700 }}>{quantity}</Typography>
								<IconButton aria-label={t("customerMenu.addOne", { name })} size="small" onClick={() => onOrder?.(item)} sx={{ width: 27, height: 27, bgcolor: "primary.main", color: "primary.contrastText", "&:hover": { bgcolor: "primary.dark" } }}><Add sx={{ fontSize: 16 }} /></IconButton>
							</Stack> : <IconButton aria-label={t("customerMenu.addItem", { name })} size="small" disabled={!available} onClick={() => onOrder?.(item)} sx={{ width: 28, height: 28, flexShrink: 0, color: "primary.main", bgcolor: "action.hover", "&:hover": { bgcolor: "primary.main", color: "primary.contrastText" } }}><Add sx={{ fontSize: 18 }} /></IconButton>}
						</Stack>
					</Box>
				</Card>
				<CustomerMenuDialog ref={dialogRef} item={item} name={name} description={description} galleryImages={galleryImages} />
			</motion.div>
		</AnimatePresence>
	);
});

CustomerMenuCard.displayName = "CustomerMenuCard";
export default CustomerMenuCard;
