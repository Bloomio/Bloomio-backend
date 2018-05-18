'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeAdminMock = exports.createAdminMock = undefined;

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _profile = require('../../model/profile');

var _profile2 = _interopRequireDefault(_profile);

var _account = require('../../model/account');

var _account2 = _interopRequireDefault(_account);

var _accountMock = require('../lib/account-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createAdminMock = function createAdminMock() {
  var resultMock = {};

  resultMock.request = {
    username: _faker2.default.internet.userName(),
    email: _faker2.default.internet.email(),
    password: _faker2.default.lorem.words(5)
  };
  return _account2.default.create(resultMock.request.username, resultMock.request.email, resultMock.request.password).then(function (account) {
    resultMock.account = account;
    resultMock.account.isAdmin = true;
    return account.createToken();
  }).then(function (token) {
    resultMock.token = token;
    return _account2.default.findById(resultMock.account._id);
  }).then(function (account) {
    resultMock.account = account;
    return resultMock;
  }).then(function (accountSetMock) {
    resultMock.accountSetMock = accountSetMock;
    return new _profile2.default({
      firstName: _faker2.default.name.firstName(),
      location: _faker2.default.address.zipCode(),
      avatar: _faker2.default.random.image(),
      phoneNumber: _faker2.default.phone.phoneNumber(),
      googleID: _faker2.default.internet.email(),
      account: accountSetMock.account._id
    }).save().then(function (profile) {
      resultMock.profile = profile;
      return resultMock;
    });
  });
};

var removeAdminMock = function removeAdminMock() {
  return Promise.all([_profile2.default.remove({}), (0, _accountMock.removeAccountMock)()]);
};

exports.createAdminMock = createAdminMock;
exports.removeAdminMock = removeAdminMock;