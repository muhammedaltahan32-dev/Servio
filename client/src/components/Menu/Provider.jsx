import { useControlledState } from "@hooks";
import React from "react";
import { MenuContext, MenuContextRefs } from "./context.js";
const RefsProvider = React.memo(({ children }) => {
	const triggerRef = React.useRef(null);
	const memoizedValue = React.useMemo(() => ({ triggerRef }), []);
	return <MenuContextRefs.Provider value={memoizedValue}>{children}</MenuContextRefs.Provider>;
});
RefsProvider.displayName = "RefsProvider";
const Provider = ({ children, open: _open, defaultOpen, onClose }) => {
	const [isOpened, setOpen] = useControlledState(_open, defaultOpen);
	const close = React.useCallback(() => {
		setOpen(false);
		onClose?.();
	}, [setOpen, onClose]);
	const open = React.useCallback(() => setOpen(true), [setOpen]);
	const toggle = React.useCallback(() => {
		if (isOpened) close();
		else open();
	}, [isOpened, close, open]);
	const memoizedValue = React.useMemo(
		() => ({
			isOpened,
			open,
			toggle,
			close,
		}),
		[isOpened, open, toggle, close],
	);
	return (
		<MenuContext.Provider value={memoizedValue}>
			<RefsProvider>{children}</RefsProvider>
		</MenuContext.Provider>
	);
};

export default Provider;
