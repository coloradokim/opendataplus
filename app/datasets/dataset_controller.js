/**
 * Created by cellis on 12/21/14.
 */
'use strict';

var dbutils = require('../util/dbutils');
var datasetModel = require('./dataset_model');
var getReqQuery = require('../util/apiutils').getRequestQuery;
var respond = require('../util/apiutils').respond;

var DB_COLLECTION = "datasets";

module.exports.loadRoutes = function(router) {

    /***************************
     *  dataset collection
     ***************************/

    //search in the collection
    router.get('/datasets', function(req, res, next) {
        dbutils.findDocument(DB_COLLECTION, getReqQuery(req, 2), function(err, result) {
            respond(req, res, next, err, result);
        });
    });

    //add a document to the collection
    router.post('/datasets', function(req, res, next) {
        var newDS = makeDataset(req);
        dbutils.createDocument(DB_COLLECTION, newDS, function(err, result) {
            respond(req, res, next, err, result);
        });
    });

    //find a random document from the collection
    router.get('/datasets/random', function(req, res, next) {
        dbutils.findRandomDocument(DB_COLLECTION, getReqQuery(req, 2), function(err, result) {
            respond(req, res, next, err, result);
        });
    });

    /***************************
     *  dataset documents
     ***************************/

    //get an existing document by id
    router.get('/datasets/:datasetid', function(req, res, next) {
        if (authorizeDataset(req.appid, req.param("datasetid"))) {
            dbutils.findDocumentById(DB_COLLECTION, req.param("datasetid"), getReqQuery(req, 2), function (err, result) {
                respond(req, res, next, err, result);
            });
        } else {
            respond(req, res, next, "App ("+req.appid+") not authorized to dataset ("+req.param("datasetid")+")", null);
        }
    });

    //get a subdocument of an existing document by id
    router.get('/datasets/:datasetid/DATA', function(req, res, next) {
        dbutils.findDocumentById(DB_COLLECTION, req.param("datasetid"), getReqQuery(req, 2), function(err, result) {
            respond(req, res, next, err, result);
        });
    });

    //replace an existing document with a new object
    router.put('/datasets/:datasetid', function(req, res, next) {
        dbutils.updateDocumentById(req.param("datasetid"), getReqQuery(req, 2), function (err, result) {
            respond(req, res, next, err, result);
        });
    });

    //partial update an existing document
    router.patch('/datasets/:datasetid', function(req, res, next) {
        dbutils.updateDocumentById(req.param("userid"), getReqQuery(req, 2), function (err, result) {
            respond(req, res, next, err, result);
        });
    });

    //partial update an existing document
    router.patch('/datasets/:datasetid/DATA', function(req, res, next) {
        dbutils.updateDocumentById(req.param("userid"), getReqQuery(req, 2), function (err, result) {
            respond(req, res, next, err, result);
        });
    });

    //delete an existing document
    router.delete('/datasets/:datasetid', function(req, res, next) {
        dbutils.deleteDocumentById(DB_COLLECTION, req.param("datasetid"), function(err, result) {
            respond(req, res, next, err, result);
        });
    });

};

function makeDataset(req) {
    var newDataset = new DatasetModel(req.body);
    return newDataset;
}


/*
 *
 */
function authorize(appid, datasetid, accessLevel) {
    var result = false;
    var accessNum = 0; //no access

    if (accessLevel === "view") accessNum = 1;
    if (accessLevel === "edit") accessNum = 2;
    if (accessLevel === "admin") accessNum = 3;

    //get dataset
    var queryOptions = {};
    queryOptions.fieldsArray = ["apps"];
    dbutils.findDocumentById(DB_COLLECTION, datasetid, queryOptions, function(err, result) {
        if (result[appid] && result[appid] >= accessNum) {
            return true;
        } else {
            return false;
        }
    })

    return result;
}


/*
 * setup an app id as able to view or edit this dataset
 */
function registerApp(datasetid, appid, role, callback) {
    var queryOptions = {};
    queryOptions.body = {};
    queryOptions.body[appid] = "enabled";

    if ("view".localeCompare(role) == 0) {
         queryOptions.fieldsArray = ["viewApps"];
    } else if ("edit".localeCompare(role)) {
        queryOptions.fieldsArray = ["editApps"];
    } else {
        callback ("Unsupported role type: " + role, null);
    }
    dbutils.updateDocumentById(DB_COLLECTION, datasetid, queryOptions, function(err, result) {
        callback(err, result);
    });
}

/*
 * remove an app id as able to view or edit this dataset
 */
function deregisterApp(datasetid, appid, role, callback) {
    var queryOptions = {};
    queryOptions.mode = "unset";
    queryOptions.body = {};

    if ("view".localeCompare(role) == 0) {
        queryOptions.fieldsArray = ["viewApps", appid];
    } else if ("edit".localeCompare(role)) {
        queryOptions.fieldsArray = ["editApps", appid];
    } else {
        callback ("Unsupported role type: " + role, null);
    }
    dbutils.updateDocumentById(DB_COLLECTION, datasetid, queryOptions, function(err, result) {
        callback(err, result)
    });
}