import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const normalizeApiUrl = value => {
	if (!value) return '/api';
	const withoutTrailingSlashes = value.replace(/\/+$/, '');
	return withoutTrailingSlashes.endsWith('/api') ? withoutTrailingSlashes : `${withoutTrailingSlashes}/api`;
};

export const API_URL = normalizeApiUrl(configuredApiUrl);
export const BACKEND_ORIGIN = API_URL.replace(/\/api$/, '');
const client = axios.create({ baseURL: API_URL, withCredentials: true });
client.interceptors.request.use(config => {
	const token = localStorage.getItem('m3nace_token');
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});
export default client;
