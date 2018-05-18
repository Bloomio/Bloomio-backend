'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _plantMock = require('./lib/plant-mock');

var _profileMock = require('./lib/profile-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiURL = 'http://localhost:' + process.env.PORT;

describe('PLANT SCHEMA', function () {
  beforeAll(_server.startServer);
  afterEach(_profileMock.removeProfileMock);
  afterEach(_plantMock.removePlantMock);
  afterAll(_server.stopServer);

  describe('POST /plants', function () {
    test('POST - should return a 200 status code for a successful post.', function () {
      return (0, _profileMock.createProfileMock)().then(function (responseMock) {
        var token = responseMock.accountSetMock.token;

        return _superagent2.default.post(apiURL + '/plants').set('Authorization', 'Bearer ' + token).send({
          commonName: 'Geranium',
          placement: 'indoors'
        }).then(function (response) {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.commonName).toEqual('Geranium');
          expect(response.body.placement).toEqual('indoors');
        });
      }).catch(function (error) {
        expect(error.status).toEqual(200);
      });
    });
    test('POST - should return a 409 status code for duplicate key.', function () {
      return (0, _plantMock.createPlantMock)().then(function (responseMock) {
        var token = responseMock.profileMock.accountSetMock.token;

        return _superagent2.default.post(apiURL + '/plants').set('Authorization', 'Bearer ' + token).send({
          _id: responseMock.plant._id,
          commonName: 'Geranium',
          placement: 'indoors'
        }).then(Promise.reject).catch(function (error) {
          expect(error.status).toEqual(409);
        });
      });
    });
    test('POST - should return a 400 status code for a bad request.', function () {
      return (0, _profileMock.createProfileMock)().then(function (responseMock) {
        var token = responseMock.accountSetMock.token;

        return _superagent2.default.post(apiURL + '/plants').set('Authorization', 'Bearer ' + token).send({
          placement: 'indoors'
        }).then(Promise.reject).catch(function (err) {
          expect(err.status).toEqual(400);
        });
      });
    });
    test('POST - should return a 400 status code when no token given.', function () {
      return (0, _profileMock.createProfileMock)().then(function () {
        return _superagent2.default.post(apiURL + '/plants').set('Authorization', 'Bearer ').send({
          commonName: 'Geranium',
          placement: 'indoors'
        }).then(Promise.reject).catch(function (response) {
          expect(response.status).toEqual(400);
        });
      });
    });
  });

  describe('GET /plants/:id', function () {
    test('GET - should return a 200 status code and the specified plant.', function () {
      var plantTest = null;
      return (0, _plantMock.createPlantMock)().then(function (plant) {
        plantTest = plant;
        return _superagent2.default.get(apiURL + '/plants/' + plantTest.plant._id).set('Authorization', 'Bearer ' + plantTest.profileMock.accountSetMock.token);
      }).then(function (response) {
        expect(response.status).toEqual(200);
        expect(response.body.commonName).toBeTruthy();
        expect(response.body.placement).toBeTruthy();
        expect(response.body.plantNickname).toBeTruthy();
      });
    });
    test('GET - should return a 400 status code for no id.', function () {
      return (0, _plantMock.createPlantMock)().then(function () {
        return _superagent2.default.post(apiURL + '/plants/');
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(400);
      });
    });
    test('GET - should return a 404 status code for a missing token.', function () {
      return (0, _plantMock.createPlantMock)().then(function (plant) {
        return _superagent2.default.post(apiURL + '/pictures/' + plant.plant._id).set('Authorization', 'Bearer ');
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(404);
      });
    });
  });

  describe('DELETE /plants/:id', function () {
    test('DELETE - should return a 204 status code if plant successfully deleted.', function () {
      return (0, _plantMock.createPlantMock)().then(function (plantMock) {
        return _superagent2.default.delete(apiURL + '/plants/' + plantMock.plant._id).set('Authorization', 'Bearer ' + plantMock.profileMock.accountSetMock.token);
      }).then(function (response) {
        expect(response.status).toEqual(204);
      });
    });
    test('DELETE - should return a 400 status code if no token is passed.', function () {
      return (0, _plantMock.createPlantMock)().then(function (plantMock) {
        return _superagent2.default.delete(apiURL + '/plants/' + plantMock.plant._id);
      }).then(Promise.reject).catch(function (error) {
        expect(error.status).toEqual(400);
      });
    });
    test('DELETE - should return a 401 status code if invalid token is passed.', function () {
      return (0, _plantMock.createPlantMock)().then(function (plantMock) {
        return _superagent2.default.delete(apiURL + '/plants/' + plantMock.plant._id).set('Authorization', 'Bearer invalidToken');
      }).then(Promise.reject).catch(function (error) {
        expect(error.status).toEqual(401);
      });
    });
  });

  describe('PUT /plants/:id', function () {
    test('PUT - should return a 200 status code if plant is successfully updated', function () {
      return (0, _plantMock.createPlantMock)().then(function (plantToUpdate) {
        return _superagent2.default.put(apiURL + '/plants/' + plantToUpdate.plant._id).set('Authorization', 'Bearer ' + plantToUpdate.profileMock.accountSetMock.token).send({
          plantNickname: 'Gary'
        });
      }).then(function (response) {
        expect(response.status).toEqual(200);
        expect(response.body.plantNickname).toEqual('Gary');
      });
    });
    test('PUT - should return a 200 status code if plant waterInterval and nextWaterDate is successfully updated', function () {
      return (0, _plantMock.createPlantMock)().then(function (plantToUpdate) {
        plantToUpdate.plant.waterInterval = 4;
        return _superagent2.default.put(apiURL + '/plants/' + plantToUpdate.plant._id).set('Authorization', 'Bearer ' + plantToUpdate.profileMock.accountSetMock.token).send({
          waterInterval: 12
        });
      }).then(function (response) {
        expect(response.status).toEqual(200);
        expect(response.body.waterInterval).toEqual(12);
      });
    });
    test('PUT - should return a 200 status code if successfully updated plant image', function () {
      var plantToUpdate = null;
      return (0, _plantMock.createPlantMock)().then(function (plant) {
        plantToUpdate = plant;
        return _superagent2.default.put(apiURL + '/plants/' + plantToUpdate.plant._id + '/image').set('Authorization', 'Bearer ' + plantToUpdate.profileMock.accountSetMock.token).attach('image', __dirname + '/../assets/plant.jpg').then(function (response) {
          expect(response.status).toEqual(200);
        });
      });
    });
    test('PUT - should return a 400 status code for no token being passed', function () {
      return (0, _plantMock.createPlantMock)().then(function (plantToUpdate) {
        return _superagent2.default.put(apiURL + '/plants/' + plantToUpdate.plant._id).send({
          plantNickname: 'Vinicio'
        });
      }).then(Promise.reject).catch(function (error) {
        expect(error.status).toEqual(400);
      });
    });
  });
});