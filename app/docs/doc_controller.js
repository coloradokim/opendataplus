/**
 * Created by cellis on 12/21/14.
 */
'use strict';

var dbutils = require('../util/dbutils');
var DocModel = require('./doc_model');
var getReqQuery = require('../util/apiutils').getRequestQuery;
var respond = require('../util/apiutils').respond;

var DB_COLLECTION = "datasets";

module.exports.loadRoutes = function(router) {

    /***************************
     *  dataset collection
     ***************************/

    //search in the collection
    router.get('/datasets/:datasetid/docs', function(req, res, next) {
        DB_COLLECTION = "ds"+req.param("datasetid");
        dbutils.findDocument(DB_COLLECTION, getReqQuery(req, 2), function(err, result) {
            respond(req, res, next, err, result);
        });
    });

    //add a document to the collection
    router.post('/datasets/:datasetid/docs', function(req, res, next) {
        DB_COLLECTION = "ds"+req.param("datasetid");
        var newDoc = makeDatasetDoc(req);
        dbutils.createDocument(DB_COLLECTION, newDoc, function(err, result) {
            respond(req, res, next, err, result);
        });
    });

    //find a random document from the collection
    router.get('/datasets/:datasetid/docs/random', function(req, res, next) {
        DB_COLLECTION = "ds"+req.param("datasetid");
        dbutils.findRandomDocument(DB_COLLECTION, getReqQuery(req, 2), function(err, result) {
            respond(req, res, next, err, result);
        });
    });

    //get an existing document by id
    router.get('/datasets/:datasetid/docs/:docid', function(req, res, next) {
        //if (authorizeDataset(req.appid, DB_COLLECTION)) {
            DB_COLLECTION = "ds"+req.param("datasetid");
            dbutils.findDocumentById(DB_COLLECTION, req.param("docid"), getReqQuery(req, 4), function (err, result) {
                respond(req, res, next, err, result);
            });
       // } else {
       //     respond(req, res, next, "App ("+req.appid+") not authorized to dataset ("+DB_COLLECTION+")", null);
       // }
    });

    //get a subdocument of an existing document by id
    router.get('/datasets/:datasetid/docs/:docid/*', function(req, res, next) {
        DB_COLLECTION = "ds"+req.param("datasetid");
        dbutils.findDocumentById(DB_COLLECTION , DB_COLLECTION, getReqQuery(req, 2), function(err, result) {
            respond(req, res, next, err, result);
        });
    });

    //replace an existing document with a new object
    router.put('/datasets/:datasetid/docs/:docid', function(req, res, next) {
        DB_COLLECTION = "ds"+req.param("datasetid");
        dbutils.updateDocumentById(DB_COLLECTION, getReqQuery(req, 2), function (err, result) {
            respond(req, res, next, err, result);
        });
    });

    //partial update an existing document
    router.patch('/datasets/:datasetid/docs/:docid', function(req, res, next) {
        DB_COLLECTION = "ds"+req.param("datasetid");
        dbutils.updateDocumentById(DB_COLLECTION, getReqQuery(req, 2), function (err, result) {
            respond(req, res, next, err, result);
        });
    });

    //partial update an existing document
    router.patch('/datasets/:datasetid/docs/:docid/*', function(req, res, next) {
        DB_COLLECTION = "ds"+req.param("datasetid");
        dbutils.updateDocumentById(DB_COLLECTION, getReqQuery(req, 2), function (err, result) {
            respond(req, res, next, err, result);
        });
    });

    //delete an existing document
    router.delete('/datasets/:datasetid/docs/:docid', function(req, res, next) {
        DB_COLLECTION = "ds"+req.param("datasetid");
        dbutils.deleteDocumentById(DB_COLLECTION, DB_COLLECTION, function(err, result) {
            respond(req, res, next, err, result);
        });
    });

};

function makeDatasetDoc(req) {
    var makeDatasetDoc = new DocModel(req.body);
    return makeDatasetDoc;
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