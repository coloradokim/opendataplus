/**
 * Created by cellis on 12/21/14.
 */

module.exports = dbutils;

function dbutils() {};


dbutils.prototype.createDocumentById = function(collection, newDocument, callback) {

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

dbutils.prototype.readDocumentById = function(collection, docid, queryOptions, callback) {

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

dbutils.prototype.findRandomDocument = function(collection, queryOptions, callback) {

    //get a count of docs
    global.db.collection(collection).count(function(err, result) {

        //get random value to skip
        var skipCount = Math.floor(Math.random() * (result - 0 + 1) + 0);

        global.db.collection(collection)
            .find(queryOptions.select, {}, {limit:-1, skip:skipCount})
            .toArray(function(err, result) {

                if (result && result.length>0) {
                    callback(err, result[0]);
                } else {
                    callback(err, null);
                }
            });
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
        var keys = _.keys(queryOptions.body);
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
    } else {  //don't need body, just specify the subdoc key
        if (!subdocString || subdocString == "") {
            callback("Error, unset requires one subdocument key", null);
        } else {
            setter[subdocstring] = "";
        }
    }

    //determine which mongo operator to use
    if (mode === "unset") {
        updater = {"$unset": setter};
    } else {
        updater = {"$set": setter};
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