'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createAccountMock } from './lib/account-mock';
import { removeProfileMock } from './lib/profile-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('POST /profile', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeProfileMock);

  test('POST /profile should get a 200 and the newly created profile.', () => {
    let accountMock = null;
    return createAccountMock()
      .then((accountSetMock) => {
        accountMock = accountSetMock;
        return superagent.post(`${apiURL}/profile`)
          .set('Authorization', `Bearer ${accountMock.token}`)
          .send({
            firstName: 'Dan',
            location: 'Seattle',
          });
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountMock.account._id.toString());
        expect(response.body.firstName).toEqual('Dan');
        expect(response.body.location).toEqual('Seattle');
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
            location: 'Seattle',
          });
      })
      .then(Promise.reject)
      .catch((error) => {
        expect(error.status).toEqual(401);
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
            location: 'Seattle',
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
                location: 'Seattle',
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

