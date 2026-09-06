import React from "react";
import { Container as MUContainer } from "@mui/material";
const EMPTY_OBJECT = {};
export const PageContainer = React.forwardRef(({ children, sx = EMPTY_OBJECT, ...props }, ref) => {
	const resolvedSX = React.useCallback(
		(theme) => {
			let overrideStyles = sx;
			if (typeof overrideStyles === "function") overrideStyles = overrideStyles(theme);
			return {
				height: "100%",
				flex: 1,
				p: { md: 3, sm: 2.5, xs: 2 },
				display: "flex",
				flexDirection: "column",
				...overrideStyles,
			};
		},
		[sx],
	);
	return (
		<MUContainer ref={ref} maxWidth="xl" disableGutters sx={resolvedSX} {...props}>
			{children}
		</MUContainer>
	);
});
export default PageContainer;
PageContainer.displayName = "pageContainer";
