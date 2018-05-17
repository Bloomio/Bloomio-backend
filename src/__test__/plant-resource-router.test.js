'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { removePlantMock } from './lib/plant-mock';
import { createProfileMock, removeProfileMock } from './lib/profile-mock';
import { createAdminMock, removeAdminMock } from './lib/admin-mock';
import { createPlantResourceMock, removePlantResourceMock } from './lib/plant-resource-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('PLANT-RESOURCE SCHEMA', () => {
  beforeAll(startServer);
  afterEach(removeProfileMock);
  afterEach(removeAdminMock);
  afterEach(removePlantMock);
  afterEach(removePlantResourceMock);
  afterAll(stopServer);

  describe('POST /entry', () => {
    jest.setTimeout(20000);
    test('POST - should return a 200 status code for a successful post.', () => {
      return createAdminMock()
        .then((responseMock) => {
          const { token } = responseMock.accountSetMock;
          return superagent.post(`${apiURL}/entry`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              commonName: 'Chinese Money Plant',
              scientificName: 'Pilea peperomioides',
              groupType: 'herb',
              waterDate: 1,
              fertilizerDate: 7,
              mistingDate: 1,
            });
        })
        .then((response) => {
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
    test('POST - should return a 400 status code for a bad request.', () => {
      return createAdminMock()
        .then((responseMock) => {
          const { token } = responseMock.accountSetMock;
          return superagent.post(`${apiURL}/entry`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              commonName: 'Bromeliad',
            })
            .then(Promise.reject)
            .catch((error) => {
              expect(error.status).toEqual(400);
            });
        });
    });
    test('POST - should return a 401 status code when no token given.', () => {
      return createAdminMock()
        .then(() => {
          return superagent.post(`${apiURL}/entry`)
            .set('Authorization', 'Bearer badToken')
            .send({
              commonName: 'Coffee Plant',
              scientificName: 'coffea',
              groupType: 'shrub',
              waterDate: 2,
              fertilizerDate: 7,
              mistingDate: 4,
            })
            .then(Promise.reject)
            .catch((error) => {
              expect(error.status).toEqual(401);
            });
        });
    });
    test('POST - should return a 401 status code if user did not have admin access.', () => {
      return createProfileMock()
        .then((responseMock) => {
          const { token } = responseMock.accountSetMock;
          return superagent.post(`${apiURL}/entry`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              commonName: 'Bird of Paradise',
              scientificName: 'Strelitzia reginae',
              groupType: 'shrub',
              waterDate: 4,
              fertilizerDate: 7,
              mistingDate: 10,
            });
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(401);
        });
    });
  });                               

  describe('GET /entry/:id', () => {
    test('GET - should return a 200 status code and the specified plant template.', () => {
      let plantTemplateTest = null;
      return createPlantResourceMock()
        .then((plantTemplate) => {
          plantTemplateTest = plantTemplate;
          return superagent.get(`${apiURL}/entry/${plantTemplateTest.plantResource._id}`);
        /* .set('Authorization', `Bearer ${plantTemplateTest.accountSetMock.token}`); */
        })
        .then((response) => {
          expect(response.status).toEqual(200);
        });
    });
    test('GET - should return a 400 status code for no id.', () => {
      return createPlantResourceMock()
        .then(() => {
          return superagent.post(`${apiURL}/entry/`);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
    test('GET - should return a 404 status code for bad id.', () => {
      return createPlantResourceMock()
        .then(() => {
          return superagent.post(`${apiURL}/entry/badId`);
        })
        .catch((err) => {
          expect(err.status).toEqual(404);
        });
    });
  });
});
