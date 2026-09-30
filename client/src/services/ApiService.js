import axios from "axios";
import { Api_Architecture, Api_Signin, Api_Upload } from "../../../constants/SubApi.js";
import { REFRESH_TOKEN, TOKEN, USER_INFO } from "../../../constants/localStorage.js";

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;

const clearStoredAuth = () => {
	localStorage.removeItem(TOKEN);
	localStorage.removeItem(REFRESH_TOKEN);
	localStorage.removeItem(USER_INFO);
};

const saveTokens = ({ accessToken, refreshToken }) => {
	if (accessToken) {
		localStorage.setItem(TOKEN, accessToken);
	}
	if (refreshToken) {
		localStorage.setItem(REFRESH_TOKEN, refreshToken);
	}
};

let refreshPromise;

const refreshAccessToken = async () => {
	if (refreshPromise) {
		return refreshPromise;
	}

	const refreshToken = localStorage.getItem(REFRESH_TOKEN);
	if (!refreshToken) {
		throw new Error("Session expired");
	}

	refreshPromise = api
		.post(
			Api_Architecture + "/refresh",
			{},
			{
				headers: { Authorization: "Bearer " + refreshToken },
				__skipAuth: true,
			},
		)
		.then((response) => {
			const tokens = response && response.data;
			if (!tokens || !tokens.token || !tokens.refreshToken) {
				throw new Error("Refresh response did not include both tokens");
			}
			saveTokens({ accessToken: tokens.token, refreshToken: tokens.refreshToken });
			return tokens.token;
		})
		.finally(() => {
			refreshPromise = undefined;
		});

	return refreshPromise;
};

const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use((config) => {
	if (config.__skipAuth) {
		return config;
	}
	const token = localStorage.getItem(TOKEN);
	if (token && !config.headers.Authorization) {
		config.headers.Authorization = "Bearer " + token;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response.data,
	async (error) => {
		const originalRequest = error.config || {};
		if (
			error.response &&
			error.response.status === 401 &&
			!originalRequest.__isRetry &&
			!(typeof originalRequest.url === "string" && originalRequest.url.endsWith(Api_Signin)) &&
			!(typeof originalRequest.url === "string" && originalRequest.url.endsWith(Api_Architecture + "/refresh"))
		) {
			try {
				originalRequest.__isRetry = true;
				const refreshedToken = await refreshAccessToken();
				originalRequest.headers = originalRequest.headers || {};
				originalRequest.headers.Authorization = "Bearer " + refreshedToken;
				return api(originalRequest);
			} catch (refreshError) {
				clearStoredAuth();
				if (typeof window !== "undefined") {
					window.location.href = "/login";
				}
				return Promise.reject(refreshError);
			}
		}

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
		if (BASE_URL.endsWith("/")) url = BASE_URL + "/";
		url += "local/" + lang + ".json";
		try {
			const response = await axios.get(url);
			return response.data;
		} catch (error) {
			console.error("failed to load language : " + lang + " \n", error);
		}
	},
	uploadImage: async (img) => {
		let images = img;
		if (!Array.isArray(images)) images = [img];
		const form = new FormData();
		images.forEach((file) => {
			form.append("images", file);
		});

		const res = await ApiService.post(Api_Upload, form, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return res;
	},
};

export default ApiService;
