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

var request = require('request');
var mongo = require('mongoskin');

global.db = mongo.db("mongodb://localhost/c3po",{native_parser:true});

module.exports = checkForUpdates

function _findLastUpdated(revision_timestamp, schedulerCallback) {
  db.findOne({lastUpdated: {$gt: revision_timestamp}}, function(lastUpdated) {
    if(lastUpdated != null) {
      schedulerCallback(true);
    }
    schedulerCallback(false);
  });
}

function _parseJson(cityJson, schedulerCallback) {
  var updated = false;
  var revision_timestamp;
  cityJson.result.resources.some(function(resource) {
    if(resource.format == "geojson") { 
      revision_timestamp = Date.parse(resource.revision_timestamp);
      return true;
    }
    return false;
  });

  _isUpdated(revision_timestamp, schedulerCallback);
}

function checkForUpdates(schedulerCallback) {
    
  return request.get('https://data.opencolorado.org/api/3/action/package_show?id=city-of-boulder-open-development-review-cases'
    , function(err, response, body) {
            if(err) {
              console.log(err);
              return;
            }
            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
            _parseJson(parsed, schedulerCallback);
        }
    );
}
