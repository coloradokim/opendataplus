/**
 * Created by cellis on 10/13/14.
 */

module.exports = DatasetElement;

function DatasetElement(body) {
    this.metadata = getInitialMetaData();
    this.document = body;
    this.appspace = {};
}

function getInitialMetaData() {
    var mdObj = {};
    mdObj.createdTS = Date.now();
    mdObj.updatedTS = mdObj.createdTS;
    mdObj.createdByUser = "userid";
    mdObj.createdByApp = "appid";
    mdObj.lastUpdatedByUser = "userid";
    mdObj.lastUpdatedByApp = "appid";
    mdObj.events = {};
    return mdObj;
}

