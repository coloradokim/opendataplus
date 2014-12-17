var test_JSON = require('../models/test_JSON.js');
var geocoder = require('geocoder');

var api = {
	geoData: function(req, res) {
		var geo = {};
		var placeInfo = '2100 22nd st, Boulder, CO';
		geocoder.geocode(placeInfo,function(err, data){
			// var lat = data.results[0].geometry.location.lat;
			// var lng = data.results[0].geometry.location.lng;
			
			geo = data;
			console.log('this console.log is in the api: ', geo);
			// function(results){
				// res.send(geo);//what we want it to be
			rer.send({ results: 
			   [ { address_components: [Object],
			       formatted_address: '2100 22nd Street, Boulder, CO 80302, USA',
			       geometry: [Object],
			       types: [Object] } ],
			  status: 'OK' })//fake API call
			res.send(geo);
			// };
		})
	}
};

module.exports = api;