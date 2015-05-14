/**
 * Created by cellis on 2/10/15.
 */

var fs = require('fs');

var mongo = require('mongoskin');


global.db = mongo.db("mongodb://ds051970.mongolab.com:51970/odp",{native_parser:true});
var dbAuthDone = false;
global.db.authenticate("odp", "Hack4art", function(error, result) {
    console.log("RESULT FROM DB authentication:", error, result)
    dbAuthDone = true;
});
while (!dbAuthDone) {
    require('deasync').runLoopOnce();
}




var obj = JSON.parse(fs.readFileSync('lafayette-co-public-art.json', 'utf8'));

console.log("starting inserts");
for (var i=0; i<obj.length; i++) {

    //TODO:  support adding a jpeg file in the "obj" object

    var dbdone = false;
    db.collection("ds54daba1dc4612d9306ba68d1").insert(obj[i], function(err,result){
        console.log (err, result);
        dbdone = true;
    })
    while (!dbdone) {
        require('deasync').runLoopOnce();
    }
}

process.exit();
