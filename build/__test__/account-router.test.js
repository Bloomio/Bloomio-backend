'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _accountMock = require('../__test__/lib/account-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiURL = 'http://localhost:' + process.env.PORT;

describe('ACCOUNT-ROUTER', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_accountMock.removeAccountMock);

  describe('POST /signup', function () {
    test('POST - should return a 200 status code and a TOKEN.', function () {
      return _superagent2.default.post(apiURL + '/signup').send({
        username: 'dan',
        email: 'dandan@dan.com',
        password: 'notdan'
      }).then(function (response) {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
    });
    test('POST - should return a 400 status code if request had missing required values.', function () {
      return _superagent2.default.post(apiURL + '/signup').send({
        username: 'dan2',
        password: 'password'
      }).then(Promise.reject).catch(function (error) {
        expect(error.status).toEqual(400);
      });
    });
    test('POST - should return a 409 status code if a duplicate key was passed.', function () {
      return (0, _accountMock.createAccountMock)().then(function (savedUser) {
        var mockUser = {
          username: 'dan3',
          email: savedUser.account.email,
          password: 'foo'
        };
        return _superagent2.default.post(apiURL + '/signup').send(mockUser);
      }).then(Promise.reject).catch(function (error) {
        expect(error.status).toEqual(409);
      });
    });
  });

  describe('GET /login', function () {
    test('GET - should respond with a 200 status code AND a TOKEN.', function () {
      return (0, _accountMock.createAccountMock)().then(function (mock) {
        return _superagent2.default.get(apiURL + '/login').auth(mock.request.username, mock.request.password);
      }).then(function (response) {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
    });
  });

  describe('PUT /accounts/:id', function () {
    test('PUT - should return a 200 status code and update selected field.', function () {
      var putAcctMock = null;
      return (0, _accountMock.createAccountMock)().then(function (acctSetMock) {
        putAcctMock = acctSetMock;
        return _superagent2.default.put(apiURL + '/accounts/' + putAcctMock.account._id).auth(putAcctMock.request.username, putAcctMock.request.password).send({ username: 'Vinny', email: 'thevinster@gregor.com' });
      }).then(function (response) {
        expect(response.status).toEqual(200);
        expect(response.body.username).toEqual('Vinny');
        expect(response.body.email).toEqual('thevinster@gregor.com');
      });
    });
    test('PUT - should respond with a 400 if profile not found.', function () {
      return (0, _accountMock.createAccountMock)().then(function () {
        return _superagent2.default.put(apiURL + '/accounts/invalidID').send({ name: 'John Doe' });
      }).catch(function (error) {
        expect(error.status).toEqual(400);
      });
    });
    test('PUT - should respond with a 400 if new property is invalid.', function () {
      var putAcctMock = null;
      return (0, _accountMock.createAccountMock)().then(function (acctSetMock) {
        putAcctMock = acctSetMock;
        return _superagent2.default.put(apiURL + '/accounts/' + putAcctMock.account._id).auth(putAcctMock.request.username, putAcctMock.request.password).send({ username: '' });
      }).then(Promise.reject).catch(function (error) {
        expect(error.status).toEqual(400);
      });
    });
  });

  describe('DELETE /accounts/:id', function () {
    test('DELETE - should return a 204 status code if the account was successfully deleted.', function () {
      var putAcctMock = null;
      return (0, _accountMock.createAccountMock)().then(function (acctSetMock) {
        putAcctMock = acctSetMock;
        return _superagent2.default.delete(apiURL + '/accounts/' + putAcctMock.account._id).auth(putAcctMock.request.username, putAcctMock.request.password);
      }).then(function (response) {
        expect(response.status).toEqual(204);
      });
    });
    test('DELETE - should respond with 400 if no account found.', function () {
      return _superagent2.default.delete(apiURL + '/accounts/THisIsAnInvalidId').then(Promise.reject).catch(function (response) {
        expect(response.status).toEqual(400);
      });
    });
  });
});