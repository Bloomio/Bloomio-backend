'use strict';

import superagent from 'superagent';
import logger from '../lib/logger';
import { startServer, stopServer } from '../lib/server';
import { createPlantMock, removePlantMock } from './lib/plant-mock';
import { createProfileMock, removeProfileMock } from './lib/profile-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('PLANT SCHEMA', () => {
  beforeAll(startServer);
  afterEach(removeProfileMock);
  afterEach(removePlantMock);
  afterAll(stopServer);

  describe('POST /plants', () => {
    test('POST - should return a 200 status code for a successful post.', () => {
      return createProfileMock()
        .then((responseMock) => {
          const { token } = responseMock.accountSetMock;
          return superagent.post(`${apiURL}/plants`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              commonName: 'Geranium',
              placement: 'indoors',
            })
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body._id).toBeTruthy();
              expect(response.body.commonName).toEqual('Geranium');
              expect(response.body.placement).toEqual('indoors');
            });
        })
        .catch((error) => {
          expect(error.status).toEqual(200);
        });
    });
    test('POST - should return a 409 status code for duplicate key.', () => {
      return createPlantMock()
        .then((responseMock) => {
          const { token } = responseMock.profileMock.accountSetMock;
          return superagent.post(`${apiURL}/plants`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              _id: responseMock.plant._id,
              commonName: 'Geranium',
              placement: 'indoors',
            })
            .then(Promise.reject)
            .catch((error) => {
              expect(error.status).toEqual(409);
            });
        });
    });
    test('POST - should return a 400 status code for a bad request.', () => {
      return createProfileMock()
        .then((responseMock) => {
          const { token } = responseMock.accountSetMock;
          return superagent.post(`${apiURL}/plants`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              placement: 'indoors',
            })
            .then(Promise.reject)
            .catch((err) => {
              expect(err.status).toEqual(400);
            });
        });
    });
    test('POST - should return a 400 status code when no token given.', () => {
      return createProfileMock()
        .then(() => {
          return superagent.post(`${apiURL}/plants`)
            .set('Authorization', 'Bearer ')
            .send({
              commonName: 'Geranium',
              placement: 'indoors',
            })
            .then(Promise.reject)
            .catch((response) => {
              expect(response.status).toEqual(400);
            });
        });
    });
  });

  describe('GET /plants/:id', () => {
    test('GET - should return a 200 status code and the specified plant.', () => {
      let plantTest = null;
      return createPlantMock()
        .then((plant) => {
          plantTest = plant;
          return superagent.get(`${apiURL}/plants/${plantTest.accountSetMock.plant._id}`)
            .set('Authorization', `Bearer ${plantTest.profileMock.accountSetMock.token}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });
    test('GET - should return a 400 status code for no id.', () => {
      return createPlantMock()
        .then(() => {
          return superagent.post(`${apiURL}/plants/`);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
    test('GET - should return a 404 status code for a missing token.', () => {
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

  describe('DELETE /plants/:id', () => {
    test('DELETE - should return a 204 status code if plant successfully deleted.', () => {
      return createPlantMock()
        .then((plantMock) => {
          return superagent.delete(`${apiURL}/plants/${plantMock.plant._id}`)
            .set('Authorization', `Bearer ${plantMock.profileMock.accountSetMock.token}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
    test('DELETE - should return a 404 status code if no plant exists.', () => {
      return superagent.delete(`${apiURL}/plants/wrongId`)
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(404);
        });
    });
    test('DELETE - should return a 401 status code for a bad token.', () => {
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
