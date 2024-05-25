<script lang="ts">
	export let data;
	import L from 'leaflet';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { LocateFixed } from 'lucide-svelte';
	const stateData = data.stateData;
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
	const styles = ['googleStreets', 'googleHybrid', 'googleSat', 'googleTerrain'];
	let mymap;
	let latlng = [20.5937, 78.9629];
	const mycustomLayer = {
		googleStreets: L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
			maxZoom: 20,
			subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
		}),
		googleHybrid: L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
			maxZoom: 20,
			subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
		}),
		googleSat: L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
			maxZoom: 20,
			subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
		}),
		googleTerrain: L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
			maxZoom: 20,
			subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
		}),
		openStreetMap: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		})
	};

	onMount(() => {
		mymap = L.map('mymaps').setView(latlng, 3);
		// 3 IS ZOOM

		// CREATE TILE LAYER

		// SET DEFAULT IF OPEN THE MAPS FIRST
		mycustomLayer['googleStreets'].addTo(mymap);
		mymap.invalidateSize();
		// ADD CONTROLL IN TOP RIGHT FOR SWITCH THEME MAPS
		L.control.layers(mycustomLayer).addTo(mymap);

		// L.polygon(stateData, {
		// 	onEachFeature: function (feature, layer) {
		// 		layer.bindPopup(feature.properties.Area);
		// 	}
		// }).addTo(mymap);

		// let polygon = L.polygon(coordinates[0], { color: polygonColour }).addTo(mymap);
		// mymap.fitBounds(polygon.getBounds());
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

<!-- h-[702px] w-[1535px] -->
<div id="mymaps" class="h-[702px] w-[1535px] scale-125"></div>
<button class="absolute bottom-10 right-10 z-[500] w-fit" on:click={getCurrentLocation}>
	<LocateFixed size="48px" />
</button>
