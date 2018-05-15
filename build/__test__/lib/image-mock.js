'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeImageMock = exports.createImageMock = undefined;

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _accountMock = require('../lib/account-mock');

var _image = require('../../model/image');

var _image2 = _interopRequireDefault(_image);

var _account = require('../../model/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createImageMock = function createImageMock() {
  var resultMock = {};
  return (0, _accountMock.createAccountMock)().then(function (mockAccount) {
    console.log('mockAccount', mockAccount);
    resultMock.accountMock = mockAccount;

    return new _image2.default({
      title: _faker2.default.lorem.words(5),
      url: _faker2.default.random.image(),
      account: resultMock.accountMock.account._id
    }).save();
  }).then(function (image) {
    resultMock.image = image;
    return resultMock;
  });
};

var removeImageMock = function removeImageMock() {
  return Promise.all([_account2.default.remove({}), _image2.default.remove({})]);
};

exports.createImageMock = createImageMock;
exports.removeImageMock = removeImageMock;