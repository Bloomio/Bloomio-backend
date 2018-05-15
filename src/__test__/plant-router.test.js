'use strict';

import faker from 'faker';
import superagent from 'superagent';
import logger from '../lib/logger';
import { startServer, stopServer } from '../lib/server';
import { createPlantMock, removePlantMock } from './lib/plant-mock';
import { createProfileMock } from './lib/profile-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('TESTING ROUTES At /plants', () => {
  beforeAll(startServer);
  afterEach(removePlantMock);
  afterAll(stopServer);

  describe('POST /plants', () => {
    describe('POST 200 for successful post to /plants', () => {
      test('should return 200', () => {
        return createPlantMock()
          .then((mockResponse) => {
            console.log(mockResponse);
            const { token } = mockResponse.accountMock;
            return superagent.post(`${apiURL}/plants`)
              .set('Authorization', `Bearer ${token}`)
              .send(mockResponse)
              .then((response) => {
                expect(response.status).toEqual(400);
                expect(response.body._id).toBeTruthy();
                // expect(response.body.url).toBeTruthy();
              });
          })
          .catch((error) => {
            expect(error.status).toEqual(200);
          });
      });
    });

    test('POST /plants should return a 400 status code for bad request', () => {
      return createPlantMock()
        .then(() => {
          return superagent.post(`${apiURL}/plants`)
            .send({});
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });

    test('should return 401 when no token given', () => {
      return createPlantMock()
        .then(() => {
          return superagent.post(`${apiURL}/plants`)
            .set('Authorization', 'Bearer ')
            .send({});
        })
        .then(Promise.reject)

        .catch((response) => { 
          expect(response.status).toEqual(401);
        });
    });
  });
  describe('GET 200 for successful get to /plants/:id', () => {
    test(' should return 200', () => { // this test working
      let plantTest = null;
      return createProfileMock()
        .then((plant) => {
          // console.log('HEREEEE!', plantTest.plant._id);
          plantTest = plant;
          console.log('HERE', plantTest.profileMock.accountSetMock.token);
          return superagent.get(`${apiURL}/plants/${plantTest.plant._id}`)
            .set('Authorization', `Bearer ${plantTest.accountSetMock.token}`)
            .send({
              plantNickname: faker.lorem.words(2),
              commonName: faker.lorem.words(2),
              scientificName: faker.lorem.words(2),
              groupType: faker.lorem.words(2),
              placement: faker.lorem.words(2),
              waterDate: faker.lorem.words(2)  
            });
        })
        .then((response) => {
          console.log(response);
          expect(response.status).toEqual(700);
          expect(response.body.token).toBeTruthy();
        })
        .catch((err) => {
          logger.log(logger.ERROR, err);
        });
    });

    test('GET /plants should return a 400 status code for no id', () => {
      let plantTest = null;
      return createPlantMock()
        .then((plant) => {
          console.log('HEREEEE!', plantTest);
          plantTest = plant;
          return superagent.get(`${apiURL}/plants/`)
            .set('Authorization', `Bearer ${plantTest.plant.token}`);
        })
        // .then(() => {
        //   return superagent.post(`${apiURL}/plants/`);
        // })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });

    test('GET /plants should return a 404 status code for missing token', () => {
      return createPlantMock()
        .then((plant) => {
          return superagent.post(`${apiURL}/pictures/${plant.plant._id}`)
            .set('Authorization', 'Bearer ');
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(404);
        });
    });
  });
  describe('DELETE', () => {
    test('DEL /plants/:id should respond with 204 if delete completed', () => {
      return createPlantMock()
        .then((plantMock) => {
          return superagent.delete(`${apiURL}/pictures/${plantMock.plant._id}`)
            .set('Authorization', `Bearer ${plantMock.accountMock.token}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
    test('DEL /plants/:id should respond with 404 if no picture exists', () => {
      return superagent.delete(`${apiURL}/pictures/wrongId`)
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(404);// this test passing
        });
    });
    test('DEL /plants/:id should respond with 401 if bad token', () => {
      return createPlantMock()
        .then((plantMock) => {
          return superagent.delete(`${apiURL}/pictures/${plantMock.plant._id}`)
            .set('Authorization', 'Bearer ');
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(401);
        });
    });
  });
});
