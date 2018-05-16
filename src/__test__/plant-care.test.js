'use strict';

import moment from 'moment';
import { startServer, stopServer } from '../lib/server';
import Plant from '../model/plant';


// moment() returns an object, but plant.nextWaterDate is a JS Date.
// Convert a moment() object into a JS Date by wrapping it in new Date();
// note: JS Date months are 0-indexed, so January is 00, etc.

describe('Plant watering schedule', () => {
  beforeAll(startServer);
  afterAll(stopServer);

  describe('calculateNextWaterDate', () => {
    test('should correctly add 1 days', () => {
      const testPlant = new Plant();
      testPlant.lastWaterDate = moment('2018-01-01').startOf('day');
      testPlant.waterInterval = 1;
      const testWaterDate = new Date(moment('2018-01-02').startOf('day'));
      expect(testPlant.calculateNextWaterDate().nextWaterDate).toEqual(testWaterDate);
    });
    test('should correctly add 3 days', () => {
      const testPlant = new Plant();
      testPlant.lastWaterDate = moment('2018-01-01').startOf('day');
      testPlant.waterInterval = 3;
      const testWaterDate = new Date(moment('2018-01-04').startOf('day'));
      expect(testPlant.calculateNextWaterDate().nextWaterDate).toEqual(testWaterDate);
    });
    test('should correctly add 35 days', () => {
      const testPlant = new Plant();
      testPlant.lastWaterDate = moment('2018-07-01').startOf('day');
      testPlant.waterInterval = 35;
      const testWaterDate = new Date(moment('2018-08-05').startOf('day'));
      expect(testPlant.calculateNextWaterDate().nextWaterDate).toEqual(testWaterDate);
    });
    test('should correctly add 365 days', () => {
      const testPlant = new Plant();
      testPlant.lastWaterDate = moment('2018-07-01').startOf('day');
      testPlant.waterInterval = 365;
      const testWaterDate = new Date(moment('2019-07-01').startOf('day'));
      expect(testPlant.calculateNextWaterDate().nextWaterDate).toEqual(testWaterDate);
    });
  });
  describe('isTimeToWater', () => {
    test('should return true for nextWaterDate dates in the past', () => {
      const testPlant = new Plant();
      testPlant.nextWaterDate = moment('2018-01-01');
      expect(testPlant.isTimeToWater()).toEqual(true);
    });
    test('should return false for nextWaterDate dates in the future', () => {
      const testPlant = new Plant();
      testPlant.nextWaterDate = moment('3018-01-01');
      expect(testPlant.isTimeToWater()).toEqual(false);
    });
  });
});
