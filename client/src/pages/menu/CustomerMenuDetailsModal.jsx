import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Typography, Paper, IconButton, Chip, Stack, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TakeoutDiningOutlinedIcon from "@mui/icons-material/TakeoutDiningOutlined";
import { Cat_ID, Menu_BaseImage, Menu_Images, Menu_IsAvailable, Menu_Price } from "../../../../constants/FieldsName.js";
import { useLang } from "@hooks";
import { normalizeImageUrl } from "@utils";
import { Button } from "@components";

export const CustomerMenuDetailsModal = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { getFieldsByLang, t } = useLang();

	// Find selected item from Redux store using URL id
	const categories = useSelector((state) => state.categories?.items ?? []);
	const menuItems = React.useMemo(
		() => categories.filter((category) => category && category[Cat_ID] !== undefined && category[Cat_ID] !== null),
		[categories],
	);
	const item = React.useMemo(() => menuItems.find((m) => String(m.id) === String(id)), [menuItems, id]);

	const handleClose = () => {
		navigate("/customer-menu"); // Triggers scale-down exit motion
	};

	if (!item) return null;

	const image = normalizeImageUrl(item[Menu_BaseImage] || item[Menu_Images]?.[0] || "");
	const price = Number(item[Menu_Price] ?? 0);
	const name = getFieldsByLang(item, "name");
	const description = getFieldsByLang(item, "description");

	return (
		<Paper
			elevation={24}
			sx={{
				borderRadius: 4,
				overflow: "hidden",
				backgroundColor: "background.paper",
				position: "relative",
			}}
		>
		
		</Paper>
	);
};
export default CustomerMenuDetailsModal;
