export const normalizeImage = (image, key = "name") => {
	if (typeof image === "string") return image;
	else if (typeof image === "object" && image) return image[key];
	return null;
};