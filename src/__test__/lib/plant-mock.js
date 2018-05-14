'use strict';

import faker from 'faker';
import { createAccountMock } from '../lib/account-mock';
import Plant from '../../model/plant';
import Account from '../../model/account';

const createPlantMock = () => {
  const resultMock = {};
  return createAccountMock()
    .then((mockAccount) => {
      resultMock.accountMock = mockAccount;

      return new Plant({
        plantNickname: faker.lorem.words(2),
        commonName: faker.lorem.words(2),
        scientificName: faker.lorem.words(2),
        groupType: faker.lorem.words(2),
        placement: faker.lorem.words(2),
        // waterDate: faker.lorem.words(2),
        // waterDate: faker.lorem.words(2),
        profile: resultMock.accountMock.profile._id,
      }).save();
    })
    .then((plant) => {
      resultMock.plant = plant;
      return resultMock;
    });
};

const removePlantMock = () => Promise.all([Account.remove({}), Plant.remove({})]);

export { createPlantMock, removePlantMock };
