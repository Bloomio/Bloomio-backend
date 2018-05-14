'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createPlantMock, removePlantMock } from './lib/plant-mock';

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
                expect(response.status).toEqual(200);
                expect(response.body._id).toBeTruthy();
                // expect(response.body.url).toBeTruthy();
              });
          })
          .catch((error) => {
            expect(error.status).toEqual(200);
          });
      });
    });
  });
});
