import { json } from '@sveltejs/kit';
export async function POST({ request }) {
	const { coord } = await request.json();

	const response = await fetch('https://bxdwqjsk-8000.inc1.devtunnels.ms/predict', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ coord: coord })
	});
	const data = await response.json();
	return json(data);
}
