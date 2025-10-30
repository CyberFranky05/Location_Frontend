import type { RequestHandler } from './$types';

const EC2_BACKEND_URL = 'http://13.232.210.108';

export const GET: RequestHandler = async ({ request, url }) => {
	// Remove /api/v1 prefix and forward the rest to EC2 /api/v1/
	const path = url.pathname.replace('/api/v1', '/api/v1');
	const queryString = url.search;
	
	console.log('[Proxy GET] Request to:', `${EC2_BACKEND_URL}${path}${queryString}`);
	
	try {
		const response = await fetch(`${EC2_BACKEND_URL}${path}${queryString}`, {
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
	const path = url.pathname.replace('/api/v1', '/api/v1');
	const body = await request.text();
	
	console.log('[Proxy POST] Request to:', `${EC2_BACKEND_URL}${path}`);
	console.log('[Proxy POST] Body:', body);
	
	try {
		const response = await fetch(`${EC2_BACKEND_URL}${path}`, {
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
	const path = url.pathname.replace('/api/v1', '/api/v1');
	const body = await request.text();
	
	console.log('[Proxy PUT] Request to:', `${EC2_BACKEND_URL}${path}`);
	
	try {
		const response = await fetch(`${EC2_BACKEND_URL}${path}`, {
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
	const path = url.pathname.replace('/api/v1', '/api/v1');
	
	console.log('[Proxy DELETE] Request to:', `${EC2_BACKEND_URL}${path}`);
	
	try {
		const response = await fetch(`${EC2_BACKEND_URL}${path}`, {
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
