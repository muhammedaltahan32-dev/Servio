import axios from "axios";

const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${document.baseURI}api`;
const BASE_URL = RAW_BASE_URL.endsWith("/") ? RAW_BASE_URL.slice(0, -1) : RAW_BASE_URL;

async function request(endpoint, options = {}) {
	const token = localStorage.getItem("token");
	const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
	const headers = {
		"Content-Type": "application/json",
		...(token && { Authorization: `Bearer ${token}` }),
		...options.headers,
	};

	try {
		const response = await axios({
			url: `${BASE_URL}${formattedEndpoint}`,
			...options,
			headers,
		});

	
		return response.data;
	} catch (error) {
		console.error("API Request Error:", error.response || error.message);
		throw error;
	}
}

export const ApiService = {
	get: (endpoint, options = {}) => 
		request(endpoint, { method: "GET", ...options }),

	post: (endpoint, data, options = {}) => 
		request(endpoint, { method: "POST", data, ...options }),

	put: (endpoint, data, options = {}) => 
		request(endpoint, { method: "PUT", data, ...options }),

	delete: (endpoint, options = {}) => 
		request(endpoint, { method: "DELETE", ...options }),
};

export default ApiService;