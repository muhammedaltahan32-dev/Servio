import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;

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

const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response.data,
	(error) => {
		console.error("API Error:", error.response || error.message);
		return Promise.reject(error);
	},
);
export const ApiService = {
	get: (endpoint, config) => api.get(endpoint, config),
	post: (endpoint, data, config) => api.post(endpoint, data, config),
	put: (endpoint, data, config) => api.put(endpoint, data, config),
	delete: (endpoint, config) => api.delete(endpoint, config),

	getLanguage: async (lang) => {
		let url = BASE_URL;
		if (BASE_URL.endsWith("/")) url = `${BASE_URL}/`;
		url += `local/${lang}.json`;
		try {
			const response = await axios.get(url);
			return response.data;
		} catch (error) {
			console.error(`failed to load language : ${lang} \n`, error);
		}
	},
};

export default ApiService;
