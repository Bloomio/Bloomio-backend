'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stopServer = exports.startServer = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _errorMiddleware = require('./error-middleware');

var _errorMiddleware2 = _interopRequireDefault(_errorMiddleware);

var _accountRouter = require('../route/account-router');

var _accountRouter2 = _interopRequireDefault(_accountRouter);

var _profileRouter = require('../route/profile-router');

var _profileRouter2 = _interopRequireDefault(_profileRouter);

var _plantRouter = require('../route/plant-router');

var _plantRouter2 = _interopRequireDefault(_plantRouter);

var _plantResourceRouter = require('../route/plant-resource-router');

var _plantResourceRouter2 = _interopRequireDefault(_plantResourceRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import taskRouter from '../route/task-router';

var app = (0, _express2.default)();
var server = null;

// routes will be app.use'd here
app.use(_accountRouter2.default);
app.use(_profileRouter2.default);
app.use(_plantRouter2.default);
app.use(_plantResourceRouter2.default);
// app.use(taskRouter);

app.all('*', function (request, response) {
  _logger2.default.log(_logger2.default.INFO, 'Returning a 404 from the catch-all/default route');
  return response.sendStatus(404);
});

app.use(_errorMiddleware2.default);

var startServer = function startServer() {
  return _mongoose2.default.connect(process.env.MONGODB_URI).then(function () {
    server = app.listen(process.env.PORT, function () {
      _logger2.default.log(_logger2.default.INFO, 'Server is listening on port ' + process.env.PORT);
    });
  });
};

var stopServer = function stopServer() {
  return _mongoose2.default.disconnect().then(function () {
    server.close(function () {
      _logger2.default.log(_logger2.default.INFO, 'Server is off');
    });
  });
};

exports.startServer = startServer;
exports.stopServer = stopServer;