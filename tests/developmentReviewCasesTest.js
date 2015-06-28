/**
 * Created by cellis on 10/13/14.
 */

var should = require('chai').should(),
    request = require('request'),
    sinon = require('sinon'),
    checkForUpdates = require('../dataset_modules/city-of-boulder-open-development-review-cases/checkForDatasetUpdate');

describe('development review cases dataset', function(){

    it('detects if dataset has not been updated', function(done) {
      var fakePackageShowResponse = { 
          result: { 
            resources: [
            { format: "geojson", revision_timestamp: "2015-06-08" }
            ]
          }
      };
      sinon
        .stub(request, 'get')
        .yields(null, null, JSON.stringify(fakePackageShowResponse));
      var testCallback = function(isUpdated) {
        isUpdated.should.not.be.true;
        request.get.restore();
        done();
      };
      checkForUpdates(testCallback);
    });

    it('detects if dataset has been updated', function(done) {
      var fakePackageShowResponse = { 
          result: { 
            resources: [
            { format: "geojson", revision_timestamp: "2015-06-18" }
            ]
          }
      };
      sinon
        .stub(request, 'get')
        .yields(null, null, JSON.stringify(fakePackageShowResponse));
      var testCallback = function(isUpdated) {
        isUpdated.should.be.true;
        request.get.restore();
        done();
      };
      checkForUpdates(testCallback);
    });
});
