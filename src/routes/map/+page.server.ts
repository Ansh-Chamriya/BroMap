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
	let swappedArea = [];
	let swappedState = [];
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
		swappedArea = currentArea[0].map(([lat, lon]) => [lon, lat]);
	}
	// for (let i = 0; i < currentState.length; i++) {
	// 	k = 0;
	// 	for (let j = 0; j < currentState[i][j].length; j++) {
	// 		var k = 0;
	// 		swappedState = currentState[i][j][k].map(([lat, lon]) => [lon, lat]);
	// 		k++;
	// 	}
	// }
	swappedState = currentState.map((innerArray) =>
		innerArray.map((dinner) => dinner.map(([lat, lon]) => [lon, lat]))
	);
	console.log(currentState[0][0]);
	console.log('==================================================================');

	console.log(swappedState[0][0]);

	// console.log(predictedData);

	return {
		stateData: [swappedState],
		coordata: [swappedArea],
		predictedData: predictedData
	};
};
