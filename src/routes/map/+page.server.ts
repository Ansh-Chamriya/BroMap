import type { PageLoad } from './$types';
// src/routes/query-params/+page.server.ts

export const load: PageLoad = async ({ url }) => {
	const data = await fetch(
		'https://raw.githubusercontent.com/Ansh-Chamriya/NIRBHIC/master/static/new.geojson'
	);
	const pincodeData = await data.json();

	const response = await fetch(
		'https://us-central1-womensafety-422010.cloudfunctions.net/predict',
		{
			method: 'POST',
			body: JSON.stringify({
				latitude: 22.7041,
				longitude: 73.1025
			})
		}
	);
	let lat = url.searchParams.get('lat');
	let lon = url.searchParams.get('lon');
	// let lat = 21.171814;
	// let lon = 72.817699;
	// const resp = await fetch(
	// 	`https://raspy-pine-ba1e.anshchamariya922.workers.dev/?lat=${lat}&lon=${lon}`
	// );
	let swappedCoordinates = [];
	const resp = await fetch(
		`https://raspy-pine-ba1e.anshchamariya922.workers.dev/?lat=${lat}&lon=${lon}`
	);
	const coordinates = await resp.json();
	for (let i = 0; i < coordinates.response[0].length; i++) {
		swappedCoordinates = coordinates.response[0].map(([lat, lon]) => [lon, lat]);
	}

	const predictedData = await response.json();
	console.log(predictedData);

	return {
		pincodeData: pincodeData,
		coordata: [swappedCoordinates],
		predictedData: predictedData
	};
};
