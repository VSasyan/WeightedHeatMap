 /***
	PUBLIC : WeightedHeatMap constructor of the class
	NEEDS :
		- data : array of google.maps.visualization.WeightedLocation, data used to interpolate
		- map : google.maps.Map, map where the data will be show
	RETURNS : the class instanced
***/
function WeightedHeatMap(data, map) {
	this.data = data;
	this.map = map;
	this.interpolationType = 0; // default interpolation type
	this.size = {lat:30, lng:30}; // default size
	this.mesh = {pointLat : null, pointLng : null, pointWei : null};
	this.heatmap = [];
	this.fitBounds();

	var that = this;
	//that.fitBounds();
}

/***
	PUBLIC : Show the array of WeightedLocation on the Map
	NEEDS : 
		- options (optionnal) : HeatmapLayerOptions
	RETURNS :
		- integer : the indice of the new HeatmapLayer in the this.heatmap array of HeatmapLayer
		- boolean : false, if the association fail
***/
WeightedHeatMap.prototype.showOnTheMap = function(options) {
	var options = options || null;
	var toReturn = true;
	try {
		var heatmap = new google.maps.visualization.HeatmapLayer({
			data: this.getTabWeightedLocation()
		});
		heatmap.setMap(this.map);
		if (options != null) {heatmap.setOptions(options);}
		this.heatmap.push(heatmap);
		toReturn = this.heatmap.length - 1;	
	}
	catch(err) {
		console.log("Error: " + err + ".");
		toReturn = false;
	}
	return toReturn;
}

/***
	PUBLIC : Function to interpolate the data
	NEEDS :
		- para (optionnal) : JSON, interpolation's parameters if needed
	RETURNS : boolean
***/
WeightedHeatMap.prototype.interpolate = function(para) {
	switch (this.interpolationType) {
		case 0: return this._inter_nn();
		case 1: return this._inter_lin();
		case 2: return this._inter_inv(para);
		default: return false;
	}
}


/************************************************/
/*** INTER METHODE ******************************/
/************************************************/

/***
	PRIVATE : Function to make the interpolation by nearest neighbor
	NEEDS : null
	RETURNS : boolean
***/
WeightedHeatMap.prototype._inter_nn = function() {
	var toReturn = true;
	try {
		var N = this.data.length;

		// Calculate pointWei(i,j) = weight(nearest):
		for (var i = 0; i < this.size.lat; i++) {
			for (var j = 0; j < this.size.lng; j++) {
				var gap = this.data[0].location.gap(new google.maps.LatLng(this.mesh.pointLat[i], this.mesh.pointLng[j]));
				var bestN = 0;
				for (var n = 1; n < N; n++) {
					temp = this.data[n].location.gap(new google.maps.LatLng(this.mesh.pointLat[i], this.mesh.pointLng[j]));
					if (temp < gap) {
						bestN = n;
						gap = temp;
					}
				}
				this.mesh.pointWei[i][j] = this.data[bestN].weight;
			}
		}
	}
	catch(err) {
		console.log("Error: " + err + ".");
		toReturn = false;
	}
	return toReturn;
}

/***
	PRIVATE : Function to make a linear interpolation between the 2 nearest points
	NEEDS : null
	RETURNS : boolean
***/
WeightedHeatMap.prototype._inter_lin = function() {
	var toReturn = true;
	try {
		var N = this.data.length;

		// Calculate pointWei(i,j) = ponderateMean(weight(2 nearest)):
		for (var i = 0; i < this.size.lat; i++) {
			for (var j = 0; j < this.size.lng; j++) {
	 // Initialisation:
				var gap1 = this.data[0].location.gap(new google.maps.LatLng(this.mesh.pointLat[i], this.mesh.pointLng[j]));
				var gap2 = this.data[1].location.gap(new google.maps.LatLng(this.mesh.pointLat[i], this.mesh.pointLng[j]));
				if (gap1 > gap2) {
					temp = gap1;
					gap1 = gap2;
					gap2 = temp;
					bestN2 = 0;
					bestN1 = 1;
				} else {
					bestN1 = 0;
					bestN2 = 1;
				}
				// Go: gap1 < distance 2
				for (var n = 2; n < N; n++) {
					temp = this.data[n].location.gap(new google.maps.LatLng(this.mesh.pointLat[i], this.mesh.pointLng[j]));
					if (temp < gap1) {
						bestN2 = bestN1;
						gap2 = gap1;
						gap1 = temp;
						bestN1 = n;
					} else if (temp < bestN2) {
						bestN2 = n;
						gap2 = temp;
					}
				}
				this.mesh.pointWei[i][j] = (this.data[bestN1].weight/gap1 + this.data[bestN2].weight/gap2) / (1/gap1+1/gap2);
			}
		}
	}
	catch(err) {
		console.log("Error: " + err + ".");
		toReturn = false;
	}
	return toReturn;
}

/***
	PRIVATE : Function to make an interpolation proportionnel to the inverse of the gap^p
	NEEDS : p
	RETURNS : boolean
***/
WeightedHeatMap.prototype._inter_inv = function(p) {
	var toReturn = true;
	try {
		var N = this.data.length;

		// Calculate pointWei(i,j) = weight(nearest):
		for (var i = 0; i < this.size.lat; i++) {
			for (var j = 0; j < this.size.lng; j++) {
				var NS = 0; // Numerator sum
				var DS = 0; // Deumerator sum
				for (var n = 0; n < N; n++) {
					var S = Math.pow(this.data[n].location.gap(new google.maps.LatLng(this.mesh.pointLat[i], this.mesh.pointLng[j])), p);
					if (S != 0) {
						NS += this.data[n].weight/S;
						DS += 1/S;
					}
				}
				this.mesh.pointWei[i][j] = NS/DS;
			}
		}
	}
	catch(err) {
		console.log("Error: " + err + ".");
		toReturn = false;
	}
	return toReturn;
}


