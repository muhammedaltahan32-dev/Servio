import React from "react";
import { Container as MUContainer } from "@mui/material";
const EMPTY_OBJECT = {};
export const PageContainer = React.forwardRef(({ children, sx = EMPTY_OBJECT, ...props }, ref) => {
	return (
		<MUContainer
			ref={ref}
			maxWidth="xl"
			sx={{ height: "100%", flex: 1, display: "flex", flexDirection: "column", ...sx }}
			{...props}
		>
			{children}
		</MUContainer>
	);
});
export default PageContainer;
PageContainer.displayName = "pageContainer";
