import React, { useState, useRef } from "react";
import { Box, Button, Card, CardMedia, CircularProgress, Stack, Tooltip, Typography } from "@mui/material";
import { FavoriteBorder } from "@mui/icons-material";
import { useLang } from "@hooks";
import { Icon, IconButton } from "@components";

export const PhotoAlbumGallery = ({
	images = [],
	baseImage = null,
	onUpload,
	onBaseImageChange,
	viewOnly = false,
	loading = false,
	title,
	emptyText,
	accept = "image/*",
	onDeleteImage,
}) => {
	const { t } = useLang();
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef(null);

	const displayTitle = title ?? t("components.dropzone.title");
	const displayEmptyText = emptyText ?? t("components.dropzone.emptyText");

	const [imageCache, setImageCache] = useState(new Map());

	const processFiles = async (filesArray) => {
		if (!filesArray.length) return;

		const readFileAsBase64 = (file) => {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve({ file, dataUrl: reader.result });
				reader.onerror = (error) => reject(error);
				reader.readAsDataURL(file);
			});
		};

		try {
			const readResults = await Promise.all(filesArray.map(readFileAsBase64));

			setImageCache((prevCache) => {
				const nextCache = new Map(prevCache);
				readResults.forEach(({ file, dataUrl }) => {
					const fileKey = file.name;
					if (!prevCache.has(fileKey)) {
						nextCache.set(fileKey, dataUrl);
					}
				});
				return nextCache;
			});

			if (onUpload) {
				await onUpload(readResults);
			}
		} catch (error) {
			console.error("Error reading image files:", error);
		}
	};
	const handleFileInputChange = async (event) => {
		const files = Array.from(event.target.files || []);
		await processFiles(files);
		event.target.value = "";
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (!viewOnly && !loading) {
			setIsDragging(true);
		}
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		if (viewOnly || loading) return;

		const files = Array.from(e.dataTransfer.files || []).filter((file) => file.type.startsWith("image/"));

		await processFiles(files);
	};
	return (
		<Box
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			sx={{
				position: "relative",
				borderRadius: 2,
				transition: "all 0.2s ease-in-out",
				...(isDragging && {
					outline: (theme) => `2px dashed ${theme.palette.primary.main}`,
					outlineOffset: "4px",
					bgcolor: (theme) =>
						theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(25, 118, 210, 0.04)",
				}),
			}}
		>
			<Stack direction="row" sx={{ mb: 1.5, alignItems: "center", justifyContent: "space-between" }}>
				<Typography variant="subtitle1" fontWeight={600}>
					{displayTitle}
				</Typography>

				{!viewOnly && (
					<Button
						variant="outlined"
						size="small"
						startIcon={loading ? <CircularProgress color="inherit" size={16} /> : <Icon name="CloudUploadOutlined" />}
						disabled={loading}
						onClick={() => fileInputRef.current?.click()}
					>
						{t("components.dropzone.upload")}
					</Button>
				)}
			</Stack>

			{!viewOnly && (
				<input
					ref={fileInputRef}
					type="file"
					accept={accept}
					multiple
					tabIndex={-1}
					hidden
					onChange={handleFileInputChange}
				/>
			)}

			{/* Gallery Grid */}
			{/* images.length > 0 ?  */}
			{images.length > 0 ? (
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(135px, 1fr))",
						gap: 1.5,
					}}
				>
					{images.map((image, index) => {
						const { name: imageUrl } = typeof image === "string" ? { name: image } : image;
						const isBaseImage = baseImage === imageUrl;
						const normalizedImageUrl = imageCache.get(imageUrl) ?? imageUrl;
						return (
							<Card
								key={`${normalizedImageUrl}-${index}`}
								sx={{
									position: "relative",
									overflow: "hidden",
									borderRadius: 2,
									border: "2px solid",
									borderColor: isBaseImage ? "primary.main" : "divider",
									bgcolor: "background.paper",
									transition: "border-color 200ms ease, box-shadow 200ms ease",
								}}
							>
								<CardMedia
									component="img"
									image={normalizedImageUrl}
									alt={t("components.dropzone.imageAlt", { number: index + 1 })}
									sx={{ width: "100%", height: 130, objectFit: "cover" }}
								/>

								{!viewOnly && (
									<Box
										sx={{
											position: "absolute",
											top: 8,
											right: 8,
											display: "flex",
											gap: "0.3rem",
										}}
									>
										<Tooltip title={t("components.dropzone.tooltips.setAsBase")} placement="top" arrow>
											<IconButton
												onClick={(event) => {
													event.stopPropagation();
													if (onBaseImageChange) onBaseImageChange(imageUrl);
												}}
												sx={{
													color: isBaseImage ? "primary.main" : "#fff",
													backgroundColor: "rgba(0, 0, 0, 0.50)",
													"&:hover": { bgcolor: "primary.main", color: "#fff" },
												}}
												name={isBaseImage ? "Favorite" : "FavoriteBorder"}
												fontSize="small"
											/>
										</Tooltip>
										<Tooltip title={t("components.dropzone.tooltips.deleteSelected")} placement="top" arrow>
											<IconButton
												onClick={(event) => {
													event.stopPropagation();
													// setImageCache((prevCache) => new Map(prevCache).delete(imageUrl));
													onDeleteImage?.(imageUrl);
												}}
												sx={{
													backgroundColor: "rgba(0, 0, 0, 0.50)",
													"&:hover": { bgcolor: "primary.main" },
													color: "#fff",
												}}
												name={"DeleteOutlined"}
												fontSize="small"
											/>
										</Tooltip>
									</Box>
								)}

								{isBaseImage && (
									<Box
										sx={{
											position: "absolute",
											left: 8,
											bottom: 8,
											px: 1,
											py: 0.5,
											borderRadius: 1,
											bgcolor: "primary.main",
											color: "primary.contrastText",
											fontSize: 11,
											fontWeight: 700,
											lineHeight: 1.2,
										}}
									>
										{t("components.dropzone.base")}
									</Box>
								)}
							</Card>
						);
					})}
				</Box>
			) : (
				<Box
					onClick={() => !viewOnly && !loading && fileInputRef.current?.click()}
					sx={{
						border: "2px dashed",
						borderColor: isDragging ? "primary.main" : "divider",
						borderRadius: 2,
						px: 2,
						py: 4,
						textAlign: "center",
						bgcolor: isDragging ? "action.hover" : "rgba(0, 0, 0, 0.02)",
						cursor: viewOnly ? "default" : "pointer",
						transition: "border-color 0.2s ease, background-color 0.2s ease",
						userSelect: "none",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: 1,
						"&:hover": {
							borderColor: viewOnly ? "divider" : "primary.main",
							bgcolor: viewOnly ? "rgba(0, 0, 0, 0.02)" : "action.hover",
						},
					}}
				>
					{!viewOnly && <Icon name="CloudUploadOutlined" sx={{ fontSize: 36, color: "text.secondary" }} />}
					<Typography color="text.secondary" variant="body2">
						{displayEmptyText}
					</Typography>
				</Box>
			)}
		</Box>
	);
};

export default PhotoAlbumGallery;
