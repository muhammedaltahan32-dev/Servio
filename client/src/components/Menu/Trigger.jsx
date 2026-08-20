import React from "react";
import { useMenu, useMenuRefs } from "./context.js";
import { mergeRefs } from "@utils";

export const Trigger = React.forwardRef(({ children }, ref) => {
	const elRef = React.useRef(null);
	const { toggle } = useMenu();
	const { triggerRef } = useMenuRefs();
	const cloned = React.useMemo(() => {
		const child = React.Children.only(children);
		return React.cloneElement(child, {
			ref: mergeRefs(elRef, triggerRef),
		});
	}, [children, triggerRef]);
	React.useEffect(() => {
		const el = elRef.current;
		if (!el) return;
		el.addEventListener("click", toggle);
		return () => el.removeEventListener("click", toggle);
	}, [toggle, children]);

	return cloned;
});
Trigger.displayName = "MenuTrigger";
export default Trigger;
