<!DOCTYPE html>
<html  lang="en">
	<head>
		<meta charset="utf-8">
		<title>WeightedHeatMap</title>
		<link rel="stylesheet" href="style.css">
		<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBC1tP3SbFYC9MdbZIMvGC0p1mmiY_CEek&libraries=visualization"></script>
		<script type="text/javascript" src="WeightedHeatMap.js"></script>
		<script type="text/javascript">
			function initialize() {

				// 1 - Initialize as always: ********************************************************************************************** /
				var mapOptions = {
					center: { lat: 42, lng: 42},
					zoom: 8
				};
				var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

				// 2 - Get you data: array of [Lat, Log, value]
				var data = [
					{location: new google.maps.LatLng(41.5, 41.5), weight:5000},
					{location: new google.maps.LatLng(41.5, 42.5), weight:10000},
					{location: new google.maps.LatLng(42.5, 42.5), weight:20000},
					{location: new google.maps.LatLng(42.5, 41.5), weight:15000}
				];

				// 3 - Make the interpolation: ******************************************************************************************** /

				// 3.1 - Instanced the WeightHeatMap:
				var weightedHeatMap = new WeightedHeatMap(data, map);

				// 3.2 - Set the bounds (optionnal, default fitBounds):
				//weightedHeatMap.setBounds(anotherBounds);

				// 3.3 - Set the size of the mesh (optionnal, default {lat:30, lng:30}):
				//weightedHeatMap.setSize(anotherSize);

				// 3.4 - Set the interpolation methode (optionnal):
				weightedHeatMap.setInterpolationType('linear'); // linear neightbor
				var para = null; // no para for the linear neightbor interpolation

				// 3.5 - Make the interpolation:
				var success = weightedHeatMap.interpolate(para);

				if (success) {
					// 3.6 - Get the interpolated mesh (optionnal):
					var myMesh = weightedHeatMap.getMesh();

					// 3.7 - Get the calculated array of WeightedLocation (optionnal):
					var myTabWeightedHeatMap = weightedHeatMap.getTabWeightedLocation();

					// 3.8 - Show the WeightHeat Layer on the map:
					weightedHeatMap.showOnTheMap();
				} else {
					console.log('Interpolation error!');
				}

				// 4 - What it made: ****************************************************************************************************** /

				// Your weightedHeatMap:
				console.log(weightedHeatMap);
				// Your mesh:
				console.log(myMesh);
				// Your WeightedHeatMap array:
				console.log(myTabWeightedHeatMap);

				// 5 - Lets compare the different interpolation type: ********************************************************************* /

				// This was the center one WeightHeatMap (linear interpolation), now lets try with 2 other :

				// On the left with the nearest interpolation :
				var dataL = [
					{location: new google.maps.LatLng(41.5, 39.5), weight:5000},
					{location: new google.maps.LatLng(41.5, 40.5), weight:10000},
					{location: new google.maps.LatLng(42.5, 40.5), weight:20000},
					{location: new google.maps.LatLng(42.5, 39.5), weight:15000}
				];
				var weightedHeatMapL = new WeightedHeatMap(dataL, map);
				weightedHeatMapL.setInterpolationType('nearest');
				weightedHeatMapL.interpolate();
				weightedHeatMapL.showOnTheMap();

				// On the right with the inverse interpolation, p=1 :
				var dataR = [
					{location: new google.maps.LatLng(41.5, 43.5), weight:5000},
					{location: new google.maps.LatLng(41.5, 44.5), weight:10000},
					{location: new google.maps.LatLng(42.5, 44.5), weight:20000},
					{location: new google.maps.LatLng(42.5, 43.5), weight:15000}
				];
				var p = 1; // inverse methode has parameter
				var weightedHeatMapR = new WeightedHeatMap(dataR, map);
				weightedHeatMapR.setInterpolationType('inverse');
				weightedHeatMapR.interpolate(p);
				weightedHeatMapR.showOnTheMap();

			}
			google.maps.event.addDomListener(window, 'load', initialize);
		</script>
	</head>
	<body>
		<div id="map-canvas"></div>
	</body>
</html>