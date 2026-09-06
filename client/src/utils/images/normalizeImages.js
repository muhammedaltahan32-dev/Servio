import { BASE_URL } from "../../services/ApiService.js";

export const normalizeImageUrl = (url) => {
	if (!url) return "";
	if (url.startsWith("data:")) return url;

	const baseUrl = BASE_URL.replace(/\/$/, "");
	const targetOrigin = new URL(baseUrl).origin;

	if (/^https?:\/\//i.test(url)) {
		const parsed = new URL(url);
		if (parsed.origin !== targetOrigin) {
			return `${targetOrigin}${parsed.pathname}${parsed.search}${parsed.hash}`;
		}
		return url;
	}

	const normalizedPath = url.startsWith("/") ? url : `/${url}`;
	return `${baseUrl}${normalizedPath}`;
};
