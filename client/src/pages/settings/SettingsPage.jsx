import React from "react";
import {
	Alert,
	Box,
	ButtonBase,
	Popover,
	Slider,
	Snackbar,
	Stack,
	Tab,
	Tabs,
	Tooltip,
	Typography,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Button, Checkbox, IconButton, Input, PageContainer } from "@components";
import { useLang } from "@hooks";
import { buildShadowValue, DEFAULT_THEME_SETTINGS, useThemeCustomization } from "../../Provider/themeCustomization.js";

const SECTIONS = [
	{ id: "presets", label: "settings.tabs.presets" },
	{ id: "colors", label: "settings.tabs.colors" },
	{ id: "dimensions", label: "settings.tabs.dimensions" },
	{ id: "shape", label: "settings.tabs.shape" },
	{ id: "effects", label: "settings.tabs.effects" },
	{ id: "typography", label: "settings.tabs.typography" },
];

const COLOR_GROUPS = [
	{ key: "primary", fields: ["main", "light", "dark", "contrastText"] },
	{ key: "secondary", fields: ["main", "light", "dark", "contrastText"] },
	{ key: "success", fields: ["main", "light", "dark", "contrastText"] },
	{ key: "warning", fields: ["main", "light", "dark", "contrastText"] },
	{ key: "error", fields: ["main", "light", "dark", "contrastText"] },
	{ key: "info", fields: ["main", "light", "dark", "contrastText"] },
	{ key: "text", fields: ["primary", "secondary", "disabled"] },
	{ key: "background", fields: ["default", "paper", "appBar"] },
	{ key: "interface", fields: ["divider", "tableRowBorder"] },
	{ key: "tableStatus", fields: ["ready", "Available", "delayed", "preparing", "Needs_Cleaning", "reserved", "new", "occupied", "Occupied"] },
];

const TOKEN_GROUPS = {
	dimensions: [
		{ path: "size", title: "settings.groups.dimensions" },
	],
	shape: [
		{ path: "space", title: "settings.groups.spacing" },
		{ path: "radius", title: "settings.groups.radius" },
	],
	effects: [
		{ path: "gradient", title: "settings.groups.gradients" },
		{ path: "motion", title: "settings.groups.motion" },
		{ path: "effect", title: "settings.groups.effects" },
		{ path: "color", title: "settings.groups.miscColors" },
	],
};

const TYPOGRAPHY_GROUPS = [
	{ key: "global", fields: ["fontFamily"] },
	{ key: "h1", fields: ["fontSize", "fontWeight", "letterSpacing"] },
	{ key: "h2", fields: ["fontSize", "fontWeight", "letterSpacing"] },
	{ key: "h3", fields: ["fontSize", "fontWeight", "letterSpacing"] },
	{ key: "h4", fields: ["fontSize", "fontWeight", "letterSpacing"] },
	{ key: "body1", fields: ["fontSize", "fontWeight"] },
	{ key: "body2", fields: ["fontSize", "fontWeight"] },
	{ key: "button", fields: ["fontWeight", "textTransform"] },
];

const SHADOW_CONTROLS = [
	{ key: "offsetX", min: -24, max: 24, unit: "px" },
	{ key: "offsetY", min: -24, max: 48, unit: "px" },
	{ key: "blur", min: 0, max: 80, unit: "px" },
	{ key: "spread", min: -24, max: 32, unit: "px" },
	{ key: "opacity", min: 0, max: 40, unit: "%" },
];

const deepClone = (value) => JSON.parse(JSON.stringify(value));

const setAtPath = (source, path, value) => {
	const keys = path.split(".");
	const result = { ...source };
	let sourceCursor = source;
	let resultCursor = result;
	for (const key of keys.slice(0, -1)) {
		sourceCursor = sourceCursor?.[key] ?? {};
		resultCursor[key] = { ...sourceCursor };
		resultCursor = resultCursor[key];
	}
	resultCursor[keys[keys.length - 1]] = value;
	return result;
};

const getAtPath = (source, path) => path.split(".").reduce((current, key) => current?.[key], source);

