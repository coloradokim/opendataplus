/**
 * Created by cellis on 12/21/14.
 */

/**
 * Created by cellis on 11/12/14.
 */

'use strict';

module.exports.HandleResponse = HandleResponse;
module.exports.respond = respond;
module.exports.getRequestQuery = getRequestQuery;

function getRequestQuery(req, baseUrlLength) {

    var path = req.path;
    var queryStrings = req.query;

    var queryObject = {};

    //initialize to query all results, all fields, all documents
    queryObject.options = {};
    queryObject.options.limit = 20; //100;
    queryObject.options.skip = 0;
    queryObject.fields = {};
    queryObject.select = {};

    //process query strings
    var keys = Object.keys(queryStrings);
    for (var i=0; i<keys.length; i++) {
        if (keys[i] == "limit") {
            queryObject.options.limit = queryStrings[keys[i]];
        } else if (keys[i] == "skip") {
            queryObject.options.skip = queryStrings[keys[i]];
        } else if (keys[i] == "sort") {
            queryObject.options.sort = getSort(queryString[keys[i]]);
        } else if (keys[i] != "_" && keys[i] != "callback") {
            //querystring is part of the selction criteria or bogus so add it to selection criteria anyway
            queryObject.select[keys[i]] = queryStrings[keys[i]];
        }
    }

    //process subdoc selection
    var fieldsArr = getSubDocFields(path, baseUrlLength);
    if (fieldsArr && fieldsArr != null) {
        queryObject.fieldsArray = fieldsArr;
    }

    //grab the body
    queryObject.body = req.body;

    return queryObject;
}



function getSort(queryStirngs) {
    //get query options
    if (queryStrings.sort) {
        var sort = [];
        var fieldpairs = queryStrings.sort.split(',');
        fieldpairs.forEach(function (val) {
            var fieldparts = val.split(':');
            if (!fieldparts[1]) {
                fieldparts[1] = '1'
            }
            sort.push([fieldparts[0], fieldparts[1]]);
        });
        return sort;
    }
}

function getSubDocFields(path, baseUrlLength) {
    //get fields - all the fields specified in the url after baseURLLength
    var fieldString;
    var fieldArray = [];
    var n = 0;
    var urlParts = path.split(/\//);
    //ignore the first urlBaseLength because they define the document plus 1 for the initial forward slash
    var firstField = true;
    for (var j = baseUrlLength + 1; j < urlParts.length; j++) {
        if (urlParts[j].length > 0) {
            fieldArray[n++] = urlParts[j];
            if (firstField) {
                fieldString = urlParts[j];
                firstField = false;
            } else {
                fieldString += "." + urlParts[j];
            }
        }
    }

    //if (fieldString) {
    return fieldArray;
    //}
}



/*
 * Return API call results to the caller, if they ask for HTML, send it, else default to JSON
 */
function HandleResponse(req, res, result) {
    //return results, default to jsonp unless html is specified
    console.log("UPDATE ME!!"+req.accepts('html,json'));
    switch (req.accepts('html,json')) {
        case 'html':
            //return human readable html
            res.render(element, result);
            break;
        default:  //json
            //return jsonp
            res.jsonp(result);
    }
}

/*
 * Return API call results to the caller, if they ask for HTML, send it, else default to JSON
 */
function respond(req, res, next, err, result) {
    //return results, default to jsonp unless html is specified
    switch (req.accepts('html,json')) {
        case 'html':
            //return human readable html
            res.render(element, result);
            break;
        default:  //json
            //return jsonp
            if (err) next(err);
            else res.jsonp(result);
    }
}
