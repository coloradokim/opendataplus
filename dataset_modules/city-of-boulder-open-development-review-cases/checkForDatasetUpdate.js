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