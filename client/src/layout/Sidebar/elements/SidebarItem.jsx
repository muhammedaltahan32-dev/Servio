import { Icon } from "@components";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import React from "react";

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
				color: active ? "primary.contrastText" : "text.secondary",

				[theme.breakpoints.up("md")]: {
					minWidth: 0,
					width: "100%",

					height: 28,

					display: "flex",
					alignItems: "center",
					justifyContent: "center",

					flexShrink: 0,

					m: 0,
				},
			}}
		>
			{typeof icon === "string" ? (
				<Icon name={icon} color={active ? theme.palette.primary.contrastText : undefined} />
			) : (
				icon
			)}
		</ListItemIcon>
	);
});

SidebarItemIcon.displayName = "SidebarItemIcon";

export const SidebarItem = React.forwardRef(
	({ label, icon, onClick, children, sx = EMPTY_OBJECT, active, showTitle = true, ...props }, ref) => {
		const theme = useTheme();
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
						backgroundColor: "primary.main",
						color: "primary.contrastText",
					}),

					"&:hover": {
						backgroundColor: active ? "primary.main" : "action.hover",
					},

					[theme.breakpoints.up("md")]: {
						width: "100%",
						minWidth: 0,
						height: 64,
						minHeight: 64,
						boxSizing: "border-box",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						textAlign: "center",
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
				title={label || ""}
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
						...(!isSmallScreen && {
							bgcolor: "background.paper",

							p: "0.5rem",
							position: "relative",
							'&:has(+[data-active="true"])': {
								borderBottomRightRadius: theme.shape.borderRadius + "px",
							},
							...(active && {
								"& + .sidebar-menu-item": {
									borderTopRightRadius: theme.shape.borderRadius + "px",
								},
								bgcolor: "background.default",
							}),
						}),
					})}
					{...props}
				>
					<ListItemButton ref={ref} onClick={onClick} sx={itemStyles}>
						<SidebarItemIcon icon={icon} active={active} />

						{label && (!isSmallScreen ? showTitle : true) && (
							<ListItemText
								primary={label}
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
										fontSize: "0.6rem",
										overflow: "hidden",

										textAlign: "center",

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

SidebarItem.displayName = "SidebarItem";

export default SidebarItem;
