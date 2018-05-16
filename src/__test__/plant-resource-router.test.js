'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
// import { createPlantMock, removePlantMock } from './lib/plant-mock';
// import { createProfileMock, removeProfileMock } from './lib/profile-mock';
import { createAdminMock, removeAdminMock } from './lib/admin-mock';
import { createPlantResourceMock, removePlantResourceMock } from './lib/plant-resource-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('PLANT-RESOURCE SCHEMA', () => {
  beforeAll(startServer);
  // afterEach(removeProfileMock);
  afterEach(removeAdminMock);
  // afterEach(removePlantMock);
  // afterEach(removePlantResourceMock);
  afterAll(stopServer);

  describe('POST /entry', () => {
    test('POST - should return a 200 status code for a successful post.', () => {
      return createAdminMock()
        .then((responseMock) => {
          console.log('responseMOCK', responseMock.accountSetMock);
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
  });
  // test('POST - should return a 409 status code for duplicate key.', () => {
  //   return createPlantMock()
  //     .then((responseMock) => {
  //       const { token } = responseMock.profileMock.accountSetMock;
  //       return superagent.post(`${apiURL}/plants`)
  //         .set('Authorization', `Bearer ${token}`)
  //         .send({
  //           _id: responseMock.plant._id,
  //           commonName: 'Geranium',
  //           placement: 'indoors',
  //         })
  //         .then(Promise.reject)
  //         .catch((error) => {
  //           expect(error.status).toEqual(409);
  //         });
  //     });
  // });
  // test('POST - should return a 400 status code for a bad request.', () => {
  //   return createProfileMock()
  //     .then((responseMock) => {
  //       const { token } = responseMock.accountSetMock;
  //       return superagent.post(`${apiURL}/plants`)
  //         .set('Authorization', `Bearer ${token}`)
  //         .send({
  //           placement: 'indoors',
  //         })
  //         .then(Promise.reject)
  //         .catch((err) => {
  //           expect(err.status).toEqual(400);
  //         });
  //     });
  // });
  // test('POST - should return a 400 status code when no token given.', () => {
  //   return createProfileMock()
  //     .then(() => {
  //       return superagent.post(`${apiURL}/plants`)
  //         .set('Authorization', 'Bearer ')
  //         .send({
  //           commonName: 'Geranium',
  //           placement: 'indoors',
  //         })
  //         .then(Promise.reject)
  //         .catch((response) => {
  //           expect(response.status).toEqual(400);
  //         });
  //     });
  // });
  // });

  describe('GET /plants/:id', () => {
    test('GET - should return a 200 status code and the specified plant.', () => {
      let plantTemplateTest = null;
      return createAdminMock();
        .then() createPlantResourceMock()
        .then((plantTemplate) => {
          console.log(plantTemplateTest.account._id);
          plantTemplateTest = plantTemplate;
          return superagent.get(`${apiURL}/plants/${plantTemplateTest.account._id}`)
            .set('Authorization', `Bearer ${plantTemplateTest.accountSetMock.token}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.commonName).toBeTruthy();
          expect(response.body.placement).toBeTruthy();
          expect(response.body.plantNickname).toBeTruthy();
        });
    });
  });
});


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

// describe('PUT /plants/:id', () => {
//   test('PUT - should return a 200 status code if plant is successfully updated', () => {
//     return createPlantMock()
//       .then((plantToUpdate) => {
//         return superagent.put(`${apiURL}/plants/${plantToUpdate.plant._id}`)
//           .set('Authorization', `Bearer ${plantToUpdate.profileMock.accountSetMock.token}`)
//           .send({
//             plantNickname: 'Gary',
//           });
//       })
//       .then((response) => {
//         expect(response.status).toEqual(200);
//         expect(response.body.plantNickname).toEqual('Gary');
//       });
//   });
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
// });
