'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _bodyParser = require('body-parser');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _plant = require('../model/plant');

var _plant2 = _interopRequireDefault(_plant);

var _bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

var _bearerAuthMiddleware2 = _interopRequireDefault(_bearerAuthMiddleware);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _profile = require('../model/profile');

var _profile2 = _interopRequireDefault(_profile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonParser = (0, _bodyParser.json)();
var plantRouter = new _express.Router();

plantRouter.post('/plants', _bearerAuthMiddleware2.default, jsonParser, function (request, response, next) {
  _logger2.default.log(_logger2.default.INFO, 'POST - processing a request');
  if (!request.body.commonName || !request.body.placement) {
    return next(new _httpErrors2.default(400, 'invalid request.'));
  }
  return _profile2.default.findOne({ account: request.account._id }).then(function (profile) {
    request.body.profile = profile._id;
  }).then(function () {
    return new _plant2.default(request.body).save().then(function (plant) {
      _logger2.default.log(_logger2.default.INFO, 'POST - responding with a 200 status code.');
      return response.json(plant);
    });
  }).catch(next);
});

plantRouter.get('/plants/:id', _bearerAuthMiddleware2.default, function (request, response, next) {
  return _plant2.default.findById(request.params.id).then(function (plant) {
    if (!plant) {
      return next(new _httpErrors2.default(404, 'plant not found.'));
    }
    _logger2.default.log(_logger2.default.INFO, 'GET - responding with a 200 status code.');
    _logger2.default.log(_logger2.default.INFO, 'GET - ' + JSON.stringify(plant));
    return response.json(plant);
  }).catch(next);
});

plantRouter.put('/plants/:id', _bearerAuthMiddleware2.default, jsonParser, function (request, response, next) {
  var options = { runValidators: true, new: true };
  return _plant2.default.findByIdAndUpdate(request.params.id, request.body, options).then(function (updatedPlant) {
    if (!updatedPlant) {
      return next(new _httpErrors2.default(404, 'Plant not found.'));
    }
    _logger2.default.log(_logger2.default.INFO, 'PUT - responding with a 200 status code.');
    return response.json(updatedPlant);
  }).catch(next);
});

plantRouter.delete('/plants/:id', _bearerAuthMiddleware2.default, function (request, response, next) {
  return _plant2.default.findByIdAndRemove(request.params.id).then(function (plant) {
    if (!plant) {
      return next(new _httpErrors2.default(404, 'plant not found.'));
    }
    return response.sendStatus(204);
  });
});
exports.default = plantRouter;