 /***
	PUBLIC : WeightedHeatMap constructor of the class
	NEEDS :
		- data : array of LatLng, data used to interpolate
		- size : [integer, integer], size of weighted mesh (number of points : Lat, Lng)
	RETURNS : the class instanced
***/
function WeightedHeatMap(data, size) {
	this.interpolationType = interpolationType;
	this.data = data;
	this.size = size;
}

/***
	PUBLIC : Function to interpolate the data
	NEEDS :
		- para (optionnal) : JSON, interpolation's parameters if needed
	RETURNS : boolean
***/
WeightedHeatMap.prototype.interpolate = function() {

}

/***
	PUBLIC : Function to access to the Mesh
	NEEDS : null
	RETURNS : the mesh
***/
WeightedHeatMap.prototype.getMesh = function() {

}

/***
	PUBLIC : Function to access to the WeightedLocation
	NEEDS : null
	RETURNS : array of WeightedLocation
***/
WeightedHeatMap.prototype.getWeightedLocation = function() {

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

}


/************************************************/
/*** SETTER *************************************/
/************************************************/

/***
	PUBLIC : Function to set the interpolation's type
	NEEDS :
		- interpolationType : integer, methode used to interpolate (1 : nearest neighbor, 2 : linear, 3 : distance invertion)
	RETURNS : null
***/
WeightedHeatMap.prototype.setInterpolationType = function(interpolationType) {
	this.interpolationType = interpolationType;
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
	PUBLIC : Function to set the interpolation bounds :
	NEEDS :
		- size : [integer, integer], size of weighted mesh (number of points : Lat, Lng)
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
	
}