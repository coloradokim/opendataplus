/**
 * Created by cellis on 5/13/15.
 */


/**

 go to the url:

 http://data.opencolorado.org/api/3/action/package_show?id=city-of-boulder-open-development-review-cases

 and in the resulting json,

 result.resources[ where type="geojson" ].revision_timestamp

 if the revision_timestamp is greater than the datasetLastUpdatedTimestamp, then return true

 **/

var http = require('http');

module.exports = checkForUpdates

function _parseJson(cityJson) {
  var updated = false;
  cityJson.result.resources.forEach(function(resource) {
    if(resource.format == "geojson" 
      && Date.parse(resource.revision_timestamp) > Date.parse("2015-06-09")) {
        updated = true;
    }
  });

  return updated;
}

function checkForUpdates(schedulerCallback) {
    
  return http.get({
        host: 'data.opencolorado.org',
        path: '/api/3/action/package_show?id=city-of-boulder-open-development-review-cases'
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {

            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
            var isUpdated = _parseJson(parsed);
            schedulerCallback(isUpdated);
        });
    });
}
