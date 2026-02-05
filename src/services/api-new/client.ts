import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

// Environment configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const API_TIMEOUT = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '30000', 10);

// Create axios instance
const apiClient: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: API_TIMEOUT,
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	},
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
	async (config) => {
		// Get auth token from storage
		const { getAuthToken } = await import('../utils/storage');
		const token = await getAuthToken();
		
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		if (error.response) {
			// Handle specific error codes
			switch (error.response.status) {
				case 401:
					// TODO: Handle unauthorized (e.g., logout user, refresh token)
					console.error('Unauthorized - Please login again');
					break;
				case 403:
					console.error('Forbidden - You do not have permission');
					break;
				case 404:
					console.error('Resource not found');
					break;
				case 500:
					console.error('Server error - Please try again later');
					break;
				default:
					console.error('An error occurred:', error.response.data);
			}
		} else if (error.request) {
			console.error('Network error - Please check your connection');
		} else {
			console.error('Error:', error.message);
		}
		return Promise.reject(error);
	}
);

export default apiClient;

// Export types for use in services
export type { AxiosRequestConfig, AxiosError };