/************************************************/
/*** SETTER *************************************/
/************************************************/

/***
	PUBLIC : Function to set the interpolation's type
	NEEDS :
		- interpolationType : integer, methode used to interpolate (1 : nearest neighbor, 2 : linear, 3 : distance invertion)
	RETURNS : boolean
***/
WeightedHeatMap.prototype.setInterpolationType = function(interpolationType) {
	var interpolationTag = ['nearest', 'linear', 'inverse'];
	if (interpolationTag.indexOf(interpolationType) != -1) {
		this.interpolationType = interpolationTag.indexOf(interpolationType);
		return true;
	}
	var interpolationNumber = [0, 1, 2];
	if (interpolationNumber.indexOf(interpolationType) != -1) {
		this.interpolationType = interpolationType;
		return true;
	}
	return false;
}

/***
	PUBLIC : Function to set the interpolation's bounds :
	NEEDS :
		- bounds : LatLngBounds, zone to do the interpolation
	RETURNS : boolean
***/
WeightedHeatMap.prototype.setBounds = function(bounds) {
	this.bounds = bounds;
	return this._makeMesh();
}

/***
	PUBLIC : Function to calculate the interpolation's bounds to fit with the data
	NEEDS : null
	RETURNS : boolean
***/
WeightedHeatMap.prototype.fitBounds = function() {
	// Calculate the bounds :
	var bounds = new google.maps.LatLngBounds();
	this.data.forEach(function(entry) {
		bounds.extend(entry.location);
	});
	// Set the bounds :
	return this.setBounds(bounds);
}

/***
	PUBLIC : Function to set the interpolation bounds :
	NEEDS :
		- size : {lat:int, lng:int}, size of weighted mesh (number of points : Lat, Lng)
	RETURNS : boolean
***/
WeightedHeatMap.prototype.setSize = function(size) {
	this.size = size;
	return this._makeMesh();
}

/***
	PRIVATE : Function to make the mesh of interpolation :
	NEEDS : null
	RETURNS : boolean
***/
WeightedHeatMap.prototype._makeMesh = function() {
	var toReturn = true;
	try {
		// Calculate the delta in lat and lng:
		deltaLat = Math.abs(this.bounds.getNorthEast().lat() - this.bounds.getSouthWest().lat()) / (this.size.lat-1);
		deltaLon = Math.abs(this.bounds.getNorthEast().lng() - this.bounds.getSouthWest().lng()) / (this.size.lng-1);

		// Create the mesh :
		this.mesh.pointLat = [];
		for (var i = 0; i < this.size.lat; i++) {this.mesh.pointLat.push(this.bounds.getSouthWest().lat() + i*deltaLat);}

		this.mesh.pointLng = [];
		for (var i = 0; i < this.size.lng; i++) {this.mesh.pointLng.push(this.bounds.getSouthWest().lng() + i*deltaLon);}

		this.mesh.pointWei = [];
		for (var i = 0; i < this.size.lng; i++) {this.mesh.pointWei.push(new Array(this.size.lng));}
	}
	catch(err) {
		console.log("Error: " + err + ".");
		toReturn = false;
	}
	return toReturn;
}


/************************************************/
/*** GETTER *************************************/
/************************************************/

/***
	PUBLIC : Function to access to the Mesh
	NEEDS : null
	RETURNS : the mesh = {pointLat : [float], pointLng : [float], pointWei : [float]}
***/
WeightedHeatMap.prototype.getMesh = function() {
	return this.mesh;
}

/***
	PUBLIC : Function to access to the WeightedLocation
	NEEDS : null
	RETURNS : array of WeightedLocation
***/
WeightedHeatMap.prototype.getTabWeightedLocation = function() {
	var tabWeightedLocation = [];
	for (var i = 0; i < this.size.lat; i++) {
		for (var j = 0; j < this.size.lng; j++) {
			var weightedLocation = {
				location:new google.maps.LatLng(this.mesh.pointLat[i], this.mesh.pointLng[j]),
				weight:this.mesh.pointWei[i][j]
			};
			tabWeightedLocation.push(weightedLocation);
		}
	}
	return tabWeightedLocation;
}

/***
	PUBLIC : Function to access to the bounds
	NEEDS : null
	RETURNS : google.maps.LatLngBounds
***/
WeightedHeatMap.prototype.getBounds = function() {
	return this.bounds;
}

/***
	PUBLIC : Function to access to one of the heatmap
	NEEDS :
		- n : integer, indice of the heatmap
	RETURNS :
		- HeatmapLayer : heatmap, if the indice is correct
		- boolean : false, if the indice is not correct
***/
WeightedHeatMap.prototype.getBounds = function(n) {
	if (!isNAN(n) && (n >= 0) && (n < this.heatmap.length)) {
		return this.heatmap[n];
	} else {return false;}
}


/************************************************/
/*** OTHER USED FUNCTION ************************/
/************************************************/

/***
	PUBLIC : Function to calculate the gap between to LatLng
	NEEDS :
		- ll : LatLng, the other one
	RETURNS : float : the gap between the two LatLng
***/
google.maps.LatLng.prototype.gap = function(ll) {
	dLat = this.lat() - ll.lat();
	dLng = this.lng() - ll.lng();
	return Math.sqrt(dLat*dLat + dLng*dLng)
}