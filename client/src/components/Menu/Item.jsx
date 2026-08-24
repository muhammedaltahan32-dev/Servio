import { MenuItem } from "../index.js";
import React from "react";
import { useMenu } from "./context.js";

export const Item = React.forwardRef(({ onClick, ...props }, ref) => {
	const { close } = useMenu();
	const handleClick = React.useCallback(
		(...args) => {
			onClick?.(...args);
			close?.();
		},
		[onClick, close],
	);
	return <MenuItem onClick={handleClick} ref={ref} {...props} />;
});
Item.displayName = "MenuItem";
export default Item;
