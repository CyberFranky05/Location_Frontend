import type { RequestHandler } from './$types';

const EC2_BACKEND_URL = 'http://13.232.210.108';

export const GET: RequestHandler = async ({ request, url }) => {
	// Forward /api/* to EC2 /api/* (nginx will then route to backend:3000/api/v1/*)
	const path = url.pathname; // Keep as is: /api/v1/...
	const queryString = url.search;
	const targetUrl = `${EC2_BACKEND_URL}${path}${queryString}`;
	
	console.log('[Proxy GET] Request to:', targetUrl);
	
	try {
		const response = await fetch(targetUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': request.headers.get('Authorization') || ''
			}
		});
		
		const data = await response.json();
		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error('[Proxy GET] Error:', error);
		return new Response(JSON.stringify({ error: 'Backend connection failed', details: String(error) }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};

export const POST: RequestHandler = async ({ request, url }) => {
	const path = url.pathname;
	const body = await request.text();
	const targetUrl = `${EC2_BACKEND_URL}${path}`;
	
	console.log('[Proxy POST] Request to:', targetUrl);
	console.log('[Proxy POST] Body:', body);
	
	try {
		const response = await fetch(targetUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': request.headers.get('Authorization') || ''
			},
			body
		});
		
		const data = await response.json();
		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error('[Proxy POST] Error:', error);
		return new Response(JSON.stringify({ error: 'Backend connection failed', details: String(error) }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};

export const PUT: RequestHandler = async ({ request, url }) => {
	const path = url.pathname;
	const body = await request.text();
	const targetUrl = `${EC2_BACKEND_URL}${path}`;
	
	console.log('[Proxy PUT] Request to:', targetUrl);
	
	try {
		const response = await fetch(targetUrl, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': request.headers.get('Authorization') || ''
			},
			body
		});
		
		const data = await response.json();
		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error('[Proxy PUT] Error:', error);
		return new Response(JSON.stringify({ error: 'Backend connection failed', details: String(error) }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};

export const DELETE: RequestHandler = async ({ request, url }) => {
	const path = url.pathname;
	const targetUrl = `${EC2_BACKEND_URL}${path}`;
	
	console.log('[Proxy DELETE] Request to:', targetUrl);
	
	try {
		const response = await fetch(targetUrl, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': request.headers.get('Authorization') || ''
			}
		});
		
		const data = await response.json();
		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error('[Proxy DELETE] Error:', error);
		return new Response(JSON.stringify({ error: 'Backend connection failed', details: String(error) }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};
