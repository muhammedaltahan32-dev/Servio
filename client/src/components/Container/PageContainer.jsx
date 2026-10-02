import React from "react";
import { Container as MUContainer } from "@mui/material";
const EMPTY_OBJECT = {};
export const PageContainer = React.forwardRef(({ children, sx = EMPTY_OBJECT, ...props }, ref) => {
	const resolvedSX = React.useCallback(
		(theme) => {
			let overrideStyles = sx;
			if (typeof overrideStyles === "function") overrideStyles = overrideStyles(theme);
			return {
				height: `calc(100dvh - ${theme.tokens.size.appBarHeight}px)`,
				flex: 1,
				p: { md: theme.tokens.space.pageMd, sm: theme.tokens.space.pageSm, xs: theme.tokens.space.pageXs },
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
