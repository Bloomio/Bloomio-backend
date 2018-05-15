'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _accountMock = require('./lib/account-mock');

var _profileMock = require('./lib/profile-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiURL = 'http://localhost:' + process.env.PORT;

describe('PROFILE SCHEMA', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_profileMock.removeProfileMock);

  describe('POST ROUTES', function () {
    test('POST /profile should return a 200 and the newly created profile.', function () {
      var accountMock = null;
      return (0, _accountMock.createAccountMock)().then(function (accountSetMock) {
        accountMock = accountSetMock;
        return _superagent2.default.post(apiURL + '/profile').set('Authorization', 'Bearer ' + accountMock.token).send({
          firstName: 'Dan',
          location: '98109'
        });
      }).then(function (response) {
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountMock.account._id.toString());
        expect(response.body.firstName).toEqual('Dan');
        expect(response.body.location).toEqual('98109');
      });
    });
    test('POST /profile should return a 400 status code if there were missing required values.', function () {
      return (0, _accountMock.createAccountMock)().then(function (accountSetMock) {
        return _superagent2.default.post(apiURL + '/profile').set('Authorization', 'Bearer ' + accountSetMock.token).send({
          firstName: 'David'
        });
      }).then(Promise.reject).catch(function (error) {
        expect(error.status).toEqual(400);
      });
    });
    test('POST /profile should return a 401 for an invalid token.', function () {
      return (0, _accountMock.createAccountMock)().then(function () {
        return _superagent2.default.post(apiURL + '/profile').set('Authorization', 'Bearer INVALIDTOKEN').send({
          firstName: 'Joanna',
          location: '98109'
        });
      }).then(Promise.reject).catch(function (error) {
        expect(error.status).toEqual(401);
      });
    });
    test('POST /profile should return a 404 for a bad route.', function () {
      var accountMock = null;
      return (0, _accountMock.createAccountMock)().then(function (accountSetMock) {
        accountMock = accountSetMock;
        return _superagent2.default.post(apiURL + '/badroute').set('Authorization', 'Bearer ' + accountMock.token).send({
          firstName: 'John',
          location: '98109'
        });
      }).then(Promise.reject).catch(function (error) {
        expect(error.status).toEqual(404);
      });
    });
    test('POST /profile should return a 409 status code if there are duplicate unique key values.', function () {
      var mockGoogleID = 'daveyjones@google.com';
      return (0, _accountMock.createAccountMock)().then(function (accountSetMock) {
        return _superagent2.default.post(apiURL + '/profile').set('Authorization', 'Bearer ' + accountSetMock.token).send({
          firstName: 'David',
          location: '98109',
          googleID: mockGoogleID
        });
      }).then(function () {
        return (0, _accountMock.createAccountMock)().then(function (accountSetMock) {
          return _superagent2.default.post(apiURL + '/profile').set('Authorization', 'Bearer ' + accountSetMock.token).send({
            firstName: 'Jen',
            location: '98109',
            googleID: mockGoogleID
          });
        });
      }).then(Promise.reject).catch(function (error) {
        expect(error.status).toEqual(409);
      });
    });
  });

  describe('GET ROUTES', function () {
    describe('GET /profile', function () {
      //eslint-disable-line
      test('#GET, should return a 200 status code and the newly created profile.', function () {
        var profileMock = null;
        return (0, _profileMock.createProfileMock)().then(function (profileSetMock) {
          profileMock = profileSetMock;
          return _superagent2.default.get(apiURL + '/profile/' + profileMock.profile._id).set('Authorization', 'Bearer ' + profileMock.accountSetMock.token).then(function (response) {
            expect(response.status).toEqual(200);
          });
        });
      });
    });
  });
});