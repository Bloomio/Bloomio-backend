'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _express = require('express');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

var _bearerAuthMiddleware2 = _interopRequireDefault(_bearerAuthMiddleware);

var _image = require('../model/image');

var _image2 = _interopRequireDefault(_image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { s3Upload, s3Remove } from '../lib/s3';

var multerUpload = (0, _multer2.default)({ dest: __dirname + '/../temp' });

var imageRouter = new _express.Router();

imageRouter.post('/images', _bearerAuthMiddleware2.default, multerUpload.any(), function (request, response, next) {
  if (!request.account) {
    return next(new _httpErrors2.default(404, 'IMAGE ROUTER ERROR, not found'));
  }

  if (!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'image') {
    return next(new _httpErrors2.default(400, 'IMAGE ROUTER ERROR: invalid request.'));
  }

  var file = request.files[0];
  var key = file.filename + '.' + file.originalname;

  return s3Upload(file.path, key).then(function (url) {
    return new _image2.default({
      title: request.body.title,
      account: request.account._id,
      url: url
    }).save();
  }).then(function (image) {
    return response.json(image);
  }).catch(next);
});

exports.default = imageRouter;