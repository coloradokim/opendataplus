/**
 * Created by cellis on 10/13/14.
 */

var should = require('chai').should(),
    checkForUpdates = require('../dataset_modules/city-of-boulder-open-development-review-cases/checkForDatasetUpdate');

describe('development review cases dataset', function(){

    it('checks for updates', function(done) {
      testCallback = function(isUpdated) {
        done();
      };
      checkForUpdates(testCallback);
    });
});
