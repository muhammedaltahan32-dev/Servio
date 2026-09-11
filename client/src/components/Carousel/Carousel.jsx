import React, { useState, useEffect, useRef } from "react";
import { Box, Paper, Typography, MobileStepper, useTheme } from "@mui/material";
import { IconButton } from "../index.js";

const EMPTY_ARRAY = [];

export const Carousel = ({ autoPlay = true, interval = 4000, items = EMPTY_ARRAY, isRtl: isRtlProp, sx }) => {
	const theme = useTheme();

	const isRtl = isRtlProp ?? theme.direction === "rtl";

	const [activeStep, setActiveStep] = useState(0);
	const [dragOffset, setDragOffset] = useState(0);
	const [isSwiping, setIsSwiping] = useState(false);

	const startX = useRef(0);
	const currentX = useRef(0);
	const containerRef = useRef(null);

	const maxSteps = items.length;
	const SWIPE_THRESHOLD = 50;

	const handleNext = React.useCallback(() => {
		setActiveStep((prev) => (prev + 1) % maxSteps);
	}, [maxSteps]);

	const handleBack = () => {
		setActiveStep((prev) => (prev - 1 + maxSteps) % maxSteps);
	};

	const handleTouchStart = (clientX) => {
		startX.current = clientX;
		currentX.current = clientX;
		setIsSwiping(true);
	};

	const handleTouchMove = (clientX) => {
		if (!isSwiping) return;
		currentX.current = clientX;
		const deltaX = currentX.current - startX.current;
		setDragOffset(deltaX);
	};

	const handleTouchEnd = () => {
		if (!isSwiping) return;
		const deltaX = currentX.current - startX.current;

		if (isRtl) {
			if (deltaX > SWIPE_THRESHOLD) {
				handleNext();
			} else if (deltaX < -SWIPE_THRESHOLD) {
				handleBack();
			}
		} else {
			if (deltaX < -SWIPE_THRESHOLD) {
				handleNext();
			} else if (deltaX > SWIPE_THRESHOLD) {
				handleBack();
			}
		}

		setDragOffset(0);
		setIsSwiping(false);
	};

	useEffect(() => {
		if (!autoPlay || isSwiping || maxSteps === 0) return;
		const timer = setInterval(() => {
			handleNext();
		}, interval);

		return () => clearInterval(timer);
	}, [activeStep, autoPlay, interval, isSwiping, handleNext, maxSteps]);

	const stepTranslate = isRtl ? activeStep * 100 : -activeStep * 100;
	const resolvedSX = React.useCallback(
		(theme) => {
			let overrideStyles = sx;
			if (typeof overrideStyles === "function") overrideStyles = overrideStyles(theme);
			return {
				borderRadius: theme.shape.borderRadius + "px",
				position: "relative",
				overflow: "hidden",
				height: 350,
				cursor: isSwiping ? "grabbing" : "grab",
				...overrideStyles,
			};
		},
		[sx, isSwiping],
	);
	return (
		<Box dir={isRtl ? "rtl" : "ltr"} sx={{ maxWidth: 600, flexGrow: 1, margin: "auto", userSelect: "none" }}>
			<Paper
				ref={containerRef}
				elevation={3}
				onTouchStart={(e) => handleTouchStart(e.touches[0].clientX)}
				onTouchMove={(e) => handleTouchMove(e.touches[0].clientX)}
				onTouchEnd={handleTouchEnd}
				onMouseDown={(e) => handleTouchStart(e.clientX)}
				onMouseMove={(e) => handleTouchMove(e.clientX)}
				onMouseUp={handleTouchEnd}
				onMouseLeave={handleTouchEnd}
				sx={resolvedSX}
			>
				<Box
					sx={{
						display: "flex",
						height: "100%",
						width: "100%",
						transition: isSwiping ? "none" : "transform 0.3s ease-out",
						transform: `translateX(calc(${stepTranslate}% + ${dragOffset}px))`,
					}}
				>
					{items.map((item, index) => (
						<Box
							key={index}
							sx={{
								minWidth: "100%",
								height: "100%",
								position: "relative",
								flexShrink: 0,
							}}
						>
							<Box
								component="img"
								draggable={false}
								sx={{
									height: "100%",
									width: "100%",
									objectFit: "cover",
									pointerEvents: "none",
								}}
								src={item.image}
								alt={item.title}
							/>
							<Box
								sx={{
									position: "absolute",
									bottom: 0,
									left: 0,
									right: 0,
									bgcolor: "rgba(0, 0, 0, 0.6)",
									color: "white",
									p: 2,
									textAlign: isRtl ? "right" : "left",
								}}
							>
								<Typography variant="h6">{item.title}</Typography>
								<Typography variant="body2">{item.description}</Typography>
							</Box>
						</Box>
					))}
				</Box>

				<IconButton
					onClick={isRtl ? handleNext : handleBack}
					sx={{
						position: "absolute",
						top: "50%",
						...(isRtl ? { right: 10 } : { left: 10 }),
						transform: "translateY(-50%)",
						color: "primary.contrastText",
						bgcolor: "rgba(0, 0, 0, 0.2)",
						"&:hover": { bgcolor: "rgba(0, 0, 0, 0.4)" },
					}}
					name={"KeyboardArrowLeft"}
				/>

				<IconButton
					onClick={isRtl ? handleBack : handleNext}
					sx={{
						position: "absolute",
						top: "50%",
						...(!isRtl ? { right: 10 } : { left: 10 }),
						color: "primary.contrastText",
						transform: "translateY(-50%)",
						bgcolor: "rgba(0, 0, 0, 0.2)",
						"&:hover": { bgcolor: "rgba(0, 0, 0, 0.4)" },
					}}
					name={"KeyboardArrowRight"}
				/>
			</Paper>

			<MobileStepper
				steps={maxSteps}
				position="static"
				activeStep={activeStep}
				sx={{
					bgcolor: "transparent",
					justifyContent: "center",
					pt: 1,
				}}
			/>
		</Box>
	);
};

export default Carousel;