const updateAtPath = (source, path, value) => {
	if (Object.is(getAtPath(source, path), value)) return source;
	const updated = setAtPath(source, path, value);
	if (path !== "presetName") updated.presetName = "custom";
	return updated;
};

const humanize = (value) => value
	.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
	.replace(/[_-]/g, " ")
	.replace(/\b\w/g, (letter) => letter.toUpperCase());

const isColor = (value) => typeof value === "string" && typeof CSS !== "undefined" && CSS.supports("color", value);
const isHexColor = (value) => typeof value === "string" && /^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(value);
const COLOR_SWATCHES = [
	"#111827", "#4B5563", "#9CA3AF", "#E5E7EB", "#FFFFFF",
	"#7F1D1D", "#DC2626", "#F97316", "#EAB308", "#15803D",
	"#0D8A68", "#14B8A6", "#0891B2", "#2563EB", "#1E3A8A",
	"#6D28D9", "#9333EA", "#C026D3", "#DB2777", "#9D174D",
];

const toPickerHex = (value) => {
	if (isHexColor(value)) {
		const hex = value.slice(1);
		return `#${hex.length === 3 ? [...hex].map((character) => character + character).join("") : hex}`;
	}
	const rgb = typeof value === "string" && value.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i);
	if (!rgb) return "#000000";
	return `#${rgb.slice(1).map((channel) => Math.min(255, Number(channel)).toString(16).padStart(2, "0")).join("")}`;
};

const SettingResetButton = React.memo(({ label, onClick }) => (
	<Tooltip title={label}>
		<IconButton size="small" aria-label={label} onClick={onClick} sx={{ width: 32, height: 32, p: 0, flexShrink: 0, color: "text.secondary" }}>
			<RestartAltIcon fontSize="small" />
		</IconButton>
	</Tooltip>
));
SettingResetButton.displayName = "SettingResetButton";

const ColorSelector = ({ value, onChange, label, disabled = false }) => {
	const { t } = useLang();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [pickerDraft, setPickerDraft] = React.useState(null);
	const activePickerDraft = pickerDraft?.baseValue === value ? pickerDraft.color : null;
	const pickerValue = activePickerDraft ?? toPickerHex(value);
	const previewValue = activePickerDraft ?? value;
	const pickerValueRef = React.useRef(toPickerHex(value));
	const commitPickerValue = React.useCallback(() => {
		onChange(pickerValueRef.current);
	}, [onChange]);
	const handlePickerChange = React.useCallback((event) => {
		const nextValue = event.target.value;
		pickerValueRef.current = nextValue;
		setPickerDraft({ baseValue: value, color: nextValue });
		onChange(nextValue);
	}, [onChange, value]);
	const handleSwatchSelect = React.useCallback((swatch) => {
		pickerValueRef.current = swatch;
		setPickerDraft({ baseValue: value, color: swatch });
		onChange(swatch);
		setAnchorEl(null);
	}, [onChange, value]);
	const handleTextColorChange = React.useCallback((event) => {
		const nextValue = event.target.value;
		pickerValueRef.current = toPickerHex(nextValue);
		setPickerDraft({ baseValue: value, color: nextValue });
		onChange(nextValue);
	}, [onChange, value]);
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
				<Box sx={{ width: 26, height: 26, flexShrink: 0, borderRadius: 1, bgcolor: isColor(previewValue) ? previewValue : "transparent", border: "1px solid", borderColor: "divider" }} />
				<Typography variant="body2" noWrap sx={{ minWidth: 0, flex: 1 }}>{previewValue}</Typography>
				<Typography aria-hidden="true" color="text.secondary">▾</Typography>
			</ButtonBase>
			<Popover
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={() => { commitPickerValue(); setAnchorEl(null); }}
				anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
				transformOrigin={{ vertical: "top", horizontal: "left" }}
				slotProps={{ paper: { sx: { width: 280, maxWidth: "calc(100vw - 32px)", p: 2, borderRadius: 2 } } }}
			>
				<Stack spacing={1.5}>
					<Typography variant="subtitle2" fontWeight={700}>{t("settings.chooseColor")}</Typography>
					<Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1 }}>
						{COLOR_SWATCHES.map((swatch) => (
							<ButtonBase
								key={swatch}
								aria-label={`${t("settings.chooseColor")}: ${swatch}`}
								aria-pressed={pickerValue.toLowerCase() === swatch.toLowerCase()}
								onClick={() => handleSwatchSelect(swatch)}
								sx={{ width: 34, height: 34, borderRadius: 1.25, bgcolor: swatch, border: "1px solid", borderColor: "divider", "&:hover": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 1 }, "&[aria-pressed='true']": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 1 } }}
							/>
						))}
					</Box>
					<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
						<Box component="input" type="color" value={pickerValue} aria-label={t("settings.customColor")} onChange={handlePickerChange} onPointerUp={commitPickerValue} onBlur={commitPickerValue} sx={{ width: 42, height: 40, p: 0.25, flexShrink: 0, border: "1px solid", borderColor: "divider", borderRadius: 1.25, bgcolor: "transparent", cursor: "pointer" }} />
						<Input size="small" fullWidth label={t("settings.customColor")} value={previewValue ?? ""} onChange={handleTextColorChange} />
					</Stack>
				</Stack>
			</Popover>
		</>
	);
};

