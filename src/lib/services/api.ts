import axios from 'axios';import axios from 'axios';

import { authStore } from '$lib/stores/auth';import { authStore } from '$lib/stores/auth';

import { get } from 'svelte/store';import { get } from 'svelte/store';



// Debug: Log all environment variables// Use production URL - ENV vars don't work reliably in Docker builds

console.log('[API Config] Environment check:', {const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001/api/v1';

	PUBLIC_API_URL: import.meta.env.PUBLIC_API_URL,

	PUBLIC_KEYCLOAK_URL: import.meta.env.PUBLIC_KEYCLOAK_URL,// Create axios instance

	MODE: import.meta.env.MODE,const api = axios.create({

	PROD: import.meta.env.PROD,	baseURL: API_URL,

	DEV: import.meta.env.DEV	headers: {

});		'Content-Type': 'application/json'

	}

// Get API URL from environment or use fallback});

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Add auth token to requests

console.log('[API Config] Using API_URL:', API_URL);api.interceptors.request.use((config) => {

	const auth = get(authStore);

// Create axios instance	if (auth.accessToken) {

const api = axios.create({		config.headers.Authorization = `Bearer ${auth.accessToken}`;

	baseURL: API_URL,	}

	headers: {	return config;

		'Content-Type': 'application/json'});

	}

});// Handle token refresh on 401

api.interceptors.response.use(

// Add auth token to requests	(response) => response,

api.interceptors.request.use((config) => {	async (error) => {

	const auth = get(authStore);		const originalRequest = error.config;

	if (auth.accessToken) {

		config.headers.Authorization = `Bearer ${auth.accessToken}`;		if (error.response?.status === 401 && !originalRequest._retry) {

	}			originalRequest._retry = true;

	return config;

});			const auth = get(authStore);

			if (auth.refreshToken) {

// Handle token refresh on 401				try {

api.interceptors.response.use(					const response = await axios.post(`${API_URL}/auth/refresh`, {

	(response) => response,						refresh_token: auth.refreshToken

	async (error) => {					});

		const originalRequest = error.config;

					const { access_token, refresh_token } = response.data;

		if (error.response?.status === 401 && !originalRequest._retry) {					authStore.updateTokens(access_token, refresh_token);

			originalRequest._retry = true;

					originalRequest.headers.Authorization = `Bearer ${access_token}`;

			const auth = get(authStore);					return api(originalRequest);

			if (auth.refreshToken) {				} catch (refreshError) {

				try {					authStore.logout();

					const response = await axios.post(`${API_URL}/auth/refresh`, {					window.location.href = '/signin';

						refresh_token: auth.refreshToken					return Promise.reject(refreshError);

					});				}

			}

					const { access_token, refresh_token } = response.data;		}

					authStore.updateTokens(access_token, refresh_token);

		return Promise.reject(error);

					originalRequest.headers.Authorization = `Bearer ${access_token}`;	}

					return api(originalRequest););

				} catch (refreshError) {

					authStore.logout();export interface SignUpData {

					window.location.href = '/signin';	name: string;

					return Promise.reject(refreshError);	email: string;

				}	password: string;

			}}

		}

export interface SignInData {

		return Promise.reject(error);	email: string;

	}	password: string;

);}



export interface SignUpData {export interface SignInAttempt {

	name: string;	id: string;

	email: string;	user_id: string;

	password: string;	email: string;

}	ip_address: string;

	country?: string;

export interface SignInData {	city?: string;

	email: string;	region?: string;

	password: string;	latitude?: number;

}	longitude?: number;

	timezone?: string;

export interface SignInAttempt {	isp?: string;

	id: string;	user_agent?: string;

	user_id: string;	browser?: string;

	email: string;	device?: string;

	ip_address: string;	os?: string;

	country?: string;	success: boolean;

	city?: string;	failure_reason?: string;

	region?: string;	timestamp: string;

	latitude?: number;}

	longitude?: number;

	timezone?: string;export const authAPI = {

	isp?: string;	async signUp(data: SignUpData) {

	user_agent?: string;		const response = await api.post('/auth/signup', data);

	browser?: string;		return response.data;

	device?: string;	},

	os?: string;

	success: boolean;	async signIn(data: SignInData) {

	failure_reason?: string;		const response = await api.post('/auth/signin', data);

	timestamp: string;		const { access_token, refresh_token, user } = response.data;

}		authStore.login(access_token, refresh_token, user);

		return response.data;

export const authAPI = {	},

	async signUp(data: SignUpData) {

		const response = await api.post('/auth/signup', data);	async logout() {

		return response.data;		const auth = get(authStore);

	},		if (auth.refreshToken) {

			try {

	async signIn(data: SignInData) {				await api.post('/auth/logout', { refresh_token: auth.refreshToken });

		const response = await api.post('/auth/signin', data);			} catch (e) {

		const { access_token, refresh_token, user } = response.data;				// Ignore logout errors

		authStore.login(access_token, refresh_token, user);			}

		return response.data;		}

	},		authStore.logout();

	},

	async logout() {

		const auth = get(authStore);	async getProfile() {

		if (auth.refreshToken) {		const response = await api.get('/auth/profile');

			try {		return response.data;

				await api.post('/auth/logout', { refresh_token: auth.refreshToken });	},

			} catch (e) {

				// Ignore logout errors	async getSignInAttempts(limit = 50, offset = 0): Promise<{ attempts: SignInAttempt[]; total: number }> {

			}		const response = await api.get(`/auth/signin-attempts?limit=${limit}&offset=${offset}`);

		}		return response.data;

		authStore.logout();	}

	},};



	async getProfile() {export default api;

		const response = await api.get('/auth/profile');
		return response.data;
	},

	async getSignInAttempts(limit = 50, offset = 0): Promise<{ attempts: SignInAttempt[]; total: number }> {
		const response = await api.get(`/auth/signin-attempts?limit=${limit}&offset=${offset}`);
		return response.data;
	}
};

export default api;
