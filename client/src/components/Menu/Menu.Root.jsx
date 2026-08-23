import { Menu as MUMenu } from "@mui/material";
import { hasDisplayName } from "@utils";
import React from "react";
import { useMenu, useMenuRefs } from "./context.js";

export const MenuRoot = React.forwardRef(({ children, ...props }, ref) => {
	const { isOpened, close } = useMenu();
	const { triggerRef } = useMenuRefs();
	const { trigger, content } = React.useMemo(() => {
		let trigger = null,
			content = null;

		React.Children.toArray(children).forEach((child) => {
			if (hasDisplayName(child, "MenuTrigger")) {
				trigger = child;
			} else if (hasDisplayName(child, "MenuContent")) content = child;
		});

		return { trigger, content };
	}, [children]);

	return (
		<>
			{trigger}
			<MUMenu ref={ref} {...props} open={isOpened} onClose={close} anchorEl={triggerRef.current}>
				{content}
			</MUMenu>
		</>
	);
});
MenuRoot.displayName = "Menu";
export default MenuRoot;
