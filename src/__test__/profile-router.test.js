'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createAccountMock } from './lib/account-mock';
import { removeProfileMock, createProfileMock } from './lib/profile-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('POST /profile', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeProfileMock);

  test('POST /profile should return a 200 and the newly created profile.', () => {
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
  test('POST /profile should return a 400 status code if there were missing required values.', () => {
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
  test('POST /profile should return a 401 for an invalid token.', () => {
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
  test('POST /profile should return a 404 for a bad route.', () => {
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
  test('POST /profile should return a 409 status code if there are duplicate unique key values.', () => {
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

  describe('GET /profile', () => { //eslint-disable-line
    test('#GET, should return a 200 status code and the newly created profile.', () => {
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
  });
});

