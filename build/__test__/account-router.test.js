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
});