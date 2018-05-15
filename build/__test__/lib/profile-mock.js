'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeProfileMock = exports.createProfileMock = undefined;

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _profile = require('../../model/profile');

var _profile2 = _interopRequireDefault(_profile);

var _accountMock = require('./account-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createProfileMock = function createProfileMock() {
  var resultMock = {};

  return (0, _accountMock.createAccountMock)().then(function (accountSetMock) {
    resultMock.accountSetMock = accountSetMock;
    return new _profile2.default({
      firstName: _faker2.default.name.firstName(),
      location: _faker2.default.address.zipCode(),
      avatar: _faker2.default.random.image(),
      phoneNumber: _faker2.default.phone.phoneNumber(),
      googleID: _faker2.default.internet.email(),
      account: accountSetMock.account._id
    }).save();
  }).then(function (profile) {
    resultMock.profile = profile;
    return resultMock;
  });
};

var removeProfileMock = function removeProfileMock() {
  return Promise.all([_profile2.default.remove({}), (0, _accountMock.removeAccountMock)()]);
};

exports.createProfileMock = createProfileMock;
exports.removeProfileMock = removeProfileMock;