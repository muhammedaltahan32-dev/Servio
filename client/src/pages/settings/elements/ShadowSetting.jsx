import React from "react";
import { Box, Slider, Stack, Typography } from "@mui/material";
import { Checkbox } from "@components";
import { useLang } from "@hooks";
import { buildShadowValue, DEFAULT_THEME_SETTINGS } from "../../../Provider/themeCustomization.js";
import { SHADOW_CONTROLS } from "../constants.js";
import ColorSelector from "./ColorSelector.jsx";
import SettingResetButton from "./SettingResetButton.jsx";
import SettingsSection from "./SettingsSection.jsx";

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

export default ShadowSetting;
