/**
 * Created by cellis on 10/13/14.
 */

var should = require('chai').should(),
    supertest = require('supertest'),
    api = supertest('http://localhost:3001'),
    http = require('http');
var sync = require('synchronize');


describe('users api', function(){
    var app = require('../app');
    var server = {};



    before(function(){
        console.log("doing auth call next...");

        var dbAuthDone = false;
        global.db.authenticate("odp", "Hack4art", function (error, result) {
            console.log("RESULT FROM DB authentication:", error, result);
            dbAuthDone = true;
        });
        while (!dbAuthDone) {
            require('deasync').runLoopOnce();
        }

        //HACK:  wait for 2 seconds for db auth
        console.log(Date.now());
        //for(var i = 0; i<2000000000; i++) {}
        console.log(Date.now());

        server = http.createServer(app).listen(3001);
    });

    it('can get a list of datasets', function(done) {
        api.get('/users')
            .expect(200, done)
    });

    it('can get a list of datasets', function(done) {
        api.get('/users')
            .expect(200, done)
    });

    var testdatasetid = "";

    it('can insert a new user from a put', function(done) {
        api.post('/users')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({ name: "Jon Doe", email : "himom@gmail.com" })
        .expect(function(res) {
            testdatasetid = res.body.id;
            if (!res.body.id) throw "no id found in response: " + res.body.toString();
        })
        .expect(201,done);
    });

    after(function(){
        server.close();
    })
});


