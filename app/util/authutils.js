'use strict';

var express = require('express');

var validKey = function(req, apikey) {
  //TODO: Use real logic here to determine if apikey has access
  return apikey == 'test';
};

module.exports.authenticateApiRequest = function(req, res, next) {
  var apikey = req.body.apikey || req.query.apikey;
  if(validKey(req, apikey)) {
    next();
  } else {
    res.status(401).end();
  }
};

module.exports.buildAuthRouter = function() {
  var authRouter = express.Router();
  authRouter.all('/*', this.authenticateApiRequest);
  return authRouter;
};