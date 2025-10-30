import type { RequestHandler } from './$types';

const EC2_BACKEND_URL = 'http://13.232.210.108';

export const GET: RequestHandler = async ({ request, url }) => {
	const path = url.pathname.replace('/api', '');
	const queryString = url.search;
	
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
		return new Response(JSON.stringify({ error: 'Backend connection failed' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};

export const POST: RequestHandler = async ({ request, url }) => {
	const path = url.pathname.replace('/api', '');
	const body = await request.text();
	
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
		return new Response(JSON.stringify({ error: 'Backend connection failed' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};

export const PUT: RequestHandler = async ({ request, url }) => {
	const path = url.pathname.replace('/api', '');
	const body = await request.text();
	
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
		return new Response(JSON.stringify({ error: 'Backend connection failed' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};

export const DELETE: RequestHandler = async ({ request, url }) => {
	const path = url.pathname.replace('/api', '');
	
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
		return new Response(JSON.stringify({ error: 'Backend connection failed' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};
