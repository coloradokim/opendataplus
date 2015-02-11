/**
 * Created by cellis on 12/21/14.
 */
'use strict';

var dbutils = require('../util/dbutils');
var appspaceModel = require('./appspace_model');
var docMetaModel = require('../docs/doc_meta_model');
var getReqQuery = require('../util/apiutils').getRequestQuery;
var respond = require('../util/apiutils').respond;

var DB_COLLECTION = "apps";

module.exports.loadRoutes = function(router) {

    /***************************
     *  apps collection
     ***************************/

    //search in the collection
    router.get('/apps/:appid/appspace', function(req, res, next) {
        DB_COLLECTION = "as"+req.param("appid");
        dbutils.findDocument(DB_COLLECTION, getReqQuery(req, 2), function(err, result) {
            respond(req, res, next, err, result);
        });
    });

    //add a document to the collection
    router.post('/apps/:appid/appspace', function(req, res, next) {
        DB_COLLECTION = "as"+req.param("appid");
        var newDoc = makeDoc(req);
        dbutils.createDocument(DB_COLLECTION, newDoc, function(err, result) {
            respond(req, res, next, err, result);
        });
    });


    /***************************
     *  app documents
     ***************************/

    //get an existing document by id
    router.get('/apps/:appid/appspace/:docid', function(req, res, next) {
        DB_COLLECTION = "as"+req.param("appid");
        dbutils.findDocumentById(DB_COLLECTION, req.param("docid"), getReqQuery(req, 4), function (err, result) {
            respond(req, res, next, err, result);
        });
    });

    //get a subdocument of an existing document by id
    router.get('/apps/:appid/appspace/:docid/*', function(req, res, next) {
        DB_COLLECTION = "as"+req.param("appid");
        dbutils.findDocumentById(DB_COLLECTION, req.param("docid"), getReqQuery(req, 4), function(err, result) {
            respond(req, res, next, err, result);
        });
    });

    //replace an existing document with a new object
    router.put('/apps/:appid/appspace/:docid', function(req, res, next) {
        DB_COLLECTION = "as"+req.param("appid");
        dbutils.updateDocumentById(DB_COLLECTION, req.param("docid"), getReqQuery(req, 4), function (err, result) {
            respond(req, res, next, err, result);
        });
    });

    //partial update an existing document
    router.patch('/apps/:appid/appspace/:docid', function(req, res, next) {
        DB_COLLECTION = "as"+req.param("appid");
        dbutils.updateDocumentById(DB_COLLECTION, req.param("docid"), getReqQuery(req, 4), function (err, result) {
            respond(req, res, next, err, result);
        });
    });

    //partial update an existing document
    //router.patch('/datasets/:datasetid/DATA', function(req, res, next) {
    //    dbutils.updateDocumentById(DB_COLLECTION, req.param("userid"), getReqQuery(req, 4), function (err, result) {
    //        respond(req, res, next, err, result);
    //    });
    //});

    //delete an existing document
    router.delete('/apps/:appid/appspace/:docid', function(req, res, next) {
        DB_COLLECTION = "as"+req.param("appid");
        dbutils.deleteDocumentById(DB_COLLECTION, req.param("docid"), function(err, result) {
            respond(req, res, next, err, result);
        });
    });

};

function makeDoc(req) {
    var newDoc = req.body;
    newDoc.metadata = new docMetaModel();
    newDoc.metadata.history[Date.now()] = "new document created";
    return newDoc;
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