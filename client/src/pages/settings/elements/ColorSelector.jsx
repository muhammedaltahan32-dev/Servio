import React from "react";
import { Box, ButtonBase, Popover, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { Icon, Input } from "@components";
import { useLang } from "@hooks";
import { COLOR_SWATCHES } from "../constants.js";
import { isColor, toPickerHex } from "../utils/index.js";

const ColorSelector = ({ value, onChange, label, disabled = false }) => {
	const { t } = useLang();
	const theme = useTheme();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [pickerDraft, setPickerDraft] = React.useState(null);
	const activePickerDraft = pickerDraft?.baseValue === value ? pickerDraft.color : null;
	const pickerValue = activePickerDraft ?? toPickerHex(value);
	const previewValue = activePickerDraft ?? value;
	const pickerValueRef = React.useRef(toPickerHex(value));
	const commitPickerValue = React.useCallback(() => {
		onChange(pickerValueRef.current);
	}, [onChange]);
	const handlePickerChange = React.useCallback(
		(event) => {
			const nextValue = event.target.value;
			pickerValueRef.current = nextValue;
			setPickerDraft({ baseValue: value, color: nextValue });
			onChange(nextValue);
		},
		[onChange, value],
	);
	const handleSwatchSelect = React.useCallback(
		(swatch) => {
			pickerValueRef.current = swatch;
			setPickerDraft({ baseValue: value, color: swatch });
			onChange(swatch);
			setAnchorEl(null);
		},
		[onChange, value],
	);
	const handleTextColorChange = React.useCallback(
		(event) => {
			const nextValue = event.target.value;
			pickerValueRef.current = toPickerHex(nextValue);
			setPickerDraft({ baseValue: value, color: nextValue });
			onChange(nextValue);
		},
		[onChange, value],
	);
	React.useEffect(() => {
		pickerValueRef.current = toPickerHex(value);
	}, [value]);

	return (
		<>
			<ButtonBase
				disabled={disabled}
				aria-label={`${label}: ${previewValue}`}
				aria-haspopup="dialog"
				aria-expanded={Boolean(anchorEl)}
				onClick={(event) => setAnchorEl(event.currentTarget)}
				sx={{
					display: "flex",
					justifyContent: "flex-start",
					gap: 1,
					px: 1,
					width: "100%",
					minWidth: 0,
					minHeight: 42,
					border: "1px solid",
					borderColor: "divider",
					borderRadius: 1.5,
					textAlign: "start",
					"&:hover": { borderColor: "text.secondary", bgcolor: "action.hover" },
				}}
			>
				<Box
					sx={{
						width: 26,
						height: 26,
						flexShrink: 0,
						borderRadius: 1,
						bgcolor: isColor(previewValue) ? previewValue : "transparent",
						border: "1px solid",
						borderColor: "divider",
					}}
				/>
				<Typography variant="body2" noWrap sx={{ minWidth: 0, flex: 1 }}>
					{previewValue}
				</Typography>
				<Icon name="ExpandMore" color="var(--mui-palette-text-secondary)" />
			</ButtonBase>
			<Popover
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={() => {
					commitPickerValue();
					setAnchorEl(null);
				}}
				anchorOrigin={{ vertical: "bottom", horizontal: theme.direction === "rtl" ? "right" : "left" }}
				transformOrigin={{ vertical: "top", horizontal: theme.direction === "rtl" ? "right" : "left" }}
				slotProps={{
					paper: { sx: { width: 280, maxWidth: "calc(100vw - 32px)", p: 2, borderRadius: 2 } },
				}}
			>
				<Stack spacing={1.5}>
					<Typography variant="subtitle2" fontWeight={700}>
						{t("settings.chooseColor")}
					</Typography>
					<Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1 }}>
						{COLOR_SWATCHES.map((swatch) => {
							const selected = pickerValue.toLowerCase() === swatch.toLowerCase();
							return (
								<Tooltip key={swatch} title={swatch}>
									<ButtonBase
									aria-label={`${t("settings.chooseColor")}: ${swatch}`}
									aria-pressed={selected}
									onClick={() => handleSwatchSelect(swatch)}
									sx={{
										width: 38,
										height: 38,
										borderRadius: 1.5,
										bgcolor: swatch,
										border: "1px solid",
										borderColor: "divider",
										transition: "transform 140ms ease, outline-color 140ms ease",
										"&:hover": { transform: "scale(1.08)", outline: "2px solid", outlineColor: "primary.main", outlineOffset: 1 },
										"&[aria-pressed='true']": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 1 },
									}}
								>
									{selected && <Icon name="CheckRounded" color="#fff" sx={{ fontSize: 20, filter: "drop-shadow(0 1px 2px #000)" }} />}
								</ButtonBase>
								</Tooltip>
							);
						})}
					</Box>
					<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
						<Box
							component="input"
							type="color"
							value={pickerValue}
							aria-label={t("settings.customColor")}
							onChange={handlePickerChange}
							onPointerUp={commitPickerValue}
							onBlur={commitPickerValue}
							sx={{
								width: 42,
								height: 40,
								p: 0.25,
								flexShrink: 0,
								border: "1px solid",
								borderColor: "divider",
								borderRadius: 1.25,
								bgcolor: "transparent",
								cursor: "pointer",
								"&::-webkit-color-swatch-wrapper": { p: 0 },
								"&::-webkit-color-swatch": { border: 0, borderRadius: 0.75 },
								"&::-moz-color-swatch": { border: 0, borderRadius: 0.75 },
							}}
						/>
						<Input
							size="small"
							fullWidth
							label={t("settings.customColor")}
							value={previewValue ?? ""}
							onChange={handleTextColorChange}
						/>
					</Stack>
				</Stack>
			</Popover>
		</>
	);
};

export default ColorSelector;

