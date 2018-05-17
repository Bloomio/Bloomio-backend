'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createPlantMock, removePlantMock } from './lib/plant-mock';
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
    jest.setTimeout(10000);
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
          console.log('RESPONSEMOCK', responseMock.accountSetMock);
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
  // describe('GET /plants/:id', () => {
  //   test('GET - should return a 200 status code and the specified plant.', () => {
  //     let plantTest = null;
  //     return createPlantMock()
  //       .then((plant) => {
  //         plantTest = plant;
  //         return superagent.get(`${apiURL}/plants/${plantTest.plant._id}`)
  //           .set('Authorization', `Bearer ${plantTest.profileMock.accountSetMock.token}`);
  //       })
  //       .then((response) => {
  //         expect(response.status).toEqual(200);
  //         expect(response.body.commonName).toBeTruthy();
  //         expect(response.body.placement).toBeTruthy();
  //         expect(response.body.plantNickname).toBeTruthy();
  //       });
  //   });
  //   test('GET - should return a 400 status code for no id.', () => {
  //     return createPlantMock()
  //       .then(() => {
  //         return superagent.post(`${apiURL}/plants/`);
  //       })
  //       .then(Promise.reject)
  //       .catch((err) => {
  //         expect(err.status).toEqual(400);
  //       });
  //   });
  //   test('GET - should return a 404 status code for a missing token.', () => {
  //     return createPlantMock()
  //       .then((plant) => {
  //         return superagent.post(`${apiURL}/pictures/${plant.plant._id}`)
  //           .set('Authorization', 'Bearer ');
  //       })
  //       .then(Promise.reject)
  //       .catch((err) => {
  //         expect(err.status).toEqual(404);
  //       });
  //   });
  // });
                      
  // describe('DELETE /plants/:id', () => {
  //   test('DELETE - should return a 204 status code if plant successfully deleted.', () => {
  //     return createPlantMock()
  //       .then((plantMock) => {
  //         return superagent.delete(`${apiURL}/plants/${plantMock.plant._id}`)
  //           .set('Authorization', `Bearer ${plantMock.profileMock.accountSetMock.token}`);
  //       })
  //       .then((response) => {
  //         expect(response.status).toEqual(204);
  //       });
  //   });
  //   test('DELETE - should return a 400 status code if no token is passed.', () => {
  //     return createPlantMock()
  //       .then((plantMock) => {
  //         return superagent.delete(`${apiURL}/plants/${plantMock.plant._id}`);
  //       })
  //       .then(Promise.reject)
  //       .catch((error) => {
  //         expect(error.status).toEqual(400);
  //       });
  //   });
  //   test('DELETE - should return a 401 status code if invalid token is passed.', () => {
  //     return createPlantMock()
  //       .then((plantMock) => {
  //         return superagent.delete(`${apiURL}/plants/${plantMock.plant._id}`)
  //           .set('Authorization', 'Bearer invalidToken');
  //       })
  //       .then(Promise.reject)
  //       .catch((error) => {
  //         expect(error.status).toEqual(401);
  //       });
  //   });
  // });
                                          
  describe('PUT /resource/:id', () => {
    test('PUT - should return a 200 status code if the plant resource is successfully updated', () => {
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
      return createPlantResourceMock()
        .then((plantResourceToUpdate) => {
          const { token } = responseMock.accountSetMock;
          return superagent.put(`${apiURL}/entry`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              commonName: 'Test',
            });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.commonName).toEqual('Test');
        });
    });
  });
});
//   test('PUT - should return a 400 status code for no token being passed', () => {
//     return createPlantMock()
//       .then((plantToUpdate) => {
//         return superagent.put(`${apiURL}/plants/${plantToUpdate.plant._id}`)
//           .send({
//             plantNickname: 'Vinicio',
//           });
//       })
//       .then(Promise.reject)
//       .catch((error) => {
//         expect(error.status).toEqual(400);
//       });
//   });
// });
