/***
	Interpolation class constructor :
		- data : array of LatLng, data used to interpolate
		- type : integer, methode used to interpolate (1 : nearest neighbor, 2 : linear, 3 : distance invertion)
		- bounds : LatLngBounds, zone to do the interpolation
		- size : [integer, integer], size of the interpolation mesh (number of points : Lat, Lng)
***/
function Interpolation(data, interpolationType, bounds, size) {
	this.interpolationType = interpolationType;
	this.data = data;
	this.bounds = bounds;
	this.size = size;
	this.makeMesh();
}

/***
	Function to change the interpolation type
***/
Interpolation.prototype.setInterpolationType = function(interpolationType) {
	this.interpolationType = interpolationType;
}

/***
	Function to make the mesh of interpolation :
		- size (optionnal) : [integer, integer], size of the interpolation mesh (number of points : Lat, Lng)
***/
Interpolation.prototype.makeMesh = function(size) {

}

/***
	Function to interpolate the data
***/
Interpolation.prototype.interpolate = function() {

}

Interpolation.prototype.inter_nn = function() {

}

/***
	Function to acces the Mesh
***/
Interpolation.prototype.getMesh = function() {

}

/***
	Function to access the WeightedLocation
	Return a array of WeightedLocation
***/
Interpolation.prototype.getWeightedLocation = function() {

}