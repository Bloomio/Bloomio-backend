'use strict';

import moment from 'moment';
import { startServer, stopServer } from '../lib/server';
import Plant from '../model/plant';

function calculateNextWaterDate(plant) {
  plant.nextWaterDate = moment(plant.lastWaterDate).add(plant.waterInterval, 'days');
  return plant;
}

function isTimeToWater(plant) {
  const currentTime = moment();
  if (currentTime >= plant.nextWaterDate) {
    return true;
  } return false;
}

describe('Plant watering schedule', () => {
  beforeAll(startServer);
  afterAll(stopServer);

  describe('calculateNextWaterDate', () => {
    // test('should add waterInterval to lastWaterDate', () => {
    //   const testPlant = new Plant();
    //   testPlant.lastWaterDate = moment('2018-01-01');
    //   testPlant.waterInterval = 1;
    //   const testWaterDate = moment('2018-01-01');
    //   expect(calculateNextWaterDate(testPlant).nextWaterDate).toEqual(testWaterDate);
      // console.log(testPlant);
      // console.log(isTimeToWater(testPlant));
  //  });
  });
  describe('isTimeToWater', () => {
    test('should return true for nextWaterDate dates in the past', () => {
      const testPlant = new Plant();
      testPlant.nextWaterDate = moment('2018-01-01');
      expect(isTimeToWater(testPlant)).toEqual(true);
    });
    test('should return false for nextWaterDate dates in the future', () => {
      const testPlant = new Plant();
      testPlant.nextWaterDate = moment('3018-01-01');
      expect(isTimeToWater(testPlant)).toEqual(false);
    });
  });
});

