<script lang="ts">
	export let data;
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { LocateFixed } from 'lucide-svelte';
	const pincodeData = data.pincodeData;
	const coordinates = data.coordata;
	const safeScore = data.predictedData['Safe/Unsafe'];
	let polygonColour = '#e08cf5';
	if (safeScore == 1) {
		polygonColour = '##fc0000';
	} else if (safeScore == 2) {
		polygonColour = '#fc6900';
	} else if (safeScore == 3) {
		polygonColour = '#fc9700';
	} else if (safeScore == 4) {
		polygonColour = '#cefc00';
	} else if (safeScore == 5) {
		polygonColour = '#00fc00';
	}
	let lat = 0;
	let lon = 0;
	const accessToken = 'SbJ1xnaUApVYSuGhKgnadoHczoP2m4SzpSF95vwwuipRXc4n92UlEcd58qrMqKHa';
	navigator.geolocation.getCurrentPosition((position) => {
		lat = position.coords.latitude;
		lon = position.coords.longitude;
		updateQueryParams(lat, lon);
	});
	console.log(lat, lon);

	function updateQueryParams(newLat, newLon) {
		const searchParams = new URLSearchParams(window.location.search);
		searchParams.set('lat', newLat.toString());
		searchParams.set('lon', newLon.toString());
		goto(`?${searchParams.toString()}`);
	}
	$: {
		lat = parseFloat($page.url.searchParams.get('lat'));
		lon = parseFloat($page.url.searchParams.get('lon'));
	}
	const styles = ['jawg-streets', 'jawg-sunny', 'jawg-terrain', 'jawg-dark', 'jawg-light'];
	let mymap;
	let latlng = [20.5937, 78.9629];
	const mycustomLayer = {};

	onMount(() => {
		mymap = L.map('mymaps').setView(latlng, 5);
		// 3 IS ZOOM

		// CREATE TILE LAYER
		styles.forEach((style) => {
			mycustomLayer[style] = L.tileLayer(
				`https://tile.jawg.io/${style}/{z}/{x}/{y}{r}.png?access-token=${accessToken}`,
				{
					maxZoom: 22
				}
			);
		});

		// SET DEFAULT IF OPEN THE MAPS FIRST
		mycustomLayer['jawg-streets'].addTo(mymap);

		// ADD CONTROLL IN TOP RIGHT FOR SWITCH THEME MAPS
		L.control.layers(mycustomLayer).addTo(mymap);

		L.geoJson(pincodeData, {
			onEachFeature: function (feature, layer) {
				layer.bindPopup(feature.properties.Area);
			}
		}).addTo(mymap);
		let polygon = L.polygon(coordinates[0], { color: polygonColour }).addTo(mymap);
		mymap.fitBounds(polygon.getBounds());
		// mymap.on('click', function (e) {
		// 	console.log(e.latlng);
		// 	let marker = L.marker(e.latlng.lat, e.latlng.lng).addTo(mymap);
		// });
	});
	function getCurrentLocation() {
		navigator.geolocation.getCurrentPosition(
			(location) => {
				latlng = new L.latLng(location.coords.latitude, location.coords.longitude);
				// ADD FLY IF YOU LOCATION IS DETECT
				mymap.flyTo(latlng, 15, {
					animate: true,
					duration: 1
				});
				// CREATE RADIUS CIRCLE ON MARKER
				L.circle(latlng, { radius: 300 }).addTo(mymap);

				// CREATE MARKER YOU LOCATION
				L.marker(latlng)
					.addTo(mymap)
					.bindPopup(`You are here Safety Score ${safeScore}`)
					.openPopup();
			},
			// IF ERROR FOR DETECT LOCATION SEND CONSOLE ERORR
			(error) => console.log(error),
			// HIGH ACURACY YOU DETECT LOCATION
			{ enableHighAccuracy: true }
		);
	}
</script>

<div id="mymaps" class="h-[702px] w-[1535px]"></div>
<button class="absolute bottom-10 right-10 z-[500] w-fit" on:click={getCurrentLocation}>
	<LocateFixed size="48px" />
</button>
