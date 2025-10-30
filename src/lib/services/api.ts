import axios from 'axios';import axios from 'axios';import axios from 'axios';

import { authStore } from '$lib/stores/auth';

import { config } from '$lib/config';import { authStore } from '$lib/stores/auth';import { authStore } from '$lib/stores/auth';

import { get } from 'svelte/store';

import { get } from 'svelte/store';import { get } from 'svelte/store';

// Use runtime config

const API_URL = config.apiUrl;



console.log('[API Service] Using API_URL:', API_URL);// Debug: Log all environment variables// Use production URL - ENV vars don't work reliably in Docker builds

console.log('[API Service] Full config:', config);

console.log('[API Config] Environment check:', {const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Create axios instance

const api = axios.create({	PUBLIC_API_URL: import.meta.env.PUBLIC_API_URL,

	baseURL: API_URL,

	headers: {	PUBLIC_KEYCLOAK_URL: import.meta.env.PUBLIC_KEYCLOAK_URL,// Create axios instance

		'Content-Type': 'application/json'

	}	MODE: import.meta.env.MODE,const api = axios.create({

});

	PROD: import.meta.env.PROD,	baseURL: API_URL,

// Add auth token to requests

api.interceptors.request.use((config) => {	DEV: import.meta.env.DEV	headers: {

	const auth = get(authStore);

	if (auth.accessToken) {});		'Content-Type': 'application/json'

		config.headers.Authorization = `Bearer ${auth.accessToken}`;

	}	}

	return config;

});// Get API URL from environment or use fallback});



// Handle token refresh on 401const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001/api/v1';

api.interceptors.response.use(

	(response) => response,// Add auth token to requests

	async (error) => {

		const originalRequest = error.config;console.log('[API Config] Using API_URL:', API_URL);api.interceptors.request.use((config) => {



		if (error.response?.status === 401 && !originalRequest._retry) {	const auth = get(authStore);

			originalRequest._retry = true;

// Create axios instance	if (auth.accessToken) {

			const auth = get(authStore);

			if (auth.refreshToken) {const api = axios.create({		config.headers.Authorization = `Bearer ${auth.accessToken}`;

				try {

					const response = await axios.post(`${API_URL}/auth/refresh`, {	baseURL: API_URL,	}

						refresh_token: auth.refreshToken

					});	headers: {	return config;



					const { access_token, refresh_token } = response.data;		'Content-Type': 'application/json'});

					authStore.updateTokens(access_token, refresh_token);

	}

					originalRequest.headers.Authorization = `Bearer ${access_token}`;

					return api(originalRequest);});// Handle token refresh on 401

				} catch (refreshError) {

					authStore.logout();api.interceptors.response.use(

					window.location.href = '/signin';

					return Promise.reject(refreshError);// Add auth token to requests	(response) => response,

				}

			}api.interceptors.request.use((config) => {	async (error) => {

		}

	const auth = get(authStore);		const originalRequest = error.config;

		return Promise.reject(error);

	}	if (auth.accessToken) {

);

		config.headers.Authorization = `Bearer ${auth.accessToken}`;		if (error.response?.status === 401 && !originalRequest._retry) {

export interface SignUpData {

	name: string;	}			originalRequest._retry = true;

	email: string;

	password: string;	return config;

}

});			const auth = get(authStore);

export interface SignInData {

	email: string;			if (auth.refreshToken) {

	password: string;

}// Handle token refresh on 401				try {



export interface SignInAttempt {api.interceptors.response.use(					const response = await axios.post(`${API_URL}/auth/refresh`, {

	id: string;

	user_id: string;	(response) => response,						refresh_token: auth.refreshToken

	email: string;

	ip_address: string;	async (error) => {					});

	country?: string;

	city?: string;		const originalRequest = error.config;

	region?: string;

	latitude?: number;					const { access_token, refresh_token } = response.data;

	longitude?: number;

	timezone?: string;		if (error.response?.status === 401 && !originalRequest._retry) {					authStore.updateTokens(access_token, refresh_token);

	isp?: string;

	user_agent?: string;			originalRequest._retry = true;

	browser?: string;

	device?: string;					originalRequest.headers.Authorization = `Bearer ${access_token}`;

	os?: string;

	success: boolean;			const auth = get(authStore);					return api(originalRequest);

	failure_reason?: string;

	timestamp: string;			if (auth.refreshToken) {				} catch (refreshError) {

}

				try {					authStore.logout();

export const authAPI = {

	async signUp(data: SignUpData) {					const response = await axios.post(`${API_URL}/auth/refresh`, {					window.location.href = '/signin';

		const response = await api.post('/auth/signup', data);

		return response.data;						refresh_token: auth.refreshToken					return Promise.reject(refreshError);

	},

					});				}

	async signIn(data: SignInData) {

		const response = await api.post('/auth/signin', data);			}

		const { access_token, refresh_token, user } = response.data;

		authStore.login(access_token, refresh_token, user);					const { access_token, refresh_token } = response.data;		}

		return response.data;

	},					authStore.updateTokens(access_token, refresh_token);



	async logout() {		return Promise.reject(error);

		const auth = get(authStore);

		if (auth.refreshToken) {					originalRequest.headers.Authorization = `Bearer ${access_token}`;	}

			try {

				await api.post('/auth/logout', { refresh_token: auth.refreshToken });					return api(originalRequest););

			} catch (e) {

				// Ignore logout errors				} catch (refreshError) {

			}

		}					authStore.logout();export interface SignUpData {

		authStore.logout();

	},					window.location.href = '/signin';	name: string;



	async getProfile() {					return Promise.reject(refreshError);	email: string;

		const response = await api.get('/auth/profile');

		return response.data;				}	password: string;

	},

			}}

	async getSignInAttempts(limit = 50, offset = 0): Promise<{ attempts: SignInAttempt[]; total: number }> {

		const response = await api.get(`/auth/signin-attempts?limit=${limit}&offset=${offset}`);		}

		return response.data;

	}export interface SignInData {

};

		return Promise.reject(error);	email: string;

export default api;

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
