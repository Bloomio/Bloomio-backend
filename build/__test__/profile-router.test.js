'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _accountMock = require('./lib/account-mock');

var _profileMock = require('./lib/profile-mock');

var _plantMock = require('./lib/plant-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiURL = 'http://localhost:' + process.env.PORT;

describe('PROFILE SCHEMA', function () {
  beforeAll(_server.startServer);
  afterEach(_profileMock.removeProfileMock);
  afterEach(_plantMock.removePlantMock);
  afterAll(_server.stopServer);
  jest.setTimeout(10000);

  describe('POST /profile', function () {
    test('POST - should return a 200 status code and the newly created profile.', function () {
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
    test('POST - should return a 400 status code if there were missing required values.', function () {
      return (0, _accountMock.createAccountMock)().then(function (accountSetMock) {
        return _superagent2.default.post(apiURL + '/profile').set('Authorization', 'Bearer ' + accountSetMock.token).send({
          firstName: 'David'
        });
      }).then(Promise.reject).catch(function (error) {
        expect(error.status).toEqual(400);
      });
    });
    test('POST - should return a 401 for an invalid token.', function () {
      return (0, _accountMock.createAccountMock)().then(function () {
        return _superagent2.default.post(apiURL + '/profile').set('Authorization', 'Bearer INVALIDTOKEN').send({
          firstName: 'Joanna',
          location: '98109'
        });
      }).then(Promise.reject).catch(function (error) {
        expect(error.status).toEqual(401);
      });
    });
    test('POST - should return a 404 for a bad route.', function () {
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
    test('POST - should return a 409 status code if there are duplicate unique key values.', function () {
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
      test('GET - should return a 200 status code and the newly created profile.', function () {
        var profileMock = null;
        return (0, _profileMock.createProfileMock)().then(function (profileSetMock) {
          profileMock = profileSetMock;
          return _superagent2.default.get(apiURL + '/profile/' + profileMock.profile._id).set('Authorization', 'Bearer ' + profileMock.accountSetMock.token).then(function (response) {
            expect(response.status).toEqual(200);
          });
        });
      });
      test('GET - should return a 400 for no token being passed.', function () {
        var profileMock = null;
        return (0, _profileMock.createProfileMock)().then(function (profileSetMock) {
          profileMock = profileSetMock;
          return _superagent2.default.get(apiURL + '/profile/' + profileMock.profile._id).then(Promise.reject).catch(function (error) {
            expect(error.status).toEqual(400);
          });
        });
      });
      test('GET - should return a 401 for an invalid token.', function () {
        var profileMock = null;
        return (0, _profileMock.createProfileMock)().then(function (profileSetMock) {
          profileMock = profileSetMock;
          return _superagent2.default.get(apiURL + '/profile/' + profileMock.profile._id).set('Authorization', 'Bearer invalidToken').then(Promise.reject).catch(function (error) {
            expect(error.status).toEqual(401);
          });
        });
      });
      test('GET - should return a 404 for an invalid id', function () {
        var profileMock = null;
        return (0, _profileMock.createProfileMock)().then(function (profileSetMock) {
          profileMock = profileSetMock;
          return _superagent2.default.get(apiURL + '/profile/badID').set('Authorization', 'Bearer ' + profileMock.accountSetMock.token).then(Promise.reject).catch(function (error) {
            expect(error.status).toEqual(404);
          });
        });
      });
    });
    test('GET - should return a 200 and the planterbox collection from a user.', function () {
      var collectionMock = null;
      return (0, _plantMock.createPlantMock)().then(function (plantSetMock) {
        collectionMock = plantSetMock;
        return _superagent2.default.get(apiURL + '/profile/' + collectionMock.profileMock.profile._id + '/planterbox').set('Authorization', 'Bearer ' + collectionMock.profileMock.accountSetMock.token).then(function (response) {
          expect(response.status).toEqual(200);
          expect(Array.isArray(response.body)).toBeTruthy();
        });
      });
    });
    test('GET - should return a 200 status code and the each plant that needs to be watered.', function () {
      var resultMock = {};
      return (0, _profileMock.createProfileMock)().then(function (responseMock) {
        resultMock.responseMock = responseMock;
        var token = responseMock.accountSetMock.token;

        return _superagent2.default.post(apiURL + '/plants').set('Authorization', 'Bearer ' + token).send({
          commonName: 'Geranium',
          placement: 'indoors',
          waterInterval: 1
        }).then(function () {
          return _superagent2.default.post(apiURL + '/plants').set('Authorization', 'Bearer ' + token).send({
            commonName: 'Fern',
            placement: 'indoors',
            waterInterval: 1
          }).then(function () {
            return _superagent2.default.get(apiURL + '/profile/' + resultMock.responseMock.profile._id + '/needswater').set('Authorization', 'Bearer ' + token).then(function (response) {
              expect(response.status).toEqual(200);
              expect(response.body).toEqual('You have no plants that need watering today.');
            });
          });
        });
      });
    });
  });

  describe('PUT /profile', function () {
    test('PUT - should return a 200 status code if successful.', function () {
      var profileToUpdate = null;
      return (0, _profileMock.createProfileMock)().then(function (profile) {
        profileToUpdate = profile;
        return _superagent2.default.put(apiURL + '/profile/' + profileToUpdate.profile._id).set('Authorization', 'Bearer ' + profileToUpdate.accountSetMock.token).send({
          firstName: 'test'
        });
      }).then(function (response) {
        expect(response.status).toEqual(200);
        expect(response.body._id).toEqual(profileToUpdate.profile._id.toString());
        expect(response.body.firstName).toEqual('test');
      });
    });
    test('PUT - should return a 200 status code if sucessfully updated profile avatar', function () {
      var profileToUpdate = null;
      return (0, _profileMock.createProfileMock)().then(function (profile) {
        profileToUpdate = profile;
        return _superagent2.default.put(apiURL + '/profile/' + profileToUpdate.profile._id + '/avatar').set('Authorization', 'Bearer ' + profileToUpdate.accountSetMock.token).attach('pic', __dirname + '/../assets/dog.jpg').then(function (response) {
          expect(response.status).toEqual(200);
          expect(response.body._id).toEqual(profileToUpdate.profile._id.toString());
        });
      });
    });
    test('PUT - should return a 400 status code for no token being passed.', function () {
      var profileToUpdate = null;
      return (0, _profileMock.createProfileMock)().then(function (profile) {
        profileToUpdate = profile;
        return _superagent2.default.put(apiURL + '/profile/' + profileToUpdate.profile._id).send({
          firstName: 'test'
        });
      }).then(Promise.reject).catch(function (error) {
        expect(error.status).toEqual(400);
      });
    });
    test('PUT - should return a 401 status code for an invalid token being passed.', function () {
      var profileToUpdate = null;
      return (0, _profileMock.createProfileMock)().then(function (profile) {
        profileToUpdate = profile;
        return _superagent2.default.put(apiURL + '/profile/' + profileToUpdate.profile._id).set('Authorization', 'Bearer invalidToken').send({
          firstName: 'test'
        });
      }).then(Promise.reject).catch(function (error) {
        expect(error.status).toEqual(401);
      });
    });
    test('PUT - should return a 404 status code for a bad id being passed.', function () {
      var profileToUpdate = null;
      return (0, _profileMock.createProfileMock)().then(function (profile) {
        profileToUpdate = profile;
        return _superagent2.default.put(apiURL + '/profile/badID').set('Authorization', 'Bearer ' + profileToUpdate.accountSetMock.token).send({
          firstName: 'test'
        });
      }).then(Promise.reject).catch(function (error) {
        expect(error.status).toEqual(404);
      });
    });
    test('PUT - should return a 409 status code for duplicate unique keys.', function () {
      var dummyProfile = null;
      var profileToUpdate = null;
      return (0, _accountMock.createAccountMock)().then(function (profile) {
        dummyProfile = profile;
        return _superagent2.default.post(apiURL + '/profile').set('Authorization', 'Bearer ' + dummyProfile.token).send({
          firstName: 'Dan',
          location: '98109',
          googleID: 'dan@google.com'
        });
      }).then(function () {
        return (0, _profileMock.createProfileMock)().then(function (profile2) {
          profileToUpdate = profile2;
          return _superagent2.default.put(apiURL + '/profile/' + profileToUpdate.profile._id).set('Authorization', 'Bearer ' + profileToUpdate.accountSetMock.token).send({ googleID: 'dan@google.com' });
        }).then(Promise.reject).catch(function (error) {
          expect(error.status).toEqual(409);
        });
      });
    });
  });

  describe('DELETE /profile', function () {
    test('DELETE - Should return 204 for deleted profile', function () {
      var deleteProfileMock = null;
      return (0, _profileMock.createProfileMock)().then(function (profileToDelete) {
        deleteProfileMock = profileToDelete;
        return _superagent2.default.delete(apiURL + '/profile/' + deleteProfileMock.profile._id).set('Authorization', 'Bearer ' + deleteProfileMock.accountSetMock.token).then(function (response) {
          expect(response.status).toEqual(204);
        });
      });
    });
    test('DELETE - should return 400 if no account exists', function () {
      return _superagent2.default.delete(apiURL + '/profile/InvalidID').then(Promise.reject).catch(function (error) {
        expect(error.status).toEqual(400);
      });
    });
  });
});