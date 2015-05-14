/**
 * Created by cellis on 10/13/14.
 */

module.exports = Dataset;

function Dataset() {
    this.name = "";  //"lafayette.com-publicart"
    this.org = "orgid";
    this.updateFrequency = "daily"; //frequency to check the publisher/owner source for updates to the dataset
    this.docRetentionTime = 365; //number of days to retain a document after it is deleted by the dataset owner/pubisher
    this.viewApps = {}  //apps that can see this data, view apps can edit their appspace
    this.editApps = {};  //apps that can edit the core data
}


/*

function Dataset(body) {
    this.metadata = getInitialMetaData();
    this.document = body;
    this.appspace = {};
}

function getInitialMetaData() {
    var mdObj = {};
    mdObj.createdTS = Date.now();
    mdObj.updatedTS = mdObj.createdTS;
    mdObj.createdByUser = "userid";
    mdObj.createdByApp = "appid"
    mdObj.lastUpdatedByUser = "userid";
    mdObj.lastUpdatedByApp = "appid"
    mdObj.events = {};
    return mdObj;
}

*/