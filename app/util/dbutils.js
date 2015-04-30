/**
 * Created by cellis on 12/21/14.
 */
var ObjectID = require('mongodb').ObjectID;

module.exports = new dbutils;

function dbutils() {};


dbutils.prototype.createDocument = function(collection, newDocument, callback) {

    global.db.collection(collection)
        .insert(newDocument, function(err, result) {
            //return the assigned id or null if nothing was inserted
            if (result && result.length > 0) {
                result = {_id:result[0]._id};
            } else {
                result = null;
            }
            callback(err, result);
        });
}

dbutils.prototype.findDocumentById = function(collection, docid, queryOptions, callback) {

    var selector = { _id: new ObjectID(docid) };

    //lookup doc in db
    global.db.collection(collection)
        .find(selector, {}, queryOptions.options)
        .toArray(function(err, result) {

            if (err) {
                callback(err, result);
            } else if (!result || result.length == 0) {
                callback("No document found for id: " + docid, null);
            } else {
                //we have something from the db, prep it and send it
                var resultObj = result[0];

                //prune the object if caller only requested a specific object
                if (queryOptions.fieldsArray && queryOptions.fieldsArray.length > 0) {

                    // caching the length and index for loop
                    var len = queryOptions.fieldsArray.length,
                        i = 0;

                    for (i = 0; i < len; i += 1) {
                        resultObj = resultObj[queryOptions.fieldsArray[i]];
                    }
                }

                //return the results
                callback(err, resultObj);
            }
        });

}

dbutils.prototype.findDocument = function(collection, queryOptions, callback) {

    //go look in mongo
    db.collection(collection)
        .find(queryOptions.select, {}, queryOptions.options)
        .toArray(function(err, result) {
            callback(err, result);
        });

}

// Method to keep track of the number of calls to the .collection.find method in
// in the function below
var objToCollectCount = 0;
//function objCollectCB(err, objRemainingCount, result) {
//}

dbutils.prototype.findRandomDocument = function(collection, queryOptions, callback) {

    // Check if more than one random number of documents have been requested
    console.log("From dbutils findRandomDocument queryOptions =", queryOptions);

    // Let us see how many random objects are being requested (the 'limit' parameter
    // specifies that).
    randomObjCount = queryOptions.options.limit
    
    // get a count of docs
    global.db.collection(collection).count(function(err, result) {
        // Check if the number of requested objects is 1 or more
        if (randomObjCount == 1) {
            // Just a single random object is being requested
            // get random value to skip
            var skipCount = Math.floor(Math.random() * result);
             
            global.db.collection(collection)
                .find(queryOptions.select, {}, {limit:1, skip:skipCount})
                .toArray(function(err, result) {
                    if (result && result.length>0) {
                        callback(err, result[0]);
                    } else {
                        callback(err, null);
                    }
                });
        } else {
            // If the requested count exceeds the number of records in the database,
            // return the entire collection in random order
            if (randomObjCount > result) {
                randomObjCount = result;
            }
            console.log("The total number of random entries being fetched are:", randomObjCount);
            // Now, create a set of random values to skip for each query
            var skipCountArr = [];
            for (i = 0; i < randomObjCount; i++) {
                skipCount = Math.floor(Math.random() * result);
                while (skipCountArr.indexOf(skipCount) != -1) {
                    skipCount = Math.floor(Math.random() * result);
                }
                skipCountArr[i] = skipCount;
            }
            console.log("The indices being fetched are:", skipCountArr);
            // Now loop around once again to do a .find on the DB and collect the
            // requested number of records
            var objArr = [];
            objToCollectCount = randomObjCount;
            for (i = 0; i < randomObjCount; i++) {
                console.log("Fetching document with skipCount:", skipCountArr[i]);
                global.db.collection(collection)
                    .find(queryOptions.select, {}, {limit:1, skip:skipCountArr[i]})
                    .toArray(function(err, result) {
                        if (result && result.length>0) {
                            objArr[randomObjCount-objToCollectCount] = result[0];
                            objToCollectCount--;
//                            console.log("Number of documents found so far:", randomObjCount-objToCollectCount);
//                            console.log("Number of documents still pending:", objToCollectCount);
                            console.log("Document fetched successfully. ID:", result[0]._id);
                        } else {
                            objArr[randomObjCount-objToCollectCount] = err;
                            objToCollectCount--;
                            console.log("Error encountered in fetching object. Error:", err);
                        }
                        if (objToCollectCount == 0) {
                            console.log("All documents found. The objArr is:", objArr);
                            callback(err, objArr)
                        }
                    });
            }
        }
    });
}

/*
 * defaults to doing a "set" operation on the document or subdocument.  an unset operation
 * can be specified by setting queryOptions.mode = "unset"
 */
dbutils.prototype.updateDocumentById = function(collection, docid, queryOptions, callback) {

    //select by id
    var selector = { _id: new ObjectID(docid) };

    //determine which mongo operator to use
    var mode = "set";
    if (queryOptions && queryOptions.mode && "unset".localeCompare(queryOptions.mode)) {
        mode = "unset";
    } else if (queryOptions && queryOptions.mode && "put".localeCompare(queryOptions.mode)) {
        mode = "put";
    }

    //build the updater object
    var updater = {};
    var subdocString = "";
    var firstloop = true;
    for (var i = 0; i < queryOptions.fieldsArray.length; i++) {
        if (!firstloop) subdocString += ".";
        subdocString += queryOptions.fieldsArray[i];
        firstloop = false;
    }
    var setter = {};
    if (mode === "set") { //process keys in body
        var keys = Object.keys(queryOptions.body);
        if (keys.length < 1) {
            callback("nothing to update", null);
            return;
        }
        for (var i = 0; i < keys.length; i++) {
            if (subdocString != "") {
                setter[subdocString + "." + keys[i]] = queryOptions.body[keys[i]];
            } else {
                setter[keys[i]] = queryOptions.body[keys[i]];
            }
        }
    } else if (mode === "unset") {  //don't need body, just specify the subdoc key
        if (!subdocString || subdocString == "") {
            callback("Error, unset requires one subdocument key", null);
        } else {
            setter[subdocstring] = "";
        }
    }

    //determine which mongo operator to use
    if (mode === "unset") {
        updater = {"$unset": setter};
    } else if (mode === "set") {
        updater = {"$set": setter};
    } else if (mode === "put") {
        updater = queryOptions.body;
    }

    //lookup user in db
    global.db.collection(collection)
        .update(selector, updater, function(err, result) {
            callback(err,{"docsUpdated": result});
        });
}

/*
 *
 */
dbutils.prototype.deleteDocumentById = function(collection, docid, callback) {

    var selector = { _id: new ObjectID(docid)};

    //lookup doc in db
    global.db.collection(collection)
        .remove(selector, {justOne:true}, function(err,result) {
            callback(err, {"docsDeleted": result});
        });
}
