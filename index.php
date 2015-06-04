<!DOCTYPE html>
<html  lang="en">
	<head>
		<meta charset="utf-8">
		<title>WeightedHeatMap</title>
		<link rel="stylesheet" href="style.css">
		<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBC1tP3SbFYC9MdbZIMvGC0p1mmiY_CEek"></script>
		<script type="text/javascript">
			function initialize() {
				var mapOptions = {
					center: { lat: -34.397, lng: 150.644},
					zoom: 8
				};
				var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
			}
			google.maps.event.addDomListener(window, 'load', initialize);
		</script>
	</head>
	<body>
		<div id="map-canvas"></div>
	</body>
</html>