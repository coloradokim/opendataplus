/**
 * Created by cellis on 12/21/14.
 */
'use strict';

var dbutils = require('../util/dbutils');
var appModel = require('./app_model');
var getReqQuery = require('../util/apiutils').getRequestQuery;
var respond = require('../util/apiutils').respond;

var DB_COLLECTION = "apps";

module.exports.loadRoutes = function(router) {

    /***************************
     *  apps collection
     ***************************/

    //search in the collection
    router.get('/apps', function(req, res, next) {
        dbutils.findDocument(DB_COLLECTION, getReqQuery(req, 2), function(err, result) {
            respond(req, res, next, err, result);
        });
    });

    //add a document to the collection
    router.post('/apps', function(req, res, next) {
        var newApp = makeApp(req);
        dbutils.createDocument(DB_COLLECTION, newApp, function(err, result) {
            respond(req, res, next, err, result);
        });
    });


    /***************************
     *  app documents
     ***************************/

    //get an existing document by id
    router.get('/apps/:appid', function(req, res, next) {
        dbutils.findDocumentById(DB_COLLECTION, req.param("appid"), getReqQuery(req, 2), function (err, result) {
            respond(req, res, next, err, result);
        });
    });

    //get a subdocument of an existing document by id
    router.get('/apps/:appid', function(req, res, next) {
        dbutils.findDocumentById(DB_COLLECTION, req.param("appid"), getReqQuery(req, 2), function(err, result) {
            respond(req, res, next, err, result);
        });
    });

    //replace an existing document with a new object
    router.put('/apps/:appid', function(req, res, next) {
        dbutils.updateDocumentById(DB_COLLECTION, req.param("appid"), getReqQuery(req, 2), function (err, result) {
            respond(req, res, next, err, result);
        });
    });

    //partial update an existing document
    router.patch('/apps/:appid', function(req, res, next) {
        dbutils.updateDocumentById(DB_COLLECTION, req.param("appid"), getReqQuery(req, 2), function (err, result) {
            respond(req, res, next, err, result);
        });
    });

    //delete an existing document
    router.delete('/apps/:appid', function(req, res, next) {
        dbutils.deleteDocumentById(DB_COLLECTION, req.param("appid"), function(err, result) {
            //also cleanup the appspace if one exists
            var dbDropDone = false;
            global.db.collection(collection).drop(function(err2, result2) {
                dbDropDone = true;
                //TODO:  what to do with an error here?
            });
            while (!dbDropDone) {
                require('deasync').runLoopOnce();
            }
            respond(req, res, next, err, result);
        });
    });

};

function makeApp(req) {
    var newapp = new appModel(req.body);

    //TODO:  validate we have a name and get the owner userid and email from the current user (of the admin gui)

    return newapp;
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