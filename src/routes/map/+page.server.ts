import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	let lat = url.searchParams.get('lat') || 21.171814;
	let lon = url.searchParams.get('lon') || 72.817699;
	// console.log(lat, lon);
	// let lat = 21.171814;
	// let lon = 72.817699;

	const response = await fetch(
		'https://us-central1-womensafety-422010.cloudfunctions.net/predict',
		{
			method: 'POST',
			body: JSON.stringify({
				latitude: lat,
				longitude: lon
			})
		}
	);
	const predictedData = await response.json();
	let swappedCoordinates = [];
	const resp = await fetch(`https://nirbhicapi.netlify.app/?lat=${lat}&lon=${lon}`);

	const coordinates = await resp.json();
	if (!coordinates) {
		return {
			stateData: [],
			coordata: [],
			predictedData: []
		};
	}
	const { currentArea, currentState } = coordinates;
	for (let i = 0; i < currentArea[0].length; i++) {
		swappedCoordinates = currentArea[0].map(([lat, lon]) => [lon, lat]);
	}
	console.log(currentArea);

	console.log(predictedData);

	return {
		stateData: currentState,
		coordata: [swappedCoordinates],
		predictedData: predictedData
	};
};
