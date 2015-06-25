/**
 * Created by cellis on 10/13/14.
 */

var should = require('chai').should(),
    checkForUpdates = require('../dataset_modules/city-of-boulder-open-development-review-cases/checkForDatasetUpdate');

describe('development review cases dataset', function(){
    testCallback = function(isUpdated) {
      console.log(isUpdated);
    }

    it('checks for updates', function(done) {
      checkForUpdates(testCallback);
    });
});
