import axios from 'axios';import axios from 'axios';import axios from 'axios';import axios from 'axios';

import { authStore } from '$lib/stores/auth';

import { config } from '$lib/config';import { authStore } from '$lib/stores/auth';

import { get } from 'svelte/store';

import { config } from '$lib/config';import { authStore } from '$lib/stores/auth';import { authStore } from '$lib/stores/auth';

// Use runtime config

const API_URL = config.apiUrl;import { get } from 'svelte/store';



console.log('[API Service] Using API_URL:', API_URL);import { get } from 'svelte/store';import { get } from 'svelte/store';

console.log('[API Service] Full config:', config);

// Use runtime config

// Create axios instance

const api = axios.create({const API_URL = config.apiUrl;

	baseURL: API_URL,

	headers: {

		'Content-Type': 'application/json'

	}console.log('[API Service] Using API_URL:', API_URL);// Debug: Log all environment variables// Use production URL - ENV vars don't work reliably in Docker builds

});

console.log('[API Service] Full config:', config);

// Add auth token to requests

api.interceptors.request.use((config) => {console.log('[API Config] Environment check:', {const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001/api/v1';

	const auth = get(authStore);

	if (auth.accessToken) {// Create axios instance

		config.headers.Authorization = `Bearer ${auth.accessToken}`;

	}const api = axios.create({	PUBLIC_API_URL: import.meta.env.PUBLIC_API_URL,

	return config;

});	baseURL: API_URL,



// Handle token refresh on 401	headers: {	PUBLIC_KEYCLOAK_URL: import.meta.env.PUBLIC_KEYCLOAK_URL,// Create axios instance

api.interceptors.response.use(

	(response) => response,		'Content-Type': 'application/json'

	async (error) => {

		const originalRequest = error.config;	}	MODE: import.meta.env.MODE,const api = axios.create({



		if (error.response?.status === 401 && !originalRequest._retry) {});

			originalRequest._retry = true;

	PROD: import.meta.env.PROD,	baseURL: API_URL,

			const auth = get(authStore);

			if (auth.refreshToken) {// Add auth token to requests

				try {

					const response = await axios.post(`${API_URL}/auth/refresh`, {api.interceptors.request.use((config) => {	DEV: import.meta.env.DEV	headers: {

						refresh_token: auth.refreshToken

					});	const auth = get(authStore);



					const { access_token, refresh_token } = response.data;	if (auth.accessToken) {});		'Content-Type': 'application/json'

					authStore.updateTokens(access_token, refresh_token);

		config.headers.Authorization = `Bearer ${auth.accessToken}`;

					originalRequest.headers.Authorization = `Bearer ${access_token}`;

					return api(originalRequest);	}	}

				} catch (refreshError) {

					authStore.logout();	return config;

					window.location.href = '/signin';

					return Promise.reject(refreshError);});// Get API URL from environment or use fallback});

				}

			}

		}

// Handle token refresh on 401const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001/api/v1';

		return Promise.reject(error);

	}api.interceptors.response.use(

);

	(response) => response,// Add auth token to requests

export interface SignUpData {

	name: string;	async (error) => {

	email: string;

	password: string;		const originalRequest = error.config;console.log('[API Config] Using API_URL:', API_URL);api.interceptors.request.use((config) => {

}



export interface SignInData {

	email: string;		if (error.response?.status === 401 && !originalRequest._retry) {	const auth = get(authStore);

	password: string;

}			originalRequest._retry = true;



export interface SignInAttempt {// Create axios instance	if (auth.accessToken) {

	id: string;

	user_id: string;			const auth = get(authStore);

	email: string;

	ip_address: string;			if (auth.refreshToken) {const api = axios.create({		config.headers.Authorization = `Bearer ${auth.accessToken}`;

	country?: string;

	city?: string;				try {

	region?: string;

	latitude?: number;					const response = await axios.post(`${API_URL}/auth/refresh`, {	baseURL: API_URL,	}

	longitude?: number;

	timezone?: string;						refresh_token: auth.refreshToken

	isp?: string;

	user_agent?: string;					});	headers: {	return config;

	browser?: string;

	device?: string;

	os?: string;

	success: boolean;					const { access_token, refresh_token } = response.data;		'Content-Type': 'application/json'});

	failure_reason?: string;

	timestamp: string;					authStore.updateTokens(access_token, refresh_token);

}

	}

export const authAPI = {

	async signUp(data: SignUpData) {					originalRequest.headers.Authorization = `Bearer ${access_token}`;

		const response = await api.post('/auth/signup', data);

		return response.data;					return api(originalRequest);});// Handle token refresh on 401

	},

				} catch (refreshError) {

	async signIn(data: SignInData) {

		const response = await api.post('/auth/signin', data);					authStore.logout();api.interceptors.response.use(

		const { access_token, refresh_token, user } = response.data;

		authStore.login(access_token, refresh_token, user);					window.location.href = '/signin';

		return response.data;

	},					return Promise.reject(refreshError);// Add auth token to requests	(response) => response,



	async logout() {				}

		const auth = get(authStore);

		if (auth.refreshToken) {			}api.interceptors.request.use((config) => {	async (error) => {

			try {

				await api.post('/auth/logout', { refresh_token: auth.refreshToken });		}

			} catch (e) {

				// Ignore logout errors	const auth = get(authStore);		const originalRequest = error.config;

			}

		}		return Promise.reject(error);

		authStore.logout();

	},	}	if (auth.accessToken) {



	async getProfile() {);

		const response = await api.get('/auth/profile');

		return response.data;		config.headers.Authorization = `Bearer ${auth.accessToken}`;		if (error.response?.status === 401 && !originalRequest._retry) {

	},

export interface SignUpData {

	async getSignInAttempts(limit = 50, offset = 0): Promise<{ attempts: SignInAttempt[]; total: number }> {

		const response = await api.get(`/auth/signin-attempts?limit=${limit}&offset=${offset}`);	name: string;	}			originalRequest._retry = true;

		return response.data;

	}	email: string;

};

	password: string;	return config;

export default api;

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
