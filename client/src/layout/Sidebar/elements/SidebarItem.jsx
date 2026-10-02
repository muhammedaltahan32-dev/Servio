import { Icon } from "@components";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { useLang } from "@hooks";

const EMPTY_OBJECT = {};

const SidebarItemIcon = React.memo(({ icon, active }) => {
	const theme = useTheme();

	if (!icon) return null;
	return (
		<ListItemIcon
			sx={{
				minWidth: 40,
				width: "auto",
				flexShrink: 0,
				color: active
					? "primary.main"
					: `color-mix(in srgb, var(--mui-palette-primary-main) 68%, ${theme.tokens.color.sidebarMuted})`,

				[theme.breakpoints.up("md")]: {
					minWidth: 40,
					width: 40,

					height: 24,

					display: "flex",
					alignItems: "center",
						justifyContent: "flex-start",

					flexShrink: 0,

					m: 0,
				},
			}}
		>
			{typeof icon === "string" ? (
				<Icon name={icon} />
			) : (
				icon
			)}
		</ListItemIcon>
	);
});

SidebarItemIcon.displayName = "SidebarItemIcon";

const SidebarItemComponent = React.forwardRef(
		({ label, icon, onClick, children, sx = EMPTY_OBJECT, active, showTitle = true, ...props }, ref) => {
		const theme = useTheme();
		const { t } = useLang();
		const translatedLabel = label ? t(label) : "";
		const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
		const elRef = React.useRef(null);
		const itemStyles = React.useCallback(
			(theme) => {
				let overrideSX = sx;

				if (typeof overrideSX === "function") {
					overrideSX = overrideSX(theme);
				}

				return {
					width: "100%",
					minWidth: 0,
					minHeight: 48,
					borderRadius: theme.shape.borderRadius + "px",
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "flex-start",
					overflow: "hidden",
					transition: theme.transitions.create(["background-color", "color","scale"]),
					
					...(active && {
						backgroundColor: (theme) => `color-mix(in srgb, ${theme.palette.primary.main} 11%, transparent)`,
						color: "primary.main",
					}),

					"&:hover": {
						backgroundColor: active
							? (theme) => `color-mix(in srgb, ${theme.palette.primary.main} 15%, transparent)`
							: "action.hover",
					},

					[theme.breakpoints.up("md")]: {
						width: "100%",
						minWidth: 0,
						height: 46,
						minHeight: 46,
						boxSizing: "border-box",
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "flex-start",
						textAlign: "start",
						overflow: "hidden",
					},

					...overrideSX,
				};
			},
			[active, sx],
		);

		const isRtl = theme.direction === "rtl";
		React.useEffect(() => {
			elRef.current.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}, [active]);
		return (
			<Tooltip
				title={translatedLabel}
				placement={isRtl ? "left" : "right"}
				slotProps={{
					tooltip: {
						sx: {
							display: {
								xs: "none",
								md: "block",
							},
						},
					},
				}}
			>
				<ListItem
					ref={elRef}
					disablePadding
					data-active={Boolean(active)}
					className={"sidebar-menu-item"}
					sx={(theme) => ({
						width: "100%",
						minWidth: 0,
						p: 0.25,
					})}
					{...props}
				>
					<ListItemButton ref={ref} onClick={onClick} sx={itemStyles}>
						<SidebarItemIcon icon={icon} active={active} />

						{label && (!isSmallScreen ? showTitle : true) && (
							<ListItemText
								primary={translatedLabel}
								disableTypography
								sx={{
									minWidth: 0,
									width: "100%",
									maxWidth: "100%",
									whiteSpace: "nowrap",
									m: 0,

									overflow: "hidden",

									"& .MuiListItemText-primary": {
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap",

										fontSize: "0.875rem",
										fontWeight: active ? 600 : 400,
									},

									[theme.breakpoints.up("md")]: {
										minWidth: 0,
										width: "100%",
										maxWidth: "100%",
										fontSize: "0.875rem",
										overflow: "hidden",

										textAlign: "start",

										"& .MuiListItemText-primary": {
											width: "100%",
											maxWidth: "100%",

											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap",

											lineHeight: 1.2,

											fontWeight: active ? 600 : 400,
										},
									},
								}}
							/>
						)}

						{isSmallScreen && children}
					</ListItemButton>
				</ListItem>
			</Tooltip>
		);
	},
);

SidebarItemComponent.displayName = "SidebarItem";

export const SidebarItem = React.memo(SidebarItemComponent);
SidebarItem.displayName = "SidebarItem";

export default SidebarItem;
