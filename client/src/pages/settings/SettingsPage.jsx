import React from "react";
import { Alert, Box, Snackbar, Stack, Tab, Tabs, Typography, Button as ButtonBase } from "@mui/material";
import { Button, PageContainer } from "@components";
import { useLang } from "@hooks";
import { DEFAULT_THEME_SETTINGS, useThemeCustomization } from "../../Provider/themeCustomization.js";
import { COLOR_GROUPS, SECTIONS, SIZE_SLIDER_CONTROLS, TOKEN_GROUPS, TYPOGRAPHY_GROUPS } from "./constants.js";
import { deepClone, getAtPath, humanize, updateAtPath } from "./utils/index.js";
import { SettingField, SettingResetButton, SettingsSection, ShadowSetting } from "./elements/index.js";

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

	const selectPreset = React.useCallback(
		(name) => {
			const nextDraft = deepClone(themePresets[name]);
			draftRef.current = nextDraft;
			setDraft(nextDraft);
			setColorResetEpoch((current) => current + 1);
		},
		[themePresets],
	);
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
				const sizeControl = prefix === "tokens.size" ? SIZE_SLIDER_CONTROLS[key] : undefined;
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
						sizeControl={sizeControl}
					/>
				);
			})}
		</Box>
	);

	const renderShadowSettings = () => (
		<Box>
			{Object.entries(draft.tokens.shadowControls).map(([name, settings]) => (
				<ShadowSetting
					key={`${name}-${colorResetEpoch}`}
					name={name}
					settings={settings}
					update={update}
					stageUpdate={stageColorUpdate}
					cardRadius={draft.tokens.radius.card}
					colorResetEpoch={colorResetEpoch}
				/>
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
			<Stack
				direction={{ xs: "column", sm: "row" }}
				spacing={1}
				sx={{ alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between", flexShrink: 0 }}
			>
				<Box>
					<Typography variant="h4" fontWeight={700} sx={{ letterSpacing: "-0.025em" }}>
						{t("settings.title")}
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
						{t("settings.subtitle")}
					</Typography>
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
						"& .MuiTab-root": {
							minHeight: 38,
							minWidth: "auto",
							px: 1.5,
							py: 0.75,
							mr: 0.5,
							borderRadius: 1.5,
							textTransform: "none",
							fontWeight: 500,
							color: "text.secondary",
						},
						"& .MuiTab-root.Mui-selected": { color: "primary.main", fontWeight: 700 },
					}}
				>
					{SECTIONS.map((item) => (
						<Tab key={item.id} value={item.id} label={t(item.label)} />
					))}
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
						<Typography variant="h6" fontWeight={700}>
							{t(activeSection?.label ?? "settings.title")}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{t(`settings.tabDescriptions.${section}`)}
						</Typography>
					</Stack>
					{section === "presets" && (
						<Stack spacing={0}>
							<Stack
								direction="row"
								spacing={1}
								sx={{ pb: 2, alignItems: "center", justifyContent: "space-between", minWidth: 0 }}
							>
								<Typography
									variant="body2"
									color="text.secondary"
									sx={{ minWidth: 0, flex: 1, overflowWrap: "anywhere" }}
								>
									{t("settings.presetsDescription")}
								</Typography>
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
											<Stack
												direction="row"
												sx={{
													justifyContent: "space-between",
													alignItems: "center",
													flex: { xs: "1 1 100%", sm: "1 1 auto" },
													minWidth: 0,
												}}
											>
												<Typography fontWeight={700} sx={{ minWidth: 0, overflowWrap: "anywhere" }}>
													{t(`settings.presets.${name}`)}
												</Typography>
												{selected && (
													<Typography variant="caption" color="primary.main" fontWeight={700}>
														{t("settings.selected")}
													</Typography>
												)}
											</Stack>
											<Stack
												direction="row"
												spacing={1}
												sx={{ maxWidth: "100%", flexWrap: "wrap", justifyContent: "flex-end" }}
											>
												{[
													preset.colors.light.primary.main,
													preset.colors.light.secondary.main,
													preset.colors.dark.primary.main,
													preset.colors.dark.background.paper,
												].map((color, index) => (
													<Box
														key={`${name}-${index}`}
														sx={{
															width: 42,
															height: 30,
															borderRadius: 1.5,
															bgcolor: color,
															border: "1px solid",
															borderColor: "divider",
														}}
													/>
												))}
											</Stack>
										</ButtonBase>
									);
								})}
							</Box>
							<Typography variant="caption" color="text.secondary" sx={{ display: "block", pt: 2 }}>
								{t("settings.presetHint")}
							</Typography>
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
									const values =
										key === "interface"
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
								return (
									<SettingsSection
										key={key}
										title={key === "global" ? t("settings.groups.globalTypography") : t(`settings.typography.${key}`)}
									>
										{renderFields(Object.fromEntries(fields.map((field) => [field, values[field]])), prefix)}
									</SettingsSection>
								);
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
					<Button variant="text" color="inherit" onClick={reset} sx={{ alignSelf: { xs: "flex-start", sm: "auto" } }}>
						{t("settings.reset")}
					</Button>
					<Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", flexWrap: "wrap", maxWidth: "100%" }}>
						<Button variant="outlined" color="inherit" onClick={cancel} sx={{ minWidth: { xs: 0, sm: 64 } }}>
							{t("settings.cancel")}
						</Button>
						<Button variant="contained" onClick={save} sx={{ minWidth: { xs: 0, sm: 64 } }}>
							{t("settings.save")}
						</Button>
					</Stack>
				</Box>
			</Box>
			<Snackbar
				open={Boolean(notice)}
				autoHideDuration={3000}
				onClose={() => setNotice("")}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert severity="success" variant="filled" onClose={() => setNotice("")}>
					{notice}
				</Alert>
			</Snackbar>
		</PageContainer>
	);
};

export default SettingsPage;

