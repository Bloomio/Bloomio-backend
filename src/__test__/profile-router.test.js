'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createAccountMock } from './lib/account-mock';
import { removeProfileMock } from './lib/profile-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('POST /profiles', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeProfileMock);

  test('POST /profiles should get a 200 and the newly created profile.', () => {
    let accountMock = null;
    return createAccountMock()
      .then((accountSetMock) => {
        accountMock = accountSetMock;
        return superagent.post(`${apiURL}/profiles`)
          .set('Authorization', `Bearer ${accountSetMock.token}`)
          .send({
            firstName: 'Dan',
            birthdate: '06/01/1990',
            quote: 'random quote.',
          });
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountMock.account._id.toString());
        expect(response.body.firstName).toEqual('Dan');
        expect(/^1990-06-01/.test(response.body.birthdate)).toBeTruthy();
        expect(response.body.quote).toEqual('random quote.');
      });
  });
  test('POST /profiles should return a 400 status code if there were missing required values.', () => {
    return createAccountMock()
      .then((accountSetMock) => {
        return superagent.post(`${apiURL}/profiles`)
          .set('Authorization', `Bearer ${accountSetMock.token}`)
          .send({
            birthdate: '06/01/1990',
            quote: 'random quote.',
          });
      })
      .then(Promise.reject)
      .catch((error) => {
        expect(error.status).toEqual(400);
      });
  });
});

