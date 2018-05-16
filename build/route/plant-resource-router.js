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

var _plantResource = require('../model/plant-resource');

var _plantResource2 = _interopRequireDefault(_plantResource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonParser = (0, _bodyParser.json)();
var plantResourceRouter = new _express.Router();

plantResourceRouter.post('/entry', _bearerAuthMiddleware2.default, jsonParser, function (request, response, next) {
  console.log('TOP OF POST', request.body);
  // if (!request.account.isAdmin) {
  //   return next(new HttpError(401, 'Unauthorized'));
  // }
  if (!request.body.commonName || !request.body.scientificName || !request.body.groupType || !request.body.waterDate || !request.body.fertilizerDate || !request.body.mistingDate) {
    return next(new _httpErrors2.default(400, 'Invalid request, ALL properties required.'));
  }
  return _profile2.default.findOne({ account: request.account._id }).then(function (profile) {
    request.body.profile = profile._id;
  }).then(function () {
    return new _plantResource2.default(request.body).save().then(function (plantRes) {
      _logger2.default.log(_logger2.default.INFO, 'POST - responding with a 200 status code.');
      return response.json(plantRes);
    });
  }).catch(next);
});

plantResourceRouter.get('/plants/:id', _bearerAuthMiddleware2.default, function (request, response, next) {
  return _plant2.default.findById(request.params.id).then(function (plant) {
    if (!plant) {
      return next(new _httpErrors2.default(404, 'plant not found.'));
    }
    _logger2.default.log(_logger2.default.INFO, 'GET - responding with a 200 status code.');
    _logger2.default.log(_logger2.default.INFO, 'GET - ' + JSON.stringify(plant));
    return response.json(plant);
  }).catch(next);
});

plantResourceRouter.put('/plants/:id', _bearerAuthMiddleware2.default, jsonParser, function (request, response, next) {
  var options = { runValidators: true, new: true };
  return _plant2.default.findByIdAndUpdate(request.params.id, request.body, options).then(function (updatedPlant) {
    if (!updatedPlant) {
      return next(new _httpErrors2.default(404, 'Plant not found.'));
    }
    _logger2.default.log(_logger2.default.INFO, 'PUT - responding with a 200 status code.');
    return response.json(updatedPlant);
  }).catch(next);
});

plantResourceRouter.delete('/plants/:id', _bearerAuthMiddleware2.default, function (request, response, next) {
  return _plant2.default.findByIdAndRemove(request.params.id).then(function (plant) {
    if (!plant) {
      return next(new _httpErrors2.default(404, 'plant not found.'));
    }
    return response.sendStatus(204);
  });
});

exports.default = plantResourceRouter;