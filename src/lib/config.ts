// Runtime configuration that can be changed without rebuilding
export const config = {
	// Use Vercel API proxy (same origin = HTTPS) when on Vercel, direct HTTP for local dev
	apiUrl: typeof window !== 'undefined' && window.location.hostname === 'location-frontend-murex.vercel.app'
		? '/api'  // Vercel proxy endpoint (will be HTTPS automatically)
		: import.meta.env.PUBLIC_API_URL || 'http://localhost:3001/api/v1',
	
	// Keycloak still needs direct access (for redirects)
	keycloakUrl: typeof window !== 'undefined' && window.location.hostname === 'location-frontend-murex.vercel.app'
		? 'http://13.232.210.108/auth'
		: import.meta.env.PUBLIC_KEYCLOAK_URL || 'http://localhost:8080',
	
	keycloakRealm: import.meta.env.PUBLIC_KEYCLOAK_REALM || 'location-auth-realm',
	keycloakClientId: import.meta.env.PUBLIC_KEYCLOAK_CLIENT_ID || 'location-auth-frontend',
	
	supabaseUrl: import.meta.env.PUBLIC_SUPABASE_URL || '',
	supabaseAnonKey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY || ''
};

// Debug logging
if (typeof window !== 'undefined') {
	console.log('[Config] Runtime configuration:', config);
	console.log('[Config] Window hostname:', window.location.hostname);
	console.log('[Config] Environment variables:', {
		PUBLIC_API_URL: import.meta.env.PUBLIC_API_URL,
		PUBLIC_KEYCLOAK_URL: import.meta.env.PUBLIC_KEYCLOAK_URL,
		MODE: import.meta.env.MODE,
		PROD: import.meta.env.PROD
	});
}

