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
  jest.setTimeout(20000);

  describe('POST /bloomiogarden', () => {
    test('POST - should return a 200 status code for a successful post.', () => {
      return createAdminMock()
        .then((responseMock) => {
          const { token } = responseMock.accountSetMock;
          return superagent.post(`${apiURL}/bloomiogarden`)
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
          return superagent.post(`${apiURL}/bloomiogarden`)
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
          return superagent.post(`${apiURL}/bloomiogarden`)
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
          return superagent.post(`${apiURL}/bloomiogarden`)
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

  describe('GET /bloomiogarden/:id', () => {
    test('GET - should return a 200 status code and the specified plant template.', () => {
      let plantTemplateTest = null;
      return createPlantResourceMock()
        .then((plantTemplate) => {
          plantTemplateTest = plantTemplate;
          return superagent.get(`${apiURL}/bloomiogarden/${plantTemplateTest.plantResource._id}`);
        /* .set('Authorization', `Bearer ${plantTemplateTest.accountSetMock.token}`); */
        })
        .then((response) => {
          expect(response.status).toEqual(200);
        });
    });
    test('GET - should return a 400 status code for no id.', () => {
      return createPlantResourceMock()
        .then(() => {
          return superagent.post(`${apiURL}/bloomiogarden/`);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
    test('GET - should return a 404 status code for bad id.', () => {
      return createPlantResourceMock()
        .then(() => {
          return superagent.post(`${apiURL}/bloomiogarden/badId`);
        })
        .catch((err) => {
          expect(err.status).toEqual(404);
        });
    });
  });

  describe('PUT /bloomiogarden', () => {
    test('PUT - should return a 200 status code and the updated plant-resource.', () => {
      const resultMock = {};
      return createAdminMock()
        .then((responseMock) => {
          const { token } = responseMock.accountSetMock;
          resultMock.token = token;
          return superagent.post(`${apiURL}/bloomiogarden`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              commonName: 'Tomato',
              scientificName: 'Solanum Iycopersicum',
              groupType: 'vegetable',
              waterDate: 1,
              fertilizerDate: 7,
              mistingDate: 10,
            })
            .then((postedPlantResource) => {
              resultMock.postedPlantResource = postedPlantResource.body;
              return superagent.put(`${apiURL}/bloomiogarden/${postedPlantResource.body._id}`)
                .set('Authorization', `Bearer ${resultMock.token}`)
                .send({
                  commonName: 'testTomato',
                })
                .then((response) => {
                  expect(response.status).toEqual(200);
                  expect(response.body.commonName).toEqual('testTomato');
                });
            });
        });
    });
    test('PUT - should return a 401 status code if user did not have admin access.', () => {
      const resultMock = {};
      return createAdminMock()
        .then((responseMock) => {
          const { token } = responseMock.accountSetMock;
          resultMock.token = token;
          return superagent.post(`${apiURL}/bloomiogarden`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              commonName: 'Bush Violet',
              scientificName: 'Browalia',
              groupType: 'shrub',
              waterDate: 1,
              fertilizerDate: 7,
              mistingDate: 4,
            })
            .then((postedPlantResource) => {
              resultMock.postedPlantResource = postedPlantResource.body;
              return createProfileMock()
                .then((secondResponseMock) => {
                  const { userToken } = secondResponseMock.accountSetMock;
                  return superagent.put(`${apiURL}/bloomiogarden/${resultMock.postedPlantResource._id}`)
                    .set('Authorization', `Bearer ${userToken}`)
                    .send({
                      waterDate: 'every day',
                    })
                    .then(Promise.reject)
                    .catch((error) => {
                      expect(error.status).toEqual(401);
                    });
                });
            });
        });
    });
    test('PUT - should return a 404 status code for a bad address.', () => {
      const resultMock = {};
      return createAdminMock()
        .then((responseMock) => {
          const { token } = responseMock.accountSetMock;
          resultMock.token = token;
          return superagent.post(`${apiURL}/bloomiogarden`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              commonName: 'Cat Grass',
              scientificName: 'Cyperus involucratus Zumula',
              groupType: 'grass',
              waterDate: 1,
              fertilizerDate: 7,
              mistingDate: 4,
            })
            .then((postedPlantResource) => {
              resultMock.postedPlantResource = postedPlantResource.body;
              return superagent.put(`${apiURL}/bloomiogarden/${postedPlantResource.body._id}badaddress`)
                .set('Authorization', `Bearer ${resultMock.token}`)
                .send({
                  commonName: 'kitty grass',
                })
                .then(Promise.reject)
                .catch((error) => {
                  expect(error.status).toEqual(404);
                });
            });
        });
    });
    test('PUT - should return a 500 status code if reassigned property was the wrong type.', () => {
      const resultMock = {};
      return createAdminMock()
        .then((responseMock) => {
          const { token } = responseMock.accountSetMock;
          resultMock.token = token;
          return superagent.post(`${apiURL}/bloomiogarden`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              commonName: 'Bush Violet',
              scientificName: 'Browalia',
              groupType: 'shrub',
              waterDate: 1,
              fertilizerDate: 7,
              mistingDate: 4,
            })
            .then((postedPlantResource) => {
              resultMock.postedPlantResource = postedPlantResource.body;
              return superagent.put(`${apiURL}/bloomiogarden/${postedPlantResource.body._id}`)
                .set('Authorization', `Bearer ${resultMock.token}`)
                .send({
                  waterDate: 'every day',
                })
                .then(Promise.reject)
                .catch((error) => {
                  expect(error.status).toEqual(500);
                });
            });
        });
    });
  });

  describe('DELETE /bloomiogarden/:id', () => {
    test('DELETE - should return a 204 status code if plant-resource successfully deleted.', () => {
      const resultMock = {};
      return createAdminMock()
        .then((responseMock) => {
          const { token } = responseMock.accountSetMock;
          resultMock.token = token;
          return superagent.post(`${apiURL}/bloomiogarden`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              commonName: 'Chinese Evergreen',
              scientificName: 'Aglaonema pictum',
              groupType: 'shrub',
              waterDate: 1,
              fertilizerDate: 7,
              mistingDate: 5,
            })
            .then((postedPlantResource) => {
              resultMock.postedPlantResource = postedPlantResource.body;
              return superagent.delete(`${apiURL}/bloomiogarden/${postedPlantResource.body._id}`)
                .set('Authorization', `Bearer ${resultMock.token}`)
                .then((response) => {
                  expect(response.status).toEqual(204);
                });
            });
        });
    });
    test('DELETE - should return a 401 status code if user did not have admin access.', () => {
      const resultMock = {};
      return createAdminMock()
        .then((responseMock) => {
          const { token } = responseMock.accountSetMock;
          resultMock.token = token;
          return superagent.post(`${apiURL}/bloomiogarden`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              commonName: 'Coriander',
              scientificName: 'Coriandrum sativum',
              groupType: 'herb',
              waterDate: 3,
              fertilizerDate: 30,
              mistingDate: 30,
            })
            .then((postedPlantResource) => {
              resultMock.postedPlantResource = postedPlantResource.body;
              return createProfileMock()
                .then((secondResponseMock) => {
                  const { userToken } = secondResponseMock.accountSetMock;
                  return superagent.delete(`${apiURL}/bloomiogarden/${resultMock.postedPlantResource._id}`)
                    .set('Authorization', `Bearer ${userToken}`)
                    .then(Promise.reject)
                    .catch((error) => {
                      expect(error.status).toEqual(401);
                    });
                });
            });
        });
    });
    test('DELETE - should return a 404 status code for a bad address.', () => {
      return createAdminMock()
        .then((responseMock) => {
          const { token } = responseMock.accountSetMock;
          return superagent.post(`${apiURL}/bloomiogardebadaddress`)
            .set('Authorization', `Bearer ${token}`);
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(404);
        });
    });
  });
});
