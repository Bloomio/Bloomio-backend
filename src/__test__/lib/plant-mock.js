'use strict';

import faker from 'faker';
import { createProfileMock } from '../lib/profile-mock';
import Plant from '../../model/plant';
import Account from '../../model/account';

const createPlantMock = () => {
  const resultMock = {};
  return createProfileMock()
    .then((mockProfile) => {
      resultMock.profileMock = mockProfile;

      return new Plant({
        plantNickname: faker.lorem.words(2),
        commonName: faker.lorem.words(2),
        scientificName: faker.lorem.words(2),
        groupType: faker.lorem.words(2),
        placement: faker.lorem.words(2),
        waterDate: faker.lorem.words(2),
        // waterDate: faker.lorem.words(2),
        profile: resultMock.profileMock.profile._id,
        // profile: resultMock.profileMock.account,
        // createdOn: 2018-05-15,
      }).save();
    })
    .then((plant) => {
      resultMock.plant = plant;
      return resultMock;
    });
};

const removePlantMock = () => Promise.all([Account.remove({}), Plant.remove({})]);

export { createPlantMock, removePlantMock };