const SettingFieldComponent = ({ value, defaultValue, update, stageUpdate, path, label, resetLabel, colorResetEpoch, color = false, helperText }) => {
	const numeric = typeof value === "number";
	const [pickerResetEpoch, setPickerResetEpoch] = React.useState(0);
	const handleChange = React.useCallback((nextValue) => update(path, nextValue), [path, update]);
	const handleColorChange = React.useCallback((nextValue) => stageUpdate(path, nextValue), [path, stageUpdate]);
	const handleReset = React.useCallback(() => {
		if (color) setPickerResetEpoch((current) => current + 1);
		handleChange(defaultValue);
	}, [color, defaultValue, handleChange]);
	return (
		<Box
			sx={{
				display: "grid",
				gridTemplateColumns: { xs: "1fr", sm: "minmax(150px, 0.8fr) minmax(180px, 1.2fr)" },
				alignItems: "center",
				gap: { xs: 0.75, sm: 2 },
				py: 1.25,
				borderBottom: "1px solid",
				borderColor: "divider",
				"&:last-child": { borderBottom: 0, pb: 0 },
			}}
		>
			<Typography variant="body2" fontWeight={600} color="text.primary">{label}</Typography>
			<Stack direction="row" spacing={0.5} sx={{ alignItems: "center", minWidth: 0 }}>
				{color ? (
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<ColorSelector key={`${colorResetEpoch}-${pickerResetEpoch}`} value={value} onChange={handleColorChange} label={label} />
					</Box>
				) : (
					<Input
						fullWidth
						aria-label={label}
						value={value ?? ""}
						type={numeric ? "number" : "text"}
						onChange={(event) => handleChange(numeric ? (event.target.value === "" ? "" : Number(event.target.value)) : event.target.value)}
						size="small"
						helperText={helperText}
						inputProps={numeric ? { step: "any" } : undefined}
						sx={{ minWidth: 0 }}
					/>
				)}
				<SettingResetButton label={resetLabel} onClick={handleReset} />
			</Stack>
		</Box>
	);
};
const SettingField = React.memo(SettingFieldComponent);
SettingField.displayName = "SettingField";

const SettingsSection = ({ title, children, sx }) => (
	<Box component="section" sx={{ py: 2.5, borderBottom: "1px solid", borderColor: "divider", ...sx }}>
		{title && <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.25 }}>{title}</Typography>}
		{children}
	</Box>
);

const ShadowControlRow = React.memo(({ label, value, min, max, unit, onChange, onReset, resetLabel }) => (
	<Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr) auto 32px", sm: "minmax(130px, 0.8fr) minmax(100px, 1.2fr) 42px 32px" }, gap: 0.75, alignItems: "center", minWidth: 0 }}>
		<Typography variant="body2" color="text.secondary" sx={{ minWidth: 0, overflowWrap: "anywhere" }}>{label}</Typography>
		<Slider size="small" min={min} max={max} step={1} value={value} aria-label={label} onChange={onChange} sx={{ gridColumn: { xs: "1 / -1", sm: "auto" }, gridRow: { xs: 2, sm: "auto" }, minWidth: 0, mx: { xs: 0.5, sm: 0 } }} />
		<Typography variant="caption" textAlign="end" dir="ltr" sx={{ whiteSpace: "nowrap" }}>{value}{unit}</Typography>
		<SettingResetButton label={resetLabel} onClick={onReset} />
	</Box>
));
ShadowControlRow.displayName = "ShadowControlRow";

