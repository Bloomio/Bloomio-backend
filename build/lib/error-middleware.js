'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (error, request, response, next) {
  // eslint-disable-line no-unused-vars
  _logger2.default.log(_logger2.default.ERROR, '__ERROR_MIDDLEWARE__');
  _logger2.default.log(_logger2.default.ERROR, error);

  if (error.status) {
    _logger2.default.log(_logger2.default.INFO, 'Responding with a ' + error.status + ' code and message ' + error.message);
    return response.sendStatus(error.status);
  }

  var errorMessage = error.message.toLowerCase();

  if (errorMessage.includes('objectid failed')) {
    _logger2.default.log(_logger2.default.INFO, 'Responding with 404');
    return response.sendStatus(404);
  }
  if (errorMessage.includes('validation failed')) {
    _logger2.default.log(_logger2.default.INFO, 'Responding with 400');
    return response.sendStatus(400);
  }
  if (errorMessage.includes('duplicate key')) {
    _logger2.default.log(_logger2.default.INFO, 'Responding with 409');
    return response.sendStatus(409);
  }
  _logger2.default.log(_logger2.default.ERROR, 'Responding with 500');
  _logger2.default.log(_logger2.default.ERROR, error);
  return response.sendStatus(500);
};