'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _account = require('../model/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var promisify = function promisify(callbackStyleFunction) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new Promise(function (resolve, reject) {
      callbackStyleFunction.apply(undefined, args.concat([function (error, data) {
        if (error) {
          return reject(error);
        }
        return resolve(data);
      }]));
    });
  };
};

exports.default = function (request, response, next) {
  if (!request.headers.authorization) {
    return next(new _httpErrors2.default(400, 'AUTH - invalid request'));
  }

  var token = request.headers.authorization.split('Bearer ')[1];

  if (!token) {
    return next(new _httpErrors2.default(400, 'AUTH - invalid request'));
  }

  return promisify(_jsonwebtoken2.default.verify)(token, process.env.BLOOMIO_SECRET).catch(function (error) {
    return Promise.reject(new _httpErrors2.default(401, 'AUTH - jsonWebToken Error ' + error));
  }).then(function (decryptedToken) {
    return _account2.default.findOne({ tokenSeed: decryptedToken.tokenSeed });
  }).then(function (account) {
    if (!account) {
      return next(new _httpErrors2.default(404, 'AUTH - invalid request'));
    }
    request.account = account;
    return next();
  }).catch(next);
};