import React from "react";
import { Tooltip } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { IconButton } from "@components";

const SettingResetButton = React.memo(({ label, onClick }) => (
	<Tooltip title={label}>
		<IconButton size="small" aria-label={label} onClick={onClick} sx={{ width: 32, height: 32, p: 0, flexShrink: 0, color: "text.secondary" }}>
			<RestartAltIcon fontSize="small" />
		</IconButton>
	</Tooltip>
));

SettingResetButton.displayName = "SettingResetButton";

export default SettingResetButton;
