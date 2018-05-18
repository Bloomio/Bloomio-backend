'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createAccountMock } from './lib/account-mock';
import { removeProfileMock, createProfileMock } from './lib/profile-mock';
import { createPlantMock, removePlantMock } from './lib/plant-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('PROFILE SCHEMA', () => {
  beforeAll(startServer);
  afterEach(removeProfileMock);
  afterEach(removePlantMock);
  afterAll(stopServer);
  jest.setTimeout(10000);

  describe('POST /profile', () => {
    test('POST - should return a 200 status code and the newly created profile.', () => {
      let accountMock = null;
      return createAccountMock()
        .then((accountSetMock) => {
          accountMock = accountSetMock;
          return superagent.post(`${apiURL}/profile`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .send({
              firstName: 'Dan',
              location: '98109',
            });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.account).toEqual(accountMock.account._id.toString());
          expect(response.body.firstName).toEqual('Dan');
          expect(response.body.location).toEqual('98109');
        });
    });
    test('POST - should return a 400 status code if there were missing required values.', () => {
      return createAccountMock()
        .then((accountSetMock) => {
          return superagent.post(`${apiURL}/profile`)
            .set('Authorization', `Bearer ${accountSetMock.token}`)
            .send({
              firstName: 'David',
            });
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(400);
        });
    });
    test('POST - should return a 401 for an invalid token.', () => {
      return createAccountMock()
        .then(() => {
          return superagent.post(`${apiURL}/profile`)
            .set('Authorization', 'Bearer INVALIDTOKEN')
            .send({
              firstName: 'Joanna',
              location: '98109',
            });
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(401);
        });
    });
    test('POST - should return a 404 for a bad route.', () => {
      let accountMock = null;
      return createAccountMock()
        .then((accountSetMock) => {
          accountMock = accountSetMock;
          return superagent.post(`${apiURL}/badroute`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .send({
              firstName: 'John',
              location: '98109',
            });
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(404);
        });
    });
    test('POST - should return a 409 status code if there are duplicate unique key values.', () => {
      const mockGoogleID = 'daveyjones@google.com';
      return createAccountMock()
        .then((accountSetMock) => {
          return superagent.post(`${apiURL}/profile`)
            .set('Authorization', `Bearer ${accountSetMock.token}`)
            .send({
              firstName: 'David',
              location: '98109',
              googleID: mockGoogleID,
            });
        })
        .then(() => {
          return createAccountMock()
            .then((accountSetMock) => {
              return superagent.post(`${apiURL}/profile`)
                .set('Authorization', `Bearer ${accountSetMock.token}`)
                .send({
                  firstName: 'Jen',
                  location: '98109',
                  googleID: mockGoogleID,
                });
            });
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(409);
        });
    });
  });

  describe('GET ROUTES', () => {
    describe('GET /profile', () => { 
      test('GET - should return a 200 status code and the newly created profile.', () => {
        let profileMock = null;
        return createProfileMock()
          .then((profileSetMock) => {
            profileMock = profileSetMock;
            return superagent.get(`${apiURL}/profile/${profileMock.profile._id}`)
              .set('Authorization', `Bearer ${profileMock.accountSetMock.token}`)
              .then((response) => {
                expect(response.status).toEqual(200);
              });
          });
      });
      test('GET - should return a 400 for no token being passed.', () => {
        let profileMock = null;
        return createProfileMock()
          .then((profileSetMock) => {
            profileMock = profileSetMock;
            return superagent.get(`${apiURL}/profile/${profileMock.profile._id}`)
              .then(Promise.reject)
              .catch((error) => {
                expect(error.status).toEqual(400);
              });
          });
      });
      test('GET - should return a 401 for an invalid token.', () => {
        let profileMock = null;
        return createProfileMock()
          .then((profileSetMock) => {
            profileMock = profileSetMock;
            return superagent.get(`${apiURL}/profile/${profileMock.profile._id}`)
              .set('Authorization', 'Bearer invalidToken')
              .then(Promise.reject)
              .catch((error) => {
                expect(error.status).toEqual(401);
              });
          });
      });
      test('GET - should return a 404 for an invalid id', () => {
        let profileMock = null;
        return createProfileMock()
          .then((profileSetMock) => {
            profileMock = profileSetMock;
            return superagent.get(`${apiURL}/profile/badID`)
              .set('Authorization', `Bearer ${profileMock.accountSetMock.token}`)
              .then(Promise.reject)
              .catch((error) => {
                expect(error.status).toEqual(404);
              });
          });
      });
    });
    test('GET - should return a 200 and the planterbox collection from a user.', () => {
      let collectionMock = null;
      return createPlantMock()
        .then((plantSetMock) => {
          collectionMock = plantSetMock;
          return superagent.get(`${apiURL}/profile/${collectionMock.profileMock.profile._id}/planterbox`)
            .set('Authorization', `Bearer ${collectionMock.profileMock.accountSetMock.token}`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(Array.isArray(response.body)).toBeTruthy();
            });
        });
    });
    test('GET - should return a 200 status code and the each plant that needs to be watered.', () => {
      const resultMock = {};
      return createProfileMock()
        .then((responseMock) => {
          resultMock.responseMock = responseMock;
          const { token } = responseMock.accountSetMock;
          return superagent.post(`${apiURL}/plants`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              commonName: 'Geranium',
              placement: 'indoors',
              waterInterval: 1,
            })
            .then(() => {
              return superagent.post(`${apiURL}/plants`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                  commonName: 'Fern',
                  placement: 'indoors',
                  waterInterval: 1,
                })
                .then(() => {
                  return superagent.get(`${apiURL}/profile/${resultMock.responseMock.profile._id}/needswater`)
                    .set('Authorization', `Bearer ${token}`)
                    .then((response) => {
                      expect(response.status).toEqual(200);
                      expect(response.body).toEqual('You have no plants that need watering today.');
                    });
                });
            });
        });
    });
  });
    
  describe('PUT /profile', () => {
    test('PUT - should return a 200 status code if successful.', () => {
      let profileToUpdate = null;
      return createProfileMock()
        .then((profile) => {
          profileToUpdate = profile;
          return superagent.put(`${apiURL}/profile/${profileToUpdate.profile._id}`)
            .set('Authorization', `Bearer ${profileToUpdate.accountSetMock.token}`)
            .send({
              firstName: 'test',
            });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toEqual(profileToUpdate.profile._id.toString());
          expect(response.body.firstName).toEqual('test');
        });
    });
    test('PUT - should return a 200 status code if sucessfully updated profile avatar', () => {
      let profileToUpdate = null;
      return createProfileMock()
        .then((profile) => {
          profileToUpdate = profile;
          return superagent.put(`${apiURL}/profile/${profileToUpdate.profile._id}/avatar`)
            .set('Authorization', `Bearer ${profileToUpdate.accountSetMock.token}`)
            .attach('pic', `${__dirname}/../assets/dog.jpg`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body._id).toEqual(profileToUpdate.profile._id.toString());
            });
        });
    });
    test('PUT - should return a 400 status code for no token being passed.', () => {
      let profileToUpdate = null;
      return createProfileMock()
        .then((profile) => {
          profileToUpdate = profile;
          return superagent.put(`${apiURL}/profile/${profileToUpdate.profile._id}`)
            .send({
              firstName: 'test',
            });
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(400);
        });
    });
    test('PUT - should return a 401 status code for an invalid token being passed.', () => {
      let profileToUpdate = null;
      return createProfileMock()
        .then((profile) => {
          profileToUpdate = profile;
          return superagent.put(`${apiURL}/profile/${profileToUpdate.profile._id}`)
            .set('Authorization', 'Bearer invalidToken')
            .send({
              firstName: 'test',
            });
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(401);
        });
    });
    test('PUT - should return a 404 status code for a bad id being passed.', () => {
      let profileToUpdate = null;
      return createProfileMock()
        .then((profile) => {
          profileToUpdate = profile;
          return superagent.put(`${apiURL}/profile/badID`)
            .set('Authorization', `Bearer ${profileToUpdate.accountSetMock.token}`)
            .send({
              firstName: 'test',
            });
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(404);
        });
    });
    test('PUT - should return a 409 status code for duplicate unique keys.', () => {
      let dummyProfile = null;
      let profileToUpdate = null;
      return createAccountMock()
        .then((profile) => {
          dummyProfile = profile;
          return superagent.post(`${apiURL}/profile`)
            .set('Authorization', `Bearer ${dummyProfile.token}`)
            .send({
              firstName: 'Dan',
              location: '98109',
              googleID: 'dan@google.com',
            });
        })
        .then(() => {
          return createProfileMock()
            .then((profile2) => {
              profileToUpdate = profile2;
              return superagent.put(`${apiURL}/profile/${profileToUpdate.profile._id}`)
                .set('Authorization', `Bearer ${profileToUpdate.accountSetMock.token}`)
                .send({ googleID: 'dan@google.com' });
            })
            .then(Promise.reject)
            .catch((error) => {
              expect(error.status).toEqual(409);
            });
        });
    });
  });

  describe('DELETE /profile', () => {
    test('DELETE - Should return 204 for deleted profile', () => {
      let deleteProfileMock = null;
      return createProfileMock()
        .then((profileToDelete) => {
          deleteProfileMock = profileToDelete;
          return superagent.delete(`${apiURL}/profile/${deleteProfileMock.profile._id}`)
            .set('Authorization', `Bearer ${deleteProfileMock.accountSetMock.token}`)
            .then((response) => {
              expect(response.status).toEqual(204);
            });
        });
    });
    test('DELETE - should return 400 if no account exists', () => {
      return superagent.delete(`${apiURL}/profile/InvalidID`)
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(400);
        });
    });
  });
});
