'use strict';

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _server = require('../lib/server');

var _plant = require('../model/plant');

var _plant2 = _interopRequireDefault(_plant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// moment() returns an object, but plant.nextWaterDate is a JS Date.
// Convert a moment() object into a JS Date by wrapping it in new Date();
// note: JS Date months are 0-indexed, so January is 00, etc.

describe('Plant watering schedule', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);

  describe('calculateNextWaterDate', function () {
    test('should correctly add 1 days', function () {
      var testPlant = new _plant2.default();
      testPlant.lastWaterDate = (0, _moment2.default)('2018-01-01').startOf('day');
      testPlant.waterInterval = 1;
      var testWaterDate = new Date((0, _moment2.default)('2018-01-02').startOf('day'));
      expect(testPlant.calculateNextWaterDate().nextWaterDate).toEqual(testWaterDate);
    });
    test('should correctly add 3 days', function () {
      var testPlant = new _plant2.default();
      testPlant.lastWaterDate = (0, _moment2.default)('2018-01-01').startOf('day');
      testPlant.waterInterval = 3;
      var testWaterDate = new Date((0, _moment2.default)('2018-01-04').startOf('day'));
      expect(testPlant.calculateNextWaterDate().nextWaterDate).toEqual(testWaterDate);
    });
    test('should correctly add 35 days', function () {
      var testPlant = new _plant2.default();
      testPlant.lastWaterDate = (0, _moment2.default)('2018-07-01').startOf('day');
      testPlant.waterInterval = 35;
      var testWaterDate = new Date((0, _moment2.default)('2018-08-05').startOf('day'));
      expect(testPlant.calculateNextWaterDate().nextWaterDate).toEqual(testWaterDate);
    });
    test('should correctly add 365 days', function () {
      var testPlant = new _plant2.default();
      testPlant.lastWaterDate = (0, _moment2.default)('2018-07-01').startOf('day');
      testPlant.waterInterval = 365;
      var testWaterDate = new Date((0, _moment2.default)('2019-07-01').startOf('day'));
      expect(testPlant.calculateNextWaterDate().nextWaterDate).toEqual(testWaterDate);
    });
  });
  describe('isTimeToWater', function () {
    test('should return true for nextWaterDate dates in the past', function () {
      var testPlant = new _plant2.default();
      testPlant.nextWaterDate = (0, _moment2.default)('2018-01-01');
      expect(testPlant.isTimeToWater()).toEqual(true);
    });
    test('should return false for nextWaterDate dates in the future', function () {
      var testPlant = new _plant2.default();
      testPlant.nextWaterDate = (0, _moment2.default)('3018-01-01');
      expect(testPlant.isTimeToWater()).toEqual(false);
    });
  });
});