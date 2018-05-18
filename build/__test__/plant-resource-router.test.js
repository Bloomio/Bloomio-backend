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

  describe('POST /entry', function () {
    jest.setTimeout(20000);
    test('POST - should return a 200 status code for a successful post.', function () {
      return (0, _adminMock.createAdminMock)().then(function (responseMock) {
        var token = responseMock.accountSetMock.token;

        return _superagent2.default.post(apiURL + '/entry').set('Authorization', 'Bearer ' + token).send({
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

        return _superagent2.default.post(apiURL + '/entry').set('Authorization', 'Bearer ' + token).send({
          commonName: 'Bromeliad'
        }).then(Promise.reject).catch(function (error) {
          expect(error.status).toEqual(400);
        });
      });
    });
    test('POST - should return a 401 status code when no token given.', function () {
      return (0, _adminMock.createAdminMock)().then(function () {
        return _superagent2.default.post(apiURL + '/entry').set('Authorization', 'Bearer badToken').send({
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

        return _superagent2.default.post(apiURL + '/entry').set('Authorization', 'Bearer ' + token).send({
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

  describe('GET /entry/:id', function () {
    test('GET - should return a 200 status code and the specified plant template.', function () {
      var plantTemplateTest = null;
      return (0, _plantResourceMock.createPlantResourceMock)().then(function (plantTemplate) {
        plantTemplateTest = plantTemplate;
        return _superagent2.default.get(apiURL + '/entry/' + plantTemplateTest.plantResource._id);
        /* .set('Authorization', `Bearer ${plantTemplateTest.accountSetMock.token}`); */
      }).then(function (response) {
        expect(response.status).toEqual(200);
      });
    });
    test('GET - should return a 400 status code for no id.', function () {
      return (0, _plantResourceMock.createPlantResourceMock)().then(function () {
        return _superagent2.default.post(apiURL + '/entry/');
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(400);
      });
    });
    test('GET - should return a 404 status code for bad id.', function () {
      return (0, _plantResourceMock.createPlantResourceMock)().then(function () {
        return _superagent2.default.post(apiURL + '/entry/badId');
      }).catch(function (err) {
        expect(err.status).toEqual(404);
      });
    });
  });
});