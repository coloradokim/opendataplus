/**
 * Created by sshekhar22 on 11/11/14.
 */
'use strict';

var dbutils = require('../util/dbutils');
var userModel = require('./user_model');
var getReqQuery = require('../util/apiutils').getRequestQuery;
var respond = require('../util/apiutils').respond;
var ObjectID = require('mongodb').ObjectID;

var DB_COLLECTION = "users";

module.exports.loadRoutes = function(router) {

    /***************************
     *  apps collection
     ***************************/

        //search in the collection
    router.get('/users', function (req, res, next) {
        dbutils.findDocument(DB_COLLECTION, getReqQuery(req, 1), function (err, result) {
            respond(req, res, next, err, result);
        });
    });

    //search in the collection
    router.get('/users/:userid', function (req, res, next) {
        dbutils.findDocumentById(DB_COLLECTION, req.param("userid"), getReqQuery(req, 2), function (err, result) {
            respond(req, res, next, err, result);
        });
    });

    //add a document to the collection
    router.post('/users', function (req, res, next) {
        var newUser = new userModel(req.body);
        dbutils.createDocument(DB_COLLECTION, newUser, function (err, result) {
            respond(req, res, next, err, result);
        });
    });

    //replace a document to the collection
    router.put('/users/:userid', function (req, res, next) {
        var queryOptions = getReqQuery(req);
        queryOptions.mode = "put";  //this mode will replace the document in the collection with the body
        dbutils.updateDocumentById(DB_COLLECTION, req.param("userid"), queryOptions, function (err, result) {
            respond(req, res, next, err, result);
        });
    });

    //update a document to the collection
    router.patch('/users/:userid', function (req, res, next) {
        var queryOptions = getReqQuery(req);
        dbutils.updateDocumentById(DB_COLLECTION, req.param("userid"), queryOptions, function (err, result) {
            respond(req, res, next, err, result);
        });
    });

}


