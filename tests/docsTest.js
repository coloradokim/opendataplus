/**
 * Created by cellis on 10/13/14.
 */

var should = require('chai').should(),
    supertest = require('supertest'),
    api = supertest('http://localhost:3001'),
    http = require('http');

describe('docs api', function(){
    var app = require('../app');
    var testappid = "";
    var testdocid = "";
    var server = {};

    before(function(){


        var asyncDone = false;
        global.db.authenticate("odp", "Hack4art", function (error, result) {
            console.log("RESULT FROM DB authentication:", error, result);
            asyncDone = true;
        });
        while (!asyncDone) {
            require('deasync').runLoopOnce();
        }

        server = http.createServer(app).listen(3001);

    });

    it('can create a test app to put an appspace in', function(done) {
        api.post('/apps')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ name: "testapp1" })
            .expect(function(res) {
                console.log("APP POST BEFORE RESULT: " + JSON.stringify(res.body, null, 4));
                testappid = res.body._id;
		console.log("TESTAPPID: " + testappid);
                if (!res.body._id) {
                    console.log("AAHHH, app post failed");
                    throw "no id found in response: " + res.body.toString();
                }
                asyncDone1 = true;
            })
	    .end(function(res, err) {console.log("Got to the end of 'can create a test app to put an appaspace in'")});
	done();
    });

    describe('is dependent on testappid', function(){
        // Polls `testappid` every 100ms
        var check = function(done) {
          if (testappid) done();
          else setTimeout( function(){ check(done) }, 100 );
        }
       
        before(function( done ){
          check( done );
        });

	it('can insert a new appspace document from a post', function(done) {
            api.post('/apps/' + testappid + '/appspace/')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send({ name: "game12345" })
                .expect(function(res) {
                    testdocid = res.body._id;
                    if (!res.body._id) throw "no id found in response: " + res.body.toString();
                })
                .expect(201,done)
	        .end(function(res, err) {});
	    done();
        });

	it('can get a list of elements', function(done) {
            api.get('/apps/' + testappid + '/appspace')
                .expect(200, done)
         	    .end(function(res, err) {console.log("Got to the end of 'can get a list of elements'")});
         	done();
        });
         

        it('can get the new element', function(done) {
	    api.get('/apps/' + testappid + '/appspace/' + testdocid)
		.expect(200,done)
		    .end(function(res, err) {});
		done();
	});
	 
	/*
	it('can update an element from a put', function(done) {
	    api.put('/datasets/datasettest1/elements/'+testElementId)
		.set('Accept', 'application/json')
		.set('Content-Type', 'application/json')
		.send({ newfield: "update worked" })
		.expect(function(res) {
		    testdatasetid = res.body.id;
		    if (!res.body.id) throw "no id found in response: " + res.body.toString();
		})
		.expect(200,done);
	});
	*/	 
	 
	it('can delete the new element', function(done) {
	    api.delete('/apps/' + testappid + '/appspace/' + testdocid)
		.expect(200,done)
		    .end(function(res, err) {});
		done();
	});
    });



    after(function(){

        api.delete('/apps/' + testappid)
            .expect(200)
	    .end(function(res, err) {});

        server.close();
    })
});


