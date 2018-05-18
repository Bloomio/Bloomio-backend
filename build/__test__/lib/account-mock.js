'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeAccountMock = exports.createAccountMock = undefined;

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _account = require('../../model/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createAccountMock = function createAccountMock() {
  var mock = {};
  mock.request = {
    username: _faker2.default.internet.userName(),
    email: _faker2.default.internet.email(),
    password: _faker2.default.lorem.words(5)
  };
  return _account2.default.create(mock.request.username, mock.request.email, mock.request.password).then(function (account) {
    mock.account = account;
    return account.createToken();
  }).then(function (token) {
    mock.token = token;
    return _account2.default.findById(mock.account._id);
  }).then(function (account) {
    mock.account = account;
    return mock;
  });
};

var removeAccountMock = function removeAccountMock() {
  return _account2.default.remove({});
};

exports.createAccountMock = createAccountMock;
exports.removeAccountMock = removeAccountMock;