const ShadowSetting = React.memo(({ name, settings, update, stageUpdate, cardRadius, colorResetEpoch }) => {
	const { t } = useLang();
	const [pickerResetEpoch, setPickerResetEpoch] = React.useState(0);
	const [pickerColorDraft, setPickerColorDraft] = React.useState(null);
	const updateProperty = React.useCallback((property, value) => {
		update(`tokens.shadowControls.${name}.${property}`, value);
	}, [name, update]);
	const updateColor = React.useCallback((value) => {
		stageUpdate(`tokens.shadowControls.${name}.color`, value);
		setPickerColorDraft((current) => current?.baseValue === settings.color && current.color === value
			? current
			: { baseValue: settings.color, color: value });
	}, [name, settings.color, stageUpdate]);
	const resetColor = React.useCallback(() => {
		setPickerColorDraft(null);
		setPickerResetEpoch((current) => current + 1);
		updateProperty("color", DEFAULT_THEME_SETTINGS.tokens.shadowControls[name].color);
	}, [name, updateProperty]);
	const resetThemeTextColor = React.useCallback(() => updateProperty("useThemeTextColor", DEFAULT_THEME_SETTINGS.tokens.shadowControls[name].useThemeTextColor), [name, updateProperty]);
	const controlHandlers = React.useMemo(
		() => new Map(SHADOW_CONTROLS.map(({ key }) => [key, (_, value) => updateProperty(key, value)])),
		[updateProperty],
	);
	const resetHandlers = React.useMemo(
		() => new Map(SHADOW_CONTROLS.map(({ key }) => [key, () => updateProperty(key, DEFAULT_THEME_SETTINGS.tokens.shadowControls[name][key])])),
		[name, updateProperty],
	);
	const resetLabel = t("settings.resetOne");
	const previewColor = pickerColorDraft?.baseValue === settings.color ? pickerColorDraft.color : settings.color;

	return (
		<SettingsSection title={t(`settings.shadowLabels.${name}`)}>
			<Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) minmax(220px, 0.65fr)" }, gap: { xs: 2, md: 4 }, alignItems: "center" }}>
				<Stack spacing={1.25}>
					<Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "minmax(150px, 0.8fr) minmax(180px, 1.2fr)" }, alignItems: "center", gap: { xs: 0.75, sm: 2 }, py: 1.25, borderBottom: "1px solid", borderColor: "divider" }}>
						<Typography variant="body2" fontWeight={600}>{t("settings.fields.shadowColor")}</Typography>
						<Stack direction="row" spacing={0.5} sx={{ alignItems: "center", minWidth: 0 }}>
							<Box sx={{ flex: 1, minWidth: 0 }}>
								<ColorSelector key={`${colorResetEpoch}-${pickerResetEpoch}`} value={settings.color} label={t("settings.fields.shadowColor")} disabled={settings.useThemeTextColor} onChange={updateColor} />
							</Box>
							<SettingResetButton label={resetLabel} onClick={resetColor} />
						</Stack>
					</Box>
					<Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
						<Checkbox
							size="small"
							checked={settings.useThemeTextColor}
							onChange={(event) => updateProperty("useThemeTextColor", event.target.checked)}
							label={t("settings.matchThemeTextColor")}
							formControlLabelSx={{ m: 0, "& .MuiFormControlLabel-label": { fontSize: "0.875rem", color: "text.secondary" } }}
						/>
						<SettingResetButton label={resetLabel} onClick={resetThemeTextColor} />
					</Stack>
					{SHADOW_CONTROLS.map(({ key, min, max, unit }) => (
						<ShadowControlRow
							key={key}
							label={t(`settings.fields.${key}`)}
							value={settings[key]}
							min={min}
							max={max}
							unit={unit}
							onChange={controlHandlers.get(key)}
							onReset={resetHandlers.get(key)}
							resetLabel={resetLabel}
						/>
					))}
				</Stack>
				<Box sx={{ minHeight: 168, p: 2, display: "grid", placeItems: "center", border: "1px dashed", borderColor: "divider", borderRadius: 2 }}>
					<Box sx={{ width: "min(100%, 240px)", minHeight: 112, p: 2, display: "grid", placeItems: "center", bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: `${cardRadius}px`, boxShadow: buildShadowValue({ ...settings, color: previewColor }), textAlign: "center" }}>
						<Typography variant="body2" color="text.secondary">{t("settings.shadowPreview")}</Typography>
					</Box>
				</Box>
			</Box>
		</SettingsSection>
	);
});
ShadowSetting.displayName = "ShadowSetting";

