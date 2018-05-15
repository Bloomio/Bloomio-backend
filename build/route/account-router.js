'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _express = require('express');

var _account = require('../model/account');

var _account2 = _interopRequireDefault(_account);

var _basicAuthMiddleware = require('../lib/basic-auth-middleware');

var _basicAuthMiddleware2 = _interopRequireDefault(_basicAuthMiddleware);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonParser = _bodyParser2.default.json();
var accountRouter = new _express.Router();

accountRouter.post('/signup', jsonParser, function (request, response, next) {
  if (!request.body.username || !request.body.email || !request.body.password) {
    _logger2.default.log(_logger2.default.INFO, 'Invalid request');
    throw new _httpErrors2.default(400, 'Invalid request.');
  }
  return _account2.default.create(request.body.username, request.body.email, request.body.password).then(function (account) {
    delete request.body.password;
    _logger2.default.log('logger.INFO', 'AUTH - creating TOKEN.');
    return account.createToken();
  }).then(function (token) {
    _logger2.default.log('logger.INFO', 'AUTH - returning a 200 code and a token.');
    return response.json({ token: token });
  }).catch(next);
});

accountRouter.get('/login', _basicAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) {
    return next(new _httpErrors2.default(400, 'AUTH - invalid request.'));
  }
  return request.account.createToken().then(function (token) {
    _logger2.default.log(_logger2.default.INFO, 'LOGIN - responding with a 200 status and a token.');
    return response.json({ token: token });
  }).catch(next);
});

exports.default = accountRouter;