'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _plantMock = require('./lib/plant-mock');

var _profileMock = require('./lib/profile-mock');

var _adminMock = require('./lib/admin-mock');

var _plantResourceMock = require('./lib/plant-resource-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiURL = 'http://localhost:' + process.env.PORT;

describe('PLANT-RESOURCE SCHEMA', function () {
  beforeAll(_server.startServer);
  afterEach(_profileMock.removeProfileMock);
  afterEach(_adminMock.removeAdminMock);
  afterEach(_plantMock.removePlantMock);
  afterEach(_plantResourceMock.removePlantResourceMock);
  afterAll(_server.stopServer);
  jest.setTimeout(20000);

  describe('POST /bloomiogarden', function () {
    test('POST - should return a 200 status code for a successful post.', function () {
      return (0, _adminMock.createAdminMock)().then(function (responseMock) {
        var token = responseMock.accountSetMock.token;

        return _superagent2.default.post(apiURL + '/bloomiogarden').set('Authorization', 'Bearer ' + token).send({
          commonName: 'Chinese Money Plant',
          scientificName: 'Pilea peperomioides',
          groupType: 'herb',
          waterDate: 1,
          fertilizerDate: 7,
          mistingDate: 1
        });
      }).then(function (response) {
        expect(response.status).toEqual(200);
        expect(response.body._id).toBeTruthy();
        expect(response.body.commonName).toEqual('Chinese Money Plant');
        expect(response.body.scientificName).toEqual('Pilea peperomioides');
        expect(response.body.groupType).toEqual('herb');
        expect(response.body.waterDate).toEqual(1);
        expect(response.body.fertilizerDate).toEqual(7);
        expect(response.body.mistingDate).toEqual(1);
      });
    });
    test('POST - should return a 400 status code for a bad request.', function () {
      return (0, _adminMock.createAdminMock)().then(function (responseMock) {
        var token = responseMock.accountSetMock.token;

        return _superagent2.default.post(apiURL + '/bloomiogarden').set('Authorization', 'Bearer ' + token).send({
          commonName: 'Bromeliad'
        }).then(Promise.reject).catch(function (error) {
          expect(error.status).toEqual(400);
        });
      });
    });
    test('POST - should return a 401 status code when no token given.', function () {
      return (0, _adminMock.createAdminMock)().then(function () {
        return _superagent2.default.post(apiURL + '/bloomiogarden').set('Authorization', 'Bearer badToken').send({
          commonName: 'Coffee Plant',
          scientificName: 'coffea',
          groupType: 'shrub',
          waterDate: 2,
          fertilizerDate: 7,
          mistingDate: 4
        }).then(Promise.reject).catch(function (error) {
          expect(error.status).toEqual(401);
        });
      });
    });
    test('POST - should return a 401 status code if user did not have admin access.', function () {
      return (0, _profileMock.createProfileMock)().then(function (responseMock) {
        var token = responseMock.accountSetMock.token;

        return _superagent2.default.post(apiURL + '/bloomiogarden').set('Authorization', 'Bearer ' + token).send({
          commonName: 'Bird of Paradise',
          scientificName: 'Strelitzia reginae',
          groupType: 'shrub',
          waterDate: 4,
          fertilizerDate: 7,
          mistingDate: 10
        });
      }).then(Promise.reject).catch(function (error) {
        expect(error.status).toEqual(401);
      });
    });
  });

  describe('GET /bloomiogarden/:id', function () {
    test('GET - should return a 200 status code and the specified plant template.', function () {
      var plantTemplateTest = null;
      return (0, _plantResourceMock.createPlantResourceMock)().then(function (plantTemplate) {
        plantTemplateTest = plantTemplate;
        return _superagent2.default.get(apiURL + '/bloomiogarden/' + plantTemplateTest.plantResource._id);
        /* .set('Authorization', `Bearer ${plantTemplateTest.accountSetMock.token}`); */
      }).then(function (response) {
        expect(response.status).toEqual(200);
      });
    });
    test('GET - should return a 400 status code for no id.', function () {
      return (0, _plantResourceMock.createPlantResourceMock)().then(function () {
        return _superagent2.default.post(apiURL + '/bloomiogarden/');
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(400);
      });
    });
    test('GET - should return a 404 status code for bad id.', function () {
      return (0, _plantResourceMock.createPlantResourceMock)().then(function () {
        return _superagent2.default.post(apiURL + '/bloomiogarden/badId');
      }).catch(function (err) {
        expect(err.status).toEqual(404);
      });
    });
  });

  describe('PUT /bloomiogarden', function () {
    test('PUT - should return a 200 status code and the updated plant-resource.', function () {
      var resultMock = {};
      return (0, _adminMock.createAdminMock)().then(function (responseMock) {
        var token = responseMock.accountSetMock.token;

        resultMock.token = token;
        return _superagent2.default.post(apiURL + '/bloomiogarden').set('Authorization', 'Bearer ' + token).send({
          commonName: 'Tomato',
          scientificName: 'Solanum Iycopersicum',
          groupType: 'vegetable',
          waterDate: 1,
          fertilizerDate: 7,
          mistingDate: 10
        }).then(function (postedPlantResource) {
          resultMock.postedPlantResource = postedPlantResource.body;
          return _superagent2.default.put(apiURL + '/bloomiogarden/' + postedPlantResource.body._id).set('Authorization', 'Bearer ' + resultMock.token).send({
            commonName: 'testTomato'
          }).then(function (response) {
            expect(response.status).toEqual(200);
            expect(response.body.commonName).toEqual('testTomato');
          });
        });
      });
    });
    test('PUT - should return a 401 status code if user did not have admin access.', function () {
      var resultMock = {};
      return (0, _adminMock.createAdminMock)().then(function (responseMock) {
        var token = responseMock.accountSetMock.token;

        resultMock.token = token;
        return _superagent2.default.post(apiURL + '/bloomiogarden').set('Authorization', 'Bearer ' + token).send({
          commonName: 'Bush Violet',
          scientificName: 'Browalia',
          groupType: 'shrub',
          waterDate: 1,
          fertilizerDate: 7,
          mistingDate: 4
        }).then(function (postedPlantResource) {
          resultMock.postedPlantResource = postedPlantResource.body;
          return (0, _profileMock.createProfileMock)().then(function (secondResponseMock) {
            var userToken = secondResponseMock.accountSetMock.userToken;

            return _superagent2.default.put(apiURL + '/bloomiogarden/' + resultMock.postedPlantResource._id).set('Authorization', 'Bearer ' + userToken).send({
              waterDate: 'every day'
            }).then(Promise.reject).catch(function (error) {
              expect(error.status).toEqual(401);
            });
          });
        });
      });
    });
    test('PUT - should return a 404 status code for a bad address.', function () {
      var resultMock = {};
      return (0, _adminMock.createAdminMock)().then(function (responseMock) {
        var token = responseMock.accountSetMock.token;

        resultMock.token = token;
        return _superagent2.default.post(apiURL + '/bloomiogarden').set('Authorization', 'Bearer ' + token).send({
          commonName: 'Cat Grass',
          scientificName: 'Cyperus involucratus Zumula',
          groupType: 'grass',
          waterDate: 1,
          fertilizerDate: 7,
          mistingDate: 4
        }).then(function (postedPlantResource) {
          resultMock.postedPlantResource = postedPlantResource.body;
          return _superagent2.default.put(apiURL + '/bloomiogarden/' + postedPlantResource.body._id + 'badaddress').set('Authorization', 'Bearer ' + resultMock.token).send({
            commonName: 'kitty grass'
          }).then(Promise.reject).catch(function (error) {
            expect(error.status).toEqual(404);
          });
        });
      });
    });
    test('PUT - should return a 500 status code if reassigned property was the wrong type.', function () {
      var resultMock = {};
      return (0, _adminMock.createAdminMock)().then(function (responseMock) {
        var token = responseMock.accountSetMock.token;

        resultMock.token = token;
        return _superagent2.default.post(apiURL + '/bloomiogarden').set('Authorization', 'Bearer ' + token).send({
          commonName: 'Bush Violet',
          scientificName: 'Browalia',
          groupType: 'shrub',
          waterDate: 1,
          fertilizerDate: 7,
          mistingDate: 4
        }).then(function (postedPlantResource) {
          resultMock.postedPlantResource = postedPlantResource.body;
          return _superagent2.default.put(apiURL + '/bloomiogarden/' + postedPlantResource.body._id).set('Authorization', 'Bearer ' + resultMock.token).send({
            waterDate: 'every day'
          }).then(Promise.reject).catch(function (error) {
            expect(error.status).toEqual(500);
          });
        });
      });
    });
  });

  describe('DELETE /bloomiogarden/:id', function () {
    test('DELETE - should return a 204 status code if plant-resource successfully deleted.', function () {
      var resultMock = {};
      return (0, _adminMock.createAdminMock)().then(function (responseMock) {
        var token = responseMock.accountSetMock.token;

        resultMock.token = token;
        return _superagent2.default.post(apiURL + '/bloomiogarden').set('Authorization', 'Bearer ' + token).send({
          commonName: 'Chinese Evergreen',
          scientificName: 'Aglaonema pictum',
          groupType: 'shrub',
          waterDate: 1,
          fertilizerDate: 7,
          mistingDate: 5
        }).then(function (postedPlantResource) {
          resultMock.postedPlantResource = postedPlantResource.body;
          return _superagent2.default.delete(apiURL + '/bloomiogarden/' + postedPlantResource.body._id).set('Authorization', 'Bearer ' + resultMock.token).then(function (response) {
            expect(response.status).toEqual(204);
          });
        });
      });
    });
    test('DELETE - should return a 401 status code if user did not have admin access.', function () {
      var resultMock = {};
      return (0, _adminMock.createAdminMock)().then(function (responseMock) {
        var token = responseMock.accountSetMock.token;

        resultMock.token = token;
        return _superagent2.default.post(apiURL + '/bloomiogarden').set('Authorization', 'Bearer ' + token).send({
          commonName: 'Coriander',
          scientificName: 'Coriandrum sativum',
          groupType: 'herb',
          waterDate: 3,
          fertilizerDate: 30,
          mistingDate: 30
        }).then(function (postedPlantResource) {
          resultMock.postedPlantResource = postedPlantResource.body;
          return (0, _profileMock.createProfileMock)().then(function (secondResponseMock) {
            var userToken = secondResponseMock.accountSetMock.userToken;

            return _superagent2.default.delete(apiURL + '/bloomiogarden/' + resultMock.postedPlantResource._id).set('Authorization', 'Bearer ' + userToken).then(Promise.reject).catch(function (error) {
              expect(error.status).toEqual(401);
            });
          });
        });
      });
    });
    test('DELETE - should return a 404 status code for a bad address.', function () {
      return (0, _adminMock.createAdminMock)().then(function (responseMock) {
        var token = responseMock.accountSetMock.token;

        return _superagent2.default.post(apiURL + '/bloomiogardebadaddress').set('Authorization', 'Bearer ' + token);
      }).then(Promise.reject).catch(function (error) {
        expect(error.status).toEqual(404);
      });
    });
  });
});