export const SettingsPage = () => {
	const { t } = useLang();
	const { themeSettings, saveThemeSettings, resetThemeSettings, themePresets } = useThemeCustomization();
	const [draft, setDraft] = React.useState(() => deepClone(themeSettings));
	const draftRef = React.useRef(draft);
	const [section, setSection] = React.useState("presets");
	const [scheme, setScheme] = React.useState("light");
	const [notice, setNotice] = React.useState("");
	const [colorResetEpoch, setColorResetEpoch] = React.useState(0);

	const update = React.useCallback((path, value) => {
		const updated = updateAtPath(draftRef.current, path, value);
		if (updated === draftRef.current) return;
		draftRef.current = updated;
		setDraft(updated);
	}, []);
	const stageColorUpdate = React.useCallback((path, value) => {
		draftRef.current = updateAtPath(draftRef.current, path, value);
	}, []);
	const resetOneLabel = t("settings.resetOne");

	const selectPreset = React.useCallback((name) => {
		const nextDraft = deepClone(themePresets[name]);
		draftRef.current = nextDraft;
		setDraft(nextDraft);
		setColorResetEpoch((current) => current + 1);
	}, [themePresets]);
	const selectDefaultPreset = React.useCallback(() => selectPreset("default"), [selectPreset]);
	const handleSectionChange = React.useCallback((_, nextSection) => {
		setDraft(draftRef.current);
		setSection(nextSection);
	}, []);
	const handleSchemeChange = React.useCallback((_, nextScheme) => {
		setDraft(draftRef.current);
		setScheme(nextScheme);
	}, []);
	const save = () => {
		const currentDraft = draftRef.current;
		setDraft(currentDraft);
		saveThemeSettings(currentDraft);
		setNotice(t("settings.saved"));
	};
	const reset = () => {
		const defaults = resetThemeSettings();
		const nextDraft = deepClone(defaults);
		draftRef.current = nextDraft;
		setDraft(nextDraft);
		setColorResetEpoch((current) => current + 1);
		setNotice(t("settings.resetDone"));
	};
	const cancel = () => {
		const nextDraft = deepClone(themeSettings);
		draftRef.current = nextDraft;
		setDraft(nextDraft);
		setColorResetEpoch((current) => current + 1);
	};

	const renderFields = (object, prefix, { colors = false } = {}) => (
		<Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 0 }}>
			{Object.entries(object).map(([key, value]) => {
				const path = `${prefix}.${key}`;
				const label = t(`settings.fields.${key}`, { defaultValue: humanize(key) });
				return (
					<SettingField
						key={path}
						label={label}
						value={value}
						defaultValue={getAtPath(DEFAULT_THEME_SETTINGS, path)}
						update={update}
						stageUpdate={stageColorUpdate}
						path={path}
						resetLabel={resetOneLabel}
						colorResetEpoch={colorResetEpoch}
						color={colors}
					/>
				);
			})}
		</Box>
	);

	const renderShadowSettings = () => (
		<Box>
			{Object.entries(draft.tokens.shadowControls).map(([name, settings]) => (
				<ShadowSetting key={`${name}-${colorResetEpoch}`} name={name} settings={settings} update={update} stageUpdate={stageColorUpdate} cardRadius={draft.tokens.radius.card} colorResetEpoch={colorResetEpoch} />
			))}
		</Box>
	);

	const activeSection = SECTIONS.find((item) => item.id === section);

	return (
		<PageContainer
			sx={(theme) => ({
				gap: 2.25,
				height: "auto",
				minHeight: `calc(100dvh - ${theme.tokens.size.appBarHeight}px)`,
				width: "100%",
				minWidth: 0,
				overflowX: "clip",
				overflowY: "visible",
				flex: "none",
				pb: 3,
			})}
		>
			<Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between", flexShrink: 0 }}>
				<Box>
					<Typography variant="h4" fontWeight={700} sx={{ letterSpacing: "-0.025em" }}>{t("settings.title")}</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{t("settings.subtitle")}</Typography>
				</Box>
			</Stack>

			<Box component="section" sx={{ width: "100%", minWidth: 0, overflowX: "clip" }}>
				<Tabs
					value={section}
					onChange={handleSectionChange}
					variant="scrollable"
					scrollButtons="auto"
					allowScrollButtonsMobile
					sx={{
						width: "100%",
						maxWidth: "100%",
						minWidth: 0,
						px: { xs: 1, sm: 2 },
						minHeight: 58,
						borderBottom: 1,
						borderColor: "divider",
						"& .MuiTabs-indicator": { display: "none" },
						"& .MuiTab-root": { minHeight: 38, minWidth: "auto", px: 1.5, py: 0.75, mr: 0.5, borderRadius: 1.5, textTransform: "none", fontWeight: 500, color: "text.secondary" },
						"& .MuiTab-root.Mui-selected": { color: "primary.main", fontWeight: 700 },
					}}
				>
					{SECTIONS.map((item) => <Tab key={item.id} value={item.id} label={t(item.label)} />)}
				</Tabs>
				<Box
					sx={{
						p: { xs: 2, sm: 3 },
						width: "100%",
						maxWidth: "100%",
						minWidth: 0,
					}}
				>
					<Stack spacing={0.5} sx={{ mb: 2.5 }}>
						<Typography variant="h6" fontWeight={700}>{t(activeSection?.label ?? "settings.title")}</Typography>
						<Typography variant="body2" color="text.secondary">{t(`settings.tabDescriptions.${section}`)}</Typography>
					</Stack>
					{section === "presets" && (
						<Stack spacing={0}>
							<Stack direction="row" spacing={1} sx={{ pb: 2, alignItems: "center", justifyContent: "space-between", minWidth: 0 }}>
								<Typography variant="body2" color="text.secondary" sx={{ minWidth: 0, flex: 1, overflowWrap: "anywhere" }}>{t("settings.presetsDescription")}</Typography>
								<SettingResetButton label={t("settings.resetPreset")} onClick={selectDefaultPreset} />
							</Stack>
							<Box>
								{Object.entries(themePresets).map(([name, preset]) => {
									const selected = draft.presetName === name;
									return (
										<ButtonBase
											key={name}
											component="button"
											onClick={() => selectPreset(name)}
											aria-pressed={selected}
											sx={{
												width: "100%",
												py: 1.75,
												px: 1,
												borderBottom: "1px solid",
												borderColor: selected ? "primary.main" : "divider",
												textAlign: "start",
												justifyContent: "space-between",
												flexWrap: { xs: "wrap", sm: "nowrap" },
												gap: 2,
												"&:hover": { color: "primary.main" },
											}}
										>
											<Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", flex: { xs: "1 1 100%", sm: "1 1 auto" }, minWidth: 0 }}>
											<Typography fontWeight={700} sx={{ minWidth: 0, overflowWrap: "anywhere" }}>{t(`settings.presets.${name}`)}</Typography>
													{selected && <Typography variant="caption" color="primary.main" fontWeight={700}>{t("settings.selected")}</Typography>}
												</Stack>
										<Stack direction="row" spacing={1} sx={{ maxWidth: "100%", flexWrap: "wrap", justifyContent: "flex-end" }}>
													{[preset.colors.light.primary.main, preset.colors.light.secondary.main, preset.colors.dark.primary.main, preset.colors.dark.background.paper].map((color, index) => (
														<Box key={`${name}-${index}`} sx={{ width: 42, height: 30, borderRadius: 1.5, bgcolor: color, border: "1px solid", borderColor: "divider" }} />
													))}
												</Stack>
										</ButtonBase>
									);
								})}
							</Box>
							<Typography variant="caption" color="text.secondary" sx={{ display: "block", pt: 2 }}>{t("settings.presetHint")}</Typography>
						</Stack>
					)}

					{section === "colors" && (
						<Stack spacing={2}>
							<Tabs
								value={scheme}
								onChange={handleSchemeChange}
								sx={{
									minHeight: 40,
									"& .MuiTabs-indicator": { height: 2, borderRadius: 2 },
									"& .MuiTab-root": { minHeight: 40, minWidth: 90, px: 1.5, textTransform: "none", fontWeight: 600 },
								}}
							>
								<Tab value="light" label={t("settings.lightMode")} />
								<Tab value="dark" label={t("settings.darkMode")} />
							</Tabs>
							<Box sx={{ display: "flex", flexDirection: "column" }}>
								{COLOR_GROUPS.map(({ key, fields }) => {
									const values = key === "interface"
										? { divider: draft.colors[scheme].divider, tableRowBorder: draft.colors[scheme].tableRowBorder }
										: draft.colors[scheme][key];
									const prefix = key === "interface" ? `colors.${scheme}` : `colors.${scheme}.${key}`;
									const selectedValues = Object.fromEntries(fields.map((field) => [field, values[field]]));
									return (
										<SettingsSection key={key} title={t(`settings.palette.${key}`)}>
											{renderFields(selectedValues, prefix, { colors: true })}
										</SettingsSection>
									);
								})}
							</Box>
						</Stack>
					)}

					{section === "effects" && renderShadowSettings()}

					{TOKEN_GROUPS[section] && (
						<Box sx={{ display: "flex", flexDirection: "column" }}>
							{TOKEN_GROUPS[section].map(({ path, title: titleKey }) => (
								<SettingsSection key={path} title={t(titleKey)}>
									{renderFields(draft.tokens[path], `tokens.${path}`)}
								</SettingsSection>
							))}
						</Box>
					)}

					{section === "typography" && (
						<Box sx={{ display: "flex", flexDirection: "column" }}>
							{TYPOGRAPHY_GROUPS.map(({ key, fields }) => {
								const values = key === "global" ? { fontFamily: draft.typography.fontFamily } : draft.typography[key];
								const prefix = key === "global" ? "typography" : `typography.${key}`;
								return <SettingsSection key={key} title={key === "global" ? t("settings.groups.globalTypography") : t(`settings.typography.${key}`)}>{renderFields(Object.fromEntries(fields.map((field) => [field, values[field]])), prefix)}</SettingsSection>;
							})}
						</Box>
					)}
				</Box>
				<Box
						sx={{
							display: "flex",
							flexDirection: { xs: "column", sm: "row" },
							alignItems: { xs: "stretch", sm: "center" },
							justifyContent: "space-between",
							gap: 1.5,
							flexShrink: 0,
							px: { xs: 2, sm: 3 },
							py: 1.75,
							borderTop: "1px solid",
							borderColor: "divider",
						}}
					>
						<Button variant="text" color="inherit" onClick={reset} sx={{ alignSelf: { xs: "flex-start", sm: "auto" } }}>{t("settings.reset")}</Button>
						<Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", flexWrap: "wrap", maxWidth: "100%" }}>
							<Button variant="outlined" color="inherit" onClick={cancel} sx={{ minWidth: { xs: 0, sm: 64 } }}>{t("settings.cancel")}</Button>
							<Button variant="contained" onClick={save} sx={{ minWidth: { xs: 0, sm: 64 } }}>{t("settings.save")}</Button>
						</Stack>
				</Box>
			</Box>
			<Snackbar open={Boolean(notice)} autoHideDuration={3000} onClose={() => setNotice("")} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
				<Alert severity="success" variant="filled" onClose={() => setNotice("")}>{notice}</Alert>
			</Snackbar>
		</PageContainer>
	);
};

export default SettingsPage;
