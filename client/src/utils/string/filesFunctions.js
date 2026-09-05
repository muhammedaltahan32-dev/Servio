export const getFileWithEx = (path) => {
	if (path.trim() === "") return "";
	if (typeof path !== "string") throw new Error("path must be a string");
	return path.trim().match(/[^/\\]+\.[A-Za-z0-9]+$/)?.[0];
};

export const getPathName = (path) => {
	if (typeof path !== "string") throw new Error("path must be a string");
	const url = new URL(path);
	return decodeURIComponent(url.pathname);
};
