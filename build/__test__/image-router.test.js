'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _imageMock = require('./lib/image-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiURL = 'http://localhost:' + process.env.PORT;

describe('TESTING ROUTES At /images', function () {
  beforeAll(_server.startServer);
  afterEach(_imageMock.removeImageMock);
  afterAll(_server.stopServer);

  describe('POST /images', function () {
    describe('POST 200 for successful post to /images', function () {
      test('should return 200', function () {
        jest.setTimeout(10000);
        return (0, _imageMock.createImageMock)().then(function (mockResponse) {
          var token = mockResponse.accountMock.token;

          return _superagent2.default.post(apiURL + '/images').set('Authorization', 'Bearer ' + token).field('title', 'doggo').attach('image', __dirname + '/assets/dog.jpg').then(function (response) {
            expect(response.status).toEqual(200);
            expect(response.body.title).toEqual('doggo');
            expect(response.body._id).toBeTruthy();
            expect(response.body.url).toBeTruthy();
          });
        }).catch(function (error) {
          expect(error.status).toEqual(200);
        });
      });
    });
  });
});